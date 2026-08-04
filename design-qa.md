# Design QA - Annotation Pass 4

## Source visual truth and implementation

- Source visual truth: https://www.joseocando.com/, the three annotated screenshots supplied for this pass, and `qa/reference-desktop-top.png`, `qa/reference-desktop-feature.png`, and `qa/reference-mobile-top.png`.
- Browser-rendered implementation: http://localhost:5173/
- Implementation captures: `qa/round4-desktop-top.png`, `qa/round4-desktop-card.png`, and `qa/round4-mobile-top.png`.
- Side-by-side comparison evidence: `qa/round4-comparison-desktop-top.jpg`, `qa/round4-comparison-desktop-card.jpg`, and `qa/round4-comparison-mobile-top.jpg`.

## Viewports, dimensions, and states

- Desktop CSS viewport: 1076 x 822; browser content capture: 1061 x 811 px at 1x density.
- Mobile CSS viewport: 390 x 844; browser content capture: 375 x 812 px at 1x density.
- Source desktop captures: 1265 x 712 px. Source and implementation were proportionally contained into equal 620 x 520 panels without stretching.
- Source mobile capture: 375 x 812 px. Source and implementation were proportionally contained into equal 390 x 880 panels without stretching.
- States reviewed: desktop hero/navigation, massive-card default and scroll-revealed states, responsive mobile hero/navigation, and horizontal-overflow resilience.
- Primary interactions checked: nav target sizing logic (label width plus 16 px on each side), pointer-following image transform bounds, touch guard, pointer-leave reset, and reduced-motion guard.
- Console/runtime check: no visible browser error overlay or failed React render; TypeScript, production build, and Sites worker tests are recorded below.

## Full-view and focused-region comparison

- Full-view desktop: the navigation pill now shares the hero's exact 920 px width and matching 70.5 px left/right edges at the annotated viewport. The hero remains intentionally contained while the care cards remain full-canvas.
- Focused navigation: the moving gray highlight retains the approved pill behavior and now uses 16 px of horizontal allowance on each side of the hovered label.
- Focused care card: photography remains clipped to its rounded half-card frame with no copy overlap. The image now has restrained pointer parallax (maximum about 14 px horizontal, 10 px vertical, and 0.35 degrees rotation) plus a 1.035 hover scale.
- Mobile: the 343 px navigation and 329 px hero fit the 375 px content area with zero horizontal overflow. Pointer parallax is disabled for touch input.

## Required fidelity surfaces

- Fonts and typography: the editorial serif display hierarchy, compact monospaced labels, weights, wrapping, and line lengths remain consistent with the source direction.
- Spacing and layout rhythm: the desktop nav and hero align at exactly 920 px; the care card retains its deliberately larger canvas and balanced split proportions.
- Colors and visual tokens: muted ivory, soft gray, forest, and ink tokens are unchanged. The hover surface remains the only gray nav layer.
- Image quality and asset fidelity: generated placeholder photography remains sharp and correctly cropped. The new transform uses a slightly oversized image surface so movement never reveals empty edges.
- Copy and content: no user-supplied content changed in this pass.
- Icons: the approved thin Phosphor home icon remains unchanged and unframed.
- Accessibility and behavior: semantic links remain keyboard focusable; pointer motion resets on leave, ignores touch, and respects `prefers-reduced-motion`.

## Findings and comparison history

- Iteration 1 - P2: the nav pill extended substantially beyond the hero. Fix: centered a `min(920px, 100%)` nav inside a 24 px safe-area shell. Post-fix measurement: nav and hero are both 920 px wide with identical edges. Evidence: `qa/round4-comparison-desktop-top.jpg`.
- Iteration 1 - P2: the moving hover surface needed more breathing room around the label. Fix: increased the measured allowance from 10 px to 16 px per side without returning to the oversized equal-grid-cell highlight.
- Iteration 1 - P2: massive-card photography had scroll reveal but no cursor response. Fix: added restrained pointer-position translation/rotation, hover scale, leave reset, touch exclusion, and reduced-motion fallback. Post-fix card evidence: `qa/round4-comparison-desktop-card.jpg`.
- Iteration 2: the first desktop geometry check exposed a 15 px scrollbar mismatch (905 px nav vs 920 px hero). Fix: replaced viewport-unit padding math with a centered fixed-width nav container. Post-fix browser measurement is an exact 920 px match.
- Remaining P0 findings: none.
- Remaining P1 findings: none.
- Remaining P2 findings: none.
- P3 observation: the source site's proprietary display font is not redistributed; the implementation keeps the established editorial serif fallback stack.

final result: passed
