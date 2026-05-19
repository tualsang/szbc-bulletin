import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { ProgramRow } from '../../lib/schema';
import { ProgramRowEditor } from './ProgramRow';

interface Props {
    rows: ProgramRow[];
    onChange: (rows: ProgramRow[]) => void;
}

/**
 * Drag-and-drop sortable list of ProgramRow editors. Used everywhere row
 * order matters. PointerSensor with a 5px activation distance so accidental
 * taps don't start a drag; only the GripVertical handle on each row has the
 * drag listeners, so the rest of the page stays scrollable on touch.
 */
export function SortableRowList({ rows, onChange }: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const onDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        const oldIdx = rows.findIndex((r) => r.id === active.id);
        const newIdx = rows.findIndex((r) => r.id === over.id);
        if (oldIdx === -1 || newIdx === -1) return;
        onChange(arrayMove(rows, oldIdx, newIdx));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
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
                            onRemove={() => onChange(rows.filter((r) => r.id !== row.id))}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}