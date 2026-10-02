# 🥗 NutriLens — Web App (v2)

Snap a photo of your meal and get instant calories, macros, micronutrients and healthier swaps — tuned for Indian food.

## What's new in v2
- **Complete redesign** — "fresh market" green & turmeric theme, Plus Jakarta Sans, light/dark/system mode, responsive sidebar (desktop) and floating bottom nav (mobile).
- **Landing page** with product story, and a split-screen sign in / sign up.
- **Scan**: drag-and-drop, paste (Ctrl/⌘+V), camera capture, one-tap sample photos, animated analysis steps, detected/original image toggle, health score, nutrients vs. your goals, AI insights & swaps.
- **Log manually** from the built-in Indian food table (no photo needed).
- **Dashboard**: today's calorie & macro rings, streak, 7-day / 8-week / 6-month trends vs goal, macro split, sugar/sodium watch-list, meal timings and favourite foods — all computed in your local time zone.
- **Food diary**: grouped by day, searchable, full detail view and delete.
- **Settings**: profile + goals synced to the backend, with Mifflin–St Jeor goal suggestions (lose / maintain / gain).
- Stack upgraded to React 19, MUI 7, Recharts 3, React Router 7, Vite 7; route-level code splitting.

## Develop
```bash
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm run dev                 # http://localhost:5173
npm run lint && npm run build
```

## Deploy (Render)
`render.yaml` defines a static site `nutrilens-web-v2` that auto-deploys on every push to `v2-redesign`.
One-time setup: Render Dashboard → **New → Blueprint** → pick this repo and branch → **Apply**.
The site talks to `https://nutrilens-api-v2.onrender.com` (from the backend blueprint); change `VITE_API_URL` if Render gives your API a different URL.
