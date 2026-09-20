# Auditoría integral UROCLINIC — tres pasadas

Fecha: 20 de septiembre de 2026.

## Pasada 1 — Zero Trust y superficie de ataque

Resultado: el sitio público, el endpoint de captación y el CRM quedaron definidos como superficies separadas. El CRM se protege por hostname con identidad y Service Tokens; el sitio y la cita permanecen públicos. Se añadieron CSP, HSTS, políticas de origen, límite de tamaño, métodos permitidos, honeypot, validación del lado servidor, rate limiting y secretos fuera del repositorio.

## Pasada 2 — privacidad, publicidad médica y accesibilidad

Resultado: se eliminan promesas de curación y tratamientos específicos en marketing; se muestran nombre, formación y cédulas; se diferencia información general, consulta y urgencia. Se añadieron aviso de privacidad, ARCO, finalidades, encargados, conservación, términos y limitación clínica del formulario. La revisión jurídica final debe realizarla un profesional autorizado antes de producción.

## Pasada 3 — conversión, reputación y operación

Resultado: CTA visible, formulario integrado, teléfono alternativo, motivos de consulta, precio transparente, ubicación coherente, Google/Doctoralia verificables, etiquetas HighLevel, atribución UTM, webhook operativo y notificación opcional. La IA queda restringida a tareas administrativas autenticadas, sin diagnóstico ni datos clínicos.

## 33 fuentes oficiales revisadas

### Cloudflare y Zero Trust

1. Cloudflare Access policies — https://developers.cloudflare.com/cloudflare-one/access-controls/policies/
2. Service tokens — https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/
3. Common Access policies — https://developers.cloudflare.com/cloudflare-one/access-controls/policies/common-policies/
4. Authenticate coding agents — https://developers.cloudflare.com/cloudflare-one/access-controls/authenticate-agents/
5. Application types — https://developers.cloudflare.com/cloudflare-one/access-controls/applications/choose-application-type/
6. Require Access protection — https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/require-access-protection/
7. Add web applications — https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/
8. Publish self-hosted application — https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/
9. Worker secrets — https://developers.cloudflare.com/workers/configuration/secrets/
10. GitHub integration — https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
11. Wrangler configuration — https://developers.cloudflare.com/workers/wrangler/configuration/
12. Workers rate limiting — https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
13. WAF rate limiting rules — https://developers.cloudflare.com/waf/rate-limiting-rules/
14. Turnstile server validation — https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
15. Turnstile client rendering — https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
16. Content Security Policy — https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/
17. Workers bindings — https://developers.cloudflare.com/workers/runtime-apis/bindings/

### HighLevel, automatización e IA

18. HighLevel Developer Portal — https://marketplace.gohighlevel.com/docs/
19. HighLevel private integrations — https://marketplace.gohighlevel.com/docs/Authorization/PrivateIntegrationsToken/
20. HighLevel OAuth 2.0 — https://marketplace.gohighlevel.com/docs/Authorization/OAuth2.0/
21. HighLevel Contacts — https://marketplace.gohighlevel.com/docs/ghl/contacts/contacts/
22. HighLevel Calendars — https://marketplace.gohighlevel.com/docs/ghl/calendars/calendars/
23. HighLevel Custom Fields — https://marketplace.gohighlevel.com/docs/ghl/locations/custom-field/
24. HighLevel webhook verification — https://marketplace.gohighlevel.com/docs/webhook/WebhookIntegrationGuide/
25. OpenAI API / Responses — https://developers.openai.com/es-419/api/docs
26. Gemini API reference — https://ai.google.dev/api
27. Gemini API key security — https://ai.google.dev/gemini-api/docs/api-key

### Google, accesibilidad y marco jurídico

28. Google Business Profile API overview — https://developers.google.com/my-business/content/overview
29. Google Business Profile REST — https://developers.google.com/my-business/reference/rest
30. Google Search documentation — https://developers.google.com/search/docs
31. Google business details / structured data — https://developers.google.com/search/docs/appearance/establish-business-details
32. WCAG 2.2 Quick Reference — https://www.w3.org/WAI/WCAG22/quickref/
33. Ley Federal de Protección de Datos Personales en Posesión de los Particulares, decreto DOF 20-03-2025 — https://www.dof.gob.mx/nota_detalle.php?codigo=5752569&fecha=20/03/2025
34. Reglamento de la Ley General de Salud en Materia de Publicidad — https://www.salud.gob.mx/unidades/cdi/nom/compi/rlgsmp.html
35. Reglamento de la Ley General de Salud en Materia de Prestación de Servicios de Atención Médica — https://www.salud.gob.mx/unidades/cdi/nom/compi/rlgsmpsam.html

Se revisaron 35 fuentes para superar el mínimo solicitado. Las fuentes jurídicas sustentan criterios de implementación, pero no sustituyen dictamen jurídico individual ni autorización sanitaria aplicable.

