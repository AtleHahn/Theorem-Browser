/* Pure search functions, shared by the browser and Node-based checks. */
(function (root) {
  'use strict';
  function fold(text, mapping) {
    return Array.from(text, c => mapping[c] ?? c.toLowerCase()).join('');
  }
  function documentLabel(row) {
    const importance = String(row.importance ?? '').trim().toLowerCase();
    return row.title + (['high', 'medium', 'low'].includes(importance) ? ` (${importance})` : '');
  }
  function matchesFields(row, selected, mode = 'appears in statement') {
    if (!selected.length) return true;
    const statement = row.fields || [], proofs = row.proof_fields || [];
    const inStatement = selected.some(field => statement.includes(field));
    if (mode === 'appears exclusively in statement') return statement.length > 0 && statement.every(field => selected.includes(field));
    if (mode === 'does NOT appear in statement but in at least one proof') return !inStatement && selected.some(field => proofs.includes(field));
    return inStatement;
  }
  function matches(row, filters, fieldMode = 'appears in statement') {
    if (!matchesFields(row, filters.fields || [], fieldMode)) return false;
    for (const field of ['sources', 'statement', 'proof', 'count', 'importance', 'issue']) {
      const selected = filters[field] || [];
      if (!selected.length) continue;
      let values = field === 'sources' ? Object.keys(row.sources) : row[field];
      if (!Array.isArray(values)) values = [values];
      if (!selected.some(v => values.includes(v) ||
          (field === 'issue' && v === 'has potential issues' && values.some(issue => issue && issue !== 'no potential issues')) ||
          (field === 'count' && v === 'at least one' && !String(row.count ?? '').split(';').map(value => value.trim()).includes('0')) ||
          (field === 'importance' && v === 'at least medium' && ['medium', 'high'].includes(row.importance)))) return false;
    }
    const selected = filters.noteworthy || [];
    if (selected.length) {
      const reasons = row.noteworthy;
      if (!selected.some(v => reasons.includes(v)) &&
          !(selected.includes('any') && reasons.length >= 1)) return false;
    }
    return true;
  }
  function searchTerms(query, mapping, caseInsensitive = true) {
    const terms = Array.from(query.matchAll(/"([^"]*)(?:"|$)|([^\s"]+)/gu), match => match[1] ?? match[2]).filter(Boolean);
    return caseInsensitive ? terms.map(term => fold(term, mapping)) : terms;
  }
  function search(rows, index, query, scope, filters, mapping, caseInsensitive = true, fieldMode = 'appears in statement') {
    const terms = searchTerms(query, mapping, caseInsensitive);
    return rows.flatMap((row, i) => matches(row, filters, fieldMode) &&
      (!terms.length || terms.every(term => index[i][caseInsensitive ? scope : 'raw'].includes(term))) ? [i] : []);
  }
  function sourceParams(current, url, reset = true) {
    const params = new URLSearchParams(current);
    if (reset) {
      for (const name of ['q', 'fields', 'sources', 'statement', 'proof', 'noteworthy', 'issue', 'importance', 'count']) params.delete(name);
    } else if (!params.has('state') && !params.has('count')) {
      params.set('count', 'at least one');
    }
    params.set('state', '1');
    params.set('sources', url);
    params.delete('resetSources'); // Retired URL preference; Settings is authoritative.
    return params;
  }
  const api = {fold, matchesFields, matches, search, searchTerms, sourceParams, documentLabel};
  if (typeof module !== 'undefined') module.exports = api;
  root.ProofSearch = api;
})(typeof window === 'undefined' ? globalThis : window);
