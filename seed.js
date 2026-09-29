/* ==========================================================
   INSÉRITION DU CATALOGUE OFFICIEL EN BASE
   node seed.js            → remplit la base si elle est vide
   node seed.js --reset    → vide tout puis remplit
   ========================================================== */
/* ---- Imports ---- */
const crypto = require('crypto');  // scrypt : hachage des mots de passe (jamais en clair)
const db     = require('./db');     // écriture du catalogue via l'interface base normale

/* ---- Données du catalogue officiel ---- */
const { OFFICIAL_SHOP, CATALOGUE, photosFor } = require('./seed-data');

function hashPassword(pw, salt){
    return crypto.scryptSync(String(pw), salt, 64).toString('hex');
}

/* Galerie de photos d'un article du catalogue officiel (4 photos). */
const galleryOf = title => photosFor(title);

/* Détails saisis : on ne garde que les paires { k, v } qui ont un
   intitulé, comme le fait le serveur à la publication. */
function detailsOf(list){
    if (!Array.isArray(list)) return [];
    return list
        .filter(d => d && typeof d === 'object' && String(d.k || '').trim())
        .map(d => ({ k: String(d.k).trim().slice(0, 60), v: String(d.v || '').trim().slice(0, 200) }));
}

/* Mot de passe du compte administrateur.
   En production il vient de la variable ADMIN_PASSWORD (secret de la
   plateforme). Sinon on en tire un au hasard : un mot de passe écrit en
   dur dans le dépôt serait connu de quiconque a le code. */
const ADMIN_LETTERS = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const randomPassword = len => {
    let out = '';
    for (let i = 0; i < len; i++)
        out += ADMIN_LETTERS[crypto.randomInt(ADMIN_LETTERS.length)];
    return out;
};

async function seed({ reset = false, password } = {}){
    const imposed = password || process.env.ADMIN_PASSWORD || '';
    const chosen = imposed || randomPassword(20);
    if (reset){
        await db.reset();
        console.log('  base vidée');
    }

    let shop = await db.one('users', { username: OFFICIAL_SHOP.username });
    if (!shop){
        const salt = crypto.randomBytes(16).toString('hex');
        shop = await db.insert('users', {
            username: OFFICIAL_SHOP.username,
            email: OFFICIAL_SHOP.email,
            password_hash: hashPassword(chosen, salt),
            salt,
            shop_name: OFFICIAL_SHOP.shopName,
            shop_desc: OFFICIAL_SHOP.shopDesc,
            shop_city: OFFICIAL_SHOP.city,
            phone: OFFICIAL_SHOP.phone,
            avatar: '',
            banner: '',
            is_admin: 1,          /* la boutique officielle administre la plateforme */
            banned: 0,
            created_at: new Date().toISOString()
        });
        console.log('  boutique officielle créée (identifiant : businessenligne, administrateur)');
    } else if (!shop.is_admin){
        /* base déjà existante : on passe l'officielle en administrateur */
        shop = await db.update('users', shop.id, { is_admin: 1 });
        console.log('  boutique officielle passée en administrateur');
    }

    const existing = await db.count('products', { owner_id: shop.id });
    const inShop = await db.all('products', { owner_id: shop.id });
    const already = new Set(inShop.map(p => p.title));

    /* une seule écriture groupée pour tout le catalogue manquant */
    const missing = CATALOGUE
        .map(([title, category, price, oldPrice, stock, badge, prime, rating, reviews, description, details], i) =>
            ({ title, category, price, oldPrice, stock, badge, prime, rating, reviews, description, details, i }))
        .filter(c => !already.has(c.title))
        .map(({ i, ...c }) => {
            const images = galleryOf(c.title);
            return {
                owner_id: shop.id, title: c.title, category: c.category, price: c.price,
                old_price: c.oldPrice, stock: c.stock,
                image: images[0], images: JSON.stringify(images),
                details: JSON.stringify(detailsOf(c.details)),
                description: c.description,
                badge: c.badge, prime: c.prime, rating: c.rating, reviews: c.reviews, published: 1,
                created_at: new Date(Date.now() - i * 36e5).toISOString()
            };
        });

    if (missing.length) await db.insertMany('products', missing);
    const added = missing.length;

    /* les articles déjà en base mais sans galerie reçoivent leurs photos et
       leurs détails : sans cela leur fiche n'aurait rien à faire défiler */
    let filled = 0;
    for (const p of inShop){
        const known = CATALOGUE.find(c => c[0] === p.title);
        if (!known) continue;
        const hasPhotos = p.image || (p.images && p.images !== '[]');
        if (hasPhotos) continue;
        const images = galleryOf(p.title);
        await db.update('products', p.id, {
            image: images[0],
            images: JSON.stringify(images),
            details: JSON.stringify(detailsOf(known[10]))
        });
        filled++;
    }

    console.log(`  ${added} article(s) inséré(s) — total boutique : ${existing + added}`);
    if (filled) console.log(`  ${filled} article(s) déjà en base complété(s) avec leur galerie de photos`);
    console.log(`  base utilisée : ${db.driver}${db.projectId ? ' (' + db.projectId + ')' : ''}`);
    /* Le mot de passe n'est rappelé que s'il vient d'être tiré au sort :
       ADMIN_PASSWORD est un secret, il ne doit pas finir dans les journaux. */
    if (!imposed) console.log(`  mot de passe de la boutique officielle : ${chosen}`);
    else console.log('  mot de passe de la boutique officielle : celui défini par ADMIN_PASSWORD');
    return { shop, password: chosen, generated: !imposed };
}

if (require.main === module){
    (async () => {
        console.log('\n  Initialisation de la base BusinessEnLigne (' + db.driver + ')');
        await seed({ reset: process.argv.includes('--reset') });
        console.log('  terminé\n');
    })().catch(e => {
        console.error('\n  Échec de l\'initialisation :', e.message, '\n');
        process.exit(1);
    });
}

module.exports = seed;
