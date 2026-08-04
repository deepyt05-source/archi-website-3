# Design QA - Annotation Pass 5

## Source visual truth and implementation

- Source visual truth: the annotated 875 x 822 browser screenshot supplied in this request, especially the `EXPLORE TREATMENTS` CTA and the existing nav-pill transformation language.
- Browser-rendered implementation: http://localhost:5173/
- Default implementation capture: `qa/round5-cta-default.png`.
- Hover/focus implementation capture: `qa/round5-cta-hover.png`.
- Same-state focused comparison: `qa/round5-comparison-cta.jpg`.

## Viewport, dimensions, and state

- CSS viewport: 875 x 822 at 1x density.
- Browser content screenshots: 860 x 811 px after the browser scrollbar.
- Focused comparison: 600 x 180 px, using identical 262 x 140 crops from the default and hover/focus captures without stretching.
- States reviewed: default ivory CTA pill, collapsed arrow-circle hover/focus treatment, label contrast, arrow alignment, and card layout at the annotated desktop width.
- Primary interaction behavior checked: all three buttons share the same `CtaLink` component; hover and `:focus-visible` share the same transformation; magnetic movement is reduced to 25% of the site's standard link response; touch movement remains disabled; global reduced-motion handling remains active.
- Console/runtime check: no visible browser error overlay or failed React render.

## Full-view and focused-region comparison

- The full card composition, typography, image crop, and spacing remain unchanged from the approved layout.
- The focused comparison shows the full ivory pill collapsing into a precise 38 x 38 ivory circle around the arrow while the label turns ivory directly on the forest card.
- The original pill border becomes transparent during hover/focus, preventing a ghost outline from remaining after the surface collapses.
- The arrow keeps its established Phosphor icon and receives only a 1 px horizontal adjustment; the earlier rotation and larger magnetic movement were removed.

## Required fidelity surfaces

- Fonts and typography: the compact monospaced CTA label retains its size, weight, tracking, and uppercase treatment; only its interaction-state color changes.
- Spacing and layout rhythm: the CTA remains 214 x 47 in layout, so the card does not shift. The animated surface alone contracts to the arrow.
- Colors and visual tokens: default ivory and forest tokens are preserved. Hover/focus uses ivory label text and an ivory arrow circle against the forest card.
- Image quality and asset fidelity: card photography and crop are unchanged.
- Copy and content: all three existing CTA labels and destinations are unchanged.
- Icons and accessibility: the existing Phosphor arrow remains aligned, keyboard focus receives the same state as hover, and reduced-motion preferences collapse transition durations globally.

## Findings and comparison history

- Iteration 1 - P2: the first implementation collapsed the fill but left the full pill border visible, creating a ghost outline. Fix: make the CTA border transparent during hover/focus. Post-fix evidence: `qa/round5-comparison-cta.jpg`.
- Iteration 1 - P2: the first collapsed surface measured 39 x 37 rather than a true circle. Fix: adjusted the animated insets to render an exact 38 x 38 circle centered behind the arrow. Post-fix browser measurement: 38 x 38 px.
- Iteration 1 - P2: the existing arrow rotated and the whole button used the standard magnetic strength, making the interaction feel bouncy. Fix: removed rotation, limited arrow travel to 1 px, changed the transform timing to `ease-out`, and reduced CTA magnetic strength to 25%.
- Remaining P0 findings: none.
- Remaining P1 findings: none.
- Remaining P2 findings: none.

final result: passed
