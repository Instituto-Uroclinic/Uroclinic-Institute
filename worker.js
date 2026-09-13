export default {
  async fetch(request, env, ctx) {
    const reqId = crypto.randomUUID();
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";

    const allowedOrigins = [
      "https://drjovaniurologo.org",
      "https://drjovaniurologo.com",
      "https://www.drjovaniurologo.org",
      "https://www.drjovaniurologo.com"
    ];

    const corsOrigin = allowedOrigins.includes(origin) ? origin : (allowedOrigins[0] || "*");

    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none';"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Rate Limiting básico por IP (Max 5 peticiones por minuto en endpoints de escritura)
      if (request.method === "POST" && env.APPOINTMENTS_KV) {
        const rateKey = `ratelimit:${clientIp}`;
        const currentCount = await env.APPOINTMENTS_KV.get(rateKey);
        if (currentCount && parseInt(currentCount) >= 5) {
          return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Por favor, intente más tarde." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        await env.APPOINTMENTS_KV.put(rateKey, (currentCount ? parseInt(currentCount) + 1 : 1).toString(), { expirationTtl: 60 });
      }

      // Endpoint: Crear Cita
      if (url.pathname === "/api/appointments" && request.method === "POST") {
        let data;
        try {
          data = await request.json();
        } catch (e) {
          return new Response(JSON.stringify({ error: "Formato JSON inválido." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        if (!data.name || !data.phone || !data.date || !data.time || !data.specialty) {
          return new Response(JSON.stringify({ error: "Faltan campos obligatorios en el formulario." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const cleanPhoneCheck = String(data.phone).replace(/\D/g, '');
        if (cleanPhoneCheck.length < 10) {
          return new Response(JSON.stringify({ error: "Número de teléfono inválido." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const appointmentDate = new Date(`${data.date}T${data.time || '00:00'}:00`);
        if (isNaN(appointmentDate.getTime()) || appointmentDate < new Date(Date.now() - 86400000)) {
          return new Response(JSON.stringify({ error: "La fecha u hora de la cita no es válida." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const uniqueHex = crypto.randomUUID().substring(0, 4).toUpperCase();
        const folio = `URO-${uniqueHex}-${Math.floor(1000 + Math.random() * 9000)}`;

        const appointment = {
          folio,
          name: sanitize(data.name.trim()),
          phone: sanitize(data.phone.trim()),
          specialty: sanitize(data.specialty.trim()),
          date: sanitize(data.date.trim()),
          time: sanitize(data.time.trim()),
          notes: sanitize(data.notes ? data.notes.trim() : "Ninguna"),
          status: "Confirmada",
          reqId,
          createdAt: new Date().toISOString()
        };

        await env.APPOINTMENTS_KV.put(folio, JSON.stringify(appointment));
        ctx.waitUntil(processBackgroundTasks(env, appointment));

        return new Response(JSON.stringify({ success: true, folio, appointment }), {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Endpoint: Consultar Cita por Folio
      if (url.pathname.startsWith("/api/appointments") && request.method === "GET") {
        const folio = url.searchParams.get("folio");
        if (!folio || folio.length < 5) {
          return new Response(JSON.stringify({ error: "Parámetro folio requerido o inválido." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const record = await env.APPOINTMENTS_KV.get(folio);
        if (!record) {
          return new Response(JSON.stringify({ error: "Cita no encontrada." }), {
            status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        return new Response(record, {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ error: "Endpoint no encontrado." }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      console.error(`[CRITICAL] [ReqId: ${reqId}] Error en Worker fetch:`, err);
      return new Response(JSON.stringify({ error: "Error interno del servidor.", reqId }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};

function sanitize(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

async function processBackgroundTasks(env, app) {
  let aiInsight = "Calificación estándar de prospecto urología.";

  if (env.GROQ_API_KEY) {
    try {
      const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "Eres un director comercial médico experto en neuroventas y urología de alta especialidad. Analiza brevemente al paciente, clasifica su nivel de urgencia (Alta, Media, Baja) y redacta una recomendación de abordaje clínico-comercial en una sola frase concisa y profesional."
            },
            {
              role: "user",
              content: `Paciente: ${app.name}, Especialidad: ${app.specialty}, Motivo/Síntoma: ${app.notes}`
            }
          ],
          max_tokens: 80,
          temperature: 0.3
        })
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        if (aiData.choices && aiData.choices[0]) {
          aiInsight = aiData.choices[0].message.content.trim();
        }
      }
    } catch (e) {
      console.error("Error en servicio Groq IA:", e);
    }
  }

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    try {
      let cleanPhone = app.phone.replace(/\D/g, '');
      if (cleanPhone.length === 10) cleanPhone = "52" + cleanPhone;

      const text = `🚨 <b>NUEVO LEAD / CITA MÉDICA</b> 🚨\n\n` +
        `📋 <b>Folio:</b> <code>${app.folio}</code>\n` +
        `👤 <b>Paciente:</b> ${app.name}\n` +
        `📞 <b>Teléfono:</b> ${app.phone}\n` +
        `🏥 <b>Especialidad:</b> ${app.specialty}\n` +
        `📅 <b>Fecha:</b> ${app.date} a las ${app.time}\n` +
        `💬 <b>Motivo:</b> ${app.notes}\n\n` +
        `🧠 <b>Neuro-Análisis Clínico:</b>\n<i>${sanitize(aiInsight)}</i>`;

      const keyboard = {
        inline_keyboard: [[
          { text: "💬 WhatsApp Directo", url: `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(app.name)},%20le%20contactamos%20de%20Uroclinic%20Institute%20respecto%20a%20su%20cita%20folio%20${app.folio}` },
          { text: "📞 Llamar", url: `tel:+${cleanPhone}` }
        ]]
      };

      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
          reply_markup: keyboard
        })
      });
    } catch (err) {
      console.error("Error al enviar notificación a Telegram:", err);
    }
  }

  if (env.CRM_WEBHOOK_URL) {
    try {
      await fetch(env.CRM_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "Uroclinic Web Funnel Pro",
          folio: app.folio,
          fullName: app.name,
          phone: app.phone,
          specialty: app.specialty,
          date: app.date,
          time: app.time,
          notes: app.notes,
          aiAnalysis: aiInsight,
          createdAt: app.createdAt
        })
      });
    } catch (crmErr) {
      console.error("Error al sincronizar con el CRM:", crmErr);
    }
  }
}
