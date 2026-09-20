import {rm,mkdir,copyFile} from 'node:fs/promises';
const files=['index.html','app.js','styles.css','booking.css','contact.css','faq.css','legal.css','favicon.svg','robots.txt','sitemap.xml','site.webmanifest','dr-jovani.webp','endourologia.webp','_headers'];
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});for(const f of files)await copyFile(f,`dist/${f}`);console.log(`built ${files.length} static assets`);
