import { RefObject, useLayoutEffect } from 'react';

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
    document.fonts.ready.then(measure).catch(() => {});
  });
}
