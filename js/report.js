(() => {
  'use strict';
  const { t, esc, onLang } = window.NOTERA;
  const $ = (s, r = document) => r.querySelector(s);
  const app = $('#report');
  const slug = location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '').split('/').pop();
  const KEY_STORE = 'notera-key:' + slug;

  let bundle = null;
  let key = null;                       // CryptoKey for a closed report
  let version = 'compact';
  try { version = localStorage.getItem('notera-report-version') === 'full' ? 'full' : 'compact'; } catch (_) { /* ignore */ }
  const blobs = new Map();

  /* ------------------------------------------------------------ crypto */
  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function deriveKey(password, kdf) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', hash: kdf.hash, salt: b64(kdf.salt), iterations: kdf.iterations },
      base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']
    );
  }
  async function openSealed(sealed, k) {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(sealed.iv) }, k, b64(sealed.ct));
    return JSON.parse(new TextDecoder().decode(plain));
  }
  async function rememberKey(k) {
    try { const raw = await crypto.subtle.exportKey('raw', k); sessionStorage.setItem(KEY_STORE, btoa(String.fromCharCode(...new Uint8Array(raw)))); } catch (_) { /* ignore */ }
  }
  async function recallKey() {
    try {
      const raw = sessionStorage.getItem(KEY_STORE);
      return raw ? await crypto.subtle.importKey('raw', b64(raw), 'AES-GCM', true, ['decrypt']) : null;
    } catch (_) { return null; }
  }

  /* Material file URL: plain path for public reports, decrypted blob for closed ones. */
  async function fileUrl(name, mime) {
    if (!key) return name;
    if (blobs.has(name)) return blobs.get(name);
    const promise = fetch(name).then(r => r.arrayBuffer()).then(async buf => {
      const bytes = new Uint8Array(buf);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, key, bytes.slice(12));
      return URL.createObjectURL(new Blob([plain], { type: mime }));
    });
    blobs.set(name, promise);
    return promise;
  }

  /* ------------------------------------------------------------ bubbles */
  const ICON = { image: 'ph-image', video: 'ph-video-camera', audio: 'ph-speaker-high', document: 'ph-file-text', webpage: 'ph-globe-simple' };
  const KINDS = ['image', 'video', 'audio', 'document', 'webpage'];
  function tally(ids, citations) {
    const n = { text: 0, image: 0, video: 0, audio: 0, document: 0, webpage: 0 };
    ids.forEach(id => (citations[id]?.materials || []).forEach(m => { if (m.type in n) n[m.type] += 1; }));
    return n;
  }
  function bubble(ids, citations, anchorRef) {
    const n = tally(ids, citations);
    const parts = [];
    if (n.text) parts.push(`<span class="bub">${n.text}</span>`);
    KINDS.forEach(k => { if (n[k]) parts.push(`<span class="bub bub--icon"><i class="ph-fill ${ICON[k]}" aria-hidden="true"></i></span>`); });
    if (!parts.length) parts.push('<span class="bub bub--icon"><i class="ph-fill ph-link" aria-hidden="true"></i></span>');
    const words = [];
    if (n.text) words.push(`${n.text} ${t(n.text > 1 ? 'r.texts' : 'r.text')}`);
    [['image', 'r.image'], ['video', 'r.video1'], ['audio', 'r.audio1'], ['document', 'r.document'], ['webpage', 'r.webpage']]
      .forEach(([k, s]) => { if (n[k]) words.push(`${n[k]} ${t(s)}`); });
    return `<button type="button" class="cite" data-cites="${ids.join(' ')}"${anchorRef ? ` data-anchor="${anchorRef}"` : ''} aria-label="${esc(t('r.sources') + ': ' + words.join(', '))}" aria-haspopup="dialog" aria-expanded="false">${parts.join('')}</button>`;
  }
  function personBubble(pid, anchorRef) {
    const p = bundle.people?.[pid];
    if (!p) return '';
    const L = window.NOTERA.lang;
    const face = p.photo
      ? `<img alt="" data-file="${esc(p.photo.preview || p.photo.file)}" data-mime="${esc(p.photo.preview_mime || p.photo.mime)}">`
      : `<span class="bub__initials" aria-hidden="true">${esc(Array.from((p.name[L] || p.name.en).trim())[0] || '?')}</span>`;
    return `<button type="button" class="cite cite--person" data-person="${esc(pid)}" data-anchor="${anchorRef}" aria-label="${esc(t('r.about') + ' ' + (p.name[L] || p.name.en))}" aria-haspopup="dialog" aria-expanded="false"><span class="bub bub--face">${face}</span></button>`;
  }

  /* ------------------------------------------------------------ render */
  /* A quotation mark or full stop must never wrap away from the word it belongs to,
     so each anchor travels with its bubble and adjoining punctuation in one no-wrap unit. */
  const OPENERS = /[«“„"‘(\[]+$/;
  const CLOSERS = /^[»”"’)\]]*[.,;:!?…]*/;
  let anchorSeq = 0;
  function sentence(s, citations) {
    const chars = Array.from(s.text);          // anchor offsets are code points
    const anchors = (s.anchors || []).slice().sort((a, b) => a.start - b.start);
    let out = '', cursor = 0;
    const anchored = new Set();
    anchors.forEach((a, i) => {
      const before = chars.slice(cursor, a.start).join('');
      const lead = (before.match(OPENERS) || [''])[0];
      const limit = i + 1 < anchors.length ? anchors[i + 1].start : chars.length;
      const after = chars.slice(a.end, limit).join('');
      const trail = (after.match(CLOSERS) || [''])[0];
      const ref = 'a' + (anchorSeq++);
      const mark = a.person ? personBubble(a.person, ref) : bubble([a.citation_id], citations, ref);
      out += esc(before.slice(0, before.length - lead.length));
      out += `<span class="nw">${esc(lead)}<span class="s-anchor" id="${ref}">${esc(chars.slice(a.start, a.end).join(''))}</span>${mark}${esc(trail)}</span>`;
      cursor = a.end + Array.from(trail).length;
      if (a.citation_id) anchored.add(a.citation_id);
    });
    const rest = (s.citations || []).filter(c => !anchored.has(c));
    const tail = chars.slice(cursor).join('');
    if (!rest.length) return out + esc(tail);
    const m = tail.match(/(\S*?)([.!?…]*[»”"’)]*[.!?…]*\s*)$/);
    const lastWord = m ? m[1] : '', end = m ? m[2] : '';
    const body = tail.slice(0, tail.length - lastWord.length - end.length);
    return out + esc(body) + `<span class="nw">${esc(lastWord)}${bubble(rest, citations)}${esc(end)}</span>`;
  }

  function render() {
    if (!bundle) return;
    const L = window.NOTERA.lang;
    const rep = bundle.reports[version][L];
    const C = rep.citations;
    anchorSeq = 0;
    const blocks = rep.sections.map(sec => {
      let html = `<section id="s-${esc(sec.id)}"><h2>${esc(sec.title)}</h2>`;
      let table = [];
      const flush = () => {
        if (!table.length) return;
        html += `<table><thead><tr><th>${esc(t('r.th.date'))}</th><th>${esc(t('r.th.kind'))}</th><th>${esc(t('r.th.record'))}</th><th><span class="visually-hidden">${esc(t('r.th.src'))}</span></th></tr></thead><tbody>${table.join('')}</tbody></table>`;
        table = [];
      };
      sec.blocks.forEach(b => {
        if (b.type !== 'timeline') flush();
        if (b.type === 'paragraph') html += `<p class="par">${b.sentences.map(s => sentence(s, C)).join(' ')}</p>`;
        else if (b.type === 'quote') html += `<blockquote><p>${esc(b.text)}</p><footer><span>${esc(C[b.citation]?.label || '')}</span>${bubble([b.citation], C)}</footer></blockquote>`;
        else if (b.type === 'image') html += `<figure><button type="button" class="fig" data-file="${esc(b.file)}" data-preview="${esc(b.preview || '')}" data-mime="${esc(b.mime)}" data-pmime="${esc(b.preview_mime || b.mime)}" data-name="${esc(b.download_name)}" data-cap="${esc(b.caption)}"><img alt="${esc(b.caption)}" loading="lazy" decoding="async"></button><figcaption><span>${esc(b.caption)}</span>${b.citation ? bubble([b.citation], C) : ''}</figcaption></figure>`;
        else if (b.type === 'timeline') table.push(`<tr><td>${esc(b.date)}${b.time ? ' ' + esc(b.time) : ''}</td><td>${esc(t('r.date.' + b.date_kind))}</td><td>${esc(b.title)}</td><td>${bubble([b.citation], C)}</td></tr>`);
      });
      flush();
      return html + '</section>';
    }).join('');
    const limits = (bundle.limitations || []).map(l => `<li>${esc(l[L] || l.en)}</li>`).join('');
    const m = rep.metrics || {};
    app.innerHTML = `
      <a class="reader__back" href="../"><i class="ph-bold ph-arrow-left" aria-hidden="true"></i>${esc(t('r.back'))}</a>
      <h1 class="reader__title">${esc(rep.title)}</h1>
      <p class="reader__q">${esc(rep.question)}</p>
      <div class="reader__bar">
        <div class="seg" role="group" aria-label="${esc(t('r.version'))}">
          <button type="button" data-v="compact" aria-pressed="${version === 'compact'}">${esc(t('r.short'))}</button>
          <button type="button" data-v="full" aria-pressed="${version === 'full'}">${esc(t('r.full'))}</button>
        </div>
        <p class="reader__meta"><span>${m.reading_minutes || '?'} ${esc(t('r.read'))}</span><span>${m.word_count || '?'} ${esc(t('r.words'))}</span><span>${esc(t('r.updated'))} ${esc((bundle.finalized_at || '').slice(0, 10))}</span></p>
      </div>
      <article class="paper sheet-doc"><div class="doc">${blocks}${limits ? `<section class="limits"><h2>${esc(t('r.limits'))}</h2><ul>${limits}</ul></section>` : ''}</div></article>`;
    document.title = rep.title + ' - NOTERA';
    hydrateImages(app);
  }

  async function hydrateImages(root) {
    for (const b of root.querySelectorAll('.fig')) {
      const img = b.querySelector('img');
      try { img.src = await fileUrl(b.dataset.preview || b.dataset.file, b.dataset.pmime); } catch (_) { /* leave empty */ }
    }
    for (const img of root.querySelectorAll('img[data-file]')) {
      try { img.src = await fileUrl(img.dataset.file, img.dataset.mime); } catch (_) { /* leave empty */ }
    }
  }

  /* ------------------------------------------------------------ side panel */
  const side = $('#side'), sideBody = $('#side-body'), sideTitle = $('#side-title'), sideKicker = $('#side-kicker');
  let opener = null;
  function lit(ref, on) { const el = ref && document.getElementById(ref); if (el) el.classList.toggle('is-lit', on); }
  const size = b => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
  const imgLabel = (m, L) => (m.caption?.[L] || m.caption?.en || t('k.' + m.kind)) + (m.page ? ' · ' + t('k.page') + ' ' + m.page : '');
  const thumb = (m, cap) => `<button type="button" class="thumb" data-file="${esc(m.file)}" data-preview="${esc(m.preview || '')}" data-mime="${esc(m.mime)}" data-pmime="${esc(m.preview_mime || m.mime)}" data-name="${esc(m.download_name)}" data-cap="${esc(cap)}"><img alt="" loading="lazy" decoding="async"><span>${esc(cap)}</span></button>`;

  function quoteCard(c, m, i, L) {
    const rtl = /[֐-ࣿ]/.test(m.text);
    const author = m.author?.[L] || m.author?.en || '';
    return `<figure class="paper qcard"${rtl ? ' data-rtl' : ''}>
      <button type="button" class="qcard__copy" data-copyq="${esc(c.id)}:${i}" title="${esc(t('r.copyQuote'))}" aria-label="${esc(t('r.copyQuote'))}"><i class="ph-bold ph-copy" aria-hidden="true"></i></button>
      <blockquote class="qcard__text"${rtl ? ' dir="rtl" lang="fa"' : ''}>${esc(m.text)}</blockquote>
      <figcaption class="qcard__by"><i class="ph-bold ph-copyright" aria-hidden="true"></i><span>${esc(author)}</span></figcaption>
      <div class="qcard__row">${m.locator ? `<span class="qcard__loc">${esc(m.locator)}</span>` : '<span></span>'}<button type="button" class="pill" data-copy="${esc(c.id)}:${i}"><i class="ph-bold ph-quotes" aria-hidden="true"></i>${esc(t('r.copy'))}</button></div>
    </figure>`;
  }

  function materialHtml(c, single) {
    const L = window.NOTERA.lang;
    const texts = c.materials.filter(m => m.type === 'text');
    const images = c.materials.filter(m => m.type === 'image');
    const media = c.materials.filter(m => m.type === 'video' || m.type === 'audio');
    const files = c.materials.filter(m => m.type === 'document' || m.type === 'webpage');
    const links = c.materials.filter(m => m.type === 'link');
    let h = `<div class="side__cit">${single ? '' : `<p class="side__label"><b>[${esc(c.id)}]</b><span>${esc(c.label)}</span></p>`}${c.locator ? `<p class="side__loc">${single ? `<b>[${esc(c.id)}]</b> ` : ''}${esc(c.locator)}</p>` : ''}`;
    if (texts.length) h += `<div class="side__group"><p class="side__h"><i class="ph-bold ph-quotes" aria-hidden="true"></i>${esc(t('r.quote'))}</p>` + texts.map((m, i) => quoteCard(c, m, i, L)).join('') + '</div>';
    if (images.length) h += `<div class="side__group"><p class="side__h"><i class="ph-bold ph-image" aria-hidden="true"></i>${esc(t('r.images'))}</p><div class="thumbs">` + images.map(m => thumb(m, imgLabel(m, L))).join('') + '</div></div>';
    if (media.length) h += `<div class="side__group"><p class="side__h"><i class="ph-bold ph-play-circle" aria-hidden="true"></i>${esc(t('r.video'))}</p><div class="files">` + media.map(m =>
      `<div class="file"><i class="ph-fill ${ICON[m.type]}" aria-hidden="true"></i><div><p class="file__name">${esc(m.download_name)}</p><p class="file__sub">${size(m.bytes)}</p></div><div class="file__acts"><button type="button" class="pill pill--dark" data-play="${esc(m.file)}" data-mime="${esc(m.mime)}" data-name="${esc(m.download_name)}" data-kind="${m.type}"><i class="ph-bold ph-play" aria-hidden="true"></i>${esc(t('r.open'))}</button></div></div>`).join('') + '</div></div>';
    if (files.length) h += `<div class="side__group"><p class="side__h"><i class="ph-bold ph-files" aria-hidden="true"></i>${esc(t('r.docs'))}</p><div class="files">` + files.map(m =>
      `<div class="file"><i class="ph-fill ${ICON[m.type]}" aria-hidden="true"></i><div><p class="file__name">${esc(m.type === 'webpage' ? t('r.snapshot') : (m.kind === 'ARCHIVAL_COPY' ? 'PDF' : t('k.' + m.kind)))}</p><p class="file__sub">${esc(m.download_name)} · ${size(m.bytes)}</p></div><div class="file__acts"><button type="button" class="pill pill--dark" data-open="${esc(m.file)}" data-mime="${esc(m.mime)}"><i class="ph-bold ph-arrow-square-out" aria-hidden="true"></i>${esc(t('r.open'))}</button><button type="button" class="pill pill--dark" data-dl="${esc(m.file)}" data-mime="${esc(m.mime)}" data-name="${esc(m.download_name)}"><i class="ph-bold ph-download-simple" aria-hidden="true"></i>${esc(t('r.download'))}</button></div></div>`).join('') + '</div></div>';
    if (links.length) h += `<div class="side__group"><p class="side__h"><i class="ph-bold ph-globe" aria-hidden="true"></i>${esc(t('r.original'))}</p>` + links.map(m =>
      `<a class="link-out" href="${esc(m.url)}" target="_blank" rel="noopener noreferrer"><i class="ph-bold ph-arrow-square-out" aria-hidden="true"></i><span>${esc(m.url)}</span></a>`).join('') + '</div>';
    return h + '</div>';
  }

  function personHtml(p) {
    const L = window.NOTERA.lang;
    const photo = p.photo;
    const cap = photo ? (photo.caption?.[L] || photo.caption?.en || '') : '';
    const credit = photo ? [photo.author, photo.date, photo.license].filter(Boolean).join(' · ') : '';
    const links = (p.links || []).slice().sort((a, b) => (b.lang === L) - (a.lang === L));
    const photoHtml = photo
      ? `<div class="person__photo">${thumb(photo, cap)}</div>`
      : '';
    const creditHtml = photo
      ? `<p class="person__credit">${esc(t('r.photo'))}: ${photo.source_url ? `<a href="${esc(photo.source_url)}" target="_blank" rel="noopener noreferrer">${esc(credit)}</a>` : esc(credit)}</p>`
      : `<p class="person__credit">${esc(t('r.photoNone'))}</p>`;
    return `<div class="person">
      ${photoHtml}
      ${p.years ? `<p class="person__years">${esc(p.years)}</p>` : ''}
      <p class="person__role">${esc(p.role[L] || p.role.en)}</p>
      ${creditHtml}
      ${links.length ? `<div class="side__group"><p class="side__h"><i class="ph-bold ph-book-open" aria-hidden="true"></i>${esc(t('r.whois'))}</p>` : '<div>'}
      ${links.map(l => `<a class="link-out" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer"><i class="ph-bold ph-arrow-square-out" aria-hidden="true"></i><span>${esc(l.label)} (${esc(l.lang.toUpperCase())})</span></a>`).join('')}</div>
    </div>`;
  }

  async function openSide(btn) {
    const L = window.NOTERA.lang;
    if (opener && opener !== btn) { opener.setAttribute('aria-expanded', 'false'); lit(opener.dataset.anchor, false); }
    opener = btn;
    btn.setAttribute('aria-expanded', 'true');
    lit(btn.dataset.anchor, true);
    if (btn.dataset.person) {
      const p = bundle.people[btn.dataset.person];
      sideKicker.textContent = t('r.person');
      sideTitle.textContent = p.name[L] || p.name.en;
      sideBody.innerHTML = personHtml(p);
    } else {
      const C = bundle.reports[version][L].citations;
      const ids = btn.dataset.cites.split(' ').filter(id => C[id]);
      sideKicker.textContent = t('r.sources');
      sideTitle.textContent = ids.length > 1 ? t('r.sources') : (C[ids[0]]?.label || t('r.source'));
      sideBody.innerHTML = ids.map(id => materialHtml(C[id], ids.length === 1)).join('');
    }
    sideBody.scrollTop = 0;
    side.hidden = false;
    requestAnimationFrame(() => side.classList.add('is-open'));
    $('#side-x').focus({ preventScroll: true });
    for (const b of sideBody.querySelectorAll('.thumb')) {
      try { b.querySelector('img').src = await fileUrl(b.dataset.preview || b.dataset.file, b.dataset.pmime); } catch (_) { /* ignore */ }
    }
  }
  function closeSide() {
    if (!side.classList.contains('is-open')) return;
    side.classList.remove('is-open');
    if (opener) { opener.setAttribute('aria-expanded', 'false'); lit(opener.dataset.anchor, false); opener.focus({ preventScroll: true }); }
    opener = null;
  }

  /* ------------------------------------------------------------ lightbox */
  const box = $('#lightbox'), stage = $('#lightbox-stage'), cap = $('#lightbox-cap'), dl = $('#lightbox-dl');
  let boxOpener = null;
  async function showMedia(el, kind) {
    boxOpener = el;
    cap.textContent = el.dataset.cap || el.dataset.name || '';
    const full = await fileUrl(el.dataset.file || el.dataset.play, el.dataset.mime);
    dl.href = full;
    dl.setAttribute('download', el.dataset.name || 'material');
    if (kind === 'image') {
      const src = el.dataset.preview ? await fileUrl(el.dataset.preview, el.dataset.pmime) : full;
      stage.innerHTML = `<img alt="${esc(cap.textContent)}" src="${src}">`;
      const img = stage.querySelector('img');
      img.addEventListener('click', () => {
        const zoom = !img.classList.contains('is-zoomed');
        img.classList.toggle('is-zoomed', zoom);
        if (zoom && img.src !== full) img.src = full;
      });
    } else {
      stage.innerHTML = kind === 'audio' ? `<audio controls src="${full}"></audio>` : `<video controls playsinline src="${full}"></video>`;
    }
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('is-open'));
    $('#lightbox-x').focus();
  }
  function closeBox() {
    if (!box.classList.contains('is-open')) return;
    box.classList.remove('is-open');
    stage.querySelectorAll('video, audio').forEach(m => m.pause());
    setTimeout(() => { if (!box.classList.contains('is-open')) { box.hidden = true; stage.innerHTML = ''; } }, 320);
    boxOpener?.focus({ preventScroll: true });
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('is-on'), 1800);
  }
  function quoteOf(ref) {
    const [cid, i] = ref.split(':');
    const L = window.NOTERA.lang;
    const c = bundle.reports[version][L].citations[cid];
    return { c, m: c.materials.filter(x => x.type === 'text')[+i], L };
  }

  /* ------------------------------------------------------------ events */
  document.addEventListener('click', async (e) => {
    const cite = e.target.closest('.cite');
    if (cite) { e.preventDefault(); if (opener === cite && side.classList.contains('is-open')) closeSide(); else openSide(cite); return; }
    const seg = e.target.closest('.seg button');
    if (seg) {
      version = seg.dataset.v;
      try { localStorage.setItem('notera-report-version', version); } catch (_) { /* ignore */ }
      closeSide(); render(); return;
    }
    const fig = e.target.closest('.fig, .thumb');
    if (fig) { showMedia(fig, 'image'); return; }
    const play = e.target.closest('[data-play]');
    if (play) { showMedia(play, play.dataset.kind); return; }
    const copyQ = e.target.closest('[data-copyq]');
    if (copyQ) {
      const { m } = quoteOf(copyQ.dataset.copyq);
      try { await navigator.clipboard.writeText(m.text); toast(t('r.copiedQuote')); } catch (_) { /* clipboard blocked */ }
      return;
    }
    const copy = e.target.closest('[data-copy]');
    if (copy) {
      const { c, m, L } = quoteOf(copy.dataset.copy);
      const by = m.author?.[L] || m.author?.en || '';
      const where = [c.label, m.locator].filter(Boolean).join(', ');
      try { await navigator.clipboard.writeText(`“${m.text}” — ${by}. ${where}`); toast(t('r.copied')); } catch (_) { /* clipboard blocked */ }
      return;
    }
    const open = e.target.closest('[data-open]');
    if (open) { window.open(await fileUrl(open.dataset.open, open.dataset.mime), '_blank', 'noopener'); return; }
    const down = e.target.closest('[data-dl]');
    if (down) {
      const a = document.createElement('a');
      a.href = await fileUrl(down.dataset.dl, down.dataset.mime);
      a.download = down.dataset.name || 'material';
      document.body.appendChild(a); a.click(); a.remove();
      return;
    }
    if (side.classList.contains('is-open') && !e.target.closest('#side') && !e.target.closest('#lightbox')) closeSide();
  });
  $('#side-x').addEventListener('click', closeSide);
  $('#lightbox-x').addEventListener('click', closeBox);
  box.addEventListener('click', (e) => { if (e.target === box || e.target === stage) closeBox(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (box.classList.contains('is-open')) closeBox(); else closeSide();
  });
  side.addEventListener('transitionend', () => { if (!side.classList.contains('is-open')) side.hidden = true; });
  onLang(() => { closeSide(); render(); });

  /* ------------------------------------------------------------ load */
  function gate(sealed) {
    app.innerHTML = `<div class="gate"><form class="paper index" id="gate">
      <i class="ph-bold ph-lock-simple lock" aria-hidden="true"></i>
      <h2>${esc(t('r.closedTitle'))}</h2><p>${esc(t('r.closedSub'))}</p>
      <label for="pw">${esc(t('r.password'))}</label>
      <input id="pw" type="password" autocomplete="current-password" required>
      <p class="gate__err" id="pw-err" role="alert" hidden>${esc(t('r.wrong'))}</p>
      <button class="btn" type="submit">${esc(t('r.unlock'))}</button></form></div>`;
    const form = $('#gate'), pw = $('#pw'), err = $('#pw-err');
    pw.focus();
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      btn.disabled = true; btn.textContent = t('r.decrypting'); err.hidden = true;
      try {
        const k = await deriveKey(pw.value, sealed.kdf);
        bundle = await openSealed(sealed, k);
        key = k;
        await rememberKey(k);
        render();
      } catch (_) {
        err.hidden = false; pw.setAttribute('aria-invalid', 'true'); pw.select();
        btn.disabled = false; btn.textContent = t('r.unlock');
      }
    });
  }

  (async () => {
    app.innerHTML = `<p class="loading">${esc(t('r.loading'))}</p>`;
    try {
      const pub = await fetch('report.json', { cache: 'no-cache' });
      if (pub.ok) { bundle = await pub.json(); render(); return; }
      const res = await fetch('report.enc.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      const sealed = await res.json();
      const k = await recallKey();
      if (k) {
        try { bundle = await openSealed(sealed, k); key = k; render(); return; } catch (_) { sessionStorage.removeItem(KEY_STORE); }
      }
      gate(sealed);
    } catch (error) {
      console.error('report failed to render', error);
      app.innerHTML = `<p class="loading">${esc(t('r.failed'))}</p>`;
    }
  })();
})();
