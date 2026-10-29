import { filterSettingsModules, responseCount, SETTINGS_MODULES } from './module-settings-model';

test('empty search preserves the complete five-module catalog', () => {
  expect(filterSettingsModules('   ')).toBe(SETTINGS_MODULES);
  expect(SETTINGS_MODULES).toHaveLength(5);
  expect(SETTINGS_MODULES[0].entries).toHaveLength(6);
  expect(SETTINGS_MODULES.slice(1).every(module => module.entries.length === 5)).toBe(true);
});

test('filters individual entries while preserving their module context', () => {
  const matches = filterSettingsModules('BRANDS makers');
  expect(matches).toHaveLength(1);
  expect(matches[0].title).toBe('Items Management');
  expect(matches[0].entries.map(entry => entry.key)).toEqual(['brands']);
  expect(SETTINGS_MODULES[0].entries).toHaveLength(5);
});

test('searches descriptions, category names, and synonyms', () => {
  expect(filterSettingsModules('barcode')[0].entries).toHaveLength(5);
  expect(filterSettingsModules('general ledger')[0].key).toBe('finance');
  expect(filterSettingsModules('kilogram')[0].entries[0].key).toBe('units');
  expect(filterSettingsModules('no-matching-setting')).toEqual([]);
});

test.each([0, 112])('reads real paginated totals, including zero: %p', total => {
  expect(responseCount({ data: { pagination: { total }, data: [{}] } })).toBe(total);
  expect(responseCount({ data: { total } })).toBe(total);
});

test.each([undefined, null, -1, '48', NaN, Infinity, 1.5])('does not turn missing or invalid counts into a successful zero: %p', total => {
  expect(() => responseCount({ data: { pagination: { total } } })).toThrow('Count unavailable');
});
