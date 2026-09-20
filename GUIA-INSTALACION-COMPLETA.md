# Guía de instalación completa — UROCLINIC

Ruta recomendada: **GitHub → Cloudflare Worker → HighLevel**.

GitHub almacena y valida el código. Cloudflare despliega el sitio y ejecuta el backend. Solo Cloudflare conoce el token de HighLevel.

## Fase 1 — subir el proyecto a GitHub

### Opción iPhone / navegador

1. Descomprime el ZIP en la aplicación Archivos.
2. Abre `Instituto-Uroclinic/drjovaniurologo-gemini-bridge`.
3. Crea una rama `release/uroclinic-web-v2.5`; no reemplaces `main` hasta verificar la vista previa.
4. En esa rama selecciona **Add file → Upload files**.
5. Sube el contenido interno de la carpeta, no la carpeta contenedora.
6. Confirma que en la raíz aparezcan:
   - `wrangler.toml`
   - `package.json`
   - `worker/`
   - `dist/`
   - `.github/`
7. Commit message: `release: UROCLINIC Cloudflare production v2.5`.
8. Abre **Actions → Validate UROCLINIC** y confirma estado verde; después crea el Pull Request hacia `main`.

Los directorios que comienzan con punto pueden ocultarse en iPhone. Si el cargador no permite seleccionarlos, usa Working Copy, Codespaces o sube el ZIP desde una computadora. No omitas `.github`, `.gitignore` ni `.openai`.

## Fase 2 — conectar GitHub con Cloudflare

1. Cloudflare Dashboard → **Workers & Pages**.
2. Selecciona **Create application → Import a repository**.
3. Autoriza la aplicación **Cloudflare Workers & Pages** únicamente para el repositorio UROCLINIC.
4. Selecciona el repositorio creado.
5. Production branch: `main`.
6. Build command: dejar vacío o usar `npm run check`.
7. Deploy command: `npx wrangler deploy`.
8. Root directory: `/`.
9. Guarda y despliega.
10. Abre la URL temporal `*.workers.dev` y verifica portada, formulario, privacidad y términos.

No actives todavía el dominio principal.

## Fase 3 — crear la integración privada de HighLevel

1. Entra a la subcuenta de producción correcta de HighLevel.
2. Settings → Private Integrations → Create new integration.
3. Nombre: `UROCLINIC Cloudflare Intake`.
4. Concede el mínimo permiso necesario para crear/actualizar contactos.
5. Copia el token una sola vez y guárdalo temporalmente en un gestor de contraseñas.
6. Copia el `Location ID` de la misma subcuenta.

No pegues el token en GitHub, código, capturas, Telegram ni archivos `.env` compartidos.

## Fase 4 — conectar Cloudflare con HighLevel

En Cloudflare: Worker → Settings → Variables and Secrets.

Agregar como **Secret**:

- `GHL_PRIVATE_TOKEN`: token privado de HighLevel.
- `GHL_LOCATION_ID`: Location ID de producción.

Agregar opcionalmente:

- `GHL_WEBHOOK_URL`: webhook de un Workflow de HighLevel o n8n.
- `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`: aviso administrativo.
- `TURNSTILE_SECRET_KEY`: secreto del widget.
- `ADMIN_API_KEY`: llave independiente para IA administrativa.
- `OPENAI_API_KEY` o `GEMINI_API_KEY`: solo si se activará esa función.

Agregar como variable normal, no secreta:

- `TURNSTILE_SITE_KEY`: site key pública del widget.
- `PUBLIC_ORIGIN`: `https://www.drjovaniurologo.org`.
- `GHL_BOOKING_URL`: URL pública del calendario de producción en HighLevel. No es un secreto.

Después de agregar o cambiar secretos, crea un nuevo deployment.

## Fase 5 — configurar el flujo comercial en HighLevel

Crear o verificar:

