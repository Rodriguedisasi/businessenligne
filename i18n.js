/* ==========================================================
   BUSINESSENLIGNE  —  LANGUES DU SITE
   ------------------------------------------------------------
   Ce fichier est chargé dans le <head>, juste après theme.js,
   pour que la langue choisie soit appliquée avant le premier
   affichage : en changeant de page, on ne voit aucun clignotement.

   Quatre langues sont proposées : Français, English, Kiswahili,
   Lingala. Le choix est mémorisé sur l'appareil (localStorage).

   Comment ça marche
   -----------------
   Le site est écrit en français « en dur », dans les pages HTML
   comme dans javascript.js. Plutôt que de Crowd agnostic ...,
   on lit le texte affiché, on le cherche dans le dictionnaire
   DICT et on le remplace par sa traduction. Les textes d'origine
   sont mémorisés (WeakMap) pour pouvoir revenir en arrière.

   Trois portes d'entrée :
     • t('texte')          pour les chaînes écrites dans le JS
     • <b data-i18n>…</b>  pour forcer la traduction d'un bloc
     • balayage automatique du DOM, y compris le contenu ajouté
       ensuite par javascript.js (MutationObserver)
   ========================================================== */

const LANG_KEY = 'businessenligne_lang';

/* --- les langues proposées -------------------------------- */
const LANGUAGES = [
    { id: 'fr', label: 'Français',   short: 'FR', locale: 'fr-FR', flag: '🇫🇷' },
    { id: 'en', label: 'English',    short: 'EN', locale: 'en-GB', flag: '🇬🇧' },
    { id: 'sw', label: 'Kiswahili',  short: 'SW', locale: 'sw-KE', flag: '🇰🇪' },
    { id: 'ln', label: 'Lingala',    short: 'LN', locale: 'ln-CD', flag: '🇨🇩' }
];

/* ==========================================================
   LE DICTIONNAIRE
   La clé est le texte français d'origine. La valeur est
   [anglais, kiswahili, lingala] — dans le même ordre.
   Une clé absente : le texte reste simplement en français.
   ========================================================== */
