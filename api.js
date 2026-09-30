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
            const err = new Error(location.protocol === 'file:'
                ? "Serveur injoignable : la page est ouverte en local. Lancez « node server.js » puis ouvrez http://localhost:3000"
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
    const register = async payload => {
        const d = await req('POST', '/api/register', payload);
        setToken(d.token); state.user = d.user; state.loaded = true;
        return d.user;
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
        return d.user;
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

    /* ---------------- IMAGES ---------------- */
    async function upload(file){
        if (!file) throw new Error('Aucun fichier sélectionné');
        if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type))
            throw new Error('Image non acceptée (png, jpg, gif ou webp)');
        if (file.size > 3 * 1024 * 1024)
            throw new Error('Image trop lourde (3 Mo maximum)');
        const dataUrl = await new Promise((res, rej) => {
            const fr = new FileReader();
            fr.onload = () => res(fr.result);
            fr.onerror = rej;
            fr.readAsDataURL(file);
        });
        return (await req('POST', '/api/upload', { dataUrl })).url;
    }

    /* ---------------- ADMINISTRATION ---------------- */
    const overview      = async () => req('GET', '/api/admin/overview');
    const adminUsers    = async (params = {}) => (await req('GET', '/api/admin/users' + qs(params))).users;
    const adminProducts = async (params = {}) => (await req('GET', '/api/admin/products' + qs(params))).products;
    const adminOrders   = async () => (await req('GET', '/api/admin/orders')).orders;
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
        register, login, logout, updateProfile,
        products, product, publish, editProduct, deleteProduct,
        toggleLike, likes, order, orders, shops, shop, upload,
        overview, adminUsers, adminProducts, adminOrders, adminCatalog,
        patchUser, deleteUser, createUser, bulkUsers,
        deleteAsAdmin, editAsAdmin, bulkProducts, adminPublish,
        setOrderStatus, deleteOrder, createOrder
    };
})();

/* « const BE » crée une liaison propre au script : elle n'apparaît pas sur
   window. javascript.js teste « window.BE » pour savoir si la couche réseau
   est disponible, donc on la publie explicitement. */
window.BE = BE;
