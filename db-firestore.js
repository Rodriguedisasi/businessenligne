/* ==========================================================
   BUSINESSENLIGNE — PILOTE FIRESTORE
   -------------------------------------
   Même interface que db.js (SQLite / JSON), mais asynchrone
   car Firestore est une base réseau :

       all(table, where, opts)   one(table, where)
       insert(table, obj)        update(table, id, patch)
       remove(table, where)      count(table, where)
       reset()                   ready()

   Toutes ces méthodes renvoient une promesse : il faut les
   attendre avec « await ».

   Organisation Firestore proposée :
       users/{id}      un compte + sa boutique
       sessions/{token}
       products/{id}   owner_id, category, price, stock, likes…
       likes/{user_id_product_id}
       orders/{id}     user_id, ref, total, items (texte JSON)
   ========================================================== */
/* ---- Modules natifs Node ---- */
const fs   = require('fs');   // lecture du fichier de clé de service (JSON)
const path = require('path'); // recherche de ce fichier à la racine du projet

/* ---- SDK Firebase côté serveur ----
   Optionnel : absent, le projet bascule simplement sur la base locale. */
let admin = null;
try { admin = require('./admin-sdk'); } catch (e) { /* firebase-admin absent */ }

const CREDENTIAL_FILES = ['service-account.json', 'firebase-service-account.json'];

/* Champs indispensables à une clé de service : sans eux, l'authentification
   échoue avec un message incompréhensible côté Firebase. */
const REQUIRED_FIELDS = ['type', 'project_id', 'private_key', 'client_email'];

/* Un fichier illisible ne doit pas planter avec une erreur de syntaxe :
   on note le problème et on le restitue dans un message clair. */
let credProblem = null;
function readCredFile(file, label){
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (e){
        credProblem = (label + ' : ' + (e.code === 'ENOENT'
            ? 'fichier introuvable'
            : 'JSON invalide (' + e.message + ')'));
        return null;
    }
}

/* Identifiants automatiques : en hebergement Google (App Hosting, Cloud Run,
   Cloud Functions) aucun fichier JSON n'est necessaire : le SDK lit
   FIREBASE_CONFIG, ou le jeton du compte de service du runtime. */
function hasRuntimeCredentials(){
    return !!(process.env.FIREBASE_CONFIG
        || process.env.GOOGLE_APPLICATION_CREDENTIALS
        || process.env.GOOGLE_CLOUD_PROJECT
        || process.env.K_SERVICE
        || process.env.GAE_ENV
        || process.env.FUNCTION_TARGET);
}

/* Cherche les identifiants : variable d'environnement ou fichier JSON */
function findCredentials(){
    credProblem = null;
    if (process.env.FIREBASE_SERVICE_ACCOUNT){
        const c = readCredFileFrom(process.env.FIREBASE_SERVICE_ACCOUNT, 'FIREBASE_SERVICE_ACCOUNT');
        if (c) return c;
    }
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS))
        return readCredFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, process.env.GOOGLE_APPLICATION_CREDENTIALS);
    for (const f of CREDENTIAL_FILES){
        const p = path.join(__dirname, f);
        if (fs.existsSync(p)) return readCredFile(p, f);
    }
    return null;
}
function readCredFileFrom(text, label){
    try { return JSON.parse(text); }
    catch (e){ credProblem = label + ' : JSON invalide (' + e.message + ')'; return null; }
}

/* Liste les champs manquants / suspects d'une clé de service. */
function inspectCredentials(cred){
    const issues = [];
    if (!cred || typeof cred !== 'object') return ['le contenu n\'est pas un objet JSON'];
    for (const f of REQUIRED_FIELDS){
        if (!cred[f] || typeof cred[f] !== 'string' || !cred[f].trim())
            issues.push('champ « ' + f + ' » manquant');
    }
    /* la clé privée doit contenir de vrais retours à la ligne : une clé
       recopiée à la main depuis un mail les contient souvent comme « \n » */
    if (typeof cred.private_key === 'string' && cred.private_key.includes('\\n'))
        issues.push('la clé privée contient des « \\n » littéraux : elle doit être un fichier JSON de la console Firebase, ou la clé doit être re-collée avec de vrais retours à la ligne');
    if (cred.type && cred.type !== 'service_account')
        issues.push('« type » vaut « ' + cred.type + ' » au lieu de « service_account »');
    return issues;
}