const DICT = {

/* ---------- commun ---------- */
'Langue':            ['Language', 'Lugha', 'Lokota'],
'Choisir la langue': ['Choose a language', 'Chagua lugha', 'Sala lokota'],
'Apparence du site': ['Site appearance', 'Mwonekano wa tovuti', 'Monekano ya siti'],
'Thème':             ['Theme', 'Mandhari', 'Mwononyo'],
'Changer de thème':  ['Change theme', 'Badilisha mandhari', 'Senga mwononyo'],
'Français':          ['Français', 'Kifaransa', 'Falanso'],
'Fermer':            ['Close', 'Funga', 'Funga'],
'Menu':              ['Menu', 'Menyu', 'Menyu'],
'Précédent':         ['Previous', 'Iliyotangulia', 'Elandalila'],
'Suivant':           ['Next', 'Iliyofuata', 'Elandalela'],
'Total':             ['Total', 'Jumla', 'Total'],
'Date':              ['Date', 'Tarehe', 'Mokolo'],
'Statut':            ['Status', 'Hali', 'Boye'],
'Prix':              ['Price', 'Bei', 'Motuya'],
'Stock':             ['Stock', 'Hisa', 'Stock'],
'Photos':            ['Photos', 'Picha', 'Bazani'],
'Options':           ['Options', 'Chaguo', 'Bongoko'],
'Note':              ['Rating', 'Ukadiria', 'Note'],
'Actions':           ['Actions', 'Vitendo', 'Mekama'],
'Modifier':          ['Edit', 'Badilisha', 'Senga'],
'Supprimer':         ['Delete', 'Futa', 'Kikula'],
'Voir':              ['View', 'Tazama', 'Tala'],
'Voir la boutique':  ['View shop', 'Tazama duka', 'Tala boutiki'],
'Tout voir':         ['See all', 'Ona zote', 'Tala bonso'],
'Tout':              ['All', 'Zote', 'Bonso'],
'Toutes':            ['All', 'Zote', 'Bonso'],
'Aucune':            ['None', 'Hakuna', 'Eza'],
'Choisir…':          ['Choose…', 'Chagua…', 'Sala…'],
'Enregistrer':       ['Save', 'Hifadhi', 'Bambanza'],
'Envoyer':           ['Send', 'Tuma', 'Tuma'],
'Ajouter':           ['Add', 'Ongeza', 'Yisa'],
'Ajouter un détail': ['Add a detail', 'Ongeza maelezo', 'Yisa molekolo'],
'Indisponible':      ['Unavailable', 'Haipatikani', 'Ezali teko'],

/* ---------- en-tête ---------- */
'Toutes les catégories': ['All categories', 'Kategoria zote', 'Bantanyi bonso'],
'Électronique':     ['Electronics', 'Elektroniki', 'Elektroniki'],
'Mode & Vêtements': ['Fashion & Clothing', 'Mavazi', 'Sapo & Bute'],
'Maison & Cuisine': ['Home & Kitchen', 'Nyumba & Kupika', 'Ndako & Mbali'],
'Sport & Loisirs':  ['Sport & Leisure', 'Michezo na Burudani', 'Sport na Dibiso'],
'Beauté & Santé':   ['Beauty & Health', 'Uzuri na Afya', 'Nzembo na Bolami'],
'Enfants & Bébé':    ['Kids & Baby', 'Watoto na Wototo', 'Bana na Bana'],
'Livres':           ['Books', 'Vitabu', 'Bandu'],
'Mode':             ['Fashion', 'Mavazi', 'Sapo'],
'Maison':           ['Home', 'Nyumba', 'Ndako'],
'Sport':            ['Sport', 'Michezo', 'Sport'],
'Beauté':           ['Beauty', 'Uzuri', 'Nzembo'],
'Enfants':          ['Kids', 'Watoto', 'Bana'],
'Tous les produits':['All products', 'Bidhaa zote', 'Vitungu vyote'],
'Magasins en ligne':['Online shops', 'Duka za mtandaoni', 'Boutiki za Inet'],
'Offres du jour':   ["Today's deals", 'Ofa za leo', 'Mabaya ya mokolo'],
'Vos avis':         ['Your reviews', 'Maoni yako', 'Mabote yako'],
'Nous contacter':    ['Contact us', 'Wasiliana nasi', 'Sampa biso'],
'Service client':   ['Customer service', 'Huduma ya wateja', 'Huduma ya basissi'],
'Rechercher sur BusinessEnLigne': ['Search BusinessEnLigne', 'Tafuta kwenye BusinessEnLigne', 'Sola kwenye BusinessEnLigne'],
'Rechercher':       ['Search', 'Tafuta', 'Sola'],
'Catégorie':        ['Category', 'Kategoria', 'Bantanyi'],
'Bonjour,':         ['Hello,', 'Habari,', 'Mbote,'],
'Identifiez-vous':  ['Sign in', 'Ingia', 'Ingia'],
'Créer un compte':  ['Create an account', 'Fungua akaunti', 'Sala koti'],
'Connectez-vous à votre compte': ['Log in to your account', 'Ingia kwenye akaunti yako', 'Kota kwenye koti yako'],
'Connexion / Inscription': ['Sign in / Sign up', 'Ingia / Jisajili', 'Kota / Sala'],
'Mon compte':       ['My account', 'Akaunti yangu', 'Koti yangu'],
'Mon magasin':      ['My shop', 'Duka langu', 'Magazi yangu'],
'Ma boutique':      ['My shop', 'Duka langu', 'Boutiki yangu'],
'Publier un article': ['Publish a product', 'Chapisha kitungu', 'Puta kitungu'],
'Mes commandes':    ['My orders', 'Maagizo yangu', 'Commandes yangu'],
"Mes J'aime":       ['My likes', 'Mapendeleo yangu', 'Mipendo yangu'],
'Se déconnecter':   ['Log out', 'Toka', 'Songa'],
'Retours':          ['Returns', 'Marejezo', 'Mizengo'],
'et commandes':     ['and orders', 'na maagizo', 'na commandes'],
'Panier':           ['Cart', 'Kikapu', 'Koba'],
'Mon Panier':       ['My Cart', 'Kikapu changu', 'Koba yangu'],
'Votre panier':     ['Your cart', 'Kikapu chako', 'Koba yako'],
'Contact':          ['Contact', 'Wasiliana', 'Sampa'],

/* ---------- page d'accueil ---------- */
'Nouvelle collection': ['New collection', 'Mkusanyiko mpya', 'Mbongo mbola'],
'La mode qui suit votre style': ['Fashion that matches your style', 'Mavazi yanayolingana na mtindo wako', 'Sapo elandelela motindo yako'],
'Des essentiels tendance livrés en 48h à Lubumbashi. Paiement à la commande, satisfaction garantie.':
    ['Trend essentials delivered in 48h to Lubumbashi. Pay on order, guaranteed satisfaction.',
     'Vitu vya moda vinavyowashwa kwa masaa 48 Lubumbashi. Lipa wakati wa kupokea, kuridhika kuhakikishwa.',
     'Vitungu vya kunipa vya sentche zomo na maboko Lubumbashi. Pesa ya mukoba, kutosha kosepelika kuhakikishwa.'],
'Découvrir les articles': ['Discover the products', 'Ona bidhaa', 'Sola vitungu'],
'Smartphones, audio et objets connectés':
    ['Smartphones, audio and connected devices',
     'Simu za mkononi, sauti na vifaa vinavyounganishwa',
     'Telefoni, moi na bicho oyo ekotambwa'],
'Réseau 5G, garantie 12 mois, accessoires d\'origine. Livraison express partout en RDC.':
    ['5G network, 12-month warranty, original accessories. Express delivery across the DRC.',
     'Mtandao wa 5G, uhakikishaji wa miezi 12, vifaa asilia. Usafirishaji wa haraka kote RDC.',
     'Réseau 5G, garantie ya miezi 12, bicho oyo ebandakisi. Posi ya mbale kote RDK.'],
'Voir l\'électronique': ['See electronics', 'Ona elektroniki', 'Tala elektroniki'],
'Votre intérieur mérite le meilleur':
    ['Your home deserves the best', 'Nyumba yako inastahili bora', 'Ndako yako ekalimwa na nkembo'],
'Cuisine, décoration, rangement : nos best-sellers à prix réduit pour une durée limitée.':
    ['Kitchen, decoration, storage: our best-sellers at reduced prices for a limited time.',
     'Kupika, mapambo, uhifadhi: vitu vyetu vinavyouzwa zaidi bei nafuu kwa muda mfupi.',
     'Mbali, mapambo, molange: vitungu biso vyo bomoko vinavyobongwa bei nafuu kwa muda oyo moke.'],
'Explorer la maison': ['Explore home', 'Chunguza nyumba', 'Tala ndako'],
'Livraison à partir de 1 500 FC': ['Delivery from 1,500 FC', 'Usafirishaji kuanzia 1 500 FC', 'Posi kuanzia 1 500 FC'],
'Partout en République Démocratique du Congo':
    ['Across the Democratic Republic of the Congo', 'Kote katika Jamhuri ya Kidemokrasia ya Kongo', 'Kote naume ya Kongo ya Demokratiki'],
'Retours gratuits sous 30 jours': ['Free returns within 30 days', 'Marejezo bila malipo ndani ya siku 30', 'Mizengo ya mahuri ndani ya mikolo 30'],
'Satisfait ou remboursé, sans question': ['Satisfied or refunded, no questions asked', 'Uridziki au malipo yako yarudi, bila hoja', 'Osatisfied au mboko yako ekotoka, pamba pembe'],
'Paiement 100 % sécurisé': ['100% secure payment', 'Malipo salama 100%', 'Mboko salama 100%'],
'Mobile Money, carte bancaire ou espèces': ['Mobile Money, bank card or cash', 'Mobile Money, kadi ya benki au pesa tasla', 'Mobile Money, kadi ya banki au mbongo'],
'Support 7j/7': ['Support 7 days/7', 'Msaada siku 7/7', 'Msaada mikolo 7/7'],
'Acheter par catégorie': ['Shop by category', 'Nunua kwa kategoria', 'Sola na bantanyi'],
'Se termine dans': ['Ends in', 'Inaisha baada ya', 'Ekopela na'],
'Meilleures ventes cette semaine': ['Best sellers this week', 'Vitu vinavyouzwa zaidi wiki hii', 'Vitungu vinavyobongwa bole wiki oyo'],
'Électronique & High-tech': ['Electronics & High-tech', 'Elektroniki na High-tech', 'Elektroniki na High-tech'],
'Livraison Prime : rapide, gratuite, illimitée':
    ['Prime delivery: fast, free, unlimited', 'Posi ya Prime: haraka, ya bure, bila kikomo', 'Posi ya Prime: mbale, mahuri, bila kikomo'],
'Commandez avant 18h et recevez votre colis en 24 à 48h. Accès prioritaire aux ventes Flash et aux offres réservées aux membres.':
    ['Order before 6pm and receive your parcel in 24 to 48h. Priority access to Flash sales and member-only offers.',
     'Agiza kabla ya saa 6 jioni na upate pakiti yako kwa masaa 24 hadi 48. Pana ya kwanza kwa bei za muda mfupi na ofa za wanachama.',
     'Banda mali kabanza ya 18h na uyoka pakiti yako kwa masaa 24 kati ya 48. Pana ya liboso kwa kutengeneza Flash na mabaya ya membo.'],
'Livraison le jour même': ['Same-day delivery', 'Usafirishaji siku ile ile', 'Posi siku ile ile'],
'Retours gratuits': ['Free returns', 'Marejezo bila malipo', 'Mizengo ya mahuri'],
'Offres exclusives': ['Exclusive offers', 'Ofa za kipekee', 'Mabaya ya kipekee'],
'Essayer Prime': ['Try Prime', 'Jaribu Prime', 'Yebala Prime'],
'Mode : les must-have du moment': ['Fashion: this season\'s must-haves', 'Mavazi: vitu vya lazima za msimu huu', 'Sapo: vitungu vya mkobligo wa sik hii'],
'Voir la page complète': ['See the full page', 'Ona ukurasa kamili', 'Tala pekeji yote'],
'Trier par :': ['Sort by:', 'Panga kwa:', 'Panga na:'],
'Ce que disent nos clients': ['What our customers say', 'Maoni ya wateja wetu', 'Mabote ya basissi biso'],
'4,6 / 5 sur 3 218 avis': ['4.6 / 5 from 3,218 reviews', '4.6 / 5 kati ya maoni 3 218', '4,6 / 5 kati ya mabote 3 218'],
'Avis clients': ['Customer reviews', 'Maoni ya wateja', 'Mabote ya basissi'],
'Qualité exceptionnelle, prix imbattables. Satisfait ou remboursé.':
    ['Exceptional quality, unbeatable prices. Satisfied or refunded.',
     'Ubora wa hali ya juu, bei zisizoweza kushindwa. Uridziki au malipo yako yarudi.',
     'Ubora wa mali, motuya zisizoweza kushindwa. Osatisfied au mboko ekotoka.'],
'En savoir plus': ['Learn more', 'Jifunze zaidi', 'Yeba lisusu'],
'Mieux notés': ['Top rated', 'Zilizowekwa alama', 'Batotali na point'],
"Meilleures remises": ['Biggest discounts', 'Pungja kubwa', 'Mabaya ya malipo'],
'Prix croissant': ['Price: low to high', 'Bei: kutoka nafuu kwa ghali', 'Motuya: banda li nseka koko'],
'Prix décroissant': ['Price: high to low', 'Bei: kutoka ghali kwa nafuu', 'Motuya: banda ko koko li nseka'],
'Pertinence': ['Relevance', 'Ufanisi', 'Kofika'],
'Trier par': ['Sort by', 'Panga kwa', 'Panga na'],
'Trier :': ['Sort:', 'Panga:', 'Panga:'],
'Tous les prix': ['All prices', 'Bei zote', 'Motuya bonso'],
'Moins de 25 000 FC': ['Under 25,000 FC', 'Chini ya 25 000 FC', 'Kati ya 25 000 FC tadhi'],
'25 000 à 60 000 FC': ['25,000 to 60,000 FC', '25 000 hadi 60 000 FC', '25 000 kati ya 60 000 FC'],
'60 000 à 150 000 FC': ['60,000 to 150,000 FC', '60 000 hadi 150 000 FC', '60 000 kati ya 150 000 FC'],
'150 000 FC et plus': ['150,000 FC and above', '150 000 FC na zaidi', '150 000 FC na kuu'],
'Livraison Prime': ['Prime delivery', 'Posi ya Prime', 'Posi ya Prime'],
'En stock uniquement': ['In stock only', 'Ndani ya duka pekee', 'Ndani ya duka kaka'],
'En promotion': ['On sale', 'Kwenye ofa', 'Kwenye mabaya'],
'Note client': ['Customer rating', 'Ukadiria wa mteja', 'Note ya basissi'],
'Toutes les notes': ['All ratings', 'Ukadiria wote', 'Note bonso'],
'4 étoiles et plus': ['4 stars and above', 'Nyota 4 na zaidi', 'Muwondo 4 na kuu'],
'4,5 étoiles et plus': ['4.5 stars and above', 'Nyota 4.5 na zaidi', 'Muwondo 4,5 na kuu'],
'Moins de 4 étoiles': ['Under 4 stars', 'Chini ya nyota 4', 'Kati ya muwondo 4'],
'Réinitialiser les filtres': ['Reset filters', 'Anzisha upya vichujio', 'Anzisha upya vichujio'],
'Chargement…': ['Loading…', 'Inapakia…', 'Inapakia…'],
'Offre du jour dans cette catégorie': ['Deal of the day in this category', 'Ofa ya mokolo katika kategoria hii', 'Mbayo ya mokolo na bantanyi oyo'],
"jusqu'à -50% sur une sélection d'articles":
    ['up to -50% on a selection of products', 'hadi -50% kwenye bidhaa zilizochaguliwa', 'kamiaka -50% na vitungu oyo ekala'],
'Voir l\'offre': ['See the offer', 'Ona ofa', 'Tala mbayo'],
'Livraison offerte dès 150 000 FC': ['Free delivery from 150,000 FC', 'Usafirishaji wa bure kuanzia 150 000 FC', 'Posi ya mahuri kuanzia 150 000 FC'],
'Livraison standard en 24 à 48h': ['Standard delivery in 24 to 48h', 'Usafirishaji wa kawaida kwa masaa 24–48', 'Posi ya normali kwa masaa 24–48'],
'Retour gratuit sous 30 jours': ['Free return within 30 days', 'Kidogo chini ya siku 30', 'Mzigo mahuri ndani ya mikolo 30'],
'Satisfait ou remboursé': ['Satisfied or refunded', 'Uridziki au malipo yarudi', 'Osatisfied au mboko ekotoka'],
'Aucune boutique': ['No shops', 'Hakuna duka', 'Boutiki ta zero'],
'Toutes les boutiques': ['All shops', 'Duka zote', 'Boutiki bonso'],
'Autres catégories à découvrir': ['Other categories to discover', 'Kategoria nyingine za kuvumbua', 'Bantanyi oyo bosalala kuzambula'],
'Nos catégories': ['Our categories', 'Kategoria zetu', 'Bantanyi biso'],

/* ---------- panier ---------- */
'Votre panier est vide': ['Your cart is empty', 'Kikapu chako ni tupu', 'Koba yako ezali na tata'],
'Ajoutez des articles pour commencer.':
    ['Add products to get started.', 'Ongeza bidhaa ili kuanza.', 'Yisa vitungu ku banduka.'],
'Sous-total': ['Subtotal', 'Jumla ndogo', 'Sous-total'],
"Livraison calculée à l'étape suivante":
    ['Shipping calculated at the next step', 'Usafirishaji huhesabiwa hatua inayofuata', 'Mbongo ekosolola mu etape inooyo'],
'Passer la commande': ['Place order', 'Weka agizo', 'Banda mali'],
'Acheter maintenant': ['Buy now', 'Nunua sasa', 'Sota mbongo'],
'Ajouter au panier': ['Add to cart', 'Ongeza kikapu', 'Yisa kwenye koba'],
'Qté :': ['Qty:', 'Idadi:', 'Namba:'],
'Livraison STANDARD offerte ✓': ['STANDARD delivery free ✓', 'Usafirishaji wa kawaida ni bure ✓', 'Posi ya NORMALI mahuri ✓'],
'Livraison STANDARD : 1 500 FC (offerte dès 150 000 FC)':
    ['STANDARD delivery: 1,500 FC (free from 150,000 FC)', 'Usafirishaji wa kawaida: 1 500 FC (bure kuanzia 150 000 FC)', 'Posi ya NORMALI: 1 500 FC (mahuri kuanzia 150 000 FC)'],
'Livraison': ['Delivery', 'Usafirishaji', 'Posi'],
'GRATUITE': ['FREE', 'BURE', 'MAHURI'],
'Paiement': ['Payment', 'Malipo', 'Mboko'],
'Disponibilité': ['Availability', 'Upatikanaji', 'Kuwepo'],
'Informations sur l\'article': ['Product information', 'Taarifa za bidhaa', 'Maelezo ya kitungu'],
'Photos en grand': ['Full-screen photos', 'Picha kubwa', 'Bazani nkulu'],
'Définir comme photo principale': ['Set as main photo', 'Weka kama picha kuu', 'Sala bazani ya motó'],
'Photo précédente': ['Previous photo', 'Picha iliyotangulia', 'Bazani ya liboso'],
'Photo suivante': ['Next photo', 'Picha inayofuata', 'Bazani inooyo'],
'Vous suivez': ['Following', 'Unafuatilia', 'Usuki'],
'Suivre': ['Follow', 'Fuatilia', 'Suka'],
'Plus que': ['Only', 'Zimebaki', 'Bado kuwepo'],
'en stock': [' left in stock', ' zimeboka kwenye duka', ' bokoko kati ya ndani ya duka'],
'En stock': ['In stock', 'Ipo kwenye duka', 'Epo kati ya duka'],
'Plus que 10 en stock': ['Only 10 left in stock', 'Zimebaki 10 kwenye duka', 'Bado 10 bokoko kati ya ndani ya duka'],
'Plus que 3 en stock': ['Only 3 left in stock', 'Zimebaki 3 kwenye duka', 'Bado 3 bokoko kati ya ndani ya duka'],
'Plus que 5 en stock': ['Only 5 left in stock', 'Zimebaki 5 kwenye duka', 'Bado 5 bokoko kati ya ndani ya duka'],
'Plus que 1 en stock': ['Only 1 left in stock', 'Zimebaki 1 kwenye duka', 'Bado 1 koko kati ya ndani ya duka'],
'Plus que 2 en stock': ['Only 2 left in stock', 'Zimebaki 2 kwenye duka', 'Bado 2 bokoko kati ya ndani ya duka'],
'Plus que 4 en stock': ['Only 4 left in stock', 'Zimebaki 4 kwenye duka', 'Bado 4 bokoko kati ya ndani ya duka'],
'Plus que 6 en stock': ['Only 6 left in stock', 'Zimebaki 6 kwenye duka', 'Bado 6 bokoko kati ya ndani ya duka'],
'Plus que 7 en stock': ['Only 7 left in stock', 'Zimebaki 7 kwenye duka', 'Bado 7 bokoko kati ya ndani ya duka'],
'Plus que 8 en stock': ['Only 8 left in stock', 'Zimebaki 8 kwenye duka', 'Bado 8 bokoko kati ya ndani ya duka'],
'Plus que 9 en stock': ['Only 9 left in stock', 'Zimebaki 9 kwenye duka', 'Bado 9 bokoko kati ya ndani ya duka'],
'Rupture de stock': ['Out of stock', 'Duka hakuna bidhaa', 'Ebalia'],
'Plus que 0 en stock': ['Out of stock', 'Zimebaki 0 kwenye duka', 'Ebalia'],
'Offre': ['Deal', 'Ofa', 'Mbayo'],
'Promotion': ['Sale', 'Promo', 'Mbayo'],
'Nouveau': ['New', 'Mpya', 'Mbola'],
'Meilleure vente': ['Best seller', 'Inauzwa zaidi', 'Eboboka'],
'Articles': ['Products', 'Bidhaa', 'Vitungu'],
'Boutique': ['Shop', 'Duka', 'Boutiki'],
'J\'aime': ['likes', ' mapendeleo', ' mipendo'],
'personne': ['person', ' mtu', ' muntu'],
'personnes': ['people', ' watu', ' bantu'],
'photos dans la galerie': ['photos in the gallery', ' picha kwenye galeria', ' bazani kati ya galeri'],
'photo': ['photo', ' picha', ' bazani'],
'Avis vérifié le mois dernier': ['Verified review last month', 'Maoni yaliyothibitishwa mwezi uliopita', 'Mabote oyo batengami na nsapu oyo elanduki'],
'Achat vérifié': ['Verified purchase', 'Ununuzi uliothibitishwa', 'Soma oyo batengami'],

/* ---------- fiches catégories ---------- */
'Smartphones, ordinateurs, audio et objets connectés. Livraison express et garantie 12 mois sur toute la gamme.':
    ['Smartphones, computers, audio and connected devices. Express delivery and a 12-month warranty on the whole range.',
     'Simu za mkononi, kompyuta, sauti na vifaa vinavyounganishwa. Usafirishaji wa haraka na uhakikishaji wa miezi 12 kwa kila kitu.',
     'Telefoni, kompyuta, moi na bicho oyo ekotambwa. Posi ya mbale na garantie ya miezi 12 na biso nyonso.'],
'Prêt-à-porter homme et femme, chaussures, accessoires et sacs. Des coupe-circuits renouvés chaque semaine.':
    ['Ready-to-wear for men and women, shoes, accessories and bags. Cut-price bargains renewed every week.',
     'Mavazi ya kawaida kwa wanaume na wanawake, viatu, vifaa na mikoba. Bei za kushindwa zinasasishwa kila wiki.',
     'Bute oyo ekotambwa na baba na mama, mabokatu, bicho na mikoba. Mituya oyo ekotana nsapu na sengo nyonso.'],
'Cuisine, décoration, linge de maison et rangement. Tout pour rendre votre intérieur plus confortable.':
    ['Kitchen, decoration, household linen and storage. Everything to make your home more comfortable.',
     'Kupika, mapambo, nguo za nyumba na uhifadhi. Kila kitu kwa kuifanya nyumba yako iwe na starehe zaidi.',
     'Mbali, mapambo, bilongo ya ndako na molange. Yose pona koba oyo ndako yako ebanza lisa lisusu.'],
'Matériel de fitness, cardio, musculation et accessoires de sport. Équipement de qualité professionnelle.':
    ['Fitness gear, cardio, weightlifting and sports accessories. Professional-grade equipment.',
     'Zana za mazoezi, cardio, kupiga misiba na vifaa vya michezo. Vifaa vya kiwango cha kazi.',
     'Vifaa vya mazoezi, cardio, kupiga misiba na bicho ya sport. Vifaa vya kiwango cha kazi.'],
'Soins du visage, cheveux et accessoires de beauté. Produits authentiques et conseils personnalisés.':
    ['Face and hair care and beauty accessories. Authentic products and personalised advice.',
     'Utunzaji wa uso, nywele na vifaa vya urembo. Bidhaa halisi na ushauri ulio bora kwa kila mtu.',
     'Malangwana ya maso, mateo na bicho ya nzembo. Vitungu vya kweli na mshauri ulio bora kwa kila muntu.'],
'Jouets, vêtements, sacs scolaires et accessoires pour enfants. Des articles choisis pour durer.':
    ['Toys, clothes, school bags and children\'s accessories. Products chosen to last.',
     'Vicheko, mavazi, mikoba ya shule na vifaa vya watoto. Bidhaa zilizochaguliwa zidumu.',
     'Bisos, bute, mikoba ya eteyelo na bicho ya bana. Vitungu oyo ekalimi koba ekotama molange.'],
'Romans, guides pratiques et manuels. Livraison à partir de 1 500 FC partout en RDC.':
    ['Novels, practical guides and manuals. Delivery from 1,500 FC anywhere in the DRC.',
     'Riwaya, miongozo ya vitendo na vitabu vya kujifunza. Usafirishaji kuanzia 1 500 FC kote RDC.',
     'Bandu za mapema, miongozo ya l ntondo na mabuku. Posi kuanzia 1 500 FC kote RDK.'],
'Tout le catalogue BusinessEnLigne : électronique, mode, maison, sport, beauté, enfants et livres. Plus de 28 articles disponibles avec livraison partout en RDC.':
    ['The whole BusinessEnLigne catalogue: electronics, fashion, home, sport, beauty, kids and books. Over 28 products available with delivery across the DRC.',
     'Katalogi yote ya BusinessEnLigne: elektroniki, mavazi, nyumba, michezo, uzuri, watoto na vitabu. Zaidi ya vitungu 28 vinavyopatikana na usafirishaji kote RDC.',
     'Katalogo mobobe ya BusinessEnLigne: elektroniki, sapo, ndako, sport, nzembo, bana na bandu. Vitungu vingi kuliko 28 oyo ekotambwa na posi kote RDK.'],
'Aucun article ne correspond à ces filtres.': ['No products match these filters.', 'Hakuna bidhaa inayolingana na vichujio hivi.', 'Eza kitungu ekoyekola na mizobo oyo.'],
'Aucun article ne correspond à la recherche.': ['No products match your search.', 'Hakuna bidhaa inayolingana na utafutaji wako.', 'Eza kitungu ekoteyemola na moloko oyo osala.'],
'Aucun article ne correspond à votre recherche.': ['No products match your search.', 'Hakuna bidhaa inayolingana na utafutaji wako.', 'Eza kitungu ekoteyemola na moloko yoyo.'],
'Aucun article ici': ['No products here', 'Hakuna bidhaa hapa', 'Eza kitungu awawa'],
'Aucun résultat': ['No results', 'Hakuna matokeo', 'Eza seyo'],
'Essayez un autre mot-clé ou une autre catégorie.': ['Try another keyword or another category.', 'Jaribu neno lingine au kategoria nyingine.', 'Yebala neno oyo mosala to bantanyi oyo mosala.'],
'Tout le catalogue de la plateforme': ['The whole platform catalogue', 'Katalogi yote ya tovuti', 'Katalogo yote ya siti'],
'Boutiques': ['Shops', 'Duka', 'Boutiki'],
'Rechercher une boutique': ['Search a shop', 'Tafuta duka', 'Sola boutiki'],
'Plus d\'articles': ['More products', 'Bidhaa zaidi', 'Vitungu vingine'],
'Filtres et tris': ['Filters and sorting', 'Vichujio na mapangilio', 'Mizobo na moloko'],
'Masquer les filtres': ['Hide filters', 'Ficha vichujio', 'Bana mizobo'],

/* ---------- page magasin ---------- */
'À propos de la boutique': ['About the shop', 'Kuhusu duka', 'Kusu boutiki'],
'membre depuis': ['member since', 'mwanachama tangu', 'membre kuanzia'],
articles: ['products', 'bidhaa', 'vitungu'],
'article': ['product', 'bidhaa', 'kitungu'],
'Boutique introuvable': ['Shop not found', 'Duka halijapatikana', 'Boutiki ekotambwa teko'],
'Cette boutique n\'existe pas ou a été supprimée.':
    ['This shop does not exist or has been removed.', 'Duka hili halipo au limefutwa.', 'Boutiki oyo ekotambwa teko to ekikulwa.'],
'Retour à l\'accueil': ['Back to home', 'Rudi nyumbani', 'Kelela bandula'],
'Articles de la boutique': ['Shop products', 'Bidhaa za duka', 'Vitungu ya boutiki'],
'Vous ne suivez plus cette boutique.': ['You no longer follow this shop.', 'Huchafuati duka hili tena.', 'Osusika teko boutiki oyo tena.'],
'Vous suivez cette boutique !': ['You now follow this shop!', 'Sasa unafuatilia duka hili!', 'Ozali kosuka boutiki oyo!'],
'Connectez-vous pour suivre une boutique': ['Log in to follow a shop', 'Ingia ili kufuatilia duka', 'Kota ili kosuka boutiki'],
'Boutique': ['Shop', 'Duka', 'Boutiki'],
'Nom de la boutique': ['Shop name', 'Jina la duka', 'Bokomo ya boutiki'],
'Présentation de la boutique': ['Shop description', 'Maelezo ya duka', 'Maelezo ya boutiki'],
'3 caractères minimum.': ['At least 3 characters.', 'Angalia herufi 3.', 'Boya miniti malembo 3.'],
'Compléter mon profil': ['Complete my profile', 'Kamilisha wasifu wangu', 'Kamilisha profil yangu'],
'Voir la page publique': ['See the public page', 'Tazama ukurasa wa wazi', 'Tala siti ya moko'],
'Gérer mes articles': ['Manage my products', 'Simamia bidhaa zangu', 'Teja vitungu yangu'],
'Photo de profil (URL)': ['Profile photo (URL)', 'Picha ya wasifu (URL)', 'Bazani ya profil (URL)'],
'Visiter': ['Visit', 'Tembelea', 'Kota'],
'followed': ['followed', 'unafuatilia', 'osuki'],
'unfollowed': ['unfollowed', ' hukufuatilia tena', 'asosuki teko'],
'Articles publiés': ['Published products', 'Bidhaa zilizochapishwa', 'Vitungu vyo bana'],

/* ---------- compte ---------- */
'Vous devez être connecté': ['You must be logged in', 'Lazima uingie', 'Lazima ukote'],
'Créez votre compte pour publier vos articles et suivre vos commandes.':
    ['Create your account to publish your products and track your orders.',
     'Fungua akaunti yako ili kuchapisha bidhaa zako na kufuatilia maagizo yako.',
     'Sala koti yako ili puta vitungu yako na sala commandes yako.'],
'Mes articles': ['My products', 'Bidhaa zangu', 'Vitungu yangu'],
'Mes articles publiés': ['My published products', 'Bidhaa zangu zilizochapishwa', 'Vitungu vyo bana'],
'Articles que j\'aime': ['Products I like', 'Bidhaa nawapenda', 'Vitungu nayakpenda'],
'Historique de mes commandes': ['My order history', 'Historia ya maagizo yangu', 'Boyokoli ya commandes yangu'],
'Commandes': ['Orders', 'Maagizo', 'Commandes'],
'J\'aime': ['Likes', 'Mapendeleo', 'Mipendo'],
'Réglages': ['Settings', 'Mipangilio', 'Bobongisi'],
'Identifiant :': ['Username:', 'Jina la mtumiaji:', 'Esanza:'],
'Email :': ['Email:', 'Barua pepe:', 'Email:'],
'Membre depuis :': ['Member since:', 'Mwanachama tangu:', 'Membre kuanzia:'],
'Adresse du compte :': ['Account address:', 'Anwani ya akaunti:', 'Lokisyo ya koti:'],
'Vous n\'avez pas encore publié d\'article': ['You have not published any product yet', 'Bado hujachapisha bidhaa yoyote', 'Bado usaputidi kitungu'],
'Parcourez le catalogue et aimez les articles qui vous plaisent.':
    ['Browse the catalogue and like the products you enjoy.', 'Chunguza katalogi na upende bidhaa unzopenda.', 'Tala katalogo na likita vitungu oyo ekosepela na yo.'],
'Vous devez être connecté pour accéder au tableau de surveillance.':
    ['You must be logged in to access the dashboard.', 'Lazima uingie ili kufikia sehemu ya usimamizi.', 'Lazima ukote koba osala na eteyelo ya supervision.'],
'Voir les boutiques': ['See the shops', 'Ona maduka', 'Tala boutiki'],
'Vous n\'avez pas encore décrit votre boutique.':
    ['You have not described your shop yet.', 'Bado hujaeleza duka lako.', 'Bado usimesola boutiki yako.'],
'Voir mon magasin': ['See my shop', 'Tazama duka langu', 'Tala magazi yangu'],
'Articles publiés': ['Published products', 'Bidhaa zilizochapishwa', 'Vitungu vyo bana'],
'J\'aime reçus': ['Likes received', 'Mapendeleo yaliyopokelwa', 'Mipendo oyo ekatambwa'],
'Modifier l\'article (photos, détails, prix…)': ['Edit the product (photos, details, price…)', 'Badilisha bidhaa (picha, maelezo, bei…)', 'Senga kitungu (bazani, maelezo, motuya…)'],
'Masquer l\'article': ['Hide the product', 'Ficha bidhaa', 'Bana kitungu'],
'Supprimer définitivement l\'article': ['Permanently delete the product', 'Futa bidhaa kwa kudumu', 'Kikula kitungu nglutshime'],
'Supprimer l\'article': ['Delete the product', 'Futa bidhaa', 'Kikula kitungu'],
'Photo précédente': ['Previous photo', 'Picha iliyotangulia', 'Bazani ya liboso'],
'Modération': ['Moderation', 'Usimamizi', 'Supervision'],
'Vous ne pouvez modifier que vos propres articles.':
    ['You can only edit your own products.', 'Unaweza kubadilisha bidhaa zako pekee.', 'Oloko teko kubadilisha vitungu yako kaka.'],
'Article publié.': ['Product published.', 'Bidhaa imechapishwa.', 'Kitungu kimesaputwa.'],
'Article mis à jour.': ['Product updated.', 'Bidhaa imesasishwa.', 'Kitungu kimesungusswa.'],
'Boutique mise à jour.': ['Shop updated.', 'Duka limesasishwa.', 'Boutiki esungusswe.'],
'Article masqué.': ['Product hidden.', 'Bidhaa imefichwa.', 'Kitungu kimesitirwa.'],
'Article supprimé.': ['Product deleted.', 'Bidhaa imefutwa.', 'Kitungu kimefutwa.'],
'Compte supprimé.': ['Account deleted.', 'Akaunti imefutwa.', 'Koti ekifutwa.'],
'Compte suspendu.': ['Account suspended.', 'Akaunti imesimamishwa.', 'Koti emesimama.'],
'Compte réactivé.': ['Account reactivated.', 'Akaunti imeanza tena.', 'Koti ebandika tena.'],
'Vous êtes déconnecté.': ['You are logged out.', 'Umetoka.', 'Umesonga.'],

/* ---------- connexion / inscription ---------- */
'Créer un compte': ['Create an account', 'Fungua akaunti', 'Sala koti'],
'Se connecter': ['Log in', 'Ingia', 'Kota'],
'Connectez-vous': ['Log in', 'Ingia', 'Kota'],
'Déjà inscrit ?': ['Already registered?', 'Umesajiliwa tayari?', 'Bado mopeshi ema?'],
'Vous avez déjà un compte ?': ['Already have an account?', 'Una akaunti tayari?', 'Eza koti oyo uko?'],
'Créer votre compte': ['Create your account', 'Fungua akaunti yako', 'Sala koti yako'],
'Créer mon compte': ['Create my account', 'Fungua akaunti yangu', 'Sala koti yangu'],
'Ouvrez votre boutique et publiez vos articles en quelques secondes.':
    ['Open your shop and publish your products in seconds.',
     'Fungua duka lako na uchapishe bidhaa zako kwa sekunde chache.',
     'Sala boutiki yako na puta vitungu yako kwa ntongo oyo mosali.'],
'Saisissez votre': ['Enter your', 'Weka', 'Yisa'],
'adresse email': ['email address', 'barua pepe', 'barua pepe'],
'et votre mot de passe : nous créons votre identifiant et le nom de votre boutique automatiquement. Vous pourrez les personnaliser juste après.':
    ['and your password: we automatically create your username and shop name. You can customise them right after.',
     'na nenosiri lako: tunatengeneza jina lako la mtumiaji na jina la duka kwa moja kwa moja. Unaweza kuvirekebisha baada yake.',
     'na bobwami yako: tongo biso bokalola esanza yako na bokomo ya boutiki. Oloko teko yobadilisha yangaye.'],
'Adresse email *': ['Email address *', 'Barua pepe *', 'Barua pepe *'],
'Adresse email invalide.': ['Invalid email address.', 'Barua pepe si sahihi.', 'Barua pepe ezali malongo.'],
'Mot de passe *': ['Password *', 'Nenosiri *', 'Mot de passe *'],
'6 caractères minimum.': ['At least 6 characters.', 'Angalia herufi 6.', 'Boya miniti malembo 6.'],
'Confirmer le mot de passe *': ['Confirm password *', 'Thibitisha nenosiri *', 'Kondimola mot de passe *'],
'Les deux mots de passe ne correspondent pas.': ['The two passwords do not match.', 'Nenosiri zilizo mbili hazilingani.', 'Bobwami mbili bayekotana teko.'],
'Personnaliser ma boutique maintenant': ['Customise my shop now', 'Badilisha duka langu sasa', 'Songo magazi yangu mbongo'],
'(optionnel)': ['(optional)', '(hiari)', '(sakutwa)'],
'Nom de votre boutique': ['Your shop name', 'Jina la duka lako', 'Bokomo ya boutiki yako'],
'Le nom doit contenir au moins 3 caractères.': ['The name must contain at least 3 characters.', 'Jina lazima liwe na herufi 3 angalau.', 'Bokomo ezalaka na malembo 3 minimum.'],
'Identifiant': ['Username', 'Jina la mtumiaji', 'Esanza'],
'3 à 20 caractères : lettres, chiffres, . _ -': ['3 to 20 characters: letters, digits, . _ -', 'Herufi 3 hadi 20: herufi, nambari, . _ -', 'Malembo 3 kati ya 20: maboko, motoba, . _ -'],
'J\'accepte les conditions générales de vente et la politique de confidentialité.':
    ['I accept the terms of sale and the privacy policy.',
     'Nakubali sheria za mauzo na sera ya usiri.', 'Nandimela mibango ya nzete na mibango ya kifisili.'],
'Créer mon compte avec mon email': ['Create my account with my email', 'Fungua akaunti yangu kwa barua pepe', 'Sala koti yangu na email'],
'Un seul champ suffit pour commencer': ['Only one field is needed to start', 'Utafuta kujaza ufunguo mmoja tu kuanza', 'Utafuta bozali mole kaka elandela'],
'Serveur non lancé': ['Server not running', 'Seva haijaanzishwa', 'Seva itaendji teko'],
'Pour créer un compte, ouvrez une invite de commande dans ce dossier, tapez':
    ['To create an account, open a command prompt in this folder and type', 'Kutengeneza akaunti, fungua kipepeo ya amri katika folda hii, uandike'],
'sur le serveur.': ['on the server.', 'kwenye seva.', 'kwenye seva.'],
'puis ouvrez': ['then open', 'kisha fungua', 'bongo pembe'],
'Connexion': ['Log in', 'Ingia', 'Kota'],
'Accédez à votre boutique « Mon Magasin ».':
    ['Access your "My Shop" store.', "Ingia kwenye duka lako \"Duka langu\".", "Kota kwenye boutiki yako \"Magazi yangu\"."],
'Identifiant ou email': ['Username or email', 'Jina la mtumiaji au barua pepe', 'Esanza kama email'],
'Saisissez votre identifiant ou votre email.': ['Enter your username or your email.', 'Weka jina lako la mtumiaji au barua pepe yako.', 'Yisa esanza yoko kama email yoko.'],
'Mot de passe': ['Password', 'Nenosiri', 'Mot de passe'],
'Saisissez votre mot de passe.': ['Enter your password.', 'Weka nenosiri lako.', 'Yisa bobwami yoko.'],
'Pas encore de compte ?': ['No account yet?', 'Bado huna akaunti?', 'Bado ozali na koti teko?'],
'Mot de passe incorrect.': ['Incorrect password.', 'Nenosiri si sahihi.', 'Bobwami ezali malongo.'],
'Identifiant inconnu.': ['Unknown username.', 'Jina la mtumiaji halijulikani.', 'Esanza ekotambwa teko.'],
'Connectez-vous pour continuer': ['Log in to continue', 'Ingia ili kuendelea', 'Kota ili kwendela'],
'Connexion…': ['Logging in…', 'Inaingia…', 'Kotanga…'],
'Création…': ['Creating…', 'Inatengeneza…', 'Ezalaka…'],
'Enregistrement…': ['Saving…', 'Inahifadhi…', 'Ebambanza…'],
'Publication…': ['Publishing…', 'Inachapisha…', 'Eputaka…'],

/* ---------- publier ---------- */
'Publier un article dans ma boutique': ['Publish a product in my shop', 'Chapisha bidhaa kwenye duka langu', 'Puta kitungu kwenye magazi yangu'],
'Connectez-vous pour publier': ['Log in to publish', 'Ingia ili kuchapisha', 'Kota ili kputa'],
'La publication est réservée aux membres ayant un compte.':
    ['Publishing is reserved for members with an account.', 'Uchapishaji ni kwa wanachama wenye akaunti.', 'Kputa kitungu kwa membo oyo bazali na koti.'],
'Voir ma page publique': ['See my public page', 'Tazama ukurasa wangu wa wazi', 'Tala siti yangu ya moko'],
'Votre article sera immédiatement visible par tous les visiteurs sur':
    ['Your product will be immediately visible to all visitors on', 'Bidhaa yako itaonekana mara moja kwa wageni wote kwenye'],
'et sur la page publique de votre magasin.': ['and on your shop\'s public page.', 'na kwenye ukurasa wa wazi wa duka lako.', 'na kwenye siti ya moko ya magazi yoko.'],
'Titre de l\'article *': ['Product title *', 'Kichwa cha bidhaa *', 'Zaiti ya kitungu *'],
'Le titre doit contenir au moins 3 caractères.': ['The title must contain at least 3 characters.', 'Kichwa lazima kiwe na herufi 3 angalau.', 'Zaiti ezalaka na malembo 3 minimum.'],
'Catégorie *': ['Category *', 'Kategoria *', 'Bantanyi *'],
'Choisissez une catégorie.': ['Choose a category.', 'Chagua kategoria.', 'Sala bantanyi.'],
'Prix de vente (FC) *': ['Selling price (FC) *', 'Bei ya kuuza (FC) *', 'Motuya ya kengesa (FC) *'],
'Le prix doit être supérieur à 0.': ['The price must be greater than 0.', 'Bei lazima iwe juu ya 0.', 'Motuya ezalaka na maloboka above 0.'],
'Ancien prix (FC)': ['Old price (FC)', 'Bei ya awali (FC)', 'Motuya ya liboso (FC)'],
'Doit être supérieur au prix de vente.': ['Must be higher than the selling price.', 'Lazima iwe juu kuliko bei ya kuuza.', 'Ezalaka na maloboka poso ya motuya ya kengesa.'],
'Stock invalide.': ['Invalid stock.', 'Hesabu ya duka si sahihi.', 'Stock ezali malongo.'],
'Étiquette & options': ['Label & options', 'Lebo na chaguo', 'Etiketi na bongoko'],
'Aucune étiquette': ['No label', 'Hakuna lebo', 'Eza etiketi'],
'Visible immédiatement sur le site': ['Visible on the site immediately', 'Inaonekana papo hapa kwenye tovuti', 'Emonana noki na siti'],
'Photos de l\'article': ['Product photos', 'Picha za bidhaa', 'Bazani ya kitungu'],
'Cliquez ou glissez-déposez les photos': ['Click or drag and drop the photos', 'Bofya au buruta picha', 'Bota to tambika bazani'],
'png, jpg, gif ou webp — 3 Mo maximum par photo': ['png, jpg, gif or webp — 3 MB maximum per photo', 'png, jpg, gif au webp — Mo 3 kwa kila picha', 'png, jpg, gif to webp — Mo 3 kwa kila bazani'],
'Publier l\'article': ['Publish the product', 'Chapisha bidhaa', 'Puta kitungu'],
'Publier dans mon magasin': ['Publish in my shop', 'Chapisha kwenye duka langu', 'Puta kwenye magazi yangu'],
'Comment ça marche': ['How it works', 'Jinsi inavyofanya kazi', 'Ndengeyo esalaka'],
'Remplissez le titre, la catégorie et le prix.': ['Fill in the title, category and price.', 'Jaza kichwa, kategoria na bei.', 'Yaza zaiti, bantanyi na motuya.'],
'Ajoutez jusqu\'à 8 photos : elles défileront seules sur votre article.':
    ['Add up to 8 photos: they will scroll by themselves on your product.',
     'Ongeza hadi picha 8: zitajisogeza zenyewe kwenye bidhaa yako.',
     'Yisa bazani hatari 8: ezotambika yazo koko kati ya kitungu kiko.'],
'Autant de détails que vous voulez (matière, couleur, dimensions…) pour convaincre l\'acheteur.':
    ['As many details as you want (material, colour, dimensions…) to convince the buyer.',
     'Maelezo unayotaka (nzuri, rangi, vipimo…) ili kumsogeza mnunuzi.',
     'Maelezo oyo ekotaka (nzuri, mboko, bolingo…) koba ekambwisa mokonji.'],
'Cliquez sur « Publier » : l\'article apparaît aussitôt sur votre page publique.':
    ['Click "Publish": the product appears immediately on your public page.',
     'Bofya "Chapisha": bidhaa itaonekana papo hapa kwenye ukurasa wako wa wazi.',
     'Bota "Puta": kitungu kitakonekana papo hapa kwenye siti yako ya moko.'],
'Les visiteurs peuvent aimer l\'article et le mettre au panier.':
    ['Visitors can like the product and put it in the cart.', 'Wageni wanaweza kupenda bidhaa na kuiweka kikapuni.', 'Basissi banaweza kukita kitungu na kukisala kwenye koba.'],
'Aperçu de votre boutique': ['Preview of your shop', 'Muhtasari wa duka lako', 'BONI ya magazi yoko'],
articles: ['products', 'bidhaa', 'vitungu'],
'0 article publié': ['0 product published', 'Bidhaa 0 zimechapishwa', 'Vitungu 0 vo bana'],
'Ouvrir ma boutique': ['Open my shop', 'Fungua duka langu', 'Sala boutiki yangu'],
'Étiquette': ['Label', 'Lebo', 'Etiketi'],
'Étiquette invalide.': ['Invalid label.', 'Lebo si sahihi.', 'Etiketi ezali malongo.'],
'Maximum 500 caractères.': ['Maximum 500 characters.', 'Herufi 500 kwa ubora.', 'Malembo 500 likiti.'],
'Lien d\'image invalide.': ['Invalid image link.', 'Kiungo cha picha si sahihi.', 'Kebo ya bazani ezali malongo.'],
'Valeur (ex. Bois massif)': ['Value (e.g. Solid wood)', 'Thamani (mfano: Mbao nzito)', 'Motuya (ndano: Mbao makasi)'],
'Une ligne par caractéristique : matière, couleur, dimensions, état, marque… Le nombre de lignes est libre.':
    ['One line per feature: material, colour, dimensions, condition, brand… any number of lines.',
     'Mstari mmoja kwa kila sifa: nzuri, rangi, vipimo, hali, namba… idadi ya mistari ni ya uhuru.',
     'Mokolo moko kwa kila kitupa: nzuri, mboko, bolingo, bomoko, namba… idadi ya mikolo ezali na uhuru.'],
'Ajoutez jusqu\'à 8 photos par article : elles se relaient seules toutes les 5 secondes sur la fiche. Le nombre de détails est libre — ils s\'affichent dans le tableau « Détails de l\'article ».':
    ['Add up to 8 photos per product: they rotate by themselves every 5 seconds on the page. The number of details is free — they appear in the "Product details" table.',
     'Ongeza hadi picha 8 kwa kila bidhaa: zitajirudisha zenyewe kila sekunde 5 kwenye ukurasa. Idadi ya maelezo ni ya uhuru — zinaonyesha kwenye jedwali "Maelezo ya bidhaa".',
     'Yisa bazani hatari 8 kwa kila kitungu: ezotambika yazo koko kila ntongo 5 kwenye situ. Idadi ya maelezo ezali na uhuru — emonana kwenye eteyelo "Maelezo ya kitungu".'],
'Boutique propriétaire *': ['Owning shop *', 'Duka lenye bidhaa *', 'Boutiki oyo ekangwa *'],
'Choisissez la boutique qui reçoit l\'article.': ['Choose the shop that receives the product.', 'Chagua duka linalopokea bidhaa.', 'Sala boutiki oyo ekoyoka kitungu.'],
'Article publié dans votre magasin !': ['Product published in your shop!', 'Bidhaa imechapishwa kwenye duka lako!', 'Kitungu kimesaputwa kwenye magazi yoko!'],
'Article publié sur la plateforme.': ['Product published on the platform.', 'Bidhaa imechapishwa kwenye tovuti.', 'Kitungu kimesaputwa kwenye siti.'],
'Article chargé — modifiez puis enregistrez.':
    ['Product loaded — edit then save.', 'Bidhaa imewekwa — badilisha kisha hifadhi.', 'Kitungu kimeload — senga kisha bambanza.'],

/* ---------- administration ---------- */
'Tableau de surveillance': ['Dashboard', 'Dashibodi', 'Etseyelo ya supervision'],
'Tableau de surveillance — BusinessEnLigne': ['Dashboard — BusinessEnLigne', 'Dashibodi — BusinessEnLigne', 'Etseyelo ya supervision — BusinessEnLigne'],
'Administration': ['Administration', 'Uongozi', 'Uongozi'],
'Accès réservé à l\'administration': ['Access reserved for administrators', 'Ufikiaji kwa wongozi pekee', 'Biso ep fumba na bongisi kaka'],
'Ce tableau de surveillance est réservé aux administrateurs de la plateforme.':
    ['This dashboard is reserved for the platform administrators.',
     'Dashibodi hii ni kwa wongozi wa tovuti pekee.', 'Etseyelo oyo ya supervision ekotambwa kwa bongisi ba siti pekee.'],
'Pour donner les droits d\'administration à votre propre compte, exécutez':
    ['To give administration rights to your own account, run', 'Kupea akaunti yako haki za uongozi, endesha'],
'Vue d\'ensemble': ['Overview', 'Muhtasari', 'BONI'],
'Utilisateurs': ['Users', 'Watumiaji', 'Basalisi'],
'Activité des 30 derniers jours': ['Activity over the last 30 days', 'Shughuli ya siku 30 za mwisho', 'Mekama ya mikolo 30 oyo elaluki'],
'Inscriptions': ['Sign-ups', 'Usajili', 'Bokabolami'],
'Catégories': ['Categories', 'Kategoria', 'Bantanyi'],
'Stocks faibles': ['Low stock', 'Hisa chini', 'Stock malinge'],
'Dernières inscriptions': ['Latest sign-ups', 'Usajili wa mwisho', 'Bokabolami oyo elaluki'],
'Boutiques les plus actives': ['Most active shops', 'Duka lenye shughuli nyingi', 'Boutiki oyo ekokooso'],
'Articles les plus aimés': ['Most liked products', 'Bidhaa zinazopendwa zaidi', 'Vitungu vyo likitwa mingi'],
'Comptes': ['Accounts', 'Akaunti', 'Bakoti'],
'Tous les comptes': ['All accounts', 'Akaunti zote', 'Bakoti bonso'],
'Plus récents': ['Most recent', 'Ya mwisho', 'Ya mboko'],
'Nom': ['Name', 'Jina', 'Bokomo'],
'Nom (A-Z)': ['Name (A-Z)', 'Jina (A-Z)', 'Bokomo (A-Z)'],
'Plus anciennes': ['Oldest', 'Za zamani', 'Za liboso'],
'Ville': ['City', 'Mji', 'Mboka'],
'Achats': ['Purchases', 'Ununuzi', 'Soma'],
'Ventes': ['Sales', 'Uuzaji', 'Kengesa'],
'CA ventes': ['Sales revenue', 'Mapato ya uuzaji', 'Mbongo ya kengesa'],
'Panier moyen': ['Average basket', 'Kikapu wastani', 'Koba ya average'],
'Chiffre d\'affaires': ['Revenue', 'Mapato', 'Mapato'],
'chiffre d\'affaires': ['revenue', 'mapato', 'mapato'],
'administrateur(s)': ['administrator(s)', 'mwingenzi', 'mongisi'],
'tous membres confondus': ['all members combined', 'wa wanachama wote', 'ya membo botoba'],
'sur 7 jours': ['in 7 days', 'kwa siku 7', 'kwa mikolo 7'],
'en alerte': ['on alert', 'zina hatari', 'zo monene danger'],
'Inscription': ['Sign-up', 'Usajili', 'Bokabolami'],
'Prix croissant': ['Price: low to high', 'Bei: kutoka nafuu kwa ghali', 'Motuya: banda li nseka koko'],
'Masquer le formulaire': ['Hide the form', 'Ficha fomu', 'Bana fomolo'],
'Afficher le formulaire': ['Show the form', 'Onyesha fomu', 'Sola fomolo'],
'Ajouter un article publié': ['Add a published product', 'Ongeza bidhaa iliyochapishwa', 'Yisa kitungu oyo ebana'],
'Annuler la modification': ['Cancel the edit', 'Ghairi mabadiliko', 'Tikita mabadiliko'],
'Enregistrer les modifications': ['Save changes', 'Hifadhi mabadiliko', 'Bambanza mabadiliko'],
'Tous les articles': ['All products', 'Bidhaa zote', 'Vitungu bonso'],
'Article': ['Product', 'Bidhaa', 'Kitungu'],
'Publié': ['Published', 'Imetolewa', 'Ebana'],
'Masqué': ['Hidden', 'Imefichwa', 'Esitirwe'],
'Référence': ['Reference', 'Kumbukumbu', 'Kezoko'],
'Acheteur': ['Buyer', 'Mnunuzi', 'Mokonji'],
'Aucune commande': ['No orders', 'Hakuna agizo', 'Eza commande'],
'Vos commandes validées apparaîtront ici.': ['Your confirmed orders will appear here.', 'Maagizo yako yaliyokubaliwa yataonekana hapa.', 'Commandes yoko oyo ekaboli ekotakonekana awawa.'],
'Modération': ['Moderation', 'Usimamizi', 'Supervision'],
'Vous devez être connecté pour accéder au tableau de surveillance.':
    ['You must be logged in to access the dashboard.', 'Lazima uingie ili kufikia dashibodi.', 'Lazima ukote koba osala na eteyelo ya supervision.'],
'Déconnexion': ['Log out', 'Toka', 'Songa'],
'Se déconnecter': ['Log out', 'Toka', 'Songa'],
'Aucun compte ne correspond à la recherche.': ['No account matches your search.', 'Hakuna akaunti inayolingana na utafutaji wako.', 'Eza koti ekoteyemola na moloko yoyo.'],
'Aucune commande pour le moment.': ['No orders at the moment.', 'Hakuna agizo kwa sasa.', 'Eza commande kwa sik hii.'],
'Aucune inscription.': ['No sign-ups.', 'Hakuna usajili.', 'Eza bokabolami.'],
'Tous les stocks sont corrects.': ['All stock levels are correct.', 'Hesabu zote za duka ni sahihi.', 'Stock bonso ezali na malongo.'],
'Tout est en ordre : aucun point de vigilance.': ['Everything is in order: nothing to watch.', 'Kila kitu ni sawa: hakuna kinachohitaji kushughulikiwa.', 'Yose ezali na bwanga: eza kinacho esalaka.'],
'Statut de la commande mis à jour.': ['Order status updated.', 'Hali ya agizo imesasishwa.', 'Boyeselo ya commande esungusswe.'],
'Rôle administrateur mis à jour.': ['Administrator role updated.', 'Jukumu la mwingenzi limewasishwa.', 'Ndicho ya mongisi esungusswe.'],
'Administrateur': ['Administrator', 'Mwingenzi', 'Mongisi'],
'Modérateur': ['Moderator', 'Msimamizi', 'Mekoma'],
'Comptes suspendus': ['Suspended accounts', 'Akaunti zilizositishwa', 'Bakoti oyo esimama'],
'Commandes récentes': ['Recent orders', 'Maagizo ya hivi karibuni', 'Commandes oyo ekoya'],
'Utilisateurs récents': ['Recent users', 'Watumiaji wa hivi karibuni', 'Basissi oyo bayoya'],
'Articles populaires': ['Popular products', 'Bidhaa maarufu', 'Vitungu vyo bakolo'],
'Aucun article ne correspond à la recherche.': ['No products match your search.', 'Hakuna bidhaa inayolingana na utafutaji wako.', 'Eza kitungu ekoteyemola na moloko yoyo.'],
'Aucun J\'aime pour l\'instant': ['No likes yet', 'Bado hakuna mapendeleo', 'Bado ezali na mipendo teko'],
'Vous ne suivez plus cette boutique.': ['You no longer follow this shop.', 'Huchafuati duka hili tena.', 'Osusika teko boutiki oyo tena.'],
'Connectez-vous pour aimer un article': ['Log in to like a product', 'Ingia ili kupenda bidhaa', 'Kota ili kukita kitungu'],
'Connectez-vous pour envoyer des images': ['Log in to upload images', 'Ingia ili kutuma picha', 'Kota ili kotuma bazani'],
'Connectez-vous pour suivre une boutique': ['Log in to follow a shop', 'Ingia ili kufuatilia duka', 'Kota ili kosuka boutiki'],
'Connectez-vous pour continuer': ['Log in to continue', 'Ingia ili kuendelea', 'Kota ili kwendela'],
'Aucune commande Vos commandes validées apparaîtront ici.': ['No orders. Your confirmed orders will appear here.', 'Hakuna agizo. Maagizo yako yaliyokubaliwa yataonekana hapa.', 'Eza commande. Commandes yoko oyo ekaboli ekotakonekana awawa.'],
'En promotion': ['On sale', 'Kwenye ofa', 'Kwenye mabaya'],
'Nouvelle': ['New', 'Mpya', 'Mbola'],
'Meilleure': ['Best', 'Bora', 'Moli'],
'Recherche': ['Search', 'Tafuta', 'Sola'],
'Stock faible': ['Low stock', 'Hisa chini', 'Stock malinge'],
'Publier': ['Publish', 'Chapisha', 'Puta'],
'Masquer': ['Hide', 'Ficha', 'Bana'],
'Supprimer le compte': ['Delete account', 'Futa akaunti', 'Kikula koti'],
'Compte suspendu.': ['Account suspended.', 'Akaunti imesimamishwa.', 'Koti emesimama.'],
'Compte réactivé.': ['Account reactivated.', 'Akaunti imeanza tena.', 'Koti ebandika tena.'],
'Suspendre le compte': ['Suspend the account', 'Simamisha akaunti', 'Simama koti'],
'Réactiver le compte': ['Reactivate the account', 'Anza akaunti tena', 'Zalisa koti tena'],
'Supprimer définitivement': ['Permanently delete', 'Futa kwa kudumu', 'Kikula nglutshime'],

/* ---------- contact ---------- */
'Envoyez-nous un message': ['Send us a message', 'Tuma ujumbe wetu', 'Tutoma mokozo'],
'Votre nom': ['Your name', 'Jina lako', 'Bokomo yoko'],
'Veuillez saisir votre nom.': ['Please enter your name.', 'Tafadhali andika jina lako.', 'Salamu likita bokomo yoko.'],
'Veuillez saisir un email valide.': ['Please enter a valid email.', 'Tafadhali andika barua pepe sahihi.', 'Salamu likita email elandelela.'],
'Numéro à 10 chiffres minimum.': ['Number with at least 10 digits.', 'Namba yenye angalia tarakimu 10.', 'Namba oyo ezali na motoba 10 minimum.'],
'Message / commande spéciale': ['Message / special order', 'Ujumbe / agizo la kipekee', 'Mokozo / commande oyo ekokeye'],
'Votre message est trop court.': ['Your message is too short.', 'Ujumbe wako ni mfupi mno.', 'Mokozo yoko monene moke.'],
'Votre demande...': ['Your request...', 'Ombi lako...', 'Mokopese yoko...'],
'Envoyer le message': ['Send the message', 'Tuma ujumbe', 'Toma mokozo'],
'Envoyez-nous un message': ['Send us a message', 'Tuma ujumbe', 'Tutoma mokozo'],
'Message envoyé, nous vous répondons sous 24h.':
    ['Message sent, we reply within 24h.', 'Ujumbe umetumwa, tutajibu ndani ya masaa 24.', 'Mokozo oyatoma, tokotoka yo kwa masaa 24.'],
'Merci de corriger les champs en rouge.': ['Please correct the red fields.', 'Tafadhali sahihisha sehemu zilizo nyekundu.', 'Salamu bobongolisa ndani oyo ezali mbongo.'],
'Téléphone': ['Phone', 'Simu', 'Telefoni'],
'Adresse': ['Address', 'Anwani', 'Lokisyo'],
'Horaires': ['Opening hours', 'Miaza', 'Ngoba za ntango'],
'Lun – Sam : 08h00 à 19h00': ['Mon – Sat: 8am to 7pm', 'Jumatatu – Jumamosi: 8:00 asubuhi hadi 7:00 jioni', 'Ndoko – Sat : 08h00 kati ya 19h00'],
'Suivez-nous': ['Follow us', 'Tufuate', 'Sukatana biso'],
'À propos': ['About', 'Kuhusu', 'Kusu'],

/* ---------- pied de page ---------- */
'Conditions': ['Terms', 'Sheria', 'Mibango'],
'Conditions générales de vente': ['Terms of sale', 'Sheria za mauzo', 'Mibango ya nzete'],
'Conditions d\'utilisation': ['Terms of use', 'Sheria za matumizi', 'Mibango ya bomoko'],
'Politique de confidentialité': ['Privacy policy', 'Sera ya usiri', 'Mibango ya kifisili'],
'Mentions légales': ['Legal notice', 'Taarifa za kisheria', 'Maelezo ya sheria'],
'Besoin d\'aide ?': ['Need help?', 'Unahitaji msaada?', 'Eneka lisungi?'],
'Centre d\'aide': ['Help centre', 'Kituo cha msaada', 'Kituo ya lisungi'],
'Suivi de commande': ['Order tracking', 'Kufuatilia agizo', 'Sala mali'],
'Retours et remboursements': ['Returns and refunds', 'Marejezo na mafutiano', 'Mizengo na mbokiso'],
'Livraison & paiement': ['Delivery & payment', 'Usafirishaji na malipo', 'Posi na mboko'],
'Modes de livraison': ['Delivery methods', 'Njia za usafirishaji', 'Njia za mayebisho'],
'Frais de port': ['Shipping fees', 'Gharama za usafirishaji', 'Mbongo ya mayebisho'],
'Moyens de paiement': ['Payment methods', 'Njia za malipo', 'Njia ya mboko'],
'Nos services': ['Our services', 'Huduma zetu', 'Masevisi biso'],
'Ventes Flash': ['Flash sales', 'Bei za muda mfupi', 'Kutuza ya noki'],
'Prime': ['Prime', 'Prime', 'Prime'],
'Programme vendeur': ['Seller programme', 'Mpango wa wauzaji', 'Mokanda ya baongisi'],
'Boutiques partenaires': ['Partner shops', 'Duka washiriki', 'Boutiki bashiki'],
'Réalisé par': ['Built by', 'Imejengwa na', 'Isejengwa na'],
'© 2026 BusinessEnLigne. Tous droits réservés. | Panier sauvegardé en base locale (LocalStorage) | Réalisé par':
    ['© 2026 BusinessEnLigne. All rights reserved. | Cart saved in local storage (LocalStorage) | Built by',
     '© 2026 BusinessEnLigne. Haki zote zimehifadhiwa. | Kikapu kimehifadhiwa ndani (LocalStorage) | Imejengwa na',
     '© 2026 BusinessEnLigne. Mikono yote iko hifadhiwa. | Koba ekatikami na lisusu ya ndani (LocalStorage) | Isejengwa na'],
'© 2026 BusinessEnLigne | Réalisé par':
    ['© 2026 BusinessEnLigne | Built by',
     '© 2026 BusinessEnLigne | Imejengwa na',
     '© 2026 BusinessEnLigne | Isejengwa na'],
'| Panier avec base de données locale (LocalStorage)':
    ['| Cart with local database (LocalStorage)', '| Kikapu chenye hifadhi ya ndani (LocalStorage)', '| Koba oyo ezali na lisusu ya ndani (LocalStorage)'],
'| Panier sauvegardé en base locale (LocalStorage)':
    ['| Cart saved in local storage (LocalStorage)', '| Kikapu kimehifadhiwa ndani (LocalStorage)', '| Koba ekatikami na lisusu ya ndani (LocalStorage)'],

/* ---------- messages système ---------- */
'J\'aime disponible uniquement avec le serveur (node server.js).':
    ['Likes are only available with the server running (node server.js).',
     'Mapendeleo yanapatikana tu kwa seva (node server.js).',
     'Mipendo ekotambama kaka peke na seva (node server.js).'],
'Article ajouté à vos J\'aime': ['Product added to your likes', 'Bidhaa imeongezwa kwenye mapendeleo yako', 'Kitungu kimeyiswa kwenye mipendo yoko'],
'J\'aime retiré': ['Like removed', 'Mapendeleo yameondolewa', 'Kupenda kukitwa'],
'ajouté au panier': ['added to cart', 'imeongezwa kikapuni', 'eyeiswami koba'],
'Votre panier est vide': ['Your cart is empty', 'Kikapu chako ni tupu', 'Koba yako ezali na tata'],
'Commande confirmée': ['Order confirmed', 'Agizo limekubaliwa', 'Commande ekaboli'],
'Livraison estimée sous 24 à 48h': ['Estimated delivery within 24 to 48h', 'Usafirishaji unatarajiwa ndani ya masaa 24–48', 'Posi ekotambami ndani ya masaa 24–48'],
'commande enregistrée localement.': ['order saved locally.', 'agizo limehifadhiwa ndani.', 'commande ebambanzwe ndani.'],
'Bienvenue sur Prime ! Livraison offerte dès aujourd\'hui.':
    ['Welcome to Prime! Free delivery from today.', 'Karibu Prime! Usafirishaji wa bure kuanzia leo.', 'Boyei bolingo na Prime! Posi ya mahuri kuanzia lelo.'],
'Votre boutique est créée.': ['Your shop has been created.', 'Duka lako limeundwa.', 'Magazi yoko matengulwe.'],
'Bienvenue !': ['Welcome!', 'Karibu!', 'Boyei bolingo!'],
'Identifiez-vous': ['Sign in', 'Ingia', 'Kota'],
'[BusinessEnLigne] serveur absent → catalogue local utilisé':
    ['[BusinessEnLigne] server missing → local catalogue used',
     '[BusinessEnLigne] seva haipo → katalogi ya ndani imetumika',
     '[BusinessEnLigne] seva ezali teko → katalogo ya ndani echoshi'],
'Ce compte a les droits d\'administration.': ['This account has administrator rights.', 'Akaunti hii ina haki za uongozi.', 'Koti oyo ezali na haki za uongozi.'],
'Vous devez être connecté.': ['You must be logged in.', 'Lazima uingie.', 'Lazima ukote.'],
'Compte réactivé.': ['Account reactivated.', 'Akaunti imeanza tena.', 'Koti ebandika tena.'],
'Article chargé — modifiez puis enregistrez.': ['Product loaded — edit then save.', 'Bidhaa imewekwa — badilisha kisha hifadhi.', 'Kitungu kimeload — senga kisha bambanza.'],
'Ajoutez jusqu\'à 8 photos par article.': ['Add up to 8 photos per product.', 'Ongeza hadi picha 8 kwa kila bidhaa.', 'Yisa bazani hatari 8 kwa kila kitungu.'],
'Seules photo(s) ont été ajoutées (maximum ).':
    ['Only some photos were added (maximum ).', 'Baadhi ya picha pekee zimeongezwa (maximum ).', 'Bazani tofuatano ndiyo oyo ezeyiswami (maximum ).'],
'détails maximum par article.': ['details maximum per product.', 'maelezo kwa kila bidhaa.', 'maelezo maximum kwa kila kitungu.'],
'photos maximum par article.': ['photos maximum per product.', 'picha kwa kila bidhaa.', 'bazani maximum kwa kila kitungu.'],
'— au lieu de (-%)': ['instead of (-%)', 'badala ya (-%)', 'kamba ya (-%)'],
'Soit -% · badge « Promotion » appliqué': ['Or -% · "Sale" badge applied', 'Au -% · alama "Promo" imetumika', 'Kama -% · etiketi "Mbayo" esaliswami'],
'Se termine dans': ['Ends in', 'Inaisha baada ya', 'Ekopela na'],
'Plus que': ['Only', 'Zimebaki', 'Bado kuwepo'],

/* ---------- bandeau mobile ---------- */
'Navigation rapide': ['Quick navigation', 'Uramboku wa haraka', 'Balula ya mbale'],
'Catégories': ['Categories', 'Kategoria', 'Bantanyi'],
'Compte': ['Account', 'Akaunti', 'Koti'],

/* ---------- formulaires de connexion (styles) ---------- */
'Mot de passe incorrect.': ['Incorrect password.', 'Nenosiri si sahihi.', 'Bobwami ezali malongo.'],
'Votre session a expiré.': ['Your session has expired.', 'Kifungu chako kimekwisha.', 'Lingendo yoko ekotonga.'],
'Completez le mot de passe.': ['Enter the password.', 'Weka nenosiri.', 'Yisa bobwami.'],
'L\'article « X » a été supprimé.':
    ['The product "{0}" was deleted.', 'Bidhaa "{0}" imefutwa.', 'Kitungu "{0}" kimefutwa.']
};

