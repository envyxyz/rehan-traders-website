# Booking webhook (Google Apps Script)

`Code.gs` receives each booking from the Worker (`worker/book.ts`), gives it the next job number (RT-0001, RT-0002, ...), adds a row to a Google Sheet and emails rehanmobiletraders@gmail.com. It is free and runs in the shop's own Google account, so the bookings belong to the shop.

**Live deployment (29 Oct 2026):** the Sheet "Rehan Traders bookings" (https://docs.google.com/spreadsheets/d/1CMO_ss7GwDkHUophq29Y1Fsib3wlyOtWG1qbFzchvho/edit) and its bound script "Rehan Traders booking webhook" live in Ameer's account (ameermughal651@gmail.com), shared with rehanmobiletraders@gmail.com as an editor. The web app runs as Ameer, so booking emails are sent from his Gmail to the shop. Deployment "booking v1" (version 2); its URL and the secret are in `.env.local`. `setup()` lays out the Sheet: frozen ink header with filters, Status dropdown (New, Confirmed, Came in, Done, No-show, Cancelled), banded rows, newest booking on top, a Notes column for the shop. Editors of the Sheet can open the script and see the secret.

The steps below set it up from scratch (say in the shop's own account). It takes about 10 minutes.

## 1. Make a shared secret

The secret proves a request came from our Worker. Make a long random one on your computer. In PowerShell:

```powershell
-join ((1..48) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })
```

Copy the 48 characters it prints. Keep them private: do not commit them or paste them into chat.

## 2. Create the Sheet

1. Open https://sheets.google.com, signed in as rehanmobiletraders@gmail.com (check the account picture, top right).
2. Click **Blank spreadsheet** (the big + tile).
3. Click **Untitled spreadsheet** (top left) and name it `Rehan Traders bookings`. Press Enter.

## 3. Add the script

1. In the Sheet's menu, click **Extensions** > **Apps Script**. A new tab opens with a file called `Code.gs`.
2. Click **Untitled project** (top left) and name it `Rehan Traders booking webhook`. Click **Rename**.
3. In `Code.gs`, select everything (Ctrl+A) and delete it.
4. Open `integrations/booking-apps-script/Code.gs` from this repo, copy all of it, and paste it into the editor.
5. Press **Ctrl+S** to save.

## 4. Store the secret

1. In the left sidebar, click the gear icon, **Project Settings**.
2. Scroll to **Script Properties** and click **Add script property**.
3. Property: `SECRET`. Value: the 48 characters from step 1.
4. Click **Save script properties**.

## 5. Create the Bookings tab and grant permissions

1. In the left sidebar, click **< >** (**Editor**).
2. In the toolbar, open the function menu (it shows `doPost`) and pick **setup**.
3. Click **Run**.
4. A box says **Authorization required**. Click **Review permissions** and pick rehanmobiletraders@gmail.com.
5. Google says **Google hasn't verified this app**. This is normal for your own script. Click **Advanced**, then **Go to Rehan Traders booking webhook (unsafe)**.
6. Tick the boxes if asked (see, edit and create spreadsheets; send email as you) and click **Continue** / **Allow**.
7. The log at the bottom says `Ready. Daily email quota left: 100` (or similar). Back in the Sheet tab, a **Bookings** tab now has the header row.

## 6. Deploy it as a web app

1. Top right, click **Deploy** > **New deployment**.
2. Next to **Select type**, click the gear and pick **Web app**.
3. Description: `booking v1`.
4. **Execute as**: **Me (rehanmobiletraders@gmail.com)**.
5. **Who has access**: **Anyone**. (The secret is what keeps others out; Google needs "Anyone" so the Worker can call it without signing in.)
6. Click **Deploy**. If it asks to authorise again, repeat step 5.4 to 5.6.
7. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy.../exec`. Click **Done**.

## 7. Give the URL and secret to the website

Locally, add both to `.env.local` in the website folder (never committed):

```
BOOKING_WEBHOOK_URL=https://script.google.com/macros/s/AKfy.../exec
BOOKING_WEBHOOK_SECRET=the 48 characters
```

In production (Phase 10), set the same two as Worker secrets: Cloudflare dashboard > **Workers & Pages** > `rehan-traders-website` > **Settings** > **Variables and Secrets** > **Add** > type **Secret**. Or from the website folder:

```bash
pnpm wrangler secret put BOOKING_WEBHOOK_URL
```

```bash
pnpm wrangler secret put BOOKING_WEBHOOK_SECRET
```

## 8. Test it

Run `pnpm preview` and book a visit at http://localhost:8787/book. A row appears in the Bookings tab, an email arrives at rehanmobiletraders@gmail.com, and the confirmation page shows the job number.

## Changing the script later

Edit the code, save, then **Deploy** > **Manage deployments** > the pencil icon > **Version: New version** > **Deploy**. The URL stays the same. (A **New deployment** would make a new URL.)

### Photos, Problem and the hourly limit (30 Oct 2026)

This version adds booking photos (saved to the Drive folder "Rehan Traders booking photos", attached to the shop email), the Problem and Photos columns, and a limit of 5 bookings per mobile number per hour. To switch it on:

1. Paste the new `Code.gs` over the old one and save.
2. Pick `setup` in the function menu and click **Run**. Google asks for a new permission (Drive, to save the photos): **Review permissions** > Ameer's account > **Advanced** > **Go to Rehan Traders booking webhook** > **Allow**. `setup` adds the Problem and Photos columns.
3. **Deploy** > **Manage deployments** > pencil > **Version: New version** > **Deploy**.

The folder is made, and shared with rehanmobiletraders@gmail.com as a viewer, on the first photo. Photos someone adds and then removes, or never books with, stay in the folder; clear it out now and then.

## Sender

Emails go out as **Rehan Traders Website Bookings** from the account the script runs in (Ameer's), to rehanmobiletraders@gmail.com, as an HTML ticket in the website's look. Do not send them from the shop's own address through a "Send mail as" alias: Gmail treats mail from yourself to yourself as sent mail and keeps it out of the inbox (tried 29 Oct 2026; emails stopped arriving).

## Launch day: start from RT-0001

In the script editor pick **resetForLaunch** and click **Run**. It deletes every row in Bookings (all test bookings) and resets the job counter, so the first real booking is RT-0001. Layout and Status dropdown stay. Only undo: **File** > **Version history** in the Sheet.

## Good to know

- Job numbers live in the script property `LAST_JOB`. To start again from RT-0001, delete that property. To skip ahead (for example to match the paper job cards), set it to the last number used, like `426`.
- A consumer Gmail account can send about 100 emails a day from scripts. If the quota runs out, the row is still saved; only the email is skipped.
- A lock makes sure two bookings at the same moment never get the same number. If the lock is busy for more than 4 seconds, the booking is refused, and the website tells the customer to send it on WhatsApp.
- Cells starting with `=`, `+`, `-` or `@` are saved as plain text, so a customer's name can never run as a formula.
- To stop all bookings at once: **Deploy** > **Manage deployments** > **Archive**.
