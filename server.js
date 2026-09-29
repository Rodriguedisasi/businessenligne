/* ==========================================================
   BUSINESSENLIGNE — SERVEUR
   node server.js      puis ouvrir  http://localhost:3000
   Aucune dépendance externe à installer.
   ========================================================== */
/* ---- Modules natifs Node : le serveur n'a AUCUNE dépendance à installer ---- */
const http   = require('http');   // création du serveur web et routage des requêtes
const fs     = require('fs');     // fichiers statiques (HTML/CSS/JS), dossier uploads/, images
const path   = require('path');   // construire des chemins URL -> disque sans failles de traversée
const crypto = require('crypto'); // hachage scrypt des mots de passe et jetons de session

/* ---- Couche base de données (SQLite / JSON / Firestore, interface unique) ---- */
const db = require('./db');

/* ---- Stockage des photos (disque local ou Cloud Storage) ---- */
const photos = require('./storage');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;


/* HTTPS est assuré par la plateforme (Railway, Fly…) qui termine le certificat
   et transmet l'en-tête X-Forwarded-Proto. Le cookie de session ne doit
   alors jamais être renvoyé en clair. */
const HTTPS = String(process.env.HTTPS || '').toLowerCase() === 'true'
    || String(process.env.NODE_ENV || '') === 'production';

const SESSION_DAYS = 30;
const nowISO = () => new Date().toISOString();
const stamp = ms => new Date(ms).toISOString();

/* ==========================================================
   PHOTOS D'UN ARTICLE
   Un article accepte jusqu'a MAX_PHOTOS images. Le champ « image »
   reste la photo principale pour rester compatible avec tout ce
   qui existe deja ; « images » contient la galerie complete.
   ========================================================== */
const MAX_PHOTOS = 8;

/* Accepte une URL d'image « propre » : http(s) ou fichier local /uploads/ */
const isPhotoUrl = u => /^https?:\/\/\S+$/i.test(u) || /^\/uploads\/[\w.-]+$/i.test(u);

/* Normalise une liste de photos : chaines, sans doublon, MAX_PHOTOS maximum. */
function cleanPhotos(input){
    if (!Array.isArray(input)) input = input ? [input] : [];
    const out = [];
    for (const raw of input){
        if (typeof raw !== 'string') continue;
        const u = raw.trim().slice(0, 2000);
        if (!u || !isPhotoUrl(u) || out.includes(u)) continue;
        out.push(u);
        if (out.length >= MAX_PHOTOS) break;
    }
    return out;
}

/* Lit la galerie stockee (JSON en base, tableau deja pret si Firestore). */
function readPhotos(stored, fallback){
    if (Array.isArray(stored)) return cleanPhotos(stored);
    if (typeof stored === 'string' && stored){
        try { return cleanPhotos(JSON.parse(stored)); } catch (e) { /* valeur ancienne : URL simple */ }
    }
    return cleanPhotos([fallback]);
}

/* Champ « images » a stocker : JSON, la 1re photo restant aussi dans « image ». */
function photosField(photos, main){
    const list = cleanPhotos([...(photos || []), main || '']);
    return { images: JSON.stringify(list), image: list[0] || '' };
}

/* ==========================================================
   DETAILS D'UN ARTICLE
   Le vendeur decrit son article ligne par ligne : matiere, couleur,
   dimensions, etat... Chaque ligne est { k: libelle, v: valeur } et la
   liste est stockee en JSON dans le champ « details ».
   ========================================================== */
const MAX_DETAILS = 12;
const DETAIL_MAX_LEN = 60;   /* libelle */
const DETAIL_VAL_LEN = 200;  /* valeur  */

function cleanDetails(input){
    if (!Array.isArray(input)) return [];
    const out = [];
    for (const raw of input){
        if (!raw || typeof raw !== 'object') continue;
        const k = String(raw.k ?? '').replace(/\s+/g, ' ').trim().slice(0, DETAIL_MAX_LEN);
        const v = String(raw.v ?? '').replace(/\s+/g, ' ').trim().slice(0, DETAIL_VAL_LEN);
        /* une ligne sans libelle est une ligne vide : on l'ignore */
        if (!k) continue;
        out.push({ k, v });
        if (out.length >= MAX_DETAILS) break;
    }
    return out;
}

/* Lit les details stockes (JSON en base, tableau deja pret si Firestore). */
function readDetails(stored){
    if (Array.isArray(stored)) return cleanDetails(stored);
    if (typeof stored === 'string' && stored){
        try { return cleanDetails(JSON.parse(stored)); } catch (e) { /* aucun detail */ }
    }
    return [];
}
const detailsField = list => JSON.stringify(cleanDetails(list));

/* ==========================================================
   MOTS DE PASSE  (scrypt + sel)
   ========================================================== */
function hashPassword(pw, salt){
    return crypto.scryptSync(String(pw), salt, 64).toString('hex');
}
function verifyPassword(pw, salt, expected){
    const a = Buffer.from(hashPassword(pw, salt), 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const newToken = () => crypto.randomBytes(32).toString('hex');

/* ==========================================================
   OUTILS HTTP
   ========================================================== */
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf'
};

/* Ce que le site a le droit de servir au navigateur.
   Le dossier du projet contient aussi la base de données, les scripts de
   maintenance et les fichiers de configuration : sans cette liste blanche,
   n'importe qui pourrait télécharger /data/boutique.db et lire les mots de
   passe hachés. Le front ne charge aucun .json, on ne les sert donc pas. */
const PUBLIC_EXT = new Set([
    '.html', '.css',
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico',
    '.woff', '.woff2', '.ttf'
]);

/* Les seuls scripts publiés : ce sont ceux que le navigateur télécharge.
   server.js, db.js, seed.js… ne le sont pas. Si vous ajoutez un script
   pour le navigateur, ajoutez-le ici. */
const PUBLIC_JS = new Set(['api.js', 'javascript.js', 'theme.js', 'i18n.js']);

/* Dossiers jamais accessibles, même si un fichier y a une extension publique. */
const PRIVATE_DIRS = new Set(['data', 'node_modules', '.git', '.railway', 'functions']);

function json(res, code, data){
    const body = JSON.stringify(data);
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
    res.end(body);
}
const ok = (res, data) => json(res, 200, data);
const err = (res, code, message) => json(res, code, { error: message });

function readBody(req){
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on('data', c => {
            size += c.length;
            if (size > 6 * 1024 * 1024) { reject(new Error('Requête trop volumineuse')); req.destroy(); return; }
            chunks.push(c);
        });
        req.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8');
            if (!raw) return resolve({});
            try { resolve(JSON.parse(raw)); }
            catch (e) { reject(new Error('JSON invalide')); }
        });
        req.on('error', reject);
    });
}

