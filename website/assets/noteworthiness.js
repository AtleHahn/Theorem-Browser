/* Shared by filtering and both embedded and standalone document views. */
(function (root) {
  'use strict';
  // Retain the optional policy for future restoration; enforce the default while hidden.
  const showIssueExclusionSetting = false;
  const fieldModes = ['appears in statement', 'appears exclusively in statement', 'does NOT appear in statement but in at least one proof'];
  const defaults = {min_proof_count_for_noteworthiness: 3,
    exclude_simpler_proof_warnings_from_noteworthiness: true,
    minimum_philosophical_significance_level: 'major',
    clear_filters_on_source_selection: true,
    mathematical_field_search_mode: fieldModes[0], related_results_display_mode: 'all', better_proof_list_criterion: 'dependency_free_proof'};
  function normalize(value) {
    const result = {...defaults};
    if (value && Number.isInteger(value.min_proof_count_for_noteworthiness) && value.min_proof_count_for_noteworthiness >= 1 && value.min_proof_count_for_noteworthiness <= 10)
      result.min_proof_count_for_noteworthiness = value.min_proof_count_for_noteworthiness;
    for (const key of Object.keys(defaults).slice(1)) {
      if (typeof defaults[key] === 'boolean' && typeof value?.[key] === 'boolean') result[key] = value[key];
    }
    if (fieldModes.includes(value?.mathematical_field_search_mode)) result.mathematical_field_search_mode = value.mathematical_field_search_mode;
    if (['all', 'obvious'].includes(value?.related_results_display_mode)) result.related_results_display_mode = value.related_results_display_mode;
    if (['missing_proofs', 'dependency_free_proof'].includes(value?.better_proof_list_criterion)) result.better_proof_list_criterion = value.better_proof_list_criterion;
    if (['major', 'medium', 'minor'].includes(value?.minimum_philosophical_significance_level)) result.minimum_philosophical_significance_level = value.minimum_philosophical_significance_level;
    if (!showIssueExclusionSetting) result.exclude_simpler_proof_warnings_from_noteworthiness = true;
    return result;
  }
  let settings = {...defaults};
  try { settings = normalize(JSON.parse(sessionStorage.getItem('proof-database-settings'))); } catch (_) { /* optional */ }
  const betterIssue = 'There is a broader or equivalent result with a better proof list';
  function issues(row, options = settings) {
    const result = (row.base_issue || row.issue || []).filter(issue => issue !== betterIssue && issue !== 'No potential issues');
    if (row.better_proof_matches?.[normalize(options).better_proof_list_criterion]?.length) result.push(betterIssue);
    return result.length ? result : ['No potential issues'];
  }
  function philosophicalSignificance(row, options = settings) {
    const ranks = {major: 0, medium: 1, minor: 2, auxiliary: 2};
    return Boolean(row.has_philosophical_significance &&
      ranks[row.philosophical_significance_level] <= ranks[normalize(options).minimum_philosophical_significance_level] &&
      issues(row, options).every(issue => ['No potential issues', 'May have an unsatisfactory proof'].includes(issue)));
  }
  function reasons(row, options = settings) {
    const config = normalize(options);
    if (!['high', 'medium'].includes(row.importance) ||
        (config.exclude_simpler_proof_warnings_from_noteworthiness && issues(row, config).some(issue => !['No potential issues', 'May have an unsatisfactory proof'].includes(issue)))) return [];
    const result = [...row.reason_candidates];
    if (row.assessed_proof_count >= config.min_proof_count_for_noteworthiness) result.unshift('Has many Proofs');
    if (philosophicalSignificance(row, config)) result.unshift('Philosophically significant');
    return result;
  }
  const api = {showIssueExclusionSetting, philosophicalSignificance, fieldModes, reasons, issues, betterIssue, current: () => ({...settings}), set: value => { settings = normalize(value); }};
  root.ProofNoteworthiness = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
