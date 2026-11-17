/* Drives the real side panel (src/preview.html, which loads the real storage.js,
   graph.js and sidepanel.js) into one state per store image, then keys the caption's
   rule to the row it describes. Nothing here draws panel UI. */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms = 15000) {
  const t0 = performance.now();
  for (;;) {
    const v = await fn();
    if (v) return v;
    if (performance.now() - t0 > ms) throw new Error('timed out waiting for the panel');
    await sleep(30);
  }
}

// Deterministic Math.random so the graph settles the same way every render.
function seeded(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Mount the panel, swap in the sample archive, and answer the two background
// messages the way the real service worker does for ACTIVE_PAGE.
async function mountPanel(host, height) {
  host.style.height = height + 'px';
  const frame = document.createElement('iframe');
  frame.src = '../../src/preview.html';
  host.append(frame);
  await new Promise((r) => frame.addEventListener('load', r, { once: true }));
  const w = frame.contentWindow;
  const d = frame.contentDocument;
  await until(() => w.klippitStorage && d.querySelector('#stats div'));

  // The footer's author handle is a personal name; keep it out of store images.
  const style = d.createElement('style');
  style.textContent = 'a.link-btn[href$="/toshon-jennings"] { display: none; }';
  d.head.append(style);

  const rt = w.chrome.runtime;
  const passThrough = rt.sendMessage;
  rt.sendMessage = (msg, cb) => {
    const reply = (v) => Promise.resolve(v).then((r) => cb && cb(r));
    if (msg && msg.type === 'klippit:get-active-tab') {
      return reply({ ok: true, tab: { ...ACTIVE_PAGE, capturable: true } });
    }
    if (msg && msg.type === 'klippit:capture-active-tab') {
      return reply(w.klippitStorage.saveLink({ ...ACTIVE_PAGE, note: msg.note || '' }).then((r) => ({ ok: true, ...r })));
    }
    return passThrough(msg, cb);
  };

  await w.klippitStorage.importAll(buildSeed(Date.now()));
  w.Math.random = seeded(7);
  await view(d, 'list');
  await until(() => d.querySelector('#stats').textContent.includes('8 links'));
  return { frame, w, d };
}

async function view(d, name) {
  d.querySelector(`.seg[data-view="${name}"]`).click();
  await sleep(200);
}

// Page y of the middle of an element inside the panel.
function rowOf(frame, el) {
  const r = el.getBoundingClientRect();
  return frame.getBoundingClientRect().top + r.top + r.height / 2;
}

function caption(lines) {
  const p = document.createElement('p');
  p.className = 'caption';
  lines.forEach((line, i) => p.append(...(i ? [document.createElement('br')] : []), line));
  return p;
}

// The margin note: the rule sits on the target row; the note sits on the side of
// it that faces the middle of the image.
function annotate(note, y) {
  const rule = document.createElement('div');
  rule.className = 'rule';
  rule.style.top = y + 'px';
  document.body.append(note, rule);
  const gap = 24;
  const below = y < innerHeight / 2;
  note.style.top = (below ? y + gap : y - gap - note.offsetHeight) + 'px';
}

// One state per screenshot. `height` is the panel's height in CSS px; panels taller
// than the frame run off its bottom edge. Each run() returns the page y to rule to.
const SHOTS = {
  1: { lines: ['Save the page.', 'Say why.'], height: 760, async run({ d, frame }) {
    d.querySelector('#save-page').click();
    await until(() => !d.querySelector('#context-pane').hidden);
    d.querySelector('#context-input').value = 'Bag the autumn leaves instead of burning them. Ready for the beds by spring.';
    d.querySelector('#context-tags').value = 'garden';
    return rowOf(frame, d.querySelector('#context-input'));
  } },
  2: { lines: ['See how it', 'all connects.'], height: 608, async run({ w, d, frame }) {
    // Hold the animation clock and step the graph's own physics instead, so the
    // layout is the same every render (headless virtual time drops frames).
    w.requestAnimationFrame = () => 0;
    w.Math.random = seeded(166); // a seed whose settled layout clips and overlaps no label
    // The card's "View in graph" button: opens Graph focused on that item.
    d.querySelector('.card[data-id="l_companion"] .meta-graph-btn').click();
    const g = await until(() => w.KlippitGraph.last && w.KlippitGraph.last.centerId && w.KlippitGraph.last);
    while (g.alpha > 0) g.tick();
    const c = g.pos.get('l_companion');
    g.offset.x = -c.x * g.scale;
    g.offset.y = -c.y * g.scale;
    g.centerId = null;
    g.draw();
    return frame.getBoundingClientRect().top + d.querySelector('#graph-canvas').getBoundingClientRect().top + g.toScreen(c).y;
  } },
  3: { lines: ['Sort by tag,', 'never by folder.'], height: 760, async run({ d, frame }) {
    await view(d, 'groups');
    const list = d.querySelector('#list');
    await until(() => list.querySelectorAll('.group').length > 2);
    const [garden, kitchen] = list.querySelectorAll('.group');
    // Scroll to where the same item ends #garden and opens #kitchen.
    const first = garden.querySelector('.card[data-id="l_companion"]');
    const pinned = garden.querySelector('.group-head').offsetHeight;
    list.scrollTop += first.getBoundingClientRect().top - list.getBoundingClientRect().top - pinned - 6;
    await sleep(50);
    return rowOf(frame, kitchen.querySelector('.group-head'));
  } },
  4: { lines: ['Highlight text,', 'right-click,', 'keep it.'], height: 760, async run({ d, frame }) {
    d.querySelector('.chip-type[data-type="note"]').click();
    await until(() => d.querySelector('.card[data-id="n_read"] .card-source'));
    return rowOf(frame, d.querySelector('.card[data-id="n_read"] .card-source'));
  } },
  5: { lines: ['Yours alone.', 'No account,', 'no sync.'], height: 608, async run({ d, frame }) {
    const list = d.querySelector('#list');
    list.scrollTop = list.querySelector('.card[data-id="l_fvs"]').offsetTop - 10;
    await sleep(50);
    return rowOf(frame, d.querySelector('#export'));
  } },
};
