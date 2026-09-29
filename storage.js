/* ==========================================================
   BUSINESSENLIGNE — STOCKAGE DES PHOTOS
   ------------------------------------------------------------
   Les images publiées par les vendeurs passent par une seule et
   même interface, deux moteurs possibles :

     disque local   uploads/ sur la machine (dev, poste local) ;
     Cloud Storage  bucket Google, seul fiable en hébergement car
                    le disque d'un conteneur est effacé à chaque
                    déploiement.

   Le moteur est choisi au premier accès : Cloud Storage dès qu'un
   bucket est déclaré, disque local sinon. L'URL publique reste
   /uploads/<fichier> dans les deux cas, donc rien ne change dans
   la base ni sur le site.
   ========================================================== */
const fs   = require('fs');
const path = require('path');

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
    try { admin = require('firebase-admin'); }
    catch (e){ console.warn('[photos] firebase-admin absent — photos en disque local'); return null; }

    try {
        /* Si la base Firestore a déjà démarré l'application admin, on la réutilise :
           elle porte alors les identifiants de la clé de service. Sinon App Hosting
           fournit FIREBASE_CONFIG ou le jeton du compte de service du runtime. */
        if (!admin.apps.length) admin.initializeApp();
        const store = admin.storage().bucket(bucket);
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

/* Choix différé : le module peut être chargé avant que l'environnement
   soit prêt (variables FIREBASE_CONFIG lues plus tard). */
let backend = null;
function get(){
    if (backend) return backend;
    if (String(process.env.STORAGE_DRIVER || 'auto').toLowerCase() !== 'local'){
        const bucket = bucketName();
        if (bucket) backend = cloudBackend(bucket) || localBackend;
        else console.warn('[photos] aucun bucket déclaré (STORAGE_BUCKET) — photos en disque local');
    }
    if (!backend) backend = localBackend;
    if (backend === localBackend) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    return backend;
}

const photos = {
    get backend(){ return get().name; },
    bucket: bucketName,
    put: (name, buf, mime) => get().put(name, buf, mime),
    has: name => get().has(name),
    stream: name => get().stream(name)
};

module.exports = photos;
