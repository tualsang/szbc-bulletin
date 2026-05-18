import { toPng } from 'html-to-image';

export async function capturePng(node: HTMLElement): Promise<string> {
  await document.fonts.ready;
  return toPng(node, {
    pixelRatio: 1,
    cacheBust: true,
    quality: 1,
  });
}

export async function saveToPhotos(node: HTMLElement, dateLabel: string) {
  const dataUrl = await capturePng(node);
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], `bulletin-${dateLabel}.png`, { type: 'image/png' });

  // iOS Safari: navigator.share with a file lets the user pick "Save Image" to Photos.
  const nav = navigator as Navigator & {
    canShare?: (data: { files: File[] }) => boolean;
    share?: (data: { files: File[]; title?: string; text?: string }) => Promise<void>;
  };

  if (nav.canShare?.({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], title: `Bulletin ${dateLabel}` });
      return { method: 'share' as const };
    } catch (err) {
      // User cancelled. Don't fall through to download.
      if ((err as DOMException)?.name === 'AbortError') return { method: 'cancelled' as const };
      // Real failure → fall through to download.
    }
  }

  // Desktop / older browsers
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `bulletin-${dateLabel}.png`;
  link.click();
  return { method: 'download' as const };
}
