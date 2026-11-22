import { useState } from 'react';
import SearchSelect from '../ui/SearchSelect.jsx';
import { locStates } from './_shared.jsx';

/** Searchable state jump-box. base = '/state/' or '/hi/state/' */
export default function StatePicker({ t, states: allStates, base = '/state/', btn }) {
  const states = locStates(t, allStates);
  const [v, setV] = useState('');
  const go = (slug) => {
    setV(slug);
    if (slug) window.location.href = base + slug;
  };
  return (
    <div className="picker">
      <SearchSelect
        value={v}
        onChange={go}
        options={states.map((s) => ({ value: s.s, label: s.n, alt: s.h + ' ' + (s.en || ''), hint: s.u ? 'UT' : '' }))}
        placeholder={t.selectState}
        searchPlaceholder={t.search}
        noResults={t.noResults}
        name="state"
      />
      {btn && <span className="sr-only">{btn}</span>}
    </div>
  );
}
