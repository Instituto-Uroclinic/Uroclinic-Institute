Incidentes y pasos rápidos

1) Pages 5xx (sitio caído)
- Ver logs del deploy en Cloudflare Pages.
- Si build falló: revisar output dir y build command en Pages.
- Si runtime 5xx en Pages: intentar rollback al deploy previo desde dashboard Pages.
- Notificar en Telegram: “Pages caído — rollback realizado / investigando”.

2) Alias .org no redirige
- Si .org DNS apunta a Pages: comprobar public/_redirects y configuración custom domain en Pages.
- Si .org DNS apunta a Cloudflare Workers: comprobar worker activo y logs (wrangler tail / dashboard).
- Comprobar certificados TLS (Pages gestiona TLS para custom domain cuando está configurado).

3) Precio distinto a Maps
- Manual: abrir Pages canónico, leer precio desde HTML.
- Ver ficha GBP, confirmar precio enMaps.
- Si discrepancia: actualizar repo content (no cambiar CID).

4) Ficha GBP $0 / problema de perfil
- Revisar GBP en Google Business Profile (humano autorizado). No tocar CID ni crear nueva ficha.

5) POST de estudios llega al edge
- Worker debe retornar 405 para POST. Revisar logs del worker, bloquear body no permitido.

6) SSL / certificado
- Pages puede gestionar TLS; si se usa Worker con custom host, TLS en Cloudflare dashboard.
