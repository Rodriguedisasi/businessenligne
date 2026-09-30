/* ==========================================================
   CATALOGUE OFFICIEL — données insérées en base au premier
   démarrage du serveur (propriétaire : boutique BusinessEnLigne)
   ========================================================== */
const OFFICIAL_SHOP = {
    username: 'businessenligne',
    email: 'rodriguedisasi15@gmail.com',
    shopName: 'BusinessEnLigne Officiel',
    shopDesc: 'Boutique officielle : électronique, mode, maison, sport, beauté, enfants et livres. Livraison partout en RDC.',
    city: 'Lubumbashi',
    phone: '+243 997 555 148'
};

/* [titre, catégorie, prix, ancien prix, stock, badge, prime, note, avis,
    description, détails] — les détails sont des paires { k, v } affichées
   dans la fiche de l'article (matière, dimensions, garantie…). */
const CATALOGUE = [
    ['Smartphone Nova X20 256Go 5G', 'Électronique', 250000, 320000, 12, 'deal', 1, 4.6, 1284,
        "Écran AMOLED 6,7 pouces, caméra 108 Mpx, batterie 5000 mAh et charge rapide 65 W.",
        [
            { k: 'Marque', v: 'Nova' },
            { k: 'Écran', v: 'AMOLED 6,7 pouces' },
            { k: 'Stockage', v: '256 Go' },
            { k: 'RAM', v: '12 Go' },
            { k: 'Batterie', v: '5000 mAh' },
            { k: 'Caméra', v: '108 Mpx + 8 Mpx + 2 Mpx' },
            { k: 'Réseau', v: '5G' },
            { k: 'Garantie', v: '12 mois' }
        ]],
    ['Écouteurs sans fil Pro ANC', 'Électronique', 45000, 78000, 40, 'best', 1, 4.4, 2310,
        "Réduction de bruit active, 30 h d'autonomie, Bluetooth 5.3 et boîtier de charge.",
        [
            { k: 'Marque', v: 'Pro Audio' },
            { k: 'Réduction de bruit', v: 'Active (ANC)' },
            { k: 'Autonomie', v: "30 h avec le boîtier" },
            { k: 'Bluetooth', v: '5.3' },
            { k: 'Étanchéité', v: 'IPX5' },
            { k: 'Accessoires', v: "Boîtier de charge, 3 tailles d'embouts" },
            { k: 'Garantie', v: '6 mois' }
        ]],
    ['Montre connectée Fit Pro', 'Électronique', 89900, 120000, 8, 'best', 1, 4.5, 876,
        "Écran AMOLED 1,9 pouce, suivi du sommeil, GPS intégré et 14 jours d'autonomie.",
        [
            { k: 'Marque', v: 'Fit' },
            { k: 'Écran', v: 'AMOLED 1,9 pouce' },
            { k: 'Capteurs', v: 'Cardiofréquence, SpO2, GPS' },
            { k: 'Autonomie', v: '14 jours' },
            { k: 'Étanchéité', v: '5 ATM' },
            { k: 'Bracelet', v: 'Silicone réglable 15-22 cm' }
        ]],
    ['Tablette Ultra 11" 128Go', 'Électronique', 320000, 410000, 5, '', 1, 4.3, 512,
        "Tablette 11 pouces, 4 Go de RAM, stylet inclus et clavier détachable.",
        [
            { k: 'Écran', v: '11 pouces 2K' },
            { k: 'RAM', v: '4 Go' },
            { k: 'Stockage', v: '128 Go' },
            { k: 'Connectivité', v: 'Wi-Fi 6' },
            { k: 'Batterie', v: '8000 mAh' },
            { k: 'Accessoires', v: 'Stylet + clavier détachable' },
            { k: 'Garantie', v: '12 mois' }
        ]],
    ['Enceinte Bluetooth Bass 40W', 'Électronique', 37500, null, 27, 'new', 1, 4.2, 934,
        "Son puissant de 40 W, étanchéité IPX7 et 20 heures d'autonomie.",
        [
            { k: 'Puissance', v: '40 W' },
            { k: 'Étanchéité', v: 'IPX7' },
            { k: 'Autonomie', v: '20 h' },
            { k: 'Bluetooth', v: '5.3' },
            { k: 'Appairage', v: 'Stéréo entre deux enceintes' },
            { k: 'Batterie', v: 'Rechargeable 6000 mAh' }
        ]],
    ['Chargeur rapide GaN 65W', 'Électronique', 18500, 26000, 65, '', 0, 4.7, 3120,
        "Technologie GaN, 3 ports, compatible smartphone et ordinateur portable.",
        [
            { k: 'Puissance', v: '65 W' },
            { k: 'Ports', v: '2 USB-C + 1 USB-A' },
            { k: 'Technologie', v: 'GaN' },
            { k: 'Câble', v: 'USB-C 1 m inclus' },
            { k: 'Protection', v: 'Surchauffe et surtension' },
            { k: 'Garantie', v: '12 mois' }
        ]],
    ['Webcam HD 1080p avec micro', 'Électronique', 32000, null, 19, 'new', 0, 4.1, 428,
        "Capteur 1080p, autofocus, micro à réduction de bruit et support universel.",
        [
            { k: 'Définition', v: '1080p 30 ips' },
            { k: 'Capteur', v: 'CMOS 2 MP' },
            { k: 'Mise au point', v: 'Autofocus' },
            { k: 'Micro', v: 'Réduction de bruit intégrée' },
            { k: 'Fixation', v: 'Clip universel + trépied' }
        ]],
    ['Clavier mécanique RGB', 'Électronique', 58000, 74000, 14, 'deal', 1, 4.5, 655,
        "Switches mécaniques, rétroéclairage RGB et châssis aluminium.",
        [
            { k: 'Type', v: 'Mécanique 87 touches' },
            { k: 'Touches', v: 'Membrane simulée (bleu)' },
            { k: 'Rétroéclairage', v: 'RGB par touche' },
            { k: 'Châssis', v: 'Aluminium' },
            { k: 'Connexion', v: 'USB détachable' },
            { k: 'Format', v: 'AZERTY complet' }
        ]],

    ['Chemise homme slim casual', 'Mode', 32500, 48000, 33, 'deal', 0, 4.3, 742,
        "Coton premium, coupe slim, entretien facile. 6 coloris disponibles.",
        [
            { k: 'Matière', v: '100 % coton' },
            { k: 'Coupe', v: 'Slim' },
            { k: 'Coloris', v: 'Blanc, noir, bleu, vert, gris, bordeaux' },
            { k: 'Tailles', v: 'M à XXL' },
            { k: 'Col', v: 'Tricoté boutonné' },
            { k: 'Lavage', v: 'Machine 30 °C' }
        ]],
    ['Sneakers running légères', 'Mode', 78500, 105000, 22, 'best', 1, 4.6, 1893,
        "Semelle amortissante, tige respirante, très légères pour la course urbaine.",
        [
            { k: 'Usage', v: 'Running urbain' },
            { k: 'Pointures', v: '38 à 46' },
            { k: 'Semelle', v: 'Amortissante 3 cm' },
            { k: 'Tige', v: 'Mesh respirant' },
            { k: 'Fermeture', v: 'Lacets' },
            { k: 'Poids', v: '240 g (taille 42)' }
        ]],
    ['Blazer élégant coupe droite', 'Mode', 120000, null, 9, 'new', 0, 4.4, 412,
        "Mélange de laine, coupe droite, l'allié idéal pour le bureau.",
        [
            { k: 'Matière', v: '60 % laine, 40 % polyester' },
            { k: 'Coupe', v: 'Droite' },
            { k: 'Boutons', v: '2' },
            { k: 'Doublure', v: 'Satin' },
            { k: 'Poches', v: '2 à rabat' },
            { k: 'Tailles', v: '46 à 56' },
            { k: 'Entretien', v: 'Nettoyage à sec' }
        ]],
    ['Sac à dos urbain 20L', 'Mode', 55000, 69000, 26, '', 0, 4.5, 1108,
        "Compartiment matelasé pour ordinateur 15,6 pouces, tissu imperméable.",
        [
            { k: 'Capacité', v: '20 L' },
            { k: 'Ordinateur', v: 'Compartiment 15,6 pouces' },
            { k: 'Matière', v: 'Polyester imperméable' },
            { k: 'Port', v: 'USB externe' },
            { k: 'Poches', v: '3 (frontale + latérales)' },
            { k: 'Bandes', v: 'Réflectissantes' }
        ]],
    ['Lunettes de soleil polarisées', 'Mode', 28900, 45000, 48, 'deal', 0, 4.2, 634,
        "Verres polarisés UV400, monture légère, étui rigide inclus.",
        [
            { k: 'Protection', v: 'UV400' },
            { k: 'Verres', v: 'Polarisés' },
            { k: 'Monture', v: 'Acétate légère' },
            { k: 'Accessoires', v: 'Étui rigide + chiffon' },
            { k: 'Genre', v: 'Mixte' }
        ]],
    ['Jean slim premium stretch', 'Mode', 49800, 65000, 31, 'best', 0, 4.4, 921,
        "Denim stretch, taille ajustée et 5 poches renforcées.",
        [
            { k: 'Matière', v: '98 % coton, 2 % élasthanne' },
            { k: 'Coupe', v: 'Slim' },
            { k: 'Poches', v: '5 renforcées' },
            { k: 'Fermeture', v: 'Boutons rivetés' },
            { k: 'Tailles', v: '28 à 40' },
            { k: 'Lavage', v: 'Machine 30 °C' }
        ]],
    ['Robe droite imprimée été', 'Mode', 37500, null, 17, 'new', 0, 4.1, 288,
        "Viscose légère, motif exclusif, parfaite pour les journées chaudes.",
        [
            { k: 'Matière', v: 'Viscose' },
            { k: 'Motif', v: 'Exclusif saison' },
            { k: 'Coupe', v: 'Droite' },
            { k: 'Doublure', v: 'Intégrale' },
            { k: 'Tailles', v: 'S à XL' },
            { k: 'Entretien', v: 'Lavage à la main' }
        ]],

    ['Cafetière à piston 1L', 'Maison', 42000, 58000, 24, 'deal', 0, 4.5, 820,
        "Verre borosilicate, plaque chauffante et facile à nettoyer.",
        [
            { k: 'Contenance', v: '1 litre' },
            { k: 'Verre', v: 'Borosilicate résistant à la chaleur' },
            { k: 'Plaque', v: 'Chauffante, 2 niveaux' },
            { k: 'Poignée', v: 'Isolante' },
            { k: 'Compatible', v: 'Café moulu, thé, infusions' },
            { k: 'Pièces', v: 'Filtre, presse, graduation' }
        ]],
    ['Lampe de chevet LED rotative', 'Maison', 21500, null, 55, 'new', 0, 4.3, 377,
        "3 températures de lumière, bras orientable et variateur d'intensité.",
        [
            { k: 'Températures', v: '3 (chaud, neutre, froid)' },
            { k: 'Variateur', v: 'Tactile' },
            { k: 'Bras', v: 'Orientable 360°' },
            { k: 'Puissance', v: '6 W LED' },
            { k: 'Port', v: 'USB en sortie' },
            { k: 'Alimentation', v: 'Adaptateur inclus' }
        ]],
    ['Set literie coton 4 pièces', 'Maison', 62000, 85000, 15, 'best', 0, 4.4, 512,
        "Coton 100 %, 200 fils, hypoallergénique et lavable en machine.",
        [
            { k: 'Contenu', v: '4 pièces' },
            { k: 'Matière', v: 'Coton 100 %' },
            { k: 'Tissage', v: '200 fils' },
            { k: 'Détail', v: '1 housse de couette, 1 drap housse, 2 draps' },
            { k: 'Taille', v: '160 × 200 cm' },
            { k: 'Lavage', v: 'Machine 60 °C' }
        ]],
    ['Set 6 verreries incassables', 'Maison', 28000, null, 38, '', 0, 4.2, 264,
        "Verre trempé incassable, 400 ml chaque, passe au lave-vaisselle.",
        [
            { k: 'Contenu', v: '6 verres' },
            { k: 'Contenance', v: '400 ml par verre' },
            { k: 'Matière', v: 'Trempé incassable' },
            { k: 'Lave-vaisselle', v: 'Oui' },
            { k: 'Pied', v: 'Anti-glissant' },
            { k: 'Design', v: 'Moderne' }
        ]],

    ['Tapis de yoga antidérapant 6mm', 'Sport', 24000, 36000, 44, 'deal', 0, 4.6, 1120,
        "Matériau TPE ecology, antidérapant, sac de transport inclus.",
        [
            { k: 'Épaisseur', v: '6 mm' },
            { k: 'Matière', v: 'TPE ecology' },
            { k: 'Antidérapant', v: 'Double face' },
            { k: 'Dimensions', v: '183 × 61 cm' },
            { k: 'Accessoires', v: 'Sac de transport' },
            { k: 'Poids', v: '1 kg' }
        ]],
    ['Haltères réglables 2x20kg', 'Sport', 135000, 175000, 11, 'best', 1, 4.5, 341,
        "Disques en fonte, poignées antidérapantes et 4 réglages de charge.",
        [
            { k: 'Charge', v: '2 × 20 kg (40 kg la paire)' },
            { k: 'Disques', v: 'Fonte' },
            { k: 'Réglages', v: '4 positions' },
            { k: 'Poignées', v: 'Crantées antidérapantes' },
            { k: 'Barre', v: 'Acier 1,35 m' },
            { k: 'Rangement', v: 'Plateau + pinces' }
        ]],
    ['Ballon de basket cuiriel', 'Sport', 29500, null, 29, 'new', 0, 4.3, 498,
        "Cuir synthétique, valve BUTIQ, taille 7 officielle.",
        [
            { k: 'Taille', v: '7 (officielle)' },
            { k: 'Matière', v: 'Cuir synthétique' },
            { k: 'Valve', v: 'BUTIQ' },
            { k: 'Diamètre', v: '24 cm' },
            { k: 'Usage', v: 'Extérieur et intérieur' }
        ]],

    ['Sèche-cheveux ionique 2200W', 'Beauté', 58000, 76000, 21, 'best', 0, 4.4, 876,
        "Technologie ionique, 3 niveaux de chaleur, 2 vitesses et diffuseur.",
        [
            { k: 'Puissance', v: '2200 W' },
            { k: 'Technologie', v: 'Ionique anti-statique' },
            { k: 'Chaleur', v: '3 niveaux' },
            { k: 'Vitesse', v: '2' },
            { k: 'Accessoires', v: 'Diffuseur + buse concentrateur' },
            { k: 'Sécurité', v: 'Arrêt automatique' }
        ]],
    ['Sérum visage acide hyaluronique', 'Beauté', 34500, 52000, 36, 'deal', 0, 4.7, 1420,
        "Acide hyaluronique et vitamine C, 30 ml, peau hydratée en 7 jours.",
        [
            { k: 'Contenance', v: '30 ml' },
            { k: 'Actifs', v: 'Acide hyaluronique + vitamine C' },
            { k: 'Peaux', v: 'Mixtes à sèches' },
            { k: 'Résultats', v: 'Hydratation visible en 7 jours' },
            { k: 'Usage', v: 'Matin et soir' },
            { k: 'Conservation', v: '12 mois après ouverture' }
        ]],

    ['Montre enfant silenced 8 ans+', 'Enfants', 19000, 28000, 42, '', 0, 4.2, 290,
        "Silicone doux, verre anti-casse et étanche à 5 ATM.",
        [
            { k: "Tranche d'âge", v: '8 ans et +' },
            { k: 'Bracelet', v: 'Silicone doux' },
            { k: 'Verre', v: 'Anti-casse' },
            { k: 'Étanchéité', v: '5 ATM' },
            { k: 'Fonctions', v: 'Heure, date, chronomètre, alarme' },
            { k: 'Alimentation', v: 'Pile incluse' }
        ]],
    ['Cartable scolaire 3 compartiments', 'Enfants', 46500, 62000, 18, 'new', 0, 4.4, 405,
        "20 L, bandoulière rembourrée et passant pour chariot.",
        [
            { k: 'Capacité', v: '20 L' },
            { k: 'Compartiments', v: '3' },
            { k: 'Matière', v: 'Polyester renforcé' },
            { k: 'Bandoulière', v: 'Rembourrée' },
            { k: 'Dos', v: 'Ventilé' },
            { k: 'Passant', v: 'Pour chariot de poussette' }
        ]],

    ['Le guide du e-commerce Congo', 'Livres', 25000, 35000, 60, 'best', 0, 4.8, 212,
        "Livre de 240 pages sur la vente en ligne en République Démocratique du Congo.",
        [
            { k: 'Pages', v: '240' },
            { k: 'Format', v: 'Broché 15,5 × 21,5 cm' },
            { k: 'Illustrations', v: 'Oui, noir et blanc' },
            { k: 'Édition', v: '2026' },
            { k: 'Langue', v: 'Français' },
            { k: 'Public', v: 'Débutants et commerçants' }
        ]],
    ['Cuisine facile : 100 recettes', 'Livres', 27500, null, 52, 'new', 0, 4.6, 388,
        "Recettes étape par étape avec des ingrédients locaux.",
        [
            { k: 'Recettes', v: '100' },
            { k: 'Format', v: 'Poche 13 × 21 cm' },
            { k: 'Illustrations', v: 'Oui, en couleur' },
            { k: 'Ingrédients', v: 'Disponibles localement' },
            { k: 'Niveau', v: 'Débutant à confirmé' },
            { k: 'Langue', v: 'Français' }
        ]]
];

/* ==========================================================
   PHOTOS DES ARTICLES DU CATALOGUE OFFICIEL
   Chaque article reçoit plusieurs photos : elles défilent seules
   dans les cartes et dans la fiche produit, exactement comme les
   articles publiés par les vendeurs.
   ========================================================== */
const PHOTOS_PER_PRODUCT = 4;

/* « Smartphone Nova X20 256Go 5G » -> « smartphone-nova-x20-256go-5g » */
const slug = s => String(s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const photosFor = (title, n = PHOTOS_PER_PRODUCT) =>
    Array.from({ length: n }, (_, i) =>
        `https://picsum.photos/seed/${slug(title)}${i ? '-v' + (i + 1) : ''}/800/800`);

module.exports = { OFFICIAL_SHOP, CATALOGUE, photosFor, PHOTOS_PER_PRODUCT };
