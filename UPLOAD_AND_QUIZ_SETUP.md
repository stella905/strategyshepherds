# Strategy Shepherds website update

## Upload the website

Upload the files inside the website package to the root of the GitHub Pages
repository. Keep `CNAME`, `form-config.js`, `styles.css`, `script.js`, all HTML
pages and the discovery files (`robots.txt`, `sitemap.xml`, `llms.txt` and
`site.webmanifest`).

The new public pages are:

- `visibility-quiz.html`
- `visible-expert-masterclass.html`

## Add the Visibility Quiz response tab

1. Open the existing Strategy Shepherds response spreadsheet.
2. Add a tab named exactly `Visibility Quiz`.
3. Open `visibility-quiz-sheet-headers.csv`.
4. Copy its first row and paste it into cell A1 of the new tab.
5. Freeze row 1.

## Update the existing Apps Script receiver

1. In the response spreadsheet, open **Extensions → Apps Script**.
2. Replace the current receiver code with the complete updated
   `apps-script/FormReceiver.gs`.
3. Save.
4. Open **Deploy → Manage deployments**.
5. Edit the existing web-app deployment.
6. Select **New version**, then deploy.

The `/exec` URL does not change, so `form-config.js` does not need a new URL.

## AppSheet

Check **Project Settings → Script Properties** in Apps Script.

- If `DATA_MODE` is `SHEETS`, no AppSheet change is required. The website
  receiver writes directly to the new Google Sheet tab.
- If `DATA_MODE` is `APPSHEET`, open the existing AppSheet app, add the
  `Visibility Quiz` worksheet as one new table, set `Submission ID` as its key,
  and regenerate the table’s columns. Reuse the existing app, App ID and access
  key.

Do not create a second AppSheet app or reconnect the website.

## Test before promotion

1. Open `visibility-quiz.html` on the live site.
2. Submit a clearly labelled test.
3. Confirm the result page shows a profile, priority dimension, score breakdown
   and Visible Expert Masterclass button.
4. Confirm the row appears in the `Visibility Quiz` tab.
5. If email consent was Yes, confirm the result email arrives.
6. Delete the test row when finished.
