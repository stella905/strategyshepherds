# Strategy Shepherds form receiver setup

The public website forms post to a Google Apps Script web app. The receiver keeps
the AppSheet Application Access Key out of the browser, adds each response to the
correct AppSheet table, and sends an email notification to
`stella@stellanjogo.com`.

## 1. Create the AppSheet app

1. Open **Strategy Shepherds — Website Form Responses** in Google Sheets.
2. Add a worksheet tab named **Visibility Quiz**. Put the exact column headings
   listed under `visibility-quiz` in `apps-script/FormReceiver.gs` in row 1.
3. Open the existing AppSheet app connected to this spreadsheet. Do not create a
   second app.
4. Add all eight worksheet tabs as tables:
   - Impact Story Audit
   - Intensive Applications
   - Workshop Requests
   - Library Interest
   - Creator Day Africa
   - Book Waitlist
   - General Enquiries
   - Visibility Quiz
5. Set **Submission ID** as the key for every table.
6. If AppSheet already contains the first seven tables, add only **Visibility
   Quiz**, then regenerate its column structure. The existing App ID and
   Application Access Key remain valid.

## 2. Deploy the secure receiver

1. In the response spreadsheet, open **Extensions → Apps Script**.
2. Replace the starter code with `apps-script/FormReceiver.gs`.
3. Open **Project Settings → Script Properties** and add:
   - `DATA_MODE` = `APPSHEET`
   - `APPSHEET_APP_ID` = the App ID
   - `APPSHEET_ACCESS_KEY` = the Application Access Key
   - `APPSHEET_REGION` = `www.appsheet.com`
4. Select **Deploy → New deployment → Web app**.
5. Execute as **Me** and allow access to **Anyone**.
6. Authorise Google Sheets, email and external-request access.
7. Copy the `/exec` web-app URL.

If `DATA_MODE` is `SHEETS`, AppSheet is not involved in website submissions.
Adding the new **Visibility Quiz** tab and deploying the updated receiver is
enough. If `DATA_MODE` is `APPSHEET`, add the new tab as a table in the existing
AppSheet app before testing. No new app or website connection is required.

## 3. Connect and test the website

1. Put the `/exec` URL in `form-config.js`.
2. Submit one test through every website form, including the Visibility Quiz.
3. Confirm each row appears in the correct AppSheet table and Google Sheet tab.
4. Confirm every submission email reaches `stella@stellanjogo.com`.
5. Confirm the Impact Story Audit displays and emails the correct diagnosis.
6. Confirm the Visibility Quiz displays and emails the correct profile, scores
   and Visible Expert Masterclass link.
7. Delete the test rows.

Do not put the AppSheet Application Access Key in website HTML or JavaScript.
