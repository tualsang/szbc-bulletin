import { Bulletin, emptyRow, ServiceType } from '../lib/schema';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { DateInput } from './ui/DateInput';
import { CurrencyInput } from './ui/CurrencyInput';
import { ProgramSectionEditor } from './ProgramSectionEditor';
import { SortableRowList } from './ui/SortableRowList';
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DateInput
            label="Sunday date"
            value={value.date}
            onChange={(v) => set('date', v)}
          />
          <label className="block">
            <span className="block text-sm font-medium text-stone-600 mb-1">
              Header override <span className="text-stone-400">(optional)</span>
            </span>
            <input
              type="text"
              value={value.dateOverride}
              onChange={(e) => set('dateOverride', e.target.value)}
              placeholder='e.g. "Resurrection Sunday"'
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-base"
            />
          </label>
        </div>
        <p className="text-xs text-stone-500">
          Saturday ({dayName(saturdayISO)} {formatDate(saturdayISO)}) and Sunday
          ({dayName(sundayISO)} {formatDate(sundayISO)}) follow the date above.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
        <p className="text-xs text-stone-500">
          Zelle email addresses are baked in and always shown on the bulletin —
          you don&rsquo;t need to enter them here.
        </p>
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
              set('nextWeekSaturday', {
                ...value.nextWeekSaturday,
                subtitle: e.target.value,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-base"
          />
        </label>

        <SortableRowList
          rows={value.nextWeekSaturday.rows}
          onChange={(rows) =>
            set('nextWeekSaturday', { ...value.nextWeekSaturday, rows })
          }
        />
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
      </CollapsibleSection>

      {/* Saturday Night Service — opens expanded, sortable rows */}
      <CollapsibleSection title="Saturday Night Service">
        <p className="text-xs text-stone-500">
          Leave service type and all rows empty to skip this section on the bulletin.
        </p>

        <label className="block">
          <span className="block text-sm font-medium text-stone-600 mb-1">
            Service type
          </span>
          <select
            value={value.nextWeekSaturdayNight.serviceType}
            onChange={(e) =>
              set('nextWeekSaturdayNight', {
                ...value.nextWeekSaturdayNight,
                serviceType: e.target.value as ServiceType,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-base"
          >
            <option value="">— None —</option>
            <option value="Nupi Hun">Nupi Hun</option>
            <option value="Khangno Hun">Khangno Hun</option>
          </select>
        </label>

        <SortableRowList
          rows={value.nextWeekSaturdayNight.rows}
          onChange={(rows) =>
            set('nextWeekSaturdayNight', { ...value.nextWeekSaturdayNight, rows })
          }
        />
        <button
          type="button"
          onClick={() =>
            set('nextWeekSaturdayNight', {
              ...value.nextWeekSaturdayNight,
              rows: [...value.nextWeekSaturdayNight.rows, emptyRow()],
            })
          }
          className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg border border-dashed border-stone-300 text-stone-600 hover:bg-stone-50"
        >
          <Plus size={16} /> Add row
        </button>
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