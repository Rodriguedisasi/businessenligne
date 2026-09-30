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
const JS = ['api.js', 'javascript.js', 'theme.js', 'i18n.js'];

/* Les images éventuellement posées à la racine (logo, favicon…). */
const IMG = fs.readdirSync(ROOT)
    .filter(f => /\.(png|jpe?g|gif|webp|svg|ico)$/i.test(f));

const files = [...HTML, ...JS, 'style.css', ...IMG];

/* Un script listé ici doit exister : sinon le build « réussit » en livrant
   des pages qui pointent vers un 404, et l'erreur n'apparaît qu'en ligne. */
const missing = files.filter(f => !fs.existsSync(path.join(ROOT, f)));
if (missing.length){
    console.error('  Fichier(s) attendu(s) à la racine du projet : ' + missing.join(', '));
    process.exit(1);
}

/* public/ ne doit jamais devenir la source de vérité : un fichier
   retiré du front doit disparaître du build, pas y rester d'un
   déploiement à l'autre. On repart donc d'un dossier vide. */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const f of files){
    fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
}

console.log(`  ${files.length} fichiers copiés dans public/`);
