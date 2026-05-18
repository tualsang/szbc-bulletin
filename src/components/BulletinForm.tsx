import { Bulletin, emptyRow } from '../lib/schema';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { DateInput } from './ui/DateInput';
import { CurrencyInput } from './ui/CurrencyInput';
import { ProgramSectionEditor } from './ProgramSectionEditor';
import { ProgramRowEditor } from './ui/ProgramRow';
import { addDays, formatDate, dayName } from '../lib/date';
import { Plus } from 'lucide-react';

interface Props {
  value: Bulletin;
  onChange: (b: Bulletin) => void;
}

export function BulletinForm({ value, onChange }: Props) {
  const set = <K extends keyof Bulletin>(key: K, v: Bulletin[K]) =>
    onChange({ ...value, [key]: v });

  const saturdayISO = addDays(value.date, 6);
  const sundayISO = addDays(value.date, 7);

  return (
    <div className="space-y-4">
      {/* Sunday date */}
      <CollapsibleSection
        title="This Sunday"
        subtitle={formatDate(value.date, { withDay: true })}
      >
        <DateInput
          label="Sunday date"
          value={value.date}
          onChange={(v) => set('date', v)}
        />
        <p className="text-xs text-stone-500">
          Next week's Saturday ({dayName(saturdayISO)} {formatDate(saturdayISO)}) and
          Sunday ({dayName(sundayISO)} {formatDate(sundayISO)}) update automatically.
        </p>
      </CollapsibleSection>

      {/* Today's program */}
      <CollapsibleSection title="Today's Program">
        <ProgramSectionEditor
          section={value.todaysProgram}
          onChange={(s) => set('todaysProgram', s)}
        />
      </CollapsibleSection>

      {/* Offering */}
      <CollapsibleSection title="Offering">
        <label className="block">
          <span className="block text-sm font-medium text-stone-600 mb-1">Sehsuah</span>
          <CurrencyInput
            value={value.offering.sehsuah}
            onChange={(v) => set('offering', { ...value.offering, sehsuah: v })}
            ariaLabel="Sehsuah"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-stone-600 mb-1">Citpiak</span>
          <CurrencyInput
            value={value.offering.citpiak}
            onChange={(v) => set('offering', { ...value.offering, citpiak: v })}
            ariaLabel="Citpiak"
          />
        </label>
      </CollapsibleSection>

      {/* Next week — Saturday */}
      <CollapsibleSection
        title="Next Week — Saturday"
        subtitle={formatDate(saturdayISO, { withDay: true })}
      >
        <label className="block">
          <span className="block text-sm font-medium text-stone-600 mb-1">
            Subtitle (e.g. Saturday Thunget, Khangno Hun)
          </span>
          <input
            type="text"
            value={value.nextWeekSaturday.subtitle}
            onChange={(e) =>
              set('nextWeekSaturday', { ...value.nextWeekSaturday, subtitle: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-base"
          />
        </label>

        <div className="space-y-3">
          {value.nextWeekSaturday.rows.map((row) => (
            <ProgramRowEditor
              key={row.id}
              row={row}
              onChange={(updated) =>
                set('nextWeekSaturday', {
                  ...value.nextWeekSaturday,
                  rows: value.nextWeekSaturday.rows.map((r) =>
                    r.id === row.id ? updated : r
                  ),
                })
              }
              onRemove={() =>
                set('nextWeekSaturday', {
                  ...value.nextWeekSaturday,
                  rows: value.nextWeekSaturday.rows.filter((r) => r.id !== row.id),
                })
              }
            />
          ))}
          <button
            type="button"
            onClick={() =>
              set('nextWeekSaturday', {
                ...value.nextWeekSaturday,
                rows: [...value.nextWeekSaturday.rows, emptyRow()],
              })
            }
            className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg border border-dashed border-stone-300 text-stone-600 hover:bg-stone-50"
          >
            <Plus size={16} /> Add row
          </button>
        </div>
      </CollapsibleSection>

      {/* Saturday Night Service */}
      <CollapsibleSection title="Saturday Night Service" defaultOpen={false}>
        <p className="text-xs text-stone-500">
          Leave both fields empty to skip this section on the bulletin.
        </p>
        <label className="block">
          <span className="block text-sm font-medium text-stone-600 mb-1">Chairperson</span>
          <input
            type="text"
            value={value.nextWeekSaturdayNight.chairperson}
            onChange={(e) =>
              set('nextWeekSaturdayNight', {
                ...value.nextWeekSaturdayNight,
                chairperson: e.target.value,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-base"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-stone-600 mb-1">Sermon</span>
          <input
            type="text"
            value={value.nextWeekSaturdayNight.sermon}
            onChange={(e) =>
              set('nextWeekSaturdayNight', {
                ...value.nextWeekSaturdayNight,
                sermon: e.target.value,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-base"
          />
        </label>
      </CollapsibleSection>

      {/* Next week Sunday */}
      <CollapsibleSection
        title="Next Week — Sunday"
        subtitle={formatDate(sundayISO, { withDay: true })}
      >
        <ProgramSectionEditor
          section={value.nextWeekSunday}
          onChange={(s) => set('nextWeekSunday', s)}
        />
      </CollapsibleSection>
    </div>
  );
}
