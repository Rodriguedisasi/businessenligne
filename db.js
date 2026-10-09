/* ==========================================================
   BUSINESSENLIGNE — COUCHE BASE DE DONNÉES
   -------------------------------------
   Utilise SQLite (node:sqlite, intégré à Node) si disponible,
   sinon un fichier JSON. Interface identique dans les deux cas :
       all(table, where, opts)   one(table, where)
       insert(table, obj)        update(table, id, patch)
       remove(table, where)      count(table, where)
   ========================================================== */
/* ---- Modules natifs Node (aucune installation requise) ---- */
const fs   = require('fs');    // fichiers : lire/écrire boutique.json, créer le dossier data/
const path = require('path');  // chemins : joindre __dirname + 'data' quel que soit l'OS

/* ---- Emplacement des fichiers de données ----
   DATA_DIR est lisible depuis l'environnement : en hébergement, la base vit
   sur un disque persistant monté par la plateforme, pas dans le code déployé. */
const DATA_DIR  = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(__dirname, 'data');  // dossier de stockage
const DB_FILE   = path.join(DATA_DIR, 'boutique.db');   // base SQLite (moteur préféré)
const JSON_FILE = path.join(DATA_DIR, 'boutique.json'); // repli si SQLite absent

/* ---- Moteur SQLite optionnel ----
   Importé dans un try/catch : disponible à partir de Node 22.5.
   S'il manque, on bascule silencieusement sur le fichier JSON. */
let sqlite = null;
try { sqlite = require('node:sqlite'); } catch (e) { /* Node trop ancien */ }

/* Le dossier de données n'est créé que le jour où on s'en sert.
   En conteneur (App Hosting, Cloud Run) le code déployé est en lecture
   seule : créer ce dossier au chargement ferait échouer le require() et
   donc tout le serveur, alors que la base est Firestore et n'a besoin
   d'aucun fichier local. C'est donc volontairement différé et tolérant
   à l'échec — seul le moteur local vérifiera realmente le dossier. */
function ensureDataDir(){
    if (fs.existsSync(DATA_DIR)) return true;
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); return true; }
    catch (e) { return false; }
}

