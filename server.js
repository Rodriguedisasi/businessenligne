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
    '.jpe': 'image/jpeg', '.jfif': 'image/jpeg', '.pjpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon',
    '.cur': 'image/x-icon', '.avif': 'image/avif', '.bmp': 'image/bmp',
    '.dib': 'image/bmp', '.tif': 'image/tiff', '.tiff': 'image/tiff',
    '.heic': 'image/heic', '.heif': 'image/heif', '.apng': 'image/apng',
    '.jxl': 'image/jxl', '.psd': 'image/vnd.adobe.photoshop',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf'
};

/* Repli pour un format d'image qu'on n'a pas listé : on sert tout de même
   la bonne famille MIME à partir de l'extension, sinon le navigateur
   refuserait d'afficher la photo. */
function mimeOfExt(ext){
    if (MIME[ext]) return MIME[ext];
    const bare = ext.replace(/^\./, '');
    if (/^[a-z0-9]+$/.test(bare)) return 'image/' + bare;
    return 'application/octet-stream';
}

/* Sous-type MIME -> extension de fichier. Quelques formats ont un nom de
   fichier habituel qui diffère du sous-type (jpeg -> jpg, svg+xml -> svg…). */
const IMG_EXT = {
    'jpeg': 'jpg', 'svg+xml': 'svg', 'x-icon': 'ico',
    'vnd.microsoft.icon': 'ico', 'vnd.adobe.photoshop': 'psd', 'x-png': 'png'
};

/* Ce que le site a le droit de servir au navigateur.
   Le dossier du projet contient aussi la base de données, les scripts de
   maintenance et les fichiers de configuration : sans cette liste blanche,
   n'importe qui pourrait télécharger /data/boutique.db et lire les mots de
   passe hachés. Le front ne charge aucun .json, on ne les sert donc pas. */
