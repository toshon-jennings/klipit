/* Sample archive for the store images. Neutral public pages or example.com only;
   loaded into the real panel through klippitStorage.importAll (the Import path). */

// The page "open in the browser" when the Clip button is pressed (screenshot 1).
const ACTIVE_PAGE = {
  url: 'https://en.wikipedia.org/wiki/Leaf_mold',
  title: 'Leaf mold',
  favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
};

function buildSeed(now) {
  const M = 60e3, H = 60 * M, D = 24 * H;
  const WIKI = 'https://en.wikipedia.org/static/favicon/wikipedia.ico';
  const MDN = 'https://developer.mozilla.org/favicon.ico';
  const NONE = 'https://example.com/favicon.ico'; // 404s, so the panel hides it

  const link = (id, ago, url, favicon, title, note, tags) =>
    ({ id, type: 'link', url, title, favicon, note, tags, createdAt: now - ago, updatedAt: now - ago });
  const note = (id, ago, title, body, tags, source = null) =>
    ({ id, type: 'note', url: null, title, favicon: null, note: body, tags, source, createdAt: now - ago, updatedAt: now - ago });

  const list = [
    note('n_read', 9 * M, 'On reading',
      'Reading maketh a full man; conference a ready man; and writing an exact man.',
      ['reading', 'writing'],
      { url: 'https://www.gutenberg.org/ebooks/575', title: 'Essays - Project Gutenberg' }),
    link('l_nodig', 3 * H, 'https://en.wikipedia.org/wiki/No-dig_gardening', WIKI, 'No-dig gardening',
      'Cardboard first, compost on top. Start the back bed in October.', ['garden']),
    link('l_cpbook', 5 * H, 'https://en.wikipedia.org/wiki/Commonplace_book', WIKI, 'Commonplace book',
      'Old readers indexed theirs by topic, not by date. That is all a tag is.', ['notes', 'history']),
    note('n_beds', 20 * H, 'Back bed plan',
      'Two rows of beans, tomatoes against the fence, basil in the gaps.', ['garden', 'todo']),
    note('n_why', D + 2 * H, 'Why keep one',
      'Copying a passage out by hand is how you notice what it actually says.', ['notes', 'writing']),
    link('l_companion', D + 6 * H, 'https://en.wikipedia.org/wiki/Companion_planting', WIKI, 'Companion planting',
      'Basil between the tomatoes. The thinnings go in pesto.', ['garden', 'kitchen']),
    link('l_fvs', 2 * D, 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings', MDN,
      'font-variation-settings', 'Variable font axes: weight, width, and the odd custom ones.', ['css', 'type']),
    link('l_wayback', 2 * D + 5 * H, 'https://web.archive.org/', 'https://web.archive.org/_static/images/archive.ico',
      'Wayback Machine', 'Check here before a saved link rots.', ['notes', 'reference']),
    link('l_sourdough', 3 * D, 'https://example.com/sourdough-starter', NONE, 'Sourdough starter',
      '', ['kitchen']),
    link('l_vfguide', 4 * D, 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide', MDN,
      'Variable fonts guide', '', ['css', 'type']),
    note('n_cook', 5 * D, 'Cook this week',
      'Butter beans with miso. Quick pickled shallots. Use up the basil.', ['kitchen', 'todo']),
    link('l_measure', 6 * D, 'https://example.com/line-length', NONE, 'Readable line length',
      'Somewhere between 45 and 75 characters a line.', ['type', 'reading']),
    note('n_winter', 8 * D, 'Winter reading',
      'Three books, one at a time, a notebook beside each.', ['reading', 'todo']),
  ];

  const conn = (id, a, b, label, ago) => ({ id, a, b, label, createdAt: now - ago });
  const connections = [
    conn('c1', 'l_cpbook', 'n_why', 'same idea', 4 * H),
    conn('c2', 'n_why', 'n_read', 'copy it out', 8 * M),
    conn('c3', 'l_nodig', 'n_beds', '', 2 * H),
    conn('c4', 'l_companion', 'n_cook', 'basil', D),
    conn('c5', 'n_beds', 'l_companion', '', 19 * H),
    conn('c6', 'l_fvs', 'l_vfguide', '', 2 * D),
  ];

  return {
    schema: 1,
    items: Object.fromEntries(list.map((i) => [i.id, i])),
    connections: Object.fromEntries(connections.map((c) => [c.id, c])),
  };
}