1. Pipeline: `UROCLINIC — Captación y Conversión`.
2. Etapa inicial: `Lead nuevo`.
3. Tags: `web-uroclinic` y `solicitud-horario`.
4. Workflow de entrada:
   - trigger por tag `solicitud-horario`;
   - crear oportunidad en `Lead nuevo`;
   - asignar propietario;
   - enviar confirmación administrativa;
   - crear tarea de seguimiento si no se contacta;
   - detener automatización cuando la cita quede confirmada.
5. El CRM solo debe guardar datos administrativos. No expedientes, diagnósticos, estudios, fotografías o antecedentes.

Para agenda inmediata, copia el enlace público del calendario de producción de HighLevel y guárdalo como `GHL_BOOKING_URL` en Cloudflare. Los botones del sitio lo detectan automáticamente; si aún no está configurado, bajan al formulario de solicitud sin romper la experiencia.

Después, seguir `docs/META-HIGHLEVEL-NORMALIZACION.md`: confirmar primero el Location ID, auditar IDs reales de Facebook e Instagram y registrar por separado los estados `CONNECTED`, `TESTED` y `PUBLISHED`. No conectar cuentas por semejanza de nombre de usuario.

## Fase 6 — Turnstile

1. Cloudflare → Turnstile → Add widget.
2. Hostnames:
   - dominio temporal del Worker para pruebas;
   - `www.drjovaniurologo.org` para producción.
3. Copia la Site Key en `TURNSTILE_SITE_KEY`.
4. Copia el Secret Key en `TURNSTILE_SECRET_KEY`.
5. Despliega nuevamente.
6. Confirma que el formulario acepte un envío válido y rechace tokens inválidos.

## Fase 7 — Zero Trust del CRM

Seguir `docs/ZERO-TRUST-PRIORIDAD-1.md`.

Regla esencial:

- Access solamente en `crm.drjovaniurologo.org`.
- No aplicar Access a la web, formulario o `/api/lead`.
- Usuario humano: correo exacto autorizado, sesión 24 horas.
- Automatizaciones: Service Token y policy Service Auth.

## Fase 8 — pruebas antes del dominio

Marcar cada punto:

- [ ] Portada correcta en iPhone.
- [ ] Menú y CTA funcionan.
- [ ] Formulario registra un contacto de prueba en HighLevel.
- [ ] No se crean contactos duplicados.
- [ ] El contacto contiene source `Sitio UROCLINIC` y tags correctos.
- [ ] Workflow crea la oportunidad.
- [ ] Confirmación administrativa funciona.
- [ ] Turnstile valida servidor.
- [ ] `/api/health` responde `ok: true` y `crm: true`.
- [ ] Aviso de privacidad y términos abren correctamente.
- [ ] Doctoralia y mapa abren en otra pestaña.
- [ ] No existen tokens en el repositorio.
- [ ] CRM exige Cloudflare Access.
- [ ] La web pública no exige Access.

## Fase 9 — conectar el dominio

1. Cloudflare Worker → Settings → Domains & Routes.
2. Agrega primero un subdominio de prueba, por ejemplo `preview.drjovaniurologo.org`.
3. Repite todas las pruebas.
4. Conserva una copia de la versión pública anterior.
5. Agrega `www.drjovaniurologo.org`.
6. Redirige el dominio raíz a `www` o configura ambos hacia el mismo Worker.
7. Verifica certificado TLS, canonical y sitemap.
8. Solo después retira la versión anterior.

## Fase 10 — prueba final real

1. Envía una solicitud con datos de prueba claramente identificados.
2. Comprueba contacto, etiquetas, oportunidad y notificación.
3. Elimina el contacto de prueba.
4. Revisa logs sin mostrar cuerpos ni datos personales.
5. Registra fecha, versión y responsable del despliegue.

## Recuperación

Si falla producción:

1. No borres DNS ni el repositorio.
2. Cloudflare → Deployments.
3. Selecciona la última versión estable.
4. Rollback.
5. Corrige en una rama nueva y valida antes de fusionar a `main`.