const isAvailable = () => admin.isInstalled() && (!!findCredentials() || hasRuntimeCredentials());

/* Collections Firestore : documents dont l'id est numérique auto-incrémenté */
const NUMERIC = new Set(['users', 'products', 'orders']);
const PAIR    = new Set(['likes']);

function docId(table, obj){
    if (PAIR.has(table)) return `${obj.user_id}_${obj.product_id}`;
    if (NUMERIC.has(table)) return String(obj.id);
    return String(obj.token ?? obj[keyOf(table)] ?? '');
}
const keyOf = table => ({ sessions: 'token' }[table] || 'id');

/* Le champ « id » est stocké dans le document (Firestore ne l'ajoute pas) */
function withId(table, doc){
    if (!doc) return undefined;
    if (NUMERIC.has(table) || PAIR.has(table)) return { ...doc, id: Number(doc.id) };
    return doc;
}

/* Firestore limite chaque lot à 500 opérations : on découpe. */
const BATCH_LIMIT = 400;

function makeFirestoreDriver(firestore){
    try { firestore.settings({ ignoreUndefinedProperties: true }); }
    catch (e){ /* instance déjà démarrée : réglage sans effet */ }

    const col = table => firestore.collection(table);
    const ref = (table, id) => col(table).doc(String(id));

    /* Exécute des écritures par morceaux. Chaque entrée est
       { ref, data } pour une écriture, { ref, del:true } pour une suppression. */
    async function commit(writes){
        for (let i = 0; i < writes.length; i += BATCH_LIMIT){
            const batch = firestore.batch();
            writes.slice(i, i + BATCH_LIMIT).forEach(w => {
                if (w.del) batch.delete(w.ref); else batch.set(w.ref, w.data);
            });
            await batch.commit();
        }
        return writes.length;
    }

    /* Firestore n'ordonne pas : on filtre puis on trie en mémoire.
       Le catalogue reste petit (quelques centaines d'articles). */
    const SORTABLE = {
        users:     [{ field: 'created_at', dir: 'desc' }],
        products:  [{ field: 'created_at', dir: 'desc' }],
        orders:    [{ field: 'created_at', dir: 'desc' }],
        sessions:  [{ field: 'created_at', dir: 'desc' }],
        likes:     [{ field: 'created_at', dir: 'desc' }]
    };

    function matches(doc, where){
        return Object.entries(where || {}).every(([k, v]) => {
            const actual = doc[k];
            if (v === null || v === undefined) return actual === null || actual === undefined;
            if (typeof v === 'boolean') return Boolean(actual) === v;
            return actual === v;
        });
    }

    function order(rows, spec){
        if (!spec) return rows;
        const [col, dir = 'ASC'] = spec.split(' ');
        const sign = dir.toUpperCase() === 'DESC' ? -1 : 1;
        return rows.slice().sort((a, b) => {
            const x = a[col], y = b[col];
            if (x === y) return 0;
            if (x === undefined || x === null) return 1;
            if (y === undefined || y === null) return -1;
            return (x > y ? 1 : -1) * sign;
        });
    }

    /* prochain identifiant numérique libre */
    async function nextId(table){
        const snap = await col(table).get();
        const ids = snap.docs.map(d => Number(d.id)).filter(n => Number.isFinite(n));
        return (ids.length ? Math.max(...ids) : 0) + 1;
    }

    const driver = {
        driver: 'firestore',
        projectId: firestore.projectId || process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || '',

        async all(table, where = {}, opts = {}){
            const snap = await col(table).get();
            let rows = snap.docs.map(d => withId(table, d.data()));
            if (Object.keys(where).length) rows = rows.filter(r => matches(r, where));
            rows = order(rows, opts.orderBy);
            if (opts.offset) rows = rows.slice(opts.offset);
            if (opts.limit)  rows = rows.slice(0, opts.limit);
            return rows;
        },

        async one(table, where = {}){
            /* chemin rapide : la clé du document est souvent connue */
            if (where.token) { const s = await ref('sessions', where.token).get(); return s.exists ? withId('sessions', s.data()) : undefined; }
            if (table === 'likes' && where.user_id != null && where.product_id != null){
                const s = await ref('likes', `${where.user_id}_${where.product_id}`).get();
                return s.exists ? withId('likes', s.data()) : undefined;
            }
            if (NUMERIC.has(table) && where.id != null && Object.keys(where).length === 1){
                const s = await ref(table, where.id).get();
                return s.exists ? withId(table, s.data()) : undefined;
            }
            const rows = await driver.all(table, where, { limit: 1 });
            return rows[0];
        },

        async insert(table, obj){
            let row = { ...obj };
            if (NUMERIC.has(table) && row.id === undefined) row.id = await nextId(table);
            const id = docId(table, row);
            await ref(table, id).set(row);
            return row;
        },

        async insertMany(table, rows){
            if (!rows.length) return [];
            const writes = [];
            for (const obj of rows){
                const row = { ...obj };
                if (NUMERIC.has(table) && row.id === undefined) row.id = await nextId(table);
                writes.push({ ref: ref(table, docId(table, row)), data: row });
            }
            await commit(writes);
            return rows;
        },

        async update(table, id, patch){
            await ref(table, id).set(patch, { merge: true });
            const s = await ref(table, id).get();
            return withId(table, s.data());
        },

        async remove(table, where = {}){
            const rows = await driver.all(table, where);
            if (!rows.length) return 0;
            await commit(rows.map(r => ({
                ref: ref(table, PAIR.has(table) ? `${r.user_id}_${r.product_id}` : r.id),
                del: true
            })));
            return rows.length;
        },

        async count(table, where = {}){
            if (!Object.keys(where).length){
                const snap = await col(table).count().get();
                return snap.data().count;
            }
            return (await driver.all(table, where)).length;
        },

        async reset(){
            for (const table of ['likes', 'orders', 'products', 'sessions', 'users']){
                const snap = await col(table).get();
                await commit(snap.docs.map(d => ({ ref: d.ref, del: true })));
            }
        }
    };

    return driver;
}

