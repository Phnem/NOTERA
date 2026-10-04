(() => {
  'use strict';
  const { t, esc, onLang } = window.NOTERA;
  const box = document.getElementById('projects');
  let projects = null;

  function render() {
    if (!projects) return;
    const L = window.NOTERA.lang;
    if (!projects.length) { box.innerHTML = `<p class="projects__empty">${esc(t('p.empty'))}</p>`; return; }
    box.innerHTML = projects.map((p, i) => {
      const closed = p.visibility === 'closed';
      const title = p.title?.[L] || p.title?.en || p.slug;
      const q = !closed && p.question ? `<p class="project__q">${esc(p.question[L] || p.question.en)}</p>` : '';
      const rm = p.reading_minutes || {};
      return `<a class="project" href="${encodeURIComponent(p.slug)}/" style="--i:${i}">
        <span class="tack" style="--x:${18 + (i * 37) % 64}%" aria-hidden="true"></span>
        <article class="paper index">
          <div class="project__top">
            <span class="project__date">${esc(p.date)}</span>
            <span class="chip ${closed ? 'chip--closed' : 'chip--public'}"><i class="ph-bold ${closed ? 'ph-lock-simple' : 'ph-globe-simple'}" aria-hidden="true"></i>${esc(t(closed ? 'p.closed' : 'p.public'))}</span>
          </div>
          <h2>${esc(title)}</h2>
          ${q}
          <div class="project__meta">
            ${rm.compact ? `<span><i class="ph-bold ph-clock" aria-hidden="true"></i>${esc(t('p.short'))} ${rm.compact} ${esc(t('p.min'))} · ${esc(t('p.full'))} ${rm.full} ${esc(t('p.min'))}</span>` : ''}
            ${p.languages ? `<span><i class="ph-bold ph-translate" aria-hidden="true"></i>${esc(p.languages.join(' / ').toUpperCase())}</span>` : ''}
            ${!closed && p.sources_referenced ? `<span><i class="ph-bold ph-books" aria-hidden="true"></i>${p.sources_referenced} ${esc(t('p.sources'))}</span>` : ''}
          </div>
          <span class="project__go">${esc(t(closed ? 'p.unlock' : 'p.open'))}<i class="ph-bold ${closed ? 'ph-key' : 'ph-arrow-right'}" aria-hidden="true"></i></span>
        </article>
      </a>`;
    }).join('');
  }

  fetch('projects.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(list => { projects = list.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))); render(); })
    .catch(() => { box.innerHTML = `<p class="projects__empty">${esc(t('p.failed'))}</p>`; });
  onLang(render);
})();
