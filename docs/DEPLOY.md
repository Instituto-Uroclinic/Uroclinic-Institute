SOP Deploy (merge → validar)

1. Crear PR desde rama con cambios.
2. Revisiones y aprobación.
3. Merge PR a main.
4. Cloudflare Pages: esperar build (ver logs en Pages).
5. Validaciones post-deploy:
   - GET https://uroclinic-drjovani.pages.dev → 200
   - Verificar <title> y H1 contienen “UROCLINIC Dr. Jovani Torres” y “Torreón”
   - Ver /salud → 200 y body JSON { ok: true, brand: "UROCLINIC", canonical: "https://uroclinic-drjovani.pages.dev" }
   - Ver alias: https://drjovaniurologo.org/<path> → 301 → https://uroclinic-drjovani.pages.dev/<path> (mismo path + query)
   - Ver POST a raíz → 405
   - Ver que Precio en HTML coincide con ficha de Maps ese día (manual)
   - Confirmar GBP CID no fue modificado

6. Notion: cerrar la tarea con bitácora: fecha, PR, URL deploy, checklist completado.

Rollback
- Usar la funcionalidad de Pages para revertir al deploy previo. No hacer git push --force a main salvo emergencia; comunicarse antes.

Worker vs _redirects
- Si el DNS del .org apunta a Pages: usar public/_redirects.
- Si el DNS del .org NO apunta a Pages: usar Worker + wrangler para redirigir a Pages.
- Nunca activar Worker y custom domain Pages simultáneamente para el mismo host.
