Resumen de arquitectura real (origen / alias)
- Origen (producción): Cloudflare Pages (uroclinic-drjovani.pages.dev)
- Alias: drjovaniurologo.org, www.drjovaniurologo.org → 301 al origen
- Flow principal: Notion → rama → PR → merge a main → Pages build → validar → close Notion
- Previews: cada PR genera preview en *.pages.dev (rama-specific); NO confundir con sitio canónico
- Si el DNS .org usa Pages: implementa redirecciones con public/_redirects
- Si el DNS .org no usa Pages: implementar Worker en cuenta de Cloudflare que haga 301 al canónico
