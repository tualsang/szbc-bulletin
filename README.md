# SZBC Bulletin Generator

Mobile/iPad-first web app that lets the pastor fill out a form and save a print-ready PNG of the weekly bulletin to his Camera Roll. Output: **3300×2550 PNG**, landscape 11×8.5″ @ 300 DPI, with two identical halves side-by-side — print landscape on letter paper, cut down the middle, get two copies.

## Stack

Vite + React 18 + TypeScript • Tailwind CSS • Zod • `html-to-image` • `lucide-react` • Web Share API → iOS Photos • `localStorage` for auto-save • Vercel static. No backend, no DB.

## Run locally

```bash
pnpm install            # or npm install / yarn
pnpm dev                # http://localhost:5173
pnpm dev --host         # LAN URL for iPhone/iPad testing
pnpm build && pnpm preview
```

> The iOS save-to-Photos flow needs HTTPS. `localhost` is fine on desktop; for phone-over-LAN, add [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert).

## Clearing the cache / draft

Three ways:

1. **DevTools** — `localStorage.clear(); location.reload();`
2. **URL flag** — visit `https://your-url/?reset=1` (handy to send the pastor remotely)
3. **Schema bump** — every time you change `src/lib/schema.ts`, bump `SCHEMA_VERSION` in `src/lib/storage.ts`. Old drafts are orphaned, the form resets to defaults. Current version: **2**.

## Deploy to Vercel

### A) GitHub → Vercel (auto-deploys on push)

```bash
git init && git add . && git commit -m "initial"
git branch -M main
git remote add origin git@github.com:<you>/szbc-bulletin.git
git push -u origin main
```

Then <https://vercel.com/new> → import the repo → accept the auto-detected Vite settings → Deploy. Every push to `main` redeploys; PRs get preview URLs.

### B) Vercel CLI

```bash
npm i -g vercel
cd szbc-bulletin
vercel        # first run links the project
vercel --prod # production
```

For a custom domain (`bulletin.shalomzomi.org` etc.): dashboard → project → Settings → Domains. HTTPS is automatic.

## File structure

```
szbc-bulletin/
├── index.html
├── package.json
├── vite.config.ts, tsconfig.json, tsconfig.node.json
├── tailwind.config.js, postcss.config.js
├── vercel.json
├── public/favicon.svg
└── src/
    ├── main.tsx                        Entry + iOS focus scroll fix
    ├── App.tsx                         Screen routing, save flow, ?reset=1 handler
    ├── index.css                       Tailwind + iOS quirks
    ├── lib/
    │   ├── schema.ts                   Zod (Bulletin, dateOverride, serviceType)
    │   ├── constants.ts                CHURCH_INFO, COMMUNION_GROUPS
    │   ├── date.ts                     formatDateShort = "17 May 2026"
    │   ├── money.ts
    │   ├── storage.ts                  SCHEMA_VERSION + load/save/clear/clearAll
    │   ├── export.ts                   capturePng + saveToPhotos
    │   └── fit-content.ts              Auto-shrink hook
    └── components/
        ├── BulletinForm.tsx
        ├── BulletinPreview.tsx
        ├── PrintRender.tsx             3300×2550 — two halves side-by-side
        ├── ProgramSectionEditor.tsx
        └── ui/
            ├── CurrencyInput.tsx
            ├── Toggle.tsx
            ├── DateInput.tsx
            ├── ProgramRow.tsx
            ├── NekkhawmRow.tsx
            └── CollapsibleSection.tsx
```

## What's in this build

Tracking what's been built vs. what the spec calls "future":

- **Header override** — `dateOverride` field; type "Resurrection Sunday" and it replaces the date at the top of the bulletin
- **Saturday Night Service** — service-type dropdown (Nupi Hun / Khangno Hun / —None—) appears above Chairperson, on the bulletin shown italic below the section header
- **Hanging indent for multi-line values** — type Lasakna with three singers on separate lines; the second/third lines align with the first one (not under the label)
- **Trailing colons stripped** — type "Hunuk" or "Hunuk:" — both render as `Hunuk:`
- **Mobile/iPad** — wider containers on bigger screens, two-col field pairs on iPad, off-screen render so the hidden print canvas can't cause scroll glitches, focus auto-scroll above the keyboard, double-tap-zoom disabled on buttons

## Not yet (per CLAUDE.md "future ideas")

Print history, two-col Today's Program, QR code, reorderable rows, label suggestions, PDF export, multi-day holiday weeks (the Wed/Thu/Fri/Sat/Sun layout in your December reference).
