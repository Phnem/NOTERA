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
| `projects/`, `css/pages.css`, `js/pages.js`, `js/projects.js`, `js/report.js` | Project list and report reader |
| `assets/img/` | Public-domain photographs and a declassified document scan |

## Configuration

- Research requests: GitHub Pages has no server, so the form posts to [Web3Forms](https://web3forms.com), which emails each request (question + reply address) to the inbox that owns the access key. Create a key there with your inbox and put it in `FORM_ACCESS_KEY` in `js/main.js`; the key is public by design. Without a key the form opens the visitor's mail client addressed to `CONTACT_EMAIL`.
- Russian copy lives in the `RU` dictionary in `js/main.js` (landing) and in `js/pages.js` (projects and reports).

## Projects

`projects/` lists `projects/projects.json`; each project lives in `projects/<slug>/` and is produced from an audited publication by the researcher repo:

```bash
uv run --no-sync python scripts/export_site_project.py <RUN_ID> <slug> --visibility public
```

For `--visibility closed`, set `NOTERA_PROJECT_PASSWORD` first. The report and every material are encrypted with AES-256-GCM under a PBKDF2-SHA256 key (600k iterations); the password is never written. Making a published project closed later does not remove its earlier public files from git history.

The reader (`projects/_report.html`, `js/report.js`) marks sourced words with small citation bubbles: a number for quotations, icons for images, video, audio and documents, stacked when one passage has several kinds. A bubble opens a floating source panel with the quotation, its author and a copy button, image previews that open full size with download, and document downloads. Saved HTML pages ship as plain text so archived scripts never run on the site.

## How the thread works

Every `data-pin` element is an anchor. `data-to` lists the pins it connects to. `js/main.js` measures the anchors and draws sagging red threads and pin heads in one SVG overlay, then redraws on resize, language change and tab change. Threads draw in as they scroll into view and are static under `prefers-reduced-motion`. A thread carries a mask only while it draws; in-page links settle everything on the way first and hide fibre detail until the scroll ends, so jumps do not replay dozens of animations at once.

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

- `FORM_ACCESS_KEY` and `CONTACT_EMAIL` in `js/main.js` are empty until the request inbox is decided.
