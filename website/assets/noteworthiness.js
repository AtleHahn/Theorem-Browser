/* Shared by filtering and both embedded and standalone document views. */
(function (root) {
  'use strict';
  const fieldModes = ['appears in statement', 'appears exclusively in statement', 'does NOT appear in statement but in at least one proof'];
  const defaults = {min_proof_count_for_noteworthiness: 3,
    exclude_simpler_proof_warnings_from_noteworthiness: true,
    clear_filters_on_source_selection: true,
    mathematical_field_search_mode: fieldModes[0]};
  function normalize(value) {
    const result = {...defaults};
    if (value && Number.isInteger(value.min_proof_count_for_noteworthiness) && value.min_proof_count_for_noteworthiness >= 1 && value.min_proof_count_for_noteworthiness <= 10)
      result.min_proof_count_for_noteworthiness = value.min_proof_count_for_noteworthiness;
    for (const key of Object.keys(defaults).slice(1)) {
      if (typeof defaults[key] === 'boolean' && typeof value?.[key] === 'boolean') result[key] = value[key];
    }
    if (fieldModes.includes(value?.mathematical_field_search_mode)) result.mathematical_field_search_mode = value.mathematical_field_search_mode;
    return result;
  }
  let settings = {...defaults};
  try { settings = normalize(JSON.parse(sessionStorage.getItem('proof-database-settings'))); } catch (_) { /* optional */ }
  function reasons(row, options = settings) {
    const config = normalize(options);
    if (!['high', 'medium'].includes(row.importance) ||
        (config.exclude_simpler_proof_warnings_from_noteworthiness && row.issue.some(issue => !['no potential issues', 'may have an unsatisfactory proof'].includes(issue)))) return [];
    const result = [...row.reason_candidates];
    if (row.assessed_proof_count >= config.min_proof_count_for_noteworthiness) result.unshift('Has many Proofs');
    return result;
  }
  const api = {fieldModes, reasons, current: () => ({...settings}), set: value => { settings = normalize(value); }};
  root.ProofNoteworthiness = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
