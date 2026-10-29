/**
 * Rehan Traders booking webhook. Bound to the "Rehan Traders bookings" Google Sheet.
 * The website's Worker (worker/book.ts) POSTs each validated booking here. This script checks the shared
 * secret, assigns the next job number (RT-0001 and up) under a lock, adds the booking as the top row,
 * emails the shop and returns {ok: true, job: "RT-0001"}. Deploy steps: README.md next to this file.
 *
 * Script property (Project Settings > Script properties): SECRET, the same value as the Worker's
 * BOOKING_WEBHOOK_SECRET. The last job number is kept in the property LAST_JOB.
 */

var SHEET_NAME = 'Bookings'
var SHOP_EMAIL = 'rehanmobiletraders@gmail.com'
var SENDER_NAME = 'Rehan Traders Website Bookings'
var STATUSES = ['New', 'Confirmed', 'Came in', 'Done', 'No-show', 'Cancelled']
// Column order. Status and Notes are for the shop; the website fills the rest.
var COLUMNS = [
  { title: 'Received', width: 150 },
  { title: 'Job', width: 90 },
  { title: 'Status', width: 110 },
  { title: 'Type', width: 80 },
  { title: 'Visit', width: 170 },
  { title: 'Device', width: 140 },
  { title: 'Fault', width: 170 },
  { title: 'Service', width: 200 },
  { title: 'Name', width: 160 },
  { title: 'Mobile', width: 120 },
  { title: 'WhatsApp', width: 230 },
  { title: 'Notes', width: 260 },
  { title: 'Slot (ISO)', width: 170 },
]
var INK = '#0E0E0E'
var PAPER = '#F5F5F2'
var PANEL = '#E9E9E4'
var SIGNAL = '#D7141A'

function doPost(e) {
  var data
  try {
    data = JSON.parse(e.postData.contents)
  } catch (err) {
    return reply({ ok: false, error: 'bad_json' })
  }

  var props = PropertiesService.getScriptProperties()
  var secret = props.getProperty('SECRET')
  if (!secret || data.secret !== secret) return reply({ ok: false, error: 'unauthorized' })

  var lock = LockService.getScriptLock()
  if (!lock.tryLock(3000)) return reply({ ok: false, error: 'busy' })
  var job
  try {
    var n = Number(props.getProperty('LAST_JOB') || 0) + 1
    job = 'RT-' + ('000' + n).slice(-4)
    // Newest booking on top, under the header row.
    var s = sheet()
    s.insertRowAfter(1)
    // A new row copies the header's style; take the body's formats and Status dropdown from the row below instead.
    var below = s.getRange(3, 1, 1, COLUMNS.length)
    below.copyTo(s.getRange(2, 1, 1, COLUMNS.length), SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false)
    below.copyTo(s.getRange(2, 1, 1, COLUMNS.length), SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false)
    s.getRange(2, 1, 1, COLUMNS.length).setValues([[
      new Date(),
      job,
      'New',
      data.kind === 'quote' ? 'Quote' : 'Booking',
      cell(data.visit || 'Quote first'),
      cell(data.device),
      cell(data.fault),
      cell(data.service),
      cell(data.name),
      cell(data.phone),
      cell(data.whatsapp),
      '',
      cell(data.slot),
    ]])
    SpreadsheetApp.flush()
    props.setProperty('LAST_JOB', String(n))
  } finally {
    lock.releaseLock()
  }

  // The row is saved; a failed email must not turn into a failed booking.
  try {
    sendShopEmail(job, data)
  } catch (err) {
    console.error('email failed for ' + job + ': ' + err)
  }

  return reply({ ok: true, job: job })
}

/**
 * Run once from the editor (it also asks for permissions). Safe to run again: it only (re)applies the layout.
 * Lahore time zone, a frozen ink header with filters, set column widths, a Status dropdown, banded rows,
 * new bookings in bold red, finished ones greyed out.
 */
