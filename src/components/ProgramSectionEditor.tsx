import { Plus } from 'lucide-react';
import { ProgramSection, emptyRow } from '../lib/schema';
import { ProgramRowEditor } from './ui/ProgramRow';
import { NekkhawmRow } from './ui/NekkhawmRow';
import { Toggle } from './ui/Toggle';

interface Props {
  section: ProgramSection;
  onChange: (s: ProgramSection) => void;
}

export function ProgramSectionEditor({ section, onChange }: Props) {
  return (
    <div className="space-y-3">
      {section.rows.map((row) => (
        <ProgramRowEditor
          key={row.id}
          row={row}
          onChange={(updated) =>
            onChange({
              ...section,
              rows: section.rows.map((r) => (r.id === row.id ? updated : r)),
            })
          }
          onRemove={() =>
            onChange({
              ...section,
              rows: section.rows.filter((r) => r.id !== row.id),
            })
          }
        />
      ))}

      <button
        type="button"
        onClick={() => onChange({ ...section, rows: [...section.rows, emptyRow()] })}
        className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg border border-dashed border-stone-300 text-stone-600 hover:bg-stone-50 active:bg-stone-100 transition-colors"
      >
        <Plus size={16} /> Add row
      </button>

      <div className="pt-2 border-t border-stone-100">
        <Toggle
          label="Communion (Nekkhawm)"
          checked={section.hasCommunion}
          onChange={(v) => onChange({ ...section, hasCommunion: v })}
        />

        {section.hasCommunion && (
          <div className="mt-3">
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