/* On complète les traductions des messages composés par le JS :
   ils contiennent des valeurs, on les déclare ici avec des {0}. */
Object.assign(DICT, {
    /* --- panneau de thème (theme.js) --- */
    'Luminosité':        ['Brightness', 'Mwanga', 'Mwangaza'],
    'Clair':             ['Light', 'Cheka', 'Moke'],
    'Sombre':            ['Dark', 'Giza', 'Mointe'],
    'Auto':              ['Auto', 'Kiotomatiki', 'Nalikila'],
    'Couleur':           ['Colour', 'Rangi', 'Mboko'],
    'Orange':            ['Orange', 'Chungwa', 'Lantier'],
    'Émeraude':          ['Emerald', 'Kijani', 'Makokoto'],
    'Azur':              ['Azure', 'Bluu', 'Bulu'],
    'Rose':              ['Pink', 'Waridi', 'Mboko ya malongo'],
    'Violet':            ['Purple', 'Zambarau', 'Lilas'],
    'Votre choix est gardé sur cet appareil, sur toutes les pages.':
        ['Your choice is saved on this device, on every page.',
         'Chaguo lako limehifadhiwa kwenye kifaa hiki, kwenye kila ukurasa.',
         'Songo lako lembalimi kwenye moto oyo, na bope moninga.'],

    /* --- messages composés par javascript.js --- */
    '{0} ajouté au panier':          ['{0} added to the cart', '{0} imeongezwa kwenye kikapuni', '{0} eyiswami kwenye koba'],
    '{0} résultats':                  ['{0} results', 'matokeo {0}', 'seyo {0}'],
    '{0} résultats dans {1}':         ['{0} results in {1}', 'matokeo {0} ndani ya {1}', 'seyo {0} kati ya {1}'],
    '{0} résultats pour « {1} »':    ['{0} results for "{1}"', 'matokeo {0} kwa "{1}"', 'seyo {0} kwa "{1}"'],
    '{0} résultats pour « {1} » dans {2}': ['{0} results for "{1}" in {2}', 'matokeo {0} kwa "{1}" ndani ya {2}', 'seyo {0} kwa "{1}" kati ya {2}'],
    'livré le {0}':                   ['delivered on {0}', 'imewasilishwa {0}', 'ekomama na {0}'],
    'Commande {0} confirmée — {1}':  ['Order {0} confirmed — {1}', 'Agizo {0} limehakikiwa — {1}', 'Commande {0} ekondisami — {1}'],
    '★ {0} sur 5 · {1} avis':         ['★ {0} out of 5 · {1} reviews', '★ {0} kati ya 5 · maoni {1}', '★ {0} na 5 · mazamanu {1}'],
    '({0} avis)':                     ['({0} reviews)', '({0} maoni)', '({0} mazamanu)'],
    '{0} sur 5':                      ['{0} out of 5', '{0} kati ya 5', '{0} na 5'],
    '{0} photo(s) dans la galerie':   ['{0} photos in the gallery', 'picha {0} kwenye galeria', 'bazani {0} kati ya galeri'],
    '{0} photo':                      ['{0} photo', 'picha {0}', 'bazani {0}'],
    '{0} article(s) en stock':        ['{0} product(s) in stock', 'bidhaa {0} zipo stoo', 'vitungu {0} evipo koko'],
    'Plus que {0} en stock':          ['Only {0} left in stock', 'Zimebaki {0} kwenye stoo', 'Only {0} esaliswami koko'],
    '{0} personnes':                  ['{0} people', 'watu {0}', 'bantu {0}'],
    '{0} personne':                   ['{0} person', 'mtu {0}', 'muntu {0}'],
    'publié le {0}':                  ['published on {0}', 'kilichapishwa {0}', 'ebana na {0}'],
    '{0} article(s) · {1}':           ['{0} product(s) · {1}', 'bidhaa {0} · {1}', 'vitungu {0} · {1}'],
    '{0} · article(s)':               ['{0} · product(s)', '{0} · bidhaa', '{0} · kitungu'],
    '♥ J\'aime · {0}':                ['♥ Likes · {0}', '♥ Mapendeleo · {0}', '♥ Mipendo · {0}'],
    'ou 3x {0} sans frais':           ['or 3x {0} interest-free', 'au 3x {0} bila riba', 'kama 3x {0} bila mbongo'],
    'Avenue de la Libération, Lubumbashi, RDC': ['Liberation Avenue, Lubumbashi, DRC', 'Avenue de la Libération, Lubumbashi, RDC', 'Avenue de la Libération, Lubumbashi, RDK'],
    'Le compte « {0} » n\'a pas les droits d\'administration.':
        ['The account "{0}" has no administrator rights.',
         'Akaunti "{0}" haina haki za uongozi.',
         'Koti "{0}" ezali na haki teko za uongozi.'],
    'Article « {0} » supprimé.': ['Product "{0}" deleted.', 'Bidhaa "{0}" imefutwa.', 'Kitungu "{0}" kimefutwa.'],
    'Commande {0} — {1}': ['Order {0} — {1}', 'Agizo {0} — {1}', 'Commande {0} — {1}'],
    'Total : {0}': ['Total: {0}', 'Jumla: {0}', 'Total : {0}'],
    'Rupture de stock':               ['Out of stock', 'Stoo imeisha', 'Ekalasi na koko'],
    'En stock':                       ['In stock', 'Ipo stoo', 'Epoyo koko'],
    'Livraison <b>GRATUITE</b> le <b>{0}</b> à Lubumbashi':
        ['Free delivery on <b>{0}</b> in Lubumbashi', 'Usafirishaji wa bure siku ya <b>{0}</b> Lubumbashi', 'Posi ya mahuri ekotoba na <b>{0}</b> Lubumbashi'],
    'Livraison calculée à l\'étape suivante': ['Shipping calculated at the next step', 'Usafirishaji utahesabiwa katika hatua inayofuata',     'Posi ekotangwa katika mwambo oyo elandayo'],
    'Livraison STANDARD offerte ✓':  ['STANDARD delivery free ✓', 'Usafirishaji wa STANDARD ni bure ✓', 'Posi ya STANDARD mahuri ✓'],
    'Livraison STANDARD : 1 500 FC (offerte dès 150 000 FC)': ['STANDARD delivery: 1 500 FC (free from 150 000 FC)', 'Usafirishaji wa STANDARD: 1 500 FC (bure kuanzia 150 000 FC)', 'Posi ya STANDARD: 1 500 FC (mahuri kuanzia 150 000 FC)'],
    'Qté :':                          ['Qty:', 'Idadi:', 'Bungi:'],
    'Supprimer':                      ['Remove', 'Ondoa', 'Kikoma'],
    'Ajouter au panier':              ['Add to cart', 'Ongeza kikapuni', 'Yisa kwenye koba'],
    'Votre panier est vide':          ['Your cart is empty', 'Kikapuni chako ni tupu', 'Koba yako ezali na tata'],
    'Ajoutez des articles pour commencer.': ['Add products to get started.', 'Ongeza bidhaa kuanza.', 'Yisa vitungu toboka.'],
    'Promotion':                      ['Sale', 'Promo', 'Mbayo'],
    'Nouveau':                        ['New', 'Mpya', 'Mpya'],
    'Meilleure vente':                ['Best seller', 'Zinazouzwa zaidi', 'Ezakitisoma'],
    "J'aime":                          ['Like', 'Penda', 'Konda'],
    'J\'aime':                         ['Likes', 'Mapendeleo', 'Mipendo'],
    'Boutique':                       ['Shop', 'Duka', 'Boutiki'],
    'Achat vérifié':                  ['Verified purchase', 'Ununuzi ulioidhibitishwa', 'Soko oyo ekosolwami'],
    'Avis vérifié le mois dernier':   ['Review verified last month', 'Maoni yaliyothibitishwa mwezi uliopita', 'Mopotamano ekosolwami kwa mwembe oyo elaloba'],
    '{0} articles':                   ['{0} products', 'bidhaa {0}', 'vitungu {0}'],
    '{0} J\'aime':                     ['{0} likes', 'mapendeleo {0}', 'mipendo {0}'],
    'dès {0}':                         ['from {0}', 'kuanzia {0}', 'kutanza {0}'],
    '{0} boutiques proposent {1} articles — cliquez sur une boutique pour voir ses photos et ses prix.':
        ['{0} shops offer {1} products — click a shop to see its photos and prices.',
         'Duka {0} linao bidhaa {1} — bofungu duka ili kuona picha na bei zake.',
         'Boutiki {0} ekati na vitungu {1} — bosangeya boutiki oyo komona bazani na mitinda yayo.'],
    'Voir les {0} boutiques':          ['See the {0} shops', 'Ona duka {0}', 'Tala boutiki {0}'],
    'Tout le catalogue de la plateforme': ['The whole platform catalogue', 'Katalogi nzima ya tovuti', 'Katalogo nzima ya siti'],
    'Lubumbashi':                      ['Lubumbashi', 'Lubumbashi', 'Lubumbashi'],
    'Commande':                       ['Order', 'Agizo', 'Commande'],
    'Gratuite, reçue sous 24 à 48 h à Lubumbashi':
        ['Free, received within 24 to 48h in Lubumbashi', 'Bure, imepokelwa kwa masaa 24–48 Lubumbashi', 'Mahuri, ekomama kwa masaa 24–48 Lubumbashi'],
    'Mobile Money, carte bancaire ou espèces à la livraison':
        ['Mobile Money, bank card or cash on delivery', 'Mobile Money, kadi ya benki au pesa tasla wakati wa kupokea', 'Mobile Money, kadi ya banki au mbongo wakati ya komama'],
    'Offerte et prioritaire': ['Free and priority', 'Bure na ya kwanza', 'Mahuri na ya liboko'],
    '{0} photos maximum par article.': ['{0} photos maximum per product.', 'Picha {0} kwa kila bidhaa.', 'Bazani {0} maximum kwa kila kitungu.'],
    '{0} détails maximum par article.': ['{0} details maximum per product.', 'Maelezo {0} kwa kila bidhaa.', 'Maelezo {0} maximum kwa kila kitungu.'],
    'LIVRAISON PRIME': ['PRIME DELIVERY', 'USAFIRISHAJI WA PRIME', 'POSI YA PRIME'],
    '· au lieu de (-%)': ['· instead of (-%)', '· badala ya (-%)', '· kamba ya (-%)'],
    'Réinitialiser':                  ['Reset', 'Anza upya', 'Bongama'],
    'Bonjour, {0}':                   ['Hello, {0}', 'Habari, {0}', 'Mbote, {0}'],
    'Slide {0}':                       ['Slide {0}', 'Slaidi {0}', 'Kibenge {0}'],
    'Bienvenue sur Prime ! Livraison offerte dès aujourd\'hui.':
        ['Welcome to Prime! Free delivery from today.', 'Karibu Prime! Usafirishaji wa bure kuanzia leo.', 'Boyei bolingo na Prime! Posi ya mahuri kuanzia lelo.'],
    '{0} — administrateur':          ['{0} — administrator', '{0} — mwingenzi', '{0} — mongisi'],
    '{0} article(s) en rupture de stock': ['{0} product(s) out of stock', 'bidhaa {0} zimeisha stoo', 'vitungu {0} esaliswami koko'],
    '{0} article(s) en stock faible (≤ 3)': ['{0} low-stock product(s) (≤ 3)', 'bidhaa {0} zina stoo ndogo (≤ 3)', 'vitungu {0} vana koko ndogo (≤ 3)'],
    '{0} compte(s) suspendu(s)':     ['{0} suspended account(s)', 'akaunti {0} zimesitishwa', 'koti {0} ezimiswe'],
    'Ruptures':                       ['Out of stock', 'Stoo zimeisha', 'Ekalasi na koko'],
    'Stock':                          ['Stock', 'Stoo', 'Koko'],
    'Modération':                     ['Moderation', 'Usimamizi', 'Bobongolisa'],
    'Tout est en ordre : aucun point de vigilance.':
        ['All good: no point of concern.', 'Kila kitu ni safi: hakuna tatizo.', 'Nyonso ezali malamu: ezala lisusu teko.'],
    'Comptes':                        ['Accounts', 'Akaunti', 'Koti'],
    'Boutiques':                      ['Shops', 'Duka', 'Boutiki'],
    'Articles':                       ['Products', 'Bidhaa', 'Vitungu'],
    'Chiffre d\'affaires':            ['Revenue', 'Mapato', 'Mapembo'],
    '+{0} sur 7 jours':              ['+{0} in 7 days', '+{0} kwa siku 7', '+{0} kwa mikolo 7'],
    '{0} administrateur(s)':         ['{0} administrator(s)', 'mwingenzi {0}', 'mongisi {0}'],
    '{0} en alerte':                  ['{0} on alert', '{0} kwa tahadhari', '{0} kwa kopelwa'],
    'tous membres confondus':        ['all members combined', 'wote pamoja', 'bantu nyonso'],
    'Panier moyen {0}':               ['Average basket {0}', 'Kikapu wastani {0}', 'Koba ya moyenne {0}'],
    '{0} commande(s) · {1} inscription(s)': ['{0} order(s) · {1} sign-up(s)', 'agizo {0} · usajili {1}', 'commande {0} · bomoko {1}'],
    '{0} article(s)':                 ['{0} product(s)', 'bidhaa {0}', 'vitungu {0}'],
    'Rupture':                        ['Out of stock', 'Stoo imeisha', 'Ekalasi'],
    '{0} restants':                   ['{0} left', 'zimebaki {0}', 'esaliswami {0}'],
    'Aucune inscription.':            ['No sign-ups.', 'Hakuna usajili.', 'Eza bomoko.'],
    'Tous les stocks sont corrects.': ['All stocks are fine.', 'Stoo zote ni safi.', 'Koko nyonso ezali malamu.'],
    '{0} art.':                       ['{0} prod.', 'bidhaa {0}', 'vitungu {0}'],
    '{0} — {1}':                      ['{0} — {1}', '{0} — {1}', '{0} — {1}'],
    '{0} — {1} au lieu de {2} (-{3}%)': ['{0} — {1} instead of {2} (-{3}%)', '{0} — {1} badala ya {2} (-{3}%)', '{0} — {1} kamba ya {2} (-{3}%)'],
    '1 sur 1 page pour « tous les produits » — {0} résultats sur {1}':
        ['Page 1 of 1 for "all products" — {0} results out of {1}',
         'Ukurasa 1 kati ya 1 kwa "bidhaa zote" — matokeo {0} kati ya {1}',
         'Mokolo 1 na 1 kwa "vitungu nyonso" — seyo {0} na {1}'],
    '1 sur 1 page pour « {0} » — {1} résultats sur {2}':
        ['Page 1 of 1 for "{0}" — {1} results out of {2}',
         'Ukurasa 1 kati ya 1 kwa "{0}" — matokeo {1} kati ya {2}',
         'Mokolo 1 na 1 kwa "{0}" — seyo {1} na {2}'],
    'Un article ne correspond à ces filtres.': ['No product matches these filters.', 'Hakuna bidhaa inayolingana na vichujio hivi.', 'Eza kitungu ekosolwami na bozu oyo.'],
    'Aucun article ne correspond à ces filtres.': ['No product matches these filters.', 'Hakuna bidhaa inayolingana na vichujio hivi.', 'Eza kitungu ekosolwami na bozu oyo.'],
    'Soit -% · badge « Promotion » appliqué': ['Or -% · "Sale" badge applied', 'Au -% · alama "Promo" imetumika', 'Kama -% · etiketi "Mbayo" esaliswami'],
    'Article(s) ·': ['Product(s) ·', 'Bidhaa ·', 'Vitungu ·'],
    '· J\'aime': ['· likes', '· mapendeleo', '· mipendo'],
    '· article(s)': ['· product(s)', '· bidhaa', '· kitungu'],
    'Photo(s) suivante': ['Next photo(s)', 'Picha inayofuata', 'Bazani inooyo'],
    'Ajouter au panier — {0}': ['Add to cart — {0}', 'Ongeza kikapuni — {0}', 'Yisa kwenye koba — {0}'],
    'Commande enregistrée localement.': ['Order saved locally.', 'Agizo limehifadhiwa ndani.', 'Commande ebambanzwe ndani.'],
    'Aucun article ici pour le moment': ['No products here yet', 'Hakuna bidhaa hapa kwa sasa', 'Eza kitungu awawa kwa sik hii'],
    'Boutique introuvable': ['Shop not found', 'Duka halijapatikana', 'Boutiki ekotambwa teko'],
    'Aucune commande pour le moment.': ['No orders at the moment.', 'Hakuna agizo kwa sasa.', 'Eza commande kwa sik hii.'],
    '· méthode':                      ['· method', '· njia', '· njia']
});