function setup() {
  var book = SpreadsheetApp.getActiveSpreadsheet()
  book.setSpreadsheetTimeZone('Asia/Karachi')
  var s = book.getSheetByName(SHEET_NAME)
  if (!s) {
    var first = book.getSheets()[0]
    s = first.getLastRow() === 0 && book.getSheets().length === 1 ? first.setName(SHEET_NAME) : book.insertSheet(SHEET_NAME)
  }
  var cols = COLUMNS.length
  if (s.getMaxColumns() > cols) s.deleteColumns(cols + 1, s.getMaxColumns() - cols)
  if (s.getMaxColumns() < cols) s.insertColumnsAfter(s.getMaxColumns(), cols - s.getMaxColumns())

  var header = s.getRange(1, 1, 1, cols)
  header
    .setValues([COLUMNS.map(function (c) { return c.title })])
    .setFontWeight('bold')
    .setFontColor(PAPER)
    .setBackground(INK)
    .setVerticalAlignment('middle')
  s.setRowHeight(1, 36)
  s.setFrozenRows(1)
  s.setFrozenColumns(2)
  COLUMNS.forEach(function (c, i) { s.setColumnWidth(i + 1, c.width) })
  s.setTabColor(SIGNAL)

  var body = s.getRange(2, 1, s.getMaxRows() - 1, cols)
  body.setVerticalAlignment('middle').setWrap(false).setFontColor(INK).setFontWeight('normal').setBackground(null)
  s.getRange('A2:A').setNumberFormat('d mmm yyyy, h:mm am/pm')
  s.getRange('B2:B').setFontWeight('bold')
  s.getRange('J2:J').setNumberFormat('@')
  s.getRange('L2:L').setWrap(true)
  s.getRange('C2:C').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build()
  )

  s.getBandings().forEach(function (b) { b.remove() })
  s.getRange(1, 1, s.getMaxRows(), cols)
    .applyRowBanding(SpreadsheetApp.BandingTheme.GREY, true, false)
    .setHeaderRowColor(INK)
    .setFirstRowColor('#FFFFFF')
    .setSecondRowColor(PAPER)

  var status = s.getRange('C2:C')
  var everything = s.getRange(2, 1, s.getMaxRows() - 1, cols)
  s.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('New').setFontColor(SIGNAL).setBold(true).setRanges([status]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=OR($C2="Done",$C2="Cancelled",$C2="No-show")')
      .setFontColor('#8A8A85')
      .setRanges([everything])
      .build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Quote').setBackground(PANEL).setRanges([s.getRange('D2:D')]).build(),
  ])

  if (s.getFilter()) s.getFilter().remove()
  s.getRange(1, 1, s.getMaxRows(), cols).createFilter()
  s.hideColumns(cols) // Slot (ISO) is for scripts, not people

  console.log('Ready. Daily email quota left: ' + MailApp.getRemainingDailyQuota())
}

/**
 * The shop's email for a new booking, laid out like a brand newsletter in the website's look: ink header, a
 * horizontal ticket (stub with the job number in Signal Red, a dashed tear line, the details), then buttons to
 * WhatsApp or call the customer. Tables and inline styles only, so Gmail renders it; the ticket stacks under 600px.
 * Plain text goes along for clients without HTML.
 * Sender: rehanmobiletraders@gmail.com when the script runs in that account, or when that address is a verified
 * "Send mail as" alias of the account it runs in (README, "Send from the shop's address"). Name: SENDER_NAME.
 */
