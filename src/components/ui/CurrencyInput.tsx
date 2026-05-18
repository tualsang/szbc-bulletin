interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function CurrencyInput({ value, onChange, placeholder = '0.00', ariaLabel }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none select-none">
        $
      </span>
      <input
        type="text"
        inputMode="decimal"
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^\d.]/g, '');
          const parts = cleaned.split('.');
          const normalized =
            parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
          onChange(normalized);
        }}
        placeholder={placeholder}
        className="w-full pl-7 pr-3 py-2 rounded-lg border border-stone-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
      />
    </div>
  );
}
