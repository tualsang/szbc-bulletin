import { useEffect, useRef, useState } from 'react';
import { Check, Download, FileText, Eye, AlertTriangle, RotateCcw } from 'lucide-react';
import { Bulletin, defaultBulletin } from './lib/schema';
import { getUpcomingSunday, formatDate } from './lib/date';
import { storage } from './lib/storage';
import { saveToPhotos } from './lib/export';
import { BulletinForm } from './components/BulletinForm';
import { BulletinPreview } from './components/BulletinPreview';
import { PrintRender } from './components/PrintRender';

type Screen = 'form' | 'preview';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function App() {
  const [screen, setScreen] = useState<Screen>('form');
  const [bulletin, setBulletin] = useState<Bulletin>(() => {
    const upcoming = getUpcomingSunday();
    return storage.load(upcoming) ?? defaultBulletin(upcoming);
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Auto-save (debounced 500ms)
  useEffect(() => {
    setSaveStatus('saving');
    const t = window.setTimeout(() => {
      const ok = storage.save(bulletin);
      setSaveStatus(ok ? 'saved' : 'error');
    }, 500);
    return () => window.clearTimeout(t);
  }, [bulletin]);

  // If the user changes the date, try to load a draft for that date
  const handleBulletinChange = (next: Bulletin) => {
    if (next.date !== bulletin.date) {
      const found = storage.load(next.date);
      setBulletin(found ?? next);
    } else {
      setBulletin(next);
    }
  };

  const onSave = async () => {
    if (!printRef.current) return;
    setExporting(true);
    setExportError(null);
    try {
      await saveToPhotos(printRef.current, bulletin.date);
    } catch (err) {
      console.error(err);
      setExportError(
        err instanceof Error ? err.message : 'Could not save image. Try again.'
      );
    } finally {
      setExporting(false);
    }
  };

  const onReset = () => {
    if (!confirm('Clear this Sunday\'s draft and start over?')) return;
    storage.clear(bulletin.date);
    setBulletin(defaultBulletin(bulletin.date));
  };

  return (
    <div className="min-h-dvh bg-stone-100 text-stone-900">
      {/* Top bar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-display text-lg">
              S
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">SZBC Bulletin</div>
              <div className="text-xs text-stone-500 leading-tight">
                {formatDate(bulletin.date)}
              </div>
            </div>
          </div>
          <SaveBadge status={saveStatus} />
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          <TabButton active={screen === 'form'} onClick={() => setScreen('form')}>
            <FileText size={16} /> Edit
          </TabButton>
          <TabButton active={screen === 'preview'} onClick={() => setScreen('preview')}>
            <Eye size={16} /> Preview
          </TabButton>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 pb-32">
        {screen === 'form' ? (
          <BulletinForm value={bulletin} onChange={handleBulletinChange} />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-stone-600">
              This is one half. The saved PNG contains{' '}
              <span className="font-semibold">two identical halves side-by-side</span>{' '}
              (11×8.5″ landscape). Print, then cut down the middle for two copies.
            </p>
            <BulletinPreview bulletin={bulletin} />
          </div>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800"
          >
            <RotateCcw size={14} /> Reset this Sunday
          </button>
        </div>
      </main>

      {/* Bottom save bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-stone-200 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto">
          {exportError && (
            <div className="mb-2 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertTriangle size={16} /> {exportError}
            </div>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={exporting}
            className="w-full h-14 rounded-2xl bg-stone-900 text-white text-base font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {exporting ? (
              <>
                <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Preparing image…
              </>
            ) : (
              <>
                <Download size={18} /> Save bulletin PNG
              </>
            )}
          </button>
          <p className="text-[11px] text-stone-500 text-center mt-2">
            On iPhone: choose <span className="font-semibold">Save Image</span> from the
            share sheet to send it to Photos.
          </p>
        </div>
      </div>

      {/* Hidden print render — captured by html-to-image */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <PrintRender ref={printRef} bulletin={bulletin} />
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-stone-900 text-white'
          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
      }`}
    >
      {children}
    </button>
  );
}

function SaveBadge({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;
  if (status === 'saving') {
    return (
      <span className="text-xs text-stone-500 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-pulse" /> Saving…
      </span>
    );
  }
  if (status === 'saved') {
    return (
      <span className="text-xs text-emerald-700 flex items-center gap-1.5">
        <Check size={12} /> Auto-saved
      </span>
    );
  }
  return (
    <span className="text-xs text-red-700 flex items-center gap-1.5">
      <AlertTriangle size={12} /> Save failed
    </span>
  );
}
