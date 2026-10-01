/* ==========================================================
   BUSINESSENLIGNE — POINT D'ENTRÉE UNIQUE DES API (Vercel)
   ------------------------------------------------------------
   Un seul fichier se charge de TOUTES les routes /api/**.

   Pourquoi ne pas multiplier les fichiers api/<dossier>/[param].js :
   Vercel les résout AVANT le catch-all, donc /api/admin/overview,
   /api/products/:id et /api/shops/:username atterrissaient sur des
   doublons qui échouaient en FUNCTION_INVOCATION_FAILED (500). Pire,
   un catch-all optionnel api/[[...path]].js se fait voler la
   priorité et ne capte alors qu'un seul segment : tout le reste
   (/api/a/b/c) renvoie un 404 « page could not be found » sans
   même atteindre le serveur.

   Une seule entrée supprime ces conflits de priorité et laisse
   passer la requête telle quelle : méthode, chemin et query string
   intacts, puisqu'aucune réécriture d'URL n'intervient.

   Sur Vercel le corps JSON est déjà lu et mis dans req.body, le
   flux de la requête est donc épuisé : server.js, qui attend un
   flux, ne verrait jamais la fin du corps et la requête resterait
   bloquée. On le rejoue donc dans un flux lisible, avec la méthode
   et l'URL d'origine, avant de le confier à server.js — le même
   serveur qui tourne en local avec « npm start ».
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

module.exports = (req, res) => {
    try {
        const replayed = replayBody(req) || req;
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