(() => {
  'use strict';

  /* Set the address that should receive research requests. Empty opens a blank "To:" line. */
  const CONTACT_EMAIL = '';
  /* Where "Find a project" should lead once project search exists. Empty keeps the button inert. */
  const FIND_PROJECT_URL = '';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- i18n */
  /* English lives in the markup; only Russian is stored here. */
  const RU = {
    'nav.deliver': 'Что вы получаете', 'nav.how': 'Как это работает', 'nav.sources': 'Источники', 'nav.sample': 'Пример',
    'cta.request': 'Заказать исследование', 'cta.find': 'Найти проект', 'cta.sample': 'Смотреть пример исследования',
    'hero.title': 'Каждый вывод подтверждён.',
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
    'ask.lbl': 'Ваш вопрос', 'ask.q': 'Как менялись отношения Тегерана и Вашингтона между 1953 и 1979 годами?',
    's1': 'Вопрос', 's1.t': 'Вы задаёте вопрос и его границы.',
    's2': 'Параллельно', 's2.t': 'Десятки исследований идут одновременно.',
    's3': 'Проверка', 's3.t': 'Каждый источник проверяется на происхождение и надёжность.',
    's4': 'Связи', 's4.t': 'Находки складываются в граф утверждений и доказательств.',
    's5': 'Оспаривание', 's5.t': 'Независимые ИИ-агенты-рецензенты пытаются опровергнуть выводы.',
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
    'prin.title': 'Две формы выдачи. Три проверки.',
    'f1': 'Интерактивное досье', 'f1.t': 'Выводы, доказательства, хронология и оригиналы в браузере.',
    'f2': 'PDF и экспорт', 'f2.t': 'Чистая копия, из которой удобно цитировать и публиковать.',
    'prin.sub': 'ИИ ускоряет поиск и обработку. Важные выводы всё равно проходят верификацию, red-team и проверку человеком.',
    'g1': 'Проверка доказательств', 'g1.t': 'Агенты-рецензенты сопоставляют каждое утверждение с первоисточником.',
    'g2': 'Red-team', 'g2.t': 'Состязательные ИИ-агенты пытаются опровергнуть каждый вывод.',
    'g3': 'Проверка человеком', 'g3.t': 'Человек проверяет результат до выдачи.',
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

  /* -------------------------------------------------------------- reveal setup */
  /* Papers swing about their own pin, so the pin stays put while the card settles. */
  $$('.item').forEach(it => {
    const pin = it.querySelector(':scope > .pin');
    if (!pin) return;
    it.style.setProperty('--ox', pin.style.getPropertyValue('--x') || '50%');
    it.style.setProperty('--oy', pin.style.getPropertyValue('--y') || '0');
  });
  /* Text rises inside its wrapper (never the wrapper itself, which owns the pin anchors). */
  const RISE = '.h2, .sub, .eyebrow, .step h3, .step p, .rows h3, .rows p, .gates__list h3, .gates__list p, .tags li, .note, .caption, .foot__row > *, .foot__note';
  $$(RISE).forEach(e => e.classList.add('rise'));
  $$('.step h3').forEach(e => e.classList.add('rise--left'));
  $$('.rise').forEach(e => {
    const sibs = Array.from(e.parentElement.children).filter(c => c.classList.contains('rise'));
    e.style.setProperty('--rd', Math.min(sibs.indexOf(e) * 0.08, 0.6).toFixed(2) + 's');
  });
  $$('.ticks li, .window__rows .chip, .ranks .chip').forEach((e, _i, all) => {
    const idx = Array.from(e.parentElement.children).indexOf(e);
    e.style.setProperty('--i', idx);
  });

  /* -------------------------------------------------------------- reveal */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal], .rise').forEach(el => revealIO.observe(el));

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
      bar.style.setProperty('--i', i);
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

  /* Pin artwork: mushroom-style push pin seen at an angle. Flat cap, short neck, and a knot of yarn
     wound at the base, which is where the needle enters the board (local origin). Drawn once, reused via <use>. */
  function pinDefs(defs) {
    const rg = (id, attrs, stops) => {
      const g = el('radialGradient', Object.assign({ id }, attrs), defs);
      stops.forEach(([o, c, a]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a ?? 1 }, g));
    };
    const lg = (id, stops) => {
      const g = el('linearGradient', { id, x1: '0', x2: '1', y1: '0', y2: '0' }, defs);
      stops.forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, g));
    };
    rg('pgShadow', { cx: '50%', cy: '50%', r: '50%' }, [['0', '#000', .55], ['.55', '#000', .22], ['1', '#000', 0]]);
    rg('pgCap', { cx: '38%', cy: '34%', r: '80%' }, [['0', '#f8a08a'], ['.5', '#e85e44'], ['1', '#cb432b']]);
    rg('pgKnot', { cx: '40%', cy: '30%', r: '85%' }, [['0', '#e2573f'], ['.6', '#c23a24'], ['1', '#8a2214']]);
    lg('pgNeck', [['0', '#f0664b'], ['.45', '#d9472e'], ['1', '#9a2814']]);
    lg('pgRim', [['0', '#d4432a'], ['.5', '#b93320'], ['1', '#87200f']]);

    const pin = el('g', { id: 'pin3d' }, defs);
    el('ellipse', { cx: 9, cy: 6, rx: 17, ry: 6.2, fill: 'url(#pgShadow)', transform: 'rotate(14 9 6)' }, pin);
    /* neck and cap lean a little to the left, like the reference */
    const lean = el('g', { transform: 'rotate(-11)' }, pin);
    el('rect', { x: -2.1, y: -13.5, width: 4.2, height: 13, rx: 1.6, fill: 'url(#pgNeck)' }, lean);
    el('ellipse', { cx: 0, cy: -13.2, rx: 8, ry: 3.3, fill: '#8f2413' }, lean);                 // underside of the cap
    el('rect', { x: -8, y: -15.6, width: 16, height: 2.5, fill: 'url(#pgRim)' }, lean);           // cap edge
    el('ellipse', { cx: 0, cy: -15.6, rx: 8, ry: 3.3, fill: 'url(#pgCap)' }, lean);               // cap top
    el('ellipse', { cx: -1.6, cy: -16.2, rx: 4.6, ry: 1.5, fill: 'rgba(255,225,210,.22)' }, lean);
    el('ellipse', { cx: 0, cy: -15.6, rx: 8, ry: 3.3, fill: 'none', stroke: 'rgba(255,200,180,.3)', 'stroke-width': .5 }, lean);
    /* yarn knot around the base */
    el('ellipse', { cx: 0, cy: -1.2, rx: 6.4, ry: 4.4, fill: 'url(#pgKnot)' }, pin);
    [['M-6 -0.4C-3 3.2 3 3.2 6 -0.4', '#a92c19', 1.9], ['M-6.2 -2.2C-3 1.4 3 1.4 6.2 -2.2', '#e0533a', 1.7], ['M-5.6 -4C-2.6 -0.6 2.6 -0.6 5.6 -4', '#c73c25', 1.6], ['M-4.6 -5.6C-2 -3 2 -3 4.6 -5.6', '#e86a51', 1.2]]
      .forEach(([d, c, w]) => el('path', { d, fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round' }, pin));
    [['M-6 -2C-9 -3 -10 -5 -9 -7', .55], ['M5.6 -3C8 -4.4 9.4 -3.6 10 -6', .5], ['M-2 -6C-3.4 -9 -2.4 -10.6 -3.6 -12', .4], ['M6 0.4C9 1.4 10.6 0.2 12 2.2', .5]]
      .forEach(([d, a]) => el('path', { d, fill: 'none', stroke: `rgba(230,96,72,${a})`, 'stroke-width': .5, 'stroke-linecap': 'round' }, pin));
  }

  /* Yarn geometry: a filled body with a wobbling width, fine slanted twist marks, and long curling hairs. */
  function hashStr(str) { let h = 2166136261; for (let k = 0; k < str.length; k++) { h ^= str.charCodeAt(k); h = Math.imul(h, 16777619); } return h >>> 0; }
  function seeded(seed) {
    let t = seed >>> 0;
    return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
  }
  const SMALL = matchMedia('(max-width: 700px)').matches;
  function twine(a, c, b, dist, key) {
    const rnd = seeded(hashStr(key));
    const step = SMALL ? 2.9 : 2.2;
    const n = Math.max(8, Math.ceil(dist * 1.06 / step));
    const ph1 = rnd() * 6.28, ph2 = rnd() * 6.28;
    const pts = [];
    for (let k = 0; k <= n; k++) {
      const t = k / n, u = 1 - t;
      const x = u * u * a.x + 2 * u * t * c.x + t * t * b.x, y = u * u * a.y + 2 * u * t * c.y + t * t * b.y;
      let tx = 2 * u * (c.x - a.x) + 2 * t * (b.x - c.x), ty = 2 * u * (c.y - a.y) + 2 * t * (b.y - c.y);
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const s = k * step;
      /* yarn is never an even width: slow swell plus a faster wobble */
      const w = 1.75 + 0.28 * Math.sin(s / 21 + ph1) + 0.18 * Math.sin(s / 7.3 + ph2) + (rnd() - 0.5) * 0.12;
      pts.push({ x, y, tx, ty, nx: -ty, ny: tx, w });
    }
    let left = '', right = '';
    pts.forEach((p, k) => {
      left += (k ? 'L' : 'M') + (p.x + p.nx * p.w).toFixed(1) + ' ' + (p.y + p.ny * p.w).toFixed(1);
    });
    for (let k = pts.length - 1; k >= 0; k--) { const p = pts[k]; right += 'L' + (p.x - p.nx * p.w).toFixed(1) + ' ' + (p.y - p.ny * p.w).toFixed(1); }
    const body = left + right + 'Z';

    let grooveA = '', grooveB = '', ridge = '';
    const seg = (p, off, wf, lean) => {
      const x = p.x + p.tx * off, y = p.y + p.ty * off, w = p.w * wf, l = p.w * lean;
      return `M${(x - p.nx * w - p.tx * l).toFixed(1)} ${(y - p.ny * w - p.ty * l).toFixed(1)}L${(x + p.nx * w + p.tx * l).toFixed(1)} ${(y + p.ny * w + p.ty * l).toFixed(1)}`;
    };
    pts.forEach(p => {
      const j = (rnd() - 0.5) * step * 0.6, lean = 0.95 + (rnd() - 0.5) * 0.45;
      if (rnd() < 0.62) grooveA += seg(p, j, 0.92, lean); else grooveB += seg(p, j, 0.85, lean);
      if (rnd() < 0.7) ridge += seg(p, step * 0.5 + j, 0.7, lean);
    });

    /* loose hairs: mostly short, a few long and curling, denser near the ends where the yarn was cut */
    let hairLight = '', hairDark = '';
    const hairs = Math.floor(dist / (SMALL ? 16 : 4.6));
    const addHair = (p, big) => {
      const side = rnd() < 0.5 ? -1 : 1;
      const len = big ? 6 + rnd() * 12 : 2.5 + rnd() * rnd() * 11;
      const dir = rnd() < 0.5 ? 1 : -1;
      const sx = p.x + p.nx * side * p.w * 0.85, sy = p.y + p.ny * side * p.w * 0.85;
      const out = 0.35 + rnd() * 0.65, along = (rnd() * 0.9 + 0.1) * dir;
      let dx = p.nx * side * out + p.tx * along, dy = p.ny * side * out + p.ty * along;
      const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
      const curl = (rnd() - 0.5) * len * 0.9;
      const cx = sx + dx * len * 0.55 - dy * curl, cy = sy + dy * len * 0.55 + dx * curl;
      const ex = sx + dx * len + dy * curl * 0.5, ey = sy + dy * len - dx * curl * 0.5;
      const seg2 = `M${sx.toFixed(1)} ${sy.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      if (rnd() < 0.68) hairLight += seg2; else hairDark += seg2;
    };
    for (let h = 0; h < hairs; h++) addHair(pts[Math.floor(rnd() * pts.length)], rnd() < 0.08);
    for (let h = 0; h < (SMALL ? 3 : 8); h++) { addHair(pts[Math.min(pts.length - 1, Math.floor(rnd() * 5))], true); addHair(pts[Math.max(0, pts.length - 1 - Math.floor(rnd() * 5))], true); }
    return { body, grooveA, grooveB, ridge, hairLight, hairDark };
  }

  function build() {
    const doc = document.documentElement;
    const sx = window.scrollX, sy = window.scrollY;
    /* measured from the footer, not scrollHeight, so the overlay can never inflate its own size */
    const W = doc.clientWidth, H = Math.ceil($('.foot').getBoundingClientRect().bottom + sy);

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
    pinDefs(defs);

    const links = el('g', {}, svg);
    const heads = el('g', {}, svg);
    const groups = [];
    const used = new Map();
    let n = 0;

    pins.forEach((a0, id0) => {
      a0.to.forEach(tid => {
        const b0 = pins.get(tid);
        if (!b0) return;
        const key = id0 + '>' + tid;
        /* always draw from the upper pin to the lower one, so a thread grows downward into view */
        const flip = b0.y < a0.y;
        const a = flip ? b0 : a0, b = flip ? a0 : b0;
        const dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy);
        const sag = Math.min(80, dist * 0.05 + Math.abs(dx) * 0.09);
        const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2 + sag * 2;
        const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;

        const pad = 40;
        const minx = Math.min(a.x, b.x) - pad, miny = Math.min(a.y, b.y) - pad;
        const maskId = 'tm' + (n++);
        const mask = el('mask', {
          id: maskId, maskUnits: 'userSpaceOnUse',
          x: minx.toFixed(0), y: miny.toFixed(0),
          width: (Math.abs(dx) + pad * 2 + 20).toFixed(0), height: (dist + sag * 2 + pad * 2).toFixed(0)
        }, defs);
        const reveal = el('path', { class: 'reveal', d, pathLength: '1' }, mask);
        const instant = drawn.has(key) || reduceMotion;
        reveal.style.transitionDuration = Math.min(2.6, Math.max(0.9, dist / 800)).toFixed(2) + 's';
        if (instant) { reveal.style.transition = 'none'; reveal.classList.add('drawn'); }

        const g = el('g', { mask: `url(#${maskId})` }, links);
        const tw = twine(a, { x: cx, y: cy }, b, dist, key);
        ['t-sh1', 't-sh2', 't-rim'].forEach(cls => el('path', { class: cls, d }, g));
        el('path', { class: 't-body', d: tw.body }, g);
        /* fine strand detail is the expensive part: it only switches on once the thread has finished drawing */
        const det = el('g', { class: 'tw-detail' }, g);
        el('path', { class: 't-grooveA', d: tw.grooveA }, det);
        el('path', { class: 't-grooveB', d: tw.grooveB }, det);
        el('path', { class: 't-ridge', d: tw.ridge }, det);
        el('path', { class: 't-hl', d }, det);
        el('path', { class: 't-hairD', d: tw.hairDark }, det);
        el('path', { class: 't-hairL', d: tw.hairLight }, det);
        if (instant) g.classList.add('done');

        groups.push({ reveal, g, key, ids: [id0, tid], y: a.y, dur: parseFloat(reveal.style.transitionDuration) || 1 });
        used.set(id0, a0); used.set(tid, b0);
      });
    });

    const headEls = new Map();
    used.forEach((p, id) => {
      const h = el('g', { class: 'pinhead', transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})` }, heads);
      const inner = el('g', { class: 'pi' }, h);
      el('use', { href: '#pin3d', transform: 'scale(1.3)' }, inner);
      if (reduceMotion) h.classList.add('on', 'now');
      headEls.set(id, h);
    });

    const show = (grp, now) => {
      if (now) { grp.reveal.style.transition = 'none'; grp.g.classList.add('done'); }
      else setTimeout(() => grp.g.classList.add('done'), grp.dur * 1000 + 120);
      grp.reveal.classList.add('drawn');
      drawn.add(grp.key);
      grp.ids.forEach(i => {
        const h = headEls.get(i);
        if (!h) return;
        if (now) h.classList.add('now');
        h.classList.add('on');
      });
    };
    /* pins already reached stay lit after a rebuild */
    groups.forEach(grp => {
      if (drawn.has(grp.key) || reduceMotion) grp.ids.forEach(i => headEls.get(i)?.classList.add('on', 'now'));
    });

    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const grp = e.target._grp;
        if (!grp) return;
        if (e.isIntersecting) { show(grp, false); io.unobserve(e.target); }
        /* the upper pin is already above the viewport (jumped past or restored scroll): show it without animating */
        else if (e.boundingClientRect.top < 0) { show(grp, true); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

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

  $$('[data-find-project]').forEach(b => b.addEventListener('click', () => { if (FIND_PROJECT_URL) window.location.href = FIND_PROJECT_URL; }));

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
