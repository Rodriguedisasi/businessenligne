/* Mesure la mise en page réelle : débordements, tailles, polices.
   Usage : node _measure.js <url> <largeur> [largeur...]                     */
const { spawn } = require('child_process');  // lance Edge en mode sans-interface, piloté via le port de débogage
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9333;

const sleep = ms => new Promise(r => setTimeout(r, ms));

const PROBE = `(() => {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const out = { url: location.pathname, vw, scrollW: de.scrollWidth, over: [], info: {} };
  const vis = el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    return true;
  };
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || !vis(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return;
    if (r.right > vw + 1.5 || r.left < -1.5) {
      out.over.push(el.tagName.toLowerCase() + '.' +
        String(el.className || '').trim().split(/\\s+/).filter(Boolean).slice(0,3).join('.') +
        ' [L' + Math.round(r.left) + ' R' + Math.round(r.right) + ']');
    }
  });
  const box = s => {
    const e = document.querySelector(s);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return Math.round(r.width) + 'x' + Math.round(r.height) + '@' + Math.round(r.left);
  };
  const fs = s => { const e = document.querySelector(s); return e ? Math.round(parseFloat(getComputedStyle(e).fontSize)) + 'px' : null; };
  const disp = s => { const e = document.querySelector(s); return e ? getComputedStyle(e).display : null; };
  const m = out.info;
  m.hdrTop = box('.hdr-top'); m.logo = box('.logo'); m.search = box('.search-bar');
  m.accBtn = box('.h-account'); m.cartBtn = box('.h-cart'); m.mnav = box('.mnav');
  m.pCard = box('.p-card'); m.pImg = box('.p-img-wrap');
  m.fCard = box('.filters-side'); m.fToggle = box('.fs-toggle');
  m.cartDrawer = box('.cart-drawer'); m.modalCard = box('.modal-card');
  m.pGridCols = (() => { const e = document.querySelector('.p-grid'); return e ? getComputedStyle(e).gridTemplateColumns : null; })();
  m.pTitleFont = fs('.p-title'); m.pPriceFont = fs('.p-price');
  m.searchFont = fs('.search-input'); m.catFont = fs('.search-cat');
  m.accText = (() => { const e = document.querySelector('.h-account small'); return e ? getComputedStyle(e).display : null; })();
  m.mnavDisplay = disp('.mnav'); m.filtersSide = disp('.filters-side'); m.fsToggle = disp('.fs-toggle');
  m.bodyPadB = getComputedStyle(document.body).paddingBottom;
  m.mnavItems = document.querySelectorAll('.mnav a, .mnav button').length;
  m.cards = document.querySelectorAll('.p-card').length;
  m.tinyText = (() => {
    let worst = 99, sel = '';
    document.querySelectorAll('body *').forEach(el => {
      if (!el.childNodes.length) return;
      let onlyText = true;
      el.childNodes.forEach(n => { if (n.nodeType === 1) onlyText = false; });
      if (!onlyText || !el.textContent.trim()) return;
      if (!vis(el)) return;
      const px = parseFloat(getComputedStyle(el).fontSize);
      if (px < worst) { worst = px; sel = el.className || el.tagName; }
    });
    return worst + 'px on .' + sel;
  })();
  out.over = [...new Set(out.over)].slice(0, 10);
  out.cssOK = getComputedStyle(document.body).backgroundColor;
  const c0 = document.querySelector('.p-card');
  out.cardKids = c0 ? [...c0.children].map(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return (el.className || el.tagName).toString().split(' ')[0] + '=' + Math.round(r.height)
      + (cs.display === 'none' ? '(hidden)' : '');
  }).join(' ') : null;
  out.cardPad = c0 ? getComputedStyle(c0).padding : null;
  return JSON.stringify(out);
})()`;

(async () => {
  const pages = process.argv.slice(2);
  const widths = [320, 360, 414, 768];
  const proc = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`, '--user-data-dir=C:\\Users\\user\\AppData\\Local\\Temp\\opencode\\cdp',
    'about:blank'
  ], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 40 && !target; i++){
    await sleep(500);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find(t => t.type === 'page');
    } catch (e) {}
  }
  if (!target){ console.log('CDP introuvable'); proc.kill(); process.exit(1); }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const waiting = new Map();
  const send = (method, params = {}) => new Promise((res, rej) => {
    const n = ++id;
    waiting.set(n, { res, rej });
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && waiting.has(m.id)){ waiting.get(m.id).res(m.result); waiting.delete(m.id); }
  };
  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });

  for (const page of pages){
    for (const w of widths){
      await send('Emulation.setDeviceMetricsOverride', {
        width: w, height: w < 400 ? 640 : 900, deviceScaleFactor: 1, mobile: true
      });
      await send('Page.navigate', { url: 'http://localhost:3000/' + page });
      /* on attend que la feuille de style ET les produits soient là */
      let ready = false;
      for (let k = 0; k < 25 && !ready; k++){
        await sleep(400);
        const t = await send('Runtime.evaluate', {
          expression: `(() => { try { return (getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)' && !!document.querySelector('.p-card')) ? 'ok' : 'wait'; } catch (e) { return 'wait'; } })()`,
          returnByValue: true
        });
        if (t.result && t.result.value === 'ok') ready = true;
      }
      await sleep(600);
      const r = await send('Runtime.evaluate', { expression: PROBE, returnByValue: true });
      if (!r.result || !r.result.value){ console.log(page, w, '-> pas de retour'); continue; }
      const o = JSON.parse(r.result.value);
      const bad = o.scrollW > o.vw + 1;
      console.log(`\n=== ${o.url} @${w}px  scrollW=${o.scrollW} clientW=${o.vw} ${bad ? '<<< DEBORDEMENT >>>' : 'OK'} css=${o.cssOK}`);
      const i = o.info;
      console.log(`    hdr=${i.hdrTop} logo=${i.logo} search=${i.search} acc=${i.accBtn}(txt:${i.accText}) cart=${i.cartBtn} mnav=${i.mnav}(${i.mnavItems}bx, ${i.mnavDisplay})`);
      console.log(`    pGrid=[${i.pGridCols}] card=${i.pCard} img=${i.pImg} n=${i.cards}`);
      console.log(`    enfants carte: ${o.cardKids} | padding=${o.cardPad}`);
      console.log(`    fonts: p-title=${i.pTitleFont} p-price=${i.pPriceFont} search=${i.searchFont} cat=${i.catFont} | plus petit texte: ${i.tinyText}`);
      console.log(`    filtres: aside=${i.filtersSide} toggle=${i.fsToggle}(${i.fsToggle}) | drawer=${i.cartDrawer} modal=${i.modalCard} | bodyPadB=${i.bodyPadB}`);
      if (o.over.length) console.log('    HORS CADRE: ' + o.over.join('  '));
    }
  }
  ws.close();
  proc.kill();
  process.exit(0);
})();
