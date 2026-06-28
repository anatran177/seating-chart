# Tortellini in Love — Seating Finder

An elegant, mobile-first React app that lets luncheon guests type their name and
instantly see which table they are seated at. Built with Vite + React +
TypeScript, Tailwind CSS v4, Framer Motion, and Fuse.js.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## Update the guest list

All guest → table data lives in **`src/data/guests.json`** — there is no backend.
Replace the sample data with the real seating assignments using this schema:

```json
{
  "event": {
    "title": "Tortellini in Love",
    "names": "Ana & Kevin",
    "subtitle": "Saturday, June 27, 2026 · The Garden Pavilion"
  },
  "guests": [
    { "name": "Eleanor Whitmore", "table": 1 }
  ]
}
```

- `name` (required) — the guest's full name as it appears on the invitation.
- `table` (required) — the table number.

Search is fuzzy, case-insensitive, and accent-insensitive, so minor typos still
match. When several guests share a name, the app asks them to pick the right
person rather than guessing.

## Customizing the look

The palette and typography are defined as design tokens in `src/index.css`
(`@theme` block). The base color is `#5F3248` (deep plum) with a harmonious
supporting palette. The floral animated background is in
`src/components/FloralBackground.tsx`.

## Deploy

This is a static site — deploy the contents of `dist/` (output of `npm run
build`) to any static host such as Vercel, Netlify, or GitHub Pages.
