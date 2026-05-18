# SZBC Bulletin Generator

Mobile-first PWA-style web app that lets the pastor fill out a form on his iPhone and save a print-ready PNG of the weekly bulletin to his Camera Roll. Built per the spec in `CLAUDE.md` at the repo root (paste it in if you want it on disk).

## Output

A single **3300×2550 PNG** (landscape 11×8.5″ @ 300 DPI). The PNG contains the bulletin **duplicated side-by-side** — printed once on letter paper landscape and cut down the middle yields two identical copies.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + `@tailwindcss/forms`
- Zod for the bulletin schema
- `html-to-image` for the PNG capture
- `lucide-react` icons
- Web Share API → iOS Photos
- `localStorage` for draft auto-save (keyed per Sunday)
- No backend, no database

## Run locally

```bash
# 1. Install deps (pnpm preferred — works with npm/yarn too)
pnpm install      # or: npm install     or: yarn

# 2. Start dev server on localhost
pnpm dev          # http://localhost:5173

# 3. Test from your iPhone on the same Wi-Fi
pnpm dev --host   # prints a LAN URL like http://192.168.1.42:5173
```

> **iOS share-sheet caveat.** The Web Share API for files requires HTTPS. `localhost` works on desktop, but on a phone over LAN you need HTTPS. Install [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert) if you want to test the full save-to-Photos flow from your phone during development. Otherwise the app falls back to a plain download, which on iOS lands in the Files app.

```bash
pnpm build        # production build into ./dist
pnpm preview      # serve ./dist locally to sanity-check
```

## Deploy to Vercel (free tier is plenty)

You have two paths. Pick one.

### A) GitHub → Vercel (recommended, gives you auto-deploys on every push)

1. Create a new GitHub repo (e.g. `szbc-bulletin`).
2. Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin git@github.com:<you>/szbc-bulletin.git
   git push -u origin main
   ```
3. Go to <https://vercel.com/new>, sign in with GitHub, click **Import** on the repo.
4. Vercel auto-detects **Vite**. Leave the defaults:
   - Framework Preset: **Vite**
   - Build Command: `pnpm build` (or `npm run build`)
   - Output Directory: `dist`
   - Install Command: `pnpm install` (or `npm install`)
5. Click **Deploy**. ~30 seconds later you'll get a URL like `https://szbc-bulletin.vercel.app`.
6. Every `git push` to `main` redeploys automatically. Pull requests get preview URLs.

### B) Vercel CLI (no GitHub needed)

```bash
npm i -g vercel
cd szbc-bulletin
vercel              # first run links the project — answer prompts, accept defaults
vercel --prod       # ship to production
```

That's it. The included `vercel.json` is mostly belt-and-suspenders; Vercel would pick up Vite without it.

### Custom domain (optional)

In the Vercel dashboard → your project → **Settings → Domains** → add e.g. `bulletin.shalomzomi.org`. Vercel walks you through the DNS record. HTTPS is automatic. You need HTTPS for the iOS save-to-Photos flow to work, and Vercel gives you that for free.

## How the pastor uses it

1. Open the deployed URL on his iPhone, **Add to Home Screen** so it launches like an app.
2. Fill the form. Drafts auto-save per Sunday date.
3. Tap **Preview** to eyeball it.
4. Tap **Save bulletin PNG**. iOS share sheet opens → tap **Save Image** → done, it's in Photos.
5. Print Photos → choose **Letter, Landscape**, scale to fit. Cut down the middle.

## File structure

```
szbc-bulletin/
├── index.html                          Google Fonts link tag lives here
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                        Entry
    ├── App.tsx                         Screen routing, save flow, hidden print render
    ├── index.css                       Tailwind directives + font aliases
    ├── lib/
    │   ├── schema.ts                   Zod Bulletin schema + factories
    │   ├── constants.ts                CHURCH_INFO, COMMUNION_GROUPS
    │   ├── date.ts                     addDays, getUpcomingSunday, formatDate, dayName
    │   ├── money.ts                    formatMoney
    │   ├── storage.ts                  localStorage draft helpers
    │   ├── export.ts                   capturePng + saveToPhotos with Web Share fallback
    │   └── fit-content.ts              useFitContent hook for overflow handling
    └── components/
        ├── BulletinForm.tsx            The form
        ├── BulletinPreview.tsx         Scaled preview wrapper
        ├── PrintRender.tsx             3300×2550 render — two halves side-by-side
        ├── ProgramSectionEditor.tsx    Reused for Today + Next Week Sunday
        └── ui/
            ├── CurrencyInput.tsx
            ├── Toggle.tsx
            ├── DateInput.tsx
            ├── ProgramRow.tsx
            ├── NekkhawmRow.tsx
            └── CollapsibleSection.tsx
```

## Fonts

This project loads **Bebas Neue**, **Lora** (italic), and **Manrope** from Google Fonts via the `<link>` tag in `index.html`. Google Fonts is allowed by Vercel's egress.

If you want fully self-hosted woff2 for offline-perfect print fidelity (the spec calls for it), download the families from <https://fonts.google.com>, drop the woff2 files in `public/fonts/`, and replace the `<link>` block in `index.html` with `@font-face` rules in `src/index.css`. The print code already references the family names `'Bebas Neue'`, `'Lora'`, and `'Manrope'`, so nothing else needs to change.

## What this repo is NOT

No backend, no database, no auth, no Next.js. If requirements force a backend, that's a separate project.
