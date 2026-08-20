# Strategy Shepherds Website

Static HTML/CSS/JavaScript website for Strategy Shepherds.

## Current commercial offers

1. **AI Training for Communications Teams** — practical AI literacy and applied AI training for internal and external communications.
2. **Communications Desk Sprint** — installs the operating system behind a modern communications function.
3. **Creator Day Africa** — connects organisations and creators through access-led storytelling experiences.

The Communications Desk Readiness Assessment remains the diagnostic lead-generation tool.

## Deployment

See `UPLOAD-INSTRUCTIONS.md`.

## Lead collection

Website forms post to the existing Google Apps Script Web App endpoint configured in `assets/js/config.js`. The backend writes to the existing Strategy Shepherds lead spreadsheet. Email notifications are handled in Apps Script and are not part of the public GitHub files.
