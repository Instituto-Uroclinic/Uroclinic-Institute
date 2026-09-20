export const CANONICAL_ORIGIN = "https://drjovaniurologo.org";
export const MAX_BODY_BYTES = 12_000;
const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "x-frame-options": "SAMEORIGIN",
  "content-security-policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; upgrade-insecure-requests"
};
export function withSecurity(response, { api = false } = {}) {
  const h = new Headers(response.headers);
  for (const [k,v] of Object.entries(SECURITY_HEADERS)) h.set(k,v);
  if (api) h.set("cache-control", "no-store");
  return new Response(response.body, {status: response.status, statusText: response.statusText, headers:h});
}
export function safeJson(data,status=200,extra={}) { return withSecurity(new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8",...extra}}),{api:true}); }
export function requestId(request) { const incoming=request.headers.get("cf-ray"); return incoming ? `cf-${incoming.replace(/[^a-zA-Z0-9-]/g,"").slice(0,64)}` : crypto.randomUUID(); }
export function sameOriginAllowed(request, env) {
  const expected = env.PUBLIC_ORIGIN || CANONICAL_ORIGIN;
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const expectedHost = new URL(expected).host;
  if (host !== expectedHost && !host?.endsWith(".workers.dev")) return false;
  if (!origin || origin !== expected) return false;
  const sec = request.headers.get("sec-fetch-site");
  return !sec || sec === "same-origin" || sec === "same-site";
}
export function trimText(v,max){return String(v??"").trim().replace(/[\u0000-\u001F\u007F]/g,"").slice(0,max)}
export async function sha256Hex(value){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,"0")).join("")}
export async function fetchTimeout(url, options={}, timeoutMs=8000){const c=new AbortController();const t=setTimeout(()=>c.abort(),timeoutMs);try{return await fetch(url,{...options,signal:c.signal})}finally{clearTimeout(t)}}
export function redactLog(obj={}){const denied=/token|authorization|secret|password|email|phone|body/i;return Object.fromEntries(Object.entries(obj).filter(([k])=>!denied.test(k)).map(([k,v])=>[k,typeof v==="string"?v.replace(/[\r\n\t]/g," ").slice(0,160):v]));}