function cookieToken(req){
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
    const ck = req.headers.cookie || '';
    const m = ck.match(/(?:^|;\s*)be_token=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
}

/* Firestore renvoie les identifiants sous forme de nombres, SQLite aussi :
   on uniformise la comparaison. */
const sameId = (a, b) => a != null && b != null && Number(a) === Number(b);

async function currentUser(req){
    const token = cookieToken(req);
    if (!token) return null;
    const session = await db.one('sessions', { token });
    if (!session) return null;
    if (new Date(session.expires_at) < new Date()){ await db.remove('sessions', { token }); return null; }
    const user = await db.one('users', { id: session.user_id });
    if (!user) return null;
    if (user.banned){ await db.remove('sessions', { token }); return null; }   /* compte suspendu */
    return { token, user };
}

/* Un administrateur a accès au tableau de surveillance */
async function requireAdmin(req, res){
    const auth = await currentUser(req);
    if (!auth){ err(res, 401, 'Non connecté'); return null; }
    if (!auth.user.is_admin){ err(res, 403, 'Accès réservé aux administrateurs'); return null; }
    return auth.user;
}

function publicUser(u){
    if (!u) return null;
    return {
        id: u.id, username: u.username, email: u.email, shopName: u.shop_name,
        shopDesc: u.shop_desc, shopCity: u.shop_city, phone: u.phone,
        avatar: u.avatar, banner: u.banner, createdAt: u.created_at,
        isAdmin: !!u.is_admin, isBanned: !!u.banned
    };
}

/* Vue complète d'un ensemble de comptes, réservée à l'administration.
   revenue = ventes de ses articles ; spent = achats effectués.
   Toutes les collections sont lues une seule fois : avec Firestore, une
   requête par compte et par article serait bien trop lent. */
async function adminUsers(users){
    if (!users.length) return [];
    const [products, orders, likes, sessions] = await Promise.all([
        db.all('products'), db.all('orders'), db.all('likes'), db.all('sessions')
    ]);

    const productsByOwner = new Map();
    for (const p of products){
        const k = Number(p.owner_id);
        if (!productsByOwner.has(k)) productsByOwner.set(k, []);
        productsByOwner.get(k).push(p);
    }

    const ordersByBuyer = new Map();
    for (const o of orders){
        if (o.user_id == null) continue;
        const k = Number(o.user_id);
        if (!ordersByBuyer.has(k)) ordersByBuyer.set(k, []);
        ordersByBuyer.get(k).push(o);
    }

    const likesGiven = new Map();
    const likesReceived = new Map();
    const ownerOf = new Map(products.map(p => [Number(p.id), Number(p.owner_id)]));
    const revenue = new Map();
    const sales = new Map();
    for (const l of likes){
        likesGiven.set(Number(l.user_id), (likesGiven.get(Number(l.user_id)) || 0) + 1);
        const seller = ownerOf.get(Number(l.product_id));
        if (seller != null) likesReceived.set(seller, (likesReceived.get(seller) || 0) + 1);
    }

    /* le vendeur d'une ligne est mémorisé ; sinon on retrace via l'article */
    for (const o of orders){
        for (const line of parseItems(o.items)){
            const seller = line.ownerId != null ? Number(line.ownerId) : ownerOf.get(Number(line.id));
            if (seller == null) continue;
            revenue.set(seller, (revenue.get(seller) || 0) + line.price * line.qty);
            sales.set(seller, (sales.get(seller) || 0) + 1);
        }
    }

    const lastLogin = new Map();
    for (const s of sessions){
        const k = Number(s.user_id);
        if (!lastLogin.has(k) || s.created_at > lastLogin.get(k)) lastLogin.set(k, s.created_at);
    }

    return users.map(u => {
        const id = Number(u.id);
        const products = productsByOwner.get(id) || [];
        const orders = ordersByBuyer.get(id) || [];
        return {
            ...publicUser(u),
            isAdmin: !!u.is_admin,
            banned: !!u.banned,
            lastLogin: lastLogin.get(id) || null,
            productCount: products.length,
            likesReceived: likesReceived.get(id) || 0,
            likesGiven: likesGiven.get(id) || 0,
            orderCount: orders.length,
            revenue: revenue.get(id) || 0,
            sales: sales.get(id) || 0,
            spent: orders.reduce((s, o) => s + o.total, 0),
            stockTotal: products.reduce((s, p) => s + p.stock, 0)
        };
    });
}

/* Cas d'un seul compte */
const adminUser = async u => (await adminUsers([u]))[0];

/* Suppression en cascade d'un compte et de tout ce qui s'y rattache :
   ses articles, les J'aime reçus, ses J'aime, ses commandes et ses sessions. */
async function deleteUserCascade(id){
    for (const p of await db.all('products', { owner_id: id })) await db.remove('likes', { product_id: p.id });
    await db.remove('likes', { user_id: id });
    await db.remove('products', { owner_id: id });
    await db.remove('orders', { user_id: id });
    await db.remove('sessions', { user_id: id });
    await db.remove('users', { id });
}

/* Mise en forme d'un article ; likes/likedByMe/owner sont fournis par l'appelant
   (voir decorateAll) afin d'éviter une requête par article. */
function shapeProduct(p, likes, likedByMe, owner){
    const off = p.old_price ? Math.round((1 - p.price / p.old_price) * 100) : 0;
    return {
        id: p.id, title: p.title, cat: p.category, price: p.price, oldPrice: p.old_price || null,
        off, stock: p.stock, image: p.image, images: readPhotos(p.images, p.image), desc: p.description, badge: p.badge,
        details: readDetails(p.details),
        prime: !!p.prime, rating: p.rating, reviews: p.reviews, createdAt: p.created_at,
        likes, likedByMe,
        published: p.published === undefined ? 1 : !!p.published,
        owner: owner ? { username: owner.username, shopName: owner.shop_name, avatar: owner.avatar, city: owner.shop_city } : null
    };
}

/* Un seul article */
async function decorate(p, meId){
    const [owner, likes, mine] = await Promise.all([
        db.one('users', { id: p.owner_id }),
        db.count('likes', { product_id: p.id }),
        meId ? db.one('likes', { user_id: meId, product_id: p.id }) : null
    ]);
    return shapeProduct(p, likes, !!mine, owner);
}

/* Une liste d'articles : lectures groupées au lieu de 2 requêtes par article. */
async function decorateAll(rows, meId){
    if (!rows.length) return [];
    const [owners, allLikes] = await Promise.all([
        Promise.all([...new Set(rows.map(p => p.owner_id))].map(id => db.one('users', { id }))),
        db.all('likes', {})
    ]);
    const ownerById = new Map();
    owners.forEach(o => { if (o) ownerById.set(Number(o.id), o); });
    const counts = new Map();
    for (const l of allLikes) counts.set(Number(l.product_id), (counts.get(Number(l.product_id)) || 0) + 1);
    const mine = new Set(meId
        ? allLikes.filter(l => sameId(l.user_id, meId)).map(l => Number(l.product_id))
        : []);
    return rows.map(p => shapeProduct(p, counts.get(Number(p.id)) || 0, mine.has(Number(p.id)), ownerById.get(Number(p.owner_id)) || null));
}

/* Les articles d'une commande sont stockés en JSON dans le document ;
   une donnée corrompue ne doit pas faire échouer toute la requête. */
const parseItems = json => { try { return JSON.parse(json) || []; } catch (e){ return []; } };

async function buildOrderLines(items){
    let total = 0;
    const lines = [];
    for (const it of items){
        const p = await db.one('products', { id: Number(it.id) });
        if (!p) continue;
        const qty = Math.max(1, Math.min(99, Math.round(Number(it.qty) || 1)));
        total += p.price * qty;
        lines.push({ id: p.id, title: p.title, price: p.price, qty, image: p.image, ownerId: p.owner_id });
    }
    return { total, lines };
}

const newOrderRef = () => 'BE-' + Date.now().toString().slice(-8) + '-' + Math.floor(Math.random() * 90 + 10);

/* ==========================================================
   ROUTES API
   ========================================================== */
const routes = {

    /* ---------- SANTÉ ---------- */
    'GET /api/health': async (req, res) => {
        const [users, products, likes, orders] = await Promise.all([
            db.count('users'), db.count('products'), db.count('likes'), db.count('orders')
        ]);
        ok(res, { ok: true, driver: db.driver, projectId: db.projectId, users, products, likes, orders });
    },

    /* ---------- COMPTES ----------
       Inscription possible avec le simple email (comme sur Amazon) :
       l'identifiant et le nom de la boutique sont déduits de l'email. */
    'POST /api/register': async (req, res) => {
        const body = await readBody(req);
        const { password } = body;
        const username = body.username === undefined ? '' : String(body.username).trim();
        const email = body.email === undefined ? '' : String(body.email).trim();
        const shopName = body.shopName === undefined ? '' : String(body.shopName).trim();
        const shopDesc = body.shopDesc || '';
        const city = body.city || '';
        const phone = body.phone || '';

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
            return err(res, 400, 'Adresse email invalide');
        if (!password || String(password).length < 6)
            return err(res, 400, 'Le mot de passe doit contenir au moins 6 caractères');

        const mail = email.toLowerCase();
        if (await db.one('users', { email: mail })) return err(res, 409, 'Cet email est déjà utilisé');

        /* --- identifiant : fourni, ou déduit de la partie avant l'@ --- */
        let uname, generated = {};
        if (username){
            if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(username))
                return err(res, 400, "Identifiant invalide (3 à 20 caractères : lettres, chiffres, . _ -)");
            uname = username.toLowerCase();
            if (await db.one('users', { username: uname })) return err(res, 409, 'Cet identifiant est déjà pris');
        } else {
            const local = mail.split('@')[0].replace(/[^a-z0-9_.-]/g, '').slice(0, 14) || 'client';
            uname = local;
            if (await db.one('users', { username: uname })){
                uname = local.slice(0, 15) + Math.floor(Math.random() * 9000 + 1000);
            }
            generated.username = uname;
        }

        /* --- nom de la boutique : fourni, ou déduit de l'email --- */
        let shop = shopName;
        if (!shop) shop = 'Boutique de ' + mail.split('@')[0].replace(/[._-]+/g, ' ').trim();
        if (shop.length < 3) return err(res, 400, 'Le nom de la boutique doit contenir au moins 3 caractères');
        if (shop.length > 60) shop = shop.slice(0, 60);
        if (!shopName) generated.shopName = shop;

        const salt = crypto.randomBytes(16).toString('hex');
        const user = await db.insert('users', {
            username: uname,
            email: mail,
            password_hash: hashPassword(password, salt),
            salt,
            shop_name: shop,
            shop_desc: String(shopDesc || '').trim(),
            shop_city: String(city || 'Lubumbashi').trim(),
            phone: String(phone || '').trim(),
            avatar: '', banner: '',
            is_admin: 0, banned: 0,
            created_at: nowISO()
        });

        const token = newToken();
        await db.insert('sessions', {
            token, user_id: user.id, created_at: nowISO(),
            expires_at: stamp(Date.now() + SESSION_DAYS * 864e5)
        });
        setCookie(res, token);
        ok(res, { token, user: publicUser(user), generated });
    },

    'POST /api/login': async (req, res) => {
        const { ident, password } = await readBody(req);
        if (!ident || !password) return err(res, 400, 'Identifiant et mot de passe requis');

        const id = String(ident).trim().toLowerCase();
        const user = await db.one('users', { username: id }) || await db.one('users', { email: id });
        if (!user || !verifyPassword(password, user.salt, user.password_hash))
            return err(res, 401, 'Identifiant ou mot de passe incorrect');
        if (user.banned) return err(res, 403, 'Ce compte a été suspendu. Contactez l\'administration.');

        const token = newToken();
        await db.insert('sessions', {
            token, user_id: user.id, created_at: nowISO(),
            expires_at: stamp(Date.now() + SESSION_DAYS * 864e5)
        });
        setCookie(res, token);
        ok(res, { token, user: publicUser(user) });
    },

    'POST /api/logout': async (req, res) => {
        const t = cookieToken(req);
        if (t) await db.remove('sessions', { token: t });
        clearCookie(res);
        ok(res, { ok: true });
    },

    'GET /api/me': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Non connecté');
        ok(res, { user: publicUser(auth.user) });
    },

    'PATCH /api/me': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Non connecté');
        const b = await readBody(req);
        const patch = {};
        if (b.shopName !== undefined) {
            if (String(b.shopName).trim().length < 3) return err(res, 400, 'Nom de boutique trop court');
            patch.shop_name = String(b.shopName).trim();
        }
        if (b.shopDesc !== undefined) patch.shop_desc = String(b.shopDesc).trim();
        if (b.shopCity  !== undefined) patch.shop_city  = String(b.shopCity).trim();
        if (b.phone     !== undefined) patch.phone      = String(b.phone).trim();
        if (b.avatar    !== undefined) patch.avatar     = String(b.avatar);
        if (b.banner    !== undefined) patch.banner     = String(b.banner);
        const user = await db.update('users', auth.user.id, patch);
        ok(res, { user: publicUser(user) });
    },

    /* ---------- PRODUITS ---------- */
    'GET /api/products': async (req, res, url) => {
        const auth = await currentUser(req);
        const where = {};
        const cat = url.searchParams.get('cat');
        const owner = url.searchParams.get('owner');
        if (cat && cat !== 'Toutes') where.category = cat;
        if (owner) where.owner_id = Number(owner);
        if (url.searchParams.get('mine') === '1' && auth) where.owner_id = auth.user.id;
        const sort = url.searchParams.get('sort');
        const orderBy = { asc: 'price ASC', desc: 'price DESC', note: 'rating DESC', recent: 'created_at DESC', likes: 'id DESC' }[sort];

        /* les articles masqués par l'administration restent invisibles,
           sauf pour l'admin lui-même ou via ?all=1 */
        const showHidden = (auth && auth.user.is_admin) || url.searchParams.get('all') === '1';
        if (!showHidden) where.published = 1;

        const rows = await db.all('products', where, { orderBy, limit: 200 });
        const list = await decorateAll(rows, auth ? auth.user.id : null);
        ok(res, { products: list, total: list.length });
    },

    'GET /api/products/:id': async (req, res, url, m) => {
        const auth = await currentUser(req);
        const p = await db.one('products', { id: Number(m.id) });
        if (!p) return err(res, 404, 'Article introuvable');
        ok(res, { product: await decorate(p, auth ? auth.user.id : null) });
    },

    'POST /api/products': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Connectez-vous pour publier un article');
        const b = await readBody(req);

        if (!b.title || String(b.title).trim().length < 3) return err(res, 400, 'Le titre doit contenir au moins 3 caractères');
        if (!b.cat)   return err(res, 400, 'Choisissez une catégorie');
        const price = Math.round(Number(b.price));
        if (!Number.isFinite(price) || price <= 0) return err(res, 400, 'Le prix doit être un nombre supérieur à 0');
        const oldPrice = b.oldPrice ? Math.round(Number(b.oldPrice)) : null;
        if (oldPrice !== null && oldPrice <= price) return err(res, 400, 'L\'ancien prix doit être supérieur au prix de vente');
        const stock = b.stock === undefined || b.stock === '' ? 10 : Math.round(Number(b.stock));
        if (!Number.isFinite(stock) || stock < 0) return err(res, 400, 'Le stock doit être un nombre positif ou nul');
        if (Array.isArray(b.images) && b.images.length > MAX_PHOTOS)
            return err(res, 400, `${MAX_PHOTOS} photos maximum par article`);
        if (Array.isArray(b.details) && b.details.length > MAX_DETAILS)
            return err(res, 400, `${MAX_DETAILS} détails maximum par article`);

        const photos = photosField(b.images, b.image);
        const product = await db.insert('products', {
            owner_id: auth.user.id,
            title: String(b.title).trim().slice(0, 120),
            category: String(b.cat),
            price,
            old_price: oldPrice,
            stock,
            image: photos.image,
            images: photos.images,
            details: detailsField(b.details),
            description: String(b.desc || '').trim().slice(0, 2000),
            badge: ['deal', 'new', 'best', ''].includes(b.badge) ? b.badge : '',
            prime: b.prime ? 1 : 0,
            rating: 4.3,
            reviews: 0,
            published: 1,
            created_at: nowISO()
        });
        ok(res, { product: await decorate(product, auth.user.id) });
    },

    'PATCH /api/products/:id': async (req, res, url, m) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Non connecté');
        const p = await db.one('products', { id: Number(m.id) });
        if (!p) return err(res, 404, 'Article introuvable');
        if (!sameId(p.owner_id, auth.user.id)) return err(res, 403, "Vous ne pouvez modifier que vos propres articles");
        const b = await readBody(req);
        const patch = {};
        if (b.title !== undefined) patch.title = String(b.title).trim().slice(0, 120);
        if (b.cat !== undefined) patch.category = String(b.cat);
        if (b.price !== undefined) patch.price = Math.round(Number(b.price));
        if (b.oldPrice !== undefined) patch.old_price = b.oldPrice ? Math.round(Number(b.oldPrice)) : null;
        if (b.stock !== undefined) patch.stock = Math.round(Number(b.stock));
        if (b.images !== undefined){
            if (Array.isArray(b.images) && b.images.length > MAX_PHOTOS)
                return err(res, 400, `${MAX_PHOTOS} photos maximum par article`);
            const ph = photosField(b.images, b.image);
            patch.image = ph.image;
            patch.images = ph.images;
        } else if (b.image !== undefined){
            /* on ne touche qu'a la photo principale, la galerie est conservee */
            const main = String(b.image).trim();
            const ph = photosField([main, ...readPhotos(p.images, p.image).filter(u => u !== main)]);
            patch.image = ph.image;
            patch.images = ph.images;
        }
        if (b.details !== undefined){
            if (Array.isArray(b.details) && b.details.length > MAX_DETAILS)
                return err(res, 400, `${MAX_DETAILS} détails maximum par article`);
            patch.details = detailsField(b.details);
        }
        if (b.desc !== undefined) patch.description = String(b.desc || '').trim().slice(0, 2000);
        if (b.badge !== undefined) patch.badge = ['deal', 'new', 'best', ''].includes(b.badge) ? b.badge : '';
        if (b.prime !== undefined) patch.prime = b.prime ? 1 : 0;
        if (b.published !== undefined) patch.published = b.published ? 1 : 0;
        ok(res, { product: await decorate(await db.update('products', p.id, patch), auth.user.id) });
    },

    'DELETE /api/products/:id': async (req, res, url, m) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Non connecté');
        const p = await db.one('products', { id: Number(m.id) });
        if (!p) return err(res, 404, 'Article introuvable');
        if (!sameId(p.owner_id, auth.user.id)) return err(res, 403, "Vous ne pouvez supprimer que vos propres articles");
        await db.remove('likes', { product_id: p.id });
        await db.remove('products', { id: p.id });
        ok(res, { ok: true, id: p.id });
    },

    /* ---------- J'AIME ---------- */
    'POST /api/products/:id/like': async (req, res, url, m) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Connectez-vous pour aimer un article');
        const p = await db.one('products', { id: Number(m.id) });
        if (!p) return err(res, 404, 'Article introuvable');
        const existing = await db.one('likes', { user_id: auth.user.id, product_id: p.id });
        if (existing) await db.remove('likes', { user_id: auth.user.id, product_id: p.id });
        else await db.insert('likes', { user_id: auth.user.id, product_id: p.id, created_at: nowISO() });
        ok(res, { liked: !existing, likes: await db.count('likes', { product_id: p.id }) });
    },

    'GET /api/likes': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Non connecté');
        const mine = await db.all('likes', { user_id: auth.user.id });
        const rows = (await Promise.all(mine.map(l => db.one('products', { id: Number(l.product_id) }))))
            .filter(Boolean);
        ok(res, { products: await decorateAll(rows, auth.user.id) });
    },

    /* ---------- COMMANDES ---------- */
    'POST /api/orders': async (req, res) => {
        const auth = await currentUser(req);
        const { items } = await readBody(req);
        if (!Array.isArray(items) || !items.length) return err(res, 400, 'Panier vide');

        const { total, lines } = await buildOrderLines(items);
        if (!lines.length) return err(res, 400, 'Aucun article valide dans le panier');

        const order = await db.insert('orders', {
            user_id: auth ? auth.user.id : null,
            ref: newOrderRef(), total, items: JSON.stringify(lines),
            status: 'Confirmée', created_at: nowISO()
        });
        ok(res, { order: { id: order.id, ref: order.ref, total: order.total, status: order.status, createdAt: order.created_at, items: lines } });
    },

    'GET /api/orders': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Non connecté');
        const rows = await db.all('orders', { user_id: auth.user.id }, { orderBy: 'created_at DESC', limit: 50 });
        const list = rows.map(o => ({
            id: o.id, ref: o.ref, total: o.total, status: o.status,
            createdAt: o.created_at, items: parseItems(o.items)
        }));
        ok(res, { orders: list });
    },

    /* ---------- BOUTIQUES ---------- */
    /* Liste des boutiques, éventuellement restreintes à une catégorie.
       Sans catégorie : toutes les vitrines de la plateforme.
       Avec ?cat=Électronique : uniquement les boutiques qui ont publié au
       moins un article visible dans cette catégorie, avec leurs statistiques
       calculées sur ces seuls articles (nombre, J'aime, prix mini, prix maxi). */
    'GET /api/shops': async (req, res, url) => {
        const auth = await currentUser(req);
        const cat = url.searchParams.get('cat');
        const q = (url.searchParams.get('q') || '').toLowerCase().trim();
        const showHidden = (auth && auth.user.is_admin) || url.searchParams.get('all') === '1';
        const scoped = !!cat && cat !== 'Toutes';

        const where = {};
        if (scoped) where.category = cat;
        if (!showHidden) where.published = 1;

        const users = await db.all('users', {}, { orderBy: 'created_at DESC' });
        const [products, allLikes] = await Promise.all([db.all('products', where), db.all('likes')]);

        /* Une seule lecture des articles et des J'aime : chaque boutique reçoit
           son nombre d'articles, ses J'aime, ses prix extrêmes et ses catégories. */
        const stats = new Map();
        for (const p of products){
            const k = Number(p.owner_id);
            const e = stats.get(k) || { n: 0, likes: 0, min: null, max: null, cats: new Set() };
            e.n++;
            e.min = e.min == null ? p.price : Math.min(e.min, p.price);
            e.max = e.max == null ? p.price : Math.max(e.max, p.price);
            e.cats.add(p.category);
            stats.set(k, e);
        }
        for (const l of allLikes){
            const e = stats.get(Number(l.product_id));
            if (e) e.likes++;
        }

        let shops = users
            .filter(u => !u.banned)                                  /* un compte suspendu n'a pas de vitrine */
            .filter(u => !scoped || stats.has(Number(u.id)))         /* en catégorie : seulement les boutiques concernées */
            .map(u => {
                const e = stats.get(Number(u.id)) || { n: 0, likes: 0, min: null, max: null, cats: new Set() };
                return {
                    ...publicUser(u),
                    productCount: e.n, likes: e.likes,
                    minPrice: e.min, maxPrice: e.max,
                    cats: [...e.cats]
                };
            });

        if (q)
            shops = shops.filter(s => (s.shopName + ' ' + s.username + ' ' + (s.shopDesc || '')).toLowerCase().includes(q));

        const sort = url.searchParams.get('sort') || (scoped ? 'products' : 'recent');
        shops.sort({
            products: (a, b) => b.productCount - a.productCount || b.likes - a.likes,
            likes:    (a, b) => b.likes - a.likes || b.productCount - a.productCount,
            name:     (a, b) => String(a.shopName).localeCompare(String(b.shopName), 'fr'),
            recent:   (a, b) => String(b.createdAt).localeCompare(String(a.createdAt))
        }[sort]);

        ok(res, { shops, cat: cat || 'Toutes', total: shops.length });
    },

    'GET /api/shops/:username': async (req, res, url, m) => {
        const owner = await db.one('users', { username: String(m.username).toLowerCase() });
        if (!owner) return err(res, 404, 'Boutique introuvable');
        const auth = await currentUser(req);
        const showHidden = (auth && auth.user.is_admin) || url.searchParams.get('all') === '1';
        const where = { owner_id: owner.id };
        if (!showHidden) where.published = 1;
        const rows = await db.all('products', where, { orderBy: 'created_at DESC' });
        const products = await decorateAll(rows, auth ? auth.user.id : null);
        const allLikes = await db.all('likes');
        ok(res, {
            shop: {
                ...publicUser(owner),
                productCount: products.length,
                likes: products.reduce((s, p) => s + p.likes, 0),
                followers: allLikes.length ? new Set(allLikes.map(l => l.user_id)).size : 0
            },
            products
        });
    },

    /* ---------- TÉLÉVERSEMENT D'IMAGE ---------- */
    'POST /api/upload': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Connectez-vous pour envoyer une image');
        const { dataUrl } = await readBody(req);
        if (!dataUrl) return err(res, 400, 'Aucune image reçue');

        const m = /^data:image\/(png|jpeg|jpg|gif|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl));
        if (!m) return err(res, 400, 'Format d\'image non accepté (png, jpg, gif, webp)');
        const buf = Buffer.from(m[2], 'base64');
        if (buf.length > 3 * 1024 * 1024) return err(res, 413, 'Image trop lourde (max 3 Mo)');

        const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
        /* suffixe aleatoire : plusieurs photos peuvent etre envoyees en meme milliseconde */
        const name = `img-${auth.user.id}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
        await photos.put(name, buf, 'image/' + ext);
        ok(res, { url: '/uploads/' + name });
    },

    /* ======================================================
       ADMINISTRATION — tableau de surveillance
       ====================================================== */
    'GET /api/admin/overview': async (req, res) => {
        const me = await requireAdmin(req, res);
        if (!me) return;

        const [users, products, orders, likes] = await Promise.all([
            db.all('users'), db.all('products'), db.all('orders'), db.all('likes')
        ]);
        const since = ms => new Date(Date.now() - ms).toISOString();
        const week = since(7 * 864e5);
        const dayOf = row => String(row.created_at || '').slice(0, 10);

        /* chiffre d'affaires par jour (30 derniers jours) */
        const ordersByDay = new Map();
        const signupsByDay = new Map();
        for (const o of orders) ordersByDay.set(dayOf(o), (ordersByDay.get(dayOf(o)) || 0) + 1);
        for (const u of users) signupsByDay.set(dayOf(u), (signupsByDay.get(dayOf(u)) || 0) + 1);

        const days = [];
        for (let i = 29; i >= 0; i--){
            const key = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
            days.push({
                day: key,
                orders: ordersByDay.get(key) || 0,
                revenue: orders.filter(o => dayOf(o) === key).reduce((s, o) => s + o.total, 0),
                signups: signupsByDay.get(key) || 0
            });
        }

        /* répartition par catégorie */
        const byCat = {};
        products.forEach(p => { byCat[p.category] = (byCat[p.category] || 0) + 1; });
        const categories = Object.entries(byCat)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        /* top boutiques et top articles (une seule passe de formatage) */
        const shops = (await adminUsers(users)).sort((a, b) => b.productCount - a.productCount).slice(0, 8);
        const shaped = await decorateAll(products, null);
        const topProducts = shaped.slice().sort((a, b) => b.likes - a.likes).slice(0, 8);

        ok(res, {
            me: { id: me.id, username: me.username, shopName: me.shop_name },
            totals: {
                users: users.length,
                admins: users.filter(u => u.is_admin).length,
                banned: users.filter(u => u.banned).length,
                newUsers7d: users.filter(u => u.created_at >= week).length,
                products: products.length,
                outOfStock: products.filter(p => p.stock === 0).length,
                lowStock: products.filter(p => p.stock > 0 && p.stock <= 3).length,
                orders: orders.length,
                revenue: orders.reduce((s, o) => s + o.total, 0),
                orders7d: orders.filter(o => o.created_at >= week).length,
                revenue7d: orders.filter(o => o.created_at >= week).reduce((s, o) => s + o.total, 0),
                likes: likes.length,
                avgBasket: orders.length ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0
            },
            days,
            categories,
            topShops: shops,
            topProducts,
            lowStockItems: shaped.filter(p => p.stock <= 3).slice(0, 10)
        });
    },

    'GET /api/admin/users': async (req, res, url) => {
        const me = await requireAdmin(req, res);
        if (!me) return;
        const q = (url.searchParams.get('q') || '').toLowerCase().trim();
        const sort = url.searchParams.get('sort') || 'recent';
        const all = await adminUsers(await db.all('users'));
        const list = q
            ? all.filter(u => [u.username, u.email, u.shopName, u.shopCity].join(' ').toLowerCase().includes(q))
            : all;
        const cmp = {
            recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
            name:   (a, b) => a.shopName.localeCompare(b.shopName),
            products:(a, b) => b.productCount - a.productCount,
            revenue:(a, b) => b.revenue - a.revenue,
            likes:  (a, b) => b.likesReceived - a.likesReceived
        }[sort] || ((a, b) => b.createdAt.localeCompare(a.createdAt));
        ok(res, { users: list.sort(cmp), total: list.length });
    },

    'PATCH /api/admin/users/:id': async (req, res, url, m) => {
        const me = await requireAdmin(req, res);
        if (!me) return;
        const target = await db.one('users', { id: Number(m.id) });
        if (!target) return err(res, 404, 'Compte introuvable');
        const b = await readBody(req);
        const patch = {};
        if (b.isAdmin !== undefined){
            if (sameId(target.id, me.id) && !b.isAdmin)
                return err(res, 400, 'Vous ne pouvez pas retirer votre propre rôle administrateur');
            patch.is_admin = b.isAdmin ? 1 : 0;
        }
        if (b.banned !== undefined){
            if (sameId(target.id, me.id) && b.banned)
                return err(res, 400, 'Vous ne pouvez pas suspendre votre propre compte');
            patch.banned = b.banned ? 1 : 0;
            if (b.banned) await db.remove('sessions', { user_id: target.id });   /* on déconnecte */
        }
        if (b.shopName !== undefined && String(b.shopName).trim().length >= 3)
            patch.shop_name = String(b.shopName).trim();
        if (!Object.keys(patch).length) return err(res, 400, 'Aucune modification demandée');
        ok(res, { user: await adminUser(await db.update('users', target.id, patch)) });
    },

    'DELETE /api/admin/users/:id': async (req, res, url, m) => {
        const me = await requireAdmin(req, res);
        if (!me) return;
        const target = await db.one('users', { id: Number(m.id) });
        if (!target) return err(res, 404, 'Compte introuvable');
        if (sameId(target.id, me.id)) return err(res, 400, 'Vous ne pouvez pas supprimer votre propre compte');
        if (target.is_admin && await db.count('users', { is_admin: 1 }) <= 1)
            return err(res, 400, 'Il doit rester au moins un administrateur');

        await deleteUserCascade(target.id);
        ok(res, { ok: true, id: target.id });
    },

    /* ---------- ADMIN : création manuelle d'un compte ---------- */
    'POST /api/admin/users': async (req, res) => {
        const me = await requireAdmin(req, res);
        if (!me) return;
        const b = await readBody(req);
        const email = String(b.email || '').trim().toLowerCase();
        const password = String(b.password || '');

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
            return err(res, 400, 'Adresse email invalide');
        if (password.length < 6) return err(res, 400, 'Le mot de passe doit contenir au moins 6 caractères');
        if (await db.one('users', { email })) return err(res, 409, 'Cet email est déjà utilisé');

        /* identifiant : fourni ou déduit de l'email, comme à l'inscription */
        let uname = String(b.username || '').trim().toLowerCase();
        if (uname){
            if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(uname))
                return err(res, 400, "Identifiant invalide (3 à 20 caractères : lettres, chiffres, . _ -)");
            if (await db.one('users', { username: uname })) return err(res, 409, 'Cet identifiant est déjà pris');
        } else {
            const local = email.split('@')[0].replace(/[^a-z0-9_.-]/g, '').slice(0, 14) || 'client';
            uname = await db.one('users', { username: local }) ? local.slice(0, 15) + Math.floor(Math.random() * 9000 + 1000) : local;
        }

        let shop = String(b.shopName || '').trim();
        if (!shop) shop = 'Boutique de ' + email.split('@')[0].replace(/[._-]+/g, ' ').trim();

        const salt = crypto.randomBytes(16).toString('hex');
        const user = await db.insert('users', {
            username: uname, email,
            password_hash: hashPassword(password, salt), salt,
            shop_name: shop.slice(0, 60),
            shop_desc: String(b.shopDesc || '').trim(),
            shop_city: String(b.city || 'Lubumbashi').trim(),
            phone: String(b.phone || '').trim(),
            avatar: String(b.avatar || ''), banner: String(b.banner || ''),
            is_admin: b.isAdmin ? 1 : 0,
            banned: b.banned ? 1 : 0,
            created_at: nowISO()
        });
        ok(res, { user: await adminUser(user) });
    },

    /* ---------- ADMIN : actions groupées sur les comptes ---------- */
    'POST /api/admin/users/bulk': async (req, res) => {
        const me = await requireAdmin(req, res);
        if (!me) return;
        const { ids = [], action } = await readBody(req);
        if (!Array.isArray(ids) || !ids.length) return err(res, 400, 'Aucun compte sélectionné');
        const list = ids.map(Number).filter(n => Number.isFinite(n) && !sameId(n, me.id));
        if (!list.length) return err(res, 400, 'Sélection invalide');

        let done = 0;
        for (const id of list){
            const u = await db.one('users', { id });
            if (!u) continue;
            if (action === 'ban')        { await db.update('users', id, { banned: 1 }); await db.remove('sessions', { user_id: id }); done++; }
            else if (action === 'unban') { await db.update('users', id, { banned: 0 }); done++; }
            else if (action === 'admin') { if (await db.count('users', { is_admin: 1 }) > 1 || !u.is_admin) { await db.update('users', id, { is_admin: 1 }); done++; } }
            else if (action === 'unadmin'){ await db.update('users', id, { is_admin: 0 }); done++; }
            else if (action === 'delete') {
                if (u.is_admin && await db.count('users', { is_admin: 1 }) <= 1) continue;
                await deleteUserCascade(id);
                done++;
            }
        }
        ok(res, { done, action });
    },

    /* ---------- ADMIN : ajouter un article à la plateforme ---------- */
    'POST /api/admin/products': async (req, res) => {
        const admin = await requireAdmin(req, res);
        if (!admin) return;
        const b = await readBody(req);

        if (!b.title || String(b.title).trim().length < 3) return err(res, 400, 'Le titre doit contenir au moins 3 caractères');
        if (!b.cat)   return err(res, 400, 'Choisissez une catégorie');
        const price = Math.round(Number(b.price));
        if (!Number.isFinite(price) || price <= 0) return err(res, 400, 'Le prix doit être un nombre supérieur à 0');
        const oldPrice = b.oldPrice ? Math.round(Number(b.oldPrice)) : null;
        if (oldPrice !== null && oldPrice <= price) return err(res, 400, 'L\'ancien prix doit être supérieur au prix de vente');
        const stock = b.stock === undefined || b.stock === '' ? 10 : Math.round(Number(b.stock));
        if (!Number.isFinite(stock) || stock < 0) return err(res, 400, 'Le stock doit être un nombre positif ou nul');
        if (Array.isArray(b.images) && b.images.length > MAX_PHOTOS)
            return err(res, 400, `${MAX_PHOTOS} photos maximum par article`);
        if (Array.isArray(b.details) && b.details.length > MAX_DETAILS)
            return err(res, 400, `${MAX_DETAILS} détails maximum par article`);

        /* l'article est depose pour le compte d'une boutique : celle choisie dans
           le formulaire, sinon la boutique de l'administrateur */
        const owner = b.ownerId
            ? await db.one('users', { id: Number(b.ownerId) })
            : admin;
        if (!owner) return err(res, 404, 'Boutique de destination introuvable');

        const photos = photosField(b.images, b.image);
        const product = await db.insert('products', {
            owner_id: owner.id,
            title: String(b.title).trim().slice(0, 120),
            category: String(b.cat),
            price,
            old_price: oldPrice,
            stock,
            image: photos.image,
            images: photos.images,
            details: detailsField(b.details),
            description: String(b.desc || '').trim().slice(0, 2000),
            badge: ['deal', 'new', 'best', ''].includes(b.badge) ? b.badge : '',
            prime: b.prime ? 1 : 0,
            rating: 4.3,
            reviews: 0,
            published: b.published === false ? 0 : 1,
            created_at: nowISO()
        });
        ok(res, { product: await decorate(product, admin.id) });
    },

    'GET /api/admin/products': async (req, res, url) => {
        if (!await requireAdmin(req, res)) return;
        const q = (url.searchParams.get('q') || '').toLowerCase().trim();
        const cat = url.searchParams.get('cat');
        const rows = await db.all('products', {}, { orderBy: 'created_at DESC' });
        let list = await decorateAll(rows, null);
        if (cat && cat !== 'Toutes') list = list.filter(p => p.cat === cat);
        if (q) list = list.filter(p => (p.title + ' ' + (p.owner ? p.owner.shopName : '')).toLowerCase().includes(q));
        ok(res, { products: list.slice(0, 200), total: list.length });
    },

    /* ---------- ADMIN : modifier n'importe quel article ---------- */
    'PATCH /api/admin/products/:id': async (req, res, url, m) => {
        if (!await requireAdmin(req, res)) return;
        const p = await db.one('products', { id: Number(m.id) });
        if (!p) return err(res, 404, 'Article introuvable');
        const b = await readBody(req);
        const patch = {};

        if (b.title !== undefined){
            if (String(b.title).trim().length < 3) return err(res, 400, 'Titre trop court (3 caractères minimum)');
            patch.title = String(b.title).trim().slice(0, 120);
        }
        if (b.cat !== undefined) patch.category = String(b.cat);
        if (b.price !== undefined){
            const price = Math.round(Number(b.price));
            if (!Number.isFinite(price) || price <= 0) return err(res, 400, 'Le prix doit être supérieur à 0');
            patch.price = price;
        }
        if (b.oldPrice !== undefined) patch.old_price = b.oldPrice ? Math.round(Number(b.oldPrice)) : null;
        if (b.stock !== undefined){
            const stock = Math.round(Number(b.stock));
            if (!Number.isFinite(stock) || stock < 0) return err(res, 400, 'Le stock doit être positif ou nul');
            patch.stock = stock;
        }
        if (b.image !== undefined){
            if (b.images !== undefined){
                if (Array.isArray(b.images) && b.images.length > MAX_PHOTOS)
                    return err(res, 400, `${MAX_PHOTOS} photos maximum par article`);
                const ph = photosField(b.images, b.image);
                patch.image = ph.image;
                patch.images = ph.images;
            } else {
                const main = String(b.image).trim();
                const ph = photosField([main, ...readPhotos(p.images, p.image).filter(u => u !== main)]);
                patch.image = ph.image;
                patch.images = ph.images;
            }
        } else if (b.images !== undefined){
            const ph = photosField(b.images, null);
            patch.image = ph.image;
            patch.images = ph.images;
        }
        if (b.details !== undefined){
            if (Array.isArray(b.details) && b.details.length > MAX_DETAILS)
                return err(res, 400, `${MAX_DETAILS} détails maximum par article`);
            patch.details = detailsField(b.details);
        }
        if (b.desc !== undefined) patch.description = String(b.desc || '').trim().slice(0, 2000);
        if (b.badge !== undefined) patch.badge = ['deal', 'new', 'best', ''].includes(b.badge) ? b.badge : '';
        if (b.prime !== undefined) patch.prime = b.prime ? 1 : 0;
        if (b.published !== undefined) patch.published = b.published ? 1 : 0;
        if (b.ownerId !== undefined){
            const owner = await db.one('users', { id: Number(b.ownerId) });
            if (!owner) return err(res, 404, 'Boutique de destination introuvable');
            patch.owner_id = owner.id;
        }
        if (patch.old_price !== undefined && patch.old_price !== null && patch.old_price <= (patch.price ?? p.price))
            return err(res, 400, 'L\'ancien prix doit être supérieur au prix de vente');
        if (!Object.keys(patch).length) return err(res, 400, 'Aucune modification demandée');

        ok(res, { product: await decorate(await db.update('products', p.id, patch), null) });
    },

    'POST /api/admin/products/bulk': async (req, res) => {
        if (!await requireAdmin(req, res)) return;
        const { ids = [], action } = await readBody(req);
        if (!Array.isArray(ids) || !ids.length) return err(res, 400, 'Aucun article sélectionné');
        let done = 0;
        for (const id of ids.map(Number).filter(Number.isFinite)){
            if (!await db.one('products', { id })) continue;
            if (action === 'hide'){ await db.update('products', id, { published: 0 }); done++; }
            else if (action === 'show'){ await db.update('products', id, { published: 1 }); done++; }
            else if (action === 'delete'){
                await db.remove('likes', { product_id: id });
                await db.remove('products', { id });
                done++;
            }
        }
        ok(res, { done, action });
    },

    'DELETE /api/admin/products/:id': async (req, res, url, m) => {
        if (!await requireAdmin(req, res)) return;
        const p = await db.one('products', { id: Number(m.id) });
        if (!p) return err(res, 404, 'Article introuvable');
        await db.remove('likes', { product_id: p.id });
        await db.remove('products', { id: p.id });
        ok(res, { ok: true, id: p.id });
    },

    'GET /api/admin/orders': async (req, res) => {
        if (!await requireAdmin(req, res)) return;
        const [rows, users] = await Promise.all([
            db.all('orders', {}, { orderBy: 'created_at DESC', limit: 200 }),
            db.all('users')
        ]);
        const buyerById = new Map(users.map(u => [Number(u.id), u]));
        const orders = rows.map(o => {
            const u = o.user_id == null ? null : buyerById.get(Number(o.user_id));
            return {
                id: o.id, ref: o.ref, total: o.total, status: o.status, createdAt: o.created_at,
                items: parseItems(o.items),
                buyer: u ? { username: u.username, shopName: u.shop_name } : null
            };
        });
        ok(res, { orders });
    },

    'PATCH /api/admin/orders/:id': async (req, res, url, m) => {
        if (!await requireAdmin(req, res)) return;
        const o = await db.one('orders', { id: Number(m.id) });
        if (!o) return err(res, 404, 'Commande introuvable');
        const b = await readBody(req);
        const STATUTS = ['Confirmée', 'En préparation', 'Expédiée', 'Livrée', 'Annulée'];
        if (!STATUTS.includes(b.status)) return err(res, 400, 'Statut invalide');
        const updated = await db.update('orders', o.id, { status: b.status });
        ok(res, { order: { ...updated, items: parseItems(o.items) } });
    },

    'DELETE /api/admin/orders/:id': async (req, res, url, m) => {
        if (!await requireAdmin(req, res)) return;
        const o = await db.one('orders', { id: Number(m.id) });
        if (!o) return err(res, 404, 'Commande introuvable');
        await db.remove('orders', { id: o.id });
        ok(res, { ok: true, id: o.id });
    },

    /* ---------- ADMIN : enregistrer une commande (téléphone, whatsapp…) ---------- */
    'POST /api/admin/orders': async (req, res) => {
        if (!await requireAdmin(req, res)) return;
        const { userId, items } = await readBody(req);
        if (!Array.isArray(items) || !items.length) return err(res, 400, 'Panier vide');

        const { total, lines } = await buildOrderLines(items);
        if (!lines.length) return err(res, 400, 'Aucun article valide dans la commande');

        const buyer = userId ? await db.one('users', { id: Number(userId) }) : null;
        if (userId && !buyer) return err(res, 404, 'Acheteur introuvable');

        const order = await db.insert('orders', {
            user_id: buyer ? buyer.id : null, ref: newOrderRef(), total,
            items: JSON.stringify(lines), status: 'Confirmée', created_at: nowISO()
        });
        ok(res, { order: { id: order.id, ref: order.ref, total: order.total, status: order.status, createdAt: order.created_at, items: lines } });
    },

    /* ---------- ADMIN : catalogue complet (pour les formulaires) ---------- */
    'GET /api/admin/catalog': async (req, res, url) => {
        if (!await requireAdmin(req, res)) return;
        const q = (url.searchParams.get('q') || '').toLowerCase().trim();
        let list = (await db.all('products', {}, { orderBy: 'title ASC' }))
            .map(p => ({ id: p.id, title: p.title, price: p.price, stock: p.stock, cat: p.category, ownerId: p.owner_id }));
        if (q) list = list.filter(p => p.title.toLowerCase().includes(q));
        ok(res, { products: list.slice(0, 400) });
    }
};

/* Le même jeu d'attributs sert à poser et à retirer le cookie : le navigateur
   doit retrouver exactement la même entrée pour la supprimer. */
const COOKIE_FLAGS = `Path=/; HttpOnly; SameSite=Lax` + (HTTPS ? '; Secure' : '');

function setCookie(res, token){
    res.setHeader('Set-Cookie', `be_token=${token}; Max-Age=${SESSION_DAYS * 86400}; ${COOKIE_FLAGS}`);
}

function clearCookie(res){
    res.setHeader('Set-Cookie', `be_token=; Max-Age=0; ${COOKIE_FLAGS}`);
}

/* Route : "GET /api/products/:id" -> clés explicites */
function matchRoute(method, pathname){
    if (routes[`${method} ${pathname}`]) return { key: `${method} ${pathname}`, params: {} };
    for (const key of Object.keys(routes)){
        if (!key.startsWith(method + ' ')) continue;
        const pattern = key.slice(method.length + 1);
        if (!pattern.includes(':')) continue;
        const pSeg = pattern.split('/');
        const uSeg = pathname.split('/');
        if (pSeg.length !== uSeg.length) continue;
        const params = {};
        let okMatch = true;
        for (let i = 0; i < pSeg.length; i++){
            if (pSeg[i].startsWith(':')) params[pSeg[i].slice(1)] = decodeURIComponent(uSeg[i]);
            else if (pSeg[i] !== uSeg[i]) { okMatch = false; break; }
        }
        if (okMatch) return { key, params };
    }
    return null;
}

/* ==========================================================
   FICHIERS STATIQUES
   ========================================================== */
/* Les fichiers du site sont lus dans le dossier du projet, mais les photos
   publiées par les vendeurs sont dans le module ./storage (disque local ou
   Cloud Storage). On les sert séparément pour qu'un chemin ne puisse
   jamais sortir du dossier autorisé. */
const UPLOAD_URL = '/uploads/';

async function serveUpload(req, res, rel){
    const name = rel.slice(UPLOAD_URL.length);
    /* garde-fou : le nom doit rester un simple nom de fichier, sans
       remontée de dossier ni chemin absolu. */
    if (path.basename(name) !== name || !name) return err(res, 403, 'Accès refusé');
    if (!await photos.has(name)) return send404(res);

    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        /* le nom contient un horodatage : le fichier ne change jamais */
        'Cache-Control': 'public, max-age=86400, immutable'
    });
    photos.stream(name).on('error', () => { if (!res.headersSent) send404(res); else res.end(); }).pipe(res);
}

function serveStatic(req, res, pathname){
    let rel = decodeURIComponent(pathname);
    if (rel === '/') rel = '/index.html';
    if (rel.startsWith(UPLOAD_URL)) return serveUpload(req, res, rel);
    if (!path.extname(rel)) rel += '.html';          // /electronique  ->  electronique.html

    /* Le chemin est normalisé avant tout contrôle : « /a/../b », « /a//b »
       et les segments encodés doivent tous se ramener à la même décision. */
    const clean = path.posix.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, '');
    const segments = clean.split('/').filter(s => s && s !== '.');
    if (segments.some(s => s.startsWith('.') || PRIVATE_DIRS.has(s.toLowerCase())))
        return err(res, 403, 'Accès refusé');

    const ext = path.extname(clean).toLowerCase();
    if (ext === '.js'){
        if (!PUBLIC_JS.has(clean.replace(/^([/\\])+/, '')))
            return err(res, 403, 'Accès refusé');
    } else if (!PUBLIC_EXT.has(ext)){
        return err(res, 403, 'Accès refusé');
    }

    const file = path.join(ROOT, clean.replace(/^([/\\])+/, ''));
    if (!file.startsWith(ROOT)) return err(res, 403, 'Accès refusé');
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory())
        return send404(res);

    res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=300'
    });
    fs.createReadStream(file).pipe(res);
}

function send404(res){
    const f = path.join(ROOT, '404.html');
    if (fs.existsSync(f)){
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return fs.createReadStream(f).pipe(res);
    }
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!DOCTYPE html><meta charset="utf-8"><title>404</title><h1>404</h1><p><a href="/">Retour à l\'accueil</a></p>');
}

/* ==========================================================
   SERVEUR
   ========================================================== */
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (req.method === 'OPTIONS'){
        res.writeHead(204, {
            'Access-Control-Allow-Origin': req.headers.origin || '*',
            'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Credentials': 'true'
        });
        return res.end();
    }
    if (pathname.startsWith('/api/')){
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        const match = matchRoute(req.method, pathname);
        if (!match) return err(res, 404, 'Route inconnue : ' + req.method + ' ' + pathname);
        try {
            await routes[match.key](req, res, url, match.params);
        } catch (e){
            console.error('[api]', e);
            if (!res.headersSent) err(res, 500, e.message || 'Erreur serveur');
        }
        return;
    }
    /* Les photos peuvent venir du réseau : une erreur de lecture ne doit
       pas laisser la requête sans réponse. */
    try { await serveStatic(req, res, pathname); }
    catch (e){
        console.error('[static]', e);
        if (!res.headersSent) send404(res);
        else res.end();
    }
});

if (require.main === module){
    (async () => {
        /* Premier démarrage : on insère le catalogue officiel si la base est vide */
        let firstRun = false;
        if (await db.count('products') === 0){
            firstRun = true;
            console.log('\n  Base vide → insertion du catalogue officiel…');
            /* Import tardif du script de remplissage : inutile de charger
               le catalogue officiel si la base contient déjà des produits. */
            const seed = await require('./seed')();
            if (seed.generated)
                console.log('\n  ⚠  NOTEZ CE MOT DE PASSE, il ne sera plus réaffiché :\n     ' + seed.password + '\n');
        }
        /* La boutique officielle dispose du tableau de surveillance */
        const official = await db.one('users', { username: 'businessenligne' });
        if (official && !official.is_admin){
            await db.update('users', official.id, { is_admin: 1 });
            console.log('  Boutique officielle passée en administrateur\n');
        }
        const admins = await db.all('users', { is_admin: 1 }, { orderBy: 'id ASC' });

        server.listen(PORT, () => {
            console.log('');
            console.log('  BusinessEnLigne — serveur démarré');
            console.log('  ➜  site      : http://localhost:' + PORT);
            console.log('  ➜  tableau de surveillance : http://localhost:' + PORT + '/admin.html');
            console.log('  ➜  base de données : ' + db.driver + (db.projectId ? ' (' + db.projectId + ')' : ''));
            console.log('  ➜  données : ' + require('./db').DATA_DIR + ' | photos : ' + photos.backend);
            console.log('');
            console.log('  ACCÈS ADMINISTRATEUR');
            if (admins.length){
                admins.forEach(a => console.log('    · ' + a.username + (a.email ? '  (' + a.email + ')' : '')));
            }
            /* Aucun mot de passe n'est rappelé ici : sur un site public,
               les journaux sont consultables et le mot de passe est un secret.
               Il se définit par ADMIN_PASSWORD, ou se lit juste après le tout
               premier démarrage quand il a été tiré au sort. */
            if (process.env.ADMIN_PASSWORD)
                console.log('    mot de passe : défini par la variable ADMIN_PASSWORD');
            else if (!firstRun)
                console.log('    mot de passe : voir les journaux du tout premier démarrage, ou définir ADMIN_PASSWORD');
            console.log('    autre compte à promouvoir : node make-admin.js <identifiant>');
            console.log('');
        });
    })().catch(e => {
        console.error('\n  Démarrage impossible :', e.message, '\n');
        process.exit(1);
    });
}

module.exports = server;
