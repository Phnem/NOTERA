/* Shared language switch and UI strings for the projects list and the report reader.
   The choice is shared with the landing page through localStorage('notera-lang'). */
window.NOTERA = (() => {
  'use strict';
  const STR = {
    en: {
      'nav.deliver': 'What you get', 'nav.how': 'How it works', 'nav.price': 'Price', 'nav.projects': 'Projects',
      'cta.request': 'Request a research project',
      'p.eyebrow': 'Research files', 'p.title': 'Projects.',
      'p.sub': 'Completed investigations. Open reports read in full; closed ones open only with the owner’s password.',
      'p.loading': 'Loading projects…', 'p.empty': 'No projects yet.', 'p.failed': 'Could not load the project list.',
      'p.public': 'Public', 'p.closed': 'Closed', 'p.open': 'Open report', 'p.unlock': 'Unlock',
      'p.short': 'Short', 'p.full': 'Full', 'p.min': 'min', 'p.sources': 'sources',
      'r.back': 'All projects', 'r.short': 'Short', 'r.full': 'Full', 'r.version': 'Report version',
      'r.read': 'min read', 'r.words': 'words', 'r.updated': 'Finalised',
      'r.limits': 'Limits in brief',
      'r.source': 'Source', 'r.sources': 'Sources', 'r.close': 'Close sources',
      'r.quote': 'Quotation', 'r.images': 'Images', 'r.docs': 'Documents', 'r.video': 'Video', 'r.audio': 'Audio',
      'r.original': 'Original address', 'r.copy': 'Copy with source', 'r.copied': 'Quotation and source copied',
      'r.copyQuote': 'Copy the quotation only', 'r.copiedQuote': 'Quotation copied',
      'r.about': 'About', 'r.person': 'Person', 'r.photo': 'Photo', 'r.whois': 'Who this is',
      'r.open': 'Open', 'r.download': 'Download', 'r.zoom': 'Zoom', 'r.closeView': 'Close',
      'r.snapshot': 'Saved page (HTML source as text)', 'r.supp': 'Assistant reading of a preserved artifact, not human-verified',
      'r.materials': 'materials', 'r.text': 'quotation', 'r.texts': 'quotations',
      'r.image': 'image', 'r.document': 'document', 'r.webpage': 'saved page', 'r.video1': 'video', 'r.audio1': 'audio',
      'r.closedTitle': 'This report is closed.', 'r.closedSub': 'It opens only with the password its owner holds.',
      'r.password': 'Password', 'r.unlock': 'Open report', 'r.wrong': 'Wrong password.', 'r.decrypting': 'Opening…',
      'r.failed': 'Could not load this report.', 'r.loading': 'Loading report…',
      'r.date.ATTRIBUTED_SPEECH_DATE': 'Speech, by edition', 'r.date.BROADCAST_DATE': 'Broadcast',
      'r.date.PUBLICATION_DATE': 'Publication', 'r.date.ISSUE_DATE': 'Issue', 'r.date.COVER_DATE': 'Cover',
      'r.th.date': 'Date', 'r.th.kind': 'Date type', 'r.th.record': 'Record', 'r.th.src': 'Source',
      'k.CROP': 'Fragment', 'k.PAGE_IMAGE': 'Page', 'k.ARCHIVAL_COPY': 'Archival copy', 'k.ORIGINAL_ARTIFACT': 'Original', 'k.RAW_HTML': 'Saved page', 'k.page': 'PDF p.'
    },
    ru: {
      'nav.deliver': 'Что вы получаете', 'nav.how': 'Как это работает', 'nav.price': 'Цена', 'nav.projects': 'Проекты',
      'cta.request': 'Заказать исследование',
      'p.eyebrow': 'Дела', 'p.title': 'Проекты.',
      'p.sub': 'Завершённые расследования. Открытые отчёты читаются целиком, закрытые открываются только паролем владельца.',
      'p.loading': 'Загружаем проекты…', 'p.empty': 'Проектов пока нет.', 'p.failed': 'Не удалось загрузить список проектов.',
      'p.public': 'Открыт', 'p.closed': 'Закрыт', 'p.open': 'Открыть отчёт', 'p.unlock': 'Ввести пароль',
      'p.short': 'Кратко', 'p.full': 'Полностью', 'p.min': 'мин', 'p.sources': 'источников',
      'r.back': 'Все проекты', 'r.short': 'Кратко', 'r.full': 'Полностью', 'r.version': 'Версия отчёта',
      'r.read': 'мин чтения', 'r.words': 'слов', 'r.updated': 'Завершён',
      'r.limits': 'Границы — кратко',
      'r.source': 'Источник', 'r.sources': 'Источники', 'r.close': 'Закрыть источники',
      'r.quote': 'Цитата', 'r.images': 'Изображения', 'r.docs': 'Документы', 'r.video': 'Видео', 'r.audio': 'Аудио',
      'r.original': 'Исходный адрес', 'r.copy': 'С источником', 'r.copied': 'Цитата и источник скопированы',
      'r.copyQuote': 'Скопировать только цитату', 'r.copiedQuote': 'Цитата скопирована',
      'r.about': 'Кто это:', 'r.person': 'Личность', 'r.photo': 'Фото', 'r.whois': 'Кто это',
      'r.open': 'Открыть', 'r.download': 'Скачать', 'r.zoom': 'Увеличить', 'r.closeView': 'Закрыть',
      'r.snapshot': 'Сохранённая страница (HTML как текст)', 'r.supp': 'Чтение сохранённого артефакта ассистентом, человеком не проверено',
      'r.materials': 'материалов', 'r.text': 'цитата', 'r.texts': 'цитаты',
      'r.image': 'изображение', 'r.document': 'документ', 'r.webpage': 'сохранённая страница', 'r.video1': 'видео', 'r.audio1': 'аудио',
      'r.closedTitle': 'Этот отчёт закрыт.', 'r.closedSub': 'Он открывается только паролем, который есть у владельца.',
      'r.password': 'Пароль', 'r.unlock': 'Открыть отчёт', 'r.wrong': 'Неверный пароль.', 'r.decrypting': 'Открываем…',
      'r.failed': 'Не удалось загрузить отчёт.', 'r.loading': 'Загружаем отчёт…',
      'r.date.ATTRIBUTED_SPEECH_DATE': 'Речь, по изданию', 'r.date.BROADCAST_DATE': 'Эфир',
      'r.date.PUBLICATION_DATE': 'Публикация', 'r.date.ISSUE_DATE': 'Выпуск', 'r.date.COVER_DATE': 'Обложка',
      'r.th.date': 'Дата', 'r.th.kind': 'Что датировано', 'r.th.record': 'Запись', 'r.th.src': 'Источник',
      'k.CROP': 'Фрагмент', 'k.PAGE_IMAGE': 'Страница', 'k.ARCHIVAL_COPY': 'Архивная копия', 'k.ORIGINAL_ARTIFACT': 'Оригинал', 'k.RAW_HTML': 'Сохранённая страница', 'k.page': 'PDF, с.'
    }
  };
  let lang = 'en';
  try { lang = localStorage.getItem('notera-lang') === 'ru' ? 'ru' : 'en'; } catch (_) { /* storage may be blocked */ }
  const listeners = [];
  const t = key => STR[lang][key] ?? STR.en[key] ?? key;
  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }
  function set(next) {
    lang = next;
    try { localStorage.setItem('notera-lang', next); } catch (_) { /* ignore */ }
    apply();
    listeners.forEach(fn => fn(lang));
  }
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => set(b.dataset.lang)));
  apply();
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  return { t, get lang() { return lang; }, onLang: fn => listeners.push(fn), esc };
})();
