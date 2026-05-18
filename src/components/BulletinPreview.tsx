import { Bulletin } from '../lib/schema';
import { PrintRender } from './PrintRender';

/**
 * Shows a scaled-down preview of ONE half (representative of what the pastor
 * will see when printed and cut). We render the full 3300×2550 PrintRender
 * but scale it down via CSS transform so it fits the phone screen.
 */
export function BulletinPreview({ bulletin }: { bulletin: Bulletin }) {
  // Target preview width: the phone screen. We render at native 3300px and
  // scale down. The user picks how it looks here — the saved PNG uses
  // exactly the same component.
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
      <div
        style={{
          width: '100%',
          aspectRatio: '3300 / 2550',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'scale(calc(var(--w, 360) / 3300))',
            transformOrigin: 'top left',
          }}
          ref={(el) => {
            if (!el) return;
            const parent = el.parentElement;
            if (!parent) return;
            const w = parent.clientWidth;
            el.style.transform = `scale(${w / 3300})`;
          }}
        >
          <PrintRender bulletin={bulletin} />
        </div>
      </div>
    </div>
  );
}