/* Les messages qui s'affichent dans une bulle (toast). Les messages
   composés passent par t() avec des {0}. */
Object.assign(DICT, {
    '🛒 Votre panier est vide': ['🛒 Your cart is empty', '🛒 Kikapu chako ni tupu', '🛒 Koba yako ezali na tata'],
    '📦 Livraison estimée sous 24 à 48h': ['📦 Estimated delivery within 24 to 48h', '📦 Usafirishaji unatarajiwa ndani ya masaa 24–48', '📦 Posi ekotambami ndani ya masaa 24–48'],
    '⚠️ J\'aime disponible uniquement avec le serveur (node server.js).':
        ['⚠️ Likes are only available with the server running (node server.js).',
         '⚠️ Mapendeleo yanapatikana tu kwa seva (node server.js).',
         '⚠️ Mipendo ekotambama kaka peke na seva (node server.js).'],
    '❤️ Article ajouté à vos J\'aime': ['❤️ Product added to your likes', '❤️ Bidhaa imeongezwa kwenye mapendeleo yako', '❤️ Kitungu kimeyiswa kwenye mipendo yoko'],
    '👋 Vous êtes déconnecté.': ['👋 You are logged out.', '👋 Umetoka.', '👋 Umesonga.'],
    '⚠️ Merci de corriger les champs en rouge.': ['⚠️ Please correct the red fields.', '⚠️ Tafadhali sahihisha sehemu zilizo nyekundu.', '⚠️ Salamu bobongolisa ndani oyo ezali mbongo.'],
    'Bienvenue ! Votre identifiant est « {0} ».':
        ['Welcome! Your username is "{0}".', 'Karibu! Jina lako la mtumiaji ni "{0}".', 'Boyei bolingo! Esanza yoko ezali "{0}".'],
    'Bienvenue {0} ! Votre boutique est créée.':
        ['Welcome {0}! Your shop has been created.', 'Karibu {0}! Duka lako limeundwa.', 'Boyei bolingo {0}! Magazi yoko matengulwe.'],
    '👋 Bonjour {0} !': ['👋 Hello {0}!', '👋 Habari {0}!', '👋 Mbote {0}!'],
    '👋 Déjà connecté en tant que {0}.': ['👋 Already logged in as {0}.', '👋 Umeingia kama {0}.', '👋 Bado ukote na {0}.'],
    '✅ Boutique mise à jour.': ['✅ Shop updated.', '✅ Duka limesasishwa.', '✅ Boutiki esungusswe.'],
    '🗑️ Article supprimé.': ['🗑️ Product deleted.', '🗑️ Bidhaa imefutwa.', '🗑️ Kitungu kimefutwa.'],
    '🗑️ Compte supprimé.': ['🗑️ Account deleted.', '🗑️ Akaunti imefutwa.', '🗑️ Koti ekifutwa.'],
    '✏️ Article chargé — modifiez puis enregistrez.':
        ['✏️ Product loaded — edit then save.', '✏️ Bidhaa imewekwa — badilisha kisha hifadhi.', '✏️ Kitungu kimeload — senga kisha bambanza.'],
    '⚠️ Vous ne pouvez modifier que vos propres articles.':
        ['⚠️ You can only edit your own products.', '⚠️ Unaweza kubadilisha bidhaa zako pekee.', '⚠️ Oloko teko kubadilisha vitungu yako kaka.'],
    '✅ Article mis à jour.': ['✅ Product updated.', '✅ Bidhaa imesasishwa.', '✅ Kitungu kimesungusswa.'],
    '🎉 Article publié dans votre magasin !': ['🎉 Product published in your shop!', '🎉 Bidhaa imechapishwa kwenye duka lako!', '🎉 Kitungu kimesaputwa kwenye magazi yoko!'],
    '🎉 Article publié sur la plateforme.': ['🎉 Product published on the platform.', '🎉 Bidhaa imechapishwa kwenye tovuti.', '🎉 Kitungu kimesaputwa kwenye siti.'],
    '🙈 Article masqué.': ['🙈 Product hidden.', '🙈 Bidhaa imefichwa.', '🙈 Kitungu kimesitirwa.'],
    '👁️ Article publié.': ['👁️ Product published.', '👁️ Bidhaa imechapishwa.', '👁️ Kitungu kimesaputwa.'],
    'Rôle administrateur mis à jour.': ['Administrator role updated.', 'Jukumu la mwingenzi limewasishwa.', 'Ndicho ya mongisi esungusswe.'],
    'Statut de la commande mis à jour.': ['Order status updated.', 'Hali ya agizo imesasishwa.', 'Boyeselo ya commande esungusswe.'],
    '⚠️ {0} photos maximum par article.': ['⚠️ {0} photos maximum per product.', '⚠️ Picha {0} kwa kila bidhaa.', '⚠️ Bazani {0} kwa kila kitungu.'],
    '⚠️ Seules {0} photo(s) ont été ajoutées (maximum {1}).': ['⚠️ Only {0} photo(s) were added (maximum {1}).', '⚠️ Picha {0} pekee ndizo zilizoongezwa (maximum {1}).', '⚠️ Bazani {0} kaka ndiyo oyo ezeyiswami (maximum {1}).'],
    '✅ {0} photo(s) envoyée(s) · autres ignorées ({1} max).': ['✅ {0} photo(s) sent · others ignored ({1} max).', '✅ Picha {0} zimetuma · nyingine zimepuuzwa ({1} kwa ubora).', '✅ Bazani {0} ezotoma · ezosingi ezitinywe ({1} likiti).'],
    '⚠️ {0} détails maximum par article.': ['⚠️ {0} details maximum per product.', '⚠️ Maelezo {0} kwa kila bidhaa.', '⚠️ Maelezo {0} maximum kwa kila kitungu.'],
    '🎉 Bienvenue sur Prime ! Livraison offerte dès aujourd\'hui.':
        ['🎉 Welcome to Prime! Free delivery from today.', '🎉 Karibu Prime! Usafirishaji wa bure kuanzia leo.', '🎉 Boyei bolingo na Prime! Posi ya mahuri kuanzia lelo.'],
    '✅ Message envoyé, nous vous répondons sous 24h.':
        ['✅ Message sent, we reply within 24h.', '✅ Ujumbe umetumwa, tutajibu ndani ya masaa 24.', '✅ Mokozo oyatoma, tokotoka yo kwa masaa 24.']
});