/* ---------------- Requêtes SQL de création ---------------- */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT    NOT NULL UNIQUE,
    email         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    salt          TEXT    NOT NULL,
    shop_name     TEXT    NOT NULL,
    shop_desc     TEXT    NOT NULL DEFAULT '',
    shop_city     TEXT    NOT NULL DEFAULT 'Lubumbashi',
    phone         TEXT    NOT NULL DEFAULT '',
    avatar        TEXT    NOT NULL DEFAULT '',
    banner        TEXT    NOT NULL DEFAULT '',
    is_admin      INTEGER NOT NULL DEFAULT 0,
    banned        INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    NOT NULL,
    /* ---------- fiche détaillée de la boutique ----------
       Volontairement des colonnes simples (texte / nombre) : la même
       structure marche sur SQLite, sur le fichier JSON de repli et sur
       Firestore, sansConversion ni requête spécifique par moteur.
       Les listes (catégories, paiements, atouts, photos) sont stockées
       en texte séparé par des virgules ou des « | ». */
    shop_slogan      TEXT    NOT NULL DEFAULT '',
    shop_cats        TEXT    NOT NULL DEFAULT '',
    shop_about       TEXT    NOT NULL DEFAULT '',
    shop_address     TEXT    NOT NULL DEFAULT '',
    shop_landmark    TEXT    NOT NULL DEFAULT '',
    shop_email       TEXT    NOT NULL DEFAULT '',
    shop_whatsapp    TEXT    NOT NULL DEFAULT '',
    shop_facebook    TEXT    NOT NULL DEFAULT '',
    shop_instagram   TEXT    NOT NULL DEFAULT '',
    shop_tiktok      TEXT    NOT NULL DEFAULT '',
    shop_youtube     TEXT    NOT NULL DEFAULT '',
    shop_website     TEXT    NOT NULL DEFAULT '',
    shop_hours       TEXT    NOT NULL DEFAULT '',
    shop_delivery    INTEGER NOT NULL DEFAULT 0,
    shop_pickup      INTEGER NOT NULL DEFAULT 0,
    shop_delivery_time TEXT  NOT NULL DEFAULT '',
    shop_delivery_fee  TEXT  NOT NULL DEFAULT '',
    shop_delivery_zones TEXT  NOT NULL DEFAULT '',
    shop_free_delivery TEXT  NOT NULL DEFAULT '',
    shop_payments    TEXT    NOT NULL DEFAULT '',
    shop_returns     INTEGER NOT NULL DEFAULT 0,
    shop_return_days TEXT    NOT NULL DEFAULT '',
    shop_warranty    TEXT    NOT NULL DEFAULT '',
    shop_features    TEXT    NOT NULL DEFAULT '',
    shop_founded     TEXT    NOT NULL DEFAULT '',
    shop_legal       TEXT    NOT NULL DEFAULT '',
    shop_gallery     TEXT    NOT NULL DEFAULT '',
    shop_verified    INTEGER NOT NULL DEFAULT 0,
    /* ---------- Suspension de la boutique seule ----------
       Distincte de « banned », qui coupe le compte entier. Ici le vendeur
       garde son accès : c'est sa vitrine, ses publications et ses envois de
       photos qui sont bloqués, le temps que l'administration corrige. */
    shop_suspended       INTEGER NOT NULL DEFAULT 0,
    shop_suspended_reason TEXT   NOT NULL DEFAULT '',
    shop_suspended_at     TEXT   NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id    INTEGER NOT NULL,
    title       TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    price       INTEGER NOT NULL,
    old_price   INTEGER,
    stock       INTEGER NOT NULL DEFAULT 10,
    image       TEXT    NOT NULL DEFAULT '',
    images      TEXT    NOT NULL DEFAULT '',
    details     TEXT    NOT NULL DEFAULT '',
    description TEXT    NOT NULL DEFAULT '',
    badge       TEXT    NOT NULL DEFAULT '',
    prime       INTEGER NOT NULL DEFAULT 0,
    rating      REAL    NOT NULL DEFAULT 4.3,
    reviews     INTEGER NOT NULL DEFAULT 0,
    published   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT    NOT NULL
);
CREATE TABLE IF NOT EXISTS likes (
    user_id    INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, product_id)
);
CREATE TABLE IF NOT EXISTS orders (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER,
    ref        TEXT    NOT NULL,
    total      INTEGER NOT NULL,
    items      TEXT    NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'Confirmée',
    created_at TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_prod_owner  ON products(owner_id);
CREATE INDEX IF NOT EXISTS idx_prod_cat    ON products(category);
CREATE INDEX IF NOT EXISTS idx_likes_prod  ON likes(product_id);
CREATE INDEX IF NOT EXISTS idx_sess_user   ON sessions(user_id);
`;

/* ==========================================================
   MIGRATIONS
   Ajoute les colonnes manquantes sur une base deja creeee.
   ========================================================== */
const MIGRATIONS = {
    users: [
        ['is_admin', 'INTEGER NOT NULL DEFAULT 0'],
        ['banned',    'INTEGER NOT NULL DEFAULT 0'],
        /* Fiche détaillée de la boutique — voir le commentaire du SCHEMA.
           Une colonne absente est ajoutée telle quelle, avec sa valeur par
           défaut : les boutiques déjà enregistrées gardent toutes leurs
           informations et apparaissent simplement comme « à compléter ». */
        ['shop_slogan',        "TEXT NOT NULL DEFAULT ''"],
        ['shop_cats',          "TEXT NOT NULL DEFAULT ''"],
        ['shop_about',         "TEXT NOT NULL DEFAULT ''"],
        ['shop_address',       "TEXT NOT NULL DEFAULT ''"],
        ['shop_landmark',      "TEXT NOT NULL DEFAULT ''"],
        ['shop_email',         "TEXT NOT NULL DEFAULT ''"],
        ['shop_whatsapp',      "TEXT NOT NULL DEFAULT ''"],
        ['shop_facebook',      "TEXT NOT NULL DEFAULT ''"],
        ['shop_instagram',     "TEXT NOT NULL DEFAULT ''"],
        ['shop_tiktok',        "TEXT NOT NULL DEFAULT ''"],
        ['shop_youtube',       "TEXT NOT NULL DEFAULT ''"],
        ['shop_website',       "TEXT NOT NULL DEFAULT ''"],
        ['shop_hours',         "TEXT NOT NULL DEFAULT ''"],
        ['shop_delivery',      'INTEGER NOT NULL DEFAULT 0'],
        ['shop_pickup',        'INTEGER NOT NULL DEFAULT 0'],
        ['shop_delivery_time', "TEXT NOT NULL DEFAULT ''"],
        ['shop_delivery_fee',  "TEXT NOT NULL DEFAULT ''"],
        ['shop_delivery_zones',"TEXT NOT NULL DEFAULT ''"],
        ['shop_free_delivery', "TEXT NOT NULL DEFAULT ''"],
        ['shop_payments',      "TEXT NOT NULL DEFAULT ''"],
        ['shop_returns',       'INTEGER NOT NULL DEFAULT 0'],
        ['shop_return_days',   "TEXT NOT NULL DEFAULT ''"],
        ['shop_warranty',      "TEXT NOT NULL DEFAULT ''"],
        ['shop_features',      "TEXT NOT NULL DEFAULT ''"],
        ['shop_founded',       "TEXT NOT NULL DEFAULT ''"],
        ['shop_legal',         "TEXT NOT NULL DEFAULT ''"],
        ['shop_gallery',       "TEXT NOT NULL DEFAULT ''"],
        ['shop_verified',      'INTEGER NOT NULL DEFAULT 0'],
        ['shop_suspended',       'INTEGER NOT NULL DEFAULT 0'],
        ['shop_suspended_reason',"TEXT NOT NULL DEFAULT ''"],
        ['shop_suspended_at',    "TEXT NOT NULL DEFAULT ''"]
    ],
    products: [
        ['images', "TEXT NOT NULL DEFAULT ''"],
        ['details', "TEXT NOT NULL DEFAULT ''"]
    ],
    orders: [
        ['payment', "TEXT NOT NULL DEFAULT ''"]
    ]
};

function migrate(db){
    for (const [table, cols] of Object.entries(MIGRATIONS)){
        let existing = [];
        try { existing = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name); }
        catch (e) { continue; }
        for (const [name, def] of cols){
            if (!existing.includes(name)){
                try { db.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${def}`); }
                catch (e) { console.error('[migration]', table, name, e.message); }
            }
        }
    }
}

