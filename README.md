# SZBC Bulletin Generator

A mobile and iPad web app that generates the weekly bulletin for Shalom Zomi Baptist Church. Built for the pastor: fill out a form on the phone or iPad, tap save, get a print-ready PNG in the Photos app.

## How it works

**One form, one save.** The pastor opens the app, fills in this Sunday's program, the offering totals, and next week's Saturday and Sunday services. A draft auto-saves to the device per Sunday date — close the tab, come back later, the form is exactly where it was left.

**Two copies per page.** Tap *Save bulletin PNG* and the app generates a 3300×2550 image (11×8.5″ landscape at 300 DPI) containing the bulletin duplicated side-by-side. On iPhone and iPad the share sheet opens automatically — choose *Save Image* and it lands in Photos. Print landscape on letter paper, cut down the middle, two identical bulletins.

**Layout adapts to the week.** Today's Program grows or shrinks to fill the available vertical space — light weeks get bigger, comfortable type; communion weeks with a Nekkhawm row stay readable without anyone manually tuning a font size. The next-week section is a fixed two-column grid (Saturday left, Sunday right) so the order never drifts.

**Permanent things stay permanent.** The church name, verse, address, Zelle emails, and pastor/president/secretary contacts are baked into the code. They render on every bulletin and the pastor can't accidentally edit them from the form. Updating them is a code change and redeploy.

**What the pastor can do per week**

- Set the Sunday date — Saturday and next-Sunday dates derive automatically.
- Override the date with a label like "Resurrection Sunday" or "Christmas Sunday" for special weeks.
- Build Today's Program from any number of label/value rows. Drag the grip handle to reorder.
- Mark a row as containing multiple names — type each on its own line and the second and third lines hang-indent under the first.
- Enable Communion (Nekkhawm) with a toggle. Group 1 or Group 2 names auto-populate from the constants; the six deacons render in a 3×2 grid, one name per cell.
- Enter Sehsuah and Citpiak totals — formatted as USD currency on the bulletin.
- Build the next-week Saturday rows (Amun, Ahun, LST, etc.) with a subtitle like "Saturday Thunget".
- Add a Saturday Night Service block with a service-type dropdown for Nupi Hun or Khangno Hun, plus Chairperson and Sermon rows.
- Build the next-week Sunday rows the same way as today, with optional Communion.

## Tech stack

- **Vite + React 18 + TypeScript** — the whole app is static; no backend, no database, no auth, no API.
- **Tailwind CSS** for the form UI.
- **Zod** validates the bulletin shape on every load from storage, so a schema change can't silently corrupt the form.
- **html-to-image** captures the print-resolution render to PNG at 1:1 pixel ratio.
- **@dnd-kit** powers the drag-to-reorder handles, with touch-friendly activation distance so taps and scrolls aren't hijacked on iPad.
- **Web Share API** for the save-to-Photos flow on iOS; falls back to a direct download elsewhere.
- **lucide-react** icons.
- **localStorage** for per-Sunday draft auto-save, keyed by a schema version so old drafts orphan cleanly when the data shape changes.
- **Google Fonts** — Bebas Neue for the church name, Lora italic for the verse and section titles, Manrope for body type.
- **Vercel** hosts the static build on the free tier.

## What it's not

Not a CMS. Not multi-tenant. No accounts, no roles, no sync between devices. One pastor, one device at a time, drafts live in the browser. If those constraints ever stop being true, it's a different project.