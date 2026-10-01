/* ==========================================================
   BUSINESSENLIGNE — FONCTION VERCEL /api/*
   ------------------------------------------------------------
   Vercel n'exécute pas un serveur HTTP persistant : chaque requête
   appelle une fonction. On réutilise donc exactement le même
   gestionnaire que « node server.js » en le déclenchant à la main
   (événementiel 'request'), sans rien changer aux routes.
   ========================================================== */
const { Readable } = require('stream');
const server = require('../server.js');

/* Vercel analyse et consomme le corps JSON avant d'appeler la fonction.
   readBody() attend un flux : on rejoue donc le corps déjà lu dans un
   flux jetable, en conservant method/url/headers. */
function replayBody(req){
    if (req.body === undefined || req.body === null) return null;

    const raw = (typeof req.body === 'string' || Buffer.isBuffer(req.body))
        ? req.body
        : JSON.stringify(req.body);

    const shim = Readable.from([Buffer.from(raw)]);
    shim.method    = req.method;
    shim.url       = req.url;
    shim.headers   = req.headers;
    shim.httpVersion = req.httpVersion;
    return shim;
}

module.exports = (req, res) => {
    server.emit('request', replayBody(req) || req, res);
};
