/* Vérifie les panneaux ouverts : panier, fiche produit, visionneuse, filtres, menu. */
const { spawn } = require('child_process');  // lance Edge en mode sans-interface pour tester les panneaux
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9334;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const run = (send, expr) => send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })
  .then(r => (r.result && r.result.value !== undefined) ? r.result.value : null)
  .catch(e => 'ERR:' + e.message);

(async () => {
  const page = process.argv[2] || 'tous.html';
  const widths = [320, 390];
  const proc = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`, '--user-data-dir=C:\\Users\\user\\AppData\\Local\\Temp\\opencode\\cdp2',
    'about:blank'
  ], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 40 && !target; i++){
    await sleep(500);
    try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find(t => t.type === 'page'); } catch (e) {}
  }
  if (!target){ console.log('CDP introuvable'); proc.kill(); process.exit(1); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0; const waiting = new Map();
  const send = (method, params = {}) => new Promise(res => { const n = ++id; waiting.set(n, res); ws.send(JSON.stringify({ id: n, method, params })); });
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && waiting.has(m.id)){ waiting.get(m.id)(m.result); waiting.delete(m.id); } };
  await new Promise(r => ws.onopen = r);
  await send('Page.enable'); await send('Runtime.enable');
  await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });

  const BOX = sel => `(() => { const e = document.querySelector('${sel}'); if (!e) return 'ABSENT';
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return Math.round(r.width) + 'x' + Math.round(r.height) + ' @' + Math.round(r.left) + ',' + Math.round(r.top)
      + ' scrollH=' + e.scrollHeight + ' disp=' + cs.display + ' z=' + cs.zIndex; })()`;

  for (const w of widths){
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: 740, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: 'http://localhost:3000/' + page });
    for (let k = 0; k < 25; k++){
      await sleep(400);
      const ok = await run(send, `(getComputedStyle(document.body).backgroundColor!=='rgba(0, 0, 0, 0)' && !!document.querySelector('.p-card')) ? 1 : 0`);
      if (ok === 1) break;
    }
    await sleep(800);
    console.log(`\n########## ${page} @${w}px`);

    /* on met deux articles au panier puis on l'ouvre */
    await run(send, `(() => { const b = document.querySelectorAll('[data-add]');
      if (b[0]) b[0].click(); if (b[1]) b[1].click(); return 1; })()`);
    await sleep(400);
    await run(send, `(document.getElementById('cartIcon')||{click(){}}).click(); 1`);
    await sleep(700);
    console.log('  PANIER ouvert   :', await run(send, BOX('.cart-drawer')));
    console.log('    pied panier   :', await run(send, BOX('.cart-foot')));
    console.log('    ligne panier  :', await run(send, BOX('.cart-row')));
    console.log('    body verrouillé:', await run(send, `getComputedStyle(document.body).overflow`));
    console.log('    mnav cachée    :', await run(send, `(() => { const m = document.querySelector('.mnav'); return m ? getComputedStyle(m).visibility : '-'; })()`));
    await run(send, `document.getElementById('closeCart').click(); 1`); await sleep(500);

    /* fiche produit */
    await run(send, `(() => { const c = document.querySelector('#catGrid .p-card, #grid .p-card, .p-card');
      if (c) c.querySelector('.p-title').click(); return 1; })()`);
    await sleep(800);
    console.log('  FICHE ouverte   :', await run(send, BOX('.modal-card')));
    console.log('    image fiche   :', await run(send, BOX('.modal-img .gal-stage')));
    console.log('    bloc achat    :', await run(send, `(() => { const b = document.querySelector('.buy-box'); if (!b) return 'ABSENT';
      const r = b.getBoundingClientRect(); const card = document.querySelector('.modal-card').getBoundingClientRect();
      return Math.round(r.width) + 'x' + Math.round(r.height) + ' bas=' + Math.round(r.bottom) + ' carteBas=' + Math.round(card.bottom)
      + ' pos=' + getComputedStyle(b).position; })()`));
    console.log('    thumbs        :', await run(send, BOX('.modal-img .gal-thumb')));
    await run(send, `document.getElementById('modalClose').click(); 1`); await sleep(500);

    /* visionneuse plein ecran */
    await run(send, `(() => { const s = document.querySelector('.p-card .gal-stage'); if (s) s.click(); return 1; })()`);
    await sleep(800);
    console.log('  VISIONNEUSE     :', await run(send, BOX('.lightbox')));
    console.log('    zone image    :', await run(send, BOX('.lb-stage')));
    console.log('    pied          :', await run(send, BOX('.lb-foot')));
    await run(send, `(() => { const c = document.querySelector('.lb-close'); if (c) c.click(); return 1; })()`); await sleep(500);

    /* filtres replies / menu lateral / menu du compte */
    await run(send, `(() => { const t = document.querySelector('.fs-toggle'); if (t) t.click(); return 1; })()`); await sleep(500);
    console.log('  FILTRES ouverts :', await run(send, BOX('.filters-side')));
    await run(send, `(() => { const m = document.getElementById('menuBtn'); if (m) m.click(); return 1; })()`); await sleep(600);
    console.log('  MENU LATERAL    :', await run(send, BOX('.side-menu')));
    await run(send, `document.getElementById('overlay').click(); 1`); await sleep(400);
    await run(send, `(() => { const a = document.getElementById('accountBtn'); if (a) a.click(); return 1; })()`); await sleep(600);
    console.log('  MENU COMPTE     :', await run(send, BOX('.account-menu')));
    console.log('  BARRE BASSE     :', await run(send, BOX('.mnav')), '| boutons touchables:',
      await run(send, `(() => { const b = document.querySelector('.mnav button, .mnav a');
        return b ? Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height) : '-'; })()`));
  }
  ws.close(); proc.kill(); process.exit(0);
})();
