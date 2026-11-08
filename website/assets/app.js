(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const data = window.PROOF_CATALOGUE, rows = data.documents;
  const tabCount = data.tab_count || 5;
  const filterNames = ['fields', 'statement', 'proof', 'noteworthy', 'issue', 'importance', 'count', 'sources'];
  function updateNoteworthiness() {
    for (const row of rows) row.noteworthy = ProofNoteworthiness.reasons(row, ProofNoteworthiness.current());
  }
  updateNoteworthiness();
  window.addEventListener('proof-settings-change', () => { updateNoteworthiness(); render(); });
  let found = [], selected = '', generation = 0, indexPromise, activeTab = 0, currentURL = '';
  const multiControls = [];
  const unique = values => [...new Set(values)].sort((a, b) => a.localeCompare(b));
  function options(id, values, labels = {}) {
    const select = $(id);
    if (!select.multiple) select.add(new Option('Any level', ''));
    values.forEach(value => select.add(new Option(labels[value] || value, value)));
  }
  options('fields', unique(rows.flatMap(row => [...row.fields, ...(row.proof_fields || [])])));
  const sourceLabels = Object.assign({}, ...rows.map(row => row.sources));
  options('sources', Object.keys(sourceLabels).sort((a, b) => sourceLabels[a].localeCompare(sourceLabels[b]) || a.localeCompare(b)), sourceLabels);
  options('statement', data.levels); options('proof', data.levels);
  options('noteworthy', ['any',
    'Highschool level Statement - All proofs beyond undergraduate level',
    'Highschool level Statement - All proofs have at least undergraduate level',
    'Undergraduate level Statement - All proofs beyond undergraduate level',
    'Has at least one proof with concepts from a different area', 'Has many Proofs']);
  options('issue', ['no potential issues',
    'simpler proof likely available', 'may have an unsatisfactory proof']);
  options('importance', ['at least medium', 'high', 'medium', 'low']);
  options('count', ['at least one', ...unique(rows.map(row => row.count).filter(Boolean)).sort((a, b) => Number(a) - Number(b))]);
  document.querySelector('label[for="sources"]').textContent += ` (${$('sources').options.length.toLocaleString()})`;
  // Searchable checkbox menus retain native select state for one filtering path.
  for (const id of filterNames.filter(id => $(id).multiple)) {
    const select = $(id), menu = document.createElement('details'), summary = document.createElement('summary');
    menu.className = 'multiselect'; menu.append(summary); select.after(menu); select.hidden = true;
    const search = document.createElement('input'); search.type = 'search'; search.placeholder = 'Search options';
    search.setAttribute('aria-label', `Search ${document.querySelector(`label[for="${id}"]`).textContent}`);
    const list = document.createElement('div'); list.className = 'option-list'; menu.append(search, list);
    const refresh = () => {
      const values = Array.from(select.selectedOptions, o => o.text);
      summary.replaceChildren();
      summary.title = values.join(', ') || 'Choose options';
      if (!values.length) summary.textContent = 'Choose options';
      for (const option of select.selectedOptions) {
        const chip = document.createElement('span'), remove = document.createElement('button');
        chip.className = 'selection-chip'; chip.append(document.createTextNode(option.text));
        remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `Remove ${option.text}`);
        remove.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); option.selected = false; refresh(); select.dispatchEvent(new Event('change')); });
        chip.append(remove); summary.append(chip);
      }
      for (const checkbox of list.querySelectorAll('input')) checkbox.checked = select.options[Number(checkbox.dataset.index)].selected;
    };
    function fill() {
      list.replaceChildren();
      Array.from(select.options).forEach((option, index) => {
        if (!option.text.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())) return;
        const label = document.createElement('label'), checkbox = document.createElement('input');
        checkbox.type = 'checkbox'; checkbox.checked = option.selected; checkbox.dataset.index = index;
        checkbox.addEventListener('change', () => { option.selected = checkbox.checked; refresh(); select.dispatchEvent(new Event('change')); });
        label.append(checkbox, document.createTextNode(option.text)); list.append(label);
      });
    }
    menu.addEventListener('toggle', () => { if (menu.open) fill(); });
    search.addEventListener('input', fill);
    multiControls.push(refresh);
  }
  function state() {
    return Object.fromEntries(filterNames.map(name => [name, Array.from($(name).selectedOptions, option => option.value).filter(Boolean)]));
  }
  function restore(params = new URLSearchParams(location.hash.slice(1))) {
    $('query').value = params.get('q') || '';
    $('case-insensitive').checked = params.get('case') !== 'sensitive';
    filterNames.forEach(name => {
      const values = name === 'count' && !params.has('state') && !params.has('count') ? ['at least one'] : params.getAll(name);
      for (const option of $(name).options) option.selected = values.includes(option.value);
      if (!$(name).multiple && !values.length) $(name).value = '';
    });
    selected = params.get('document') || '';
    activeTab = Math.min(tabCount - 1, Math.max(0, Number.parseInt(params.get('tab'), 10) || 0));
    multiControls.forEach(refresh => refresh());
  }
  function save() {
    const params = new URLSearchParams({state: '1'});
    if ($('query').value) params.set('q', $('query').value);
    if (!$('case-insensitive').checked) params.set('case', 'sensitive');
    for (const [name, values] of Object.entries(state())) values.forEach(v => params.append(name, v));
    if (selected) params.set('document', selected);
    if (activeTab) params.set('tab', String(activeTab));
    try { history.replaceState(null, '', '#' + params); } catch (_) { /* file URL restrictions */ }
    try { sessionStorage.setItem('proof-database-return', '#' + params); } catch (_) { /* optional */ }
    return params;
  }
  function loadIndex() {
    if (window.PROOF_SEARCH_INDEX) return Promise.resolve(window.PROOF_SEARCH_INDEX);
    if (!indexPromise) indexPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = 'assets/search-index.js';
      script.onload = () => resolve(window.PROOF_SEARCH_INDEX);
      script.onerror = () => { script.remove(); indexPromise = null; reject(new Error('Could not load the search index. Check that the complete generated folder was copied.')); };
      document.head.append(script);
    });
    return indexPromise;
  }
  function readerState() {
    $('document-frame').contentWindow?.postMessage({type: 'proof-reader-state', tab: activeTab, settings: ProofNoteworthiness.current()}, '*');
  }
  function choices() {
    const query = $('document-search').value.toLocaleLowerCase();
    const options = found.filter(i => rows[i].filename === selected || (rows[i].title + ' ' + rows[i].filename).toLocaleLowerCase().includes(query));
    $('document-select').replaceChildren(...options.map(i => new Option(ProofSearch.documentLabel(rows[i]), rows[i].filename, false, rows[i].filename === selected)));
  }
  function showDocument() {
    const position = found.findIndex(i => rows[i].filename === selected);
    if (position < 0) return;
    const row = rows[found[position]], counts = {high: 0, medium: 0, low: 0, 'very low': 0, unknown: 0};
    found.forEach(i => { const key = Object.hasOwn(counts, rows[i].importance) ? rows[i].importance : 'unknown'; counts[key]++; });
    const parts = Object.entries(counts).filter(([key, count]) => ['high', 'medium', 'low'].includes(key) || count).map(([key, count]) => `${key[0].toUpperCase() + key.slice(1)}: ${count.toLocaleString()}`);
    $('position').textContent = [`Document ${(position + 1).toLocaleString()} of ${found.length.toLocaleString()}`, ...parts].join(' · ');
    $('filename-display').textContent = row.filename;
    $('previous').disabled = position === 0; $('next').disabled = position === found.length - 1;
    $('standalone').href = row.url;
    $('selected-title').textContent = ProofSearch.documentLabel(row);
    choices(); save();
    if (currentURL !== row.url) {
      currentURL = row.url; $('document-frame').src = row.url + '?embedded=1';
    } else readerState();
  }
  async function render() {
    const current = ++generation;
    let index = window.PROOF_SEARCH_INDEX;
    if (ProofSearch.searchTerms($('query').value, data.casefold, $('case-insensitive').checked).length && !index) {
      $('status').textContent = 'Loading search index…';
      try { index = await loadIndex(); }
      catch (error) { if (current === generation) $('status').textContent = error.message; return; }
    }
    if (current !== generation) return;
    found = ProofSearch.search(rows, index, $('query').value, 'all', state(), data.casefold, $('case-insensitive').checked, ProofNoteworthiness.current().mathematical_field_search_mode);
    $('status').textContent = `${found.length.toLocaleString()} matching documents`;
    $('reader').hidden = !found.length;
    if (!found.length) { selected = ''; save(); return; }
    if (!found.some(i => rows[i].filename === selected)) selected = rows[found[0]].filename;
    showDocument();
  }
  let debounce;
  $('query').addEventListener('input', () => { ++generation; clearTimeout(debounce); debounce = setTimeout(render, 160); });
  [...filterNames, 'case-insensitive'].forEach(name => $(name).addEventListener('change', render));
  $('reset').addEventListener('click', () => {
    $('query').value = ''; $('case-insensitive').checked = true;
    filterNames.forEach(name => { for (const option of $(name).options) option.selected = name === 'count' && option.value === 'at least one'; if (!$(name).multiple) $(name).value = ''; });
    multiControls.forEach(refresh => refresh()); render();
  });
  $('document-select').addEventListener('change', () => { selected = $('document-select').value; $('document-picker').open = false; showDocument(); });
  $('document-search').addEventListener('input', choices);
  for (const [id, delta] of [['previous', -1], ['next', 1]]) {
    $(id).addEventListener('click', () => {
      const position = found.findIndex(i => rows[i].filename === selected) + delta;
      if (position >= 0 && position < found.length) { selected = rows[found[position]].filename; showDocument(); }
    });
  }
  $('document-frame').addEventListener('load', readerState);
  window.addEventListener('message', event => {
    if (event.source !== $('document-frame').contentWindow || !event.data) return;
    const message = event.data;
    if (message.type === 'proof-height' && Number.isFinite(message.height)) $('document-frame').style.height = Math.max(100, message.height) + 'px';
    if (message.type === 'proof-tab' && Number.isInteger(message.tab) && message.tab >= 0 && message.tab < tabCount) { activeTab = message.tab; save(); }
    if (message.type === 'proof-source' && Object.hasOwn(sourceLabels, message.url)) {
      restore(ProofSearch.sourceParams(save(), message.url, ProofNoteworthiness.current().clear_filters_on_source_selection));
      render();
    }
  });
  window.addEventListener('hashchange', () => { restore(); render(); });
  restore(); render();
})();