/* ==========================================================
   MOTEUR SQLITE
   ========================================================== */
function makeSqliteDriver(){
    if (!ensureDataDir())
        throw new Error("Impossible de créer le dossier de données « " + DATA_DIR + " » (système de fichiers en lecture seule ?). Renseignez DATA_DIR vers un dossier inscriptible, ou utilisez DB_DRIVER=firebase.");
    const db = new sqlite.DatabaseSync(DB_FILE);
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec(SCHEMA);
    migrate(db);

    const whereSQL = (where) => {
        const keys = Object.keys(where || {});
        if (!keys.length) return { sql: '', args: [] };
        return {
            sql: ' WHERE ' + keys.map(k => `${k} = ?`).join(' AND '),
            args: keys.map(k => norm(where[k]))
        };
    };

    const norm = v => (typeof v === 'boolean' ? (v ? 1 : 0) : v);

    const driver = {
        driver: 'sqlite',
        all(table, where = {}, opts = {}){
            const w = whereSQL(where);
            let sql = `SELECT * FROM ${table}${w.sql}`;
            if (opts.orderBy) sql += ` ORDER BY ${opts.orderBy}`;
            if (opts.limit)  sql += ` LIMIT ${Number(opts.limit)}`;
            if (opts.offset) sql += ` LIMIT -1 OFFSET ${Number(opts.offset)}`;
            return db.prepare(sql).all(...w.args);
        },
        one(table, where = {}){
            const w = whereSQL(where);
            return db.prepare(`SELECT * FROM ${table}${w.sql} LIMIT 1`).get(...w.args);
        },
        insert(table, obj){
            const keys = Object.keys(obj);
            const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`;
            const r = db.prepare(sql).run(...keys.map(k => norm(obj[k])));
            try { return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(Number(r.lastInsertRowid)); }
            catch (e) { return { ...obj }; }   // tables sans colonne id (likes)
        },
        insertMany(table, rows){
            db.exec('BEGIN');
            try {
                const out = rows.map(r => driver.insert(table, r));
                db.exec('COMMIT');
                return out;
            } catch (e){
                db.exec('ROLLBACK');
                throw e;
            }
        },
        update(table, id, patch){
            const keys = Object.keys(patch);
            if (!keys.length) return this.one(table, { id });
            const sql = `UPDATE ${table} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
            db.prepare(sql).run(...keys.map(k => norm(patch[k])), id);
            return this.one(table, { id });
        },
        remove(table, where){
            const w = whereSQL(where);
            const r = db.prepare(`DELETE FROM ${table}${w.sql}`).run(...w.args);
            return Number(r.changes);
        },
        count(table, where = {}){
            const w = whereSQL(where);
            return Number(db.prepare(`SELECT COUNT(*) AS n FROM ${table}${w.sql}`).get(...w.args).n);
        },
        reset(){
            ['likes', 'orders', 'products', 'sessions', 'users'].forEach(t => db.exec(`DELETE FROM ${t}`));
            db.exec("DELETE FROM sqlite_sequence WHERE name IN ('products','orders')");
        }
    };

    return driver;
}

