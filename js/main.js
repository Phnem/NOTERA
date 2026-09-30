(() => {
  'use strict';

  /* Set the address that should receive research requests. Empty opens a blank "To:" line. */
  const CONTACT_EMAIL = '';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- i18n */
  /* English lives in the markup; only Russian is stored here. */
  const RU = {
    'nav.deliver': 'Что вы получаете', 'nav.how': 'Как это работает', 'nav.sources': 'Источники', 'nav.sample': 'Пример',
    'cta.request': 'Заказать исследование', 'cta.sample': 'Смотреть пример исследования',
    'hero.title': 'Каждый вывод с доказательством.',
    'hero.sub': 'Глубокие проверяемые исследования внешней политики, конфликтов, истории, права и международных отношений.',
    'dossier.title': 'Досье, а не отчёт.',
    'dossier.sub': 'Каждое исследование завершается полным делом, которое можно открыть, проверить и процитировать.',
    'd.conc': 'Выводы', 'd.conc.t': 'Заключения, ранжированные по силе доказательств.',
    'd.arch': 'Архивные документы', 'd.arch.t': 'Сканы, депеши, меморандумы и PDF.',
    'd.chron': 'Хронология', 'd.chron.t': 'События на датированной шкале времени.',
    'd.prim': 'Первоисточники', 'd.prim.t': 'Оригиналы рядом с каждым утверждением.',
    'd.quote': 'Цитаты', 'd.quote.t': 'Точные слова со страницей или минутой.',
    'd.av': 'Аудио и видео', 'd.av.t': 'Фрагменты с точным таймкодом.',
    'd.contra': 'Противоречия', 'd.contra.t': 'Где источники расходятся, рядом друг с другом.',
    'd.unc': 'Неопределённости', 'd.unc.t': 'Что пока неизвестно, сказано прямо.',
    'chip.verified': 'Подтверждено', 'chip.contested': 'Спорно', 'chip.open': 'Открытый вопрос',
    'trail.title': 'Раскройте вывод. Увидите доказательство.',
    'trail.sub': 'Каждый существенный вывод раскрывается до доказательства, а доказательство до оригинального источника.',
    'c1.tab': 'Вашингтон обратился к Тегерану', 'c2.tab': 'Президент изменил свою версию', 'c3.tab': 'Одна фраза, два перевода',
    'lbl.claim': 'Вывод', 'lbl.evidence': 'Доказательство', 'lbl.source': 'Первоисточник',
    'c1.claim': 'Через два дня после захвата посольства Вашингтон предложил новому руководству Ирана прямые переговоры.',
    'c1.src': 'Картер Хомейни, рассекреченная копия СНБ. Общественное достояние.',
    'c2.claim': 'В 1987 году президент Рейган признал, что продажа оружия Ирану превратилась в обмен на заложников.',
    'c2.src': 'Овальный кабинет, март 1987.',
    'c3.claim': 'Слова 2005 года об Израиле ходят в двух конкурирующих английских переводах.',
    'c3.ev': 'Одни издания печатают «стереть с карты». Другие переводчики читают «исчезнуть со страниц времени».',
    'c3.by': 'Показаны оба прочтения. Ни одно не выбрано молча.',
    'c3.src': 'Оригинал на персидском, выступление 26 октября 2005 года.',
    'proc.title': 'От одного вопроса к проверенному отчёту.',
    'ask.lbl': 'Ваш вопрос', 'ask.q': 'Кто и когда впервые назвал Соединённые Штаты «Большим сатаной»?',
    's1': 'Вопрос', 's1.t': 'Вы задаёте вопрос и его границы.',
    's2': 'Параллельно', 's2.t': 'Десятки исследований идут одновременно.',
    's3': 'Проверка', 's3.t': 'Каждый источник проверяется на происхождение и надёжность.',
    's4': 'Связи', 's4.t': 'Находки складываются в граф утверждений и доказательств.',
    's5': 'Оспаривание', 's5.t': 'Независимая проверка пытается опровергнуть выводы.',
    's6': 'Отчёт', 's6.t': 'Итоговый отчёт выходит со всеми ссылками.',
    'src.title': 'Все виды открытых записей.',
    'src.sub': 'Только открытые источники: от официальных текстов до сырой съёмки.',
    'tg.web': 'Веб', 'tg.gov': 'Официальные документы', 'tg.acad': 'Научные работы', 'tg.books': 'Книги и архивы',
    'tg.social': 'X и соцсети', 'tg.img': 'Изображения', 'tg.audio': 'Аудио', 'tg.video': 'Видео',
    'sample.eyebrow': 'Пример исследования',
    'sample.title': 'Иран, Израиль и США.',
    'sample.sub': 'Как строился конфликт: риторика «Большого» и «Малого сатаны», идеология, расчёты безопасности и тихие периоды сотрудничества.',
    'n1.h': 'Переворот против Мосаддыка', 'n1.t': 'Спецслужбы США и Британии поддержали операцию против премьер-министра.',
    'n2.h': 'Иран и Израиль основывают нефтепроводную компанию', 'n2.t': 'Тихое партнёрство при шахе: нефть и общие соображения безопасности.',
    'n3.h': 'Тегеран как региональный партнёр Вашингтона', 'n3.t': 'Связи в сфере безопасности, из которых позже выросла антиамериканская риторика революции.',
    'n4.h': 'Революция, заложники и новый словарь', 'n4.t': 'США становятся «Большим сатаной», Израиль «Малым сатаной». Первое зафиксированное употребление каждого термина ещё устанавливается.',
    'n5.h': 'Враждебны публично, поставки тайно', 'n5.t': 'Во время войны с Ираком оружие шло в Иран через израильские каналы. Масштаб оспаривается.',
    'n6.h': 'Иран-контрас доходит до Овального кабинета', 'n6.t': 'Тайные продажи оружия Тегерану, признанные публично.',
    'aud.title': 'Для тех, кому нельзя ошибаться.',
    'a1': 'Журналисты', 'a1.t': 'Сверка материала с первичными документами.',
    'a2': 'YouTube и медиаавторы', 'a2.t': 'Сценарий из источников, которые можно показать в кадре.',
    'a3': 'Исследователи', 'a3.t': 'Старт с готовой картой доказательств.',
    'a4': 'Аналитики', 'a4.t': 'Записки для решений с выводами, которые выдерживают проверку.',
    'a5': 'Компании', 'a5.t': 'Оценка политических и правовых рисков с доказательствами.',
    'prin.title': 'Две формы выдачи. Три проверки.',
    'f1': 'Интерактивное досье', 'f1.t': 'Выводы, доказательства, хронология и оригиналы в браузере.',
    'f2': 'PDF и экспорт', 'f2.t': 'Чистая копия для цитирования редакторам и клиентам.',
    'prin.sub': 'ИИ ускоряет поиск и обработку. Важные выводы всё равно проходят верификацию, red-team и проверку человеком.',
    'g1': 'Проверка доказательств', 'g1.t': 'Каждое утверждение сопоставлено с первоисточником.',
    'g2': 'Red-team', 'g2.t': 'Отдельный рецензент защищает противоположную версию.',
    'g3': 'Проверка человеком', 'g3.t': 'Человек подписывает результат до выдачи.',
    'req.title': 'Принесите нам вопрос.',
    'req.sub': 'Скажите, что нужно доказать. Мы выстроим исследование вокруг этого.',
    'req.label': 'Что нужно исследовать?',
    'req.err': 'Опишите вопрос одним-двумя предложениями.',
    'foot.note': 'Иллюстративная доска. Фотографии находятся в общественном достоянии (Wikimedia Commons). Газетные вырезки это типографские иллюстрации, а не копии.'
  };

  let lang = 'en';
  function applyLang(next) {
    lang = next;
    document.documentElement.lang = next;
    $$('[data-i18n]').forEach(el => {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent;
      el.textContent = next === 'ru' ? (RU[el.dataset.i18n] ?? el.dataset.en) : el.dataset.en;
    });
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === next)));
    try { localStorage.setItem('notera-lang', next); } catch (_) { /* storage may be blocked */ }
    scheduleBuild();
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

  /* -------------------------------------------------------------- reveal */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]').forEach(el => revealIO.observe(el));

  /* ---------------------------------------------------------------- tabs */
  const tabs = $$('[role="tab"]');
  function selectTab(idx, focus) {
    tabs.forEach((t, i) => {
      const on = i === idx;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !on;
    });
    const anchor = $('[data-pin="t-tabs"]');
    if (anchor) anchor.dataset.to = 't-claim-' + (idx + 1) + '-i';
    if (focus) tabs[idx].focus();
    scheduleBuild();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(i));
    t.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); selectTab((i + 1) % tabs.length, true); }
      if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); selectTab((i - 1 + tabs.length) % tabs.length, true); }
    });
  });

  /* ------------------------------------------------- waveform + map art */
  const wave = $('[data-wave]');
  if (wave) {
    for (let i = 0; i < 46; i++) {
      const h = 18 + Math.abs(Math.sin(i * 0.7) * 34 + Math.sin(i * 1.9) * 26 + Math.cos(i * 0.31) * 18);
      const bar = document.createElement('i');
      bar.style.setProperty('--h', Math.min(100, h).toFixed(0) + '%');
      wave.appendChild(bar);
    }
  }

  const mapSvg = $('[data-map]');
  if (mapSvg) {
    const NS = 'http://www.w3.org/2000/svg';
    const W = 320, H = 214, lon0 = 28, lon1 = 64, lat0 = 20, lat1 = 44;
    const px = lon => ((lon - lon0) / (lon1 - lon0)) * W;
    const py = lat => ((lat1 - lat) / (lat1 - lat0)) * H;
    const add = (tag, attrs, text) => {
      const n = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
      if (text) n.textContent = text;
      mapSvg.appendChild(n);
      return n;
    };
    for (let lon = 32; lon <= 60; lon += 4) add('line', { class: 'g', x1: px(lon), y1: 0, x2: px(lon), y2: H });
    for (let lat = 24; lat <= 40; lat += 4) add('line', { class: 'g', x1: 0, y1: py(lat), x2: W, y2: py(lat) });
    const cities = [
      ['TEHRAN', 51.39, 35.69, 'l'], ['JERUSALEM', 35.21, 31.77, 'r'],
      ['BAGHDAD', 44.36, 33.31, 'l'], ['RIYADH', 46.68, 24.71, 'r'], ['CAIRO', 31.24, 30.04, 'r']
    ];
    const at = Object.fromEntries(cities.map(c => [c[0], [px(c[1]), py(c[2])]]));
    const route = (a, b, bend) => {
      const [x1, y1] = at[a], [x2, y2] = at[b];
      add('path', { class: 'rt', d: `M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - bend} ${x2} ${y2}` });
    };
    route('JERUSALEM', 'TEHRAN', 26);
    route('CAIRO', 'JERUSALEM', 10);
    route('BAGHDAD', 'RIYADH', -14);
    cities.forEach(([name, lon, lat, side]) => {
      add('circle', { class: 'pt', cx: px(lon), cy: py(lat), r: 3 });
      add('text', { x: px(lon) + (side === 'r' ? 7 : -7), y: py(lat) + 3, 'text-anchor': side === 'r' ? 'start' : 'end' }, name);
    });
    add('text', { x: 6, y: H - 8 }, 'TO WASHINGTON <<<');
  }

  /* -------------------------------------------------------------- thread */
  const NS = 'http://www.w3.org/2000/svg';
  const svg = $('#thread');
  const sentinelLayer = document.createElement('div');
  sentinelLayer.setAttribute('aria-hidden', 'true');
  sentinelLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:-1';
  document.body.appendChild(sentinelLayer);

  const drawn = new Set();
  let io = null;
  let ready = false;

  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v));
    if (parent) parent.appendChild(n);
    return n;
  }

  function build() {
    const doc = document.documentElement;
    const W = doc.clientWidth, H = Math.max(doc.scrollHeight, document.body.scrollHeight);
    const sx = window.scrollX, sy = window.scrollY;

    const pins = new Map();
    $$('[data-pin]').forEach(a => {
      if (!a.getClientRects().length) return;
      const r = a.getBoundingClientRect();
      pins.set(a.dataset.pin, { x: r.left + sx, y: r.top + sy, to: (a.dataset.to || '').split(/\s+/).filter(Boolean) });
    });

    svg.replaceChildren();
    sentinelLayer.replaceChildren();
    if (io) io.disconnect();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.style.height = H + 'px';

    const defs = el('defs', {}, svg);
    const grad = el('radialGradient', { id: 'pinGrad', cx: '35%', cy: '30%', r: '75%' }, defs);
    el('stop', { offset: '0', 'stop-color': '#ff8a6e' }, grad);
    el('stop', { offset: '.55', 'stop-color': '#ee4327' }, grad);
    el('stop', { offset: '1', 'stop-color': '#8f1a08' }, grad);

    const links = el('g', {}, svg);
    const heads = el('g', {}, svg);
    const groups = [];
    const used = new Map();

    pins.forEach((a, id) => {
      a.to.forEach(tid => {
        const b = pins.get(tid);
        if (!b) return;
        const key = id + '>' + tid;
        const dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy);
        const sag = Math.min(80, dist * 0.05 + Math.abs(dx) * 0.09);
        const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2 + sag * 2;
        const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
        const g = el('g', {}, links);
        ['sh', 'th', 'hl'].forEach(cls => {
          const p = el('path', { class: cls, d, pathLength: '1' }, g);
          if (drawn.has(key) || reduceMotion) { p.style.transition = 'none'; p.classList.add('drawn'); }
        });
        groups.push({ g, key, ids: [id, tid], y: Math.min(a.y, b.y) + Math.min(120, Math.abs(dy) / 2) });
        used.set(id, a); used.set(tid, b);
      });
    });

    const headEls = new Map();
    used.forEach((p, id) => {
      const h = el('g', { class: 'pinhead', transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})` }, heads);
      el('circle', { cx: 3, cy: 6, r: 8, fill: 'rgba(0,0,0,.5)' }, h);
      el('circle', { r: 8.5, fill: 'url(#pinGrad)' }, h);
      el('circle', { cx: -2.6, cy: -2.8, r: 2.1, fill: 'rgba(255,255,255,.8)' }, h);
      if (reduceMotion) h.classList.add('on');
      headEls.set(id, h);
    });

    const reveal = (grp) => {
      grp.g.querySelectorAll('path').forEach(p => p.classList.add('drawn'));
      drawn.add(grp.key);
      grp.ids.forEach(i => headEls.get(i)?.classList.add('on'));
    };
    /* pins already reached stay lit after a rebuild */
    groups.forEach(grp => { if (drawn.has(grp.key) || reduceMotion) grp.ids.forEach(i => headEls.get(i)?.classList.add('on')); });

    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const grp = e.target._grp;
        if (!grp) return;
        reveal(grp);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    groups.forEach(grp => {
      if (drawn.has(grp.key) || reduceMotion) return;
      const s = document.createElement('div');
      s.style.cssText = `position:absolute;left:0;width:1px;height:2px;top:${grp.y.toFixed(0)}px`;
      s._grp = grp;
      sentinelLayer.appendChild(s);
      io.observe(s);
    });
  }

  let timer = 0;
  function scheduleBuild(delay = 120) {
    if (!ready) return;
    clearTimeout(timer);
    timer = setTimeout(build, delay);
  }

  /* wait for the hero drop-in and fonts before measuring pin positions */
  const boot = async () => {
    const drops = document.getAnimations().filter(a => a.effect?.target?.classList?.contains('drop'));
    await Promise.allSettled(drops.map(a => a.finished));
    ready = true;
    build();
  };
  window.addEventListener('load', boot, { once: true });
  if (document.readyState === 'complete') boot();
  document.fonts?.ready.then(() => scheduleBuild(200));
  window.addEventListener('resize', () => scheduleBuild(200));
  document.addEventListener('load', (e) => { if (e.target instanceof HTMLImageElement) scheduleBuild(200); }, true);
  if ('ResizeObserver' in window) new ResizeObserver(() => scheduleBuild(200)).observe(document.body);

  /* ---------------------------------------------------------------- form */
  const form = $('#request-form');
  if (form) {
    const box = $('#brief'), err = $('#brief-err');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = box.value.trim();
      const bad = text.length < 8;
      box.setAttribute('aria-invalid', String(bad));
      if (bad) { box.setAttribute('aria-describedby', 'brief-err'); }
      else { box.removeAttribute('aria-describedby'); }
      err.hidden = !bad;
      scheduleBuild();
      if (bad) { box.focus(); return; }
      const subject = encodeURIComponent('Research request');
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(text)}`;
    });
  }

  /* --------------------------------------------------------------- start */
  let saved = 'en';
  try { saved = localStorage.getItem('notera-lang') || 'en'; } catch (_) { /* ignore */ }
  if (saved === 'ru') applyLang('ru');
})();
