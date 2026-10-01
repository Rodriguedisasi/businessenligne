const { Readable } = require('stream');
const server = require('../server.js');
function replayBody(req){
  if (req.body === undefined || req.body === null) return null;
  const raw = (typeof req.body === 'string' || Buffer.isBuffer(req.body)) ? req.body : JSON.stringify(req.body);
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
    if (!res.headersSent) { res.statusCode = 500; res.end(JSON.stringify({error:'Erreur serveur'})); }
  }
};
