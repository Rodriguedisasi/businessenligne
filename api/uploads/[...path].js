/* ==========================================================
   BUSINESSENLIGNE — FONCTION VERCEL /uploads/*
   ------------------------------------------------------------
   Les photos des vendeurs vivent dans Cloud Storage ou dans Firestore
   (le disque d'une fonction est effacé à chaque appel). Cette fonction
   les relit et les renvoie, avec exactement la même URL que sur le
   serveur local.

   Elle est atteinte par la réécriture déclarée dans vercel.json :
        /uploads/<fichier>  ->  /api/uploads/<fichier>
   Le nom du fichier arrive donc dans req.query.path, et non dans
   req.url : aucune ambiguïté sur l'URL d'origine.
   ========================================================== */
const path = require('path');
const photos = require('../../storage.js');

const MIME = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp'
};

module.exports = async (req, res) => {
    const parts = [].concat(req.query.path || []);
    const name = decodeURIComponent(parts.join('/'));

    /* garde-fou : un simple nom de fichier, jamais un chemin */
    if (!name || path.basename(name) !== name){
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Accès refusé');
    }

    let data;
    try { data = await photos.read(name); } catch (e){ data = null; }

    if (!data){
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('404');
    }

    res.writeHead(200, {
        'Content-Type': MIME[path.extname(name).toLowerCase()] || 'application/octet-stream',
        'Content-Length': data.length,
        'Cache-Control': 'public, max-age=86400, immutable'
    });
    res.end(data);
};
