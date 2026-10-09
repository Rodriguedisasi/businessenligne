/* ==========================================================
   BUSINESSENLIGNE — COUCHE RÉSEAU (API REST)
   Chargé sur TOUTES les pages, avant javascript.js
   ------------------------------------------------------------
   Si le serveur n'est pas lancé (page ouverte en file://),
   les fonctions renvoient une erreur « offline » et le site
   continue à fonctionner avec le catalogue de secours.
   ========================================================== */
const BE = (() => {

    const TOKEN_KEY = 'be_token';
    const state = { user: null, loaded: false, online: null };

    const ONLINE_URL = 'https://businessenligne.vercel.app';
    const isLocalFile = () => location.protocol === 'file:';
    const isLocalHost = () => /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(location.hostname);

    const token   = () => localStorage.getItem(TOKEN_KEY);
    const setToken = t => t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);
    const isOnline = () => state.online;
    const user = () => state.user;
    const isLogged = () => !!state.user;

    async function req(method, path, body){
        const headers = {};
        if (body !== undefined) headers['Content-Type'] = 'application/json';
        if (token()) headers.Authorization = 'Bearer ' + token();

        let res;
        try {
            res = await fetch(path, {
                method,
                headers,
                credentials: 'same-origin',
                body: body === undefined ? undefined : JSON.stringify(body)
            });
        } catch (e){
            state.online = false;
            const err = new Error(isLocalFile()
                ? "Cette page est ouverte depuis votre ordinateur, le site n'est donc pas joignable. Utilisez le lien ci-dessous."
                : "Serveur injoignable. Vérifiez votre connexion internet puis rechargez la page.");
            err.offline = true;
            throw err;
        }
        state.online = true;
        const data = await res.json().catch(() => ({}));
        if (!res.ok){
            const err = new Error(data.error || ('Erreur ' + res.status));
            err.status = res.status;
            throw err;
        }
        return data;
    }

    /* ---------------- COMPTE ---------------- */
    async function loadMe(force){
        if (state.loaded && !force) return state.user;
        try {
            const d = await req('GET', '/api/me');
            state.user = d.user;
        } catch (e){
            if (e.status === 401) setToken(null);
            state.user = null;
        }
        state.loaded = true;
        return state.user;
    }
    /* Renvoie { user, generated } : le formulaire d'inscription affiche le
       nom d'identifiant que le serveur a déduit de l'email, et generated
       est absent d'une réponse d'erreur. */
    const register = async payload => {
        const d = await req('POST', '/api/register', payload);
        setToken(d.token); state.user = d.user; state.loaded = true;
        return { user: d.user, generated: d.generated || {} };
    };
    const login = async (ident, password) => {
        const d = await req('POST', '/api/login', { ident, password });
        setToken(d.token); state.user = d.user; state.loaded = true;
        return d.user;
    };
    const logout = async () => {
        try { await req('POST', '/api/logout', {}); } catch (e) {}
        setToken(null); state.user = null; state.loaded = true;
    };
    const updateProfile = async patch => {
        const d = await req('PATCH', '/api/me', patch);
        state.user = d.user;
        return { user: d.user, score: d.score };
    };

    /* ---------------- CATALOGUE ---------------- */
    const products  = async (params = {}) => (await req('GET', '/api/products' + qs(params))).products;
    const product   = async id => (await req('GET', '/api/products/' + id)).product;
    const publish   = async payload => (await req('POST', '/api/products', payload)).product;
    const editProduct = async (id, patch) => (await req('PATCH', '/api/products/' + id, patch)).product;
    const deleteProduct = async id => req('DELETE', '/api/products/' + id);

    /* ---------------- J'AIME ---------------- */
    const toggleLike = async id => req('POST', '/api/products/' + id + '/like', {});
    const likes = async () => (await req('GET', '/api/likes')).products;

    /* ---------------- COMMANDES ---------------- */
    const order = async items => (await req('POST', '/api/orders', { items })).order;
    const orders = async () => (await req('GET', '/api/orders')).orders;

    /* ---------------- BOUTIQUES ---------------- */
    /* shops()                 -> toutes les vitrines
       shops({ cat:'Électronique' }) -> uniquement les boutiques qui vendent
                                      dans cette catégorie (chiffres recalculés) */
    const shops = async (params = {}) => (await req('GET', '/api/shops' + qs(params))).shops;
    const shop  = async username => req('GET', '/api/shops/' + encodeURIComponent(username));

    /* ---------------- IMAGES ----------------
       Toute image est acceptée, quel que soit son format : on se fie au
       type MIME du fichier, et si le système ne le fournit pas, on le
       déduit de l'extension du nom de fichier. */
    const IMG_MIME = {
        png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', jpe:'image/jpeg',
        jfif:'image/jpeg', pjpeg:'image/jpeg', gif:'image/gif', webp:'image/webp',
        avif:'image/avif', bmp:'image/bmp', dib:'image/bmp', tif:'image/tiff',
        tiff:'image/tiff', heic:'image/heic', heif:'image/heif', svg:'image/svg+xml',
        ico:'image/x-icon', cur:'image/x-icon', apng:'image/apng', jxl:'image/jxl',
        psd:'image/vnd.adobe.photoshop', raw:'image/x-raw', dng:'image/x-adobe-dng',
        cr2:'image/x-canon-cr2', nef:'image/x-nikon-nef', arw:'image/x-sony-arw',
        wbmp:'image/vnd.wap.wbmp', xbm:'image/x-xbitmap', xpm:'image/x-xpixmap'
    };
    const extOf = name => {
        const m = /\.([a-z0-9]+)$/i.exec(String(name || ''));
        return m ? m[1].toLowerCase() : '';
    };
    function mimeOf(file){
        const t = String(file.type || '').toLowerCase();
        if (t.startsWith('image/')) return t;
        return IMG_MIME[extOf(file.name)] || '';
    }
    async function upload(file){
        if (!file) throw new Error('Aucun fichier sélectionné');
        const mime = mimeOf(file);
        if (!mime) throw new Error('Seules les images sont acceptées');
        if (file.size > 3 * 1024 * 1024)
            throw new Error('Image trop lourde (3 Mo maximum)');
        let dataUrl = await new Promise((res, rej) => {
            const fr = new FileReader();
            fr.onload = () => res(fr.result);
            fr.onerror = rej;
            fr.readAsDataURL(file);
        });
        /* certains navigateurs omettent le type d'un fichier : on impose
           celui qu'on a déduit pour que le serveur le reconnaisse. */
        if (typeof dataUrl === 'string')
            dataUrl = dataUrl.replace(/^data:[^;,]*;base64,/i, 'data:' + mime + ';base64,');
        return (await req('POST', '/api/upload', { dataUrl })).url;
    }

    /* ---------------- ADMINISTRATION ---------------- */
    const overview      = async () => req('GET', '/api/admin/overview');
    const adminUsers    = async (params = {}) => (await req('GET', '/api/admin/users' + qs(params))).users;
    const adminProducts = async (params = {}) => (await req('GET', '/api/admin/products' + qs(params))).products;
    const adminOrders   = async () => (await req('GET', '/api/admin/orders')).orders;
    /* Fiche de modération : le compte, ses articles et toutes ses photos. */
    const adminUser   = id => req('GET', '/api/admin/users/' + id);
    const removePhoto = payload => req('POST', '/api/admin/photos/remove', payload);
    const patchUser   = async (id, patch) => (await req('PATCH', '/api/admin/users/' + id, patch)).user;
    const deleteUser  = id => req('DELETE', '/api/admin/users/' + id);
    const createUser  = async payload => (await req('POST', '/api/admin/users', payload)).user;
    const bulkUsers   = (ids, action) => req('POST', '/api/admin/users/bulk', { ids, action });
    const deleteAsAdmin = id => req('DELETE', '/api/admin/products/' + id);
    const editAsAdmin = async (id, patch) => (await req('PATCH', '/api/admin/products/' + id, patch)).product;
    const bulkProducts = (ids, action) => req('POST', '/api/admin/products/bulk', { ids, action });
    const adminPublish = async payload => (await req('POST', '/api/admin/products', payload)).product;
    const adminCatalog = async (params = {}) => (await req('GET', '/api/admin/catalog' + qs(params))).products;
    const setOrderStatus = async (id, status) => (await req('PATCH', '/api/admin/orders/' + id, { status })).order;
    const deleteOrder = id => req('DELETE', '/api/admin/orders/' + id);
    const createOrder = async (userId, items) => (await req('POST', '/api/admin/orders', { userId, items })).order;

    function qs(params){
        const p = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => { if (v !== '' && v != null) p.set(k, v); });
        const s = p.toString();
        return s ? '?' + s : '';
    }

    return {
        req, token, setToken, isOnline, user, isLogged, loadMe,
        ONLINE_URL, isLocalFile, isLocalHost,
        register, login, logout, updateProfile,
        products, product, publish, editProduct, deleteProduct,
        toggleLike, likes, order, orders, shops, shop, upload,
        overview, adminUsers, adminProducts, adminOrders, adminCatalog,
        adminUser, removePhoto,
        patchUser, deleteUser, createUser, bulkUsers,
        deleteAsAdmin, editAsAdmin, bulkProducts, adminPublish,
        setOrderStatus, deleteOrder, createOrder
    };
})();

/* « const BE » crée une liaison propre au script : elle n'apparaît pas sur
   window. javascript.js teste « window.BE » pour savoir si la couche réseau
   est disponible, donc on la publie explicitement. */
window.BE = BE;