/* ==========================================================
   MOTEUR JSON (repli)
   ========================================================== */
function makeJsonDriver(){
    if (!ensureDataDir())
        throw new Error("Impossible de créer le dossier de données « " + DATA_DIR + " » (système de fichiers en lecture seule ?). Renseignez DATA_DIR vers un dossier inscriptible, ou utilisez DB_DRIVER=firebase.");
    const EMPTY = { users: [], sessions: [], products: [], likes: [], orders: [], seq: { products: 0, orders: 0 } };
    let db = fs.existsSync(JSON_FILE) ? JSON.parse(fs.readFileSync(JSON_FILE, 'utf8')) : JSON.parse(JSON.stringify(EMPTY));
    ['users', 'sessions', 'products', 'likes', 'orders'].forEach(t => { if (!db[t]) db[t] = []; });
    if (!db.seq) db.seq = { products: 0, orders: 0 };

    const save = () => fs.writeFileSync(JSON_FILE, JSON.stringify(db, null, 2));
    const match = (row, where) => Object.entries(where || {}).every(([k, v]) => row[k] === v);
    const order = (rows, spec) => {
        if (!spec) return rows;
        const [col, dir = 'ASC'] = spec.split(' ');
        return rows.slice().sort((a, b) => (a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) * (dir === 'DESC' ? -1 : 1));
    };

    return {
        driver: 'json',
        all(table, where = {}, opts = {}){
            let rows = order(db[table].filter(r => match(r, where)), opts.orderBy);
            if (opts.offset) rows = rows.slice(opts.offset);
            if (opts.limit) rows = rows.slice(0, opts.limit);
            return rows;
        },
        one(table, where = {}){ return db[table].find(r => match(r, where)); },
        insert(table, obj){
            const id = obj.id !== undefined ? obj.id : (db.seq[table] = (db.seq[table] || 0) + 1);
            if (obj.id !== undefined && obj.id > (db.seq[table] || 0)) db.seq[table] = obj.id;
            const row = { id, ...obj };
            db[table].push(row);
            save();
            return row;
        },
        insertMany(table, rows){ return rows.map(r => this.insert(table, r)); },
        update(table, id, patch){
            const row = db[table].find(r => r.id === id);
            if (row){ Object.assign(row, patch); save(); }
            return row;
        },
        remove(table, where){
            const before = db[table].length;
            db[table] = db[table].filter(r => !match(r, where));
            save();
            return before - db[table].length;
        },
        count(table, where = {}){ return db[table].filter(r => match(r, where)).length; },
        reset(){
            db = JSON.parse(JSON.stringify(EMPTY));
            save();
        }
    };
}

