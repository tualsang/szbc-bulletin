import { toPng } from 'html-to-image';

export async function capturePng(node: HTMLElement): Promise<string> {
  await document.fonts.ready;
  return toPng(node, {
    pixelRatio: 1,
    cacheBust: true,
    quality: 1,
  });
}

export async function saveToPhotos(
  node: HTMLElement,
  dateLabel: string,
  suffix = ''
) {
  const dataUrl = await capturePng(node);
  const blob = await (await fetch(dataUrl)).blob();
  const filename = `bulletin-${dateLabel}${suffix ? `-${suffix}` : ''}.png`;
  const file = new File([blob], filename, { type: 'image/png' });

  const nav = navigator as Navigator & {
    canShare?: (data: { files: File[] }) => boolean;
    share?: (data: { files: File[]; title?: string; text?: string }) => Promise<void>;
  };

  if (nav.canShare?.({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], title: filename });
      return { method: 'share' as const };
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return { method: 'cancelled' as const };
    }
  }

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
  return { method: 'download' as const };
}