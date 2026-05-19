import { RefObject, useLayoutEffect } from 'react';

/**
 * Shrink-to-fit: starts at base, shrinks down to min if content overflows.
 * Kept for backwards compat; new code should use useFitToFill.
 */
export function useFitContent(
  ref: RefObject<HTMLElement>,
  baseFontSize = 24,
  minFontSize = 14
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      let size = baseFontSize;
      el.style.fontSize = `${size}px`;
      while (el.scrollHeight > el.clientHeight && size > minFontSize) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };
    measure();
    document.fonts.ready.then(measure).catch(() => { });
  });
}

/**
 * Grow-to-fill: scales the content's font-size between min and max so that
 * its rendered height matches the container's height as closely as possible
 * without overflowing.
 *
 * Use this when you want a section (e.g. Today's Program) to dynamically
 * absorb whatever vertical space is available between fixed siblings.
 *
 * `containerRef` is the FLEX:1 parent whose height we're trying to fill;
 * `contentRef` is the element whose font-size we adjust.
 */
export function useFitToFill(
  containerRef: RefObject<HTMLElement>,
  contentRef: RefObject<HTMLElement>,
  opts: { min?: number; max?: number; step?: number } = {}
) {
  const min = opts.min ?? 22;
  const max = opts.max ?? 44;
  const step = opts.step ?? 0.5;

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const measure = () => {
      const targetH = container.clientHeight;
      if (targetH <= 0) return;

      // Start at min, grow until we either hit max or overflow.
      let size = min;
      content.style.fontSize = `${size}px`;

      while (size < max && content.scrollHeight <= targetH) {
        size += step;
        content.style.fontSize = `${size}px`;
      }
      // We grew one step too far if scrollHeight now exceeds the container.
      if (content.scrollHeight > targetH && size > min) {
        size -= step;
        content.style.fontSize = `${size}px`;
      }
    };

    measure();
    document.fonts.ready.then(measure).catch(() => { });

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  });
}