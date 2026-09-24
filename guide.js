const chapters = [...document.querySelectorAll('main > .hero, main > .chapter')];
const links = [...document.querySelectorAll('.contents nav a')];
const search = document.querySelector('#concept-search');
const status = document.querySelector('#search-status');
const previous = document.querySelector('#previous-topic');
const next = document.querySelector('#next-topic');

function showChapter() {
  if (location.hash === '#main') return;
  const index = Math.max(0, chapters.findIndex(chapter => `#${chapter.id}` === location.hash));
  chapters.forEach((chapter, position) => { chapter.hidden = position !== index; });
  links.forEach((link, position) => {
    if (position === index) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  for (const [element, position] of [[previous, index - 1], [next, index + 1]]) {
    element.hidden = position < 0 || position >= chapters.length;
    if (!element.hidden) {
      element.href = `#${chapters[position].id}`;
      element.querySelector('strong').textContent = links[position].textContent.trim().replace(/^\d+\s*/, '');
    }
  }
  document.title = `${chapters[index].querySelector('h1, h2').textContent} | Harbor Field Guide`;
  if (matchMedia('(max-width: 760px)').matches) links[index].scrollIntoView({ block: 'nearest', inline: 'center' });
  window.scrollTo(0, 0);
}

function filterTopics() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  links.forEach((link, index) => {
    const matches = chapters[index].textContent.toLowerCase().includes(query);
    link.hidden = !matches;
    if (matches) count += 1;
  });
  status.textContent = query ? `${count} matching ${count === 1 ? 'topic' : 'topics'}` : '';
}

search.addEventListener('input', filterTopics);
links.forEach(link => link.addEventListener('click', () => {
  search.value = '';
  filterTopics();
}));
window.addEventListener('hashchange', showChapter);
document.addEventListener('keydown', event => {
  if ((event.key === '/' || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
    event.preventDefault();
    search.focus();
  } else if (event.key === 'Escape' && document.activeElement === search) {
    search.value = '';
    filterTopics();
    search.blur();
  } else if (!/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !event.altKey && !event.metaKey && !event.ctrlKey) {
    if (event.key === 'ArrowLeft' && !previous.hidden) location.hash = previous.hash;
    if (event.key === 'ArrowRight' && !next.hidden) location.hash = next.hash;
  }
});

showChapter();
