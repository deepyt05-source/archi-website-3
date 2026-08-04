# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable design decisions

- Match the editorial visual language of joseocando.com: muted ivory and forest palette, large serif display type, compact monospaced labels, rounded pill navigation, and restrained motion.
- The home page must feature massive alternating split-image cards during scroll; this is a defining design requirement.
- Keep Home and About as real routes. Treatments, Location, and Contact are sections on Home. Do not include Blog or a Blog placeholder until requested later.
- Use “Archi Patel, PA-C” where certification is appropriate and “Physician Associate” as the professional title.
- Generated photography is placeholder content and must remain easy to replace from `public/images/`.
- Align the desktop navigation pill to the home hero's 920px content width; keep the full-width treatment for the massive care cards only.
- Massive-card photography should use restrained, non-touch cursor parallax and respect reduced-motion preferences.
- Massive-card CTAs should morph their full ivory pill into an ivory arrow circle on hover/focus, with restrained magnetic movement and no bouncy rotation.
