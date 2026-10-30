/**
 * Rehan Traders booking webhook. Bound to the "Rehan Traders bookings" Google Sheet.
 * The website's Worker (worker/book.ts) POSTs each validated booking here. This script checks the shared
 * secret, assigns the next job number (RT-0001 and up) under a lock, adds the booking as the top row,
 * emails the shop and returns {ok: true, job: "RT-0001"}. Deploy steps: README.md next to this file.
 * It also takes booking photos ({action: "upload"}, one JPEG each, sent as soon as the customer picks it): they
 * go to the Drive folder "Rehan Traders booking photos" (shared with the shop as a viewer), and the booking that
 * names them gets them as email attachments and as links in the Photos column.
 *
 * Mail goes out through MailApp. testEmailAndDrive() checks the permissions and sends a test email.
 *
 * Script property (Project Settings > Script properties): SECRET, the same value as the Worker's
 * BOOKING_WEBHOOK_SECRET. The last job number is kept in the property LAST_JOB, the photo folder in PHOTO_FOLDER.
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
  // Added after launch, so at the end: earlier rows keep their columns.
  { title: 'Problem', width: 300 },
  { title: 'Photos', width: 300 },
]
var INK = '#0E0E0E'
var PAPER = '#F5F5F2'
var PANEL = '#E9E9E4'
var SIGNAL = '#D7141A'
var LIMIT_PER_HOUR = 5 // bookings per mobile number
var MAX_PHOTO_BYTES = 1500000 // the website sends ~300 KB JPEGs

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
  if (data.action === 'upload') return reply(savePhoto(data.data))

  var files = photoFiles(data.photos)
  var lock = LockService.getScriptLock()
  if (!lock.tryLock(3000)) return reply({ ok: false, error: 'busy' })
  var job
  try {
    if (recentForPhone(String(data.phone)) >= LIMIT_PER_HOUR) return reply({ ok: false, error: 'limit' })
    var n = Number(props.getProperty('LAST_JOB') || 0) + 1
    job = 'RT-' + ('000' + n).slice(-4)
    // Newest booking on top, under the header row.
    var s = sheet()
    // Columns added since setup() last ran: add them, with their titles, so the row fits.
    if (s.getMaxColumns() < COLUMNS.length) {
      s.insertColumnsAfter(s.getMaxColumns(), COLUMNS.length - s.getMaxColumns())
      s.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS.map(function (c) { return c.title })])
    }
    s.insertRowAfter(1)
    // A new row copies the header's style; take the body's formats and Status dropdown from the row below instead.
    // (Only when there is a row below: the very first booking has none.)
    if (s.getMaxRows() >= 3) {
      var below = s.getRange(3, 1, 1, COLUMNS.length)
      below.copyTo(s.getRange(2, 1, 1, COLUMNS.length), SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false)
      below.copyTo(s.getRange(2, 1, 1, COLUMNS.length), SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false)
    }
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
      cell(data.problem),
      files.map(function (f) { return f.getUrl() }).join('\n'),
    ]])
    SpreadsheetApp.flush()
    props.setProperty('LAST_JOB', String(n))
  } finally {
    lock.releaseLock()
  }

  // The row is saved; a failed email must not turn into a failed booking. The Worker logs emailError.
  var emailError = null
  try {
    sendShopEmail(job, data, files)
  } catch (err) {
    emailError = String(err)
    console.error('email failed for ' + job + ': ' + err)
  }

  return reply({ ok: true, job: job, emailSent: !emailError, emailError: emailError })
}

/**
 * Run from the editor toolbar to force the Drive and Mail permissions, check the Drive folder and the SECRET
 * property, and send a real test email to SHOP_EMAIL (job number RT-TEST; nothing is added to the Sheet).
 */
function testEmailAndDrive() {
  var folder = photoFolder()
  console.log('Drive folder ready: ' + folder.getName() + ' (' + folder.getUrl() + ')')
  console.log('SECRET property set: ' + Boolean(PropertiesService.getScriptProperties().getProperty('SECRET')))
  console.log('Remaining daily email quota: ' + MailApp.getRemainingDailyQuota())

  sendShopEmail('RT-TEST', {
    kind: 'booking',
    visit: 'Today, 4:00 PM',
    device: 'iPhone 15 Pro',
    fault: 'Screen replacement',
    service: 'Screen replacement',
    name: 'Test Customer',
    phone: '03001234567',
    whatsapp: 'https://wa.me/923001234567',
    problem: 'Test from the Apps Script editor to check the Drive and Mail permissions.'
  }, [])
  console.log('Test email sent to ' + SHOP_EMAIL)
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
  s.getRange(2, 14, s.getMaxRows() - 1, 2).setWrap(true) // Problem, Photos
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
  s.hideColumns(13) // Slot (ISO) is for scripts, not people

  var folder = photoFolder() // asks for the Drive permission and makes the photo folder
  console.log('Drive folder ready: ' + folder.getUrl())
  console.log('Ready. Daily email quota left: ' + MailApp.getRemainingDailyQuota())
}

