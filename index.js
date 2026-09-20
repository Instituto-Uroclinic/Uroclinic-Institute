const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const trim = (value, max) => String(value || "").trim().replace(/[<>]/g, "").slice(0, max);
const phoneOK = (value) => /^\+?[0-9 ()-]{8,20}$/.test(value);
const emailOK = (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const publicHttpsURL = (value) => {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" ? url.toString() : null; } catch { return null; }
};

async function shortHash(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].slice(0, 12).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(token, ip, secret) {
  if (!secret) return true;
  if (!token) return false;
  const body = new FormData();
  body.append("secret", secret); body.append("response", token);
  if (ip) body.append("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  return (await response.json()).success === true;
}

async function upsertHighLevel(lead, env) {
  if (!env.GHL_PRIVATE_TOKEN || !env.GHL_LOCATION_ID) return { configured: false };
  const response = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
    method: "POST",
    headers: { authorization: `Bearer ${env.GHL_PRIVATE_TOKEN}`, version: env.GHL_API_VERSION || "2021-07-28", "content-type": "application/json" },
    body: JSON.stringify({ locationId: env.GHL_LOCATION_ID, name: lead.name, phone: lead.phone, email: lead.email || undefined, city: lead.city, source: trim(`Sitio UROCLINIC ${lead.source || ""}`, 100), tags: ["web-uroclinic", "solicitud-horario"] })
  });
  if (!response.ok) throw new Error(`HighLevel ${response.status}`);
  return { configured: true, ok: true };
}

async function notifyWebhook(lead, env) {
  if (!env.GHL_WEBHOOK_URL) return;
  const response = await fetch(env.GHL_WEBHOOK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ event: "appointment_request", ...lead }) });
  if (!response.ok) throw new Error(`Webhook ${response.status}`);
}

async function notifyTelegram(lead, env) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const text = ["Nueva solicitud de horario — UROCLINIC", `Nombre: ${lead.name}`, `Teléfono: ${lead.phone}`, `Ciudad: ${lead.city}`, `Motivo general: ${lead.reason}`].join("\n");
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }) });
  if (!response.ok) throw new Error(`Telegram ${response.status}`);
}

async function acceptLead(request, env) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== requestOrigin && origin !== env.PUBLIC_ORIGIN) return json({ ok: false, error: "Origen no permitido" }, 403);
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 12_000) return json({ ok: false, error: "Solicitud demasiado grande" }, 413);
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: "Solicitud inválida" }, 400); }
  if (body.website) return json({ ok: true });
  const lead = { name: trim(body.name, 80), phone: trim(body.phone, 20), email: trim(body.email, 120).toLowerCase(), city: trim(body.city, 40), reason: trim(body.reason, 120), source: trim(body.source, 120) };
  if (lead.name.length < 3 || !phoneOK(lead.phone) || !emailOK(lead.email) || !lead.city || !lead.reason || body.consent !== true) return json({ ok: false, error: "Revisa los datos y acepta el aviso de privacidad." }, 422);
  if (env.LEAD_RATE_LIMITER) {
    const rateKey = await shortHash(lead.phone.replace(/\D/g, ""));
    const { success } = await env.LEAD_RATE_LIMITER.limit({ key: `lead:${rateKey}` });
    if (!success) return json({ ok: false, error: "Ya recibimos varias solicitudes. Espera un minuto o llama al 871 385 2579." }, 429);
  }
  if (!(await verifyTurnstile(body.turnstile, request.headers.get("CF-Connecting-IP"), env.TURNSTILE_SECRET_KEY))) return json({ ok: false, error: "No pudimos validar la solicitud." }, 403);
  const results = await Promise.allSettled([upsertHighLevel(lead, env), notifyWebhook(lead, env), notifyTelegram(lead, env)]);
  const ghl = results[0];
  if (ghl.status === "fulfilled" && ghl.value.configured === false && !env.GHL_WEBHOOK_URL && !env.TELEGRAM_BOT_TOKEN) return json({ ok: false, error: "Canal de recepción pendiente de configuración" }, 503);
  if (results.every((item) => item.status === "rejected")) return json({ ok: false, error: "No pudimos registrar la solicitud. Llama al 871 385 2579." }, 502);
  return json({ ok: true, message: "Solicitud recibida. El equipo confirmará disponibilidad." }, 201);
}

async function aiAssist(request, env) {
  if (!env.ADMIN_API_KEY || request.headers.get("x-admin-key") !== env.ADMIN_API_KEY) return json({ ok: false }, 401);
  const { provider, task, text } = await request.json();
  const safeTask = trim(task, 80), safeText = trim(text, 2000);
  if (!safeTask || !safeText) return json({ ok: false, error: "Faltan datos" }, 422);
  const prompt = `Asistente administrativo de UROCLINIC. No diagnostiques, no recomiendes tratamientos y no proceses datos clínicos. Redacta de forma breve, privada y profesional.\nTarea: ${safeTask}\nTexto: ${safeText}`;
  if (provider === "openai" && env.OPENAI_API_KEY) {
    const r = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { authorization: `Bearer ${env.OPENAI_API_KEY}`, "content-type": "application/json" }, body: JSON.stringify({ model: "gpt-5.6-luna", store: false, input: prompt }) });
    if (!r.ok) return json({ ok: false, error: "Proveedor no disponible" }, 502);
    const data = await r.json();
    const output = data.output?.find((item) => item.type === "message")?.content?.find((item) => item.type === "output_text")?.text || "";
    return json({ ok: true, output });
  }
  if (provider === "gemini" && env.GEMINI_API_KEY) {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", { method: "POST", headers: { "x-goog-api-key": env.GEMINI_API_KEY, "content-type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
    if (!r.ok) return json({ ok: false, error: "Proveedor no disponible" }, 502);
    const data = await r.json();
    return json({ ok: true, output: data.candidates?.[0]?.content?.parts?.[0]?.text || "" });
  }
  return json({ ok: false, error: "Proveedor no configurado" }, 503);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!["GET", "HEAD", "POST"].includes(request.method)) return json({ ok: false, error: "Método no permitido" }, 405);
    if (url.pathname === "/api/public-config" && request.method === "GET") return json({ turnstileSiteKey: env.TURNSTILE_SITE_KEY || null, bookingUrl: publicHttpsURL(env.GHL_BOOKING_URL) });
    if (url.pathname === "/api/health") return json({ ok: true, service: "uroclinic", crm: Boolean(env.GHL_PRIVATE_TOKEN && env.GHL_LOCATION_ID) });
    if (url.pathname === "/api/lead" && request.method === "POST") return acceptLead(request, env);
    if (url.pathname === "/api/admin/ai" && request.method === "POST") return aiAssist(request, env);
    if (url.pathname.startsWith("/api/")) return json({ ok: false, error: "No encontrado" }, 404);
    return env.ASSETS.fetch(request);
  }
};
