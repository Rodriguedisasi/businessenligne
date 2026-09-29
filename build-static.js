/* ==========================================================
   BUSINESSENLIGNE — COPIE DU SITE VERS public/
   ------------------------------------------------------------
   Vercel sert le contenu du dossier « public » depuis son CDN, et
   n'envoie vers une fonction que ce qui n'y figure pas : /api/* et
   /uploads/*. Ce script y recopie donc le front (pages, feuille de
   style, scripts navigateur) sans toucher aux fichiers serveur.
   ========================================================== */
const fs   = require('fs');
const path = require('path');

const ROOT  = __dirname;
const OUT   = path.join(ROOT, 'public');

/* Les pages du site. Les fichiers underscored sont des brouillons. */
const HTML = fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html') && !f.startsWith('_'));

/* Les seuls scripts publiés (la même liste que PUBLIC_JS dans server.js). */
const JS = ['api.js', 'javascript.js', 'theme.js'];

/* Les images éventuellement posées à la racine (logo, favicon…). */
const IMG = fs.readdirSync(ROOT)
    .filter(f => /\.(png|jpe?g|gif|webp|svg|ico)$/i.test(f));

const files = [...HTML, ...JS, 'style.css', ...IMG];

fs.mkdirSync(OUT, { recursive: true });
for (const f of files){
    const src = path.join(ROOT, f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(OUT, f));
}

/* public/ ne doit jamais devenir la source de vérité : on le vide d'abord. */
console.log(`  ${files.length} fichiers copiés dans public/`);
