/* ==========================================================
   BUSINESSENLIGNE — POINT D'ENTRÉE UNIQUE DES API (Vercel)
   ------------------------------------------------------------
   Un seul fichier se charge de TOUTES les routes /api/** et
   /uploads/** (la même application que « npm start » en local).

   POURQUOI CE NOM DE FICHIER
   Sur Vercel, un projet qui n'est pas Next.js ne gère PAS le
   « catch-all » à crochets : api/[...path].js ne capte qu'UN
   SEUL segment de chemin. Résultat : /api/shops/<vendeur>,
   /api/products/<id>, /api/admin/* tombaient sur le 404 de
   Vercel (« page could not be found ») sans jamais atteindre
   server.js — d'où « Boutique introuvable » sur la page magasin.

   La parade officielle : un fichier SANS crochets (api/index.js)
   plus deux règles de réécriture dans vercel.json qui renvoient
   /api/… et /uploads/… vers /api/index. Le chemin d'origine est
   transporté dans le paramètre « __bePath » (Vercel conserve en
   plus la query string d'origine), puis reconstruit ici avant de
   confier la requête à server.js.

   Sur Vercel le corps JSON est déjà lu et mis dans req.body, le
   flux de la requête est donc épuisé : server.js, qui attend un
   flux, ne verrait jamais la fin du corps et la requête resterait
   bloquée. On le rejoue donc dans un flux lisible, avec la méthode
   et l'URL d'origine, avant de confier le tout à server.js.
   ========================================================== */
const { Readable } = require('stream');
const server = require('../server.js');

function replayBody(req) {
    if (req.body === undefined || req.body === null) return null;
    const raw = (typeof req.body === 'string' || Buffer.isBuffer(req.body))
        ? req.body : JSON.stringify(req.body);
    const shim = Readable.from([Buffer.from(raw)]);
    shim.method = req.method;
    shim.url = req.url;
    shim.headers = req.headers;
    shim.httpVersion = req.httpVersion;
    return shim;
}

/* Reconstruit le chemin d'origine transporté par la réécriture.
   __bePath vaut par exemple « /api/shops/rodrigue » : on l'utilise
   comme chemin, et on rejoue la query string d'origine (tout sauf
   __bePath) telle quelle. */
function restoreUrl(req) {
    const raw = req.url || '/';
    let u;
    try { u = new URL(raw, 'http://localhost'); } catch (e){ return; }
    const bePath = u.searchParams.get('__bePath');
    if (!bePath) return;
    const q = new URLSearchParams(u.searchParams);
    q.delete('__bePath');
    const qs = q.toString();
    req.url = bePath + (qs ? '?' + qs : '');
}

module.exports = (req, res) => {
    try {
        const replayed = replayBody(req) || req;
        restoreUrl(replayed);
        server.emit('request', replayed, res);
    } catch (e) {
        /* journalisé : sans cela un crash est totalement invisible */
        console.error('[api]', req.method, req.url, e);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Erreur serveur' }));
        }
    }
};
