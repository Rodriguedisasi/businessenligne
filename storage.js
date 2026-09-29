/* ==========================================================
   BUSINESSENLIGNE — STOCKAGE DES PHOTOS
   ------------------------------------------------------------
   Les images publiées par les vendeurs passent par une seule et
   même interface, trois moteurs possibles :

      disque local    uploads/ sur la machine (dev, poste local) ;
      Cloud Storage   bucket Google, utile quand le projet dispose
                      d'un compte de facturation ;
      Firestore       la base du site, seul moteur restant en
                      hébergement gratuit : le disque d'une fonction
                      est effacé, la base ne l'est pas.

   Le moteur est choisi au premier accès : Cloud Storage dès qu'un
   bucket est déclaré, Firestore sinon si la base est déjà Firebase,
   disque local en dernier recours. L'URL publique reste
   /uploads/<fichier> dans tous les cas, donc rien ne change dans
   la base ni sur le site.
   ========================================================== */
const fs   = require('fs');
const path = require('path');
const { PassThrough } = require('stream');

/* Les photos vivent sur le disque persistant en hébergement :
   UPLOAD_DIR permet de les sortir du dossier de code déployé. */
const UPLOAD_DIR = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(__dirname, 'uploads');

/* Préfixe des objets dans le bucket : /uploads/xxx.jpg -> uploads/xxx.jpg */
const PREFIX = 'uploads/';

/* ---- Résolution du bucket ---------------------------------
   App Hosting remplit FIREBASE_CONFIG (storageBucket inclus) quand
   le backend est lié à une application web ; sinon on retombe sur
   le nom de projet, qui donne le bucket « <projet>.appspot.com ». */
function firebaseConfig(){
    try { return process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG) : {}; }
    catch (e){ return {}; }
}

function bucketName(){
    const declared = process.env.STORAGE_BUCKET || firebaseConfig().storageBucket;
    if (declared) return String(declared).replace(/^gs:\/\//, '');
    const project = firebaseConfig().projectId || process.env.GOOGLE_CLOUD_PROJECT;
    return project ? project + '.appspot.com' : null;
}

/* ---- Moteur : disque local -------------------------------- */
const localBackend = {
    name: 'disque local',
    async put(name, buf){ fs.writeFileSync(path.join(UPLOAD_DIR, name), buf); },
    async has(name){ return fs.existsSync(path.join(UPLOAD_DIR, name)); },
    stream(name){ return fs.createReadStream(path.join(UPLOAD_DIR, name)); }
};

/* ---- Moteur : Cloud Storage ------------------------------- */
function cloudBackend(bucket){
    let admin = null;
    try { admin = require('./admin-sdk'); }
    catch (e){ console.warn('[photos] firebase-admin absent — photos en disque local'); return null; }
    if (!admin.isInstalled()){ console.warn('[photos] firebase-admin absent — photos en disque local'); return null; }

    try {
        /* Si la base Firestore a déjà démarré l'application admin, on la réutilise :
           elle porte alors les identifiants de la clé de service. Sinon l'hébergeur
           fournit FIREBASE_CONFIG ou le jeton du compte de service du runtime. */
        if (!admin.isInitialized()) admin.initializeApp();
        const store = admin.storage(admin.getApp()).bucket(bucket);
        const object = name => store.file(PREFIX + name);

        return {
            name: 'Cloud Storage (' + bucket + ')',
            async put(name, buf, mime){
                await object(name).save(buf, {
                    contentType: mime || 'application/octet-stream',
                    resumable: false
                });
            },
            async has(name){
                try { await object(name).getMetadata(); return true; }
                catch (e){ if (String(e.code) === '404') return false; throw e; }
            },
            stream(name){ return object(name).createReadStream(); }
        };
    } catch (e){
        console.warn('[photos] Cloud Storage indisponible (' + e.message + ') — photos en disque local');
        return null;
    }
}

/* ---- Moteur : Firestore (photos rangées dans la base) -------
   Une photo est un document « photos/<nom> » qui décrit le fichier
   (type MIME, nombre de morceaux) ; les morceaux vivent dans
   « photoChunks/<nom>__<n> ». Le découpage est nécessaire parce que
   Firestore refuse un document de plus de 1 Mo, alors que le site
   accepte des images allant jusqu'à 3 Mo. */
const CHUNK = 700000;   /* caractères base64 par document : large marge sous 1 Mo */

function firestoreBackend(){
    let store = null;
    try { store = require('./db-firestore').createFirestore(); }
    catch (e){ console.warn('[photos] Firestore indisponible (' + e.message + ')'); return null; }
    if (!store) return null;

    const manifest = name => store.collection('photos').doc(name);
    const chunkRef = (name, i) => store.collection('photoChunks').doc(`${name}__${i}`);

    return {
        name: 'Firestore',
        async put(name, buf, mime){
            const b64 = Buffer.from(buf).toString('base64');
            const parts = Math.max(1, Math.ceil(b64.length / CHUNK));

            const batch = store.batch();
            batch.set(manifest(name), {
                mime: mime || 'application/octet-stream',
                size: buf.length,
                chunks: parts
            });
            for (let i = 0; i < parts; i++)
                batch.set(chunkRef(name, i), { data: b64.slice(i * CHUNK, (i + 1) * CHUNK) });
            await batch.commit();
        },
        async has(name){
            const s = await manifest(name).get();
            return s.exists;
        },
        /* Le reste du serveur s'attend à un flux renvoyé immédiatement :
           la lecture Firestore étant asynchrone, on renvoie un flux vide
           qu'on remplit dès que les morceaux sont arrivés. */
        stream(name){
            const out = new PassThrough();
            (async () => {
                try {
                    const s = await manifest(name).get();
                    if (!s.exists) throw Object.assign(new Error('Photo introuvable'), { code: 404 });
                    const { chunks } = s.data();
                    const parts = await Promise.all(
                        Array.from({ length: chunks }, (_, i) => chunkRef(name, i).get()));
                    out.end(Buffer.concat(parts.map(p => Buffer.from(p.data().data, 'base64'))));
                } catch (e){
                    out.destroy(e);
                }
            })();
            return out;
        }
    };
}

/* Choix différé : le module peut être chargé avant que l'environnement
   soit prêt (variables FIREBASE_CONFIG lues plus tard). */
let backend = null;
function get(){
    if (backend) return backend;
    const want = String(process.env.STORAGE_DRIVER || 'auto').toLowerCase();

    if (want !== 'local'){
        if (want !== 'firestore'){
            const bucket = bucketName();
            backend = bucket ? cloudBackend(bucket) : null;
        }
        /* Cloud Storage exige un compte de facturation : sans bucket, ou
           sans firebase-admin utilisable, on range les photos dans la base. */
        if (!backend && want !== 'cloud') backend = firestoreBackend();
        if (!backend) console.warn('[photos] aucun stockage distant — photos en disque local');
    }
    if (!backend) backend = localBackend;
    if (backend === localBackend) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    return backend;
}

/* Lecture complète en mémoire : utilisée par l'hébergement sans serveur
   persistant (une fonction Vercel renvoie le fichier dans la réponse
   plutôt que de le faire défiler). */
function readAll(name){
    return new Promise((resolve, reject) => {
        const chunks = [];
        get().stream(name)
            .on('data', c => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
            .on('error', reject)
            .on('end', () => resolve(Buffer.concat(chunks)));
    });
}

const photos = {
    get backend(){ return get().name; },
    bucket: bucketName,
    put: (name, buf, mime) => get().put(name, buf, mime),
    has: name => get().has(name),
    stream: name => get().stream(name),
    read: readAll
};

module.exports = photos;
