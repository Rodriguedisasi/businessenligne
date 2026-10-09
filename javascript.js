/* ==========================================================
   BUSINESSENLIGNE  —  LOGIQUE (style Amazon)
   Catalogue + recherche + filtres + panier (LocalStorage)
   ========================================================== */

/* ---------------- CATALOGUE ---------------- */
let PRODUCTS = [
    { id:'p01', cat:'Électronique', name:'Smartphone Nova X20 256Go 5G', price:250000, old:320000, rating:4.6, reviews:1284, stock:12, prime:true, seed:'phone1', badge:'deal',
      desc:'Écran AMOLED 6,7", caméra 108 Mpx, batterie 5000 mAh, charge rapide 65 W.', feats:['Écran AMOLED 6,7 pouces','Caméra triple 108 Mpx','Charge rapide 65 W','Garantie 12 mois'] },
    { id:'p02', cat:'Électronique', name:'Écouteurs sans fil Pro ANC', price:45000, old:78000, rating:4.4, reviews:2310, stock:40, prime:true, seed:'earbuds1', badge:'best',
      desc:'Réduction de bruit active, 30h d\'autonomie, Bluetooth 5.3.', feats:['ANC active','30h d\'autonomie','Charge sans fil','Étui inclus'] },
    { id:'p03', cat:'Électronique', name:'Montre connectée Fit Pro', price:89900, old:120000, rating:4.5, reviews:876, stock:8, prime:true, seed:'watch1', badge:'best',
      desc:'Écran AMOLED 1,9", suivi du sommeil, GPS, 14 jours d\'autonomie.', feats:['GPS intégré','Capteur cardiaque SpO2','Étanche 5 ATM','14 jours d\'autonomie'] },
    { id:'p04', cat:'Électronique', name:'Tablette Ultra 11" 128Go', price:320000, old:410000, rating:4.3, reviews:512, stock:5, prime:true, seed:'tablet1', badge:'',
      desc:'Tablette 11 pouces, 4Go RAM, stylet inclus, clavier détachable.', feats:['Écran 11 pouces 2K','4 Go RAM / 128 Go','Stylet inclus','Clavier detachable'] },
    { id:'p05', cat:'Électronique', name:'Enceinte Bluetooth Bass 40W', price:37500, old:null, rating:4.2, reviews:934, stock:27, prime:true, seed:'speaker1', badge:'new',
      desc:'Son puissant 40W, étanche IPX7, 20h d\'autonomie.', feats:['Puissance 40 W','Étanchéité IPX7','20h d\'autonomie','Appairage stéréo'] },
    { id:'p06', cat:'Électronique', name:'Chargeur rapide GaN 65W', price:18500, old:26000, rating:4.7, reviews:3120, stock:65, prime:false, seed:'charger1', badge:'',
      desc:'Technologie GaN, 3 ports, compatible smartphone et ordinateur portable.', feats:['3 ports (2 USB-C + 1 USB-A','65 W','Technologie GaN','Câble inclus'] },
    { id:'p07', cat:'Électronique', name:'Webcam HD 1080p avec micro', price:32000, old:null, rating:4.1, reviews:428, stock:19, prime:false, seed:'webcam1', badge:'new',
      desc:'Capteur 1080p, autofocus, micro à réduction de bruit, clip universel.', feats:['Résolution 1080p','Autofocus','Micro anti-bruit','Support clip'] },
    { id:'p08', cat:'Électronique', name:'Clavier mécanique RGB', price:58000, old:74000, rating:4.5, reviews:655, stock:14, prime:true, seed:'keyboard1', badge:'deal',
      desc:'Switches mécaniques, rétroéclairage RGB, châssis aluminium.', feats:['Switches mécaniques','Rétroéclairage RGB','Châssis aluminium','USB détachable'] },

    { id:'p09', cat:'Mode', name:'Chemise homme slim casual', price:32500, old:48000, rating:4.3, reviews:742, stock:33, prime:false, seed:'shirt1', badge:'deal',
      desc:'Coton premium, coupe slim, entretien facile. 6 coloris disponibles.', feats:['100% coton premium','Coupe slim','6 coloris','Lavable en machine'] },
    { id:'p10', cat:'Mode', name:'Sneakers running légères', price:78500, old:105000, rating:4.6, reviews:1893, stock:22, prime:true, seed:'shoes1', badge:'best',
      desc:'Semelle amortissante, tige respirante, légères pour la course urbaine.', feats:['Semelle amortissante','Tige respirante','Type Running','Pointures 38-46'] },
    { id:'p11', cat:'Mode', name:'Blazer élégant coupe droite', price:120000, old:null, rating:4.4, reviews:412, stock:9, prime:false, seed:'blazer1', badge:'new',
      desc:'Mélange laine, coupe droite, occasion idéale pour le bureau.', feats:['60% laine','Deux boutons','Doublure satin','Poches à rabat'] },
    { id:'p12', cat:'Mode', name:'Sac à dos urbain 20L', price:55000, old:69000, rating:4.5, reviews:1108, stock:26, prime:false, seed:'bag1', badge:'',
      desc:'Compartiment_RGB pour ordinateur 15,6", tissu imperméable.', feats:['Compartiment PC 15,6"','Tissu imperméable','Port USB externe','Bandes réfléchissantes'] },
    { id:'p13', cat:'Mode', name:'Lunettes de soleil polarisées', price:28900, old:45000, rating:4.2, reviews:634, stock:48, prime:false, seed:'glass1', badge:'deal',
      desc:'Verres polarisés UV400, monture légère, étui rigide inclus.', feats:['UV400','Verres polarisés','Monture légère','Étui + chiffon'] },
    { id:'p14', cat:'Mode', name:'Jean slim premium stretch', price:49800, old:65000, rating:4.4, reviews:921, stock:31, prime:false, seed:'jeans1', badge:'best',
      desc:'Denim stretch, taille ajustée, 5 poches renforcées.', feats:['Denim stretch','5 poches','Boutons rivetés','Lavable en machine'] },
    { id:'p15', cat:'Mode', name:'Robe droite imprimée été', price:37500, old:null, rating:4.1, reviews:288, stock:17, prime:false, seed:'dress1', badge:'new',
      desc:'Viscose légère, motif exclusif, parfait pour les journées chaudes.', feats:['Viscose respirante','Taille marquée','Imprimé exclusif','Doublure intégrale'] },

    { id:'p16', cat:'Maison', name:'Cafetière à piston 1L', price:42000, old:58000, rating:4.5, reviews:820, stock:24, prime:false, seed:'coffee1', badge:'deal',
      desc:'Verre borosilicate, plaque chauffante, facile à nettoyer.', feats:['Contenance 1 L','Verre borosilicate','Plaque chauffante','Poignée isolante'] },
    { id:'p17', cat:'Maison', name:'Lampe de chevet LED rotative', price:21500, old:null, rating:4.3, reviews:377, stock:55, prime:false, seed:'lamp1', badge:'new',
      desc:'3 températures de lumière, bras orientable, variateur d\'intensité.', feats:['3 températures','Bras 360°','Variateur','USB en sortie'] },
    { id:'p18', cat:'Maison', name:'Set literie coton 4 pièces', price:62000, old:85000, rating:4.4, reviews:512, stock:15, prime:false, seed:'bed1', badge:'best',
      desc:'Coton 100%, 200 fils, hypoallergénique, lavable en machine.', feats:['Coton 100%','200 fils','2 housses + 1 drap','Hypoallergénique'] },
    { id:'p19', cat:'Maison', name:'Set 6 verreries incassables', price:28000, old:null, rating:4.2, reviews:264, stock:38, prime:false, seed:'glass2', badge:'',
      desc:'Verre trempé incassable, vaisselle incluse, 400 ml chaque.', feats:['Incassable','400 ml x6','Passe au lave-vaisselle','Design moderne'] },

    { id:'p20', cat:'Sport', name:'Tapis de yoga antidérapant 6mm', price:24000, old:36000, rating:4.6, reviews:1120, stock:44, prime:false, seed:'yoga1', badge:'deal',
      desc:'TPE ecology, antidérapant, sac de transport inclus.', feats:['Épaisseur 6 mm','Matière TPE ecology','Antidérapant','Sac de transport'] },
    { id:'p21', cat:'Sport', name:'Haltères réglables 2x20kg', price:135000, old:175000, rating:4.5, reviews:341, stock:11, prime:true, seed:'dumbbell1', badge:'best',
      desc:'Disques en fonte, poignées antidérapantes, 4 réglages de charge.', feats:['2 x 20 kg','Fonte','4 réglages','Poignées crantées'] },
    { id:'p22', cat:'Sport', name:'Ballon de basket cuiriel', price:29500, old:null, rating:4.3, reviews:498, stock:29, prime:false, seed:'ball1', badge:'new',
      desc:'Cuir synthétique, valve BUTIQ, taille 7 officielle.', feats:['Taille 7','Cuir synthétique','Valve BUTIQ','Usage extérieur'] },

    { id:'p23', cat:'Beauté', name:'Sèche-cheveux ionique 2200W', price:58000, old:76000, rating:4.4, reviews:876, stock:21, prime:false, seed:'hair1', badge:'best',
      desc:'Technologie ionique, 3 niveaux de chaleur, 2 vitesses, diffuseur.', feats:['2200 W','Technologie ionique','Diffuseur inclus','Arrêt automatique'] },
    { id:'p24', cat:'Beauté', name:'Sérum visage acide hyaluronique', price:34500, old:52000, rating:4.7, reviews:1420, stock:36, prime:false, seed:'serum1', badge:'deal',
      desc:'Acide hyaluronique + vitamine C, 30 ml, peau hydratée en 7 jours.', feats:['Acide hyaluronique','Vitamine C','30 ml','Peaux mixtes à sèches'] },

    { id:'p25', cat:'Enfants', name:'Montre enfant silenced 8 ans+', price:19000, old:28000, rating:4.2, reviews:290, stock:42, prime:false, seed:'watch2', badge:'',
      desc:'Silicone doux, verre anti-casse, étanche à 5 ATM.', feats:['Silicone doux','Verre anti-casse','Étanche 5 ATM','8 ans et +'] },
    { id:'p26', cat:'Enfants', name:'Cartable scolaire 3 compartiments', price:46500, old:62000, rating:4.4, reviews:405, stock:18, prime:false, seed:'bag2', badge:'new',
      desc:'REF 20L, bandoulière rembourrée, passant pour chariot.', feats:['3 compartiments','20 L','Bandoulière rembourrée','Dos ventilé'] },

    { id:'p27', cat:'Livres', name:'Le guide du e-commerce Congo', price:25000, old:35000, rating:4.8, reviews:212, stock:60, prime:false, seed:'book1', badge:'best',
      desc:'Livre 240 pages sur la vente en ligne en RDC.', feats:['240 pages','Broché','Illustré','Édition 2026'] },
    { id:'p28', cat:'Livres', name:'Cuisine facile : 100 recettes', price:27500, old:null, rating:4.6, reviews:388, stock:52, prime:false, seed:'book2', badge:'new',
      desc:'Recettes étape par étape, ingrédients locaux.', feats:['100 recettes','Illustré','Format poche','Ingrédients locaux'] }
];

/* ---------------- PHOTOS ET DÉTAILS DU CATALOGUE DE SECOURS ----------------
   Le serveur peut être absent : le site doit quand même présenter des
   articles qui défilent. Chaque article du catalogue local reçoit donc
   plusieurs photos et un tableau de détails, comme un article publié. */
const LOCAL_PHOTOS = 4;                 /* photos par article */
const picURL = (seed, i) => `https://picsum.photos/seed/${seed}${i ? '-v' + (i + 1) : ''}/800/800`;
/* Une caractéristique devient une ligne de détails :
   « Écran AMOLED 6,7 pouces » -> { k:'Écran', v:'AMOLED 6,7 pouces' } */
const specOf = f => {
    const cut = String(f).match(/^(\S+(?:\s\S+)?)\s+(\S.*)$/);
    return { k: (cut ? cut[1] : String(f)).replace(/[\s,;:]+$/, ''), v: cut ? cut[2] : '' };
};
PRODUCTS.forEach(p => {
    p.images = Array.from({ length: LOCAL_PHOTOS }, (_, i) => picURL(p.seed || p.id, i));
    p.details = (p.feats || []).map(specOf);
});

const CATEGORIES = [
    { name:'Électronique', file:'electronique.html', img:'https://picsum.photos/seed/cat-elec/220/180' },
    { name:'Mode', file:'mode.html', img:'https://picsum.photos/seed/cat-mode/220/180' },
    { name:'Maison', file:'maison.html', img:'https://picsum.photos/seed/cat-maison/220/180' },
    { name:'Sport', file:'sport.html', img:'https://picsum.photos/seed/cat-sport/220/180' },
    { name:'Beauté', file:'beaute.html', img:'https://picsum.photos/seed/cat-beaute/220/180' },
    { name:'Enfants', file:'enfants.html', img:'https://picsum.photos/seed/cat-kids/220/180' },
    { name:'Livres', file:'livres.html', img:'https://picsum.photos/seed/cat-livres/220/180' }
];
const catOf = c => PRODUCTS.filter(p => p.cat === c);
const allFile = 'tous.html';

const REVIEWS = [
    { n:'Marc D.', img:'https://randomuser.me/api/portraits/men/1.jpg', r:5, t:'Livraison reçue en 3 jours à Lubumbashi, emballage nickel. Le service client répond vite sur WhatsApp.' },
    { n:'Sarah K.', img:'https://randomuser.me/api/portraits/women/2.jpg', r:5, t:'J\'ai commandé une tablette, exactement la description. Je recommande pour le rapport qualité/prix.' },
    { n:'Junior B.', img:'https://randomuser.me/api/portraits/men/32.jpg', r:4, t:'Le panier et le paiement mobile Money sont simples. Un délai de livraison un peu long mais correct.' },
    { n:'Nathalie M.', img:'https://randomuser.me/api/portraits/women/44.jpg', r:5, t:'Les vêtements sont de très bonne qualité. J\'ai demandé un échange de taille, retour gratuit accepté.' }
];

/* ---------------- UTILS ---------------- */
let FC = new Intl.NumberFormat(BE_LOCALE);
const fmt = n => FC.format(Math.round(n)) + ' FC';
/* Formatage des nombres et des dates dans la langue choisie (voir i18n.js). */
const nf = () => new Intl.NumberFormat(BE_LOCALE);
const nfmt = n => nf().format(n);
const dj = (d, o) => new Date(d).toLocaleDateString(BE_LOCALE, o);
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const imgOf = p => p.image ? p.image : `https://picsum.photos/seed/${p.seed}/420/420`;
/* Galerie d'un article : la photo principale + les autres si l'article en a. */
const photosOf = p => {
    const list = (Array.isArray(p.images) ? p.images : []).filter(u => typeof u === 'string' && u.trim());
    return list.length ? list : [imgOf(p)];
};
const safeUrl = u => String(u || '').replace(/["'<>]/g, '');
/* Images : on accepte tous les formats. Le filtre accepte tout type MIME
   « image/… », et se rabat sur l'extension quand le navigateur ne fournit
   pas le type (fichiers récents type HEIC, formats bruts, etc.). */
const IMAGE_ACCEPT = 'image/*,.png,.jpg,.jpeg,.jpe,.jfif,.gif,.webp,.avif,.bmp,.dib,.tif,.tiff,.heic,.heif,.svg,.ico,.cur,.apng,.jxl,.psd,.raw,.dng,.cr2,.nef,.arw';
const IMAGE_EXT = /\.(png|jpe?g|jpe|jfif|gif|webp|avif|bmp|dib|tiff?|heic|heif|svg|ico|cur|apng|jxl|psd|raw|dng|cr2|nef|arw|xbm|xpm|wbmp)$/i;
const isImageFile = f => /^image\//.test(String((f && f.type) || '')) || IMAGE_EXT.test(String((f && f.name) || ''));
/* Contrôles de saisie réutilisés par tous les formulaires du site. */
const HTTP_URL = /^https?:\/\/[^\s"'<>]{4,400}$/i;
const isMail   = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());
const digits   = v => String(v == null ? '' : v).replace(/\D/g, '');
/* Texte saisi par l'utilisateur, affiche en HTML (détails, libellés). */
const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
/* Lignes de détails d'un article : { k: libellé, v: valeur }. */
const detailsOf = p => (Array.isArray(p.details) ? p.details : [])
    .filter(d => d && String(d.k || '').trim())
    .map(d => ({ k: String(d.k).trim(), v: String(d.v || '').trim() }));
/* Liste à puces de la fiche : les caractéristiques de l'article ; à défaut
   d'une liste propre, on recycle les valeurs du tableau de détails. */
const featsOf = p => {
    const f = (Array.isArray(p.feats) ? p.feats : []).map(x => String(x).trim()).filter(Boolean);
    return f.length ? f : detailsOf(p).map(d => d.k + (d.v ? ' : ' + d.v : ''));
};
/* Le vendeur connected est-il autorisé à modifier / supprimer l'article ? */
function canManage(p){
    const u = window.BE ? BE.user() : null;
    if (!u || !p || !p.owner) return false;
    return p.owner.username === u.username || !!u.isAdmin;
}
/* Bloc « Informations » de la fiche produit : le tableau de détails saisi
   par le vendeur, puis les infos de l'article (catégorie, boutique, note,
   stock, livraison…). Le bloc est créé une seule fois puis réutilisé. */
let infoBox = null;
function paintInfo(p){
    const anchor = $('#mList') || $('#mDesc') || $('#mTitle');
    if (!anchor) return;
    if (!infoBox || !infoBox.isConnected){
        infoBox = document.createElement('div');
        infoBox.id = 'mInfo';
        infoBox.className = 'p-info';
        anchor.after(infoBox);
    }
    const photos = photosOf(p).length;
    const rows = [
        [t('Catégorie'), p.cat],
        p.owner && p.owner.shopName ? [t('Boutique'), p.owner.shopName] : null,
        [t('Note'), t('★ {0} sur 5 · {1} avis', [String(p.rating).replace('.', ','), nfmt(Number(p.reviews || 0))])],
        [t("J'aime"), t(p.likes > 1 ? '{0} personnes' : '{0} personne', [nfmt(Number(p.likes || 0))])],
        [t('Photos'), t(photos > 1 ? '{0} photo(s) dans la galerie' : '{0} photo', [nfmt(photos)])],
        [t('Disponibilité'), p.stock > 0
            ? (p.stock <= 10 ? t('Plus que {0} en stock', [nfmt(p.stock)]) : t('{0} article(s) en stock', [nfmt(p.stock)]))
            : t('Rupture de stock')],
        [t('Livraison'), t('Gratuite, reçue sous 24 à 48 h à Lubumbashi')],
        [t('Paiement'), t('Mobile Money, carte bancaire ou espèces à la livraison')],
        p.prime ? [t('Livraison Prime'), t('Offerte et prioritaire')] : null
    ].filter(Boolean);
    const specs = detailsOf(p);
    infoBox.innerHTML =
        (specs.length
            ? `<h4>${t("Détails de l'article")}</h4><table><tbody>${specs.map(d =>
                `<tr><th>${esc(d.k)}</th><td>${d.v ? esc(d.v) : '—'}</td></tr>`).join('')}</tbody></table>`
            : '') +
        `<h4>${t("Informations sur l'article")}</h4><ul class="p-meta">${rows.map(([k, v]) =>
            `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join('')}</ul>`;
}

function starsHTML(rating){
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let s = '';
    for (let i = 0; i < 5; i++){
        if (i < full) s += '<i class="fas fa-star"></i>';
        else if (i === full && half) s += '<i class="fas fa-star-half-alt"></i>';
        else s += '<i class="far fa-star"></i>';
    }
    return `<span class="stars">${s}</span>`;
}

function toast(msg, ms){
    const wrap = $('#toastWrap');
    if (!wrap) return;
    const box = document.createElement('div');
    box.className = 'toast';
    box.textContent = t(msg);       /* le message est traduit (voir i18n.js) */
    wrap.appendChild(box);
    setTimeout(() => box.remove(), ms || 2600);
}

/* ==========================================================
   GALERIE DE PHOTOS
   Les photos d'un article defilent seules. Un seul moteur pilote
   toutes les galeries de la page : il avance, se met en pause au
   survol, s'arrete quand l'onglet est masque et n'anime que les
   galeries visibles a l'ecran.
   ========================================================== */
const GAL_MS = 5000;          /* duree d'affichage d'une photo : 5 secondes */
const galState = new WeakMap();
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Balisage d'une galerie. Une seule photo rend un <img> simple : rien ne bouge.
   opts.thumbs ajoute une rangée de vignettes sous la photo (fiche produit). */
function galleryHTML(photos, name, opts){
    opts = opts || {};
    const label = String(name || '').replace(/["'<>]/g, '');
    if (photos.length < 2){
        return `<img class="gal-single" src="${safeUrl(photos[0])}" alt="${label}">`;
    }
    const slides = photos.map((u, i) =>
        `<img class="gal-slide" src="${safeUrl(u)}" alt="${label} — ${t('photo {0}/{1}', [nfmt(i + 1), nfmt(photos.length)])}"${i ? ' loading="lazy"' : ''}>`).join('');
    return `<div class="gal" data-gal>
            <div class="gal-stage">
                <div class="gal-track">${slides}</div>
                <button type="button" class="gal-btn gal-prev" aria-label="${t('Photo précédente')}"><i class="fas fa-chevron-left"></i></button>
                <button type="button" class="gal-btn gal-next" aria-label="${t('Photo suivante')}"><i class="fas fa-chevron-right"></i></button>
                <div class="gal-dots">${photos.map((_, i) =>
                    `<button type="button" class="gal-dot" data-go="${i}" aria-label="${t('Aller à la photo {0}', [nfmt(i + 1)])}"></button>`).join('')}</div>
                <span class="gal-count">1/${nfmt(photos.length)}</span>
                <i class="fas fa-expand gal-zoom" aria-hidden="true"></i>
            </div>
            ${opts.thumbs ? `<div class="gal-thumbs">${photos.map((u, i) =>
                `<button type="button" class="gal-thumb" data-go="${i}" aria-label="${t('Voir la photo {0}', [nfmt(i + 1)])}"><img src="${safeUrl(u)}" alt=""></button>`).join('')}</div>` : ''}
        </div>`;
}

/* Branche les evenements d'une galerie et demarre son défilement. */
function mountGallery(el){
    const track = el.querySelector('.gal-track');
    if (!track) return;
    const slides = $$('.gal-slide', track);
    if (slides.length < 2) return;
    el.dataset.galOn = '1';

    const marks = $$('[data-go]', el);
    const count = $('.gal-count', el);
    const st = { i: 0, timer: null, shown: false, hover: false };
    galState.set(el, st);

    const show = i => {
        st.i = (i + slides.length) % slides.length;
        track.style.transform = `translateX(${-st.i * 100}%)`;
        marks.forEach((d, k) => d.classList.toggle('on', k === st.i));
        if (count) count.textContent = (st.i + 1) + '/' + slides.length;
    };
    const stop = () => { if (st.timer){ clearInterval(st.timer); st.timer = null; } };
    const play = () => {
        if (st.timer || st.hover || !st.shown || reduceMotion()) return;
        st.timer = setInterval(() => show(st.i + 1), GAL_MS);
    };
    /* apres un clic on repart du temps plein, la photo cliquée reste lisible */
    const replay = () => { stop(); play(); };

    /* petite API pour piloter une galerie depuis l'exterieur (visionneuse, clavier) */
    el.gal = {
        go: i => { show(i); replay(); },
        next: () => { show(st.i + 1); replay(); },
        prev: () => { show(st.i - 1); replay(); },
        get index(){ return st.i; },
        stop, play
    };

    el.querySelector('.gal-next')?.addEventListener('click', () => { show(st.i + 1); replay(); });
    el.querySelector('.gal-prev')?.addEventListener('click', () => { show(st.i - 1); replay(); });
    marks.forEach(d => d.addEventListener('click', () => { show(+d.dataset.go); replay(); }));
    el.addEventListener('mouseenter', () => { st.hover = true; stop(); });
    el.addEventListener('mouseleave', () => { st.hover = false; play(); });

    /* on ne fait tourner que ce qui est reellement visible */
    if (typeof IntersectionObserver === 'function'){
        new IntersectionObserver(entries => {
            st.shown = entries[0].isIntersecting;
            st.shown ? play() : stop();
        }, { threshold: .25 }).observe(el);
    } else {
        st.shown = true;
        play();
    }
    show(0);
}

/* Branche toutes les galeries d'un conteneur (appele apres chaque rendu). */
function initGalleries(root){
    $$('[data-gal]:not([data-gal-on])', root || document).forEach(mountGallery);
}

/* ==========================================================
   VISIONNEUSE
   Un clic sur une photo ouvre l'article en grand : toutes ses
   photos se relaient, avec le titre et le prix de l'article.
   ========================================================== */
let lb = null;

function buildLightbox(){
    const el = document.createElement('div');
    el.className = 'lightbox';
    el.innerHTML = `
        <div class="lb-box" role="dialog" aria-modal="true" aria-label="${t("Photos de l'article")}">
            <div class="lb-head">
                <div class="lb-titles">
                    <b class="lb-title"></b>
                    <span class="lb-meta"></span>
                </div>
                <button type="button" class="lb-close" aria-label="Fermer"><i class="fas fa-times"></i></button>
            </div>
            <div class="lb-stage"></div>
            <div class="lb-foot">
                <button type="button" class="btn btn-cta btn-sm lb-sheet"><i class="fas fa-info-circle"></i> ${t("Détails de l'article")}</button>
                <span class="lb-zoom"><i class="fas fa-expand"></i> ${t('Photos en grand')}</span>
            </div>
        </div>`;
    document.body.appendChild(el);
    lb = {
        el,
        stage: $('.lb-stage', el),
        gal: null,
        product: null,
        onKey: e => {
            if (!lb || !lb.el.classList.contains('show')) return;
            if (e.key === 'Escape'){ closeLightbox(); return; }
            if (!lb.gal) return;
            if (e.key === 'ArrowRight') lb.gal.next();
            if (e.key === 'ArrowLeft')  lb.gal.prev();
        }
    };
    $('.lb-close', el).onclick = closeLightbox;
    el.addEventListener('click', e => { if (e.target === el) closeLightbox(); });
    $('.lb-sheet', el).onclick = () => {
        const id = lb.product.id;
        closeLightbox();
        openModal(id);
    };
    document.addEventListener('keydown', lb.onKey);
}

function openLightbox(p, start){
    if (!lb) buildLightbox();
    const photos = photosOf(p);
    lb.product = p;
    $('.lb-title', lb.el).textContent = p.name;
    const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    $('.lb-meta', lb.el).innerHTML =
        `${fmt(p.price)}${p.old ? ` <s>${fmt(p.old)}</s> <em>-${nfmt(off)}%</em>` : ''} · ${t(p.cat)}${p.stock > 0 ? ' · ' + t('en stock') : ' · ' + t('rupturé')}`;

    lb.stage.innerHTML = photos.length > 1
        ? galleryHTML(photos, p.name, { thumbs: true })
        : `<img class="lb-single" src="${safeUrl(photos[0])}" alt="${safeUrl(p.name)}">`;
    initGalleries(lb.stage);
    const g = $('.gal', lb.stage);
    lb.gal = g ? g.gal : null;
    if (lb.gal && start) lb.gal.go(start);

    lb.el.classList.add('show');
    document.body.classList.add('modal-open');
    lb.el.querySelector('.lb-close').focus();
}

function closeLightbox(){
    if (!lb) return;
    lb.gal && lb.gal.stop();
    lb.gal = null;
    lb.el.classList.remove('show');
    document.body.classList.remove('modal-open');
}

/* Ouvre la visionneuse sur la photo actuellement affichee d'une galerie. */
function lightboxFrom(target){
    const g = target.closest('[data-gal]');
    if (!g) return;
    const card = g.closest('.p-card');
    const p = PRODUCTS.find(x => String(x.id) === String(card ? card.dataset.id : g.dataset.pid));
    if (!p) return;
    const st = galState.get(g);
    openLightbox(p, st ? st.i : 0);
}

/* Onglet en arriere-plan : on coupe tout. */
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    document.querySelectorAll('[data-gal]').forEach(el => {
        const st = galState.get(el);
        if (st && st.timer){ clearInterval(st.timer); st.timer = null; }
    });
});

/* ---------------- RENDU PRODUIT ---------------- */
function cardHTML(p){
    const off = p.off || (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);
    const badge = p.badge === 'deal' ? `<span class="badge badge-deal">${t('Promotion')} ${off}%</span>`
        : p.badge === 'new' ? `<span class="badge badge-new">${t('Nouveau')}</span>`
        : p.badge === 'best' ? `<span class="badge badge-best">${t('Meilleure vente')}</span>` : '';
    const owner = p.owner && p.owner.username
        ? `<a class="owner-tag" href="magasin.html?u=${encodeURIComponent(p.owner.username)}" onclick="event.stopPropagation()">
               <i class="fas fa-store"></i> <b>${esc(p.owner.shopName || p.owner.username)}</b>
               ${p.owner.verified ? '<i class="fas fa-badge-check sc-v" title="' + t('Boutique vérifiée') + '"></i>' : ''}
               ${p.owner.city ? `<span class="owner-city">${esc(p.owner.city)}</span>` : ''}
           </a>` : '';
    const like = `<button class="like-btn ${p.likedByMe ? 'on' : ''}" data-like="${p.id}" title="${t("J'aime")}">
            <i class="${p.likedByMe ? 'fas' : 'far'} fa-heart"></i>
            <span class="like-nb">${nfmt(Number(p.likes || 0))}</span>
        </button>`;
    return `
    <article class="p-card" data-id="${p.id}">
        ${badge}
        <div class="p-img-wrap">${galleryHTML(photosOf(p), p.name)}</div>
        <div class="p-rating">${starsHTML(p.rating)} <span class="n">${String(p.rating).replace('.', ',')}</span> <span class="c">(${nfmt(Number(p.reviews || 0))})</span></div>
        <h3 class="p-title">${p.name}</h3>
        <div class="p-price">${fmt(p.price)}${p.old ? `<span class="old">${fmt(p.old)}</span><span class="off">-${nfmt(off)}%</span>` : ''}</div>
        <div class="p-extra">${t('ou 3x {0} sans frais', [fmt(Math.round(p.price / 3))])}</div>
        ${p.prime ? `<div class="p-prime"><i class="fas fa-check-circle"></i> ${t('LIVRAISON PRIME')}</div>` : ''}
        ${owner}
        <div class="p-stock ${p.stock <= 10 ? 'low' : ''}">${p.stock <= 10 ? t('Plus que {0} en stock', [nfmt(p.stock)]) : t('En stock')}</div>
        <div class="p-actions">
            <button class="btn-add" data-add="${p.id}"><i class="fas fa-cart-plus"></i> ${t('Ajouter au panier')}</button>
            ${like}
        </div>
    </article>`;
}

/* ---------------- J'AIME ---------------- */
async function toggleLike(btn){
    const id = btn.dataset.like;
    const p = PRODUCTS.find(x => String(x.id) === String(id));
    if (!p) return;

    if (!window.BE || !BE.isOnline()){ toast(t("⚠️ J'aime disponible uniquement avec le serveur (node server.js).")); return; }
    if (!requireLogin(t('Connectez-vous pour aimer un article'))) return;

    btn.disabled = true;
    try {
        const d = await BE.toggleLike(id);
        p.likes = d.likes;
        p.likedByMe = d.liked;
        btn.classList.toggle('on', d.liked);
        btn.querySelector('i').className = d.liked ? 'fas fa-heart' : 'far fa-heart';
        btn.querySelector('.like-nb').textContent = nfmt(Number(d.likes));
        toast(d.liked ? t("❤️ Article ajouté à vos J'aime") : t("J'aime retiré"));
    } catch (err){
        toast('❌ ' + err.message);
    } finally {
        btn.disabled = false;
    }
}

/* ---------------- FILTRES / TRI ---------------- */
let state = { cat:'Toutes', q:'', sort:'relevance' };

function filtered(){
    let list = PRODUCTS.slice();
    if (state.cat !== 'Toutes') list = list.filter(p => p.cat === state.cat);
    if (state.q){
        const q = state.q.toLowerCase();
        list = list.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.cat.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q));
    }
    const by = {
        asc:  (a,b) => a.price - b.price,
        desc: (a,b) => b.price - a.price,
        note: (a,b) => b.rating - a.rating || b.reviews - a.reviews,
        off:  (a,b) => (b.old ? (1 - b.price / b.old) : 0) - (a.old ? (1 - a.price / a.old) : 0)
    }[state.sort];
    if (by) list.sort(by);
    return list;
}

function renderChips(){
    $('#filterChips').innerHTML = CATEGORIES.map(c => {
        const active = state.cat === c.name ? ' active' : '';
        return `<a href="${c.file}" class="chip${active}">${t(c.name)}</a>`;
    }).join('');
}

function renderGrid(){
    const list = filtered();
    const grid = $('#grid');
    if (!list.length){
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
            <i class="fas fa-search"></i><h3>${t('Aucun résultat')}</h3>
            <p>${t('Essayez un autre mot-clé ou une autre catégorie.')}</p></div>`;
    } else {
        grid.innerHTML = list.map(cardHTML).join('');
    }
    $('#resultInfo').textContent = !list.length
        ? t('Aucun article ne correspond à votre recherche.')
        : state.q && state.cat !== 'Toutes'
            ? t('{0} résultats pour « {1} » dans {2}', [nfmt(list.length), state.q, t(state.cat)])
            : state.q
                ? t('{0} résultats pour « {1} »', [nfmt(list.length), state.q])
                : state.cat !== 'Toutes'
                    ? t('{0} résultats dans {1}', [nfmt(list.length), t(state.cat)])
                    : t('{0} résultats', [nfmt(list.length)]);
    $('#catalogTitle').textContent = state.cat === 'Toutes' ? t('Tous les produits') : t(state.cat);
    renderChips();
    initGalleries(grid);
}

