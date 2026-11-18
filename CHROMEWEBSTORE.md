# Chrome Web Store Listing — Klipit

> Last Updated: 2026-11-17
> Live listing: https://chromewebstore.google.com/detail/klipit/pbbohdgekjmoebkddinfgaanhnkjpnpa (v0.4.3 at time of writing)

## Store Listing

**Extension Name** [REQUIRED]
Klipit

**Short Description** [REQUIRED] (max 132 chars)
The store takes this from `description` in `manifest.json`, so changing it ships with the next package, not from the dashboard. Update `manifest.json` and `manifest.firefox.json` together.

```text
Save links with a note on why they mattered, then connect them in a graph. Local-first. No account.
```

**Detailed Description** [REQUIRED] (plain text; paste as-is)

```text
You save a link because it matters. A week later you can't remember why.

Klipit fixes that at the moment you save. One click (or Cmd/Ctrl+Shift+S) saves the page and opens a note field right away: type why it mattered, or press Esc to skip. That's the whole habit.

Then Klipit turns the pile into a web you can actually see.

WHAT YOU CAN DO
• Save the current page in one click, or with Cmd/Ctrl+Shift+S, even when the panel is closed
• Write down why you saved it while it's still fresh
• Select text on any page, right-click, and choose "Save selection to Klipit". It becomes a note that remembers the page it came from
• Jot standalone notes that aren't tied to any URL
• Tag anything, then switch to Groups to see everything sorted by tag. An item with two tags appears under both: clusters, not folders
• Connect any two items (link to link, link to note, note to note) with an optional reason
• Open the Graph to see every saved item as a node. Connected items cluster, and items that share a tag are joined by faint dashed lines. Pan, zoom, drag, and click a node to highlight its neighbours
• Search across titles, URLs, notes and tags
• Rename, merge or delete tags across everything at once
• Export and import your whole archive as JSON for backup or moving machines

LOCAL-FIRST, NO ACCOUNT
Everything lives in your browser's local storage, on your device. No sign-up, no sync, no servers of ours, no analytics. Export a backup whenever you like.

Klipit opens in Chrome's side panel beside the page you're reading, and follows your system's light or dark theme.

Think of it as a commonplace book for the web: slow, intentional collecting, with the reason attached.
```

**Category** [REQUIRED]
Productivity (shown in the store as Workflow & Planning)

**Single Purpose** [REQUIRED]
Highlights and saves web pages and text selections to a local graph of connected notes.

**Primary Language** [REQUIRED]
English

## Graphics & Assets

All assets live in `store/`. Regenerate with `store/render.sh` (needs the repo served on :8777, Google Chrome, ImageMagick, and network access for the sample favicons).

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `icons/icon-128.png` |
| Screenshot 1 [REQUIRED] | 1280×800 | ✅ Ready | `store/screenshot-1-capture.png` |
| Screenshot 2 [RECOMMENDED] | 1280×800 | ✅ Ready | `store/screenshot-2-graph.png` |
| Screenshot 3 [RECOMMENDED] | 1280×800 | ✅ Ready | `store/screenshot-3-groups.png` |
| Screenshot 4 | 1280×800 | ✅ Ready | `store/screenshot-4-selection.png` |
| Screenshot 5 | 1280×800 | ✅ Ready | `store/screenshot-5-local.png` |
| Small Promo Tile [RECOMMENDED] | 440×280 | ✅ Ready | `store/promo-small.png` |
| Marquee Promo Tile | 1400×560 | ✅ Ready | `store/promo-marquee.png` |

Screenshots: 24-bit PNG or JPEG, no alpha, exactly 1280×800.

### Screenshot Plan
Each shows the real panel (seeded preview harness), one short caption each.

1. **Save the page. Say why.** Clip button and the note field open after saving.
2. **See how it all connects.** Graph view with connected clusters and shared-tag links.
3. **Sort by tag, never by folder.** Groups view; an item under more than one tag.
4. **Highlight text, right-click, keep it.** A note card with its "from …" source line.
5. **Yours alone. No account, no sync.** Footer with Export / Import / Tags.

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `storage` | permissions | Required to save links, notes, and connections locally on the user's device. |
| `tabs` | permissions | Required to retrieve the URL, title, and favicon of the active tab when the user clicks "Save the current page". |
| `activeTab` | permissions | Temporarily grants access to the current tab when the user triggers the capture command via keyboard shortcut or extension icon click. |
| `sidePanel` | permissions | Required to display the Klipit interface alongside the user's current browsing session. |
| `contextMenus` | permissions | Required to add a "Save selection to Klipit" option to the right-click menu, allowing users to save selected text as standalone notes. |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL** [RECOMMENDED]
https://github.com/toshon-jennings/klipit/blob/main/PRIVACY.md

## Distribution

**Visibility**: Public
**Regions**: All regions
**Pricing**: Free

## Developer Info

**Publisher Name** [REQUIRED]
Toshon Jennings

**Contact Email** [REQUIRED]
Set in the developer dashboard (kept out of this public repo).

**Support URL / Email** [RECOMMENDED]
https://github.com/toshon-jennings/klipit/issues

**Homepage URL** [RECOMMENDED]
https://github.com/toshon-jennings/klipit

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 0.4.5 | 2026-11-17 | Smaller graph nodes and a re-fit once the layout settles, so dense graphs fit the narrow panel. New short description. Includes 0.4.4. | Submitted for review 2026-11-17 |
| 0.4.4 | 2026-07-25 | Save the current page when embedded in a non-tabbed host. | Never submitted; shipped inside 0.4.5 |
| 0.4.3 | 2026-06-21 | Added visual polish, design refinements, and updated to Klipit. Replaced promise chains with async/await. | Live |

## Review Notes

### Known Issues / Limitations
None at this time.

### Rejection History
N/A
