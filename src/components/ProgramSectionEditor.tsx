import { Plus } from 'lucide-react';
import { ProgramSection, emptyRow } from '../lib/schema';
import { NekkhawmRow } from './ui/NekkhawmRow';
import { Toggle } from './ui/Toggle';
import { SortableRowList } from './ui/SortableRowList';
import { COMMUNION_GROUPS } from '../lib/constants';

interface Props {
  section: ProgramSection;
  onChange: (s: ProgramSection) => void;
}

export function ProgramSectionEditor({ section, onChange }: Props) {
  /**
   * Toggling communion ON used to leave the six name slots blank — the pastor
   * had to click Group 1 or Group 2 to populate them. Now we auto-fill on
   * first enable: if every name slot is empty when communion is turned on,
   * we pre-fill from the currently selected group (default: 1).
   */
  const handleCommunionToggle = (next: boolean) => {
    if (next && section.nekkhawmNames.every((n) => !n.trim())) {
      const g = section.communionGroup ?? 1;
      onChange({
        ...section,
        hasCommunion: true,
        communionGroup: g,
        nekkhawmNames: [...COMMUNION_GROUPS[g]],
      });
      return;
    }
    onChange({ ...section, hasCommunion: next });
  };

  return (
    <div className="space-y-3">
      <SortableRowList
        rows={section.rows}
        onChange={(rows) => onChange({ ...section, rows })}
      />

      <button
        type="button"
        onClick={() => onChange({ ...section, rows: [...section.rows, emptyRow()] })}
        className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg border border-dashed border-stone-300 text-stone-600 hover:bg-stone-50 active:bg-stone-100 transition-colors"
      >
        <Plus size={16} /> Add row
      </button>

      <div className="pt-2 border-t border-stone-100">
        {!section.hasCommunion && (
          <Toggle
            label="Communion (Nekkhawm)"
            checked={section.hasCommunion}
            onChange={handleCommunionToggle}
          />
        )}

        {section.hasCommunion && (
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-800">
                Communion (Nekkhawm)
              </span>
              <button
                type="button"
                onClick={() => handleCommunionToggle(false)}
                className="text-xs text-stone-500 hover:text-stone-800 underline"
              >
                Remove
              </button>
            </div>
            <NekkhawmRow
              label={section.nekkhawmLabel}
              onLabelChange={(label) => onChange({ ...section, nekkhawmLabel: label })}
              names={section.nekkhawmNames}
              onNamesChange={(names) => onChange({ ...section, nekkhawmNames: names })}
              group={section.communionGroup}
              onGroupChange={(g) => onChange({ ...section, communionGroup: g })}
            />
          </div>
        )}
      </div>
    </div>
  );
}