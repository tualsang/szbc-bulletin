import { GripVertical, X } from 'lucide-react';
import { ProgramRow as Row } from '../../lib/schema';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  row: Row;
  onChange: (row: Row) => void;
  onRemove: () => void;
}

export function ProgramRowEditor({ row, onChange, onRemove }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 items-start bg-white">
      {/* Drag handle — only this element initiates a drag, so the rest of the
          row (and the page) stays scrollable on touch devices. */}
      <button
        type="button"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
        className="shrink-0 h-10 w-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:bg-stone-200 touch-none cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>

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