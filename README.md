# UROCLINIC Dr. Jovani Torres — repo operativo

## Identidad (no cambiar)
- Nombre: UROCLINIC Dr. Jovani Torres
- Médico: Dr. Esteban Jovani Torres Guevara
- Dirección: Av. Allende Oriente 139, Hospital Grinker, Consultorio 1, Torreón, Coah. 27000
- Origen canónico: https://uroclinic-drjovani.pages.dev
- Alias: https://drjovaniurologo.org, https://www.drjovaniurologo.org → 301 permanente al canónico

## Resumen
Este repo alimenta el sitio canónico en Cloudflare Pages: `uroclinic-drjovani.pages.dev`.
No incluir PHI ni marcas prohibidas. Precio: leer del HTML en Pages o usar `TODO_PRECIO_PAGES`.

## Local
- Inspecciona el stack: revisar `package.json` e `index.html`.
- Comandos comunes (si no existen, completar en `docs/STACK.md`):
  - Instalar: `npm ci` (o indicar si no aplica)
  - Dev: `npm start` (o servir `index.html` con `npx http-server public`)
  - Build: `npm run build` (o no aplica para HTML estático)

## Deploy (recomendado)
- Integración Git → Cloudflare Pages: crear proyecto Pages apuntando a este repo y branch `main`.
- El deploy a producción es la build automática cuando PR → merge a `main`.
- Preview: cada PR genera un preview en `*.pages.dev` (no confundir con el canónico).

## Alias / .org
- El `.org` / `www` deben 301 permanente al canónico. Implementar con `public/_redirects` (si DNS apunta a Pages) o con Worker (si DNS no apunta a Pages). Nunca ambos activos para el mismo host.

## Checklist post-deploy (copiar a Notion)
- [ ] GET canónico 200
- [ ] GET .org → 301 a pages.dev (mismo path)
- [ ] GET www → 301 a pages.dev
- [ ] /salud 200 { brand: UROCLINIC }
- [ ] POST / → 405
- [ ] Title/H1 dicen UROCLINIC Dr. Jovani Torres, Torreón
- [ ] Precio HTML = ficha Maps ese día (o TODO_PRECIO_PAGES)
- [ ] CID no se tocó
- [ ] Sin “Institute” / marcas muertas
- [ ] Bitácora Notion: fecha + URL deploy + PR

## Notas importantes
- NO subir secretos en git (`.env`, tokens).
- No incluir teléfonos ni WhatsApp en el repo.
- Si no sabes si el `.org` DNS apunta a Pages, no actives Worker y custom domain a la vez.