/* ==========================================================
   MOTEUR
   ========================================================== */
let lang = 'fr';

function readLang(){
    try {
        const v = localStorage.getItem(LANG_KEY);
        if (v && LANGUAGES.some(l => l.id === v)) return v;
    } catch (e) { /* navigation privée */ }
    /* premier visite : on suit la langue du navigateur si elle est proposée */
    const nav = (navigator.languages || [navigator.language || '']).map(x => String(x).toLowerCase());
    for (const l of LANGUAGES){
        if (nav.some(n => n.indexOf(l.id) === 0)) return l.id;
    }
    return 'fr';
}

function writeLang(v){
    try { localStorage.setItem(LANG_KEY, v); } catch (e) { /* navigation privée */ }
}

const langInfo = () => LANGUAGES.find(l => l.id === lang) || LANGUAGES[0];

/* Le code de langue servi aux API Intl : nombres, dates, listes. */
let BE_LOCALE = 'fr-FR';
window.BE_LOCALE = BE_LOCALE;

/* On garde les traductions des attributs qui ont déjà été écrites, pour
   ne pas écraser ce que le script du site vient de remettre à la place. */
const ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'data-ph'];

/* Les textes d'origine : sans eux, impossible de revenir au français. */
const SRC_TEXT = new WeakMap();
const SRC_ATTR = new WeakMap();

