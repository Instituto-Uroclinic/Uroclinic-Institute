Estado del stack (comprobar y completar)

INSTRUCCIONES: ejecutar localmente en el repo o mirar en la UI de GitHub:
- ¿Existe package.json?  cat package.json
- ¿Hay index.html en root o public/index.html?
- ¿Está public/_redirects presente?
- ¿Hay wrangler.toml o functions/ (Workers)?
- ¿Hay scripts de build en package.json?

Plantilla de salida (completa tras inspección):
- Tipo: (HTML estático / Node static server / Next / Vite / Hugo / otro)
- Archivos detectados: package.json (sí/no), index.html (ruta), public/_redirects (sí/no), wrangler.toml (sí/no)
- Comando local inferido: (ej. npm start / npx serve public)
- Comando build inferido: (ej. npm run build / no aplica)
- Output directory esperado para Pages: (ej. public / dist / out)

Si no puedes ejecutar detección en este entorno, completa manualmente las líneas anteriores y guarda.
