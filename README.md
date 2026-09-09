# DEVART portfolio

A software engineer portfolio for Art Kelmendi. React and TypeScript on Vinext/Sites, with authored CSS and a dependency-free Canvas 2D binary environment.

## Run

Use Node 22.13 or newer. Run `npm install`, then `npm run dev -- --host 0.0.0.0 --port 5173`.

## Validate

Run `npx tsc --noEmit` and `npm run build`. The build emits a Cloudflare-compatible Worker and public client assets in `dist/`.

## Edit

- `app/page.tsx`: home sections, navigation, skills and contact.
- `app/globals.css`: typography, layout and responsive design.
- `components/BinaryField.tsx`: deterministic glyph environment, parallax, scroll and motion preferences.
- `lib/projects.ts`: verified project content and links.
- `app/work/[slug]/page.tsx`: case studies and metadata.
- `DESIGN.md`: design decisions and visual system.

Contact uses info@devart.com and a copy-address control. No form service or fabricated submission state is used. Case studies link to real websites and public source where available. Images and fonts are local.

Motion respects system preferences, pauses in hidden tabs, and can be paused by the visitor. Touch skips pointer parallax and uses a lower rendering budget. Native scrolling is retained.
