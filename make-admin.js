/* ==========================================================
   DONNER LES DROITS ADMINISTRATEUR A UN COMPTE
   ------------------------------------------------------------
   node make-admin.js            -> liste les comptes et leurs droits
   node make-admin.js <ident>    -> identifiant OU email du compte
   node make-admin.js <ident> --remove   -> retire les droits

   Exemples :
   node make-admin.js businessenligne
   node make-admin.js monemail@gmail.com
   ========================================================== */
const db = require('./db');  // accès direct à la table users via l'interface base

const arg  = process.argv[2];
const off  = process.argv.includes('--remove');

(async () => {
    if (!arg){
        const rows = await db.all('users', {}, { orderBy: 'id ASC' });
        console.log('\n  Comptes existants (' + rows.length + ') :\n');
        rows.forEach(u => {
            const flags = [u.is_admin ? 'ADMIN' : 'membre', u.banned ? 'SUSPENDU' : 'actif'];
            console.log('   ' + String(u.id).padStart(3) + '  ' + u.username.padEnd(18)
                + (u.email || '').padEnd(26) + flags.join(' / '));
        });
        console.log('\n  Pour donner les droits admin :  node make-admin.js <identifiant>\n');
        return;
    }

    const needle = String(arg).trim().toLowerCase();
    const user = await db.one('users', { username: needle }) || await db.one('users', { email: needle });

    if (!user){
        console.error('\n  ❌ Aucun compte ne correspond a « ' + arg + ' ».');
        console.error('     Lancez « node make-admin.js » pour voir la liste des comptes.\n');
        process.exitCode = 1;
        return;
    }

    if (off){
        if (!user.is_admin){ console.log('\n  ℹ️  ' + user.username + ' n\'etait pas administrateur.\n'); return; }
        await db.update('users', user.id, { is_admin: 0 });
        console.log('\n  ✅ Droits administrateur retirés de ' + user.username + '.\n');
    } else {
        if (user.is_admin){ console.log('\n  ℹ️  ' + user.username + ' est déjà administrateur.\n'); return; }
        await db.update('users', user.id, { is_admin: 1 });
        console.log('\n  ✅ ' + user.username + ' est désormais administrateur.');
        console.log('     Tableau de bord : http://localhost:3000/admin.html\n');
    }
})().catch(e => {
    console.error('\n  ❌ ' + e.message + '\n');
    process.exitCode = 1;
});