function sendShopEmail(job, data) {
  var quote = data.kind === 'quote'
  var visit = data.visit || 'Quote first, no visit booked'
  var subject = job + ' ' + (quote ? 'quote request' : 'booking') + ': ' + data.device + ', ' + data.fault + (data.visit ? ', ' + data.visit : '')
  var rows = [
    ['Visit', visit],
    ['Device', data.device],
    ['Fault', data.fault],
    ['Service', data.service],
    ['Name', data.name],
    ['Mobile', data.phone],
  ].filter(function (r) { return r[1] })
  var sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl()
  var tel = 'tel:+92' + String(data.phone).replace(/\D/g, '').replace(/^0/, '')

  var text = [(quote ? 'Quote request ' : 'Booking ') + job, '']
    .concat(rows.map(function (r) { return r[0] + ': ' + r[1] }))
    .concat(['WhatsApp the customer: ' + data.whatsapp, '', 'All bookings: ' + sheetUrl])
    .join('\n')

  var MUTED = '#5E5E5A'
  var LINE = '#D9D9D4'
  var GREEN = '#25D366'
  var display = "font-family:Archivo,'Arial Black',Helvetica,Arial,sans-serif;font-weight:800;letter-spacing:-0.02em;"
  var body = 'font-family:Inter,Helvetica,Arial,sans-serif;'
  var button = function (href, label, bg, fg, border) {
    return '<a href="' + esc(href) + '" style="' + body + 'display:inline-block;margin:0 8px 10px 0;padding:14px 24px;border-radius:999px;' +
      'font-size:15px;font-weight:700;line-height:1;text-decoration:none;background:' + bg + ';color:' + fg + ';border:1px solid ' + border + ';">' + esc(label) + '</a>'
  }
  // Details as a 2-column grid inside the ticket, label above value, like the website's confirmation ticket.
  var cells = rows.map(function (r) {
    return '<td class="cell" width="50%" valign="top" style="padding:0 16px 18px 0;">' +
      '<div style="' + body + 'font-size:12px;line-height:1.4;color:' + MUTED + ';">' + esc(r[0]) + '</div>' +
      '<div style="' + body + 'font-size:15px;line-height:1.4;font-weight:700;color:' + INK + ';padding-top:2px;">' + esc(r[1]) + '</div></td>'
  })
  var grid = ''
  for (var i = 0; i < cells.length; i += 2) grid += '<tr>' + cells[i] + (cells[i + 1] || '<td class="cell"></td>') + '</tr>'

  var html =
    '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="color-scheme" content="light only"><style>' +
    '@media (max-width:600px){.stack{display:block!important;width:100%!important;box-sizing:border-box}' +
    '.stub{border-radius:20px 20px 0 0!important}.tear{border-left:0!important;border-top:2px dashed ' + LINE + '!important}' +
    '.details{border-radius:0 0 20px 20px!important}.cell{display:block!important;width:100%!important}.pad{padding:24px 20px!important}}' +
    '</style></head>' +
    '<body style="margin:0;padding:0;background:' + PAPER + ';">' +
    // Preheader: the line Gmail shows after the subject in the inbox list.
    '<div style="display:none;max-height:0;overflow:hidden;">' + esc(data.name + ' · ' + data.device + ' · ' + visit) + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + PAPER + ';"><tr><td align="center" style="padding:24px 12px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;">' +

    // Header band
    '<tr><td style="background:' + INK + ';border-radius:20px 20px 0 0;padding:22px 28px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    '<td style="' + display + 'font-size:20px;color:' + PAPER + ';">Rehan Traders</td>' +
    '<td align="right" style="' + body + 'font-size:13px;color:#A4A49F;">Website bookings</td>' +
    '</tr></table></td></tr>' +

    // Hero
    '<tr><td class="pad" style="background:#FFFFFF;padding:36px 28px 8px;">' +
    '<div style="' + display + 'font-size:34px;line-height:1.1;color:' + INK + ';">' + (quote ? 'New quote request' : 'New booking') + '</div>' +
    '<div style="' + body + 'font-size:16px;line-height:1.55;color:' + MUTED + ';padding-top:10px;">' +
    esc(quote ? data.name + ' wants a quote. Reply on WhatsApp with the price.' : data.name + ' is coming in ' + visit + '. Confirm on WhatsApp.') + '</div>' +
    '</td></tr>' +

    // Ticket: stub | dashed tear line | details. Stacks on phones.
    '<tr><td class="pad" style="background:#FFFFFF;padding:24px 28px 8px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    '<td class="stack stub" width="34%" valign="middle" style="background:' + PANEL + ';border-radius:20px 0 0 20px;padding:26px 22px;">' +
    '<div style="' + body + 'font-size:13px;color:' + MUTED + ';">Job number</div>' +
    '<div style="' + display + 'font-size:34px;line-height:1.1;color:' + SIGNAL + ';padding-top:4px;white-space:nowrap;">' + esc(job) + '</div>' +
    '<div style="' + body + 'font-size:13px;font-weight:700;color:' + INK + ';padding-top:14px;">' + (quote ? 'Quote request' : 'Booking') + '</div>' +
    '</td>' +
    '<td class="stack tear details" valign="top" style="background:' + PANEL + ';border-left:2px dashed ' + LINE + ';border-radius:0 20px 20px 0;padding:26px 22px 8px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + grid + '</table>' +
    '</td></tr></table></td></tr>' +

    // Actions
    '<tr><td class="pad" style="background:#FFFFFF;padding:24px 28px 30px;">' +
    button(data.whatsapp, 'WhatsApp ' + String(data.name).split(' ')[0], GREEN, INK, GREEN) +
    button(tel, 'Call ' + data.phone, INK, PAPER, INK) +
    button(sheetUrl, 'All bookings', '#FFFFFF', INK, LINE) +
    '</td></tr>' +

    // Footer
    '<tr><td style="background:' + PANEL + ';border-radius:0 0 20px 20px;padding:20px 28px;' + body + 'font-size:12px;line-height:1.6;color:' + MUTED + ';">' +
    'Rehan Traders · Shop G-88, Ground Floor, Hafeez Center, Gulberg III, Lahore · 0305 8874839<br>' +
    'Sent by rehanmobiletraders.com when a customer books. The booking is also in the Bookings sheet.' +
    '</td></tr>' +
    '</table></td></tr></table></body></html>'

  var options = { name: SENDER_NAME, htmlBody: html }
  if (Session.getEffectiveUser().getEmail() !== SHOP_EMAIL && GmailApp.getAliases().indexOf(SHOP_EMAIL) >= 0) options.from = SHOP_EMAIL
  GmailApp.sendEmail(SHOP_EMAIL, subject, text, options)
}

/**
 * Run once from the editor on launch day: deletes every booking row (test ones included) and restarts job
 * numbers at RT-0001. The header, layout and Status dropdown stay. Cannot be undone, except from the Sheet's
 * version history (File > Version history).
 */
function resetForLaunch() {
  var s = sheet()
  var last = s.getLastRow()
  if (last > 2) s.deleteRows(3, last - 2)
  if (last >= 2) s.getRange(2, 1, 1, COLUMNS.length).clearContent()
  PropertiesService.getScriptProperties().deleteProperty('LAST_JOB')
  console.log('Bookings cleared. The next booking is RT-0001.')
}

function esc(value) {
  return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function sheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
}

/** Text as typed: a leading = + - or @ would make Sheets read the cell as a formula. */
function cell(value) {
  var text = String(value == null ? '' : value).slice(0, 200)
  return /^[=+\-@]/.test(text) ? "'" + text : text
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON)
}
