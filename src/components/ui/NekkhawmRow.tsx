import { COMMUNION_GROUPS } from '../../lib/constants';

interface Props {
  label: string;
  onLabelChange: (v: string) => void;
  names: string[];
  onNamesChange: (names: string[]) => void;
  group: 1 | 2;
  onGroupChange: (g: 1 | 2) => void;
}

export function NekkhawmRow({
  label,
  onLabelChange,
  names,
  onNamesChange,
  group,
  onGroupChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <label className="flex-1">
          <span className="block text-sm font-medium text-stone-600 mb-1">Label</span>
          <input
            type="text"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-base"
          />
        </label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onGroupChange(1)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border ${group === 1
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-700 border-stone-300'
              }`}
          >
            Group 1
          </button>
          <button
            type="button"
            onClick={() => onGroupChange(2)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border ${group === 2
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-700 border-stone-300'
              }`}
          >
            Group 2
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {names.map((name, i) => (
          <input
            key={i}
            type="text"
            value={name}
            onChange={(e) => {
              const next = [...names];
              next[i] = e.target.value;
              onNamesChange(next);
            }}
            placeholder={`Name ${i + 1}`}
            className="px-3 py-2 rounded-lg border border-stone-300 bg-white text-base"
          />
        ))}
      </div>
      <p className="text-xs text-stone-500">
        These six names render as three rows of two on the bulletin.
      </p>
    </div>
  );
}