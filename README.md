# UROCLINIC Institute — Cloudflare + HighLevel

Frontend responsivo y backend Cloudflare Worker. El formulario registra contactos administrativos en HighLevel y puede notificar a n8n/HighLevel Workflow y Telegram. Incluye un adaptador administrativo protegido para OpenAI o Gemini; no debe recibir información clínica.

## Publicación recomendada

### Cloudflare Workers Builds conectado a GitHub

- Repositorio: seleccionar solamente el repositorio de UROCLINIC.
- Rama de producción: `main`.
- Comando de despliegue: `npx wrangler deploy`.
- Los cambios en `main` publican automáticamente; las demás ramas sirven para revisión.
- GitHub Actions únicamente valida el código. Cloudflare realiza el despliegue para evitar publicaciones duplicadas.

### Wrangler

1. Autenticar Wrangler en la cuenta correcta.
2. Registrar los secretos indicados abajo.
3. Ejecutar `npx wrangler deploy` desde esta carpeta.

## Secretos de Cloudflare

Obligatorios para captar solicitudes:

- `GHL_PRIVATE_TOKEN`
- `GHL_LOCATION_ID`

Opcionales:

- `GHL_WEBHOOK_URL`: workflow de HighLevel o n8n.
- `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`: aviso operativo.
- `TURNSTILE_SECRET_KEY`: secreto anti-bots.
- `TURNSTILE_SITE_KEY`: identificador público del widget; se configura como variable normal en `wrangler.toml` o Cloudflare.
- `GHL_BOOKING_URL`: URL pública del calendario HighLevel. Al configurarla, todos los CTA abren la agenda inmediata; si falta, llevan al formulario seguro del sitio.
- `ADMIN_API_KEY`: protege `/api/admin/ai`.
- `OPENAI_API_KEY` o `GEMINI_API_KEY`: IA administrativa, nunca clínica.

En Cloudflare: Worker → Settings → Variables and Secrets → Add → **Secret**. No guardar tokens en GitHub, HTML ni JavaScript del navegador.

## Flujo unificado

1. El paciente envía nombre, teléfono, correo opcional, ciudad y motivo general.
2. El Worker valida origen, consentimiento, límites y honeypot.
3. HighLevel hace upsert del contacto y aplica etiquetas; la URL pública del calendario habilita agenda inmediata sin exponer tokens.
4. Un webhook opcional inicia el workflow de oportunidad, agenda, correo o SMS.
5. Telegram puede avisar al equipo sin incluir estudios ni antecedentes clínicos.
6. Google Business y Doctoralia permanecen como reputación y adquisición; sus enlaces llevan a sus perfiles oficiales.

## Auditoría y Zero Trust

- `docs/ZERO-TRUST-PRIORIDAD-1.md`: configuración exacta para proteger únicamente el CRM.
- `docs/AUDITORIA-3-PASADAS-33-FUENTES.md`: seguridad, legalidad, conversión y 35 fuentes oficiales.
- `docs/META-HIGHLEVEL-NORMALIZACION.md`: verificación de Meta, pipeline canónico y pruebas sin duplicados.
- `docs/MOTOR-DE-CONTENIDOS.md`: SEO local, comunicación ética y reutilización multicanal.

## Guía principal

Abrir `GUIA-INSTALACION-COMPLETA.md` y ejecutar las diez fases en orden.

## GitHub Actions

No requiere secretos. El workflow valida sintaxis y archivos esenciales. Los secretos operativos de HighLevel, Telegram e IA permanecen exclusivamente en Cloudflare, no en GitHub.

## API

- `GET /api/health`: estado mínimo sin revelar secretos.
- `POST /api/lead`: captación administrativa.
- `POST /api/admin/ai`: redacción administrativa autenticada por `x-admin-key`.

## Antes de conectar el dominio

- Confirmar que `/privacidad/` siga disponible en `www.drjovaniurologo.org`.
- Mantener el formulario sin archivos adjuntos ni información clínica sensible.
- Conectar `www.drjovaniurologo.org` únicamente después de verificar la URL de previsualización.

## Fuentes técnicas oficiales consultadas

1. Cloudflare: GitHub integration — https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
2. Cloudflare: Git integration — https://developers.cloudflare.com/pages/configuration/git-integration/
3. Cloudflare: Worker secrets — https://developers.cloudflare.com/workers/configuration/secrets/
4. Cloudflare: Wrangler configuration — https://developers.cloudflare.com/workers/wrangler/configuration/
5. HighLevel: Developer portal — https://marketplace.gohighlevel.com/docs/
6. HighLevel: Contacts API — https://marketplace.gohighlevel.com/docs/ghl/contacts/contacts/
7. HighLevel: Calendars API — https://marketplace.gohighlevel.com/docs/ghl/calendars/calendars/
8. Google: Business Profile APIs overview — https://developers.google.com/my-business/content/overview
9. Google: Business Profile REST reference — https://developers.google.com/my-business/reference/rest
10. OpenAI: API documentation / Responses — https://developers.openai.com/es-419/api/docs
11. Google: Gemini API reference — https://ai.google.dev/api