/* t('texte') : traduit une chaîne écrite dans le JavaScript.
   Les {0}, {1}… sont remplacés par les arguments fournis. */
function t(src, vars){
    if (src == null) return '';
    const key = String(src);
    let out = key;
    if (lang !== 'fr'){
        const row = DICT[key];
        if (row) out = row[LANGUAGES.findIndex(l => l.id === lang)] || row[0] || key;
    }
    if (vars && vars.length) out = out.replace(/\{(\d+)\}/g, (m, i) =>
        vars[i] != null ? String(vars[i]) : m);
    return out;
}

/* Variante avec le mot « article(s) » accordé au nombre passé. */
function tp(src, n, vars){
    const key = String(n || 0) === '1' ? String(src).replace(/\(s\)/g, '') : String(src);
    const all = (vars || []).slice();
    all.unshift(n);
    return t(key, all);
}

/* Formate un nombre dans la langue courante. */
function num(n){ return new Intl.NumberFormat(BE_LOCALE).format(n); }
function date(d, o){ return new Date(d).toLocaleDateString(BE_LOCALE, o); }

/* --- appliquer une langue à toute la page ------------------------ */
function applyLang(opts){
    const o = opts || {};
    const info = langInfo();
    BE_LOCALE = info.locale;
    window.BE_LOCALE = info.locale;
    document.documentElement.lang = info.id;

    if (o.save) writeLang(info.id);
    paintLangButtons();
    translate(document);
    translateTitle();
    if (typeof window.dispatchEvent === 'function'){
        window.dispatchEvent(new CustomEvent('be:lang', { detail: { lang: info.id } }));
    }
    return info;
}