/* ---------------- ROWS ---------------- */
function row(id, list){
    const el = document.getElementById(id);
    if (el) el.innerHTML = list.map(cardHTML).join('');
    initGalleries(el);
}

function renderAll(){
    row('dealsRow', PRODUCTS.filter(p => p.badge === 'deal' || p.old).slice(0, 12));
    row('bestRow', PRODUCTS.slice().sort((a,b) => b.reviews - a.reviews).slice(0, 12));
    row('elRow', PRODUCTS.filter(p => p.cat === 'Électronique'));
    row('fashionRow', PRODUCTS.filter(p => p.cat === 'Mode'));
    $('#catGrid').innerHTML = CATEGORIES.map(c =>
        `<a href="${c.file}" class="cat-card">
            <img src="${c.img}" alt="${t(c.name)}" loading="lazy">
            <b>${t(c.name)}</b><span>${t('{0} articles', [nfmt(catOf(c.name).length)])}</span>
        </a>`).join('');
    $('#revGrid').innerHTML = REVIEWS.map(r =>
        `<div class="rev">
            <div class="rev-top">
                <img src="${r.img}" alt="${r.n}">
                <div><b>${r.n}</b><span>${t('Achat vérifié')}</span></div>
            </div>
            ${starsHTML(r.r)}
            <p style="margin-top:6px">${r.t}</p>
            <div class="verified">${t('Avis vérifié le mois dernier')}</div>
        </div>`).join('');
    renderGrid();
}
/* ==========================================================
   PANIER  (LocalStorage = base de données locale)
   ========================================================== */
const CART_KEY = 'businessenligne_cart';
const ORDERS_KEY = 'businessenligne_orders';
let cart = [];

function loadCart(){
    try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { cart = []; }
    renderCart();
}
function saveCart(){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
}
function addToCart(id, qty = 1, silent = false){
    const p = PRODUCTS.find(x => String(x.id) === String(id));
    if (!p) return;
    const line = cart.find(l => String(l.id) === String(id));
    if (line) line.qty = Math.min(line.qty + qty, 99);
    else cart.push({ id, qty: Math.min(qty, 99) });
    saveCart();
    if (!silent){
        toast(t('{0} ajouté au panier', [p.name]));
        if ($('#cartDrawer')) openCart();
    }
}
function setQty(id, qty){
    const line = cart.find(l => String(l.id) === String(id));
    if (!line) return;
    line.qty = qty;
    if (line.qty <= 0) cart = cart.filter(l => String(l.id) !== String(id));
    saveCart();
}
function removeLine(id){
    cart = cart.filter(l => String(l.id) !== String(id));
    saveCart();
}
function cartCount(){ return cart.reduce((s, l) => s + l.qty, 0); }
function cartTotal(){ return cart.reduce((s, l) => s + l.qty * (PRODUCTS.find(p => String(p.id) === String(l.id))?.price || 0), 0); }

function renderCart(){
    const badge = $('#cartItemCount');
    if (badge) badge.textContent = cartCount();
    const mBadge = $('#mnavCount');
    if (mBadge) mBadge.textContent = cartCount() || '';
    const body = $('#cartBody');
    if (!body) return;
    if (!cart.length){
        body.innerHTML = `<div class="cart-empty">
            <i class="fas fa-shopping-basket"></i>
            <p><b>${t('Votre panier est vide')}</b></p>
            <p style="font-size:12px;margin-top:6px">${t('Ajoutez des articles pour commencer.')}</p>
        </div>`;
    } else {
        body.innerHTML = cart.map(l => {
            const p = PRODUCTS.find(x => String(x.id) === String(l.id));
            if (!p) return '';
            return `<div class="cart-row" data-id="${p.id}">
                <img src="${imgOf(p)}" alt="${p.name}">
                <div class="ci-body">
                    <div class="ci-title">${p.name}</div>
                    <div class="ci-prime"><i class="fas fa-check-circle"></i> ${t('LIVRAISON PRIME')}</div>
                    <div class="ci-price">${fmt(p.price)}</div>
                    <div class="qty">
                        <select data-qty="${p.id}">
                            ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${n === l.qty ? 'selected' : ''}>${t('Qté :')} ${n}</option>`).join('')}
                        </select>
                        <button class="del" data-del="${p.id}"><i class="fas fa-trash-alt"></i> ${t('Supprimer')}</button>
                    </div>
                </div>
            </div>`;
        }).join('');
    }
    const total = cartTotal();
    const sub = $('#cartSub');
    if (sub) sub.textContent = fmt(total);
    const ship = $('#cartShip');
    if (ship) ship.textContent = total === 0
        ? t('Livraison calculée à l\'étape suivante')
        : t(total >= 150000 ? 'Livraison STANDARD offerte ✓' : 'Livraison STANDARD : 1 500 FC (offerte dès 150 000 FC)');
}

/* ---------------- OUVRIR / FERMER ---------------- */
const overlay = $('#overlay');
function openCart(){
    const d = $('#cartDrawer');
    if (!d) return;
    d.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.classList.add('modal-open');
}
function closeAll(){
    const d = $('#cartDrawer');   if (d) d.classList.remove('open');
    const m = $('#sideMenu');     if (m) m.classList.remove('open');
    const mo = $('#modal');       if (mo) mo.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    const mb = $('#accountBtn'), am = $('#accountMenu');
    if (mb && am){ mb.classList.remove('open'); am.classList.remove('open'); }
    /* on garde la page verrouillée tant que la visionneuse est ouverte */
    if (!lb || !lb.el.classList.contains('show'))
        document.body.classList.remove('modal-open');
}
function openModal(id){
    const p = PRODUCTS.find(x => String(x.id) === String(id));
    if (!p || !$('#modal')) return;
    const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    $('#modal').dataset.id = p.id;   /* pour redessiner la fiche au changement de langue */
    /* la fiche presente toutes les photos : elles se relaient seules */
    const mImg = $('#mImg');
    const stage = mImg ? (mImg.closest('.modal-img') || mImg) : null;
    if (stage){
        stage.innerHTML = galleryHTML(photosOf(p), p.name, { thumbs: true });
        initGalleries(stage);
        /* un clic sur la grande photo ouvre la visionneuse plein ecran */
        stage.querySelector('.gal-stage')?.addEventListener('click', e => {
            if (e.target.closest('button')) return;
            const g = $('.gal', stage);
            openLightbox(p, g && g.gal ? g.gal.index : 0);
        });
    } else {
        mImg.src = imgOf(p);
        mImg.alt = p.name;
    }
    const st = $('#mStars');
    st.outerHTML = starsHTML(p.rating).replace('class="stars"', 'class="stars" id="mStars"');
    $('#mRating').textContent = t('{0} sur 5', [String(p.rating).replace('.', ',')]);
    $('#mCount').textContent = t('({0} avis)', [nfmt(Number(p.reviews || 0))]);
    $('#mTitle').textContent = p.name;
    $('#mPrice').innerHTML = `${fmt(p.price)}${p.old ? `<span class="old">${fmt(p.old)}</span><span class="off">-${nfmt(off)}%</span>` : ''}`;
    $('#mDesc').textContent = p.desc || '';
    /* tableau des détails saisis par le vendeur + infos sur l'article */
    paintInfo(p);
    $('#mList').innerHTML = featsOf(p).map(f => `<li><i class="fas fa-check"></i><span>${esc(f)}</span></li>`).join('');
    paintSeller(p);
    $('#mStock').innerHTML = p.stock <= 10
        ? `<span style="color:#b12704">${t('Plus que {0} en stock', [nfmt(p.stock)])}</span>`
        : `<span style="color:#007600">${t('En stock')}</span>`;
    $('#mShip').innerHTML = t('Livraison <b>GRATUITE</b> le <b>{0}</b> à Lubumbashi', [dj(Date.now() + 3 * 864e5, { weekday: 'long', day: 'numeric', month: 'long' })]);
    $('#mBuy').onclick = () => { addToCart(p.id, 1, true); closeAll(); checkout(); };
    $('#mAdd').onclick = () => { addToCart(p.id); closeAll(); };
    $('#modal').classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.classList.add('modal-open');
}

/* ---------------- VENDEUR DE L'ARTICLE ----------------
   La fiche article rappelle qui vend l'article et donne accès direct
   à la vitrine du vendeur. Le bloc est ajouté une seule fois par fiche. */
function paintSeller(p){
    const info = $('.modal-info');
    if (!info) return;
    let box = $('#mSeller');
    const o = p.owner;
    if (!o || !o.username){
        if (box) box.remove();
        return;
    }
    if (!box){
        box = document.createElement('div');
        box.id = 'mSeller';
        box.className = 'm-seller';
        info.insertBefore(box, $('#mList'));
    }
    const face = o.avatar
        ? `<img src="${esc(o.avatar)}" alt="${esc(o.shopName || o.username)}" loading="lazy">`
        : esc(String(o.shopName || o.username).charAt(0).toUpperCase());
    box.innerHTML = `
        <a class="ms-id" href="magasin.html?u=${encodeURIComponent(o.username)}">
            <span class="ms-avatar">${face}</span>
            <span class="ms-txt">
                <b>${esc(o.shopName || o.username)}${o.verified ? ' <i class="fas fa-badge-check sc-v"></i>' : ''}</b>
                <span class="ms-sub"><i class="fas fa-at"></i> ${esc(o.username)}${o.city ? ' · <i class="fas fa-map-marker-alt"></i> ' + esc(o.city) : ''}</span>
            </span>
            <span class="ms-go"><i class="fas fa-arrow-right"></i></span>
        </a>`;
}

/* ---------------- CHECKOUT ---------------- */
async function checkout(){
    if (!cart.length){ toast(t('🛒 Votre panier est vide')); return; }
    const items = cart.map(l => ({ id: l.id, qty: l.qty }));
    const total = cartTotal();

    /* 1) on tente d'enregistrer la commande côté serveur */
    if (window.BE && BE.isOnline()){
        try {
            const o = await BE.order(items);
            cart = [];
            saveCart();
            closeAll();
            toast('✅ ' + t('Commande {0} confirmée — {1}', [o.ref, fmt(o.total)]));
            setTimeout(() => toast(t('📦 Livraison estimée sous 24 à 48h')), 900);
            return;
        } catch (e){
            toast('⚠️ ' + e.message + ' — ' + t('commande enregistrée localement.'));
        }
    }

    /* 2) repli : sauvegarde locale du panier */
    const order = {
        ref: 'BE-' + Date.now().toString().slice(-8),
        date: new Date().toISOString(),
        items: cart.map(l => {
            const p = PRODUCTS.find(x => String(x.id) === String(l.id));
            return { id: p.id, name: p.name, price: p.price, qty: l.qty };
        }),
        total
    };
    let orders = [];
    try { orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch (e) {}
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    cart = [];
    saveCart();
    closeAll();
    toast('✅ ' + t('Commande {0} confirmée — {1}', [order.ref, fmt(order.total)]));
    setTimeout(() => toast(t('📦 Livraison estimée sous 24 à 48h')), 900);
}

/* ==========================================================
   HERO CAROUSEL
   ========================================================== */
let slide = 0;
const slides = $$('.hero-slide');
const HERO_MS = 4500;        /* duree d'affichage d'une banniere */
const HERO_FIRST_MS = 1200;  /* la defilement demarre tout de suite */
function goSlide(i){
    slide = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === slide));
    $$('#heroDots button').forEach((d, k) => d.classList.toggle('active', k === slide));
}
/* le hero demarre tout seul : on arme le premier passage tot,
   puis on enchaîne les suivants au rythme normal. */
let heroTimer = null;
function heroStart(first){
    clearTimeout(heroTimer);
    if (!slides.length) return;
    heroTimer = setTimeout(() => {
        goSlide(slide + 1);
        heroStart();
    }, first ? HERO_FIRST_MS : HERO_MS);
}
function heroStop(){ clearTimeout(heroTimer); heroTimer = null; }

/* ==========================================================
   PAGE CATÉGORIE  (electronique.html, mode.html, tous.html…)
   ========================================================== */
const PRICE_TESTS = {
    all: () => true,
    r1:  p => p.price < 25000,
    r2:  p => p.price >= 25000 && p.price < 60000,
    r3:  p => p.price >= 60000 && p.price < 150000,
    r4:  p => p.price >= 150000
};
const RATE_TESTS = {
    all: () => true,
    r4:  p => p.rating >= 4,
    r45: p => p.rating >= 4.5,
    r40: p => p.rating < 4
};
let cstate = { cat:'Toutes', price:'all', rate:'all', prime:false, stock:false, promo:false, sort:'relevance' };

function catFiltered(){
    let list = cstate.cat === 'Toutes' ? PRODUCTS.slice() : catOf(cstate.cat);
    list = list.filter(p => PRICE_TESTS[cstate.price](p) && RATE_TESTS[cstate.rate](p));
    if (cstate.prime)  list = list.filter(p => p.prime);
    if (cstate.stock)  list = list.filter(p => p.stock > 10);
    if (cstate.promo)  list = list.filter(p => p.old);
    const by = {
        asc:  (a,b) => a.price - b.price,
        desc: (a,b) => b.price - a.price,
        note: (a,b) => b.rating - a.rating || b.reviews - a.reviews,
        off:  (a,b) => (b.old ? (1 - b.price / b.old) : 0) - (a.old ? (1 - a.price / a.old) : 0)
    }[cstate.sort];
    if (by) list.sort(by);
    return list;
}

function renderCat(){
    const list = catFiltered();
    const grid = $('#catGrid');
    if (!grid) return;
    grid.innerHTML = list.length
        ? list.map(cardHTML).join('')
        : `<div class="empty-state" style="grid-column:1/-1">
               <i class="fas fa-search"></i><h3>${t('Aucun résultat')}</h3>
               <p>${t('Aucun article ne correspond à ces filtres.')}</p>
               <p style="margin-top:12px"><a class="btn btn-outline" href="${location.pathname.split(/[\\/]/).pop()}">${t('Réinitialiser')}</a></p>
           </div>`;
    const total = cstate.cat === 'Toutes' ? PRODUCTS.length : catOf(cstate.cat).length;
    $('#resCount').textContent = cstate.cat === 'Toutes'
        ? t('1 sur 1 page pour « tous les produits » — {0} résultats sur {1}', [nfmt(list.length), nfmt(total)])
        : t('1 sur 1 page pour « {0} » — {1} résultats sur {2}', [t(cstate.cat).toLowerCase(), nfmt(list.length), nfmt(total)]);
    initGalleries(grid);

    const deal = list.find(p => p.old) || list[0];
    if (deal && $('#catDealTxt')){
        const off = deal.old ? Math.round((1 - deal.price / deal.old) * 100) : 0;
        $('#catDealTxt').textContent = deal.old
            ? t('{0} — {1} au lieu de {2} (-{3}%)', [deal.name, fmt(deal.price), fmt(deal.old), String(off)])
            : t('{0} — {1}', [deal.name, fmt(deal.price)]);
    }
}

function initCategoryPage(){
    if (!$('#catGrid')) return;
    cstate.cat = document.body.dataset.cat || 'Toutes';
    const sel = $('#searchCat');
    if (sel && cstate.cat !== 'Toutes') sel.value = cstate.cat;

    /* recherche : on renvoie vers la page « tous les produits » */
    $('#searchForm').addEventListener('submit', e => {
        e.preventDefault();
        const q = $('#searchInput').value.trim();
        const c = $('#searchCat').value;
        localStorage.setItem('businessenligne_search', JSON.stringify({ q, cat: c }));
        location.href = `${allFile}#tous`;
    });

    /* filtres */
    $$('input[name="cSort"]').forEach(r => r.onchange = () => {
        cstate.sort = r.value;
        $('#catSort').value = r.value;
        renderCat();
    });
    $$('input[name="cPrice"]').forEach(r => r.onchange = () => { cstate.price = r.value; renderCat(); });
    $$('input[name="cRate"]').forEach(r => r.onchange = () => { cstate.rate  = r.value; renderCat(); });
    $('#fPrime').onchange = e => { cstate.prime = e.target.checked; renderCat(); };
    $('#fStock').onchange = e => { cstate.stock = e.target.checked; renderCat(); };
    $('#fPromo').onchange = e => { cstate.promo = e.target.checked; renderCat(); };
    $('#catSort').onchange  = e => { cstate.sort = e.target.value; syncRadio('cSort', e.target.value); renderCat(); };
    $('#catDealBtn').onclick = () => {
        cstate.promo = true; cstate.price = 'all'; cstate.rate = 'all';
        $('#fPromo').checked = true;
        $$('input[name="cPrice"]').forEach(r => r.checked = r.value === 'all');
        $$('input[name="cRate"]').forEach(r => r.checked = r.value === 'all');
        renderCat();
        $('#resultats').scrollIntoView({ behavior: 'smooth' });
    };

    /* navigation « autres catégories » */
    const nav = $('#catGridNav');
    if (nav) nav.innerHTML = CATEGORIES.map(c =>
        `<a href="${c.file}" class="cat-card">
            <img src="${c.img}" alt="${c.name}" loading="lazy">
            <b>${c.name}</b><span>${catOf(c.name).length} articles</span>
        </a>`).join('');

    renderReviews();
    renderCat();
    renderCatShops();
}

