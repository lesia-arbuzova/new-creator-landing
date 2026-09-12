# Design QA - NEW CREATOR

Date: 2026-09-12

## Visual truth

- Approved desktop reference: `../перший_слайд.png` - 1887 x 1061 px
- Approved clean background: `../перший_слайд_без_тексту.png` - 1887 x 1061 px
- Desktop implementation capture: `hero-desktop-qa.png` - 1887 x 1061 px
- Mobile implementation capture: `hero-mobile-qa.png` - Pixel 5 viewport
- Side-by-side comparison: `hero-comparison-qa.png`
- State: Ukrainian route, hero at initial page position, animated text accents frozen by the automated QA setup where required

## Full-view comparison

- Desktop hero uses the approved full 16:9 image at `100% auto`; the image is not cover-cropped.
- Rita's head, hair, arm and shoes are visible, with the approved gap above the head.
- Header, headline, handwritten accents, CTAs, start row and statistics follow the approved left-to-right composition.
- The original raster NEW CREATOR logo is preserved.
- The mobile layout keeps the original raster logo readable on a light sticky header and presents the full hero image as a separate uncropped 16:9 block.

## Focused-region comparison

- Statistics: `2`, `10`, `10` and `ПОРТФОЛІО` share one top alignment. The third label is exactly `AI-ІНСТРУМЕНТІВ`.
- CTA hierarchy: red primary action and blue outlined secondary action remain intact.
- Full-frame media: no cropping of the subject at desktop or mobile breakpoints.
- Showreel: the first video opens in the fullscreen dialog with native video controls.

## Issue and fix history

- P1: desktop hero previously separated the header from the visual and cropped the approved background. Fixed with the approved 16:9 absolute composition and `background-size: 100% auto`.
- P1: GitHub Pages media and internal links previously used root-relative paths. Fixed by prefixing assets and locale routes with the repository base path.
- P2: the third statistic number was vertically misaligned. Fixed by using a consistent definition-list structure and column direction for all statistic items.
- P2: the prepayment note failed WCAG AA contrast. Fixed by increasing the text opacity without changing layout.
- P2: the mobile header placed the black raster logo on a blue field and used the uncropped transparent canvas. Fixed with a light header and CSS clipping around the original raster asset.

## Final result

PASS - no remaining actionable P0, P1 or P2 issues found in the hero comparison, responsive checks, accessibility scan or showreel interaction check.

