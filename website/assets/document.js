'use strict';
const embedded = new URLSearchParams(location.search).get('embedded') === '1' && window.parent !== window;
if (embedded) document.documentElement.classList.add('embedded');
const main = document.getElementById('main');
function resize() {
  if (embedded) window.parent.postMessage({type: 'proof-height', height: Math.ceil(document.body.getBoundingClientRect().height) + 4}, '*');
}
function selectTab(index, notify = true) {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  if (!tabs[index]) return;
  tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; document.getElementById(tab.getAttribute('aria-controls')).hidden = i !== index; });
  // Render each panel only when visible: large documents remain responsive.
  document.querySelectorAll('.document-overview .math:not([data-rendered]), [role="tabpanel"]:not([hidden]) .math:not([data-rendered])').forEach(element => {
    const tex = element.textContent;
    if (typeof katex === 'undefined') return;
    try { katex.render(tex, element, {displayMode: element.dataset.display === 'true', throwOnError: false, trust: false, strict: 'ignore', macros: {'\\mbox': '\\text{#1}'}}); element.dataset.rendered = 'true'; }
    catch (_) { element.textContent = tex; element.title = 'This expression could not be rendered; original TeX is shown.'; }
  });
  if (embedded && notify) window.parent.postMessage({type: 'proof-tab', tab: index}, '*');
  resize();
}
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(index));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); selectTab(next); tabs[next].focus();
  });
});
window.addEventListener('message', event => {
  if (!embedded || event.source !== window.parent || event.data?.type !== 'proof-reader-state') return;
  updateNoteworthiness(event.data.settings || ProofNoteworthiness.current());
  selectTab(event.data.tab, false);
});
document.querySelectorAll('[data-source]').forEach(button => button.addEventListener('click', () => {
  if (embedded) window.parent.postMessage({type: 'proof-source', url: button.dataset.source}, '*');
  else {
    let hash = '';
    try { hash = sessionStorage.getItem('proof-database-return') || ''; } catch (_) { /* optional */ }
    const params = ProofSearch.sourceParams(hash.replace(/^#/, ''), button.dataset.source, ProofNoteworthiness.current().clear_filters_on_source_selection);
    window.location.href = '../index.html#' + params;
  }
}));
try {
  const back = document.getElementById('back'), hash = sessionStorage.getItem('proof-database-return');
  if (back && hash && hash.startsWith('#')) back.href += hash;
} catch (_) { /* optional */ }
if (embedded) {
  // Cross-document links open the complete reader rather than nesting it.
  document.querySelectorAll('a[href]').forEach(link => { if (!link.hasAttribute('download') && /^[^:]+\.html(?:#|$)/.test(link.getAttribute('href'))) link.target = '_top'; });
  new ResizeObserver(resize).observe(document.body);
}
updateNoteworthiness(ProofNoteworthiness.current());
selectTab(0, false);
document.fonts?.ready.then(resize);

function updateNoteworthiness(settings) {
  for (const overview of document.querySelectorAll('[data-noteworthiness]')) {
    const data = JSON.parse(overview.dataset.noteworthiness);
    const reasons = ProofNoteworthiness.reasons(data, settings);
    const displayed = data.proof_level_issue ? [...reasons, 'Potential Issue'] : reasons;
    const field = overview.querySelector('[data-noteworthiness-field]');
    field.hidden = !displayed.length;
    const badges = document.createElement('div'); badges.className = 'badges';
    for (const reason of displayed) {
      const badge = document.createElement('span');
      badge.className = 'badge ' + (reason === 'Potential Issue' ? 'red' : 'gold');
      badge.textContent = reason; badges.append(badge);
    }
    field.querySelector('.field-value').replaceChildren(badges);
    const assessment = overview.querySelector('[data-simpler-assessment]');
    if (assessment) assessment.hidden = assessment.dataset.warning !== 'true' && reasons.some(reason => reason.includes('Statement - All proofs'));
  }
  resize();
}
