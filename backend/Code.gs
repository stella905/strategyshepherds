/**
 * Strategy Shepherds website lead collector
 * Writes to the existing Google Sheet: "Strategy Shepherds Website Leads"
 * Spreadsheet ID is already configured below.
 *
 * Deploy this script as a Google Apps Script Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 * Then paste the /exec URL into assets/js/config.js.
 */

const SPREADSHEET_ID = '1pJdqgsJARzrB1J3H-Ru_59jSX3W51pAqQEKhX74NEJc';
const LEADS_SHEET = 'Website Leads';
const ASSESSMENT_SHEET = 'Desk Readiness Responses';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'Strategy Shepherds Lead Collector' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const payload = parsePayload_(e);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const leadId = payload.leadId || makeLeadId_();
    payload.leadId = leadId;

    appendLead_(ss, payload);
    if (payload.kind === 'assessment') appendAssessment_(ss, payload);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, leadId: leadId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error(err);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('No request body received.');
  const data = JSON.parse(e.postData.contents);
  if (!data.email) throw new Error('Email is required.');
  return data;
}

function appendLead_(ss, p) {
  const sheet = ss.getSheetByName(LEADS_SHEET);
  if (!sheet) throw new Error('Missing sheet: ' + LEADS_SHEET);

  const row = [
    new Date(),
    safe_(p.leadId),
    safe_(p.name),
    safe_(p.email),
    safe_(p.phone),
    safe_(p.organisation),
    safe_(p.role),
    safe_(p.leadType),
    safe_(p.thematicArea),
    safe_(p.country),
    safe_(p.website),
    safe_(p.interest || (p.kind === 'assessment' ? 'Desk Readiness Assessment' : 'General enquiry')),
    safe_(p.sourcePage),
    safe_(p.sourceCta),
    safe_(p.message),
    p.overallScore === undefined ? '' : Number(p.overallScore),
    safe_(p.deskStage),
    p.consentUpdates ? 'Yes' : 'No',
    safe_(p.utmSource),
    safe_(p.utmMedium),
    safe_(p.utmCampaign),
    safe_(p.status || 'New'),
    '',
    '',
    '',
    JSON.stringify(p)
  ];
  sheet.appendRow(row);
}

function appendAssessment_(ss, p) {
  const sheet = ss.getSheetByName(ASSESSMENT_SHEET);
  if (!sheet) throw new Error('Missing sheet: ' + ASSESSMENT_SHEET);
  const d = p.dimensionScores || {};
  const row = [
    new Date(),
    safe_(p.leadId),
    safe_(p.name),
    safe_(p.email),
    safe_(p.phone),
    safe_(p.organisation),
    safe_(p.role),
    safe_(p.leadType),
    safe_(p.thematicArea),
    safe_(p.country),
    safe_(p.website),
    Number(p.overallScore || 0),
    safe_(p.deskStage),
    Number(d['Strategy'] || 0),
    Number(d['Intelligence'] || 0),
    Number(d['Evidence'] || 0),
    Number(d['AI Capability'] || 0),
    Number(d['Human Networks'] || 0),
    Number(d['Distribution'] || 0),
    Number(d['Learning'] || 0),
    safe_(p.strongestDimension),
    safe_(p.priorityGap),
    safe_(p.recommendedNextStep),
    safe_(p.sourcePage),
    safe_(p.utmSource),
    safe_(p.utmMedium),
    safe_(p.utmCampaign),
    p.consentUpdates ? 'Yes' : 'No',
    JSON.stringify(p.answers || []),
    ''
  ];
  sheet.appendRow(row);
}

function safe_(value) {
  if (value === null || value === undefined) return '';
  return String(value).slice(0, 45000);
}

function makeLeadId_() {
  return 'SS-' + Utilities.getUuid().split('-')[0].toUpperCase();
}