function syncRadio(name, value){
    $$(`input[name="${name}"]`).forEach(r => r.checked = r.value === value);
}

/* ==========================================================
   MAGASINS EN LIGNE
   Une carte de boutique, réutilisée par la page catégorie et
   par la liste générale des magasins. Le clic ouvre la vitrine
   de la boutique, filtrée sur la catégorie d'origine si besoin.
   ========================================================== */
const payInfo  = id => SHOP_PAYMENTS.find(p => p.id === id) || null;
const featInfo = id => SHOP_FEATURES.find(f => f.id === id) || null;
const payLabel = id => (payInfo(id) || {}).label || id;
const featLabel = id => (featInfo(id) || {}).label || id;

/* WhatsApp n'accepte qu'un numéro international, sans « + » ni espaces. */
const waNumber = v => digits(v).replace(/^0+/, '');
const waLink   = (v, text) => 'https://wa.me/' + waNumber(v) + (text ? '?text=' + encodeURIComponent(text) : '');
const telLink  = v => 'tel:' + String(v || '').replace(/[^\d+]/g, '');

/* Pastille « ouvert / fermé » d'une boutique, d'après ses horaires. */
function openBadge(shop, small){
    if (shop.openNow === null || shop.openNow === undefined)
        return `<span class="sh-open unknown"><i class="fas fa-clock"></i>${t('horaires non précisés')}</span>`;
    const cls = shop.openNow ? 'yes' : 'no';
    const label = shop.openNow ? t('Ouvert') : t('Fermé');
    const icon = shop.openNow ? 'fa-circle-check' : 'fa-circle-xmark';
    return `<span class="sh-open ${cls}${small ? ' tiny' : ''}"><i class="fas ${icon}"></i>${label}</span>`;
}

function shopCardHTML(s, cat){
    const keep = cat && cat !== 'Toutes' ? '&cat=' + encodeURIComponent(cat) : '';
    const href = 'magasin.html?u=' + encodeURIComponent(s.username) + keep;
    const face = s.avatar
        ? `<img src="${esc(s.avatar)}" alt="" loading="lazy">`
        : esc(String(s.shopName || '?').charAt(0).toUpperCase());
    const perks = [];
    if (s.shopDelivery) perks.push(`<em title="${t('Livraison à domicile')}"><i class="fas fa-truck"></i></em>`);
    if (s.shopPickup)   perks.push(`<em title="${t('Retrait en boutique')}"><i class="fas fa-hand-hold"></i></em>`);
    if (s.shopReturns)  perks.push(`<em title="${t('Retours acceptés')}"><i class="fas fa-rotate-left"></i></em>`);
    if (s.shopVerified) perks.push(`<em class="v" title="${t('Boutique vérifiée')}"><i class="fas fa-badge-check"></i></em>`);
    return `<a class="shop-card" href="${href}">
        <span class="sc-avatar">${face}</span>
        <span class="sc-body">
            <b>${esc(s.shopName || s.username)}${s.shopVerified ? ' <i class="fas fa-badge-check sc-v" title="' + t('Boutique vérifiée') + '"></i>' : ''}</b>
            ${s.shopSlogan ? `<span class="sc-slogan">${esc(s.shopSlogan)}</span>` : ''}
            <span class="sc-meta"><i class="fas fa-map-marker-alt"></i> ${esc(s.shopCity || 'Lubumbashi')}${openBadge(s, true)}</span>
            <span class="sc-stats">${t('{0} articles', [nfmt(s.productCount)])}${s.likes ? ' · ' + t('{0} J\'aime', [nfmt(s.likes)]) : ''}${s.rating ? ' · ' + s.rating + ' ★' : ''}</span>
            <span class="sc-foot">
                ${s.minPrice != null ? `<span class="sc-price">${t('dès {0}', [fmt(s.minPrice)])}</span>` : '<span></span>'}
                ${perks.length ? `<span class="sc-perks">${perks.join('')}</span>` : ''}
            </span>
        </span>
</a>`;
}

/* Une ligne d'information dans la grande carte de boutique. */
function shopInfoRow(icon, label, value, html){
    if (!value) return '';
    return `<div class="sb-info-row"><i class="fas ${icon}"></i>
        <span class="sb-info-l">${esc(t(label))}</span>
        <span class="sb-info-v">${html || esc(value)}</span></div>`;
}

/* La grande carte de la liste des magasins : elle montre toute la fiche
   publiée par le vendeur — couv ure, présentation, contact, livraison,
   paiement, horaires, atouts, statistiques — et un aperçu de ses articles.
   Un clic sur la carte ou sur l'un de ses boutons ouvre la vitrine. */