/* ==========================================================
   INITIALISATION
   ========================================================== */
/* La base par défaut s'appelle « (default) » ; le nom reste configurable
   pour un projet qui en héberge plusieurs. */
const DATABASE_ID = () => process.env.FIRESTORE_DATABASE || '(default)';

/* L'instance Firestore brute, prête à l'emploi. Elle est mémoïsée : une
   seule connexion réseau pour tout le serveur, partagée par le pilote et
   par le module de stockage des photos. */
let instance = null;
function createFirestore(){
    if (instance) return instance;
    if (!admin.isInstalled() && !admin.LEGACY) throw new Error('firebase-admin n\'est pas installé (npm install firebase-admin)');

    const credentials = findCredentials();

    if (credentials){
        const issues = inspectCredentials(credentials);
        if (issues.length) throw new Error('Identifiants Firebase incomplets — ' + issues.join(' ; '));

        /* une clé privée recopiée à la main garde parfois des « \n » littéraux */
        const cert = { ...credentials };
        if (cert.private_key.includes('\\n')) cert.private_key = cert.private_key.replace(/\\n/g, '\n');

        instance = admin.firestore({
            projectId: cert.project_id,
            credentials: { client_email: cert.client_email, private_key: cert.private_key },
            databaseId: DATABASE_ID()
        });
        return instance;
    }

    /* Hebergement Google (App Hosting, Cloud Run…) : aucun fichier JSON, les
       identifiants viennent du compte de service du runtime. Il faut seulement
       désigner le projet, sinon le SDK ne sait pas où se connecter. */
    if (hasRuntimeCredentials()){
        instance = admin.firestore({
            projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || undefined,
            databaseId: DATABASE_ID()
        });
        return instance;
    }

    throw new Error(credProblem
        ? 'Identifiants Firebase illisibles — ' + credProblem
        : 'Aucun identifiant Firebase trouvé (service-account.json attendu)');
}

const initFirestore = () => makeFirestoreDriver(createFirestore());

module.exports = { initFirestore, createFirestore, isAvailable, findCredentials, hasRuntimeCredentials, inspectCredentials, REQUIRED_FIELDS, CREDENTIAL_FILES, DATABASE_ID };
