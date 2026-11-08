/* Settings apply across the catalogue and document reader. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const storageKey = 'proof-database-settings';
  const defaults = {
    min_proof_count_for_noteworthiness: 3,
    exclude_simpler_proof_warnings_from_noteworthiness: true,
    clear_filters_on_source_selection: true,
    mathematical_field_search_mode: ProofNoteworthiness.fieldModes[0]
  };
  let settings = {...defaults};
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (saved && Number.isInteger(saved.min_proof_count_for_noteworthiness) &&
        saved.min_proof_count_for_noteworthiness >= 1 && saved.min_proof_count_for_noteworthiness <= 10) {
      settings.min_proof_count_for_noteworthiness = saved.min_proof_count_for_noteworthiness;
      if (ProofNoteworthiness.fieldModes.includes(saved.mathematical_field_search_mode)) settings.mathematical_field_search_mode = saved.mathematical_field_search_mode;
      for (const key of Object.keys(defaults).slice(1)) {
        if (typeof defaults[key] === 'boolean' && typeof saved[key] === 'boolean') settings[key] = saved[key];
      }
    }
  } catch (_) { /* Storage is optional. */ }
  $('settings').addEventListener('click', () => {
    $('settings-min-proofs').value = String(settings.min_proof_count_for_noteworthiness);
    $('settings-warnings').checked = settings.exclude_simpler_proof_warnings_from_noteworthiness;
    $('settings-reset-source-filters').checked = settings.clear_filters_on_source_selection;
    ProofNoteworthiness.fieldModes.forEach((mode, i) => { $('settings-field-mode-' + i).checked = mode === settings.mathematical_field_search_mode; });
    $('settings-dialog').showModal();
  });
  $('settings-cancel').addEventListener('click', () => $('settings-dialog').close());
  $('settings-form').addEventListener('submit', event => {
    event.preventDefault();
    settings = {
      min_proof_count_for_noteworthiness: Number($('settings-min-proofs').value),
      exclude_simpler_proof_warnings_from_noteworthiness: $('settings-warnings').checked,
      clear_filters_on_source_selection: $('settings-reset-source-filters').checked,
      mathematical_field_search_mode: ProofNoteworthiness.fieldModes.find((mode, i) => $('settings-field-mode-' + i).checked) || ProofNoteworthiness.fieldModes[0]
    };
    try { sessionStorage.setItem(storageKey, JSON.stringify(settings)); } catch (_) { /* Keep in memory. */ }
    ProofNoteworthiness.set(settings);
    window.dispatchEvent(new Event('proof-settings-change'));
    $('settings-dialog').close();
  });
})();