function shopCardRichHTML(s, cat){
    const keep = cat && cat !== 'Toutes' ? '&cat=' + encodeURIComponent(cat) : '';
    const base = 'magasin.html?u=' + encodeURIComponent(s.username);
    const href = base + keep;
    const name = s.shopName || s.username;
    const city = s.shopCity || 'Lubumbashi';
    const face = s.avatar
        ? `<img src="${esc(s.avatar)}" alt="${esc(name)}" loading="lazy">`
        : esc(String(name).charAt(0).toUpperCase());
    const cover = s.banner
        ? `<img src="${esc(s.banner)}" alt="" loading="lazy">`
        : `<span class="sb-cover-ini">${esc(String(name).charAt(0).toUpperCase())}</span>`;

    /* étiquettes : catégories specialties puis services */
    let tags = (Array.isArray(s.shopCats) ? s.shopCats : []).slice(0, 4)
        .map(c => `<span class="sh-tag cat">${esc(t(c))}</span>`).join('');
    if (s.shopDelivery) tags += `<span class="sh-tag"><i class="fas fa-truck"></i>${t('Livraison')}</span>`;
    if (s.shopPickup)   tags += `<span class="sh-tag"><i class="fas fa-hand-hold"></i>${t('Retrait')}</span>`;
    if (s.shopReturns)  tags += `<span class="sh-tag"><i class="fas fa-rotate-left"></i>${t('Retours')}</span>`;

    /* atouts déclarés par le vendeur */
    const feats = (s.shopFeatures || []).slice(0, 4).map(f => {
        const info = featInfo(f);
        return `<span class="feat-pill"><i class="fas ${info ? info.icon : 'fa-check'}"></i>${esc(featLabel(f))}</span>`;
    }).join('');

    /* moyens de paiement */
    const pays = (s.shopPayments || []).map(id => {
        const info = payInfo(id);
        return `<span class="pay-pill"><i class="fas ${info ? info.icon : 'fa-money'}"></i>${esc(payLabel(id))}</span>`;
    }).join('');

    /* horaires du jour */
    const todayH = (s.shopHours || {})[SHOP_DAYS[(new Date().getDay() + 6) % 7].id];

    /* aperçu des derniers articles publiés par la boutique */
    const prev = (s.preview || []).map(p =>
        `<a class="sb-prev-item" href="${base}&p=${encodeURIComponent(p.id)}"
            title="${esc(p.title)} — ${esc(fmt(p.price))}">
            <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">
            <span>${esc(fmt(p.price))}</span>
        </a>`).join('');

    const stat = (icon, value, label) =>
        `<div class="sb-stat"><i class="fas ${icon}"></i><b>${value}</b><span>${esc(t(label))}</span></div>`;

    const phone = s.phone
        ? `<a class="btn btn-outline btn-sm" href="${esc(telLink(s.phone))}"><i class="fas fa-phone"></i> ${t('Appeler')}</a>` : '';
    const wa = s.shopWhatsapp || s.phone
        ? `<a class="btn btn-wa btn-sm" target="_blank" rel="noopener"
               href="${esc(waLink(s.shopWhatsapp || s.phone, t('Bonjour {0}, je trouve vos articles sur BusinessEnLigne.', [name])))}">
               <i class="fab fa-whatsapp"></i> WhatsApp</a>` : '';

    return `<article class="shop-card shop-big" data-shop="${esc(s.username)}">
        <a class="sb-cover" href="${href}" aria-label="${esc(name)}">${cover}
            <span class="sb-cover-fade"></span>
            <span class="sb-cover-badges">
                ${s.shopVerified ? `<span class="cov-badge v"><i class="fas fa-badge-check"></i>${t('Vérifiée')}</span>` : ''}
                <span class="cov-badge"><i class="fas fa-gauge-high"></i>${t('Vitrine à {0} %', [nfmt(s.score)])}</span>
                ${openBadge(s)}
            </span>
        </a>
        <div class="sb-main">
            <a class="sb-id" href="${href}">
                <span class="sc-avatar big">${face}</span>
                <span class="sb-id-txt">
                    <b>${esc(name)}${s.shopVerified ? ' <i class="fas fa-badge-check sc-v"></i>' : ''}</b>
                    ${s.shopSlogan ? `<span class="sb-slogan">${esc(s.shopSlogan)}</span>` : ''}
                    <span class="sb-user"><i class="fas fa-at"></i> ${esc(s.username)}
                        <i class="fas fa-map-marker-alt"></i> ${esc(city)}
                        <i class="fas fa-calendar"></i> ${esc(t('depuis {0}', [new Date(s.createdAt).getFullYear()]))}</span>
                </span>
            </a>
            ${s.shopDesc ? `<p class="sb-desc">${esc(s.shopDesc)}</p>`
                         : `<p class="sb-desc muted">${t("Cette boutique n'a pas encore de description.")}</p>`}
            ${tags ? `<div class="shop-tags sb-tags">${tags}</div>` : ''}
            ${s.shopAbout ? `<div class="sb-about">${paragraphs(String(s.shopAbout).split('\n\n').slice(0, 1).join('\n\n'))}</div>` : ''}
            ${feats ? `<div class="shop-feats sb-feats">${feats}</div>` : ''}
            <div class="sb-infos">
                ${shopInfoRow('fa-location-dot', 'Adresse', s.shopAddress)}
                ${shopInfoRow('fa-compass', 'Point de repère', s.shopLandmark)}
                ${shopInfoRow('fa-phone', 'Téléphone', s.phone, s.phone ? `<a href="${esc(telLink(s.phone))}">${esc(s.phone)}</a>` : '')}
                ${shopInfoRow('fa-comment-dots', 'WhatsApp', s.shopWhatsapp)}
                ${shopInfoRow('fa-envelope', 'Email', s.shopEmail, s.shopEmail ? `<a href="mailto:${esc(s.shopEmail)}">${esc(s.shopEmail)}</a>` : '')}
                ${shopInfoRow('fa-globe', 'Site web', s.shopWebsite, s.shopWebsite ? `<a href="${esc(s.shopWebsite)}" target="_blank" rel="noopener nofollow">${esc(String(s.shopWebsite).replace(/^https?:\/\//, ''))}</a>` : '')}
                ${shopInfoRow('fa-calendar-days', 'Ouverte en', s.shopFounded)}
                ${shopInfoRow('fa-truck-fast', 'Délai de livraison', s.shopDeliveryTime)}
                ${shopInfoRow('fa-coins', 'Frais de livraison', s.shopDeliveryFee)}
                ${shopInfoRow('fa-map-location-dot', 'Zones desservies', Array.isArray(s.shopDeliveryZones) ? s.shopDeliveryZones.join(', ') : s.shopDeliveryZones)}
                ${shopInfoRow('fa-undo', 'Retours sous', s.shopReturnDays)}
                ${shopInfoRow('fa-shield-halved', 'Garantie', s.shopWarranty)}
                ${shopInfoRow('fa-id-card', 'Identifiants légaux', s.shopLegal)}
                ${shopInfoRow('fa-clock', 'Horaires du jour', todayH ? HOURS_TEXT(todayH) : t('Horaires non communiqués'))}
            </div>
            ${pays ? `<div class="pay-list sb-pay">${pays}</div>` : ''}
            ${s.shopGallery && s.shopGallery.length ? `<div class="sb-gal">${s.shopGallery.slice(0, 6).map(g =>
                `<img src="${esc(g)}" alt="" loading="lazy">`).join('')}</div>` : ''}
            <div class="sb-stats">
                ${stat('fa-box', nfmt(s.productCount), 'articles')}
                ${stat('fa-heart', nfmt(s.likes), "J'aime")}
                ${stat('fa-users', nfmt(s.followers), 'abonnés')}
                ${stat('fa-cart-shopping', nfmt(s.sales), 'ventes')}
                ${stat('fa-star', s.rating || '—', t('note'))}
                ${stat('fa-cubes', nfmt(s.stockTotal), t('en stock'))}
                ${stat('fa-tags', s.minPrice != null ? `${fmt(s.minPrice)}${s.maxPrice > s.minPrice ? ' – ' + fmt(s.maxPrice) : ''}` : '—', t('fourchette'))}
            </div>
            ${prev ? `<div class="sb-prev">${prev}<span class="sb-prev-more">
                <a href="${href}">${t('Voir ses {0} articles', [nfmt(s.productCount)])}</a></span></div>` : ''}
            <div class="sb-actions">
                <a class="btn btn-cta" href="${href}"><i class="fas fa-store"></i> ${t('Voir la boutique')}</a>
                ${phone}${wa}
                ${socialLinks(s)}
            </div>
        </div>
    </article>`;
}

/* Liste des boutiques qui vendent dans la catégorie affichée.
   Le bloc reste masqué s'il n'y a aucune boutique à montrer. */
async function renderCatShops(){
    const box = $('#catShops');
    const grid = $('#catShopsGrid');
    if (!box || !grid) return;

    const cat = cstate.cat;
    const title = $('#catShopsTitle');
    if (title) title.textContent = cat === 'Toutes' ? t('Tous les magasins en ligne') : t('Magasins en ligne — {0}', [cat]);

    if (!window.BE){ box.hidden = true; return; }

grid.innerHTML = '<span class="sh-sk on"></span>'.repeat(8);
    try {
        const all = await BE.shops(cat === 'Toutes' ? { sort: 'products' } : { cat });
        /* une boutique publiée reste visible même si elle n'a pas encore
           d'article : on la place après celles qui vendent déjà. */
        const shops = all.slice().sort((a, b) => (b.productCount > 0) - (a.productCount > 0));
        if (!shops.length){ box.hidden = true; return; }

        box.hidden = false;
        const total = shops.reduce((s, x) => s + x.productCount, 0);
        $('#catShopsCount').textContent = total
            ? t('{0} boutiques proposent {1} articles — cliquez sur une boutique pour voir ses photos et ses prix.',
                [nfmt(shops.length), nfmt(total)])
            : t('{0} boutiques en ligne — cliquez sur une boutique pour découvrir sa vitrine et ses informations.',
                [nfmt(shops.length)]);

        const shown = shops.slice(0, 12);
        grid.innerHTML = shown.map(s => shopCardHTML(s, cat)).join('') +
            (shops.length > shown.length
                ? `<a class="shop-card shop-all" href="magasin.html${cat === 'Toutes' ? '' : '?cat=' + encodeURIComponent(cat)}">
                       <span class="sc-avatar"><i class="fas fa-store"></i></span>
                       <span class="sc-body"><b>${t('Voir les {0} boutiques', [nfmt(shops.length)])}</b>
                       <span class="sc-meta">${t('Tout le catalogue de la plateforme')}</span></span>
                   </a>`
                : '');
    } catch (e){
        box.hidden = true;
        if (!e.offline) console.warn('[BusinessEnLigne] magasins : ' + e.message);
    }
}

function renderReviews(){
    const el = $('#revGrid');
    if (!el) return;
    el.innerHTML = REVIEWS.map(r =>
        `<div class="rev">
            <div class="rev-top">
                <img src="${r.img}" alt="${r.n}">
                <div><b>${r.n}</b><span>${t('Achat vérifié')}</span></div>
            </div>
            ${starsHTML(r.r)}
            <p style="margin-top:6px">${r.t}</p>
            <div class="verified">${t('Avis vérifié le mois dernier')}</div>
        </div>`).join('');
}

/* ==========================================================
   BOUTON « CRÉER UN COMPTE » (header, à côté du panier)
   ========================================================== */
function refreshAccountUI(){
    const u = (window.BE && BE.isLogged()) ? BE.user() : null;
    const name    = $('#accName');
    const action  = $('#accAction');
    const amName  = $('#amName');
    const amLink  = $('#amName') ? $('#amName').nextElementSibling : null;
    const logout  = $('#logoutBtn');

    if (u){
        if (name)   name.textContent = u.username;
        if (action) action.textContent = t('Mon compte');
        if (amName) amName.textContent = t('Bonjour, {0}', [u.username]);
        if (amLink){ amLink.textContent = t('Voir mon magasin'); amLink.href = 'magasin.html?u=' + u.username; }
        if (logout) logout.hidden = false;
    } else {
        if (name)   name.textContent = t('Identifiez-vous');
        if (action) action.textContent = t('Créer un compte');
        if (amName) amName.textContent = t('Connectez-vous à votre compte');
        if (amLink){ amLink.textContent = t('Connexion / Inscription'); amLink.href = 'connexion.html'; }
        if (logout) logout.hidden = true;
    }
    const am = $('.account-menu');
    if (am) am.classList.toggle('is-logged', !!u);

    /* lien « Tableau de surveillance » réservé aux administrateurs */
    const list = $('.account-menu ul');
    if (list){
        let link = $('#amAdmin');
        if (u && u.isAdmin){
            if (!link){
                link = document.createElement('li');
                link.innerHTML = `<a id="amAdmin" href="admin.html"><i class="fas fa-chart-line"></i> ${t('Tableau de surveillance')}</a>`;
                list.appendChild(link);
            }
        } else if (link){
            link.remove();
        }
    }
}

function initAccountMenu(){
    const btn  = $('#accountBtn');
    const menu = $('#accountMenu');
    if (!btn || !menu) return;
    const close = () => { menu.classList.remove('open'); btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', e => {
        e.stopPropagation();
        const open = !menu.classList.contains('open');
        menu.classList.toggle('open', open);
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => { if (!e.target.closest('.account-wrap')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    const out = $('#logoutBtn');
    if (out) out.addEventListener('click', async () => {
        await BE.logout();
        refreshAccountUI();
        toast(t('👋 Vous êtes déconnecté.'));
        setTimeout(() => location.reload(), 700);
    });
}

/* Redirige vers la connexion si l'utilisateur n'est pas connecté */
function requireLogin(message = null){
    if (BE.isLogged()) return true;
    toast('🔒 ' + (message || t('Connectez-vous pour continuer')));
    setTimeout(() => { location.href = 'connexion.html?next=' + encodeURIComponent(location.pathname + location.hash); }, 800);
    return false;
}

/* ==========================================================
   PAGE CONNEXION / INSCRIPTION
   ========================================================== */
function initAuthPage(){
    refreshAccountUI();

    const show = which => {
        $('#inscription').hidden = which !== 'inscription';
        $('#connexion').hidden   = which !== 'connexion';
        if (location.hash === '#connexion') history.replaceState(null, '', '#connexion');
    };
    if (location.hash === '#connexion') show('connexion');
    ['goLogin', 'goLogin2'].forEach(id => { const a = $('#' + id); if (a) a.onclick = e => { e.preventDefault(); show('connexion'); }; });
    const goReg = $('#goReg');
    if (goReg) goReg.onclick = e => { e.preventDefault(); show('inscription'); };

    /* ---------- AVIS « SERVEUR INJOIGNABLE » ----------
       Affiche un message adapté à la situation réelle plutôt qu'une
       consigne « node server.js » qui ne concerne que l usage en local. */
    function showOfflineNotice(){
        const box = $('#offlineAlert');
        if (!box) return;
        const title = $('#offlineTitle');
        const text  = $('#offlineText');
        const link  = BE.ONLINE_URL + location.pathname.replace(/^\//, '');
        if (BE.isLocalFile()){
            if (title) title.textContent = 'Vous ouvrez le fichier depuis votre ordinateur';
            if (text) text.innerHTML = 'Le site n\'est joignable que depuis son adresse en ligne. '
                + '<a href="' + link + '">Ouvrir BusinessEnLigne</a>';
        } else {
            if (title) title.textContent = 'Serveur injoignable';
            if (text) text.innerHTML = 'La connexion au serveur a échoué. '
                + '<a href="' + link + '">Réessayer</a>';
        }
        box.hidden = false;
    }

    /* œil afficher / masquer */
    $$('.pwd-eye').forEach(b => b.onclick = () => {
        const inp = $('#' + b.dataset.eye);
        const show2 = inp.type === 'password';
        inp.type = show2 ? 'text' : 'password';
        b.innerHTML = `<i class="far fa-eye${show2 ? '-slash' : ''}"></i>`;
    });

    /* Un champ peut ne pas avoir de .f-row (case à cocher des conditions) :
       on ne lève alors aucune erreur, sinon le formulaire resterait muet. */
    const mark = (id, valid) => {
        const row = $('#' + id);
        if (row) row.classList.toggle('invalid', !valid);
        return valid;
    };
    $$('#registerForm input, #registerForm textarea').forEach(el =>
        el.addEventListener('input', () => {
            const row = el.closest('.f-row') || el.closest('.check-row');
            if (row) row.classList.remove('invalid');
        }));

    /* ---------- INSCRIPTION ----------
       L'email suffit : l'identifiant et le nom de la boutique
       sont générés par le serveur s'ils sont laissés vides. */
    $('#registerForm').addEventListener('submit', async e => {
        e.preventDefault();
        const btn = $('#registerBtn');
        const uname = $('#username').value.trim();
        const shop  = $('#shopName').value.trim();
        const v = {
            email:    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#email').value.trim()),
            password: $('#password').value.length >= 6,
            password2:$('#password').value === $('#password2').value,
            username: !uname || /^[a-zA-Z0-9_.-]{3,20}$/.test(uname),
            shop:     !shop  || shop.length >= 3,
            city:     $('#city').value.trim().length >= 2,
            phone:    $('#phone').value.replace(/\D/g, '').length >= 10 || !$('#phone').value.trim(),
            shopdesc: $('#shopDesc').value.trim().length <= 500,
            terms:    $('#terms').checked
        };
        let ok = true;
        Object.entries(v).forEach(([k, valid]) => { if (!mark('r-' + k, valid)) ok = false; });
        if (!ok) return toast(t('⚠️ Merci de corriger les champs en rouge.'));

        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('Création…')}`;
        try {
            const { user, generated } = await BE.register({
                username: uname,
                email: $('#email').value.trim(),
                password: $('#password').value,
                shopName: shop,
                shopDesc: $('#shopDesc').value.trim(),
                city: $('#city').value.trim(),
                phone: $('#phone').value.trim()
            });
            if (generated && generated.username)
                toast('🎉 ' + t('Bienvenue ! Votre identifiant est « {0} ».', [generated.username]), 6000);
            else
                toast('🎉 ' + t('Bienvenue {0} ! Votre boutique est créée.', [user.username]), 4000);
            setTimeout(() => { location.href = 'compte.html'; }, 1600);
        } catch (err){
            btn.disabled = false;
            btn.innerHTML = `<i class="fas fa-user-plus"></i> ${t('Créer mon compte avec mon email')}`;
            toast('❌ ' + err.message);
            if (err.status === 409){
                const msg = /identifiant/i.test(err.message) ? 'r-username' : 'r-email';
                mark(msg, false);
            }
            if (err.offline) showOfflineNotice();
        }
    });

    /* ---------- CONNEXION ---------- */
    $('#loginForm').addEventListener('submit', async e => {
        e.preventDefault();
        const btn = $('#loginBtn');
        const idOk  = mark('l-ident', $('#ident').value.trim().length >= 2);
        const pwdOk = mark('l-password', $('#loginPwd').value.length >= 1);
        if (!idOk || !pwdOk) return;

        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('Connexion…')}`;
        try {
            const user = await BE.login($('#ident').value.trim(), $('#loginPwd').value);
            toast(t('👋 Bonjour {0} !', [user.username]));
            const next = new URLSearchParams(location.search).get('next');
            setTimeout(() => { location.href = next || 'compte.html'; }, 800);
        } catch (err){
            btn.disabled = false;
            btn.innerHTML = `<i class="fas fa-right-to-bracket"></i> ${t('Se connecter')}`;
            toast('❌ ' + err.message);
        }
    });

    /* déjà connecté ? */
    BE.loadMe().then(u => {
        if (u){ refreshAccountUI(); toast(t('👋 Déjà connecté en tant que {0}.', [u.username])); }
    });
}

/* ==========================================================
   CHARGEMENT DU CATALOGUE DEPUIS L'API (avec repli local)
   ========================================================== */
function normalize(p){
    return {
        id: p.id,
        name: p.title,
        cat: p.cat,
        price: p.price,
        old: p.oldPrice || null,
        off: p.off || 0,
        rating: p.rating,
        reviews: p.reviews,
        stock: p.stock,
        prime: !!p.prime,
        badge: p.badge || '',
        desc: p.desc || '',
        feats: [],
        details: Array.isArray(p.details) ? p.details : [],
        image: p.image || '',
        images: Array.isArray(p.images) ? p.images.filter(Boolean) : (p.image ? [p.image] : []),
        seed: 'p' + p.id,
        likes: p.likes || 0,
        likedByMe: !!p.likedByMe,
        owner: p.owner || null,
        mine: false
    };
}

async function loadFromApi(){
    if (!window.BE) return false;
    try {
        const list = await BE.products();
        if (!Array.isArray(list) || !list.length) return false;
        PRODUCTS = list.map(normalize);
        window.PRODUCTS = PRODUCTS;
        return true;
    } catch (e){
        if (e.offline) console.warn('[BusinessEnLigne] serveur absent → catalogue local utilisé');
        return false;
    }
}

/* ==========================================================
   RÉGLAGES DE LA BOUTIQUE  (page « Mon compte »)
   ------------------------------------------------------------
   Aucun nom de champ n'est écrit en dur dans ce fichier : le
   formulaire HTML se décrit lui-même avec « data-shop ».
     • data-shop="clef"            champ texte ou case à cocher simple
     • data-shop-group="clef"      groupe de cases à cocher (liste)
     • data-shop="clef" sur un bloc horaires, galerie ou image
   collectShopForm() lit tout, fillShopForm() remplit tout.
   ========================================================== */
const SHOP_DAYS = [
    { id: 'mon', label: 'Lundi' },    { id: 'tue', label: 'Mardi' },
    { id: 'wed', label: 'Mercredi' }, { id: 'thu', label: 'Jeudi' },
    { id: 'fri', label: 'Vendredi' }, { id: 'sat', label: 'Samedi' },
    { id: 'sun', label: 'Dimanche' }
];

const SHOP_PAYMENTS = [
    { id: 'momo',     label: 'Mobile Money',      icon: 'fa-mobile-screen' },
    { id: 'especes',  label: 'Espèces',           icon: 'fa-money-bill-wave' },
    { id: 'carte',    label: 'Carte bancaire',    icon: 'fa-credit-card' },
    { id: 'virement', label: 'Virement bancaire', icon: 'fa-building-columns' },
    { id: 'credit',   label: 'Paiement échelonné', icon: 'fa-calendar-days' }
];

const SHOP_FEATURES = [
    { id: 'rapide',   label: 'Livraison rapide',        icon: 'fa-bolt' },
    { id: 'gratuit',  label: 'Livraison offerte',       icon: 'fa-truck-fast' },
    { id: 'garantie', label: 'Garantie satisfaction',   icon: 'fa-thumbs-up' },
    { id: 'retour',   label: 'Retours acceptés',        icon: 'fa-rotate-left' },
    { id: 'original', label: 'Produits authentiques',   icon: 'fa-certificate' },
    { id: 'support',  label: 'Service client réactif',  icon: 'fa-headset' },
    { id: 'physique', label: 'Boutique physique',       icon: 'fa-store' },
    { id: 'gros',     label: 'Vente en gros',           icon: 'fa-boxes-stacked' },
    { id: 'nouveau',  label: 'Nouveautés régulières',   icon: 'fa-sparkles' },
    { id: 'secure',   label: 'Paiement sécurisé',       icon: 'fa-lock' }
];

const SHOP_MAX_GALLERY = 8;

/* Liste de cases à cocher : chaque case porte sa valeur dans « value ». */
function buildShopPick(el, items){
    if (!el) return;
    el.innerHTML = items.map(it =>
        `<label class="chk"><input type="checkbox" value="${esc(it.id)}"><span><i class="fas ${it.icon}"></i>${esc(it.label)}</span></label>`
    ).join('');
    el.addEventListener('change', () => {
        const row = el.closest('.f-row');
        if (row) row.classList.remove('invalid');
    });
}
const shopPickSet = (el, values) => {
    const set = new Set(Array.isArray(values) ? values : []);
    Array.from(el.querySelectorAll('input[type=checkbox]')).forEach(cb => { cb.checked = set.has(cb.value); });
};
const shopPickGet = el =>
    Array.from(el.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);

/* ---------- GRILLE DES HORAIRES ---------- */
function buildHoursGrid(el){
    el.innerHTML = SHOP_DAYS.map(d =>
        `<div class="hr-row" data-day="${d.id}">
            <label class="chk tiny"><input type="checkbox" data-closed checked><span>${d.label}</span></label>
            <span class="hr-times">
                <input type="time" data-o value="08:00" disabled aria-label="${d.label} — ouverture">
                <em>–</em>
                <input type="time" data-c value="18:00" disabled aria-label="${d.label} — fermeture">
            </span>
            <span class="hr-state" data-state>Fermé</span>
        </div>`).join('');

    const sync = row => {
        const closed = !row.querySelector('[data-closed]').checked;
        row.querySelectorAll('input[type=time]').forEach(i => { i.disabled = closed; });
        row.querySelector('[data-state]').textContent = closed ? t('Fermé') : t('Ouvert');
        row.classList.toggle('is-closed', closed);
    };
    el.addEventListener('change', e => {
        const row = e.target.closest('.hr-row');
        if (row) sync(row);
    });
    el.addEventListener('click', e => {
        if (!e.target.closest('.hr-row')) return;
        sync(e.target.closest('.hr-row'));
    });
    Array.from(el.querySelectorAll('.hr-row')).forEach(sync);
}
const hoursSet = (el, hours) => {
    Array.from(el.querySelectorAll('.hr-row')).forEach(row => {
        const h = (hours || {})[row.dataset.day];
        const closed = !h || h.closed !== false;
        const box = row.querySelector('[data-closed]');
        box.checked = !closed;
        row.querySelector('[data-o]').value = (h && h.o) || '08:00';
        row.querySelector('[data-c]').value = (h && h.c) || '18:00';
        box.dispatchEvent(new Event('change', { bubbles: true }));
    });
};
const hoursGet = el => {
    const out = {};
    Array.from(el.querySelectorAll('.hr-row')).forEach(row => {
        out[row.dataset.day] = {
            closed: !row.querySelector('[data-closed]').checked,
            o: row.querySelector('[data-o]').value || '08:00',
            c: row.querySelector('[data-c]').value || '18:00'
        };
    });
    return out;
};

/* ---------- SÉLECTEUR D'UNE SEULE IMAGE (logo, bannière) ---------- */
function makeImagePicker(zone, onChange){
    let url = '';
    const paint = () => {
        zone.classList.toggle('has-img', !!url);
        zone.innerHTML = url
            ? `<img src="${safeUrl(url)}" alt="">
               <span class="mi-actions">
                   <button type="button" class="btn btn-outline btn-sm" data-replace><i class="fas fa-repeat"></i> ${t('Changer')}</button>
                   <button type="button" class="btn btn-outline btn-sm" data-clear><i class="fas fa-trash"></i> ${t('Retirer')}</button>
               </span>`
            : `<i class="fas fa-camera"></i><b>${t('Ajouter une image')}</b>
               <span>${t('png, jpg, gif ou webp — 3 Mo max')}</span>`;
    };
    const file = document.createElement('input');
    file.type = 'file';
    file.accept = IMAGE_ACCEPT;
    file.hidden = true;
    zone.after(file);

    file.onchange = async () => {
        const f = (file.files || [])[0];
        if (!f) return;
        try { url = await BE.upload(f); paint(); onChange && onChange(url); }
        catch (e){ toast('❌ ' + e.message); }
        file.value = '';
    };
    zone.addEventListener('click', async e => {
        if (e.target.closest('[data-clear]')){ url = ''; paint(); onChange && onChange(''); return; }
        if (e.target.closest('[data-replace]')){ file.click(); return; }
        file.click();
    });
    paint();
    return { get: () => url, set: u => { url = u || ''; paint(); } };
}

/* ---------- GALERIE DE LA BOUTIQUE ---------- */
function makeShopGallery(zone, initial, onChange){
    let photos = (Array.isArray(initial) ? initial : []).filter(Boolean).slice(0, SHOP_MAX_GALLERY);
    const file = document.createElement('input');
    file.type = 'file';
    file.multiple = true;
    file.accept = 'image/png,image/jpeg,image/gif,image/webp';
    file.hidden = true;
    zone.after(file);

    const paint = () => {
        zone.innerHTML = photos.map((u, i) =>
                `<span class="gal-item"><img src="${safeUrl(u)}" alt="${t('Photo {0}', [nfmt(i + 1)])}" loading="lazy">
                    <button type="button" class="gal-del" data-del="${i}" aria-label="${t('Retirer')}"><i class="fas fa-times"></i></button>
                </span>`).join('')
            + (photos.length < SHOP_MAX_GALLERY
                ? `<button type="button" class="gal-add"><i class="fas fa-plus"></i><span>${t('Ajouter une photo')}</span>
                     <em>${nfmt(photos.length)}/${nfmt(SHOP_MAX_GALLERY)}</em></button>`
                : `<span class="gal-full">${t('{0} photos au maximum', [nfmt(SHOP_MAX_GALLERY)])}</span>`);
    };
    const send = async list => {
        const room = SHOP_MAX_GALLERY - photos.length;
        if (room <= 0) return;
        zone.classList.add('busy');
        try {
            for (const f of list.slice(0, room)) photos.push(await BE.upload(f));
            paint();
            onChange && onChange();
        } catch (e){ toast('❌ ' + e.message); }
        finally { zone.classList.remove('busy'); file.value = ''; }
    };
    zone.addEventListener('click', e => {
        const del = e.target.closest('[data-del]');
        if (del){ photos.splice(+del.dataset.del, 1); paint(); onChange && onChange(); return; }
        file.click();
    });
    ['dragenter', 'dragover'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('over'); }));
    zone.addEventListener('drop', e => {
        const list = Array.from(e.dataTransfer.files || []).filter(isImageFile);
        if (list.length) send(list);
    });
    file.onchange = () => { const list = Array.from(file.files || []); if (list.length) send(list); };
    paint();
    return { list: () => photos.slice() };
}

/* ---------- LECTURE / ÉCRITURE DU FORMULAIRE ---------- */
const shopForm = () => $('#profileForm');
function collectShopForm(){
    const form = shopForm();
    const out = {};
    Array.from(form.querySelectorAll('[data-shop]')).forEach(el => {
        const key = el.dataset.shop;
        if (el.type === 'checkbox') out[key] = el.checked;
        else out[key] = el.value;
    });
    Array.from(form.querySelectorAll('[data-shop-group]')).forEach(el => {
        out[el.dataset.shopGroup] = shopPickGet(el);
    });
    return out;
}
function fillShopForm(me){
    const form = shopForm();
    Array.from(form.querySelectorAll('[data-shop]')).forEach(el => {
        const key = el.dataset.shop;
        const v = me[key];
        if (el.type === 'checkbox') el.checked = !!v;
        else el.value = v == null ? '' : (typeof v === 'object' ? '' : v);
    });
    Array.from(form.querySelectorAll('[data-shop-group]')).forEach(el => {
        shopPickSet(el, me[el.dataset.shopGroup]);
    });
}

/* ---------- VALIDATION, côté navigateur ---------- */
function validateShopForm(){
    const form = shopForm();
    const bad = [];
    const fail = (rowId, badFlag) => {
        const row = document.getElementById(rowId);
        if (row) row.classList.add('invalid');
        if (badFlag) bad.push(rowId);
    };
    const v = id => { const el = form.querySelector(`[id="${id}"]`); return el ? el.value.trim() : ''; };

    if (v('pShopName').length < 3) fail('p-shopName');
    if (v('pShopSlogan').length > 90) fail('p-shopSlogan');
    if (v('pShopDesc').length > 600) fail('p-shopDesc');
    if (v('pShopAbout').length > 2500) fail('p-shopAbout');
    if (v('pShopCity').length < 2) fail('p-shopCity');
    if (digits(v('pPhone')).length > 0 && digits(v('pPhone')).length < 9) fail('p-phone');
    if (v('pShopWhatsapp') && (digits(v('pShopWhatsapp')).length < 6 || digits(v('pShopWhatsapp')).length > 15)) fail('p-shopWhatsapp');
    if (v('pShopEmail') && !isMail(v('pShopEmail'))) fail('p-shopEmail');
    const year = v('pShopFounded');
    if (year && !/^(19|20)\d{2}$/.test(year)) fail('p-shopFounded');
    if (v('pShopAddress').length > 140) fail('p-shopAddress');
    if (v('pShopLandmark').length > 120) fail('p-shopLandmark');
    if (v('pShopDeliveryTime').length > 60) fail('p-shopDeliveryTime');
    if (v('pShopDeliveryFee').length > 60) fail('p-shopDeliveryFee');
    if (v('pShopDeliveryZones').length > 200) fail('p-shopDeliveryZones');
    if (v('pShopFreeDelivery').length > 60) fail('p-shopFreeDelivery');
    if (v('pShopReturnDays').length > 60) fail('p-shopReturnDays');
    if (v('pShopWarranty').length > 160) fail('p-shopWarranty');
    if (v('pShopLegal').length > 80) fail('p-shopLegal');
    ['shopFacebook', 'shopInstagram', 'shopTiktok', 'shopYoutube', 'shopWebsite'].forEach(k => {
        const row = document.getElementById('p-' + k);
        const val = (form.querySelector(`[data-shop="${k}"]`) || {}).value || '';
        if (row && val && !HTTP_URL.test(val.trim())){ row.classList.add('invalid'); bad.push(row.id); }
    });

    /* le premier champ fautif est ramené dans l'écran */
    if (bad.length){
        const first = document.getElementById(bad[0]);
        if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    return bad.length === 0;
}

/* ---------- Taux de complétion, calculé par le serveur ---------- */
function paintScore(score){
    const ring = $('#scoreRing');
    if (!ring || !score) return;
    ring.style.setProperty('--p', score.score);
    $('#scoreVal').textContent = score.score + ' %';
    $('#scoreTip').textContent = score.score >= 100
        ? t('Votre vitrine est complète : les acheteurs ont toutes les informations.')
        : t('Plus votre boutique est détaillée, plus les acheteurs vous font confiance.');
    const list = $('#scoreList');
    if (!list) return;
    list.innerHTML = (score.missing || []).length
        ? score.missing.map(m => `<li><i class="fas fa-circle-plus"></i>${esc(m.label)}</li>`).join('')
        : `<li class="done"><i class="fas fa-circle-check"></i>${t('Tout est renseigné.')}</li>`;
}

/* Aperçu mis à jour pendant la saisie, sans rien enregistrer. */
let scoreTimer;
function liveScore(draft){
    clearTimeout(scoreTimer);
    scoreTimer = setTimeout(async () => {
        try { paintScore((await BE.req('POST', '/api/shops/preview', draft)).score); }
        catch (e){ /* hors ligne : la jauge garde sa dernière valeur */ }
    }, 400);
}

/* ---------- Compteurs de caractères ---------- */
function bindCharCounters(root){
    Array.from(root.querySelectorAll('[data-count-for]')).forEach(out => {
        const el = root.querySelector('#' + out.dataset.countFor);
        if (!el) return;
        const upd = () => { out.textContent = `${nfmt(el.value.length)} / ${nfmt(el.maxLength)}`; };
        el.addEventListener('input', upd);
        upd();
    });
}

/* ---------- Mini-aperçu de la vitrine (colonne de gauche) ---------- */
function paintShopPreview(me, score){
    const box = $('#shopMini');
    if (!box || !me) return;
    const badge = (icon, label, on) => on ? `<span class="mi-pill"><i class="fas ${icon}"></i>${esc(label)}</span>` : '';
    const payments = (me.shopPayments || []).map(id => (SHOP_PAYMENTS.find(p => p.id === id) || {}).label).filter(Boolean);
    const cats = (me.shopCats || []).length;

    box.innerHTML = [
        me.shopSlogan ? `<p class="mi-slogan">${esc(me.shopSlogan)}</p>` : '',
        cats ? `<p class="mi-cats">${me.shopCats.map(c => `<span>${esc(t(c))}</span>`).join('')}</p>` : '',
        `<p class="mi-pills">
            ${badge('fa-truck', t('Livraison'), me.shopDelivery)}
            ${badge('fa-hand-hold', t('Retrait'), me.shopPickup)}
            ${badge('fa-mobile-screen', t('Mobile Money'), (me.shopPayments || []).includes('momo'))}
            ${badge('fa-rotate-left', t('Retours'), me.shopReturns)}
            ${badge('fa-shield-halved', t('Boutique vérifiée'), me.shopVerified)}
        </p>`,
        payments.length
            ? `<p class="mi-line"><i class="fas fa-credit-card"></i>${esc(t('Paiement : {0}', [payments.join(', ')]))}</p>`
            : '',
        me.shopAddress ? `<p class="mi-line"><i class="fas fa-location-dot"></i>${esc([me.shopAddress, me.shopCity].filter(Boolean).join(', '))}</p>` : '',
        Object.keys(me.shopHours || {}).length ? `<p class="mi-line"><i class="fas fa-clock"></i>${esc(t('Horaires définis'))}</p>` : '',
        score ? `<p class="mi-line"><i class="fas fa-gauge-high"></i>${esc(t('{0} sur {1} informations renseignées', [nfmt(score.done), nfmt(score.total)]))}</p>` : ''
    ].join('');
}

/* ==========================================================
   PAGE « MON COMPTE »
   ========================================================== */
async function initAccountPage(){
    refreshAccountUI();

    const me = await BE.loadMe(true);
    const logged = !!me;
    $('#notLogged').hidden = logged;
    $('#logged').hidden = !logged;
    if (!logged){ if (location.hash) location.replace('connexion.html?next=' + encodeURIComponent('compte.html' + location.hash)); return; }

    /* ---------- en-tête ---------- */
    $('#meShop').textContent = me.shopName;
    $('#meMeta').textContent = `@${me.username} · ${me.shopCity || 'Lubumbashi'}`;
    $('#meAvatar').innerHTML = me.avatar
        ? `<img src="${me.avatar}" alt="${me.shopName}">`
        : me.shopName.charAt(0).toUpperCase();
    $('#shopDesc').textContent = me.shopDesc || t('Vous n\'avez pas encore décrit votre boutique.');
    $('#shopLink').href = 'magasin.html?u=' + encodeURIComponent(me.username);
    $('#setUsername').textContent = '@' + me.username;
    $('#setEmail').textContent = me.email;
    $('#setSince').textContent = dj(me.createdAt, { day: 'numeric', month: 'long', year: 'numeric' });

    /* ---------- onglets ---------- */
    const TABS = ['boutique', 'articles', 'likes', 'commandes', 'reglages'];
    const showTab = name => {
        TABS.forEach(t => { $('#tab-' + t).hidden = t !== name; });
        $$('.acct-tabs a').forEach(a => a.classList.toggle('active', a.dataset.tab === name));
        if (location.hash.slice(1) !== name) history.replaceState(null, '', '#' + name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    $$('.acct-tabs a').forEach(a => a.onclick = e => { e.preventDefault(); showTab(a.dataset.tab); });
    showTab(TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'boutique');

    /* ---------- réglages de la boutique ---------- */
    buildShopPick($('#pickCats'), CATEGORIES.map(c => ({ id: c.name, label: c.name, icon: 'fa-tag' })));
    buildShopPick($('#pickPayments'), SHOP_PAYMENTS);
    buildShopPick($('#pickFeatures'), SHOP_FEATURES);
    buildHoursGrid($('#hoursGrid'));
    bindCharCounters(shopForm());

    /* Le formulaire ne contient pas de champ pour le logo, la bannière, la
       galerie et les horaires : leurs valeurs viennent des widgets et doivent
       être fusionnées avant chaque envoi (aperçu comme enregistrement). */
    let logo, banner, gallery;
    const draft = () => Object.assign(collectShopForm(), {
        avatar:      logo.get(),
        banner:      banner.get(),
        shopGallery: gallery.list(),
        shopHours:   hoursGet($('#hoursGrid'))
    });

    logo    = makeImagePicker($('#logoPick'),    () => liveScore(draft()));
    banner  = makeImagePicker($('#bannerPick'),  () => liveScore(draft()));
    gallery = makeShopGallery($('#galleryPick'), me.shopGallery, () => liveScore(draft()));
    $('#hoursGrid').addEventListener('change', () => liveScore(draft()));

    /* « appliquer le lundi à toute la semaine » */
    $('#hoursCopy').onclick = () => {
        const mon = hoursGet($('#hoursGrid')).mon;
        hoursSet($('#hoursGrid'), Object.fromEntries(SHOP_DAYS.map(d => [d.id, mon])));
        toast(t('✅ Horaires appliqués à toute la semaine.'));
        liveScore(draft());
    };

    fillShopForm(me);
    logo.set(me.avatar);
    banner.set(me.banner);
    hoursSet($('#hoursGrid'), me.shopHours);

    /* on efface la marque rouge dès que l'utilisateur corrige le champ */
    Array.from(shopForm().querySelectorAll('input, textarea')).forEach(el =>
        el.addEventListener('input', () => {
            const row = el.closest('.f-row');
            if (row) row.classList.remove('invalid');
        }));
    shopForm().addEventListener('input', () => liveScore(draft()));
    shopForm().addEventListener('change', () => liveScore(draft()));

    shopForm().addEventListener('submit', async e => {
        e.preventDefault();
        if (!validateShopForm()) return toast('⚠️ ' + t('Merci de corriger les champs en rouge.'));

        try {
            const res = await BE.updateProfile(draft());
            const u = res.user || res;
            refreshAccountUI();
            $('#meShop').textContent = u.shopName;
            $('#meMeta').textContent = `@${u.username} · ${u.shopCity || 'Lubumbashi'}`;
            $('#meAvatar').innerHTML = u.avatar ? `<img src="${u.avatar}" alt="${esc(u.shopName)}">` : u.shopName.charAt(0).toUpperCase();
            $('#shopDesc').textContent = u.shopDesc || t("Vous n'avez pas encore décrit votre boutique.");
            $('#shopLink').href = 'magasin.html?u=' + encodeURIComponent(u.username);
            paintScore(res.score);
            paintShopPreview(u, res.score);
            toast('✅ ' + t('Boutique mise à jour.'));
        } catch (err){ toast('❌ ' + err.message); }
    });

    /* aperçu de la vitrine dans la colonne de gauche */
    async function firstPaint(){
        try {
            const me2 = await BE.loadMe(true);
            const sc  = await BE.req('GET', '/api/me');
            paintShopPreview(me2, sc.score);
        } catch (e){ /* hors ligne */ }
    }

    const out2 = $('#logoutBtn2');
    if (out2) out2.onclick = () => $('#logoutBtn').click();


    /* ---------- mes articles ---------- */
    const renderMyProducts = list => {
        const box = $('#myProducts');
        if (!list.length){
            box.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i>
                <h3>${t("Vous n'avez pas encore publié d'article")}</h3>
                <p>${t('Ouvrez votre boutique et publiez votre premier article.')}</p>
                <p style="margin-top:14px"><a class="btn btn-cta" href="publier.html"><i class="fas fa-square-plus"></i> ${t('Publier un article')}</a></p></div>`;
            $('#kpiArticles').textContent = '0';
            return;
        }
        box.innerHTML = list.map(p => {
            const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
            return `<div class="item-row" data-pid="${p.id}">
                <img src="${p.image || 'https://picsum.photos/seed/' + p.id + '/200/200'}" alt="${p.title}">
                <div class="ir-body">
                    <div class="ir-title">${p.title}</div>
                    <div class="ir-meta">
                        ${t(p.category)} · ${fmt(p.price)}${p.oldPrice ? ` <s>${fmt(p.oldPrice)}</s> -${off}%` : ''} · ${t('{0} en stock', [nfmt(p.stock)])}
                    </div>
                    <div class="ir-meta">
                        <span style="color:#cc0c39;font-weight:700">♥ ${nfmt(p.likes)} ${t("J'aime")}</span> ·
                        ${t('publié le {0}', [dj(p.createdAt)])}
                    </div>
                    <div class="ir-actions">
                        <button class="btn btn-outline btn-sm" data-edit="${p.id}"><i class="fas fa-pen"></i> ${t('Modifier')}</button>
                        <button class="btn btn-outline btn-sm" data-del-p="${p.id}"><i class="fas fa-trash-alt"></i> ${t('Supprimer')}</button>
                        <a class="btn btn-outline btn-sm" href="magasin.html?u=${encodeURIComponent(me.username)}"><i class="fas fa-eye"></i> ${t('Voir')}</a>
                    </div>
                </div>
            </div>`;
        }).join('');
        $('#kpiArticles').textContent = list.length;
        $('#kpiLikes').textContent = list.reduce((s, p) => s + p.likes, 0);
    };

    $('#myProducts').addEventListener('click', async e => {
        const del = e.target.closest('[data-del-p]');
        if (del){
            if (!confirm(t('Supprimer définitivement cet article ?'))) return;
            try {
                await BE.deleteProduct(del.dataset.delP);
                toast(t('🗑️ Article supprimé.'));
                loadAll();
            } catch (err){ toast('❌ ' + err.message); }
            return;
        }
        const ed = e.target.closest('[data-edit]');
        if (ed){
            /* la modification se fait dans le formulaire de publication */
            location.href = 'publier.html?edit=' + encodeURIComponent(ed.dataset.edit);
            return;
        }
    });

    /* ---------- J'aime / commandes ---------- */
    const renderLikes = list => {
        $('#likesCount').textContent = nfmt(list.length) + ' ' + t(list.length > 1 ? 'articles' : 'article');
        const box = $('#myLikes');
        if (!list.length){
            box.innerHTML = `<div class="empty-state"><i class="far fa-heart"></i>
                <h3>${t("Aucun J'aime pour l'instant")}</h3>
                <p>${t('Parcourez le catalogue et aimez les articles qui vous plaisent.')}</p>
                <p style="margin-top:14px"><a class="btn btn-cta" href="tous.html">${t('Découvrir les produits')}</a></p></div>`;
            return;
        }
        box.innerHTML = list.map(p => `<div class="item-row" data-pid="${p.id}">
            <img src="${p.image || 'https://picsum.photos/seed/' + p.id + '/200/200'}" alt="${p.title}">
            <div class="ir-body">
                <div class="ir-title">${p.title}</div>
                <div class="ir-meta">${t(p.category)} · ${p.owner ? t('Boutique {0}', [p.owner.shopName]) : ''}</div>
                <div class="ir-meta" style="color:#0f1111;font-weight:700;font-size:15px">${fmt(p.price)}</div>
                <div class="ir-actions">
                    <button class="btn-add btn-sm" data-add="${p.id}" style="width:auto;padding:6px 16px"><i class="fas fa-cart-plus"></i> ${t('Ajouter au panier')}</button>
                    <button class="like-btn on" data-like="${p.id}"><i class="fas fa-heart"></i><span class="like-nb">${nfmt(p.likes)}</span></button>
                </div>
            </div>
        </div>`).join('');
    };

    const renderOrders = list => {
        $('#ordersCount').textContent = nfmt(list.length) + ' ' + t(list.length > 1 ? 'commandes' : 'commande');
        const box = $('#myOrders');
        if (!list.length){
            box.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i>
                <h3>${t('Aucune commande')}</h3><p>${t('Vos commandes validées apparaîtront ici.')}</p>
                <p style="margin-top:14px"><a class="btn btn-cta" href="tous.html">${t('Commencer mes achats')}</a></p></div>`;
            return;
        }
        box.innerHTML = list.map(o => `<div class="order-card">
            <div class="oc-top">
                <div>
                    <div class="oc-ref">${t('Commande {0}', [o.ref])}</div>
                    <div class="oc-items">${t('{0} article(s)', [nfmt(o.items.length)])} · ${dj(o.createdAt, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div style="text-align:right">
                    <div style="font-weight:700;font-size:17px">${fmt(o.total)}</div>
                    <span class="badge badge-new" style="position:static;border-radius:3px">${t(o.status)}</span>
                </div>
            </div>
            <div class="oc-items">${o.items.map(i => `${nfmt(i.qty)} × ${i.title}`).join(' · ')}</div>
        </div>`).join('');
    };

    /* ---------- chargement ---------- */
    let allProducts = [];
    async function loadAll(){
        try {
            allProducts = await BE.products({ mine: '1' });
            renderMyProducts(allProducts.map(normalize));
        } catch (err){
            $('#myProducts').innerHTML = `<div class="alert alert-err"><i class="fas fa-triangle-exclamation"></i><div><b>${err.message}</b></div></div>`;
        }
        try { renderLikes((await BE.likes()).map(normalize)); }
        catch (err){ $('#myLikes').innerHTML = `<div class="alert alert-err"><i class="fas fa-triangle-exclamation"></i><div><b>${err.message}</b></div></div>`; }
        try {
            const o = await BE.orders();
            renderOrders(o);
            $('#kpiOrders').textContent = o.length;
        } catch (err){
            $('#myOrders').innerHTML = `<div class="alert alert-err"><i class="fas fa-triangle-exclamation"></i><div><b>${err.message}</b></div></div>`;
        }
    }
    loadAll();
    firstPaint();
}

/* ==========================================================
   PAGE « PUBLIER UN ARTICLE »
   ========================================================== */
let editingId = null;
const MAX_PHOTOS = 8;
const MAX_DETAILS = 12;

/* ==========================================================
   SÉLECTEUR DE PHOTOS
   Jusqu'à MAX_PHOTOS photos par article : la 1re est la photo
   principale, les autres rejoignent la galerie qui défile seule.
   Le même sélecteur sert à publier.html et à l'administration.
   ========================================================== */
function makePhotoPicker(o){
    const { zone, file, grid, count, hint, url } = o;
    let photos = [];

    const paint = () => {
        grid.innerHTML = photos.map((u, i) => `<div class="photo-item${i === 0 ? ' main' : ''}">
                <img src="${safeUrl(u)}" alt="${t('Photo {0}', [nfmt(i + 1)])}">
                ${i === 0 ? `<span class="photo-tag">${t('Principale')}</span>` : ''}
                <button type="button" class="photo-btn photo-del" data-del="${i}" aria-label="${t('Retirer la photo {0}', [nfmt(i + 1)])}"><i class="fas fa-times"></i></button>
                ${i > 0 ? `<button type="button" class="photo-btn photo-set" data-main="${i}" title="${t('Définir comme photo principale')}"><i class="fas fa-star"></i></button>` : ''}
            </div>`).join('');
        const full = photos.length >= MAX_PHOTOS;
        if (zone){
            zone.classList.toggle('full', full);
            zone.style.display = 'block';
        }
        if (count) count.textContent = photos.length ? `— ${nfmt(photos.length)}/${nfmt(MAX_PHOTOS)}` : '';
        if (hint) hint.textContent = photos.length > 1
            ? t("Astuce : les photos défileront seules dans la galerie de l'article. La 1re photo sert de photo principale.")
            : '';
    };

    const add = list => {
        const room = MAX_PHOTOS - photos.length;
        if (room <= 0) return toast(t('⚠️ {0} photos maximum par article.', [nfmt(MAX_PHOTOS)]));
        if (list.length > room) toast(t('⚠️ Seules {0} photo(s) ont été ajoutées (maximum {1}).', [nfmt(room), nfmt(MAX_PHOTOS)]));
        photos = photos.concat(list.slice(0, room));
        if (url) url.value = '';
        paint();
    };

    async function send(list){
        if (!requireLogin(t('Connectez-vous pour envoyer des images'))) return;
        const room = MAX_PHOTOS - photos.length;
        if (room <= 0) return toast(t('⚠️ {0} photos maximum par article.', [nfmt(MAX_PHOTOS)]));
        const batch = list.slice(0, room);
        if (zone) zone.classList.add('busy');
        let n = 0;
        try {
            for (const f of batch){
                photos.push(await BE.upload(f));
                n++;
                paint();
            }
            toast(t('✅ {0} photo(s) envoyée(s) · autres ignorées ({1} max).', [nfmt(n), nfmt(MAX_PHOTOS)]));
        } catch (err){
            toast('❌ ' + err.message);
        } finally {
            if (zone) zone.classList.remove('busy');
            file.value = '';
        }
    }

    grid.addEventListener('click', e => {
        const del = e.target.closest('[data-del]');
        if (del){ photos.splice(+del.dataset.del, 1); paint(); return; }
        const set = e.target.closest('[data-main]');
        if (set){ photos.unshift(photos.splice(+set.dataset.main, 1)[0]); paint(); }
    });
    if (zone){
        zone.onclick = () => { if (photos.length < MAX_PHOTOS) file.click(); };
        ['dragenter', 'dragover'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('over'); }));
        ['dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('over'); }));
        zone.addEventListener('drop', e => {
            const list = Array.from(e.dataTransfer.files || []).filter(isImageFile);
            if (list.length) send(list);
        });
    }
    file.onchange = () => { const list = Array.from(file.files || []); if (list.length) send(list); };
    if (url) url.oninput = e => {
        const v = e.target.value.trim();
        if (/^https?:\/\/\S+$/.test(v) && !photos.includes(v)) add([v]);
    };

    paint();
    return {
        list: () => photos.slice(),
        set: urls => { photos = (urls || []).filter(Boolean).slice(0, MAX_PHOTOS); paint(); },
        clear: () => { photos = []; if (url) url.value = ''; file.value = ''; paint(); }
    };
}

/* ==========================================================
   TABLEAU DES DÉTAILS  (matière, couleur, dimensions…)
   Une ligne par caractéristique : { k: libellé, v: valeur }.
   ========================================================== */
const DETAIL_SUGGESTIONS = ['Matière', 'Couleur', 'Dimensions', 'Poids', 'État',
                            'Marque', 'Modèle', 'Garantie', 'Emballage', 'Fabricant'];

function makeDetailEditor(o){
    const { rows, chips, count, addBtn, wrap } = o;
    let details = [];

    const paint = () => {
        rows.innerHTML = details.map((d, i) => `<div class="detail-row">
                <input class="detail-k" type="text" value="${esc(d.k)}" maxlength="60" placeholder="${t('Intitulé (ex. Matière)')}" aria-label="${t('Intitulé du détail {0}', [nfmt(i + 1)])}">
                <input class="detail-v" type="text" value="${esc(d.v)}" maxlength="200" placeholder="${t('Valeur (ex. Bois massif)')}" aria-label="${t('Valeur du détail {0}', [nfmt(i + 1)])}">
                <button type="button" class="detail-del" data-del="${i}" aria-label="${t('Supprimer le détail {0}', [nfmt(i + 1)])}"><i class="fas fa-times"></i></button>
            </div>`).join('');
        const full = details.length >= MAX_DETAILS;
        if (count) count.textContent = details.length ? `— ${nfmt(details.length)}` : '';
        if (addBtn){
            addBtn.disabled = full;
            addBtn.innerHTML = full
                ? `<i class="fas fa-check"></i> ${t('{0} détails maximum', [nfmt(MAX_DETAILS)])}`
                : `<i class="fas fa-plus"></i> ${t('Ajouter un détail')}`;
        }
    };
    const add = (k, v) => {
        if (details.length >= MAX_DETAILS) return toast(t('⚠️ {0} détails maximum par article.', [nfmt(MAX_DETAILS)]));
        details.push({ k: k || '', v: v || '' });
        paint();
        const last = rows.lastElementChild;
        if (last) (k ? $('.detail-v', last) : $('.detail-k', last))?.focus();
    };
    /* le modele suit la frappe : on relit les lignes au moment d'enregistrer */
    const read = () => {
        Array.from(rows.querySelectorAll('.detail-row')).forEach((row, i) => {
            if (!details[i]) details[i] = { k: '', v: '' };
            details[i].k = $('.detail-k', row).value.trim();
            details[i].v = $('.detail-v', row).value.trim();
        });
        const bad = details.some(d => !d.k && d.v);   /* une valeur sans intitulé est incomplète */
        return { list: details.filter(d => d.k), bad };
    };
    if (chips){
        chips.innerHTML = DETAIL_SUGGESTIONS.map(s =>
            `<button type="button" class="dchip" data-chip="${esc(s)}">${t(s)}</button>`).join('');
        chips.addEventListener('click', e => {
            const c = e.target.closest('[data-chip]');
            if (c) add(c.dataset.chip);
        });
    }
    rows.addEventListener('click', e => {
        const del = e.target.closest('[data-del]');
        if (del){ details.splice(+del.dataset.del, 1); paint(); }
    });
    rows.addEventListener('input', () => { if (wrap) wrap.classList.remove('invalid'); });
    if (addBtn) addBtn.onclick = () => add();
    paint();
    return {
        read,
        set: list => { details = (list || []).slice(0, MAX_DETAILS).map(d => ({ k: d.k || '', v: d.v || '' })); paint(); },
        clear: () => { details = []; paint(); }
    };
}

async function initPublishPage(){
    refreshAccountUI();
    await BE.loadMe(true);
    const me = BE.user();
    const logged = !!me;
    $('#notLogged').hidden = logged;
    $('#logged').hidden = !logged;
    if (!logged){
        setTimeout(() => { location.replace('connexion.html?next=' + encodeURIComponent('publier.html')); }, 600);
        return;
    }
    $('#shopLink').href = 'magasin.html?u=' + encodeURIComponent(me.username);
    $('#pvLink').href   = 'magasin.html?u=' + encodeURIComponent(me.username);
    $('#pvShop').textContent = me.shopName;

    BE.products({ mine: '1' }).then(list => {
        $('#pvCount').textContent = nfmt(list.length) + ' ' + t(list.length > 1 ? 'articles publiés' : 'article publié');
    }).catch(() => {});

    const mark = (id, ok) => { $('#' + id).classList.toggle('invalid', !ok); return ok; };
    $$('#publishForm input, #publishForm textarea, #publishForm select').forEach(el =>
        el.addEventListener('input', () => el.closest('.f-row')?.classList.remove('invalid')));

    /* ---------- photos de l'article ---------- */
    const photoPicker = makePhotoPicker({
        zone: $('#dropZone'), file: $('#vFile'), grid: $('#photoGrid'),
        url: $('#vImageUrl'), count: $('#photoCount'), hint: $('#photoHint')
    });

    /* ---------- détails de l'article (matière, couleur, dimensions…) ---------- */
    const detailEditor = makeDetailEditor({
        rows: $('#detailRows'), chips: $('#detailChips'),
        count: $('#detailCount'), addBtn: $('#addDetail'), wrap: $('#v-details')
    });

    /* ---------- modification d'un article existant ---------- */
    const editId = new URLSearchParams(location.search).get('edit');
    if (editId){
        BE.product(editId).then(p => {
            if (!p) return;
            if (p.owner && p.owner.username !== me.username)
                return toast(t('⚠️ Vous ne pouvez modifier que vos propres articles.'));
            editingId = p.id;
            $('#vTitle').value    = p.title;
            $('#vCat').value      = p.cat;
            $('#vPrice').value    = p.price;
            $('#vOldPrice').value = p.oldPrice || '';
            $('#vStock').value    = p.stock;
            $('#vBadge').value    = p.badge || '';
            $('#vPrime').checked  = !!p.prime;
            $('#vDesc').value     = p.desc || '';
            photoPicker.set(p.images && p.images.length ? p.images : (p.image ? [p.image] : []));
            detailEditor.set(detailsOf(p));
            $('#publishBtn').innerHTML = `<i class="fas fa-save"></i> ${t('Enregistrer les modifications')}`;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            toast(t('✏️ Article chargé — modifiez puis enregistrez.'));
        }).catch(e => toast('❌ ' + e.message));
    }

    /* ---------- calcul de la remise en direct ---------- */
    const off = $('#vOff');
    const refreshOff = () => {
        const p = parseFloat($('#vPrice').value), o = parseFloat($('#vOldPrice').value);
        if (p > 0 && o > p){
            off.innerHTML = t('Soit <b>-{0}%</b> · badge « Promotion » appliqué', [nfmt(Math.round((1 - p / o) * 100))]);
            if (!$('#vBadge').value) $('#vBadge').value = 'deal';
        } else off.textContent = '';
    };
    $('#vPrice').oninput = refreshOff;
    $('#vOldPrice').oninput = refreshOff;

    /* ---------- envoi ---------- */
    $('#publishForm').addEventListener('submit', async e => {
        e.preventDefault();
        const price = parseFloat($('#vPrice').value);
        const oldPrice = $('#vOldPrice').value ? parseFloat($('#vOldPrice').value) : null;
        const det = detailEditor.read();
        const shots = photoPicker.list();
        const ok =
            mark('v-title', $('#vTitle').value.trim().length >= 3) &&
            mark('v-cat',   !!$('#vCat').value) &&
            mark('v-price', Number.isFinite(price) && price > 0) &&
            mark('v-oldPrice', oldPrice === null || (Number.isFinite(oldPrice) && oldPrice > price)) &&
            mark('v-stock', $('#vStock').value === '' || (parseInt($('#vStock').value, 10) >= 0)) &&
            mark('v-desc',  $('#vDesc').value.trim().length >= 10) &&
            mark('v-image', shots.every(u => /^https?:\/\/|^\/uploads\//.test(u))) &&
            mark('v-details', !det.bad);
        if (!ok) return toast('⚠️ Merci de corriger les champs en rouge.');

        const btn = $('#publishBtn');
        const payload = {
            title: $('#vTitle').value.trim(),
            cat: $('#vCat').value,
            price,
            oldPrice,
            stock: parseInt($('#vStock').value, 10) || 0,
            image: shots[0] || '',
            images: shots,
            desc: $('#vDesc').value.trim(),
            details: det.list,
            badge: $('#vBadge').value,
            prime: $('#vPrime').checked
        };

        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('Publication…')}`;
        try {
            if (editingId){
                await BE.editProduct(editingId, payload);
                toast('✅ ' + t('Article mis à jour.'));
            } else {
                await BE.publish(payload);
                toast(t('🎉 Article publié dans votre magasin !'));
            }
            editingId = null;
            photoPicker.clear();
            detailEditor.clear();
            $('#publishForm').reset();
            $('#vStock').value = 10;
            $('#vPrime').checked = true;
            btn.innerHTML = `<i class="fas fa-cloud-arrow-up"></i> ${t('Publier dans mon magasin')}`;
            BE.products({ mine: '1' }).then(l => {
                $('#pvCount').textContent = nfmt(l.length) + ' ' + t(l.length > 1 ? 'articles publiés' : 'article publié');
            }).catch(() => {});
        } catch (err){
            toast('❌ ' + err.message);
        } finally {
            btn.disabled = false;
        }
    });
}

/* ==========================================================
   PAGE PUBLIQUE D'UNE BOUTIQUE
   ========================================================== */

/* Une ligne « libellé : valeur » dans les tableaux d'informations. */
function infoRow(icon, label, value, extra){
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length)) return '';
    return `<div class="it-row">${extra || `<i class="fas ${icon}"></i>`}
        <span class="it-label">${esc(t(label))}</span>
        <span class="it-value">${value}</span></div>`;
}
/* Un bloc titré, avec une ligne par information disponible. */
function infoBlock(rows){
    const body = rows.filter(Boolean).join('');
    return body ? `<div class="info-table">${body}</div>` : '';
}
/* Découpe un texte long en paragraphes, sans casser les URL. */
const paragraphs = txt => String(txt || '')
    .split(/\n{2,}/).map(s => s.trim()).filter(Boolean)
    .map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');

