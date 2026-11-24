/* Settings apply across the catalogue and document reader. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const storageKey = 'proof-database-settings';
  const defaults = {
    min_proof_count_for_noteworthiness: 3,
    minimum_philosophical_significance_level: 'major',
    exclude_simpler_proof_warnings_from_noteworthiness: true,
    clear_filters_on_source_selection: true,
    related_results_display_mode: 'all',
    better_proof_list_criterion: 'dependency_free_proof',
    mathematical_field_search_mode: ProofNoteworthiness.fieldModes[0]
  };
  let settings = {...defaults};
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (saved && Number.isInteger(saved.min_proof_count_for_noteworthiness) &&
        saved.min_proof_count_for_noteworthiness >= 1 && saved.min_proof_count_for_noteworthiness <= 10) {
      settings.min_proof_count_for_noteworthiness = saved.min_proof_count_for_noteworthiness;
      if (['major', 'medium', 'minor'].includes(saved.minimum_philosophical_significance_level)) settings.minimum_philosophical_significance_level = saved.minimum_philosophical_significance_level;
      if (['missing_proofs', 'dependency_free_proof'].includes(saved.better_proof_list_criterion)) settings.better_proof_list_criterion = saved.better_proof_list_criterion;
      if (['all', 'obvious'].includes(saved.related_results_display_mode)) settings.related_results_display_mode = saved.related_results_display_mode;
      if (ProofNoteworthiness.fieldModes.includes(saved.mathematical_field_search_mode)) settings.mathematical_field_search_mode = saved.mathematical_field_search_mode;
      for (const key of Object.keys(defaults).slice(1)) {
        if (typeof defaults[key] === 'boolean' && typeof saved[key] === 'boolean') settings[key] = saved[key];
      }
    }
  } catch (_) { /* Storage is optional. */ }
  if (!ProofNoteworthiness.showIssueExclusionSetting) settings.exclude_simpler_proof_warnings_from_noteworthiness = true;
  $('settings-warnings-control').hidden = !ProofNoteworthiness.showIssueExclusionSetting;
  $('settings').addEventListener('click', () => {
    $('settings-min-proofs').value = String(settings.min_proof_count_for_noteworthiness);
    $('settings-warnings').checked = settings.exclude_simpler_proof_warnings_from_noteworthiness;
    $('settings-reset-source-filters').checked = settings.clear_filters_on_source_selection;
    ProofNoteworthiness.fieldModes.forEach((mode, i) => { $('settings-field-mode-' + i).checked = mode === settings.mathematical_field_search_mode; });
    for (const mode of ['all', 'obvious']) $('settings-related-' + mode).checked = settings.related_results_display_mode === mode;
    for (const criterion of ['missing_proofs', 'dependency_free_proof']) $('settings-better-' + criterion).checked = settings.better_proof_list_criterion === criterion;
    for (const level of ['major', 'medium', 'minor']) $('settings-philosophy-' + level).checked = settings.minimum_philosophical_significance_level === level;
    $('settings-dialog').showModal();
  });
  window.ProofSettings = {reset() {
    settings = {...defaults};
    try { sessionStorage.setItem(storageKey, JSON.stringify(settings)); } catch (_) { /* Keep in memory. */ }
    ProofNoteworthiness.set(settings);
    $('settings-dialog').close();
  }};
  $('settings-cancel').addEventListener('click', () => $('settings-dialog').close());
  $('settings-form').addEventListener('submit', event => {
    event.preventDefault();
    settings = {
      minimum_philosophical_significance_level: ['major', 'medium', 'minor'].find(level => $('settings-philosophy-' + level).checked) || 'major',
      better_proof_list_criterion: $('settings-better-dependency_free_proof').checked ? 'dependency_free_proof' : 'missing_proofs',
      related_results_display_mode: $('settings-related-all').checked ? 'all' : 'obvious',
      min_proof_count_for_noteworthiness: Number($('settings-min-proofs').value),
      exclude_simpler_proof_warnings_from_noteworthiness: ProofNoteworthiness.showIssueExclusionSetting ? $('settings-warnings').checked : true,
      clear_filters_on_source_selection: $('settings-reset-source-filters').checked,
      mathematical_field_search_mode: ProofNoteworthiness.fieldModes.find((mode, i) => $('settings-field-mode-' + i).checked) || ProofNoteworthiness.fieldModes[0]
    };
    try { sessionStorage.setItem(storageKey, JSON.stringify(settings)); } catch (_) { /* Keep in memory. */ }
    ProofNoteworthiness.set(settings);
    window.dispatchEvent(new Event('proof-settings-change'));
    $('settings-dialog').close();
  });
})();
