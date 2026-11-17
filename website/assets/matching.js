/* The list URL carries its filters and Settings, including when opened in a new tab. */
(function () {
  'use strict';
  const params = new URLSearchParams(location.hash.slice(1));
  // Discard the temporarily hidden aggregate from older matching-list links.
  const noteworthyValues = params.getAll('noteworthy').filter(value => value !== 'any');
  params.delete('noteworthy');
  noteworthyValues.forEach(value => params.append('noteworthy', value));
  const filters = Object.fromEntries(['fields', 'statement', 'proof', 'noteworthy', 'issue', 'importance', 'count', 'sources']
    .map(name => [name, params.getAll(name)]));
  if (!params.has('state') && !params.has('count')) filters.count = ['at least one'];
  let settings = ProofNoteworthiness.current();
  try {
    const value = JSON.parse(params.get('settings'));
    if (value && typeof value === 'object' && !Array.isArray(value)) settings = value;
  } catch (_) { /* Use saved defaults for a malformed link. */ }
  const rows = window.PROOF_CATALOGUE.documents.map(row => ({...row, issue: ProofNoteworthiness.issues(row, settings), noteworthy: ProofNoteworthiness.reasons(row, settings)}));
  const found = ProofSearch.search(rows, window.PROOF_SEARCH_INDEX, params.get('q') || '', 'all', filters,
    window.PROOF_CATALOGUE.casefold, params.get('case') !== 'sensitive', settings.mathematical_field_search_mode);
  document.getElementById('matching-count').textContent = `${found.length.toLocaleString()} matching documents`;
  const list = document.getElementById('matching-documents');
  for (const index of found) {
    const row = rows[index], item = document.createElement('li'), link = document.createElement('a');
    const readerParams = new URLSearchParams(params);
    readerParams.delete('settings');
    readerParams.set('state', '1');
    // Include effective defaults too, so the reader sees the same filters.
    for (const [name, values] of Object.entries(filters)) {
      readerParams.delete(name);
      values.forEach(value => readerParams.append(name, value));
    }
    readerParams.set('document', row.filename);
    readerParams.set('openDocument', row.filename);
    link.href = 'index.html#' + readerParams;
    link.textContent = row.title;
    const filename = document.createElement('code');
    filename.className = 'related-filename matching-filename';
    filename.textContent = row.filename;
    const details = document.createElement('div');
    details.className = 'matching-details';
    function text(tag, value, className) {
      const element = document.createElement(tag);
      element.textContent = value;
      if (className) element.className = className;
      details.append(element);
      return element;
    }
    text('span', 'Proofs: ', 'related-detail-label');
    text('strong', row.count === null || row.count === undefined || row.count === '' ? 'Unknown' : String(row.count));
    text('span', ' · Importance: ', 'related-detail-label');
    text('strong', row.importance || 'Unknown');
    text('span', ' · Sources: ', 'related-detail-label');
    const sources = Object.entries(row.sources || {}).sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]));
    if (!sources.length) text('span', 'Unknown');
    sources.forEach(([url, title], sourceIndex) => {
      if (sourceIndex) text('span', ', ');
      // Metadata labels are plain text; only web URLs become links.
      const source = text(/^https?:\/\//i.test(url) ? 'a' : 'span', title);
      if (/^https?:\/\//i.test(url)) source.href = url;
    });
    item.append(link, filename, details);
    list.append(item);
  }
  params.delete('settings');
  document.getElementById('matching-back').href = 'index.html#' + params;
  try { sessionStorage.setItem('proof-database-return', '#' + params); } catch (_) { /* Storage is optional. */ }
})();
