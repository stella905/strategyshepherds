# Strategy Shepherds Website v1

A static, deployable website for the new Strategy Shepherds positioning: **Build / Learn / Connect**, with the Communications Desk as the core category.

## What is included

- `index.html` — Home
- `build-your-desk.html` — Communications Desk Sprint
- `learn.html` — Modern Communications Desk Lab
- `creator-day.html` — Creator Day Africa
- `ideas.html` — research / thought leadership
- `about.html` — company positioning
- `assessment.html` — 21-question Communications Desk Readiness Assessment
- `privacy.html` — launch-ready draft privacy notice (review before public launch)
- `assets/css/styles.css` — responsive site design
- `assets/js/site.js` — navigation, universal lead modal, UTM capture, submissions
- `assets/js/assessment.js` — quiz questions, scoring and personalised result logic
- `assets/js/config.js` — one-line form endpoint configuration
- `backend/Code.gs` — Google Apps Script endpoint that writes into the existing Strategy Shepherds lead spreadsheet

## Lead system already prepared

The Apps Script is configured for the existing Google Sheet:

**Strategy Shepherds Website Leads**

Spreadsheet ID:
`1pJdqgsJARzrB1J3H-Ru_59jSX3W51pAqQEKhX74NEJc`

Two new tabs have been added to the live workbook:

1. `Website Leads` — all enquiries and CTA conversions
2. `Desk Readiness Responses` — detailed assessment scores and answers

The older `Quiz Leads` and `Voice to Leads Quiz` tabs are left untouched.

## Google Apps Script connection

The website is already configured to submit to this deployed Google Apps Script Web App:

`https://script.google.com/macros/s/AKfycbzBuylzJJaCnk_HN76z1J_n6MhCjEdV-XVCl8_8LIq3ulZq8t5fV02Tldor9HS-lv44/exec`

The endpoint is set in `assets/js/config.js`; **no further URL edit is required before upload**.

The Apps Script should be deployed with:

- **Execute as:** Me
- **Who has access:** Anyone (for a public website)

If the Apps Script code is changed later, update the deployed version in Google Apps Script. If Google generates a different `/exec` URL, update `assets/js/config.js` accordingly.

## How lead capture works

Every commercial CTA opens the same lead form and automatically records:

- offer / interest
- CTA clicked
- source page
- lead type (Organisation / Professional / Creator / Other)
- thematic area
- name, email and optional phone
- organisation and role
- website / LinkedIn
- message / need
- UTM source, medium and campaign
- optional marketing-update consent
- new-lead status
- raw payload for debugging / future migration

The Desk Assessment also stores:

- overall score
- Desk maturity stage
- seven dimension scores
- strongest capability
- priority gap
- recommended next step
- all 21 question responses

## Quiz scoring

Each of the 21 questions is scored 1–5. Scores are normalised to 0–100.

Stages:

- 0–39: Reactive Desk
- 40–59: Developing Desk
- 60–74: Structured Desk
- 75–89: Strategic Desk
- 90–100: Compounding Desk

Dimensions:

1. Strategy
2. Intelligence
3. Evidence
4. AI Capability
5. Human Networks
6. Distribution
7. Learning

## Deployment

The site is plain HTML/CSS/JS, so it can be deployed on Netlify, Vercel, GitHub Pages, Cloudflare Pages, cPanel or most ordinary web hosts without a build step.

For local preview:

```bash
cd strategy-shepherds-site
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Before public launch

- The `/exec` URL is already present in `config.js`.
- After uploading to the public host, submit one clearly labelled live test enquiry and one complete assessment; confirm both appear in the Google Sheet.
- Replace/add the final Strategy Shepherds logo if desired; the current header uses a clean text wordmark.
- Add real event dates/prices when the first Modern Communications Desk Lab cohort is confirmed.
- Add formal contact details and review the privacy notice for the jurisdictions/tools used.
- Connect analytics only if/when desired; UTM collection already works without an analytics platform.
