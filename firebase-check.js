/* ==========================================================
   BUSINESSENLIGNE — DIAGNOSTIC DE CONNEXION À FIREBASE
   ------------------------------------------------------------
   node firebase-check.js

   Vérifie, étape par étape, que le projet est prêt à utiliser
   Firestore :

     1. le SDK firebase-admin est installé ;
     2. la clé de service est présente et exploitable ;
     3. la base Firestore existe et accepte les écritures ;
     4. les collections utilisées par le site sont accessibles.

   Ce script n'écrit que dans une collection jetable « _checks »,
   supprimée à la fin : aucune donnée du site n'est touchée.
   ========================================================== */
/* ---- Modules natifs Node ---- */
const fs   = require('fs');   // contrôle de présence du fichier de clé de service
const path = require('path'); // chemin absolu dudit fichier

const PROBE = '_checks';
const ok   = m  => console.log('  \u2714 ' + m);
const ko   = m  => console.log('  \u2716 ' + m);
const step = m  => console.log('\n  ' + m);
const hint = m  => console.log('    → ' + m);

let failed = false;
const fail = m => { failed = true; ko(m); };

(async () => {
    console.log('\n  BusinessEnLigne — connexion à Firebase\n' + '  ' + '-'.repeat(52));

    /* ---------- 1. SDK ---------- */
    step('1. SDK firebase-admin');
    let admin = null;
    try { admin = require('firebase-admin'); }          // SDK serveur : lecture/écriture Firestore sans passer par le navigateur
    catch (e){ fail('firebase-admin est absent — lancez « npm install »'); }
    if (admin) ok('firebase-admin ' + (admin.SDK_VERSION || 'installé'));
    if (failed) return finish();

    /* ---------- 2. clé de service ---------- */
    step('2. Clé de service (service-account.json)');
    const fsdb = require('./db-firestore');  // réemploi de sa lecture des identifiants, plutôt que de la dupliquer
    const cred = fsdb.findCredentials();

    if (!cred){
        fail(fsdb.CREDENTIAL_FILES.length + ' fichiers sont attendus : ' + fsdb.CREDENTIAL_FILES.join(' ou '));
        hint('Firebase console → Paramètres du projet → Comptes de service');
        hint('« Générer une clé privée » (format JSON), puis nommez le fichier service-account.json');
        hint('et placez-le à la racine du projet : ' + __dirname);
        hint('Ce fichier est ignoré par git (.gitignore) : ne le partagez jamais.');
        return finish();
    }
    const issues = fsdb.inspectCredentials(cred);
    if (issues.length){
        issues.forEach(ko);
        hint('La clé doit être le fichier JSON complet téléchargé depuis la console Firebase.');
        return finish();
    }
    ok('clé lue — projet « ' + cred.project_id + ' »');
    ok('compte de service : ' + cred.client_email);

    /* ---------- 3. accès à Firestore ---------- */
    step('3. Accès à la base Firestore');
    let firestore;
    try {
        /* même construction que le serveur : la clé de service y compris */
        firestore = fsdb.createFirestore();
        ok('SDK initialisé sur le projet ' + (firestore.projectId || cred.project_id));
    } catch (e){
        fail('initialisation impossible : ' + e.message);
        return finish();
    }

    /* ---------- 4. écriture / lecture / suppression ---------- */
    step('4. Test d\'écriture');
    const ref = firestore.collection(PROBE).doc('connexion');
    try {
        await ref.set({ at: new Date().toISOString(), by: cred.client_email });
        ok('écriture acceptée (collection « ' + PROBE + ' »)');
    } catch (e){
        firestoreError(e);
        return finish();
    }
    try {
        const snap = await ref.get();
        if (!snap.exists) throw new Error('le document écrit est introuvable');
        ok('lecture OK — document retrouvé');
    } catch (e){
        firestoreError(e);
        return finish();
    }
    try {
        await ref.delete();
        ok('suppression OK');
    } catch (e){
        firestoreError(e);
        return finish();
    }

    /* ---------- 5. collections du site ---------- */
    step('5. Collections du site');
    const TABLES = ['users', 'sessions', 'products', 'likes', 'orders'];
    for (const t of TABLES){
        try {
            const n = (await firestore.collection(t).count().get()).data().count;
            ok(t.padEnd(9) + n + ' document(s)');
        } catch (e){
            failed = true;
            ko(t + ' : ' + firestoreError(e).message);
        }
    }

    finish(firestore);
})().catch(e => { console.error('\n  ❌ ' + e.message + '\n'); process.exit(1); });

/* Erreurs Firestore traduites en conseils concrets */
function firestoreError(e){
    const code = e.code || '';
    const known = {
        7:  'accès refusé (PERMISSION_DENIED) : la clé de service ne fait pas partie de ce projet, ou les règles Firestore bloquent le SDK d\'administration',
        5:  'base Firestore introuvable : la base n\'est pas encore créée pour ce projet',
        3:  'opération non reconnue : projet incorrect ou API Firestore désactivée',
        8:  'ressource saturée (RESOURCE_EXHAUSTED) : quota dépassé ou projet en provisioning',
        14: 'service indisponible : réessayez dans quelques instants'
    };
    const msg = known[Number(code)] || e.message || 'erreur inconnue';
    const out = new Error('Firestore a refusé l\'opération — ' + msg);
    if (Number(code) === 5 || Number(code) === 3 || Number(code) === 7){
        console.log('');
        hint('Console Firebase → « Créer » une base Cloud Firestore pour ce projet');
        hint('Dans « Règles », collez le fichier firestore.rules du projet puis « Publier »');
        hint('La clé de service doit venir du même projet que celui affiché dans la console');
    }
    return out;
}

function finish(firestore){
    console.log('\n  ' + '-'.repeat(52));
    if (failed || !firestore){
        console.log('  ❌ Connexion Firebase incomplète. Corrigez les points ci-dessus puis');
        console.log('     relancez « npm run firebase:check ».\n');
        process.exit(1);
    }
    console.log('  ✅ Firebase est prêt.\n');
    console.log('  Étapes suivantes :');
    console.log('    1. Remplir la base        →  npm run firebase:seed      (nouveau projet)');
    console.log('                                npm run firebase:migrate    (reprendre les données locales)');
    console.log('    2. Démarrer le site       →  npm run start:firebase');
    console.log('    3. Ouvrir                 →  http://localhost:3000');
    console.log('    4. Compte administrateur  →  npm run firebase:admin -- <identifiant>\n');
}
