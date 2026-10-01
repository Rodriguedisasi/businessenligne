/* ==========================================================
   BUSINESSENLIGNE — POINT D'ENTRÉE UNIQUE DES API (Vercel)
   ------------------------------------------------------------
   Un seul fichier se charge de TOUTES les routes /api/** : Vercel
   résout les fichiers api/<dossier>/[param].js plus spécifiquement
   que le catch-all, et ces petits fichiers parasites plantaient
   (FUNCTION_INVOCATION_FAILED) sur /api/admin/**, /api/products/:id
   et /api/shops/:username. Une seule entrée évite tout conflit de
   priorité et garde le chemin d'origine intact (query string
   comprise) puisque l'on ne réécrit pas l'URL.

   La lecture des corps JSON est faite par Vercel : on rejoue le
   corps déjà lu dans un flux, la méthode et l'URL d'origine, puis on
   confie la requête à server.js, qui est aussi bien le serveur
   Node local que la fonction.
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
    const r = replayBody(req) || req;
    server.emit('request', r, res);
  } catch (e) {
    /* journalisé : sans cela un crash est totalement invisible */
    console.error('[api]', req.method, req.url, e);
    if (!res.headersSent) { res.statusCode = 500; res.end(JSON.stringify({ error: 'Erreur serveur' })); }
  }
};
