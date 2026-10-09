/* ==========================================================
   BUSINESSENLIGNE  —  THÈMES DU SITE
   ------------------------------------------------------------
   Ce fichier est chargé dans le <head>, juste après style.css,
   pour que le thème choisi soit appliqué avant le premier
   affichage : en changeant de page, on ne voit aucun clignotement.

   Deux réglages sont mémorisés sur l'appareil (localStorage) :
     • le mode    : clair / sombre / automatique
     • la couleur : orange / émeraude / azur / rose / violet

   Le mode « automatique » suit le réglage du téléphone ou de
   l'ordinateur, et se met à jour tout seul s'il change.
   ========================================================== */

const THEME_KEY = 'businessenligne_theme';

/* --- les couleurs proposées, avec les trois teintes montrées
       dans la pastille (accent, accent clair, en-tête) --- */
const THEME_ACCENTS = [
    { id: 'orange',  name: 'Orange',   c1: '#ff9900', c2: '#ffd814', c3: '#131921' },
    { id: 'emerald', name: 'Émeraude', c1: '#10b981', c2: '#a7f3d0', c3: '#06231d' },
    { id: 'azure',   name: 'Azur',     c1: '#2f80ed', c2: '#bcdcff', c3: '#0b1b33' },
    { id: 'rose',    name: 'Rose',     c1: '#e0245e', c2: '#ffd1de', c3: '#2a0f1c' },
    { id: 'violet',  name: 'Violet',   c1: '#7c3aed', c2: '#e9d5ff', c3: '#1a1033' }
];

const THEME_MODES = [
    { id: 'light', name: 'Clair', icon: 'fa-sun' },
    { id: 'dark',  name: 'Sombre', icon: 'fa-moon' },
    { id: 'auto',  name: 'Auto',   icon: 'fa-circle-half-stroke' }
];

const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

function readTheme(){
    try {
        const s = JSON.parse(localStorage.getItem(THEME_KEY) || '{}');
        return {
            /* le site est sombre par défaut : c'est le parti pris « premium ».
               L'utilisateur reste libre de passer en clair ou en automatique. */
            mode: THEME_MODES.some(m => m.id === s.mode) ? s.mode : 'dark',
            accent: THEME_ACCENTS.some(a => a.id === s.accent) ? s.accent : 'orange'
        };
    } catch (e) {
        return { mode: 'dark', accent: 'orange' };
    }
}

function writeTheme(t){
    try { localStorage.setItem(THEME_KEY, JSON.stringify(t)); } catch (e) { /* navigation privée */ }
}

let theme = readTheme();

/* --- appliquer le thème sur la page --- */
function applyTheme(opts){
    const o = opts || {};
    const root = document.documentElement;
    const dark = theme.mode === 'auto' ? !!(darkQuery && darkQuery.matches) : theme.mode === 'dark';

    if (o.fade !== false){
        root.classList.add('theme-fade');
        clearTimeout(applyTheme.timer);
        applyTheme.timer = setTimeout(() => root.classList.remove('theme-fade'), 260);
    }
    root.dataset.mode = dark ? 'dark' : 'light';
    root.dataset.accent = theme.accent;

    if (o.save) writeTheme(theme);
    paintThemeButtons();
    paintThemePanel();
    return dark;
}

function accentName(){
    const a = THEME_ACCENTS.find(x => x.id === theme.accent);
    return a ? (typeof t === 'function' ? t(a.name) : a.name) : 'Orange';
}

/* --- le texte et l'icône des boutons de l'en-tête --- */
function paintThemeButtons(){
    const dark = document.documentElement.dataset.mode === 'dark';
    document.querySelectorAll('[data-theme-open]').forEach(btn => {
        const label = btn.querySelector('[data-theme-label]');
        if (label) label.textContent = accentName();
        const ic = btn.querySelector('.h-theme-ic');
        if (ic) ic.className = 'h-theme-ic fas ' + (dark ? 'fa-moon' : 'fa-palette');
    });
}

/* ==========================================================
   LE PANNEAU DE RÉGLAGE
   Construit une seule fois, posé dans <body> : en bulle sous
   le bouton sur grand écran, en feuille du bas sur téléphone.
   ========================================================== */
let panel = null, backdrop = null, panelFor = null;

