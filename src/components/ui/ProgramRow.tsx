import { X } from 'lucide-react';
import { ProgramRow as Row } from '../../lib/schema';

interface Props {
  row: Row;
  onChange: (row: Row) => void;
  onRemove: () => void;
}

export function ProgramRowEditor({ row, onChange, onRemove }: Props) {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-2">
        <input
          type="text"
          value={row.label}
          onChange={(e) => onChange({ ...row, label: e.target.value })}
          placeholder="Label (e.g. Lasakna)"
          className="sm:col-span-2 px-3 py-2 rounded-lg border border-stone-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
        />
        <textarea
          value={row.value}
          onChange={(e) => onChange({ ...row, value: e.target.value })}
          placeholder="Value (name or detail)"
          rows={1}
          className="sm:col-span-3 px-3 py-2 rounded-lg border border-stone-300 bg-white text-base resize-y min-h-[40px] focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove row"
        className="shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-stone-500 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
