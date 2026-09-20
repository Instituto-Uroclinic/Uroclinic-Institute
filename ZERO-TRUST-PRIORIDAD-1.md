# Zero Trust — configuración prioritaria UROCLINIC

## Alcance exacto

Proteger únicamente `crm.drjovaniurologo.org`.

No aplicar Cloudflare Access a:

- `www.drjovaniurologo.org`
- `drjovaniurologo.org`
- el formulario público de citas
- `/api/lead`
- activos, sitemap, privacidad o términos

## Aplicación humana

1. Zero Trust → Access controls → Applications → Add application.
2. Tipo: Self-hosted / public hostname.
3. Nombre: `UroClinic CRM`.
4. Hostname exacto: `crm.drjovaniurologo.org`.
5. Session duration: `24 hours`.
6. Policy `Allow — UroClinic owner`:
   - Action: Allow.
   - Include: Emails.
   - Value: correo único autorizado del propietario.
7. No usar `Include Everyone` ni `Emails ending in` para un CRM de un solo propietario.
8. Activar instant authentication cuando exista un solo proveedor de identidad.

## Integración máquina a máquina

Para n8n, Worker u otra automatización que necesite llegar al CRM:

1. Crear Service Token `uroclinic-crm-automation`.
2. Guardar Client ID y Client Secret una sola vez en secretos de Cloudflare/n8n.
3. Crear policy `Service Auth — CRM automation` con selector del Service Token.
4. Enviar `CF-Access-Client-Id` y `CF-Access-Client-Secret` desde el servicio autorizado.
5. Rotar el secreto periódicamente y activar alerta de expiración.

## API del CRM

Recomendación principal: Service Auth para `/api/v1/*` porque conserva autenticación y registro. Un `Bypass` desactiva Access y no registra las solicitudes; úsese únicamente si una integración legítima no puede enviar encabezados de servicio, con alcance exacto de ruta y controles compensatorios.

## Orden de políticas

1. Service Auth — automatizaciones.
2. Allow — correo exacto del propietario.
3. Denegación implícita para todo lo demás.

## Verificación obligatoria

- `https://crm.drjovaniurologo.org/` debe mostrar autenticación Access a visitantes anónimos.
- El correo autorizado debe poder iniciar sesión.
- Un correo distinto debe quedar bloqueado.
- La automatización con Service Token debe recibir respuesta del CRM.
- La misma petición sin token debe quedar bloqueada.
- `https://www.drjovaniurologo.org/` y el formulario deben continuar públicos.
- Revisar Access logs sin registrar cuerpos ni datos clínicos.

## Controles adicionales

- Origin del CRM accesible solo mediante Cloudflare Tunnel.
- No publicar puertos del CRM directamente.
- MFA en Cloudflare, GitHub, HighLevel y correo administrador.
- Token de despliegue con alcance mínimo al Worker correspondiente.
- Rotación trimestral del token privado de HighLevel.
- Alertas de expiración y revisión mensual de accesos.

