# Strategy Shepherds website upload instructions

This package is ready for a static GitHub Pages site.

## Upload structure

Unzip the package on your computer. Upload the contents of the folder, not the folder itself. The repository root should immediately contain `index.html`, `ai-ready-teams.html`, `build-your-desk.html`, `assessment.html`, `ai-ready-assessment.html`, `desk-assessment.html`, the `assets` folder, and the other pages.

Do not place these files inside another folder in the repository. GitHub Pages needs `index.html` at the publishing root.

## GitHub Pages

In the repository open Settings, then Pages. Under Build and deployment choose Deploy from a branch, select `main`, select the root folder, then save. Reconnect the custom domain in the same Pages settings if it is not already present.

## App Script

The website already points to the existing Google Apps Script deployment URL. Replace the Apps Script code separately using the `Code.gs` file provided with this build, then create a new version of the existing deployment. Do not upload `Code.gs` to the public GitHub repository.

## Final smoke test

After the site is live, submit a general enquiry, complete the AI Ready Teams Assessment, and complete the Communications Desk Assessment. Confirm that each submission creates the correct row in the Strategy Shepherds lead workbook and that an email notification arrives at `stella@stellanjogo.com`.

## Protect your custom domain file

If GitHub Pages creates a `CNAME` file after you reconnect your custom domain, keep that file in the repository during future website updates. Do not delete it when replacing site files.