const PUBLIC_EXT = new Set([
    '.html', '.css',
    '.png', '.jpg', '.jpeg', '.jpe', '.jfif', '.pjpeg', '.gif', '.webp',
    '.svg', '.ico', '.cur', '.avif', '.bmp', '.dib', '.tif', '.tiff',
    '.heic', '.heif', '.apng', '.jxl', '.psd',
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

/* ---- Suspension d'une boutique ----------------------------------
   Deux sanctions coexistent, volontairement distinctes :

     banned          le compte est coupé : plus de connexion, plus de vitrine ;
     shop_suspended  le compte fonctionne, mais sa vitrine, ses articles,
                     ses commandes et ses envois de photos sont coupés.

   Un vendeur suspendu garde donc son tableau de bord pour comprendre ce qui
   bloque, et l'administration garde la main sur ses contenus. */
const SHOP_SUSPENDED_MSG = "Votre boutique est suspendue par l'administration. Contactez le support pour la réactiver.";

const shopIsBlocked = u => !!(u && (u.banned || u.shop_suspended));

/* Message d'erreur adapté : le compte suspendu est simply déconnecté
   (voir currentUser), la boutique suspendue reçoit une explication. */
function shopBlockedError(res, user){
    return err(res, 403, user.banned ? 'Ce compte a été suspendu. Contactez l\'administration.'
                                    : SHOP_SUSPENDED_MSG);
}

/* Identifiants des boutiques suspendues : une seule lecture, réutilisée
   pour filtrer les listes publiques (articles, commandes, vitrines). */
async function suspendedShops(){
    const rows = await db.all('users');
    return new Set(rows.filter(u => u.shop_suspended).map(u => Number(u.id)));
}

/* Test ponctuel, pour une route qui ne manipule qu'un article. */
async function shopIsBlockedId(id){
    const u = await db.one('users', { id: Number(id) });
    return shopIsBlocked(u);
}

/* ==========================================================
   FICHE DÉTAILLÉE DE LA BOUTIQUE
   ------------------------------------------------------------
   Tous les paramètres que le vendeur peut renseigner sont décrits
   UNE seule fois, dans SHOP_FIELDS. Le même tableau sert à trois choses :

     1. valider et enregistrer le « PATCH /api/me » ;
     2. rendre la fiche publique renvoyée à l'affichage ;
     3. calculer le taux de complétion montré au vendeur.

   Ajouter un paramètre = ajouter une ligne dans SHOP_FIELDS, plus
   la colonne correspondante dans db.js. Rien d'autre à modifier.
   ========================================================== */

/* Référentiels : ce que le vendeur peut choisir dans les listes. */
const SHOP_CATEGORIES = ['Électronique', 'Mode', 'Maison', 'Sport', 'Beauté', 'Enfants', 'Livres'];

const SHOP_PAYMENTS = [
    { id: 'airtel',    label: 'Airtel Money' },
    { id: 'orange',    label: 'Orange Money' },
    { id: 'mpesa',     label: 'M-Pesa (Vodacom)' },
    { id: 'afrimoney', label: 'Afrimoney (Africell)' },
    { id: 'momo',      label: 'Autre Mobile Money' },
    { id: 'carte',     label: 'Carte bancaire' },
    { id: 'virement',  label: 'Virement bancaire' },
    { id: 'especes',   label: 'Espèces à la livraison' },
    { id: 'credit',    label: 'Paiement échelonné' }
];

const SHOP_FEATURES = [
    { id: 'rapide',   label: 'Livraison rapide' },
    { id: 'gratuit',  label: 'Livraison offerte' },
    { id: 'garantie', label: 'Garantie satisfaction' },
    { id: 'retour',   label: 'Retours acceptés' },
    { id: 'original', label: 'Produits authentiques' },
    { id: 'support',  label: 'Service client réactif' },
    { id: 'physique', label: 'Boutique physique' },
    { id: 'gros',     label: 'Vente en gros' },
    { id: 'nouveau',  label: 'Nouveautés régulières' },
    { id: 'secure',   label: 'Paiement sécurisé' }
];

const SHOP_DAYS = [
    { id: 'mon', label: 'Lundi' },    { id: 'tue', label: 'Mardi' },
    { id: 'wed', label: 'Mercredi' }, { id: 'thu', label: 'Jeudi' },
    { id: 'fri', label: 'Vendredi' }, { id: 'sat', label: 'Samedi' },
    { id: 'sun', label: 'Dimanche' }
];

const PAYMENT_IDS = SHOP_PAYMENTS.map(p => p.id);
const FEATURE_IDS = SHOP_FEATURES.map(f => f.id);
const MAX_GALLERY = 8;
const MAX_CATS = SHOP_CATEGORIES.length;

/* type : text | longtext | email | tel | url | list | tags | flag | hours
   col  : nom de la colonne dans la table « users »
   max  : longueur maximale, ou nombre d'éléments pour une liste            */
const SHOP_FIELDS = [
    { key: 'shopSlogan',        col: 'shop_slogan',         type: 'text',      max: 90 },
    { key: 'shopDesc',          col: 'shop_desc',           type: 'longtext',  max: 600 },
    { key: 'shopCats',          col: 'shop_cats',           type: 'list',      allowed: SHOP_CATEGORIES, max: MAX_CATS },
    { key: 'shopAbout',         col: 'shop_about',          type: 'longtext',  max: 2500 },
    { key: 'shopAddress',       col: 'shop_address',        type: 'text',      max: 140 },
    { key: 'shopLandmark',      col: 'shop_landmark',       type: 'text',      max: 120 },
    { key: 'shopCity',          col: 'shop_city',           type: 'text',      max: 60 },
    { key: 'phone',             col: 'phone',               type: 'tel',       max: 40 },
    { key: 'shopEmail',         col: 'shop_email',          type: 'email',     max: 120 },
    { key: 'shopWhatsapp',      col: 'shop_whatsapp',       type: 'tel',       max: 40 },
    { key: 'shopFacebook',      col: 'shop_facebook',       type: 'url',       max: 200 },
    { key: 'shopInstagram',     col: 'shop_instagram',      type: 'url',       max: 200 },
    { key: 'shopTiktok',        col: 'shop_tiktok',         type: 'url',       max: 200 },
    { key: 'shopYoutube',       col: 'shop_youtube',        type: 'url',       max: 200 },
    { key: 'shopWebsite',       col: 'shop_website',        type: 'url',       max: 200 },
    { key: 'shopHours',         col: 'shop_hours',          type: 'hours' },
    { key: 'shopDelivery',      col: 'shop_delivery',       type: 'flag' },
    { key: 'shopPickup',        col: 'shop_pickup',         type: 'flag' },
    { key: 'shopDeliveryTime',  col: 'shop_delivery_time',  type: 'text',      max: 60 },
    { key: 'shopDeliveryFee',   col: 'shop_delivery_fee',   type: 'text',      max: 60 },
    { key: 'shopDeliveryZones', col: 'shop_delivery_zones', type: 'text',      max: 200 },
    { key: 'shopFreeDelivery',  col: 'shop_free_delivery',  type: 'text',      max: 60 },
    { key: 'shopPayments',      col: 'shop_payments',       type: 'tags',      allowed: PAYMENT_IDS, max: PAYMENT_IDS.length },
    { key: 'shopReturns',       col: 'shop_returns',        type: 'flag' },
    { key: 'shopReturnDays',    col: 'shop_return_days',    type: 'text',      max: 60 },
    { key: 'shopWarranty',      col: 'shop_warranty',       type: 'text',      max: 160 },
    { key: 'shopFeatures',      col: 'shop_features',       type: 'tags',      allowed: FEATURE_IDS, max: FEATURE_IDS.length },
    { key: 'shopFounded',       col: 'shop_founded',        type: 'text',      max: 10 },
    { key: 'shopLegal',         col: 'shop_legal',          type: 'text',      max: 80 },
    { key: 'shopGallery',       col: 'shop_gallery',        type: 'urlList',   max: MAX_GALLERY }
];
const SHOP_FIELD_BY_KEY = new Map(SHOP_FIELDS.map(f => [f.key, f]));

/* Drapeaux que l'administration seule peut poser (badge « vérifiée »). */
const SHOP_ADMIN_FLAGS = new Set(['shopVerified']);

/* ---- Petits utilitaires de normalisation ---- */
const flat = (v, max) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
const rich = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());
const isHttpUrl = v => /^https?:\/\/[^\s"'<>\s]{4,400}$/i.test(String(v || '').trim());
const digitsOf = v => String(v == null ? '' : v).replace(/\D/g, '');

/* Liste stockée dans une colonne texte, séparée par « | » : la même
   écriture fonctionne sur SQLite, sur Firestore et dans le JSON de repli. */
function readList(stored, allowed, max){
    const raw = Array.isArray(stored)
        ? stored
        : String(stored == null ? '' : stored).split('|');
    const out = [];
    for (const v of raw){
        const s = String(v == null ? '' : v).trim();
        if (!s || out.includes(s)) continue;
        if (allowed && !allowed.includes(s)) continue;
        out.push(s);
        if (out.length >= (max || 50)) break;
    }
    return out;
}
const listField = list => readList(list, null, 50).join('|');

/* Horaires : un objet { mon:{o,c,closed}, … } sérialisé en JSON.
   Un jour sans horaire valide est considéré comme « fermé ». */
function readHours(stored){
    let data = stored;
    if (typeof data === 'string'){
        if (!data.trim()) return {};
        try { data = JSON.parse(data); } catch (e){ return {}; }
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    const out = {};
    for (const d of SHOP_DAYS){
        const r = data[d.id];
        if (!r || typeof r !== 'object') continue;
        const o = String(r.o ?? r.open ?? '').slice(0, 5);
        const c = String(r.c ?? r.close ?? '').slice(0, 5);
        const ok = v => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
        if (r.closed || !(ok(o) && ok(c))) out[d.id] = { closed: true, o: ok(o) ? o : '08:00', c: ok(c) ? c : '18:00' };
        else out[d.id] = { closed: false, o, c };
    }
    return out;
}
const hoursField = obj => JSON.stringify(readHours(obj || {}));

/* Applique la validation d'un champ à une valeur reçue.
   Renvoie { value } si la valeur est acceptable, ou { error } sinon. */
function checkShopField(f, raw){
    switch (f.type){
        case 'flag':   return { value: raw ? 1 : 0 };
        /* « list » et « tags » se stockent pareil ; la seule différence est
           qu'une liste peut être libre (les photos) ou fermée (les
           catégories, les moyens de paiement, les atouts). */
        case 'list':
        case 'tags':   return { value: readList(raw, f.allowed, f.max).join('|') };
        /* une liste d'images : seules les vraies adresses d'image sont gardées,
           pour qu'une valeur glissée dans le champ ne puisse pas produire
           autre chose qu'une photo. « /uploads/... » est accepté comme
           http(s) : c'est ce que renvoie le téléverseur du site. */
        case 'urlList': return { value: readList(raw, null, f.max).filter(isPhotoUrl).join('|') };
        case 'hours':  return { value: hoursField(raw) };
        case 'url':    return isHttpUrl(raw) ? { value: flat(raw, f.max) } : { error: 'Lien invalide (commencez par https://)' };
        case 'email':  return !raw ? { value: '' } : isEmail(raw) ? { value: flat(raw, f.max) } : { error: 'Adresse email invalide' };
        case 'tel':    return !raw ? { value: '' } : digitsOf(raw).length >= 6 && digitsOf(raw).length <= 15
                                ? { value: flat(raw, f.max) } : { error: 'Numéro de téléphone invalide' };
        case 'longtext': return { value: rich(raw, f.max) };
        default:       return { value: flat(raw, f.max) };
    }
}

/* Transforme le corps de la requête en patch SQL.
   Retourne { patch } ou { error }. */
function shopPatchFrom(body, { allowAdminFlags = false } = {}){
    const patch = {};
    /* le nom de la boutique a sa propre règle : 3 caractères minimum */
    if (body.shopName !== undefined){
        const name = flat(body.shopName, 60);
        if (name.length < 3) return { error: 'Nom de boutique trop court' };
        patch.shop_name = name;
    }
    for (const f of SHOP_FIELDS){
        if (body[f.key] === undefined) continue;
        const r = checkShopField(f, body[f.key]);
        if (r.error) return { error: r.error };
        patch[f.col] = r.value;
    }
    if (allowAdminFlags){
        for (const key of SHOP_ADMIN_FLAGS){
            if (body[key] === undefined) continue;
            patch[key === 'shopVerified' ? 'shop_verified' : key] = body[key] ? 1 : 0;
        }
    }
    return { patch };
}

/* La fiche complète, en camelCase, prête pour le front. */
function publicShop(u){
    if (!u) return null;
    const out = {
        id: u.id, username: u.username, email: u.email,
        shopName: u.shop_name, shopDesc: u.shop_desc, shopCity: u.shop_city,
        phone: u.phone, avatar: u.avatar, banner: u.banner,
        createdAt: u.created_at,
        isAdmin: !!u.is_admin, isBanned: !!u.banned,
        shopVerified: !!u.shop_verified,
        /* la boutique suspendue reste décrite : le vendeur voit le motif,
           et la vitrine publique peut expliquer pourquoi elle est fermée */
        shopSuspended: !!u.shop_suspended,
        shopSuspendedReason: String(u.shop_suspended_reason || ''),
        shopSuspendedAt: String(u.shop_suspended_at || '')
    };
    for (const f of SHOP_FIELDS){
        if (out[f.key] !== undefined) continue;                 /* déjà traité ci-dessus */
        const stored = u[f.col];
        if (f.type === 'flag')       out[f.key] = !!stored;
        else if (f.type === 'list' || f.type === 'tags' || f.type === 'urlList')
                                      out[f.key] = readList(stored, f.allowed, f.max);
        else if (f.type === 'hours') out[f.key] = readHours(stored);
        else                         out[f.key] = String(stored == null ? '' : stored);
    }
    return out;
}

/* ---- Taux de complétion de la fiche ----
   Une checklist de ce qui rend une vitrine crédible. Le vendeur voit ce
   qu'il lui reste à renseigner ; la vitrine publique peut l'afficher aussi. */
const SHOP_CHECKLIST = [
    { key: 'shopSlogan',        label: 'Accroche de la boutique' },
    { key: 'shopDesc',          label: 'Description courte',        min: 40 },
    { key: 'shopCats',          label: 'Catégories specialties' },
    { key: 'shopAbout',         label: 'Présentation détaillée',    min: 120 },
    { key: 'avatar',            label: 'Logo de la boutique' },
    { key: 'banner',            label: 'Bannière de couverture' },
    { key: 'phone',             label: 'Téléphone',                 digits: 9 },
    { key: 'shopEmail',         label: 'Email de contact' },
    { key: 'shopWhatsapp',      label: 'Numéro WhatsApp',           digits: 9 },
    { key: 'shopAddress',       label: 'Adresse' },
    { key: 'shopLandmark',      label: 'Point de repère' },
    { key: 'shopDelivery',      label: 'Livraison à domicile' },
    { key: 'shopDeliveryTime',  label: 'Délai de livraison' },
    { key: 'shopDeliveryFee',   label: 'Frais de livraison' },
    { key: 'shopDeliveryZones', label: 'Zones desservies' },
    { key: 'shopPayments',      label: 'Moyen de paiement' },
    { key: 'shopHours',         label: 'Horaires d\'ouverture' },
    { key: 'shopReturnDays',    label: 'Politique de retour' },
    { key: 'shopWarranty',      label: 'Garantie' },
    { key: 'shopFeatures',      label: 'Atouts de la boutique' },
    { key: 'shopGallery',       label: 'Galerie photos' },
    { key: 'shopFounded',       label: 'Année d\'ouverture' }
];

function shopChecklistDone(u){
    const shop = publicShop(u);
    return SHOP_CHECKLIST.map(c => {
        const v = c.key === 'shopDelivery' ? (u.shop_delivery ? '1' : '') : shop[c.key];
        const filled = c.digits ? digitsOf(v).length >= c.digits
            : c.min ? String(v || '').length >= c.min
            : Array.isArray(v) ? v.length > 0
            : typeof v === 'object' ? Object.keys(v || {}).length > 0
            : !!String(v || '').trim();
        return { key: c.key, label: c.label, done: filled };
    });
}

function shopScore(u){
    const list = shopChecklistDone(u);
    const done = list.filter(c => c.done).length;
    return {
        score: list.length ? Math.round(done / list.length * 100) : 0,
        done, total: list.length,
        missing: list.filter(c => !c.done)
    };
}

function publicUser(u){
    return publicShop(u);
}

/* La boutique est-elle ouverte à l'instant présent ?
   L'heure de référence est celle de Lubumbashi (UTC+2), la ville par défaut
   du site. Renvoie null quand aucun horaire n'a été renseigné : ni l'affiche
   « ouvert » ni l'affiche « fermé » ne doivent être montrées dans ce cas. */
function isOpenNow(hours){
    const list = readHours(hours);
    if (!Object.keys(list).length) return null;
    const now = new Date(Date.now() + 2 * 3600e3);
    const day = list[SHOP_DAYS[(now.getUTCDay() + 6) % 7].id];   /* dimanche = index 0 */
    if (!day || day.closed) return false;
    const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
    const to = s => Number(String(s).slice(0, 2)) * 60 + Number(String(s).slice(3, 5));
    /* une boutique qui ferme après minuit reste ouverte le soir */
    return to(day.c) >= to(day.o) ? mins >= to(day.o) && mins <= to(day.c)
                                  : mins >= to(day.o) || mins <= to(day.c);
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
            shopSuspended: !!u.shop_suspended,
            shopSuspendedReason: String(u.shop_suspended_reason || ''),
            shopSuspendedAt: String(u.shop_suspended_at || ''),
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

/* Toutes les photos d'une boutique, avec l'endroit où elles se trouvent :
   la modération doit pouvoir nommer la cible (« retirez celle-ci ») sans
   deviner si c'est le logo, la bannière ou une photo de la galerie.
   Les articles, eux, exposent déjà leurs photos via shapeProduct(). */
function shopPhotoList(u){
    const out = [];
    const push = (role, url) => {
        if (!isPhotoUrl(url)) return;
        if (out.some(p => p.url === url)) return;
        out.push({ role, url });
    };
    push('logo', u.avatar);
    push('banniere', u.banner);
    for (const url of readList(u.shop_gallery, null, MAX_GALLERY)) push('galerie', url);
    return out;
}

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
        owner: owner ? { username: owner.username, shopName: owner.shop_name, avatar: owner.avatar, city: owner.shop_city, verified: !!owner.shop_verified } : null
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
    /* une boutique suspendue ne peut plus recevoir de commande : le panier
       du visiteur ignore ses articles au lieu d'échouer à la validation */
    const blocked = await suspendedShops();
    let total = 0;
    const lines = [];
    for (const it of items){
        const p = await db.one('products', { id: Number(it.id) });
        if (!p || blocked.has(Number(p.owner_id))) continue;
        const qty = Math.max(1, Math.min(99, Math.round(Number(it.qty) || 1)));
        total += p.price * qty;
        lines.push({ id: p.id, title: p.title, price: p.price, qty, image: p.image, ownerId: p.owner_id });
    }
    return { total, lines };
}

const newOrderRef = () => 'BE-' + Date.now().toString().slice(-8) + '-' + Math.floor(Math.random() * 90 + 10);

/* Met à jour la valeur stockée d'un champ, sans l'écrire : sert au
   « aperçu » du taux de complétion pendant la saisie. */
function shopPreviewRow(base, body){
    const row = { ...base };
    if (body.shopName !== undefined) row.shop_name = flat(body.shopName, 60);
    if (body.avatar !== undefined)   row.avatar   = flat(body.avatar, 400);
    if (body.banner !== undefined)   row.banner   = flat(body.banner, 400);
    for (const f of SHOP_FIELDS){
        if (body[f.key] === undefined) continue;
        const r = checkShopField(f, body[f.key]);
        if (r.error) continue;              /* champ invalide : on garde l'ancienne valeur */
        row[f.col] = r.value;
    }
    return row;
}

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
        /* Les réglages de boutique éventuellement fournis par le formulaire
           d'inscription passent par la même validation que la page « Mon
           compte » : il n'y a qu'une seule règle à maintenir. */
        const extra = shopPatchFrom(body).patch || {};
        const user = await db.insert('users', Object.assign({
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
        }, extra));

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
        ok(res, {
            user: publicShop(auth.user),
            score: shopScore(auth.user),
            options: {
                categories: SHOP_CATEGORIES,
                payments: SHOP_PAYMENTS,
                features: SHOP_FEATURES,
                days: SHOP_DAYS,
                maxGallery: MAX_GALLERY
            }
        });
    },

    /* Mise à jour de la fiche boutique.
       Une seule entrée pour TOUS les paramètres : la liste et les règles
       vivent dans SHOP_FIELDS, donc ajouter un réglage côté serveur ne
       demande qu'une ligne de plus dans ce tableau. */
    'PATCH /api/me': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Non connecté');
        /* boutique suspendue : la fiche reste consultable, plus modifiable —
           l'administration doit pouvoir garder la main pendant la correction */
        if (auth.user.shop_suspended) return shopBlockedError(res, auth.user);
        const b = await readBody(req);
        const { patch, error } = shopPatchFrom(b);
        if (error) return err(res, 400, error);
/* le logo et la bannière ne passent pas par SHOP_FIELDS : ils sont
           posés depuis le téléverseur, donc seulement des adresses d'image
           sont acceptées — y compris « /uploads/... », ce que renvoie le
           téléverseur et ce qu'efficacement propose le sélecteur du site */
        if (b.avatar !== undefined){
            if (b.avatar && !isPhotoUrl(b.avatar)) return err(res, 400, 'Lien du logo invalide');
            patch.avatar = flat(b.avatar, 400);
        }
        if (b.banner !== undefined){
            if (b.banner && !isPhotoUrl(b.banner)) return err(res, 400, 'Lien de la bannière invalide');
            patch.banner = flat(b.banner, 400);
        }
        if (!Object.keys(patch).length) return err(res, 400, 'Aucune modification demandée');

        const user = await db.update('users', auth.user.id, patch);
        ok(res, { user: publicShop(user), score: shopScore(user) });
    },

    /* Taux de complétion « en direct », pendant la saisie des réglages.
       Rien n'est écrit : la fiche est recalculée dans un objet temporaire
       puis renvoyée avec la liste de ce qu'il reste à renseigner. */
    'POST /api/shops/preview': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Non connecté');
        const b = await readBody(req);
        const row = shopPreviewRow(auth.user, b);
        ok(res, { score: shopScore(row), preview: publicShop(row) });
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
        /* Les articles d'une boutique suspendue sortent des listes publiques.
           Contrairement au simple masquage d'un article, « ?all=1 » ne
           suffit pas ici : seul un administrateur peut les voir, sinon un
           visiteur contournerait la suspension en ajoutant le paramètre. */
        const blockedShops = await suspendedShops();
        const visible = (auth && auth.user.is_admin)
            ? rows
            : rows.filter(p => !blockedShops.has(Number(p.owner_id)));
        const list = await decorateAll(visible, auth ? auth.user.id : null);
        ok(res, { products: list, total: list.length });
    },

    'GET /api/products/:id': async (req, res, url, m) => {
        const auth = await currentUser(req);
        const p = await db.one('products', { id: Number(m.id) });
        if (!p) return err(res, 404, 'Article introuvable');
        /* l'article d'une boutique suspendue n'est servi qu'à l'administration :
           « ?all=1 » ne doit pas suffire à contourner une suspension */
        if (!(auth && auth.user.is_admin) && await shopIsBlockedId(p.owner_id))
            return err(res, 404, 'Article introuvable');
        ok(res, { product: await decorate(p, auth ? auth.user.id : null) });
    },

    'POST /api/products': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Connectez-vous pour publier un article');
        if (auth.user.shop_suspended) return shopBlockedError(res, auth.user);
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
        if (auth.user.shop_suspended) return shopBlockedError(res, auth.user);
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
        const { items, payment } = await readBody(req);
        if (!Array.isArray(items) || !items.length) return err(res, 400, 'Panier vide');

        const { total, lines } = await buildOrderLines(items);
        if (!lines.length) return err(res, 400, 'Aucun article valide dans le panier');

        const pay = PAYMENT_IDS.includes(payment) ? payment : '';
        const order = await db.insert('orders', {
            user_id: auth ? auth.user.id : null,
            ref: newOrderRef(), total, items: JSON.stringify(lines),
            payment: pay, status: 'Confirmée', created_at: nowISO()
        });
        ok(res, { order: { id: order.id, ref: order.ref, total: order.total, payment: order.payment, status: order.status, createdAt: order.created_at, items: lines } });
    },

    'GET /api/orders': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Non connecté');
        const rows = await db.all('orders', { user_id: auth.user.id }, { orderBy: 'created_at DESC', limit: 50 });
        const list = rows.map(o => ({
            id: o.id, ref: o.ref, total: o.total, status: o.status, payment: o.payment || '',
            createdAt: o.created_at, items: parseItems(o.items)
        }));
        ok(res, { orders: list });
    },

    /* ---------- BOUTIQUES ---------- */
    /* Liste des boutiques, éventuellement restreinte à une catégorie.
       Sans catégorie : toutes les vitrines de la plateforme.
       Avec ?cat=Électronique : uniquement les boutiques qui ont publié au
       moins un article visible dans cette catégorie, avec leurs statistiques
       calculées sur ces seuls articles (nombre, J'aime, prix mini, prix maxi). */
    'GET /api/shops': async (req, res, url) => {
        const auth = await currentUser(req);
        const cat = url.searchParams.get('cat');
        const q = (url.searchParams.get('q') || '').toLowerCase().trim();
        const showHidden = (auth && auth.user.is_admin) || url.searchParams.get('all') === '1';
        const onlyVerified = url.searchParams.get('verified') === '1';
        const onlyDelivery = url.searchParams.get('delivery') === '1';
        const scoped = !!cat && cat !== 'Toutes';

        const where = {};
        if (scoped) where.category = cat;
        if (!showHidden) where.published = 1;

        const users = await db.all('users', {}, { orderBy: 'created_at DESC' });
        const [products, allLikes, orders] = await Promise.all([db.all('products', where), db.all('likes'), db.all('orders')]);

        /* Une seule lecture des articles, des J'aime et des commandes :
           chaque boutique reçoit son nombre d'articles, ses J'aime, ses
           abonnés, ses ventes, ses prix extrêmes et ses catégories. */
        const stats = new Map();
        const bump = id => {
            const k = Number(id);
            let e = stats.get(k);
            if (!e){ e = { list: [], likes: 0, sales: 0, fset: new Set() }; stats.set(k, e); }
            return e;
        };
        for (const p of products) bump(p.owner_id).list.push(p);

        const ownerOf = new Map(products.map(p => [Number(p.id), Number(p.owner_id)]));
        for (const l of allLikes){
            const seller = ownerOf.get(Number(l.product_id));
            if (seller == null) continue;
            const e = stats.get(seller);
            if (!e) continue;
            e.likes++;
            if (l.user_id != null) e.fset.add(Number(l.user_id));
        }
        for (const o of orders){
            for (const line of parseItems(o.items)){
                const seller = line.ownerId != null ? Number(line.ownerId) : ownerOf.get(Number(line.id));
                if (seller == null) continue;
                const e = stats.get(seller);
                if (!e) continue;
                e.sales += line.qty || 1;
            }
        }

        let shops = users
            .filter(u => !u.banned)                                  /* un compte suspendu n'a pas de vitrine */
            /* une boutique suspendue disparaît de la liste publique ; comme
               ses articles, elle ne réapparaît que pour un administrateur,
               jamais via « ?all=1 » */
            .filter(u => (auth && auth.user.is_admin) || !u.shop_suspended)
            .filter(u => !scoped || stats.has(Number(u.id)))         /* en catégorie : seulement les boutiques concernées */
            .map(u => {
                const e = stats.get(Number(u.id)) || { list: [], likes: 0, sales: 0, fset: new Set() };
                let min = null, max = null, ratingSum = 0, reviews = 0, stock = 0;
                const cats = new Set();
                for (const p of e.list){
                    reviews += Number(p.reviews) || 0;
                    ratingSum += (Number(p.rating) || 0) * (Number(p.reviews) || 0);
                    stock += Number(p.stock) || 0;
                    min = min == null ? Number(p.price) : Math.min(min, Number(p.price));
                    max = max == null ? Number(p.price) : Math.max(max, Number(p.price));
                    cats.add(p.category);
                }
                /* Aperçu des derniers articles publiés : la carte de la
                   boutique montre ainsi ce qu'elle propose réellement. */
                const preview = e.list
                    .slice()
                    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
                    .slice(0, 4)
                    .map(p => ({
                        id: p.id, title: p.title, image: p.image,
                        price: Number(p.price) || 0, cat: p.category
                    }));
                return {
                    ...publicShop(u),
                    productCount: e.list.length, likes: e.likes,
                    sales: e.sales, followers: e.fset.size,
                    reviews, rating: reviews ? Math.round(ratingSum / reviews * 10) / 10 : 0,
                    stockTotal: stock,
                    minPrice: min, maxPrice: max,
                    cats: [...cats],
                    preview,
                    score: shopScore(u).score,
                    openNow: isOpenNow(u.shop_hours)
                };
            })
            .filter(s => !onlyVerified || s.shopVerified)
            .filter(s => !onlyDelivery || s.shopDelivery);

        if (q)
            shops = shops.filter(s => [
                s.shopName, s.username, s.shopDesc, s.shopSlogan, s.shopCity,
                s.shopAddress, ...(Array.isArray(s.shopCats) ? s.shopCats : [])
            ].join(' ').toLowerCase().includes(q));

        const sort = url.searchParams.get('sort') || (scoped ? 'products' : 'recent');
        shops.sort({
            products: (a, b) => b.productCount - a.productCount || b.likes - a.likes,
            likes:    (a, b) => b.likes - a.likes || b.productCount - a.productCount,
            name:     (a, b) => String(a.shopName).localeCompare(String(b.shopName), 'fr'),
            recent:   (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)),
            rating:   (a, b) => (b.rating - a.rating) || (b.reviews - a.reviews) || b.productCount - a.productCount,
            sales:    (a, b) => b.sales - a.sales || b.productCount - a.productCount,
            score:    (a, b) => b.score - a.score || b.productCount - a.productCount,
            open:     (a, b) => (b.openNow === true) - (a.openNow === true) || b.productCount - a.productCount
        }[sort] || ((a, b) => b.productCount - a.productCount));

        ok(res, { shops, cat: cat || 'Toutes', total: shops.length });
    },

    /* Vitrine complète d'une boutique : fiche, statistiques, articles et
       quelques boutiques similaires pour continuer la visite. */
    'GET /api/shops/:username': async (req, res, url, m) => {
        const owner = await db.one('users', { username: String(m.username).toLowerCase() });
        if (!owner) return err(res, 404, 'Boutique introuvable');
        const auth = await currentUser(req);
        const isAdmin = !!(auth && auth.user.is_admin);
        /* une boutique suspendue garde sa page : on y explique la suspension
           au lieu d'un 404 trompeur, mais on n'y montre aucun article. */
        const blocked = !!owner.shop_suspended && !isAdmin;
        const where = { owner_id: owner.id };
        if (!isAdmin && !blocked) where.published = 1;
        const rows = await db.all('products', where, { orderBy: 'created_at DESC' });
        const visible = blocked ? [] : rows;
        const products = await decorateAll(visible, auth ? auth.user.id : null);
        const allLikes = await db.all('likes');
        const orders = await db.all('orders');

        const ids = new Set(visible.map(p => Number(p.id)));
        const followers = new Set();
        let likes = 0;
        for (const l of allLikes){
            if (!ids.has(Number(l.product_id))) continue;
            likes++;
            if (l.user_id != null) followers.add(Number(l.user_id));
        }
        let sales = 0, revenue = 0;
        for (const o of orders){
            for (const line of parseItems(o.items)){
                if (!ids.has(Number(line.id))) continue;
                sales += line.qty || 1;
                revenue += (line.price || 0) * (line.qty || 1);
            }
        }
        const reviews = products.reduce((s, p) => s + (p.reviews || 0), 0);
        const rating = reviews
            ? Math.round(products.reduce((s, p) => s + (p.rating || 0) * (p.reviews || 0), 0) / reviews * 10) / 10
            : 0;
        const score = shopScore(owner);

        /* boutiques similaires : mêmes catégories, le plus de produits d'abord */
        const myCats = new Set(products.map(p => p.cat));
        let related = [];
        try {
            const all = await db.all('users', {}, { orderBy: 'created_at DESC' });
            const others = all.filter(u => !shopIsBlocked(u) && !sameId(u.id, owner.id));
            const counts = new Map();
            for (const p of await db.all('products', isAdmin ? {} : { published: 1 })){
                if (sameId(p.owner_id, owner.id)) continue;
                const k = Number(p.owner_id);
                if (!counts.has(k)) counts.set(k, { n: 0, common: 0 });
                const e = counts.get(k);
                e.n++;
                if (myCats.has(p.category)) e.common++;
            }
            related = others
                .map(u => ({ u, e: counts.get(Number(u.id)) || { n: 0, common: 0 } }))
                .filter(x => x.e.n > 0)
                .sort((a, b) => b.e.common - a.e.common || b.e.n - a.e.n)
                .slice(0, 4)
                .map(x => ({
                    ...publicShop(x.u),
                    productCount: x.e.n,
                    common: x.e.common
                }));
        } catch (e){ /* la liste secondaire ne doit jamais faire échouer la vitrine */ }

        const cats = [...new Set(products.map(p => p.cat))];
        ok(res, {
            shop: {
                ...publicShop(owner),
                isOwner: !!(auth && sameId(auth.user.id, owner.id)),
                suspended: blocked,
                productCount: products.length,
                likes,
                followers: followers.size,
                sales,
                revenue,
                reviews,
                rating,
                score: score.score,
                scoreDone: score.done,
                scoreTotal: score.total,
                checklist: score.missing,
                openNow: isOpenNow(owner.shop_hours),
                minPrice: products.length ? Math.min(...products.map(p => p.price)) : null,
                maxPrice: products.length ? Math.max(...products.map(p => p.price)) : null,
                stockTotal: products.reduce((s, p) => s + (p.stock || 0), 0),
                cats
            },
            products,
            related
        });
    },

    /* ---------- TÉLÉVERSEMENT D'IMAGE ---------- */
    'POST /api/upload': async (req, res) => {
        const auth = await currentUser(req);
        if (!auth) return err(res, 401, 'Connectez-vous pour envoyer une image');
        /* une boutique suspendue n'ajoute plus de photos : c'est souvent
           exactement ce que l'administration cherche à bloquer */
        if (auth.user.shop_suspended) return shopBlockedError(res, auth.user);
        const { dataUrl } = await readBody(req);
        if (!dataUrl) return err(res, 400, 'Aucune image reçue');

        /* Tous les formats d'image sont acceptés : on se fie au type MIME
           transporté dans l'URL de données (« image/… ;base64,… »). */
        const m = /^data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/i.exec(String(dataUrl));
        if (!m) return err(res, 400, 'Seules les images sont acceptées');
        const subtype = m[1].slice(6).toLowerCase();
        const buf = Buffer.from(m[2], 'base64');
        if (buf.length > 3 * 1024 * 1024) return err(res, 413, 'Image trop lourde (max 3 Mo)');

        const ext = IMG_EXT[subtype] || subtype.replace(/[^a-z0-9]/g, '') || 'jpg';
        /* suffixe aleatoire : plusieurs photos peuvent etre envoyees en meme milliseconde */
        const name = `img-${auth.user.id}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
        await photos.put(name, buf, 'image/' + subtype);
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
                shopsSuspended: users.filter(u => u.shop_suspended && !u.banned).length,
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

    /* ---------- ADMIN : fiche de modération d'un compte ----------
   Tout ce qu'il faut pour juger une boutique : ses coordonnées, ses
   statistiques, et surtout la liste de ses articles avec leurs photos. */
'GET /api/admin/users/:id': async (req, res, url, m) => {
        const me = await requireAdmin(req, res);
        if (!me) return;
        const target = await db.one('users', { id: Number(m.id) });
        if (!target) return err(res, 404, 'Compte introuvable');
        const rows = await db.all('products', { owner_id: target.id }, { orderBy: 'created_at DESC' });
        const products = await decorateAll(rows, null);
        ok(res, {
            user: await adminUser(target),
            products,
            photos: shopPhotoList(target),
            total: products.length
        });
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
        /* Suspension de la boutique seule : le compte garde son accès, la
           vitrine et les publications disparaissent tant que le vendeur
           n'a pas corrigé ce qui motive la décision. Le motif lui est
           renvoyé dans /api/me, il doit donc être lisible. */
        if (b.shopSuspended !== undefined){
            if (b.shopSuspended){
                patch.shop_suspended = 1;
                patch.shop_suspended_reason = flat(b.shopSuspendedReason, 200);
                patch.shop_suspended_at = nowISO();
            } else {
                patch.shop_suspended = 0;
                patch.shop_suspended_reason = '';
                patch.shop_suspended_at = '';
            }
        }
        /* l'administration peut aussi corriger la fiche et poser le badge
           « boutique vérifiée », que le vendeur ne peut pas s'attribuer */
        const { patch: shopPatch, error: shopError } = shopPatchFrom(b, { allowAdminFlags: true });
        if (shopError) return err(res, 400, shopError);
        Object.assign(patch, shopPatch);
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
            else if (action === 'suspendShop'){
                await db.update('users', id, {
                    shop_suspended: 1,
                    shop_suspended_reason: 'Suspendue depuis la liste des comptes',
                    shop_suspended_at: nowISO()
                });
                done++;
            }
            else if (action === 'reactivateShop'){
                await db.update('users', id, { shop_suspended: 0, shop_suspended_reason: '', shop_suspended_at: '' });
                done++;
            }
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

    /* ---------- ADMIN : retirer une photo ---------- */
    'POST /api/admin/photos/remove': async (req, res) => {
        if (!await requireAdmin(req, res)) return;
        const b = await readBody(req);
        const photo = String(b.url || '').trim().slice(0, 400);
        if (!photo) return err(res, 400, 'Aucune photo indiquée');
        if (!isPhotoUrl(photo)) return err(res, 400, 'Adresse de photo invalide');

        /* On ne retire jamais « n'importe où » : la photo doit appartenir
           à la cible annoncée, sinon un administrateur pourrait vider la
           galerie d'une autre boutique en envoyant son identifiant. */
        let table, id, patch;
        if (b.kind === 'product'){
            const p = await db.one('products', { id: Number(b.id) });
            if (!p) return err(res, 404, 'Article introuvable');
            const list = readPhotos(p.images, p.image);
            if (!list.includes(photo)) return err(res, 404, 'Cette photo ne fait pas partie de cet article');
            const kept = photosField(list.filter(u => u !== photo), null);
            table = 'products'; id = p.id;
            patch = { image: kept.image, images: kept.images };
        } else if (b.kind === 'shop'){
            const u = await db.one('users', { id: Number(b.id) });
            if (!u) return err(res, 404, 'Compte introuvable');
            patch = {};
            if (u.avatar === photo)  patch.avatar = '';
            if (u.banner === photo) patch.banner = '';
            const gallery = readList(u.shop_gallery, null, MAX_GALLERY);
            if (gallery.includes(photo)) patch.shop_gallery = gallery.filter(x => x !== photo).join('|');
            if (!Object.keys(patch).length)
                return err(res, 404, 'Cette photo ne fait pas partie de cette boutique');
            table = 'users'; id = u.id;
        } else {
            return err(res, 400, 'Type de photo inconnu (shop ou product)');
        }

        await db.update(table, id, patch);

        /* Le fichier lui-même disparaît quand il est stocké chez nous.
           Une URL extérieure (Facebook, Unsplash…) n'est évidemment pas
           touchée : on se contente de décrocher le lien. */
        let fileDeleted = false;
        const local = /^\/uploads\/([\w.-]+)$/.exec(photo);
        if (local){
            try { fileDeleted = await photos.remove(local[1]); }
            catch (e){ console.warn('[moderation] suppression de', local[1], '—', e.message); }
        }
        ok(res, { ok: true, kind: b.kind, id, fileDeleted });
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
                id: o.id, ref: o.ref, total: o.total, status: o.status, payment: o.payment || '', createdAt: o.created_at,
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
        const { userId, items, payment } = await readBody(req);
        if (!Array.isArray(items) || !items.length) return err(res, 400, 'Panier vide');

        const { total, lines } = await buildOrderLines(items);
        if (!lines.length) return err(res, 400, 'Aucun article valide dans la commande');

        const buyer = userId ? await db.one('users', { id: Number(userId) }) : null;
        if (userId && !buyer) return err(res, 404, 'Acheteur introuvable');

        const pay = PAYMENT_IDS.includes(payment) ? payment : '';
        const order = await db.insert('orders', {
            user_id: buyer ? buyer.id : null, ref: newOrderRef(), total,
            items: JSON.stringify(lines), payment: pay, status: 'Confirmée', created_at: nowISO()
        });
        ok(res, { order: { id: order.id, ref: order.ref, total: order.total, payment: order.payment, status: order.status, createdAt: order.created_at, items: lines } });
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
        'Content-Type': mimeOfExt(ext),
        /* les photos sont du contenu envoyé par les vendeurs : on empêche
           tout script embarqué (SVG notamment) de s'exécuter. */
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
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
        'Content-Type': mimeOfExt(ext),
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
        }         catch (e){
            console.error('[api]', e);
            /* e.status permet à une panne de configuration de répondre 503
               (« service indisponible ») au lieu d'une erreur opaque. */
            if (!res.headersSent) err(res, e.status || 500, e.message || 'Erreur serveur');
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
                console.log("Mot de passe admin généré (non affiché pour sécurité)");
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
