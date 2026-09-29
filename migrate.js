/* ==========================================================
   MIGRATION SQLITE -> FIRESTORE
   ------------------------------------------------------------
   node migrate.js              -> migre les données vers Firebase
   node migrate.js --dry-run    -> affiche ce qui serait transféré
   node migrate.js --force      -> écrase le contenu déjà présent

   Les identifiants Firebase sont lus dans service-account.json
   (à la racine du projet). Ce script utilise TOUJOURS la base
   locale comme source, même si DB_DRIVER vaut autre chose.

   Après migration :
     node server.js               -> utilise Firestore
     $env:DB_DRIVER="local"       ; node server.js   -> reste en local
   ========================================================== */
/* ---- Imports ----
   On prend les DEUX pilotes de db.js : la source est toujours la base
   locale, la destination est Firestore. */
const { createLocalDriver, createFirestoreDriver } = require('./db');

const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

/* Ordre important : les enfants d'abord, pour ne jamais laisser
   un document qui pointe vers un compte supprimé. */
const TABLES = ['users', 'products', 'likes', 'orders', 'sessions'];

/* Nettoie une ligne SQLite : Firestore refuse undefined et les
   valeurs non finies, et n'aime pas les entiers hors limites 64 bits. */
function clean(row){
    const out = {};
    for (const [k, v] of Object.entries(row)){
        if (v === undefined) continue;
        if (typeof v === 'number' && !Number.isFinite(v)) continue;
        if (typeof v === 'boolean'){ out[k] = v; continue; }
        if (typeof v === 'string'){ out[k] = v; continue; }
        if (v === null){ out[k] = null; continue; }
        out[k] = String(v);
    }
    return out;
}

(async () => {
    console.log('\n  BusinessEnLigne — migration vers Firebase\n');

    /* --- source : la base locale --- */
    let local;
    try { local = createLocalDriver(); }
    catch (e){
        console.error('  ❌ Base locale illisible :', e.message);
        console.error('     Node ' + process.version + ' ne fournit pas node:sqlite.\n');
        process.exit(1);
    }
    if (local.driver !== 'sqlite' && !DRY){
        console.error('  ❌ Aucune base SQLite locale dans ' + require('path').join(__dirname, 'data')); // path importé sur place : inutile autrement
        console.error('     Lancez d\'abord le serveur en mode local pour la créer.\n');
        process.exit(1);
    }
    console.log('  Source : ' + local.driver);

    /* Combien de lignes à migrer ? */
    const tables = TABLES.filter(t => local.all(t).length > 0);
    const counts = {};
    for (const t of tables) counts[t] = local.all(t).length;

    if (!tables.length){
        console.log('\n  Rien à migrer : la base locale est vide.\n');
        return;
    }

    console.log('  À migrer : ' + Object.entries(counts).map(([t, n]) => t + '=' + n).join('  '));

    if (DRY){
        console.log('\n  Simulation uniquement (--dry-run) : aucune écriture.\n');
        return;
    }

    /* --- cible : Firestore --- */
    let cloud;
    try { cloud = createFirestoreDriver(); }
    catch (e){
        console.error('\n  ❌ ' + e.message);
        console.error('     Téléchargez la clé de service depuis la console Firebase');
        console.error('     (Paramètres du projet > Comptes de service > Générer une clé),\n');
        console.error('     puis placez le fichier « service-account.json » à la racine du projet.\n');
        process.exit(1);
    }
    console.log('  Cible  : ' + cloud.driver + ' — projet ' + cloud.projectId);

    /* --- l' Firestore contient-elle déjà des données ? --- */
    const existing = await cloud.count('users');
    if (existing > 0 && !FORCE){
        console.error('\n  ❌ Firestore contient déjà ' + existing + ' compte(s).');
        console.error('     Relancez avec --force pour écraser le contenu existant,');
        console.error('     ou migrez dans un projet Firebase vide.\n');
        process.exit(1);
    }
    if (existing > 0){
        console.log('  --force : suppression du contenu existant…');
        await cloud.reset();
    }

    /* --- transfert --- */
    for (const t of tables){
        const rows = local.all(t).map(clean);
        await cloud.insertMany(t, rows);
        console.log('  ✔ ' + t.padEnd(9) + rows.length + ' document(s)');
    }

    /* --- vérification --- */
    console.log('\n  Vérification :');
    for (const t of tables){
        const n = await cloud.count(t);
        const mark = n === counts[t] ? '✔' : '✖';
        console.log('   ' + mark + ' ' + t.padEnd(9) + ' attendu ' + counts[t] + ', trouvé ' + n);
        if (n !== counts[t]){
            console.error('\n  ❌ La migration est incomplète.\n');
            process.exit(1);
        }
    }

    console.log('\n  ✅ Migration terminée. Lancez « node server.js » pour utiliser Firebase.\n');
})().catch(e => {
    console.error('\n  ❌ Échec de la migration :', e.message, '\n');
    process.exit(1);
});
