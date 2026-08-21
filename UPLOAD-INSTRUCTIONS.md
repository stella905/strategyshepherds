# Strategy Shepherds website upload instructions

This package is ready for a static GitHub Pages site.

## Upload structure

Unzip the package on your computer. Upload the contents of the folder, not the folder itself. The repository root should immediately contain `index.html`, `ai-ready-teams.html`, `build-your-desk.html`, `assessment.html`, `ai-ready-assessment.html`, `desk-assessment.html`, the `assets` folder, and the other pages.

Do not place these files inside another folder in the repository. GitHub Pages needs `index.html` at the publishing root.

## GitHub Pages

In the repository open Settings, then Pages. Under Build and deployment choose Deploy from a branch, select `main`, select the root folder, then save. Reconnect the custom domain in the same Pages settings if it is not already present.

## Lead system

This update changes website copy only. The existing Google Apps Script endpoint, assessment logic, Google Sheet routing and email notification workflow have not been changed. You do not need a new Apps Script deployment for this mission and vision update if the current lead system is already working.

## Final smoke test

After the site is live, open the homepage and About page to confirm the new mission and vision sections are visible. Then submit one test enquiry or assessment to confirm the existing lead workflow is still operating normally.

## Protect your custom domain file

If GitHub Pages creates a `CNAME` file after you reconnect your custom domain, keep that file in the repository during future website updates. Do not delete it when replacing site files.