/**
 * The shop's email for a new booking, laid out like a brand newsletter in the website's look: ink header, a
 * horizontal ticket (stub with the job number in Signal Red, a dashed tear line, the details), then buttons to
 * WhatsApp or call the customer. Tables and inline styles only, so Gmail renders it; the ticket stacks under 600px.
 * Plain text goes along for clients without HTML.
 * Sender: the account the script runs in, shown as SENDER_NAME. MailApp (scope script.send_mail), not GmailApp,
 * so the script needs no access to the account's mailbox.
 */
function sendShopEmail(job, data, files) {
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
    .concat(data.problem ? ['Problem: ' + data.problem] : [])
    .concat(files.map(function (f, i) { return 'Photo ' + (i + 1) + ': ' + f.getUrl() }))
    .concat(['WhatsApp the customer: ' + data.whatsapp, '', 'All bookings: ' + sheetUrl])
    .join('\n')

  var MUTED = '#5E5E5A'
  var LINE = '#C9C9C3'
  var GREEN = '#25D366'
  var CARD = '#FFFFFF'
  var display = "font-family:Archivo,'Arial Black',Helvetica,Arial,sans-serif;font-weight:800;letter-spacing:-0.02em;"
  var body = 'font-family:Inter,Helvetica,Arial,sans-serif;'
  // Long names, problems or pasted links wrap inside their cell instead of pushing the ticket wider.
  var wrap = 'word-break:break-word;overflow-wrap:anywhere;'
  var label = function (t) {
    return '<div style="' + body + 'font-size:12px;line-height:1.4;color:' + MUTED + ';">' + esc(t) + '</div>'
  }
  var button = function (href, text, bg, fg, border) {
    return '<a href="' + esc(href) + '" style="' + body + 'display:inline-block;margin:0 8px 10px 0;padding:14px 24px;border-radius:999px;' +
      'font-size:15px;font-weight:700;line-height:1;text-decoration:none;background:' + bg + ';color:' + fg + ';border:1px solid ' + border + ';">' + esc(text) + '</a>'
  }
  // Short details as a 2-column grid, label above value, like the website's confirmation ticket.
  var cells = rows.map(function (r) {
    return '<td class="cell" width="50%" valign="top" style="padding:0 14px 18px 0;">' + label(r[0]) +
      '<div style="' + body + wrap + 'font-size:15px;line-height:1.4;font-weight:700;color:' + INK + ';padding-top:2px;">' + esc(r[1]) + '</div></td>'
  })
  var grid = ''
  for (var i = 0; i < cells.length; i += 2) grid += '<tr>' + cells[i] + (cells[i + 1] || '<td class="cell" width="50%"></td>') + '</tr>'
  // The problem in the customer's words, full width.
  if (data.problem) {
    grid += '<tr><td colspan="2" style="padding:0 0 18px;">' + label('Problem') +
      '<div style="' + body + wrap + 'font-size:15px;line-height:1.5;color:' + INK + ';padding-top:2px;white-space:pre-line;">' + esc(data.problem) + '</div></td></tr>'
  }
  // Photos inside the ticket (inline images, cid:photoN), each a link to the full file in Drive.
  var inline = {}
  if (files.length) {
    var thumbs = files.map(function (f, n) {
      inline['photo' + n] = f.getBlob()
      return '<td width="33%" valign="top" style="padding:0 8px 0 0;">' +
        '<a href="' + esc(f.getUrl()) + '" style="display:block;text-decoration:none;">' +
        '<img src="cid:photo' + n + '" alt="Photo ' + (n + 1) + '" width="140" style="display:block;width:100%;max-width:140px;height:auto;border:0;border-radius:12px;background:' + LINE + ';"></a></td>'
    })
    while (thumbs.length < 3) thumbs.push('<td width="33%"></td>')
    grid += '<tr><td colspan="2" style="padding:0 0 18px;">' + label('Photos (tap to open full size)') +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed;margin-top:8px;"><tr>' + thumbs.join('') + '</tr></table></td></tr>'
  }

  var html =
    '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="color-scheme" content="light only"><style>' +
    '@media (max-width:620px){.stack{display:block!important;width:100%!important;box-sizing:border-box}' +
    '.seal{display:none!important}.tearh{display:block!important}' +
    '.stub{padding:22px 20px 18px!important;border-radius:20px 20px 0 0!important}' +
    '.details{padding:0 20px 4px!important;border-left:0!important;border-radius:0 0 20px 20px!important}.grid{table-layout:auto!important}.cell{display:block!important;width:100%!important;padding-right:0!important}.pad{padding:24px 18px!important}}' +
    '</style></head>' +
    '<body style="margin:0;padding:0;background:' + PAPER + ';">' +
    // Preheader: the line Gmail shows after the subject in the inbox list.
    '<div style="display:none;max-height:0;overflow:hidden;">' + esc(data.name + ' · ' + data.device + ' · ' + visit) + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + PAPER + ';"><tr><td align="center" style="padding:24px 12px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:780px;">' +

    // Header band
    '<tr><td style="background:' + INK + ';border-radius:20px 20px 0 0;padding:22px 32px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    '<td style="' + display + 'font-size:20px;color:' + PAPER + ';">Rehan Traders</td>' +
    '<td align="right" style="' + body + 'font-size:13px;color:#A4A49F;">Website bookings</td>' +
    '</tr></table></td></tr>' +

    // Hero
    '<tr><td class="pad" style="background:' + CARD + ';padding:36px 32px 8px;">' +
    '<div style="' + display + 'font-size:34px;line-height:1.1;color:' + INK + ';">' + (quote ? 'New quote request' : 'New booking') + '</div>' +
    '<div style="' + body + wrap + 'font-size:16px;line-height:1.55;color:' + MUTED + ';padding-top:10px;">' +
    esc(quote ? data.name + ' wants a quote. Reply on WhatsApp with the price.' : data.name + ' is coming in ' + visit + '. Confirm on WhatsApp.') + '</div>' +
    '</td></tr>' +

    // Ticket, as on the website: stub with the job number and the tamper seal, a dashed tear line with notches cut
    // to the card colour, then the details. On phones the stub sits on top and the tear line runs across.
    '<tr><td class="pad" style="background:' + CARD + ';padding:24px 32px 8px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    // The two halves' inner corners are rounded, so where they meet they cut a notch at each end of the tear line.
    '<td class="stack stub" width="190" valign="top" style="width:190px;background:' + PANEL + ';border-radius:20px 14px 14px 20px;padding:28px 18px 28px 26px;">' +
    label(quote ? 'Reference' : 'Job number') +
    '<div style="' + display + 'font-size:34px;line-height:1.1;color:' + SIGNAL + ';padding-top:4px;white-space:nowrap;">' + esc(job) + '</div>' +
    '<div style="' + body + 'font-size:13px;font-weight:700;color:' + INK + ';padding-top:10px;">' + (quote ? 'Quote request' : 'Booking') + '</div>' +
    '<img class="seal" src="https://rehanmobiletraders.com/art/tamper-seal-240.webp" alt="" width="76" height="76" style="display:block;width:76px;height:76px;border:0;margin-top:28px;">' +
    '</td>' +
    '<td class="stack details" valign="top" style="background:' + PANEL + ';border-left:2px dashed ' + LINE + ';border-radius:14px 20px 20px 14px;padding:28px 26px 8px 22px;">' +
    '<div class="tearh" style="display:none;border-top:2px dashed ' + LINE + ';margin:0 0 22px;font-size:0;line-height:0;">&nbsp;</div>' +
    '<table class="grid" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed;">' + grid + '</table>' +
    '</td></tr></table></td></tr>' +

    // Actions
    '<tr><td class="pad" style="background:' + CARD + ';padding:24px 32px 30px;">' +
    button(data.whatsapp, 'WhatsApp ' + String(data.name).split(' ')[0], GREEN, INK, GREEN) +
    button(tel, 'Call ' + data.phone, INK, PAPER, INK) +
    button(sheetUrl, 'All bookings', CARD, INK, LINE) +
    '</td></tr>' +

    // Footer
    '<tr><td style="background:' + PANEL + ';border-radius:0 0 20px 20px;padding:20px 32px;' + body + 'font-size:12px;line-height:1.6;color:' + MUTED + ';">' +
    'Rehan Traders · Shop G-88, Ground Floor, Hafeez Center, Gulberg III, Lahore · 0305 8874839<br>' +
    'Sent by rehanmobiletraders.com when a customer books. The booking is also in the Bookings sheet.' +
    '</td></tr>' +
    '</table></td></tr></table></body></html>'

  // Not from the shop's own address: Gmail keeps mail "from yourself" out of the inbox.
  // Photos go inline in the ticket, not as attachments, so they are not shown twice.
  MailApp.sendEmail({
    to: SHOP_EMAIL,
    subject: subject,
    body: text,
    name: SENDER_NAME,
    htmlBody: html,
    inlineImages: inline
  })
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

/** One booking photo (base64 JPEG) into the photo folder. Returns {ok, id} or {ok: false, error}. */
function savePhoto(base64) {
  var bytes
  try {
    // Also accept a data URL ("data:image/jpeg;base64,...").
    bytes = Utilities.base64Decode(String(base64 || '').replace(/^data:image\/[a-zA-Z+]+;base64,/, ''))
  } catch (err) {
    return { ok: false, error: 'bad_photo' }
  }
  // A JPEG starts FF D8 FF (Apps Script bytes are signed: -1, -40, -1).
  if (bytes.length > MAX_PHOTO_BYTES || bytes[0] !== -1 || bytes[1] !== -40 || bytes[2] !== -1) return { ok: false, error: 'bad_photo' }
  var name = Utilities.formatDate(new Date(), 'Asia/Karachi', 'yyyy-MM-dd HH.mm.ss') + '.jpg'
  var file = photoFolder().createFile(Utilities.newBlob(bytes, 'image/jpeg', name))
  return { ok: true, id: file.getId() }
}

/** The photo folder, made (and shared with the shop) on first use. */
function photoFolder() {
  var props = PropertiesService.getScriptProperties()
  var id = props.getProperty('PHOTO_FOLDER')
  if (id) {
    try {
      return DriveApp.getFolderById(id)
    } catch (err) {
      // deleted: make a new one
    }
  }
  var lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    // Another request may have made it while this one waited for the lock.
    id = props.getProperty('PHOTO_FOLDER')
    if (id) {
      try {
        return DriveApp.getFolderById(id)
      } catch (err) {}
    }
    var folder = DriveApp.createFolder('Rehan Traders booking photos')
    try {
      // The owner is the shop already when the script runs in its account; addViewer on the owner would fail.
      if (Session.getEffectiveUser().getEmail().toLowerCase() !== SHOP_EMAIL.toLowerCase()) folder.addViewer(SHOP_EMAIL)
    } catch (err) {
      console.error('could not share the photo folder: ' + err)
    }
    props.setProperty('PHOTO_FOLDER', folder.getId())
    return folder
  } finally {
    lock.releaseLock()
  }
}