/* Le <title> est de la forme « Page — BusinessEnLigne » : on ne traduit
   que la partie avant le tiret, le nom de la marque reste tel quel. */
let SRC_TITLE = '';
function translateTitle(){
    const raw = SRC_TITLE || document.title;
    const cut = String(raw).split(/\s+[—–-]\s+/);
    if (cut.length > 1){
        document.title = t(cut[0].trim()) + ' — ' + cut.slice(1).join(' — ');
    } else {
        document.title = t(raw.trim());
    }
}

/* Un nœud de texte : on retient le français d'origine et la dernière
   version écrite. Si le site remet un texte neuf, on le prend pour
   nouvelle source ; sinon on réécrit la traduction (au changement de
   langue, on repart toujours du français). */
function translateNode(node){
    const raw = node.nodeValue;
    if (raw == null || !raw.trim()) return;
    let st = SRC_TEXT.get(node);
    if (!st || raw !== st.out){
        st = { src: raw, out: raw };
        SRC_TEXT.set(node, st);
    }
    const src = st.src;
    const lead = src.match(/^\s*/)[0];
    const tail = src.match(/\s*$/)[0];
    const core = src.trim().replace(/\s+/g, ' ');
    const out = t(core);
    st.out = (out === core) ? raw : lead + out + tail;
    if (st.out !== raw) node.nodeValue = st.out;
}

