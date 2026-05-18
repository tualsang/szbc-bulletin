interface Props {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}

export function DateInput({ value, onChange, label }: Props) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-medium text-stone-600 mb-1">{label}</span>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
      />
    </label>
  );
}