/* ==========================================================
   CHOIX DU MOTEUR
   ------------------------------------------------------------
   DB_DRIVER=auto      (défaut) Firestore si des identifiants sont
                       présents sur le disque, sinon SQLite/JSON
   DB_DRIVER=firebase  Firestore obligatoire : le serveur refuse de
                       démarrer si les identifiants manquent
   DB_DRIVER=local     SQLite/JSON, Firebase totalement ignoré
   ========================================================== */
function createLocalDriver(){ return sqlite ? makeSqliteDriver() : makeJsonDriver(); }

/* Détecte une fonction sans serveur persistant (Vercel, Cloud Functions,
   App Hosting). process.exit() y tue la fonction entière : chaque requête
   répond alors « FUNCTION_INVOCATION_FAILED », sans le moindre journal. */
function isServerless(){
    return !!(process.env.VERCEL
        || process.env.AWS_LAMBDA_FUNCTION_NAME
        || process.env.FUNCTION_TARGET
        || process.env.K_SERVICE);
}

/* Pilote de secours : la base n'a pas pu être ouverte, mais le site doit
   rester lisible. Chaque appel échoue avec un message qui explique la cause,
   ce qui la remonte dans les journaux de la plateforme. */
function makeDownDriver(reason){
    const fail = () => {
        const e = new Error(reason);
        e.status = 503;
        return Promise.reject(e);
    };
    const down = { driver: 'indisponible', projectId: null };
    ['all', 'one', 'insert', 'insertMany', 'update', 'remove', 'count', 'reset', 'query', 'tx']
        .forEach(name => { down[name] = fail; });
    return down;
}

function createFirestoreDriver(){
    /* Chargé à la demande : Firestore n'est utile que si des identifiants
       sont présents, inutile de payer son chargement en mode local. */
    const firestore = require('./db-firestore');
    if (!firestore.isAvailable()){
        const why = firestore.unavailableReason ? firestore.unavailableReason() : 'identifiants Firebase introuvables';
        throw new Error(why + ' — lancez « npm run firebase:check » pour le diagnostic');
    }
    return firestore.initFirestore();
}

function pickDriver(){
    const want = String(process.env.DB_DRIVER || 'auto').toLowerCase();
    if (want !== 'local'){
        try { return createFirestoreDriver(); }
        catch (e){
            if (want === 'firebase'){
                console.error('\n  ❌ ' + e.message + '\n');
                /* En fonction serveurless, tuer le processus fait échouer
                   toutes les requêtes sans explication : on garde donc le
                   site en ligne et l'erreur est renvoyée à chaque appel. */
                if (isServerless())
                    return makeDownDriver('Base de données indisponible : ' + e.message);
                console.error('     1. Console Firebase → Paramètres du projet → Comptes de service');
                console.error('     2. « Générer une clé privée » (format JSON)');
                console.error('     3. Renommez le fichier téléchargé « service-account.json »');
                console.error('        et placez-le à la racine du projet :\n        ' + __dirname);
                console.error('     4. Relancez « npm run firebase:check » puis « npm run start:firebase »\n');
                process.exit(1);
            }
            console.warn('[db] ' + e.message + ' → repli sur la base locale.');
        }
    }
    return createLocalDriver();
}

const driver = pickDriver();

/* L'interface exposée est TOUJOURS asynchrone, y compris pour SQLite.
   Le code appelant utilise donc « await » partout, ce qui permet de
   passer de la base locale à Firestore sans le modifier. */
const ASYNC_METHODS = ['all', 'one', 'insert', 'insertMany', 'update', 'remove', 'count', 'reset'];

const db = { driver: driver.driver, projectId: driver.projectId || null };
ASYNC_METHODS.forEach(name => { db[name] = async (...args) => driver[name](...args); });

module.exports = db;
module.exports.DATA_DIR = DATA_DIR;
module.exports.SCHEMA = SCHEMA;
module.exports.createLocalDriver = createLocalDriver;
module.exports.createFirestoreDriver = createFirestoreDriver;