/** The booking's photos: only files in the photo folder, at most 3, so a booking cannot attach any other Drive file. */
function photoFiles(ids) {
  if (!Array.isArray(ids) || !ids.length) return []
  var folderId = photoFolder().getId()
  return ids.slice(0, 3).map(function (id) {
    try {
      var file = DriveApp.getFileById(String(id))
      var parents = file.getParents()
      return parents.hasNext() && parents.next().getId() === folderId ? file : null
    } catch (err) {
      return null
    }
  }).filter(Boolean)
}

/**
 * Bookings from this mobile number in the last hour, among the newest 300 rows. Every row is checked, not just
 * the top ones, so sorting the Sheet by another column cannot hide recent bookings from the limit.
 */
function recentForPhone(phone) {
  var s = sheet()
  var last = Math.min(s.getLastRow(), 300)
  if (last < 2) return 0
  var hourAgo = Date.now() - 3600 * 1000
  var rows = s.getRange(2, 1, last - 1, 10).getValues() // Received .. Mobile
  var count = 0
  for (var i = 0; i < rows.length; i++) {
    var received = rows[i][0]
    if (received instanceof Date && received.getTime() >= hourAgo && String(rows[i][9]) === phone) count++
  }
  return count
}

function esc(value) {
  return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function sheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
}

/** Text as typed: a leading = + - or @ would make Sheets read the cell as a formula. */
function cell(value) {
  var text = String(value == null ? '' : value).slice(0, 500)
  return /^[=+\-@]/.test(text) ? "'" + text : text
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON)
}