/* Les attributs : placeholder, title, aria-label… Même règle. */
function translateAttrs(el){
    let store = SRC_ATTR.get(el);
    for (const a of ATTRS){
        const v = el.getAttribute(a);
        if (v == null || !v.trim()) continue;
        if (!store) store = {};
        const known = store[a];
        if (!known || v !== known.out){
            store[a] = { src: v, out: v };
        }
        const core = store[a].src.trim();
        const out = t(core);
        store[a].out = out === core ? store[a].src : out;
        if (out !== core) el.setAttribute(a, out);
    }
}

/* --- le balayage de la page -------------------------------------- */
const SRC_I18N = new WeakMap();

/* <b data-i18n="Texte français"> : on garde la source d'origine et on
   réécrit le contenu à chaque changement de langue. */
function translateMarked(el){
    const raw = el.getAttribute('data-i18n');
    if (!raw || !raw.trim()) return;
    if (!SRC_I18N.has(el)) SRC_I18N.set(el, raw);
    const out = t(SRC_I18N.get(el).trim());
    if (el.textContent !== out) el.textContent = out;
}

function translate(root){
    const start = root || document.body;
    if (!start) return;
    const walker = document.createTreeWalker(
        start,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        {
            acceptNode(n){
                if (n.nodeType === 3){
                    /* un texte déjà piloté par data-i18n est laissé à son bloc */
                    const p = n.parentElement;
                    if (p && p.closest && p.closest('[data-i18n]')) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
                const tag = n.tagName;
                if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    const nodes = [];
    let n = walker.nextNode();
    while (n){ nodes.push(n); n = walker.nextNode(); }
    for (const el of nodes) if (el.nodeType === 1) translateAttrs(el);
    for (const el of nodes) if (el.nodeType === 3) translateNode(el);
    for (const el of nodes) if (el.nodeType === 1 && el.hasAttribute('data-i18n')) translateMarked(el);
}

/* Tout ce que javascript.js ajoute après coup passe aussi par ici. */
let obsTimer = null;
function watchDom(){
    if (typeof MutationObserver !== 'function' || !document.body) return;
    new MutationObserver(records => {
        let dirty = false;
        for (const r of records){
            if (r.type === 'characterData'){ dirty = true; break; }
            for (const node of r.addedNodes) if (node.nodeType === 1 || node.nodeType === 3){ dirty = true; break; }
            if (dirty) break;
        }
        if (!dirty) return;
        clearTimeout(obsTimer);
        obsTimer = setTimeout(() => translate(document.body), 40);
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
}

/* ==========================================================
   LE SÉLECTEUR DE LANGUE
   Même anatomie que le panneau de thème : une bulle sous le
   bouton sur grand écran, une feuille du bas sur téléphone.
   ========================================================== */
let langPanel = null, langBackdrop = null, langFor = null;

function buildLangPanel(){
    if (langPanel) return;

    langBackdrop = document.createElement('div');
    langBackdrop.className = 'theme-backdrop';
    langBackdrop.addEventListener('click', closeLangPanel);

    langPanel = document.createElement('div');
    langPanel.className = 'theme-panel lang-panel';
    langPanel.id = 'langPanel';
    langPanel.setAttribute('role', 'dialog');
    langPanel.innerHTML =
        '<div class="theme-panel-head"><b>' + t('Langue') + '</b>' +
        '<button class="theme-close" type="button" data-lang-close aria-label="' + t('Fermer') + '">' +
        '<i class="fas fa-xmark"></i></button></div>' +
        '<p class="lang-sub">' + t('Choisir la langue') + '</p>' +
        '<div class="lang-grid">' +
        LANGUAGES.map(l =>
            `<button type="button" class="lang-item" data-lang-set="${l.id}">` +
            `<span class="lang-flag">${l.flag}</span>` +
            `<span class="lang-name">${l.label}</span>` +
            `<i class="fas fa-check lang-tick"></i></button>`
        ).join('') +
        '</div>';

    document.body.appendChild(langBackdrop);
    document.body.appendChild(langPanel);

    langPanel.addEventListener('click', e => {
        const b = e.target.closest('[data-lang-set]');
        if (b) setLang(b.dataset.langSet);
    });
}

function placeLangPanel(btn){
    if (window.innerWidth <= 900 || !btn){ langPanel.style.left = ''; langPanel.style.top = ''; return; }
    const r = btn.getBoundingClientRect();
    const w = langPanel.offsetWidth;
    const left = Math.min(Math.max(8, r.right - w), window.innerWidth - w - 8);
    const top = Math.min(r.bottom + 8, window.innerHeight - langPanel.offsetHeight - 8);
    langPanel.style.left = left + 'px';
    langPanel.style.top = Math.max(8, top) + 'px';
}

function openLangPanel(btn){
    buildLangPanel();
    if (typeof closeAll === 'function') closeAll();
    if (typeof closePanel === 'function') closePanel();
    langFor = btn || null;
    document.querySelectorAll('[data-lang-open]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (btn) btn.setAttribute('aria-expanded', 'true');
    placeLangPanel(btn);
    langBackdrop.classList.add('show');
    langPanel.classList.add('open');
    document.body.classList.toggle('modal-open', window.innerWidth <= 900);
    paintLangPanel();
}

function closeLangPanel(){
    if (!langPanel) return;
    langPanel.classList.remove('open');
    langBackdrop.classList.remove('show');
    document.body.classList.remove('modal-open');
    if (langFor) langFor.setAttribute('aria-expanded', 'false');
    langFor = null;
}

const isLangPanelOpen = () => !!(langPanel && langPanel.classList.contains('open'));

function paintLangPanel(){
    if (!langPanel) return;
    langPanel.querySelectorAll('[data-lang-set]').forEach(b =>
        b.classList.toggle('on', b.dataset.langSet === lang));
}

function paintLangButtons(){
    const info = langInfo();
    document.querySelectorAll('[data-lang-open]').forEach(btn => {
        const code = btn.querySelector('[data-lang-code]');
        if (code) code.textContent = info.short;
        const label = btn.querySelector('[data-lang-label]');
        if (label) label.textContent = t('Langue');
    });
    /* le bouton du pied de page affiche la langue choisie */
    document.querySelectorAll('.lang-btn[data-lang-open]').forEach(btn => {
        const txt = btn.querySelector('.lang-txt');
        if (txt) txt.textContent = info.label;
    });
    if (isLangPanelOpen()) paintLangPanel();
}

/* Changer de langue depuis n'importe où dans le site. */
function setLang(id, opts){
    if (!LANGUAGES.some(l => l.id === id)) return;
    lang = id;
    applyLang(Object.assign({ save: true }, opts || {}));
}

/* ==========================================================
   BRANCHEMENT SUR LA PAGE
   ========================================================== */
SRC_TITLE = document.title;
lang = readLang();
applyLang();

document.addEventListener('DOMContentLoaded', () => {
    applyLang();                 /* le DOM existe : on peut tout traduire */
    paintLangButtons();
    watchDom();

    document.addEventListener('click', e => {
        const open = e.target.closest('[data-lang-open]');
        if (open){
            e.preventDefault();
            if (isLangPanelOpen()) closeLangPanel(); else openLangPanel(open);
            return;
        }
        if (isLangPanelOpen() && !e.target.closest('#langPanel')) closeLangPanel();
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLangPanel(); });
    window.addEventListener('resize', () => {
        if (!isLangPanelOpen()) return;
        placeLangPanel(langFor);
        document.body.classList.toggle('modal-open', window.innerWidth <= 900);
    });
});

/* Exposé au reste du site (javascript.js) : */
window.i18n = {
    LANGUAGES, t, tp, num, date, setLang, applyLang,
    get lang(){ return lang; },
    get locale(){ return BE_LOCALE; }
};
window.BE_LANG = () => lang;
window.BE_LOCALE = BE_LOCALE;
