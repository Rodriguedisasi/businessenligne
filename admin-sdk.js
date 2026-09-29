/* ==========================================================
   FIREBASE ADMIN — point d'entrée unique
   ------------------------------------------------------------
   firebase-admin v13 a réorganisé son API publique : les espaces de
   noms admin.apps, admin.credential, admin.app() et app.firestore()
   ont disparu au profit d'une API à plat (initializeApp, cert, getApp)
   et de modules séparés (firebase-admin/firestore, …/storage).

   Ce module masque la différence pour que db-firestore.js et storage.js
   n'aient qu'une seule écriture, valable sur les deux générations.
   ========================================================== */

let sdk = null;
try { sdk = require('firebase-admin'); } catch (e) { /* firebase-admin absent */ }

let Firestore = null, getStorage = null;
try { ({ Firestore } = require('firebase-admin/firestore')); } catch (e) { /* API v12 */ }
try { ({ getStorage } = require('firebase-admin/storage')); } catch (e) { /* API v12 */ }

/* v12 conserve les anciens espaces de noms : c'est le repère le plus fiable. */
const LEGACY = !!(sdk && sdk.credential);

const isInstalled    = () => !!sdk && !LEGACY;
const isInitialized  = () => LEGACY ? sdk.apps.length > 0 : sdk.getApps().length > 0;

function initializeApp(options){
    if (isInitialized()) return getApp();
    return options ? sdk.initializeApp(options) : sdk.initializeApp();
}

const getApp = () => LEGACY ? sdk.app() : sdk.getApp();
const cert   = c => LEGACY ? sdk.credential.cert(c) : sdk.cert(c);

/* v13+ : la classe Firestore se construit avec un objet de réglages
   ({ projectId, credentials, databaseId, ignoreUndefinedProperties }).
   v12 : l'application porte déjà les identifiants, l'instance est
   créée par elle et on ne peut plus que régler les options. */
function firestore(settings, app){
    if (!LEGACY) return new Firestore(settings);

    const store = (app || sdk.app()).firestore();
    try { store.settings({ ignoreUndefinedProperties: true }); }
    catch (e){ /* instance déjà démarrée */ }
    return store;
}

const storage = app => getStorage ? getStorage(app) : app.storage();

module.exports = { isInstalled, isInitialized, initializeApp, getApp, cert, firestore, storage, LEGACY };