const HOURS_TEXT = h => h.closed ? t('Fermé') : `${h.o} – ${h.c}`;

function socialLinks(shop){
    const rows = [
        ['Facebook',  'faFacebook',  'fa-facebook',   shop.shopFacebook],
        ['Instagram', 'faInstagram', 'fa-instagram',  shop.shopInstagram],
        ['TikTok',    'faTiktok',    'fa-tiktok',     shop.shopTiktok],
        ['YouTube',   'faYoutube',   'fa-youtube',    shop.shopYoutube],
        ['Site web',  '',            'fa-globe',      shop.shopWebsite]
    ].filter(r => r[3]);
    return rows.length
        ? `<ul class="sh-social">${rows.map(r => `<li><a href="${esc(r[3])}" target="_blank" rel="noopener nofollow">
               <i class="${r[1] ? 'fab ' + r[1] : 'fas ' + r[2]}"></i><span>${esc(t(r[0]))}</span></a></li>`).join('')}</ul>`
        : '';
}

async function initShopPage(){
    refreshAccountUI();

    const params = new URLSearchParams(location.search);
    const username = params.get('u');
    const wantedCat = params.get('cat') || 'Toutes';

    if (!username){
        /* sans identifiant : on liste les boutiques, éventuellement filtrées
           par la catégorie d'origine (« Électronique » -> boutiques qui vendent
           de l'électronique). */
        $('#notLogged')?.remove();
        document.querySelector('main').innerHTML =
            `<div class="crumb" style="padding-bottom:10px"><a href="index.html">${t('Accueil')}</a> <span>&rsaquo;</span> <b>${t('Magasins en ligne')}</b></div>
             <div class="box">
                 <div class="box-head">
                     <h3 id="shopsTitle">${t('Tous les magasins en ligne')}</h3>
                     <span class="sh-tools">
                         <label class="sh-search"><i class="fas fa-search"></i>
                             <input type="search" id="shopsQuery" placeholder="${t('Rechercher une boutique')}" autocomplete="off"></label>
                         <select class="sh-sort" id="shopsSort">
                             <option value="products">${t("Plus d'articles")}</option>
                             <option value="likes">${t("Plus de J'aime")}</option>
                             <option value="rating">${t('Mieux notées')}</option>
                             <option value="sales">${t('Plus de ventes')}</option>
                             <option value="score">${t('Boutiques les plus détaillées')}</option>
                             <option value="open">${t('Ouvertes maintenant')}</option>
                             <option value="name">${t('Nom (A-Z)')}</option>
                             <option value="recent">${t('Plus récentes')}</option>
                         </select>
                     </span>
                 </div>
<div class="sh-filters">
                      <label class="chk"><input type="checkbox" id="fVerified"><span><i class="fas fa-badge-check"></i>${t('Boutiques vérifiées')}</span></label>
                      <label class="chk"><input type="checkbox" id="fDelivery"><span><i class="fas fa-truck"></i>${t('Livraison à domicile')}</span></label>
                      <label class="chk"><input type="checkbox" id="fHasPhone"><span><i class="fas fa-phone"></i>${t('Numéro de téléphone')}</span></label>
                      <label class="chk"><input type="checkbox" id="fHasArticles"><span><i class="fas fa-box"></i>${t('Avec des articles')}</span></label>
                      <label class="chk"><input type="checkbox" id="fOpen"><span><i class="fas fa-clock"></i>${t('Ouvertes maintenant')}</span></label>
                  </div>
                  <p class="sh-intro" id="shopsIntro"></p>
                  <div id="shopsList" class="shops-rich"></div>
              </div>

              <!-- ============ ARTICLES PUBLIÉS PAR LES VENDEURS ============ -->
              <div class="box" id="sellerBox" hidden>
                  <div class="box-head">
                      <h3 id="sellerTitle">${t('Tous les articles publiés par les vendeurs')}</h3>
                      <span class="sh-tools">
                          <label class="sh-search"><i class="fas fa-search"></i>
                              <input type="search" id="sellerQuery" placeholder="${t('Rechercher un article de vendeur')}" autocomplete="off"></label>
                          <select class="sh-sort" id="sellerShop">
                              <option value="">${t('Toutes les boutiques')}</option>
                          </select>
                          <select class="sh-sort" id="sellerSort">
                              <option value="recent">${t('Plus récents')}</option>
                              <option value="price">${t('Prix croissant')}</option>
                              <option value="desc">${t('Prix décroissant')}</option>
                              <option value="note">${t('Mieux notés')}</option>
                          </select>
                      </span>
                  </div>
                  <p class="sh-intro" id="sellerIntro"></p>
                  <div class="p-grid" id="sellerGrid"></div>
              </div>`;

        $('#shopsTitle').textContent = wantedCat === 'Toutes' ? t('Tous les magasins en ligne') : t('Magasins en ligne — {0}', [wantedCat]);
        $('#shopsList').innerHTML = '<span class="sh-sk on"></span>'.repeat(8);

        const query  = $('#shopsQuery');
        const sorter = $('#shopsSort');
        const toggles = { verified: $('#fVerified'), delivery: $('#fDelivery'), hasPhone: $('#fHasPhone'),
                          hasArticles: $('#fHasArticles'), open: $('#fOpen') };
        const paint = async () => {
            const q = query.value.trim();
            try {
                const params2 = { sort: sorter.value };
                if (wantedCat !== 'Toutes') params2.cat = wantedCat;
                if (q) params2.q = q;
                if (toggles.verified.checked) params2.verified = '1';
                if (toggles.delivery.checked) params2.delivery = '1';
                const all = await BE.shops(params2);
                const list = all.filter(s => (!toggles.hasArticles.checked || s.productCount > 0)
                    && (!toggles.hasPhone.checked || s.phone)
                    && (!toggles.open.checked || s.openNow === true));
                $('#shopsIntro').textContent = list.length
                    ? t(list.length > 1
                        ? '{0} boutiques — chaque carte montre la fiche complète du vendeur et ses derniers articles.'
                        : '{0} boutique — la carte montre la fiche complète du vendeur et ses derniers articles.', [nfmt(list.length)])
                    : '';
                $('#shopsList').innerHTML = list.length
                    ? list.map(s => shopCardRichHTML(s, wantedCat)).join('')
                    : `<div class="empty-state" style="grid-column:1/-1">
                           <i class="fas fa-store"></i><h3>${t('Aucune boutique')}</h3>
                           <p>${t('Aucune boutique ne correspond à cette recherche.')}</p>
                           <p style="margin-top:12px"><a class="btn btn-outline" href="publier.html">${t('Créer ma boutique')}</a></p>
                       </div>`;
                shopNames = all.map(s => ({ username: s.username, name: s.shopName || s.username }));
                paintSellerFilter();
            } catch (err){
                $('#shopsList').innerHTML = `<div class="alert alert-err" style="grid-column:1/-1">
                    <i class="fas fa-triangle-exclamation"></i><div><b>${esc(err.message)}</b></div></div>`;
            }
        };
        let shopTimer;
        query.addEventListener('input', () => { clearTimeout(shopTimer); shopTimer = setTimeout(paint, 250); });
        sorter.addEventListener('change', paint);
        Object.values(toggles).forEach(el => el.addEventListener('change', paint));

        /* ---------- articles publiés par les vendeurs ---------- */
        let shopNames = [];
        const sellerBox   = $('#sellerBox');
        const sellerQuery = $('#sellerQuery');
        const sellerShop  = $('#sellerShop');
        const sellerSort  = $('#sellerSort');
        const paintSellerFilter = () => {
            if (!sellerShop) return;
            const keep = sellerShop.value;
            sellerShop.innerHTML = `<option value="">${t('Toutes les boutiques')}</option>`
                + shopNames.map(s => `<option value="${esc(s.username)}">${esc(s.name)}</option>`).join('');
            sellerShop.value = keep;
        };
        const paintSeller = () => {
            if (!sellerBox || sellerBox.hidden) return;
            const q = sellerQuery.value.trim().toLowerCase();
            const shop = sellerShop.value;
            const list = PRODUCTS.filter(p => p.owner && p.owner.username !== 'businessenligne')
                .filter(p => !shop || p.owner.username === shop)
                .filter(p => !q || (p.name + ' ' + (p.desc || '') + ' ' + (p.owner.shopName || '')).toLowerCase().includes(q))
                .sort({
                    recent: (a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')),
                    price:  (a, b) => a.price - b.price,
                    desc:   (a, b) => b.price - a.price,
                    note:   (a, b) => (b.rating - a.rating) || (b.reviews - a.reviews)
                }[sellerSort.value] || ((a, b) => 0));
            $('#sellerGrid').innerHTML = list.length
                ? list.map(cardHTML).join('')
                : `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-box-open"></i>
                     <h3>${t('Aucun article publié')}</h3>
                     <p>${t("Les vendeurs n'ont encore rien publié ici.")}</p>
                     <p style="margin-top:12px"><a class="btn btn-outline" href="publier.html">${t('Publier un article')}</a></p>
                   </div>`;
            $('#sellerIntro').textContent = list.length
                ? t('{0} article(s) mis en ligne par nos vendeurs — cliquez sur la boutique sous l\'article pour ouvrir sa vitrine.', [nfmt(list.length)])
                : '';
            initGalleries($('#sellerGrid'));
        };
        if (sellerBox){
            let sellerTimer;
            sellerQuery.addEventListener('input', () => { clearTimeout(sellerTimer); sellerTimer = setTimeout(paintSeller, 250); });
            sellerShop.addEventListener('change', paintSeller);
            sellerSort.addEventListener('change', paintSeller);
            sellerBox.hidden = false;
            paintSeller();
        }

        await paint();
        return;
    }

    try {
        const { shop, products, related } = await BE.shop(username);
        $('#shopHeader').hidden = false;
        $('#shopBody').hidden = false;

        /* les articles de la boutique rejoignent le catalogue global :
           le panier et la fiche article en ont besoin pour les retrouver. */
        products.forEach(p => {
            if (!PRODUCTS.some(x => String(x.id) === String(p.id))) PRODUCTS.push(normalize(p));
        });

        /* la catégorie d'origine (arrivee depuis une page catégorie) est
           pré-sélectionnée, et le fil d'Ariane la rappelle. */
        const startCat = products.some(p => p.cat === wantedCat) && wantedCat !== 'Toutes' ? wantedCat : 'Toutes';
        document.title = shop.shopName + (startCat === 'Toutes' ? '' : ' — ' + startCat) + ' — BusinessEnLigne';
        const crumb = document.querySelector('.container > .crumb');
        if (crumb){
            const b = crumb.querySelector('b');
            if (b) b.textContent = shop.shopName + (startCat === 'Toutes' ? '' : ' — ' + startCat);
        }

        /* ---------- en-tête ---------- */
        const isMe = BE.user() && BE.user().username === shop.username;
        $('#shName').childNodes[0].nodeValue = shop.shopName;
        $('#shVerified').hidden = !shop.shopVerified;
        if (shop.shopSlogan){ $('#shSlogan').hidden = false; $('#shSlogan').textContent = shop.shopSlogan; }
        $('#shMeta').innerHTML = [
            `<span><i class="fas fa-at"></i> @${esc(shop.username)}</span>`,
            `<span><i class="fas fa-box"></i> ${esc(t('{0} article(s)', [nfmt(shop.productCount)]))}</span>`,
            `<span><i class="fas fa-map-marker-alt"></i> ${esc(shop.shopCity || 'Lubumbashi')}</span>`,
            shop.shopFounded ? `<span><i class="fas fa-calendar"></i> ${esc(t('depuis {0}', [shop.shopFounded]))}</span>` : ''
        ].filter(Boolean).join('');
        $('#shDesc').textContent = shop.shopDesc || t("Cette boutique n'a pas encore de description.");
        $('#shArticles').textContent = nfmt(shop.productCount);
        $('#shLikes').textContent = nfmt(shop.likes);
        $('#shSince').textContent = new Date(shop.createdAt).getFullYear();
        $('#shAvatar').innerHTML = shop.avatar
            ? `<img src="${esc(shop.avatar)}" alt="${esc(shop.shopName)}">`
            : esc(shop.shopName.charAt(0).toUpperCase());
        if (shop.banner) $('#shBanner').src = shop.banner;

        /* Boutique suspendue : la page reste visible (on ne cache rien
           discrètement), mais on explique pourquoi elle est fermée. Le
           motif est celui écrit par l'administration. */
        const susp = $('#shSuspended');
        if (susp){
            susp.hidden = !shop.suspended;
            if (shop.suspended)
                susp.innerHTML = `<i class="fas fa-store-slash"></i><div><b>${esc(t('Boutique suspendue'))}</b>
                    <span>${esc(shop.shopSuspendedReason || t("Cette boutique est temporairement fermée par l'administration."))}</span></div>`;
        }

        /* étiquettes : catégories, ouvert/fermé, services */
        const tags = [];
        (shop.shopCats || []).forEach(c => tags.push(`<span class="sh-tag cat">${esc(t(c))}</span>`));
        tags.push(openBadge(shop));
        if (shop.shopDelivery) tags.push(`<span class="sh-tag"><i class="fas fa-truck"></i>${t('Livraison')}</span>`);
        if (shop.shopPickup)   tags.push(`<span class="sh-tag"><i class="fas fa-hand-hold"></i>${t('Retrait')}</span>`);
        if (shop.shopReturns)  tags.push(`<span class="sh-tag"><i class="fas fa-rotate-left"></i>${t('Retours')}</span>`);
        if (shop.rating)       tags.push(`<span class="sh-tag"><i class="fas fa-star"></i>${shop.rating} / 5</span>`);
        $('#shTags').innerHTML = tags.join('');

        /* ---------- barre de statistiques ---------- */
        const stat = (icon, value, label, title) =>
            `<div class="sb-item"${title ? ` title="${esc(t(title))}"` : ''}><i class="fas ${icon}"></i>
                <b>${value}</b><span>${esc(t(label))}</span></div>`;
        $('#shStatbar').innerHTML = [
            stat('fa-box', nfmt(shop.productCount), 'articles'),
            stat('fa-heart', nfmt(shop.likes), "J'aime"),
            stat('fa-users', nfmt(shop.followers), 'abonnés'),
            stat('fa-star', shop.rating ? shop.rating : '—', t('note'), t('Note moyenne des articles')),
            stat('fa-cart-shopping', nfmt(shop.sales), 'ventes'),
            stat('fa-cubes', nfmt(shop.stockTotal), t('en stock')),
            shop.minPrice != null
                ? `<div class="sb-item wide" title="${esc(t('Fourchette de prix'))}"><i class="fas fa-tags"></i>
                     <b>${fmt(shop.minPrice)}${shop.maxPrice > shop.minPrice ? ' – ' + fmt(shop.maxPrice) : ''}</b>
                     <span>${esc(t('fourchette'))}</span></div>`
                : ''
        ].filter(Boolean).join('');

        /* ---------- barre de couverture : badge de complétude ---------- */
        $('#shBadges').innerHTML = [
            shop.shopVerified ? `<span class="cov-badge v"><i class="fas fa-badge-check"></i>${t('Boutique vérifiée')}</span>` : '',
            `<span class="cov-badge"><i class="fas fa-gauge-high"></i>${t('Vitrine complète à {0} %', [nfmt(shop.score)])}</span>`
        ].filter(Boolean).join('');

        /* ---------- boutons d'action ---------- */
        if (shop.phone){
            const call = $('#callBtn');
            call.hidden = false;
            call.href = telLink(shop.phone);
        }
        if (shop.shopWhatsapp || shop.phone){
            const wa = $('#waBtn');
            wa.hidden = false;
            wa.href = waLink(shop.shopWhatsapp || shop.phone,
                t('Bonjour {0}, je trouve vos articles sur BusinessEnLigne.', [shop.shopName]));
        }
        if (isMe){
            $('#shPublish').hidden = false;
            $('#shEdit').hidden = false;
        }
        $('#shareBtn').onclick = async () => {
            const data = { title: shop.shopName, text: shop.shopSlogan || shop.shopDesc || shop.shopName, url: location.href };
            try {
                if (navigator.share) await navigator.share(data);
                else { await navigator.clipboard.writeText(location.href); toast(t('✅ Lien copié.')); }
            } catch (e){ /* l'utilisateur a annulé */ }
        };

        /* « Suivre » = aimer les articles de la boutique, comme sur les réseaux */
        const follow = $('#followBtn');
        const followed = PRODUCTS.some(p => p.likedByMe && p.owner && p.owner.username === shop.username);
        const paintFollow = on => {
            follow.classList.toggle('on', on);
            follow.innerHTML = (on ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>')
                + ' ' + (on ? t('Vous suivez') : t('Suivre'));
        };
        paintFollow(followed);
        follow.onclick = async () => {
            if (!requireLogin(t('Connectez-vous pour suivre une boutique'))) return;
            const mine = PRODUCTS.filter(p => p.owner && p.owner.username === shop.username);
            if (!mine.length) return toast(t("Aucun article à aimer pour l'instant."));
            try {
                for (const p of mine) await BE.toggleLike(p.id);
                toast(t(followed ? 'Vous ne suivez plus cette boutique.' : 'Vous suivez cette boutique !'));
                location.reload();
            } catch (err){ toast('❌ ' + err.message); }
        };

        /* ---------- onglets ---------- */
        $('#shopTabs').addEventListener('click', e => {
            const a = e.target.closest('[data-tab]');
            if (!a) return;
            e.preventDefault();
            $$('#shopTabs a').forEach(x => x.classList.toggle('active', x === a));
            ['apropos', 'infos', 'livraison', 'horaires', 'galerie'].forEach(k =>
                $('#panel-' + k).hidden = k !== a.dataset.tab);
        });
        /* un onglet sans contenu ne doit pas être proposé */
        const has = {
            infos: !!($('#shInfos').innerHTML || ''),
            livraison: !!($('#shShip').innerHTML || ''),
            horaires: !!($('#shHours').innerHTML || ''),
            galerie: !!($('#shGal').innerHTML || '')
        };
        Object.keys(has).forEach(k => { if (!has[k]) $('[data-tab="' + k + '"]')?.remove(); });

        /* ---------- À PROPOS ---------- */
        $('#shAbout').innerHTML = shop.shopAbout
            ? paragraphs(shop.shopAbout)
            : `<p class="muted">${t("Cette boutique n'a pas encore rédigé de présentation détaillée.")}</p>`;
        $('#shFeats').innerHTML = (shop.shopFeatures || []).length
            ? shop.shopFeatures.map(f => {
                const info = featInfo(f);
                return `<span class="feat-pill"><i class="fas ${info ? info.icon : 'fa-check'}"></i>${esc(featLabel(f))}</span>`;
            }).join('')
            : '';

        /* ---------- INFORMATIONS ---------- */
        $('#shInfos').innerHTML = [
            infoRow('fa-at', 'Identifiant', '@' + esc(shop.username)),
            infoRow('fa-store', 'Nom de la boutique', esc(shop.shopName)),
            infoRow('fa-tag', 'Catégories', (shop.shopCats || []).map(c => `<span class="sh-tag cat">${esc(t(c))}</span>`).join(' ')),
            infoRow('fa-map-marker-alt', 'Ville', esc(shop.shopCity || '')),
            infoRow('fa-location-dot', 'Adresse', esc(shop.shopAddress || '')),
            infoRow('fa-sign-hanging', 'Point de repère', esc(shop.shopLandmark || '')),
            infoRow('fa-calendar', 'Boutique ouverte depuis', esc(shop.shopFounded || '')),
            infoRow('fa-clock', 'Membre depuis', dj(shop.createdAt, { day: 'numeric', month: 'long', year: 'numeric' })),
            infoRow('fa-file-shield', 'Identifiants légaux', esc(shop.shopLegal || '')),
            infoRow('fa-phone', 'Téléphone', shop.phone
                ? `<a href="${esc(telLink(shop.phone))}">${esc(shop.phone)}</a>` : ''),
            infoRow('fa-envelope', 'Email', shop.shopEmail
                ? `<a href="mailto:${esc(shop.shopEmail)}">${esc(shop.shopEmail)}</a>` : ''),
            infoRow('fa-cubes', t('Articles en stock'), nfmt(shop.stockTotal))
        ].join('') || `<p class="muted">${t('Cette boutique n\'a pas encore renseigné ses informations.')}</p>`;

        /* ---------- LIVRAISON & PAIEMENT ---------- */
        const shipRows = [
            infoRow('fa-truck', 'Livraison à domicile', shop.shopDelivery
                ? t('Oui{0}', [shop.shopDeliveryTime ? ' — ' + t('délai : {0}', [shop.shopDeliveryTime]) : ''])
                : t('Non'), shop.shopDelivery),
            infoRow('fa-hand-hold', 'Retrait en boutique', shop.shopPickup ? t('Oui') : t('Non'), shop.shopPickup),
            infoRow('fa-money-bill', 'Frais de livraison', esc(shop.shopDeliveryFee || ''), shop.shopDeliveryFee),
            infoRow('fa-gift', 'Livraison offerte', shop.shopFreeDelivery
                ? t('Dès {0}', [shop.shopFreeDelivery]) : '', shop.shopFreeDelivery),
            infoRow('fa-route', 'Zones desservies', esc(shop.shopDeliveryZones || ''), shop.shopDeliveryZones),
            infoRow('fa-rotate-left', 'Retours acceptés', shop.shopReturns
                ? t('Oui{0}', [shop.shopReturnDays ? ' — ' + shop.shopReturnDays : '']) : t('Non'), shop.shopReturns),
            infoRow('fa-shield-halved', 'Garantie', esc(shop.shopWarranty || ''), shop.shopWarranty)
        ];
        const payChips = (shop.shopPayments || []).map(id => {
            const info = payInfo(id);
            return `<span class="pay-pill"><i class="fas ${info ? info.icon : 'fa-money'}"></i>${esc(payLabel(id))}</span>`;
        }).join('');
        const shipBlock = $('#shShip');
        shipBlock.innerHTML = (shipRows.filter(Boolean).length || payChips)
            ? shipRows.filter(Boolean).join('')
              + (payChips ? `<div class="it-row block"><i class="fas fa-credit-card"></i>
                    <span class="it-label">${esc(t('Moyens de paiement'))}</span>
                    <span class="it-value">${payChips}</span></div>` : '')
            : `<p class="muted">${t('Cette boutique n\'a pas encore précisé ses conditions de livraison.')}</p>`;

        /* ---------- HORAIRES ---------- */
        const hoursKeys = Object.keys(shop.shopHours || {});
        if (hoursKeys.length){
            const today = SHOP_DAYS[(new Date().getDay() + 6) % 7].id;
            $('#shHours').innerHTML = SHOP_DAYS.map(d => {
                const h = (shop.shopHours || {})[d.id];
                return `<div class="ht-row${d.id === today ? ' today' : ''}">
                    <span class="ht-day">${esc(t(d.label))}</span>
                    <span class="ht-val${h && h.closed ? ' off' : ''}">${esc(h ? HOURS_TEXT(h) : t('Non précisé'))}</span>
                </div>`;
            }).join('');
        }

        /* ---------- GALERIE ---------- */
        const gal = (shop.shopGallery || []).filter(Boolean);
        $('#shGal').innerHTML = gal.length
            ? gal.map((u, i) => `<a href="${esc(u)}" target="_blank" rel="noopener"
                   title="${esc(t('Agrandir la photo'))}"><img src="${esc(u)}"
                   alt="${esc(shop.shopName)} — ${nfmt(i + 1)}" loading="lazy"></a>`).join('')
            : '';

        /* ---------- About : taux de remplissage ---------- */
        $('#shCompleteness').innerHTML = `<i class="fas fa-gauge-high"></i> ${esc(t('Vitrine renseignée à {0} %', [nfmt(shop.score)]))}`;

        /* ---------- colonne latérale ---------- */
        $('#shContact').innerHTML = `<div class="sh-card-h"><i class="fas fa-address-card"></i>${t('Contact')}</div>` + [
            infoRow('fa-map-marker-alt', 'Adresse', esc([shop.shopAddress, shop.shopCity].filter(Boolean).join(', '))),
            infoRow('fa-sign-hanging', 'Repère', esc(shop.shopLandmark || '')),
            infoRow('fa-phone', 'Téléphone', shop.phone ? `<a href="${esc(telLink(shop.phone))}">${esc(shop.phone)}</a>` : ''),
            infoRow('fab fa-whatsapp', 'WhatsApp', shop.shopWhatsapp
                ? `<a href="${esc(waLink(shop.shopWhatsapp))}" target="_blank" rel="noopener">${esc(shop.shopWhatsapp)}</a>` : ''),
            infoRow('fa-envelope', 'Email', shop.shopEmail
                ? `<a href="mailto:${esc(shop.shopEmail)}">${esc(shop.shopEmail)}</a>` : '')
        ].join('') + (shop.shopAddress || shop.phone || shop.shopEmail
            ? `<a class="btn btn-outline btn-block" target="_blank" rel="noopener"
                 href="https://www.google.com/maps/search/${encodeURIComponent([shop.shopAddress, shop.shopCity].filter(Boolean).join(' '))}">
                 <i class="fas fa-map-location-dot"></i> ${t('Voir sur la carte')}</a>` : '');

        const todayH = (shop.shopHours || {})[SHOP_DAYS[(new Date().getDay() + 6) % 7].id];
        $('#shOpen').innerHTML = `<div class="sh-card-h"><i class="fas fa-clock"></i>${t('Horaires')}</div>`
            + (hoursKeys.length
                ? `<p class="sh-open-line">${openBadge(shop)}</p>
                   ${todayH ? `<p class="muted">${esc(t('Aujourd\'hui : {0}', [HOURS_TEXT(todayH)]))}</p>` : ''}
                   <a href="#" data-tab-go="horaires">${t('Voir tous les horaires')} <i class="fas fa-chevron-right"></i></a>`
                : `<p class="muted">${t('Horaires non communiqués.')}</p>`);

        $('#shPayBox').innerHTML = `<div class="sh-card-h"><i class="fas fa-credit-card"></i>${t('Paiement & livraison')}</div>`
            + (payChips
                ? `<div class="pay-list">${payChips}</div>`
                : `<p class="muted">${t('Moyens de paiement non précisés.')}</p>`)
            + (shipRows.filter(Boolean).length ? `<div class="mini-rows">${shipRows.filter(Boolean).slice(0, 4).join('')}</div>` : '');

        const social = socialLinks(shop);
        $('#shSocial').innerHTML = social
            ? `<div class="sh-card-h"><i class="fas fa-share-nodes"></i>${t('Réseaux sociaux')}</div>${social}`
            : '';

        $('#shTrust').innerHTML = `<div class="sh-card-h"><i class="fas fa-shield-halved"></i>${t('Confiance')}</div>` + [
            infoRow('fa-gauge-high', t('Vitrine renseignée'), `<b>${nfmt(shop.score)} %</b>`),
            infoRow('fa-user-check', t('Membre depuis'), dj(shop.createdAt, { month: 'long', year: 'numeric' })),
            infoRow('fa-file-shield', 'Identifiants légaux', esc(shop.shopLegal || ''), shop.shopLegal),
            shop.shopVerified
                ? `<div class="trust-ok"><i class="fas fa-badge-check"></i>${t('Boutique vérifiée par la modération')}</div>`
                : `<p class="muted" style="font-size:12px">${t('Signalez toute information trompeuse à la modération.')}</p>`
        ].filter(Boolean).join('');
        $('#shSocial').hidden = !$('#shSocial').innerHTML;

        /* raccourci « voir tous les horaires » */
        $('#shopBody').addEventListener('click', e => {
            const go = e.target.closest('[data-tab-go]');
            if (!go) return;
            e.preventDefault();
            $('[data-tab="' + go.dataset.tabGo + '"]')?.click();
        });

        /* ---------- articles ---------- */
        const cats = ['Toutes', ...new Set(products.map(p => p.cat))];
        let activeCat = startCat;
        let sortMode = 'recent';
        const queryBox = $('#shQuery');
        const sorter = $('#shSort');

        const paintChips = () => {
            $('#shopFilters').innerHTML = cats.map(c =>
                `<a href="#" class="chip ${c === activeCat ? 'active' : ''}" data-sc="${esc(c)}">${c === 'Toutes' ? t('Tous les articles') : esc(t(c))} (${nfmt(products.filter(p => c === 'Toutes' || p.cat === c).length)})</a>`).join('');
        };
        const paintGrid = () => {
            const q = queryBox.value.trim().toLowerCase();
            let list = products.map(normalize)
                .filter(p => activeCat === 'Toutes' || p.cat === activeCat)
                .filter(p => !q || (p.name + ' ' + p.desc).toLowerCase().includes(q));
            const cmp = {
                recent: (a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')),
                asc:    (a, b) => a.price - b.price,
                desc:   (a, b) => b.price - a.price,
                note:   (a, b) => b.rating - a.rating || b.reviews - a.reviews
            }[sortMode];
            list = list.slice().sort(cmp);
            $('#shCount').textContent = nfmt(list.length) + ' ' + t(list.length > 1 ? 'articles' : 'article');
            $('#shopGrid').innerHTML = list.length
                ? list.map(cardHTML).join('')
                : `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-box-open"></i>
                     <h3>${t('Aucun article ici')}</h3>
                     ${q ? `<p>${t('Aucun résultat pour « {0} ».', [esc(q)])}</p>` : ''}</div>`;
            initGalleries($('#shopGrid'));
        };
        $('#shopFilters').addEventListener('click', e => {
            const c = e.target.closest('[data-sc]');
            if (!c) return;
            e.preventDefault();
            activeCat = c.dataset.sc;
            paintChips();
            paintGrid();
        });
        let qTimer;
        queryBox.addEventListener('input', () => { clearTimeout(qTimer); qTimer = setTimeout(paintGrid, 220); });
        sorter.addEventListener('change', () => { sortMode = sorter.value; paintGrid(); });
        paintChips();
        paintGrid();

        /* un lien vers « magasin.html?u=…&p=12 » ouvre l'article : c'est ce que
           font les vignettes d'aperçu sur la carte de la boutique. */
        const wanted = params.get('p');
        if (wanted) setTimeout(() => openModal(wanted), 120);

        /* ---------- autres boutiques ---------- */
        if (related && related.length){
            $('#shRelatedBox').hidden = false;
            $('#shRelated').innerHTML = related.map(s => shopCardHTML(s, 'Toutes')).join('');
        }

    } catch (err){
        $('#shopNotFound').hidden = false;
        if (err.offline) $('#shopNotFound').querySelector('p').textContent = err.message;
    }
}

/* ==========================================================
   TABLEAU DE SURVEILLANCE (ADMINISTRATION)
   ========================================================== */
const STATUTS = ['Confirmée', 'En préparation', 'Expédiée', 'Livrée', 'Annulée'];

async function initAdminPage(){
    refreshAccountUI();
    const me = await BE.loadMe(true);

    if (!me){
        showNoAccess('Vous devez être connecté pour accéder au tableau de surveillance.');
        return;
    }
    $('#adminWho').textContent = t('{0} — administrateur', [me.shopName]);

    let data;
    try { data = await BE.overview(); }
    catch (e){
        if (e.offline){
            showNoAccess('Serveur injoignable. Lancez « node server.js » puis ouvrez http://localhost:3000/admin.html');
            return;
        }
        showNoAccess(e.status === 403
            ? `Le compte « ${me.username} » n'a pas les droits d'administration.`
            : e.message);
        return;
    }

    $('#noAccess').hidden = true;
    $('#dash').hidden = false;

    const T = data.totals;

    /* ---------- alertes ---------- */
    const alerts = [];
    if (T.outOfStock) alerts.push(['danger', t('{0} article(s) en rupture de stock', [nfmt(T.outOfStock)]), t('Ruptures')]);
    if (T.lowStock) alerts.push(['warn',   t('{0} article(s) en stock faible (≤ 3)', [nfmt(T.lowStock)]), t('Stock')]);
    if (T.banned)    alerts.push(['info',   t('{0} compte(s) suspendu(s)', [nfmt(T.banned)]), t('Modération')]);
    if (T.shopsSuspended) alerts.push(['warn', t('{0} boutique(s) suspendue(s)', [nfmt(T.shopsSuspended)]), t('Modération')]);
    $('#adminAlerts').innerHTML = alerts.length
        ? alerts.map(a => `<div class="admin-alert ${a[0]}"><i class="fas fa-circle-info"></i>${a[1]}<span>${a[2]}</span></div>`).join('')
        : `<div class="admin-alert ok"><i class="fas fa-circle-check"></i>${t('Tout est en ordre : aucun point de vigilance.')}</div>`;

    /* ---------- indicateurs ---------- */
    const K = (icon, label, value, hint, tone) =>
        `<div class="admin-kpi ${tone || ''}">
            <i class="${icon}"></i>
            <b>${value}</b>
            <span>${label}</span>
            ${hint ? `<em>${hint}</em>` : ''}
         </div>`;
    $('#adminKpis').innerHTML = [
        K('fas fa-users',      t('Comptes'),   nfmt(T.users),     t('+{0} sur 7 jours', [nfmt(T.newUsers7d)])),
        K('fas fa-store',      t('Boutiques'), nfmt(T.users),     t('{0} administrateur(s)', [nfmt(T.admins)]), 'teal'),
        K('fas fa-box',        t('Articles'),  nfmt(T.products),  t('{0} en alerte', [nfmt(T.lowStock + T.outOfStock)]), 'blue'),
        K('fas fa-heart',      t('J\'aime'),   nfmt(T.likes),     t('tous membres confondus'), 'pink'),
        K('fas fa-receipt',    t('Commandes'), nfmt(T.orders),    t('+{0} sur 7 jours', [nfmt(T.orders7d)]), 'blue'),
        K('fas fa-coins',      t('Chiffre d\'affaires'), fmt(T.revenue), t('Panier moyen {0}', [fmt(T.avgBasket)]), 'green')
    ].join('');

    /* ---------- graphique des 30 derniers jours ---------- */
    const days = data.days, max = Math.max(1, ...days.map(d => Math.max(d.orders, d.signups)));
    $('#chart').innerHTML = days.map(d => `
        <div class="chart-col" title="${d.day} · ${t('{0} commande(s) · {1} inscription(s)', [nfmt(d.orders), nfmt(d.signups)])}">
            <div class="chart-bar">
                <i class="cb-orders" style="height:${(d.orders / max) * 100}%"></i>
                <i class="cb-signups" style="height:${(d.signups / max) * 100}%"></i>
            </div>
        </div>`).join('');
    $('#chartAxis').innerHTML = days.map((d, i) =>
        `<span>${(i % 5 === 0) ? d.day.slice(8) + '/' + d.day.slice(5, 7) : ''}</span>`).join('');

    /* ---------- catégories ---------- */
    const maxCat = Math.max(1, ...data.categories.map(c => c.count));
    $('#catBars').innerHTML = data.categories.map(c => `
        <div class="bar-row">
            <span>${t(c.name)}</span>
            <div class="bar"><i style="width:${(c.count / maxCat) * 100}%"></i></div>
            <b>${nfmt(c.count)}</b>
        </div>`).join('');

    /* ---------- dernières inscriptions ---------- */
    const ava = u => u.avatar
        ? `<img src="${u.avatar}" alt="">`
        : u.shopName.charAt(0).toUpperCase();
    $('#newUsers').innerHTML = data.topShops.length
        ? data.topShops.map(u => `<a class="mini-row" href="magasin.html?u=${encodeURIComponent(u.username)}">
            <div class="avatar sm">${ava(u)}</div>
            <div><b>${u.shopName}</b><span>@${u.username} · ${t('{0} article(s)', [nfmt(u.productCount)])}</span></div>
            <em>${dj(u.createdAt)}</em>
          </a>`).join('')
        : `<p class="muted">${t('Aucune inscription.')}</p>`;

    /* ---------- stocks faibles ---------- */
    $('#lowStock').innerHTML = data.lowStockItems.length
        ? data.lowStockItems.map(p => `<div class="mini-row">
            <img src="${p.image || 'https://picsum.photos/seed/' + p.id + '/80/80'}" alt="">
            <div><b>${p.title}</b><span>${p.owner ? p.owner.shopName : ''}</span></div>
            <em class="${p.stock === 0 ? 'tag-out' : 'tag-low'}">${p.stock === 0 ? t('Rupture') : t('{0} restants', [nfmt(p.stock)])}</em>
          </div>`).join('')
        : `<p class="muted">${t('Tous les stocks sont corrects.')}</p>`;

    /* ---------- top boutiques / top articles ---------- */
    $('#topShops').innerHTML = data.topShops.map(u => `<div class="mini-row">
        <div class="avatar sm">${ava(u)}</div>
        <div><b>${u.shopName}</b><span>@${u.username} · ${t('{0} J\'aime', [nfmt(u.likesReceived)])}</span></div>
        <em>${t('{0} art.', [nfmt(u.productCount)])}</em>
      </div>`).join('');

    $('#topProducts').innerHTML = data.topProducts.map(p => `<div class="mini-row">
        <img src="${p.image || 'https://picsum.photos/seed/' + p.id + '/80/80'}" alt="">
        <div><b>${p.title}</b><span>${t(p.cat)} · ${p.owner ? p.owner.shopName : ''}</span></div>
        <em><i class="fas fa-heart" style="color:#cc0c39"></i> ${nfmt(p.likes)}</em>
      </div>`).join('');

    /* ======================================================
       ONGLETS
       ====================================================== */
    const TABS = ['apercu', 'utilisateurs', 'articles', 'commandes'];
    const show = name => {
        TABS.forEach(t => { $('#atab-' + t).hidden = t !== name; });
        $$('#adminTabs a').forEach(a => a.classList.toggle('active', a.dataset.atab === name));
        history.replaceState(null, '', '#' + name);
        if (name === 'utilisateurs') loadUsers();
        if (name === 'articles')   loadProducts();
        if (name === 'commandes')  loadOrders();
    };
    $$('#adminTabs a').forEach(a => a.onclick = e => { e.preventDefault(); show(a.dataset.atab); });
    /* L'onglet demandé par l'ancre est ouvert en fin de tâche : les listes
       et leurs paramètres de recherche sont déclarés plus bas dans cette
       fonction, un appel immédiat les trouverait encore dans leur zone morte
       (charger admin.html#utilisateurs directement plantait). */
    queueMicrotask(() => show(TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'apercu'));

    /* ======================================================
       UTILISATEURS
       ====================================================== */
    const uQuery = { q: '', sort: 'recent' };
    let userTimer;

    async function loadUsers(){
        const list = await BE.adminUsers(uQuery);
        $('#usersCount').textContent = nfmt(list.length) + ' ' + t(list.length > 1 ? 'comptes' : 'compte');
        const body = $('#usersTable tbody');
        if (!list.length){
            body.innerHTML = `<tr><td colspan="10" class="muted">${t('Aucun compte ne correspond à la recherche.')}</td></tr>`;
            return;
        }
        body.innerHTML = list.map(u => `<tr${u.banned ? ' class="row-banned"' : ''}>
            <td>
                <div class="cell-user">
                    <div class="avatar xs">${u.avatar ? `<img src="${u.avatar}" alt="">` : u.shopName.charAt(0).toUpperCase()}</div>
                    <div>
                        <b>${u.shopName}</b>
                        <span>@${u.username}${u.isAdmin ? ' <i class="tag-admin">admin</i>' : ''}${u.banned ? ` <i class="tag-out">${t('suspendu')}</i>` : ''}${u.shopSuspended ? ` <i class="tag-out" title="${esc(u.shopSuspendedReason || '')}">${t('boutique suspendue')}</i>` : ''}</span>
                    </div>
                </div>
            </td>
            <td class="muted">${u.email}</td>
            <td>${u.shopCity || '—'}</td>
            <td class="num">${nfmt(u.productCount)}</td>
            <td class="num">${nfmt(u.likesReceived)}</td>
            <td class="num">${nfmt(u.sales || 0)}</td>
            <td class="num"><b>${fmt(u.revenue)}</b></td>
            <td class="num muted">${fmt(u.spent)}</td>
            <td class="muted">${dj(u.createdAt)}</td>
<td class="cell-actions">
                <a class="btn btn-outline btn-sm" href="magasin.html?u=${encodeURIComponent(u.username)}" title="${t('Voir la boutique')}"><i class="fas fa-eye"></i></a>
                <button class="btn btn-outline btn-sm" data-u-mod="${u.id}" title="${t('Modérer la boutique')}"><i class="fas fa-shield-halved"></i></button>
                <button class="btn btn-outline btn-sm" data-u-admin="${u.id}" title="${t(u.isAdmin ? 'Retirer le rôle admin' : 'Nommer administrateur')}"><i class="fas fa-shield-halved"></i></button>
                <button class="btn btn-outline btn-sm" data-u-ban="${u.id}" title="${t(u.banned ? 'Réactiver le compte' : 'Suspendre le compte')}"><i class="fas ${u.banned ? 'fa-unlock' : 'fa-ban'}"></i></button>
                <button class="btn btn-outline btn-sm danger" data-u-del="${u.id}" title="${t('Supprimer le compte')}"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>`).join('');
    }

/* ======================================================
       MODÉRATION D'UNE BOUTIQUE
       ======================================================
       Un seul panneau sert les deux sanctions, qui ne se confondent pas :
       le compte suspendu ne peut plus se connecter, la boutique suspendue
       continue de fonctionner mais sa vitrine, ses articles et ses photos
       sont retirés du site tant que le motif n'est pas corrigé. */
    let modData = null;

    const modOpen = () => {
        const m = $('#modModal');
        if (!m) return;
        m.classList.add('open');
        document.body.classList.add('modal-open');
    };
    const modClose = () => {
        const m = $('#modModal');
        if (!m) return;
        m.classList.remove('open');
        $('#modReasonBox').hidden = true;
        modData = null;
        if (!$('#modal')?.classList.contains('open')) document.body.classList.remove('modal-open');
    };

    /* Une vignette avec son retrait : le retrait passe par le serveur, qui
       vérifie que la photo appartient bien à la cible demandée. */
    const modPhoto = (url, label, kind, id) => `
        <figure class="mod-photo">
            <img src="${url}" alt="" loading="lazy">
            <figcaption>${label}</figcaption>
            <button type="button" class="mod-del" data-ph="${url}" data-kind="${kind}" data-id="${id}"
                    title="${t('Retirer cette photo')}"><i class="fas fa-trash-alt"></i></button>
        </figure>`;

    const roleLabel = role => role === 'logo' ? t('Logo')
                              : role === 'banniere' ? t('Bannière') : t('Galerie');

    function modRender(){
        if (!modData) return;
        const u = modData.user;

        $('#modAvatar').innerHTML = u.avatar ? `<img src="${u.avatar}" alt="">` : u.shopName.charAt(0).toUpperCase();
        $('#modName').textContent = u.shopName;
        $('#modMeta').textContent = `@${u.username} · ${u.email} · ${u.shopCity || '—'}`;

        $('#modBadges').innerHTML = [
            u.isAdmin ? `<i class="tag-admin">${t('admin')}</i>` : '',
            u.banned ? `<i class="tag-out">${t('Compte suspendu')}</i>` : '',
            u.shopSuspended ? `<i class="tag-out">${t('Boutique suspendue')}</i>` : '',
            u.shopVerified ? `<i class="tag-admin">${t('Boutique vérifiée')}</i>` : '',
            `<i class="tag-out">${nfmt(modData.products.length)} ${t('articles')}</i>`
        ].filter(Boolean).join('');

        /* Boutons : on inverse l'état affiché, la confirmation vient après. */
        $('#modBanTxt').textContent = u.banned ? t('Réactiver le compte') : t('Suspendre le compte');
        $('#modBanHint').textContent = u.banned
            ? t('Le vendeur pourra de nouveau se connecter.')
            : t('Coupe la connexion et la vitrine.');
        $('#modShopTxt').textContent = u.shopSuspended ? t('Réactiver la boutique') : t('Suspendre la boutique');
        $('#modShopHint').textContent = u.shopSuspended
            ? t('La vitrine et les articles seront de nouveau visibles.')
            : t('Le compte reste utilisable, la vitrine disparaît.');

        /* Motif : affiché quand il existe, sinon la saisie est demandée */
        const box = $('#modReasonBox');
        if (u.shopSuspended && u.shopSuspendedReason){
            box.hidden = false;
            $('#modReasonLabel').textContent = t('Motif de la suspension') + (u.shopSuspendedAt ? ' · ' + dj(u.shopSuspendedAt) : '');
            $('#modReason').value = u.shopSuspendedReason;
            $('#modReason').readOnly = true;
        } else {
            box.hidden = true;
        }

        const shopPhotos = modData.photos || [];
        $('#modPhotoCount').textContent = shopPhotos.length ? `(${nfmt(shopPhotos.length)})` : '';
        $('#modPhotos').innerHTML = shopPhotos.length
            ? shopPhotos.map(p => modPhoto(p.url, roleLabel(p.role), 'shop', u.id)).join('')
            : `<p class="muted">${t('Cette boutique n\'a pas encore de photo.')}</p>`;

        $('#modProdCount').textContent = modData.products.length ? `(${nfmt(modData.products.length)})` : '';
        $('#modProducts').innerHTML = modData.products.length
            ? modData.products.map(p => `<div class="mod-prod">
                  <div class="mod-prod-info">
                      <b>${p.title}</b>
                      <span>${t(p.cat)} · ${fmt(p.price)} · ${nfmt(p.stock)} ${t('en stock')}</span>
                  </div>
                  ${p.published ? `<i class="tag-admin">${t('Publié')}</i>` : `<i class="tag-out">${t('Masqué')}</i>`}
                  <button type="button" class="btn btn-outline btn-sm" data-p-vis="${p.id}"
                          title="${t(p.published ? 'Masquer l\'article' : 'Publier l\'article')}">
                      <i class="fas ${p.published ? 'fa-eye-slash' : 'fa-eye'}"></i></button>
                  <button type="button" class="btn btn-outline btn-sm danger" data-p-del="${p.id}"
                          title="${t('Supprimer l\'article')}"><i class="fas fa-trash-alt"></i></button>
                  <div class="mod-prod-photos">${(p.images || []).map(u2 => modPhoto(u2, t('Photo'), 'product', p.id)).join('')}</div>
              </div>`).join('')
            : `<p class="muted">${t('Aucun article dans cette boutique.')}</p>`;
    }

    async function modLoad(id){
        modOpen();
        $('#modName').textContent = '…';
        $('#modMeta').textContent = '';
        $('#modPhotos').innerHTML = '';
        $('#modProducts').innerHTML = `<p class="muted">${t('Chargement…')}</p>`;
        try {
            modData = await BE.adminUser(id);
            modRender();
        } catch (err){
            modData = null;
            $('#modProducts').innerHTML = `<p class="muted">${t('Erreur')}: ${err.message}</p>`;
            toast('❌ ' + err.message);
        }
    }

    /* Le panneau reflects toujours l'état du serveur : après chaque action
       on recharge la fiche plutôt que de deviner l'effet du patch. */
    async function modAfter(action){
        try {
            toast(t(action));
            await refresh();
            await modLoad(modData.user.id);
            loadUsers();
        } catch (err){ toast('❌ ' + err.message); }
    }

    $('#modClose').onclick = modClose;
    $('#modModal').addEventListener('click', e => { if (e.target === $('#modModal')) modClose(); });

    /* Sanctions */
    $('#modBan').onclick = async () => {
        if (!modData) return;
        const u = modData.user;
        const ban = !u.banned;
        if (ban && !confirm(t('Suspendre le compte « {0} » ? Il sera déconnecté et ne pourra plus se connecter.', [u.shopName]))) return;
        if (!ban && !confirm(t('Réactiver le compte « {0} » ?', [u.shopName]))) return;
        try { await BE.patchUser(u.id, { banned: ban }); modAfter(ban ? 'Compte suspendu.' : 'Compte réactivé.'); }
        catch (err){ toast('❌ ' + err.message); }
    };

    /* Suspension de boutique : le motif est demandé avant l'envoi, puis
       la fiche est rechargée pour afficher ce qui a réellement été enregistré. */
    $('#modShop').onclick = () => {
        if (!modData) return;
        const u = modData.user;
        if (u.shopSuspended){
            if (!confirm(t('Réactiver la boutique « {0} » ? Ses articles redeviendront visibles.', [u.shopName]))) return;
            BE.patchUser(u.id, { shopSuspended: false })
              .then(() => modAfter('Boutique réactivée.'))
              .catch(err => toast('❌ ' + err.message));
            return;
        }
        const box = $('#modReasonBox'), input = $('#modReason');
        box.hidden = false;
        $('#modReasonLabel').textContent = t('Motif de la suspension');
        input.readOnly = false;
        input.value = '';
        input.placeholder = t('Expliquez au vendeur ce qui doit être corrigé');
        input.focus();
    };

    $('#modReasonOk').onclick = async () => {
        if (!modData) return;
        const reason = $('#modReason').value.trim();
        try {
            await BE.patchUser(modData.user.id, { shopSuspended: true, shopSuspendedReason: reason });
            $('#modReasonBox').hidden = true;
            modAfter('Boutique suspendue.');
        } catch (err){ toast('❌ ' + err.message); }
    };
    $('#modReasonNo').onclick = () => { $('#modReasonBox').hidden = true; };

    /* Retrait d'une photo, masquage ou suppression d'un article */
    $('#modModal').addEventListener('click', async e => {
        const btn = e.target.closest('button[data-ph], button[data-p-vis], button[data-p-del]');
        if (!btn || !modData) return;
        try {
            if (btn.dataset.ph){
                if (!confirm(t('Retirer cette photo du site ?'))) return;
                const r = await BE.removePhoto({ kind: btn.dataset.kind, id: Number(btn.dataset.id), url: btn.dataset.ph });
                toast(t('Photo retirée.'));
                if (r && r.fileDeleted) toast(t('Fichier supprimé.'));
                await refresh();
                await modLoad(modData.user.id);
            } else if (btn.dataset.pVis){
                const p = modData.products.find(x => String(x.id) === btn.dataset.pVis);
                if (!p) return;
                await BE.editAsAdmin(p.id, { published: !p.published });
                toast(t(p.published ? 'Article masqué.' : 'Article publié.'));
                await refresh();
                await modLoad(modData.user.id);
            } else {
                if (!confirm(t('Supprimer définitivement l\'article « {0} » ?', [modData.products.find(x => String(x.id) === btn.dataset.pDel)?.title || '']))) return;
                await BE.deleteAsAdmin(btn.dataset.pDel);
                toast(t('🗑️ Article supprimé.'));
                await refresh();
                await modLoad(modData.user.id);
                loadProducts();
            }
        } catch (err){ toast('❌ ' + err.message); }
    });

    $('#usersTable').addEventListener('click', async e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.dataset.uMod){ modLoad(btn.dataset.uMod).catch(er => toast(er.message)); return; }
        const id = btn.dataset.uAdmin || btn.dataset.uBan || btn.dataset.uDel;
        if (!id) return;
        const row = btn.closest('tr');
        const name = row.querySelector('.cell-user b').textContent;

        try {
            if (btn.dataset.uAdmin){
                const on = btn.querySelector('i').classList.contains('fa-shield-halved');
                await BE.patchUser(id, { isAdmin: !on });
                toast(t('Rôle administrateur mis à jour.'));
            } else if (btn.dataset.uBan){
                const ban = btn.querySelector('i').classList.contains('fa-ban');
                if (ban && !confirm(t('Suspendre le compte « {0} » ? Il sera déconnecté et ne pourra plus se connecter.', [name]))) return;
                if (!ban && !confirm(t('Réactiver le compte « {0} » ?', [name]))) return;
                await BE.patchUser(id, { banned: ban });
                toast(t(ban ? 'Compte suspendu.' : 'Compte réactivé.'));
            } else {
                if (!confirm(t('Supprimer définitivement « {0} », ses articles et ses commandes ?', [name]))) return;
                await BE.deleteUser(id);
                toast(t('🗑️ Compte supprimé.'));
            }
            await refresh();
            loadUsers();
        } catch (err){ toast('❌ ' + err.message); }
    });

    let searchTimer;
    $('#userSearch').oninput = e => {
        clearTimeout(searchTimer);
        uQuery.q = e.target.value.trim();
        searchTimer = setTimeout(() => loadUsers().catch(er => toast(er.message)), 300);
    };
    $('#userSort').onchange = e => { uQuery.sort = e.target.value; loadUsers().catch(er => toast(er.message)); };

    /* ======================================================
       ARTICLES  —  ajouter, modifier, publier, supprimer
       ====================================================== */
    const pQuery = { q: '', cat: 'Toutes' };
    let admEditId = null;                 /* article en cours de modification */

    /* le même sélecteur de photos et de détails que sur publier.html */
    const admPhotos = makePhotoPicker({
        zone: $('#aDrop'), file: $('#aFile'), grid: $('#aGrid'),
        url: $('#aUrl'), count: $('#aPhotoCount'), hint: $('#aHint')
    });
    const admDetails = makeDetailEditor({
        rows: $('#aRows'), chips: $('#aChips'),
        count: $('#aDetailCount'), addBtn: $('#aAddDetail'), wrap: $('#a-details')
    });
    const amark = (id, good) => { $('#' + id).classList.toggle('invalid', !good); return good; };
    $$('#admForm input, #admForm textarea, #admForm select').forEach(el =>
        el.addEventListener('input', () => el.closest('.f-row')?.classList.remove('invalid')));

    /* le formulaire se replie pour laisser la place au tableau */
    const showForm = open => {
        $('#admForm').hidden = !open;
        $('#admFormToggle').innerHTML = open
            ? `<i class="fas fa-chevron-up"></i> ${t('Masquer le formulaire')}`
            : `<i class="fas fa-chevron-down"></i> ${t('Afficher le formulaire')}`;
    };
    $('#admFormToggle').onclick = () => showForm($('#admForm').hidden);
    showForm(false);

    /* la liste des boutiques sert de destinataire pour un nouvel article */
    async function loadShopSelect(){
        const sel = $('#aOwner');
        try {
            const { shops } = await BE.shops();
            sel.innerHTML = shops.map(s =>
                `<option value="${s.id}" data-username="${esc(s.username)}">${esc(s.shopName)} · @${esc(s.username)} (${nfmt(s.productCount)})</option>`).join('');
        } catch (err){
            sel.innerHTML = `<option value="${me.id}" data-username="${esc(me.username)}">${esc(me.shopName)}</option>`;
        }
        if (me && sel.querySelector(`option[value="${me.id}"]`)) sel.value = String(me.id);
    }

    function admReset(){
        admEditId = null;
        $('#admForm').reset();
        $('#aStock').value = 10;
        $('#aPrime').checked = true;
        $('#aPublished').checked = true;
        admPhotos.clear();
        admDetails.clear();
        $('#admFormTitle').innerHTML = `<i class="fas fa-square-plus" style="color:#ff9900"></i> ${t('Ajouter un article publié')}`;
        $('#aSave').innerHTML = `<i class="fas fa-cloud-arrow-up"></i> ${t("Publier l'article")}`;
        $('#admFormCancel').hidden = true;
    }
    $('#admFormCancel').onclick = () => { admReset(); showForm(false); };

    /* chargement d'un article dans le formulaire (photos et détails compris) */
    function admFill(p){
        admEditId = p.id;
        $('#aTitle').value    = p.title;
        $('#aCat').value      = p.cat;
        $('#aPrice').value    = p.price;
        $('#aOldPrice').value = p.oldPrice || '';
        $('#aStock').value    = p.stock;
        $('#aBadge').value    = p.badge || '';
        $('#aPrime').checked  = !!p.prime;
        $('#aPublished').checked = !!p.published;
        $('#aDesc').value     = p.desc || '';
        if (p.owner){
            const opt = $$('#aOwner option').find(o => o.dataset.username === p.owner.username);
            if (opt) $('#aOwner').value = opt.value;
        }
        admPhotos.set(p.images && p.images.length ? p.images : (p.image ? [p.image] : []));
        admDetails.set(detailsOf(p));
        $('#admFormTitle').innerHTML = `<i class="fas fa-pen" style="color:#ff9900"></i> ${t("Modifier l'article #{0}", [nfmt(p.id)])}`;
        $('#aSave').innerHTML = `<i class="fas fa-save"></i> ${t('Enregistrer les modifications')}`;
        $('#admFormCancel').hidden = false;
        showForm(true);
        $('#admFormBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast(t('✏️ Article chargé — modifiez puis enregistrez.'));
    }

    $('#admForm').addEventListener('submit', async e => {
        e.preventDefault();
        const price = parseFloat($('#aPrice').value);
        const oldPrice = $('#aOldPrice').value ? parseFloat($('#aOldPrice').value) : null;
        const det = admDetails.read();
        const shots = admPhotos.list();
        const ok =
            amark('a-title', $('#aTitle').value.trim().length >= 3) &&
            amark('a-owner', !!$('#aOwner').value) &&
            amark('a-cat', !!$('#aCat').value) &&
            amark('a-price', Number.isFinite(price) && price > 0) &&
            amark('a-oldPrice', oldPrice === null || (Number.isFinite(oldPrice) && oldPrice > price)) &&
            amark('a-stock', $('#aStock').value === '' || (parseInt($('#aStock').value, 10) >= 0)) &&
            amark('a-desc', $('#aDesc').value.trim().length >= 10) &&
            amark('a-image', shots.every(u => /^https?:\/\/|^\/uploads\//.test(u))) &&
            amark('a-details', !det.bad);
        if (!ok) return toast('⚠️ Merci de corriger les champs en rouge.');

        const payload = {
            title: $('#aTitle').value.trim(),
            cat: $('#aCat').value,
            price,
            oldPrice,
            stock: parseInt($('#aStock').value, 10) || 0,
            image: shots[0] || '',
            images: shots,
            desc: $('#aDesc').value.trim(),
            details: det.list,
            badge: $('#aBadge').value,
            prime: $('#aPrime').checked,
            published: $('#aPublished').checked
        };
        if ($('#aOwner').value) payload.ownerId = Number($('#aOwner').value);

        const btn = $('#aSave');
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('Enregistrement…')}`;
        try {
            if (admEditId){
                await BE.editAsAdmin(admEditId, payload);
                toast('✅ ' + t('Article mis à jour.'));
            } else {
                await BE.adminPublish(payload);
                toast(t('🎉 Article publié sur la plateforme.'));
            }
            admReset();
            showForm(false);
            await refresh();
            loadShopSelect();
            await loadProducts();
        } catch (err){
            toast('❌ ' + err.message);
        } finally {
            btn.disabled = false;
        }
    });

    async function loadProducts(){
        const list = await BE.adminProducts(pQuery);
        $('#productsCount').textContent = nfmt(list.length) + ' ' + t(list.length > 1 ? 'articles' : 'article');
        const body = $('#productsTable tbody');
        if (!list.length){
            body.innerHTML = `<tr><td colspan="8" class="muted">${t('Aucun article ne correspond à la recherche.')}</td></tr>`;
            return;
        }
        body.innerHTML = list.map(p => `<tr data-pid="${p.id}"${p.stock === 0 ? ' class="row-banned"' : ''}>
            <td>
                <div class="cell-user">
                    <img class="thumb" src="${safeUrl(p.image) || 'https://picsum.photos/seed/' + p.id + '/80/80'}" alt="">
                    <div><b>${esc(p.title)}</b><span>#${p.id} · ${t('{0} photo(s)', [nfmt((p.images || []).length)])}</span></div>
                </div>
            </td>
            <td>${p.owner ? esc(p.owner.shopName) : '—'}</td>
            <td>${esc(p.cat)}</td>
            <td class="num"><b>${fmt(p.price)}</b>${p.oldPrice ? `<br><s class="muted">${fmt(p.oldPrice)}</s>` : ''}</td>
            <td class="num">${p.stock === 0 ? `<i class="tag-out">${t('Rupture')}</i>` : p.stock <= 3 ? `<i class="tag-low">${nfmt(p.stock)}</i>` : nfmt(p.stock)}</td>
            <td class="num"><i class="fas fa-heart" style="color:#cc0c39"></i> ${nfmt(p.likes)}</td>
            <td>
                ${p.published ? `<i class="tag-admin">${t('Publié')}</i>` : `<i class="tag-out">${t('Masqué')}</i>`}
                <br><span class="muted" style="font-size:11px">${dj(p.createdAt)}</span>
            </td>
            <td class="cell-actions">
                <a class="btn btn-outline btn-sm" href="magasin.html?u=${encodeURIComponent(p.owner ? p.owner.username : '')}" title="${t('Voir la boutique')}"><i class="fas fa-eye"></i></a>
                <button class="btn btn-outline btn-sm" data-p-edit="${p.id}" title="${t("Modifier l'article (photos, détails, prix…)")}"><i class="fas fa-pen"></i></button>
                <button class="btn btn-outline btn-sm" data-p-toggle="${p.published ? 'hide' : 'show'}" title="${t(p.published ? "Masquer l'article" : "Publier l'article")}"><i class="fas fa-${p.published ? 'eye-slash' : 'check'}"></i></button>
                <button class="btn btn-outline btn-sm danger" data-p-del="${p.id}" title="${t("Supprimer l'article")}"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>`).join('');
    }
    loadShopSelect();

    /* actions sur une ligne : modifier, publier/masquer, supprimer */
    $('#productsTable').addEventListener('click', async e => {
        const row = e.target.closest('tr');
        if (!row || !row.dataset.pid) return;
        const id = row.dataset.pid;
        const title = row.querySelector('.cell-user b').textContent;

        if (e.target.closest('[data-p-edit]')){
            try { admFill(await BE.product(id)); }
            catch (err){ toast('❌ ' + err.message); }
            return;
        }
        if (e.target.closest('[data-p-toggle]')){
            const hide = e.target.closest('[data-p-toggle]').dataset.pToggle === 'hide';
            if (hide && !confirm(t("Masquer l'article « {0} » du site ?\nIl pourra être republié à tout moment.", [title]))) return;
            try {
                await BE.editAsAdmin(id, { published: !hide });
                toast(t(hide ? '🙈 Article masqué.' : '👁️ Article publié.'));
                await refresh();
                loadProducts();
            } catch (err){ toast('❌ ' + err.message); }
            return;
        }
        if (e.target.closest('[data-p-del]')){
            if (!confirm(t("Supprimer définitivement l'article « {0} » ?\nCette action est irréversible.", [title]))) return;
            try {
                await BE.deleteAsAdmin(id);
                toast(t('🗑️ Article supprimé.'));
                if (String(admEditId) === String(id)) admReset();
                await refresh();
                loadProducts();
            } catch (err){ toast('❌ ' + err.message); }
        }
    });

    $('#prodSearch').oninput = e => {
        clearTimeout(searchTimer);
        pQuery.q = e.target.value.trim();
        searchTimer = setTimeout(() => loadProducts().catch(er => toast(er.message)), 300);
    };
    $('#prodCat').onchange = e => { pQuery.cat = e.target.value; loadProducts().catch(er => toast(er.message)); };

    /* ======================================================
       COMMANDES
       ====================================================== */
    async function loadOrders(){
        const list = await BE.adminOrders();
        $('#ordersCountAdmin').textContent = nfmt(list.length) + ' ' + t(list.length > 1 ? 'commandes' : 'commande');
        const body = $('#ordersTable tbody');
        if (!list.length){
            body.innerHTML = `<tr><td colspan="6" class="muted">${t('Aucune commande pour le moment.')}</td></tr>`;
            return;
        }
        body.innerHTML = list.map(o => `<tr>
            <td><b>${o.ref}</b></td>
            <td>${o.buyer ? o.buyer.shopName + ' <span class="muted">@' + o.buyer.username + '</span>' : `<i class="muted">${t('visiteur')}</i>`}</td>
            <td class="muted">${o.items.map(i => nfmt(i.qty) + ' × ' + i.title).join('<br>')}</td>
            <td class="num"><b>${fmt(o.total)}</b></td>
            <td class="muted">${dj(o.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
            <td>
                <select class="status-sel" data-o-status="${o.id}">
                    ${STATUTS.map(s => `<option value="${s}"${s === o.status ? ' selected' : ''}>${t(s)}</option>`).join('')}
                </select>
            </td>
        </tr>`).join('');
    }

    $('#ordersTable').addEventListener('change', async e => {
        const sel = e.target.closest('[data-o-status]');
        if (!sel) return;
        try {
            await BE.setOrderStatus(sel.dataset.oStatus, sel.value);
            toast('✅ ' + t('Statut de la commande mis à jour.'));
        } catch (err){ toast('❌ ' + err.message); }
    });

    /* ---------- rechargement des indicateurs ---------- */
    async function refresh(){
        const d = await BE.overview();
        $('#adminKpis').innerHTML = [
            K('fas fa-users', t('Comptes'), nfmt(d.totals.users), t('+{0} sur 7 jours', [nfmt(d.totals.newUsers7d)])),
            K('fas fa-store', t('Boutiques'), nfmt(d.totals.users), t('{0} administrateur(s)', [nfmt(d.totals.admins)]), 'teal'),
            K('fas fa-box', t('Articles'), nfmt(d.totals.products), t('{0} en alerte', [nfmt(d.totals.lowStock + d.totals.outOfStock)]), 'blue'),
            K('fas fa-heart', t('J\'aime'), nfmt(d.totals.likes), t('tous membres confondus'), 'pink'),
            K('fas fa-receipt', t('Commandes'), nfmt(d.totals.orders), t('+{0} sur 7 jours', [nfmt(d.totals.orders7d)]), 'blue'),
            K('fas fa-coins', t('Chiffre d\'affaires'), fmt(d.totals.revenue), t('Panier moyen {0}', [fmt(d.totals.avgBasket)]), 'green')
        ].join('');
    }
}

function showNoAccess(message){
    $('#noAccess').hidden = false;
    $('#dash').hidden = true;
    if (message) $('#noAccessMsg').textContent = message;
}

/* ==========================================================
   ÉVÉNEMENTS COMMUNS À TOUTES LES PAGES
   ========================================================== */

/* ---------- barre de navigation fixe en bas (téléphones) ---------- */
function buildMobileNav(){
    if (document.getElementById('mnav')) return;
    const page = document.body.dataset.page || 'home';
    const link = (href, ic, label, cls = '') =>
        `<a href="${href}" class="${cls}"><i class="fas ${ic}"></i><span>${label}</span></a>`;
    const on = (page === 'compte' || page === 'publier' || page === 'admin') ? 'is-on' : '';

    const nav = document.createElement('nav');
    nav.className = 'mnav';
    nav.id = 'mnav';
    nav.setAttribute('aria-label', t('Navigation rapide'));
    nav.innerHTML =
        link('index.html', 'fa-house', t('Accueil'), page === 'home' ? 'is-on' : '') +
        `<button type="button" data-mn="cat"><i class="fas fa-layer-group"></i><span>${t('Catégories')}</span></button>` +
        `<button type="button" data-mn="cart"><i class="fas fa-shopping-cart"></i><span>${t('Panier')}</span><span class="mnav-badge" id="mnavCount"></span></button>` +
        link('publier.html', 'fa-square-plus', t('Publier'), 'mn-hide-xs') +
        link('compte.html', 'fa-user', t('Compte'), on);
    document.body.appendChild(nav);
    document.body.classList.add('has-mnav');

    nav.querySelector('[data-mn="cat"]').onclick = () => {
        const sm = $('#sideMenu');
        if (!sm){ location.href = 'tous.html'; return; }
        if (sm.classList.contains('open')) closeAll();
        else { sm.classList.add('open'); if (overlay) overlay.classList.add('show'); }
    };
    nav.querySelector('[data-mn="cart"]').onclick = () => {
        if ($('#cartDrawer')) openCart();
        else location.href = 'index.html';
    };
}

/* ---------- les filtres se replient derrière un bouton sur téléphone ---------- */
function buildFilterToggle(){
    const fs = $('.filters-side');
    if (!fs) return;
    const label = txt => `<i class="fas fa-sliders"></i> ${txt}`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fs-toggle';
    btn.innerHTML = label('Filtres et tris');
    fs.parentNode.insertBefore(btn, fs);
    btn.onclick = () => {
        const open = fs.classList.toggle('fs-open');
        btn.classList.toggle('on', open);
        btn.innerHTML = label(open ? 'Masquer les filtres' : 'Filtres et tris');
    };
}

function initCommon(){
    /* --- menu latéral --- */
    const menuBtn = $('#menuBtn');
    if (menuBtn && $('#sideMenu')){
        menuBtn.onclick = () => { $('#sideMenu').classList.add('open'); overlay.classList.add('show'); };
        $$('#sideMenu a').forEach(a => a.onclick = () => { $('#sideMenu').classList.remove('open'); overlay.classList.remove('show'); });
    }

    if (overlay) overlay.onclick = closeAll;
    const closeCart = $('#closeCart');      if (closeCart) closeCart.onclick = closeAll;
    const modalClose = $('#modalClose');    if (modalClose) modalClose.onclick = closeAll;
    const cartIcon = $('#cartIcon');        if (cartIcon) cartIcon.onclick = e => { e.preventDefault(); openCart(); };
    const checkoutBtn = $('#checkoutBtn');  if (checkoutBtn) checkoutBtn.onclick = checkout;
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

    /* --- délégation : ajout au panier / fiche produit / suppression --- */
    document.addEventListener('click', e => {
        const add = e.target.closest('[data-add]');
        if (add){ e.preventDefault(); e.stopPropagation(); addToCart(add.dataset.add); return; }
        const del = e.target.closest('[data-del]');
        if (del){ e.preventDefault(); removeLine(del.dataset.del); return; }
        const like = e.target.closest('[data-like]');
        if (like){ e.preventDefault(); e.stopPropagation(); toggleLike(like); return; }
        /* plusieurs photos : le clic sur la photo ouvre la visionneuse en grand,
           le clic ailleurs sur la carte ouvre la fiche de l'article */
        const photo = e.target.closest('.gal-stage');
        if (photo && !e.target.closest('button')){
            const box = photo.closest('.p-card');
            const p = box && PRODUCTS.find(x => String(x.id) === String(box.dataset.id));
            if (p && photosOf(p).length > 1){ lightboxFrom(photo); return; }
        }
        const card = e.target.closest('.p-card');
        if (card && !e.target.closest('button')) openModal(card.dataset.id);
    });
    document.addEventListener('change', e => {
        const q = e.target.closest('[data-qty]');
        if (q) setQty(q.dataset.qty, parseInt(q.value, 10));
    });

    initAccountMenu();
    buildMobileNav();
    buildFilterToggle();

    /* --- recherche : sur les pages compte/magasin on renvoie vers le catalogue --- */
    const form = $('#searchForm');
    const page = document.body.dataset.page || 'home';
    if (form && page !== 'home' && page !== 'cat'){
        form.addEventListener('submit', e => {
            e.preventDefault();
            const q = $('#searchInput').value.trim();
            const c = $('#searchCat').value;
            localStorage.setItem('businessenligne_search', JSON.stringify({ q, cat: c }));
            location.href = 'tous.html#tous';
        });
        const sel = $('#searchCat');
        if (sel) sel.onchange = ev => {
            const cat = CATEGORIES.find(x => x.name === ev.target.value);
            if (cat) location.href = cat.file;
        };
    }

    loadCart();
    initLangChange();
}

/* Quand la langue change, le format des prix/dates change aussi :
   on reconstruit le formateur puis on redessine ce qui est à l'écran.
   Seul le rendu est rejoué — les écouteurs ne sont pas réattachés. */
function initLangChange(){
    window.addEventListener('be:lang', () => {
        FC = new Intl.NumberFormat(BE_LOCALE);
        renderCart();
        refreshAccountUI();

        const page = document.body.dataset.page || 'home';
        if (page === 'cat'){
            renderCat();
            renderCatShops();
        } else if (page === 'compte' && typeof refresh === 'function'){
            refresh();
        } else if (page === 'admin'){
            initAdminPage();
        } else if (page === 'home'){
            renderReviews();
            renderAll();
            renderCatShops();
        }
        const modal = $('#modal');
        if (modal && modal.classList.contains('open')){
            const id = modal.dataset.id;
            if (id) openModal(id);
        }
    });
}

function initHome(){
    if (!$('#heroDots')) return;
    /* --- hero carousel --- */
    $('#heroDots').innerHTML = slides.map((_, i) =>
        `<button aria-label="${t('Slide {0}', [String(i + 1)])}"></button>`).join('');
    const jump = i => { goSlide(i); heroStart(); };
    $$('#heroDots button').forEach((b, i) => b.onclick = () => jump(i));
    $('#heroPrev').onclick = () => jump(slide - 1);
    $('#heroNext').onclick = () => jump(slide + 1);
    goSlide(0);

    /* le defilement se met en pause au survol et quand l'onglet est masque */
    const hero = $('#accueil');
    hero.addEventListener('mouseenter', heroStop);
    hero.addEventListener('mouseleave', () => heroStart());
    document.addEventListener('visibilitychange', () => {
        document.hidden ? heroStop() : heroStart();
    });
    heroStart(true);

    /* --- recherche (filtre instantané sur la page) --- */
    $('#searchForm').addEventListener('submit', e => {
        e.preventDefault();
        state.q = $('#searchInput').value.trim();
        state.cat = $('#searchCat').value || 'Toutes';
        renderGrid();
        $('#tous').scrollIntoView({ behavior: 'smooth' });
    });
    let searchTimer;
    $('#searchInput').addEventListener('input', e => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => { state.q = e.target.value.trim(); renderGrid(); }, 300);
    });

    /* --- le menu déroulant de la recherche ouvre la page catégorie --- */
    $('#searchCat').onchange = e => {
        const target = CATEGORIES.find(c => c.name === e.target.value);
        if (target) location.href = target.file;
    };

    $('#sortSel').onchange = e => { state.sort = e.target.value; renderGrid(); };

    /* --- carrousels horizontaux --- */
    $$('[data-scroll]').forEach(b => b.onclick = () => {
        const r = document.getElementById(b.dataset.scroll);
        r.scrollBy({ left: Number(b.dataset.dir) * r.clientWidth * 0.8, behavior: 'smooth' });
    });

    /* --- bouton Prime --- */
    $('#primeBtn').onclick = () => toast('🎉 ' + t('Bienvenue sur Prime ! Livraison offerte dès aujourd\'hui.'));

    /* --- compte à rebours --- */
    const end = Date.now() + 9 * 3600e3 + 24 * 60e3;
    setInterval(() => {
        const d = Math.max(0, end - Date.now());
        $('#cdH').textContent = String(Math.floor(d / 3600e3)).padStart(2, '0');
        $('#cdM').textContent = String(Math.floor(d / 60e3) % 60).padStart(2, '0');
        $('#cdS').textContent = String(Math.floor(d / 1e3) % 60).padStart(2, '0');
    }, 1000);

    /* --- formulaire de contact --- */
    const form = $('#contactForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const rules = [
            ['row-nom', $('#nomClient').value.trim().length >= 2],
            ['row-email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#emailClient').value.trim())],
            ['row-phone', $('#phoneClient').value.replace(/\D/g, '').length >= 10],
            ['row-msg', $('#msgClient').value.trim().length >= 10]
        ];
        let ok = true;
        rules.forEach(([id, valid]) => { $('#' + id).classList.toggle('invalid', !valid); if (!valid) ok = false; });
        if (!ok){ toast('⚠️ Merci de corriger les champs en rouge.'); return; }
        const msgs = JSON.parse(localStorage.getItem('businessenligne_messages') || '[]');
        msgs.push({ nom: $('#nomClient').value.trim(), email: $('#emailClient').value.trim(),
                    tel: $('#phoneClient').value.trim(), msg: $('#msgClient').value.trim(),
                    date: new Date().toISOString() });
        localStorage.setItem('businessenligne_messages', JSON.stringify(msgs));
        form.reset();
        toast('✅ Message envoyé, nous vous répondons sous 24h.');
    });
    $$('#contactForm input, #contactForm textarea').forEach(el =>
        el.addEventListener('input', () => el.closest('.f-row')?.classList.remove('invalid')));

    /* --- reprise d'une recherche envoyée depuis une page catégorie --- */
    const pending = localStorage.getItem('businessenligne_search');
    if (pending){
        try {
            const { q, cat } = JSON.parse(pending);
            if (q || cat){
                state.q = q || '';
                state.cat = cat || 'Toutes';
                $('#searchInput').value = state.q;
                $('#searchCat').value = state.cat;
            }
        } catch (err) {}
        localStorage.removeItem('businessenligne_search');
    }

renderReviews();
    renderAll();
    renderCatShops();
}

let __booted = false;
document.addEventListener('DOMContentLoaded', async () => {
    if (__booted) return;   /* le script ne peut initialiser la page qu'une fois */
    __booted = true;
    initCommon();

    const page = document.body.dataset.page || 'home';

    /* catalogue : API si le serveur tourne, sinon catalogue local */
    const fromApi = await loadFromApi();
    if (fromApi){
        /* les identifiants locaux 'p01' deviennent les id numériques de la base */
        cart = cart.map(l => {
            if (String(l.id).charAt(0) === 'p' && !PRODUCTS.some(p => String(p.id) === String(l.id)))
                return { ...l, id: parseInt(String(l.id).slice(1), 10) };
            return l;
        }).filter(l => PRODUCTS.some(p => String(p.id) === String(l.id)));
        saveCart();
    }

    BE.loadMe().then(refreshAccountUI);

    if (page === 'auth')        initAuthPage();
    else if (page === 'cat')    initCategoryPage();
    else if (page === 'compte') initAccountPage();
    else if (page === 'publier')initPublishPage();
    else if (page === 'magasin')initShopPage();
    else if (page === 'admin')  initAdminPage();
    else                        initHome();
});