function buildPanel(){
    if (panel) return;

    backdrop = document.createElement('div');
    backdrop.className = 'theme-backdrop';
    backdrop.addEventListener('click', closePanel);

    panel = document.createElement('div');
    panel.className = 'theme-panel';
    panel.id = 'themePanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Changer le thème du site');
    panel.innerHTML =
        '<div class="theme-panel-head"><b data-i18n="Apparence du site">Apparence du site</b>' +
        '<button class="theme-close" type="button" data-theme-close aria-label="Fermer">' +
        '<i class="fas fa-xmark"></i></button></div>' +
        '<div class="theme-label" data-i18n="Luminosité">Luminosité</div><div class="theme-modes">' +
        THEME_MODES.map(m =>
            `<button type="button" data-mode-set="${m.id}" data-i18n="${m.name}"><i class="fas ${m.icon}"></i><span>${m.name}</span></button>`
        ).join('') + '</div>' +
        '<div class="theme-label" data-i18n="Couleur">Couleur</div><div class="theme-swatches">' +
        THEME_ACCENTS.map(a =>
            `<button type="button" data-accent-set="${a.id}" title="${a.name}">` +
            `<span class="ts-dots" style="--c1:${a.c1};--c2:${a.c2};--c3:${a.c3}"><i></i><i></i><i></i></span>` +
            `<span class="ts-name" data-i18n="${a.name}">${a.name}</span></button>`
        ).join('') + '</div>' +
        '<p class="theme-note" data-i18n="Votre choix est gardé sur cet appareil, sur toutes les pages.">' +
        'Votre choix est gardé sur cet appareil, sur toutes les pages.</p>';

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    panel.querySelector('[data-theme-close]').addEventListener('click', closePanel);
    panel.addEventListener('click', e => {
        const m = e.target.closest('[data-mode-set]');
        if (m){ theme.mode = m.dataset.modeSet; applyTheme({ save: true }); return; }
        const a = e.target.closest('[data-accent-set]');
        if (a){ theme.accent = a.dataset.accentSet; applyTheme({ save: true }); }
    });
}

/* --- cocher le réglage actif dans le panneau --- */
function paintThemePanel(){
    if (!panel) return;
    panel.querySelectorAll('[data-mode-set]').forEach(b =>
        b.classList.toggle('on', b.dataset.modeSet === theme.mode));
    panel.querySelectorAll('[data-accent-set]').forEach(b =>
        b.classList.toggle('on', b.dataset.accentSet === theme.accent));
}

/* --- placer la bulle sous le bouton qui a été cliqué --- */
function placePanel(btn){
    if (window.innerWidth <= 900 || !btn){    /* sur téléphone : feuille du bas */
        panel.style.left = '';
        panel.style.top = '';
        return;
    }
    const r = btn.getBoundingClientRect();
    const w = panel.offsetWidth;
    const left = Math.min(Math.max(8, r.right - w), window.innerWidth - w - 8);
    const top = Math.min(r.bottom + 8, window.innerHeight - panel.offsetHeight - 8);
    panel.style.left = left + 'px';
    panel.style.top = Math.max(8, top) + 'px';
}

/* la page reste en place derrière la feuille du bas, mais pas
   derrière une petite bulle : sinon on ne peut plus défiler */
function lockScroll(on){
    document.body.classList.toggle('modal-open', on);
}

function openPanel(btn){
    buildPanel();
    /* le panneau passe devant : on referme ce qui pouvait être ouvert */
    if (typeof closeAll === 'function') closeAll();
    panelFor = btn || null;
    document.querySelectorAll('[data-theme-open]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (btn) btn.setAttribute('aria-expanded', 'true');
    placePanel(btn);
    backdrop.classList.add('show');
    panel.classList.add('open');
    lockScroll(window.innerWidth <= 900);
}

function closePanel(){
    if (!panel) return;
    panel.classList.remove('open');
    backdrop.classList.remove('show');
    lockScroll(false);
    if (panelFor) panelFor.setAttribute('aria-expanded', 'false');
    panelFor = null;
}

const isPanelOpen = () => !!(panel && panel.classList.contains('open'));

/* ==========================================================
   BRANCHEMENT SUR LA PAGE
   ========================================================== */
applyTheme();          /* avant le premier affichage */
document.addEventListener('DOMContentLoaded', () => {
    paintThemeButtons();
    /* le nom de la couleur suit la langue du site */
    window.addEventListener('be:lang', () => { paintThemeButtons(); paintThemePanel(); });

    document.addEventListener('click', e => {
        const open = e.target.closest('[data-theme-open]');
        if (open){
            e.preventDefault();
            if (isPanelOpen()) closePanel(); else openPanel(open);
            return;
        }
        if (isPanelOpen() && !e.target.closest('#themePanel')) closePanel();
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
    window.addEventListener('resize', () => {
        if (!isPanelOpen()) return;
        placePanel(panelFor);
        lockScroll(window.innerWidth <= 900);
    });
    window.addEventListener('scroll', () => { if (isPanelOpen()) closePanel(); }, true);

    /* en mode « automatique », on suit le réglage du système */
    if (darkQuery){
        const onChange = () => { if (theme.mode === 'auto') applyTheme(); };
        if (darkQuery.addEventListener) darkQuery.addEventListener('change', onChange);
        else if (darkQuery.addListener) darkQuery.addListener(onChange);
    }
});
