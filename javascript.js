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
        ['Catégorie', p.cat],
        p.owner && p.owner.shopName ? ['Boutique', p.owner.shopName] : null,
        ['Note', t('★ {0} sur 5 · {1} avis', [String(p.rating).replace('.', ','), nfmt(Number(p.reviews || 0))])],
        [t("J'aime"), t(p.likes > 1 ? '{0} personnes' : '{0} personne', [Number(p.likes || 0)])],
        ['Photos', t(photos > 1 ? '{0} photo(s) dans la galerie' : '{0} photo', [photos])],
        ['Disponibilité', p.stock > 0
            ? (p.stock <= 10 ? t('Plus que {0} en stock', [p.stock]) : t('{0} article(s) en stock', [p.stock]))
            : t('Rupture de stock')],
        ['Livraison', t('Gratuite, reçue sous 24 à 48 h à Lubumbashi')],
        ['Paiement', t('Mobile Money, carte bancaire ou espèces à la livraison')],
        p.prime ? ['Livraison Prime', t('Offerte et prioritaire')] : null
    ].filter(Boolean);
    const specs = detailsOf(p);
    infoBox.innerHTML =
        (specs.length
            ? `<h4>Détails de l'article</h4><table><tbody>${specs.map(d =>
                `<tr><th>${esc(d.k)}</th><td>${d.v ? esc(d.v) : '—'}</td></tr>`).join('')}</tbody></table>`
            : '') +
        `<h4>Informations sur l'article</h4><ul class="p-meta">${rows.map(([k, v]) =>
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
        `<img class="gal-slide" src="${safeUrl(u)}" alt="${label} — photo ${i + 1}/${photos.length}"${i ? ' loading="lazy"' : ''}>`).join('');
    return `<div class="gal" data-gal>
            <div class="gal-stage">
                <div class="gal-track">${slides}</div>
                <button type="button" class="gal-btn gal-prev" aria-label="Photo précédente"><i class="fas fa-chevron-left"></i></button>
                <button type="button" class="gal-btn gal-next" aria-label="Photo suivante"><i class="fas fa-chevron-right"></i></button>
                <div class="gal-dots">${photos.map((_, i) =>
                    `<button type="button" class="gal-dot" data-go="${i}" aria-label="Aller à la photo ${i + 1}"></button>`).join('')}</div>
                <span class="gal-count">1/${photos.length}</span>
                <i class="fas fa-expand gal-zoom" aria-hidden="true"></i>
            </div>
            ${opts.thumbs ? `<div class="gal-thumbs">${photos.map((u, i) =>
                `<button type="button" class="gal-thumb" data-go="${i}" aria-label="Voir la photo ${i + 1}"><img src="${safeUrl(u)}" alt=""></button>`).join('')}</div>` : ''}
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
        <div class="lb-box" role="dialog" aria-modal="true" aria-label="Photos de l'article">
            <div class="lb-head">
                <div class="lb-titles">
                    <b class="lb-title"></b>
                    <span class="lb-meta"></span>
                </div>
                <button type="button" class="lb-close" aria-label="Fermer"><i class="fas fa-times"></i></button>
            </div>
            <div class="lb-stage"></div>
            <div class="lb-foot">
                <button type="button" class="btn btn-cta btn-sm lb-sheet"><i class="fas fa-info-circle"></i> Détails de l'article</button>
                <span class="lb-zoom"><i class="fas fa-expand"></i> Photos en grand</span>
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
        `${fmt(p.price)}${p.old ? ` <s>${fmt(p.old)}</s> <em>-${off}%</em>` : ''} · ${p.cat}${p.stock > 0 ? ' · en stock' : ' · rupturé'}`;

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
    const owner = p.owner && p.owner.username !== 'businessenligne'
        ? `<a class="owner-tag" href="magasin.html?u=${encodeURIComponent(p.owner.username)}" onclick="event.stopPropagation()">
               <i class="fas fa-store"></i> <b>${p.owner.shopName}</b>
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
        <div class="p-price">${fmt(p.price)}${p.old ? `<span class="old">${fmt(p.old)}</span><span class="off">-${off}%</span>` : ''}</div>
        <div class="p-extra">${t('ou 3x {0} sans frais', [fmt(Math.round(p.price / 3))])}</div>
        ${p.prime ? `<div class="p-prime"><i class="fas fa-check-circle"></i> ${t('LIVRAISON PRIME')}</div>` : ''}
        ${owner}
        <div class="p-stock ${p.stock <= 10 ? 'low' : ''}">${p.stock <= 10 ? t('Plus que {0} en stock', [p.stock]) : t('En stock')}</div>
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

    if (!window.BE || !BE.isOnline()){ toast('⚠️ J\'aime disponible uniquement avec le serveur (node server.js).'); return; }
    if (!requireLogin('Connectez-vous pour aimer un article')) return;

    btn.disabled = true;
    try {
        const d = await BE.toggleLike(id);
        p.likes = d.likes;
        p.likedByMe = d.liked;
        btn.classList.toggle('on', d.liked);
        btn.querySelector('i').className = d.liked ? 'fas fa-heart' : 'far fa-heart';
        btn.querySelector('.like-nb').textContent = nfmt(Number(d.likes));
        toast(d.liked ? '❤️ Article ajouté à vos J\'aime' : 'J\'aime retiré');
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
            <p><b>Votre panier est vide</b></p>
            <p style="font-size:12px;margin-top:6px">Ajoutez des articles pour commencer.</p>
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
    $('#mPrice').innerHTML = `${fmt(p.price)}${p.old ? `<span class="old">${fmt(p.old)}</span><span class="off">-${off}%</span>` : ''}`;
    $('#mDesc').textContent = p.desc || '';
    /* tableau des détails saisis par le vendeur + infos sur l'article */
    paintInfo(p);
    $('#mList').innerHTML = featsOf(p).map(f => `<li><i class="fas fa-check"></i><span>${esc(f)}</span></li>`).join('');
    $('#mStock').innerHTML = p.stock <= 10
        ? `<span style="color:#b12704">${t('Plus que {0} en stock', [p.stock])}</span>`
        : `<span style="color:#007600">${t('En stock')}</span>`;
    $('#mShip').innerHTML = t('Livraison <b>GRATUITE</b> le <b>{0}</b> à Lubumbashi', [dj(Date.now() + 3 * 864e5, { weekday: 'long', day: 'numeric', month: 'long' })]);
    $('#mBuy').onclick = () => { addToCart(p.id, 1, true); closeAll(); checkout(); };
    $('#mAdd').onclick = () => { addToCart(p.id); closeAll(); };
    $('#modal').classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.classList.add('modal-open');
}

/* ---------------- CHECKOUT ---------------- */
async function checkout(){
    if (!cart.length){ toast('🛒 Votre panier est vide'); return; }
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
            setTimeout(() => toast('📦 Livraison estimée sous 24 à 48h'), 900);
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
    setTimeout(() => toast('📦 Livraison estimée sous 24 à 48h'), 900);
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
function shopCardHTML(s, cat){
    const keep = cat && cat !== 'Toutes' ? '&cat=' + encodeURIComponent(cat) : '';
    const href = 'magasin.html?u=' + encodeURIComponent(s.username) + keep;
    const face = s.avatar
        ? `<img src="${esc(s.avatar)}" alt="" loading="lazy">`
        : esc(String(s.shopName || '?').charAt(0).toUpperCase());
    return `<a class="shop-card" href="${href}">
        <span class="sc-avatar">${face}</span>
        <span class="sc-body">
            <b>${esc(s.shopName || s.username)}</b>
            <span class="sc-meta"><i class="fas fa-map-marker-alt"></i> ${esc(s.shopCity || 'Lubumbashi')}</span>
            <span class="sc-stats">${t('{0} articles', [nfmt(s.productCount)])}${s.likes ? ' · ' + t('{0} J\'aime', [nfmt(s.likes)]) : ''}</span>
            ${s.minPrice != null ? `<span class="sc-price">${t('dès {0}', [fmt(s.minPrice)])}</span>` : ''}
        </span>
    </a>`;
}

/* Liste des boutiques qui vendent dans la catégorie affichée.
   Le bloc reste masqué s'il n'y a aucune boutique à montrer. */
async function renderCatShops(){
    const box = $('#catShops');
    const grid = $('#catShopsGrid');
    if (!box || !grid) return;

    const cat = cstate.cat;
    const title = $('#catShopsTitle');
    if (title) title.textContent = cat === 'Toutes' ? 'Tous les magasins en ligne' : 'Magasins en ligne — ' + cat;

    if (!window.BE){ box.hidden = true; return; }

    grid.innerHTML = '<span class="sh-sk on"></span>'.repeat(8);
    try {
        const all = await BE.shops(cat === 'Toutes' ? { sort: 'products' } : { cat });
        const shops = all.filter(s => s.productCount > 0);
        if (!shops.length){ box.hidden = true; return; }

        box.hidden = false;
        const total = shops.reduce((s, x) => s + x.productCount, 0);
        $('#catShopsCount').innerHTML = t('{0} boutiques proposent {1} articles — cliquez sur une boutique pour voir ses photos et ses prix.',
            [nfmt(shops.length), nfmt(total)]);

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
        if (action) action.textContent = 'Mon compte';
        if (amName) amName.textContent = 'Bonjour, ' + u.username;
        if (amLink){ amLink.textContent = 'Voir mon magasin'; amLink.href = 'magasin.html?u=' + u.username; }
        if (logout) logout.hidden = false;
    } else {
        if (name)   name.textContent = 'Identifiez-vous';
        if (action) action.textContent = 'Créer un compte';
        if (amName) amName.textContent = 'Connectez-vous à votre compte';
        if (amLink){ amLink.textContent = 'Connexion / Inscription'; amLink.href = 'connexion.html'; }
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
                link.innerHTML = '<a id="amAdmin" href="admin.html"><i class="fas fa-chart-line"></i> Tableau de surveillance</a>';
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
        toast('👋 Vous êtes déconnecté.');
        setTimeout(() => location.reload(), 700);
    });
}

/* Redirige vers la connexion si l'utilisateur n'est pas connecté */
function requireLogin(message = 'Connectez-vous pour continuer'){
    if (BE.isLogged()) return true;
    toast('🔒 ' + message);
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

    /* œil afficher / masquer */
    $$('.pwd-eye').forEach(b => b.onclick = () => {
        const inp = $('#' + b.dataset.eye);
        const show2 = inp.type === 'password';
        inp.type = show2 ? 'text' : 'password';
        b.innerHTML = `<i class="far fa-eye${show2 ? '-slash' : ''}"></i>`;
    });

    const mark = (id, valid) => { $('#' + id).classList.toggle('invalid', !valid); return valid; };
    $$('#registerForm input, #registerForm textarea').forEach(el =>
        el.addEventListener('input', () => el.closest('.f-row').classList.remove('invalid')));

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
        if (!ok) return toast('⚠️ Merci de corriger les champs en rouge.');

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création…';
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
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Créer mon compte avec mon email';
            toast('❌ ' + err.message);
            if (err.status === 409){
                const msg = /identifiant/i.test(err.message) ? 'r-username' : 'r-email';
                mark(msg, false);
            }
            if (err.offline) $('#offlineAlert').hidden = false;
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
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion…';
        try {
            const user = await BE.login($('#ident').value.trim(), $('#loginPwd').value);
            toast('👋 Bonjour ' + user.username + ' !');
            const next = new URLSearchParams(location.search).get('next');
            setTimeout(() => { location.href = next || 'compte.html'; }, 800);
        } catch (err){
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-right-to-bracket"></i> Se connecter';
            toast('❌ ' + err.message);
        }
    });

    /* déjà connecté ? */
    BE.loadMe().then(u => {
        if (u){ refreshAccountUI(); toast('👋 Déjà connecté en tant que ' + u.username + '.'); }
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
    $('#shopDesc').textContent = me.shopDesc || 'Vous n\'avez pas encore décrit votre boutique.';
    $('#shopLink').href = 'magasin.html?u=' + encodeURIComponent(me.username);
    $('#setUsername').textContent = '@' + me.username;
    $('#setEmail').textContent = me.email;
    $('#setSince').textContent = new Date(me.createdAt).toLocaleDateString(BE_LOCALE, { day:'numeric', month:'long', year:'numeric' });

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

    /* ---------- profil ---------- */
    $('#pShopName').value = me.shopName;
    $('#pShopDesc').value = me.shopDesc || '';
    $('#pShopCity').value = me.shopCity || '';
    $('#pPhone').value    = me.phone || '';
    $('#pAvatar').value   = me.avatar || '';

    const mark = (id, ok) => { $('#' + id).classList.toggle('invalid', !ok); return ok; };
    $$('#profileForm input, #profileForm textarea').forEach(el =>
        el.addEventListener('input', () => el.closest('.f-row').classList.remove('invalid')));

    $('#profileForm').addEventListener('submit', async e => {
        e.preventDefault();
        const ok =
            mark('p-shopName', $('#pShopName').value.trim().length >= 3) &&
            mark('p-shopDesc', $('#pShopDesc').value.trim().length <= 500) &&
            mark('p-shopCity', $('#pShopCity').value.trim().length >= 2) &&
            mark('p-phone',    $('#pPhone').value.replace(/\D/g, '').length >= 10 || !$('#pPhone').value.trim()) &&
            mark('p-avatar',   !$('#pAvatar').value.trim() || /^https?:\/\/.+\.(png|jpe?g|gif|webp)$/i.test($('#pAvatar').value.trim()));
        if (!ok) return toast('⚠️ Merci de corriger les champs en rouge.');

        try {
            const u = await BE.updateProfile({
                shopName: $('#pShopName').value.trim(),
                shopDesc: $('#pShopDesc').value.trim(),
                shopCity: $('#pShopCity').value.trim(),
                phone:    $('#pPhone').value.trim(),
                avatar:   $('#pAvatar').value.trim()
            });
            refreshAccountUI();
            $('#meShop').textContent = u.shopName;
            $('#meMeta').textContent = `@${u.username} · ${u.shopCity || 'Lubumbashi'}`;
            $('#meAvatar').innerHTML = u.avatar ? `<img src="${u.avatar}" alt="${u.shopName}">` : u.shopName.charAt(0).toUpperCase();
            $('#shopDesc').textContent = u.shopDesc || 'Vous n\'avez pas encore décrit votre boutique.';
            $('#shopLink').href = 'magasin.html?u=' + encodeURIComponent(u.username);
            toast('✅ Boutique mise à jour.');
        } catch (err){ toast('❌ ' + err.message); }
    });

    const out2 = $('#logoutBtn2');
    if (out2) out2.onclick = () => $('#logoutBtn').click();

    /* ---------- mes articles ---------- */
    const renderMyProducts = list => {
        const box = $('#myProducts');
        if (!list.length){
            box.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i>
                <h3>Vous n'avez pas encore publié d'article</h3>
                <p>Ouvrez votre boutique et publiez votre premier article.</p>
                <p style="margin-top:14px"><a class="btn btn-cta" href="publier.html"><i class="fas fa-square-plus"></i> Publier un article</a></p></div>`;
            $('#kpiArticles').textContent = 0;
            return;
        }
        box.innerHTML = list.map(p => {
            const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
            return `<div class="item-row" data-pid="${p.id}">
                <img src="${p.image || 'https://picsum.photos/seed/' + p.id + '/200/200'}" alt="${p.title}">
                <div class="ir-body">
                    <div class="ir-title">${p.title}</div>
                    <div class="ir-meta">
                        ${p.category} · ${fmt(p.price)}${p.oldPrice ? ` <s>${fmt(p.oldPrice)}</s> -${off}%` : ''} · ${p.stock} en stock
                    </div>
                    <div class="ir-meta">
                        <span style="color:#cc0c39;font-weight:700">♥ ${p.likes} J'aime</span> ·
                        publié le ${new Date(p.createdAt).toLocaleDateString(BE_LOCALE)}
                    </div>
                    <div class="ir-actions">
                        <button class="btn btn-outline btn-sm" data-edit="${p.id}"><i class="fas fa-pen"></i> Modifier</button>
                        <button class="btn btn-outline btn-sm" data-del-p="${p.id}"><i class="fas fa-trash-alt"></i> Supprimer</button>
                        <a class="btn btn-outline btn-sm" href="magasin.html?u=${encodeURIComponent(me.username)}"><i class="fas fa-eye"></i> Voir</a>
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
            if (!confirm('Supprimer définitivement cet article ?')) return;
            try {
                await BE.deleteProduct(del.dataset.delP);
                toast('🗑️ Article supprimé.');
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
        $('#likesCount').textContent = list.length + (list.length > 1 ? ' articles' : ' article');
        const box = $('#myLikes');
        if (!list.length){
            box.innerHTML = `<div class="empty-state"><i class="far fa-heart"></i>
                <h3>Aucun J'aime pour l'instant</h3>
                <p>Parcourez le catalogue et aimez les articles qui vous plaisent.</p>
                <p style="margin-top:14px"><a class="btn btn-cta" href="tous.html">Découvrir les produits</a></p></div>`;
            return;
        }
        box.innerHTML = list.map(p => `<div class="item-row" data-pid="${p.id}">
            <img src="${p.image || 'https://picsum.photos/seed/' + p.id + '/200/200'}" alt="${p.title}">
            <div class="ir-body">
                <div class="ir-title">${p.title}</div>
                <div class="ir-meta">${p.category} · ${p.owner ? 'Boutique ' + p.owner.shopName : ''}</div>
                <div class="ir-meta" style="color:#0f1111;font-weight:700;font-size:15px">${fmt(p.price)}</div>
                <div class="ir-actions">
                    <button class="btn-add btn-sm" data-add="${p.id}" style="width:auto;padding:6px 16px"><i class="fas fa-cart-plus"></i> Ajouter au panier</button>
                    <button class="like-btn on" data-like="${p.id}"><i class="fas fa-heart"></i><span class="like-nb">${p.likes}</span></button>
                </div>
            </div>
        </div>`).join('');
    };

    const renderOrders = list => {
        $('#ordersCount').textContent = list.length + (list.length > 1 ? ' commandes' : ' commande');
        const box = $('#myOrders');
        if (!list.length){
            box.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i>
                <h3>Aucune commande</h3><p>Vos commandes validées apparaîtront ici.</p>
                <p style="margin-top:14px"><a class="btn btn-cta" href="tous.html">Commencer mes achats</a></p></div>`;
            return;
        }
        box.innerHTML = list.map(o => `<div class="order-card">
            <div class="oc-top">
                <div>
                    <div class="oc-ref">Commande ${o.ref}</div>
                    <div class="oc-items">${o.items.length} article(s) · ${new Date(o.createdAt).toLocaleDateString(BE_LOCALE, { day:'numeric', month:'long', year:'numeric' })}</div>
                </div>
                <div style="text-align:right">
                    <div style="font-weight:700;font-size:17px">${fmt(o.total)}</div>
                    <span class="badge badge-new" style="position:static;border-radius:3px">${o.status}</span>
                </div>
            </div>
            <div class="oc-items">${o.items.map(i => `${i.qty} × ${i.title}`).join(' · ')}</div>
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
                <img src="${safeUrl(u)}" alt="Photo ${i + 1}">
                ${i === 0 ? '<span class="photo-tag">Principale</span>' : ''}
                <button type="button" class="photo-btn photo-del" data-del="${i}" aria-label="Retirer la photo ${i + 1}"><i class="fas fa-times"></i></button>
                ${i > 0 ? `<button type="button" class="photo-btn photo-set" data-main="${i}" title="Définir comme photo principale"><i class="fas fa-star"></i></button>` : ''}
            </div>`).join('');
        const full = photos.length >= MAX_PHOTOS;
        if (zone){
            zone.classList.toggle('full', full);
            zone.style.display = 'block';
        }
        if (count) count.textContent = photos.length ? `— ${photos.length}/${MAX_PHOTOS}` : '';
        if (hint) hint.textContent = photos.length > 1
            ? 'Astuce : les photos défileront seules dans la galerie de l\'article. La 1re photo sert de photo principale.'
            : '';
    };

    const add = list => {
        const room = MAX_PHOTOS - photos.length;
        if (room <= 0) return toast(`⚠️ ${MAX_PHOTOS} photos maximum par article.`);
        if (list.length > room) toast(`⚠️ Seules ${room} photo(s) ont été ajoutées (maximum ${MAX_PHOTOS}).`);
        photos = photos.concat(list.slice(0, room));
        if (url) url.value = '';
        paint();
    };

    async function send(list){
        if (!requireLogin('Connectez-vous pour envoyer des images')) return;
        const room = MAX_PHOTOS - photos.length;
        if (room <= 0) return toast(`⚠️ ${MAX_PHOTOS} photos maximum par article.`);
        const batch = list.slice(0, room);
        if (zone) zone.classList.add('busy');
        let n = 0;
        try {
            for (const f of batch){
                photos.push(await BE.upload(f));
                n++;
                paint();
            }
            toast(`✅ ${n} photo${n > 1 ? 's envoyée' : ' envoyée'}${batch.length > n ? ` · autres ignorées (${MAX_PHOTOS} max)` : ''}.`);
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
            const list = Array.from(e.dataTransfer.files || []).filter(f => /^image\//.test(f.type));
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
                <input class="detail-k" type="text" value="${esc(d.k)}" maxlength="60" placeholder="Intitulé (ex. Matière)" aria-label="Intitulé du détail ${i + 1}">
                <input class="detail-v" type="text" value="${esc(d.v)}" maxlength="200" placeholder="Valeur (ex. Bois massif)" aria-label="Valeur du détail ${i + 1}">
                <button type="button" class="detail-del" data-del="${i}" aria-label="Supprimer le détail ${i + 1}"><i class="fas fa-times"></i></button>
            </div>`).join('');
        const full = details.length >= MAX_DETAILS;
        if (count) count.textContent = details.length ? `— ${details.length}` : '';
        if (addBtn){
            addBtn.disabled = full;
            addBtn.innerHTML = full
                ? `<i class="fas fa-check"></i> ${MAX_DETAILS} détails maximum`
                : '<i class="fas fa-plus"></i> Ajouter un détail';
        }
    };
    const add = (k, v) => {
        if (details.length >= MAX_DETAILS) return toast(`⚠️ ${MAX_DETAILS} détails maximum par article.`);
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
            `<button type="button" class="dchip" data-chip="${esc(s)}">${esc(s)}</button>`).join('');
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
        $('#pvCount').textContent = list.length + (list.length > 1 ? ' articles publiés' : ' article publié');
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
                return toast('⚠️ Vous ne pouvez modifier que vos propres articles.');
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
            $('#publishBtn').innerHTML = '<i class="fas fa-save"></i> Enregistrer les modifications';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            toast('✏️ Article chargé — modifiez puis enregistrez.');
        }).catch(e => toast('❌ ' + e.message));
    }

    /* ---------- calcul de la remise en direct ---------- */
    const off = $('#vOff');
    const refreshOff = () => {
        const p = parseFloat($('#vPrice').value), o = parseFloat($('#vOldPrice').value);
        if (p > 0 && o > p){
            off.innerHTML = `Soit <b>-${Math.round((1 - p / o) * 100)}%</b> · badge « Promotion » appliqué`;
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
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publication…';
        try {
            if (editingId){
                await BE.editProduct(editingId, payload);
                toast('✅ Article mis à jour.');
            } else {
                await BE.publish(payload);
                toast('🎉 Article publié dans votre magasin !');
            }
            editingId = null;
            photoPicker.clear();
            detailEditor.clear();
            $('#publishForm').reset();
            $('#vStock').value = 10;
            $('#vPrime').checked = true;
            btn.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> Publier dans mon magasin';
            BE.products({ mine: '1' }).then(l => {
                $('#pvCount').textContent = l.length + (l.length > 1 ? ' articles publiés' : ' article publié');
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
            `<div class="crumb" style="padding-bottom:10px"><a href="index.html">Accueil</a> <span>&rsaquo;</span> <b>Magasins en ligne</b></div>
             <div class="box">
                 <div class="box-head">
                     <h3 id="shopsTitle">Tous les magasins en ligne</h3>
                     <span class="sh-tools">
                         <label class="sh-search"><i class="fas fa-search"></i>
                             <input type="search" id="shopsQuery" placeholder="Rechercher une boutique" autocomplete="off"></label>
                         <select class="sh-sort" id="shopsSort">
                             <option value="products">Plus d'articles</option>
                             <option value="likes">Plus de J'aime</option>
                             <option value="name">Nom (A-Z)</option>
                             <option value="recent">Plus récentes</option>
                         </select>
                     </span>
                 </div>
                 <p class="sh-intro" id="shopsIntro"></p>
                 <div id="shopsList" class="shop-grid"></div>
             </div>`;

        $('#shopsTitle').textContent = wantedCat === 'Toutes' ? 'Tous les magasins en ligne' : 'Magasins en ligne — ' + wantedCat;
        $('#shopsList').innerHTML = '<span class="sh-sk on"></span>'.repeat(8);

        const query  = $('#shopsQuery');
        const sorter = $('#shopsSort');
        const paint = async () => {
            const q = query.value.trim();
            try {
                const params2 = { sort: sorter.value };
                if (wantedCat !== 'Toutes') params2.cat = wantedCat;
                if (q) params2.q = q;
                const all = await BE.shops(params2);
                const list = all.filter(s => s.productCount > 0 || wantedCat === 'Toutes');
                $('#shopsIntro').textContent = list.length
                    ? `${list.length} boutique${list.length > 1 ? 's' : ''} — cliquez pour voir les photos, les prix et les articles publiés.`
                    : '';
                $('#shopsList').innerHTML = list.length
                    ? list.map(s => shopCardHTML(s, wantedCat)).join('')
                    : `<div class="empty-state" style="grid-column:1/-1">
                           <i class="fas fa-store"></i><h3>Aucune boutique</h3>
                           <p>Aucune boutique ne correspond à cette recherche.</p>
                           <p style="margin-top:12px"><a class="btn btn-outline" href="publier.html">Créer ma boutique</a></p>
                       </div>`;
            } catch (err){
                $('#shopsList').innerHTML = `<div class="alert alert-err" style="grid-column:1/-1">
                    <i class="fas fa-triangle-exclamation"></i><div><b>${esc(err.message)}</b></div></div>`;
            }
        };
        let t;
        query.addEventListener('input', () => { clearTimeout(t); t = setTimeout(paint, 250); });
        sorter.addEventListener('change', paint);
        await paint();
        return;
    }

    try {
        const { shop, products } = await BE.shop(username);
        $('#shopHeader').hidden = false;
        $('#shopBody').hidden = false;

        /* la catégorie d'origine (arrivee depuis une page catégorie) est
           pré-sélectionnée, et le fil d'Ariane la rappelle. */
        const startCat = products.some(p => p.cat === wantedCat) && wantedCat !== 'Toutes' ? wantedCat : 'Toutes';
        document.title = shop.shopName + (startCat === 'Toutes' ? '' : ' — ' + startCat) + ' — BusinessEnLigne';
        const crumb = document.querySelector('.container > .crumb');
        if (crumb){
            const b = crumb.querySelector('b');
            if (b) b.textContent = shop.shopName + (startCat === 'Toutes' ? '' : ' — ' + startCat);
        }

        $('#shName').textContent = shop.shopName;
        $('#shMeta').textContent = `@${shop.username} · ${shop.productCount} article(s) · ${shop.shopCity || 'Lubumbashi'}`;
        $('#shDesc').textContent = shop.shopDesc || 'Cette boutique n\'a pas encore de description.';
        $('#shArticles').textContent = shop.productCount;
        $('#shLikes').textContent = shop.likes;
        $('#shSince').textContent = new Date(shop.createdAt).getFullYear();
        $('#shAvatar').innerHTML = shop.avatar
            ? `<img src="${shop.avatar}" alt="${shop.shopName}">`
            : shop.shopName.charAt(0).toUpperCase();
        if (shop.banner) $('#shBanner').src = shop.banner;
        if (BE.user() && BE.user().username === shop.username) $('#shPublish').hidden = false;

        /* « Suivre » = j'aime la boutique, comme sur les réseaux */
        const follow = $('#followBtn');
        const followed = PRODUCTS.some(p => p.likedByMe && p.owner && p.owner.username === shop.username);
        const paint = on => {
            follow.innerHTML = on ? '<i class="fas fa-heart"></i> Vous suivez' : '<i class="far fa-heart"></i> Suivre';
            follow.style.background = on ? '#fff1f1' : '';
            follow.style.borderColor = on ? '#ffafcb' : '';
            follow.style.color = on ? '#cc0c39' : '';
        };
        paint(followed);
        follow.onclick = async () => {
            if (!requireLogin('Connectez-vous pour suivre une boutique')) return;
            const mine = PRODUCTS.filter(p => p.owner && p.owner.username === shop.username);
            if (!mine.length) return toast('Aucun article à aimer pour le moment.');
            try {
                for (const p of mine) await BE.toggleLike(p.id);
                toast(followed ? 'Vous ne suivez plus cette boutique.' : 'Vous suivez cette boutique !');
                location.reload();
            } catch (err){ toast('❌ ' + err.message); }
        };

        /* filtres par catégorie */
        const cats = ['Toutes', ...new Set(products.map(p => p.cat))];
        const paintChips = active => {
            $('#shopFilters').innerHTML = cats.map(c =>
                `<a href="#" class="chip ${c === active ? 'active' : ''}" data-sc="${c}">${c === 'Toutes' ? 'Tous les articles' : c}</a>`).join('');
        };
        const paintGrid = cat => {
            const list = products.map(normalize).filter(p => cat === 'Toutes' || p.cat === cat);
            $('#shCount').textContent = list.length + (list.length > 1 ? ' articles' : ' article');
            $('#shopGrid').innerHTML = list.length
                ? list.map(cardHTML).join('')
                : `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-box-open"></i><h3>Aucun article ici</h3></div>`;
            initGalleries($('#shopGrid'));
        };
        $('#shopFilters').addEventListener('click', e => {
            const c = e.target.closest('[data-sc]');
            if (!c) return;
            e.preventDefault();
            paintChips(c.dataset.sc);
            paintGrid(c.dataset.sc);
        });
        paintChips(startCat);
        paintGrid(startCat);

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
    show(TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'apercu');

    /* ======================================================
       UTILISATEURS
       ====================================================== */
    const uQuery = { q: '', sort: 'recent' };
    let userTimer;

    async function loadUsers(){
        const list = await BE.adminUsers(uQuery);
        $('#usersCount').textContent = list.length + (list.length > 1 ? ' comptes' : ' compte');
        const body = $('#usersTable tbody');
        if (!list.length){
            body.innerHTML = '<tr><td colspan="10" class="muted">Aucun compte ne correspond à la recherche.</td></tr>';
            return;
        }
        body.innerHTML = list.map(u => `<tr${u.banned ? ' class="row-banned"' : ''}>
            <td>
                <div class="cell-user">
                    <div class="avatar xs">${u.avatar ? `<img src="${u.avatar}" alt="">` : u.shopName.charAt(0).toUpperCase()}</div>
                    <div>
                        <b>${u.shopName}</b>
                        <span>@${u.username}${u.isAdmin ? ' <i class="tag-admin">admin</i>' : ''}${u.banned ? ' <i class="tag-out">suspendu</i>' : ''}</span>
                    </div>
                </div>
            </td>
            <td class="muted">${u.email}</td>
            <td>${u.shopCity || '—'}</td>
            <td class="num">${u.productCount}</td>
            <td class="num">${u.likesReceived}</td>
            <td class="num">${u.sales || 0}</td>
            <td class="num"><b>${fmt(u.revenue)}</b></td>
            <td class="num muted">${fmt(u.spent)}</td>
            <td class="muted">${new Date(u.createdAt).toLocaleDateString(BE_LOCALE)}</td>
            <td class="cell-actions">
                <a class="btn btn-outline btn-sm" href="magasin.html?u=${encodeURIComponent(u.username)}" title="Voir la boutique"><i class="fas fa-eye"></i></a>
                <button class="btn btn-outline btn-sm" data-u-admin="${u.id}" title="${u.isAdmin ? 'Retirer le rôle admin' : 'Nommer administrateur'}"><i class="fas fa-shield-halved"></i></button>
                <button class="btn btn-outline btn-sm" data-u-ban="${u.id}" title="${u.banned ? 'Réactiver le compte' : 'Suspendre le compte'}"><i class="fas ${u.banned ? 'fa-unlock' : 'fa-ban'}"></i></button>
                <button class="btn btn-outline btn-sm danger" data-u-del="${u.id}" title="Supprimer le compte"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>`).join('');
    }

    $('#usersTable').addEventListener('click', async e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.dataset.uAdmin || btn.dataset.uBan || btn.dataset.uDel;
        if (!id) return;
        const row = btn.closest('tr');
        const name = row.querySelector('.cell-user b').textContent;

        try {
            if (btn.dataset.uAdmin){
                const on = btn.querySelector('i').classList.contains('fa-shield-halved');
                await BE.patchUser(id, { isAdmin: !on });
                toast('Rôle administrateur mis à jour.');
            } else if (btn.dataset.uBan){
                const ban = btn.querySelector('i').classList.contains('fa-ban');
                if (ban && !confirm(`Suspendre le compte « ${name} » ? Il sera déconnecté et ne pourra plus se connecter.`)) return;
                if (!ban && !confirm(`Réactiver le compte « ${name} » ?`)) return;
                await BE.patchUser(id, { banned: ban });
                toast(ban ? 'Compte suspendu.' : 'Compte réactivé.');
            } else {
                if (!confirm(`Supprimer définitivement « ${name} », ses articles et ses commandes ?`)) return;
                await BE.deleteUser(id);
                toast('🗑️ Compte supprimé.');
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
            ? '<i class="fas fa-chevron-up"></i> Masquer le formulaire'
            : '<i class="fas fa-chevron-down"></i> Afficher le formulaire';
    };
    $('#admFormToggle').onclick = () => showForm($('#admForm').hidden);
    showForm(false);

    /* la liste des boutiques sert de destinataire pour un nouvel article */
    async function loadShopSelect(){
        const sel = $('#aOwner');
        try {
            const { shops } = await BE.shops();
            sel.innerHTML = shops.map(s =>
                `<option value="${s.id}" data-username="${esc(s.username)}">${esc(s.shopName)} · @${esc(s.username)} (${s.productCount})</option>`).join('');
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
        $('#admFormTitle').innerHTML = '<i class="fas fa-square-plus" style="color:#ff9900"></i> Ajouter un article publié';
        $('#aSave').innerHTML = '<i class="fas fa-cloud-arrow-up"></i> Publier l\'article';
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
        $('#admFormTitle').innerHTML = `<i class="fas fa-pen" style="color:#ff9900"></i> Modifier l'article #${p.id}`;
        $('#aSave').innerHTML = '<i class="fas fa-save"></i> Enregistrer les modifications';
        $('#admFormCancel').hidden = false;
        showForm(true);
        $('#admFormBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast('✏️ Article chargé — modifiez puis enregistrez.');
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
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement…';
        try {
            if (admEditId){
                await BE.editAsAdmin(admEditId, payload);
                toast('✅ Article mis à jour.');
            } else {
                await BE.adminPublish(payload);
                toast('🎉 Article publié sur la plateforme.');
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
        $('#productsCount').textContent = list.length + (list.length > 1 ? ' articles' : ' article');
        const body = $('#productsTable tbody');
        if (!list.length){
            body.innerHTML = '<tr><td colspan="8" class="muted">Aucun article ne correspond à la recherche.</td></tr>';
            return;
        }
        body.innerHTML = list.map(p => `<tr data-pid="${p.id}"${p.stock === 0 ? ' class="row-banned"' : ''}>
            <td>
                <div class="cell-user">
                    <img class="thumb" src="${safeUrl(p.image) || 'https://picsum.photos/seed/' + p.id + '/80/80'}" alt="">
                    <div><b>${esc(p.title)}</b><span>#${p.id} · ${(p.images || []).length} photo(s)</span></div>
                </div>
            </td>
            <td>${p.owner ? esc(p.owner.shopName) : '—'}</td>
            <td>${esc(p.cat)}</td>
            <td class="num"><b>${fmt(p.price)}</b>${p.oldPrice ? `<br><s class="muted">${fmt(p.oldPrice)}</s>` : ''}</td>
            <td class="num">${p.stock === 0 ? '<i class="tag-out">Rupture</i>' : p.stock <= 3 ? `<i class="tag-low">${p.stock}</i>` : p.stock}</td>
            <td class="num"><i class="fas fa-heart" style="color:#cc0c39"></i> ${p.likes}</td>
            <td>
                ${p.published ? '<i class="tag-admin">Publié</i>' : '<i class="tag-out">Masqué</i>'}
                <br><span class="muted" style="font-size:11px">${new Date(p.createdAt).toLocaleDateString(BE_LOCALE)}</span>
            </td>
            <td class="cell-actions">
                <a class="btn btn-outline btn-sm" href="magasin.html?u=${encodeURIComponent(p.owner ? p.owner.username : '')}" title="Voir la boutique"><i class="fas fa-eye"></i></a>
                <button class="btn btn-outline btn-sm" data-p-edit="${p.id}" title="Modifier l'article (photos, détails, prix…)"><i class="fas fa-pen"></i></button>
                <button class="btn btn-outline btn-sm" data-p-toggle="${p.published ? 'hide' : 'show'}" title="${p.published ? 'Masquer l\'article' : 'Publier l\'article'}"><i class="fas fa-${p.published ? 'eye-slash' : 'check'}"></i></button>
                <button class="btn btn-outline btn-sm danger" data-p-del="${p.id}" title="Supprimer l'article"><i class="fas fa-trash-alt"></i></button>
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
            if (hide && !confirm(`Masquer l'article « ${title} » du site ?\nIl pourra être republié à tout moment.`)) return;
            try {
                await BE.editAsAdmin(id, { published: !hide });
                toast(hide ? '🙈 Article masqué.' : '👁️ Article publié.');
                await refresh();
                loadProducts();
            } catch (err){ toast('❌ ' + err.message); }
            return;
        }
        if (e.target.closest('[data-p-del]')){
            if (!confirm(`Supprimer définitivement l'article « ${title} » ?\nCette action est irréversible.`)) return;
            try {
                await BE.deleteAsAdmin(id);
                toast('🗑️ Article supprimé.');
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
        $('#ordersCountAdmin').textContent = list.length + (list.length > 1 ? ' commandes' : ' commande');
        const body = $('#ordersTable tbody');
        if (!list.length){
            body.innerHTML = '<tr><td colspan="6" class="muted">Aucune commande pour le moment.</td></tr>';
            return;
        }
        body.innerHTML = list.map(o => `<tr>
            <td><b>${o.ref}</b></td>
            <td>${o.buyer ? o.buyer.shopName + ' <span class="muted">@' + o.buyer.username + '</span>' : '<i class="muted">visiteur</i>'}</td>
            <td class="muted">${o.items.map(i => i.qty + ' × ' + i.title).join('<br>')}</td>
            <td class="num"><b>${fmt(o.total)}</b></td>
            <td class="muted">${new Date(o.createdAt).toLocaleDateString(BE_LOCALE, { day:'numeric', month:'short', year:'numeric' })}</td>
            <td>
                <select class="status-sel" data-o-status="${o.id}">
                    ${STATUTS.map(s => `<option${s === o.status ? ' selected' : ''}>${s}</option>`).join('')}
                </select>
            </td>
        </tr>`).join('');
    }

    $('#ordersTable').addEventListener('change', async e => {
        const sel = e.target.closest('[data-o-status]');
        if (!sel) return;
        try {
            await BE.setOrderStatus(sel.dataset.oStatus, sel.value);
            toast('Statut de la commande mis à jour.');
        } catch (err){ toast('❌ ' + err.message); }
    });

    /* ---------- rechargement des indicateurs ---------- */
    async function refresh(){
        const d = await BE.overview();
        $('#adminKpis').innerHTML = [
            K('fas fa-users', 'Comptes', nfmt(d.totals.users), `+${d.totals.newUsers7d} sur 7 jours`),
            K('fas fa-store', 'Boutiques', nfmt(d.totals.users), `${d.totals.admins} administrateur(s)`, 'teal'),
            K('fas fa-box', 'Articles', nfmt(d.totals.products), `${d.totals.lowStock + d.totals.outOfStock} en alerte`, 'blue'),
            K('fas fa-heart', 'J\'aime', nfmt(d.totals.likes), 'tous membres confondus', 'pink'),
            K('fas fa-receipt', 'Commandes', nfmt(d.totals.orders), `+${d.totals.orders7d} sur 7 jours`, 'blue'),
            K('fas fa-coins', 'Chiffre d\'affaires', fmt(d.totals.revenue), `Panier moyen ${fmt(d.totals.avgBasket)}`, 'green')
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
    nav.setAttribute('aria-label', 'Navigation rapide');
    nav.innerHTML =
        link('index.html', 'fa-house', 'Accueil', page === 'home' ? 'is-on' : '') +
        '<button type="button" data-mn="cat"><i class="fas fa-layer-group"></i><span>Catégories</span></button>' +
        '<button type="button" data-mn="cart"><i class="fas fa-shopping-cart"></i><span>Panier</span><span class="mnav-badge" id="mnavCount"></span></button>' +
        link('publier.html', 'fa-square-plus', 'Publier', 'mn-hide-xs') +
        link('compte.html', 'fa-user', 'Compte', on);
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
            const t = CATEGORIES.find(x => x.name === ev.target.value);
            if (t) location.href = t.file;
        };
    }

    loadCart();
}

function initHome(){
    if (!$('#heroDots')) return;
    /* --- hero carousel --- */
    $('#heroDots').innerHTML = slides.map((_, i) =>
        `<button aria-label="Slide ${i + 1}"></button>`).join('');
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
    $('#primeBtn').onclick = () => toast('🎉 Bienvenue sur Prime ! Livraison offerte dès aujourd\'hui.');

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
        el.addEventListener('input', () => el.closest('.f-row').classList.remove('invalid')));

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
