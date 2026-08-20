# Strategy Shepherds Website — Brand Refresh

Static GitHub Pages-ready website for Strategy Shepherds, built around **Build / Learn / Connect** and the Communications Desk positioning.

## Brand system applied

The site now uses the attached Stella Njogo visual system as its design language while retaining the Strategy Shepherds name:

- Deep Purple `#361965`
- Brand Gold `#C9A84C`
- Near Black `#0D0D0D`
- Off White `#FAF8F4`
- Purple Dark `#261050`
- Purple Mid `#4A2485`
- Purple Pale `#EDE8F5`
- Light Purple Tint `#F0EEF8`
- Playfair Display for display/headline type
- Jost for body/UI copy
- DM Mono for section labels and data-style accents
- Gold rules, purple hero panels, subtle grid/circular geometry and restrained white space

## Pages

- `index.html` — Home
- `build-your-desk.html` — Communications Desk Sprint
- `learn.html` — Modern Communications Desk Lab
- `creator-day.html` — Creator Day Africa
- `ideas.html` — research / thought leadership
- `about.html` — company positioning
- `assessment.html` — 21-question Communications Desk Readiness Assessment
- `privacy.html` — privacy notice draft

## Lead capture

The live Google Apps Script endpoint is already configured in `assets/js/config.js`. No URL edit is needed before upload.

Every commercial CTA uses the shared enquiry form and records its offer/interest and source CTA. The Desk Assessment stores the overall score, maturity stage, seven dimension scores and all 21 responses.

## GitHub Pages

This is a no-build static site. `index.html` must sit at the top level of the publishing source. A `.nojekyll` file is included to keep deployment simple.

Read `UPLOAD-INSTRUCTIONS.md` before replacing the repository contents.

## After deployment

Run one labelled test enquiry and one full Desk Assessment, then confirm both arrive in the existing Strategy Shepherds lead workbook.
