import { useEffect, useRef, useState } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { Undo2 } from 'lucide-react';
import { ProgramRow } from '../../lib/schema';
import { ProgramRowEditor } from './ProgramRow';

interface Props {
    rows: ProgramRow[];
    onChange: (rows: ProgramRow[]) => void;
}

/**
 * Drag-and-drop sortable list of ProgramRow editors.
 *
 * Deletion uses a 3-second undo window: the row is removed from `rows`
 * immediately (so the form reflects the change and auto-save fires), but we
 * keep a snapshot of the row + its original index. If the user taps Undo
 * within 3s, we splice it back. After 3s the snapshot is dropped and the
 * deletion is permanent.
 */
export function SortableRowList({ rows, onChange }: Props) {
    const sensors = useSensors(
        useSensor(MouseSensor, {
            // Require the mouse to move 5px before activating — prevents
            // accidental drags on simple clicks.
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            // On touch devices, require a 200ms hold + 5px tolerance so
            // normal taps still work and text selection is suppressed before
            // the drag activates.
            activationConstraint: { delay: 200, tolerance: 5 },
        })
    );

    // Snapshot of the most recently deleted row, used for undo.
    const [pending, setPending] = useState<{ row: ProgramRow; index: number } | null>(null);
    const timerRef = useRef<number | null>(null);

    // Clear the undo timer on unmount so we don't try to setPending after
    // the component goes away (e.g. user navigates to Preview tab).
    useEffect(() => {
        return () => {
            if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        };
    }, []);

    const onDragStart = (_e: DragStartEvent) => {
        // Prevent text selection while dragging across the whole page.
        document.body.style.userSelect = 'none';
        (document.body.style as CSSStyleDeclaration & { webkitUserSelect: string }).webkitUserSelect = 'none';
    };

    const onDragEnd = (e: DragEndEvent) => {
        // Restore text selection.
        document.body.style.userSelect = '';
        (document.body.style as CSSStyleDeclaration & { webkitUserSelect: string }).webkitUserSelect = '';

        const { active, over } = e;
        if (!over || active.id === over.id) return;
        const oldIdx = rows.findIndex((r) => r.id === active.id);
        const newIdx = rows.findIndex((r) => r.id === over.id);
        if (oldIdx === -1 || newIdx === -1) return;
        onChange(arrayMove(rows, oldIdx, newIdx));
    };

    const onRemove = (id: string) => {
        const index = rows.findIndex((r) => r.id === id);
        if (index === -1) return;
        const row = rows[index];

        // Remove the row immediately, but remember it so undo can splice it back.
        onChange(rows.filter((r) => r.id !== id));
        setPending({ row, index });

        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setPending(null), 3000);
    };

    const onUndo = () => {
        if (!pending) return;
        // Re-insert the row at its original index. If the user added or moved
        // other rows during the 3s window, clamp to the current end of the list.
        const next = [...rows];
        const insertAt = Math.min(pending.index, next.length);
        next.splice(insertAt, 0, pending.row);
        onChange(next);
        setPending(null);
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <SortableContext
                    items={rows.map((r) => r.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {rows.map((row) => (
                            <ProgramRowEditor
                                key={row.id}
                                row={row}
                                onChange={(updated) =>
                                    onChange(rows.map((r) => (r.id === row.id ? updated : r)))
                                }
                                onRemove={() => onRemove(row.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {pending && <UndoToast label={pending.row.label || 'Row'} onUndo={onUndo} />}
        </>
    );
}

/**
 * Floating toast pinned above the bottom save bar. Pure CSS countdown bar
 * inside, so the user sees the undo window draining.
 */
function UndoToast({ label, onUndo }: { label: string; onUndo: () => void }) {
    return (
        <div
            className="fixed left-1/2 -translate-x-1/2 z-20 max-w-sm w-[calc(100%-2rem)]"
            style={{ bottom: 'calc(7rem + env(safe-area-inset-bottom))' }}
        >
            <div className="bg-stone-900 text-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-sm">
                        Removed <span className="font-semibold">{label}</span>
                    </span>
                    <button
                        type="button"
                        onClick={onUndo}
                        className="flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:text-amber-200 active:text-amber-100"
                    >
                        <Undo2 size={14} /> Undo
                    </button>
                </div>
                {/* 3-second countdown bar */}
                <div className="h-0.5 bg-stone-700">
                    <div className="h-full bg-amber-300 origin-left animate-[shrink_3s_linear_forwards]" />
                </div>
            </div>
        </div>
    );
}