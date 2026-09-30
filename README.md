# NOTERA

Landing page for NOTERA, a platform for deep, verifiable historical, geopolitical and OSINT research. Every significant conclusion opens to evidence and the original source.

Live: <https://phnem.github.io/NOTERA/> (GitHub Pages, served from `main`).

Static site: no build step.

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | All sections and English copy |
| `css/styles.css` | Design tokens, layout, responsive rules |
| `js/main.js` | EN/RU switch, evidence tabs, red-thread overlay, request form |
| `assets/img/` | Public-domain photographs and a declassified document scan |

## Configuration

- `CONTACT_EMAIL` in `js/main.js`: address that receives research requests from the form (it opens the visitor's mail client). Empty by default.
- Russian copy lives in the `RU` dictionary in `js/main.js`. English stays in the markup.

## How the thread works

Every `data-pin` element is an anchor. `data-to` lists the pins it connects to. `js/main.js` measures the anchors and draws sagging red threads and pin heads in one SVG overlay, then redraws on resize, language change and tab change. Threads draw in as they scroll into view and are static under `prefers-reduced-motion`.

## Image credits

All images are public domain, sourced via Wikimedia Commons.

| File | Commons title |
| --- | --- |
| `camp-david-1978.jpg` | Begin, Carter and Sadat at Camp David 1978.jpg |
| `nixon-shah-1973.jpg` | President Richard Nixon chats with the Shah of Iran, Mohammed Reza Pahlavi in the Oval Office.jpg |
| `mosaddegh.jpg` | Dr Mohammad Mosaddeq.jpg |
| `carter-letter.jpg` | Letter from Jimmy Carter to Ayatollah Ruhollah Khomeini Regarding the Release of the Iranian Hostages.jpg |
| `reagan-1987.jpg` | President Ronald Reagan making an address to the nation on the Iran-Contra Controversy in Oval Office (cropped).jpg |

Newspaper clippings on the board are typographic illustrations, not reproductions of real publications.

## Fonts, icons and textures

Everything is self-hosted, no third-party requests.

- `css/fonts.css` and `assets/fonts/`: Google Fonts subsets (latin, cyrillic, arabic, hebrew) for Dela Gothic One, Unbounded, Onest, Old Standard TT, IBM Plex Mono, Vazirmatn, Amiri and Frank Ruhl Libre. All are open-licensed (OFL or Apache-2.0).
- `assets/vendor/phosphor/`: Phosphor Icons (bold), MIT.
- `assets/tex/`: paper texture generated procedurally for this project.

## Placeholders

- `CONTACT_EMAIL` in `js/main.js` is empty until the request address is decided.
- "Find a project" does nothing yet. Set `FIND_PROJECT_URL` in `js/main.js` when project search exists.
