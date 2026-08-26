# PathSeeker

PathSeeker is a career-guidance web app. It helps someone (a student, a
graduate, or a working professional) explore careers, take an interest quiz,
watch videos from people in different jobs, download helpful checklists,
read success stories, and get personal recommendations — all bookmarked and
organized in one place.

This file explains **how to run the project and how to use it**. Two other
files go deeper:

- [`docs/API_GUIDE.md`](docs/API_GUIDE.md) — every backend API endpoint, explained in plain English.
- [`docs/CODE_GUIDE.md`](docs/CODE_GUIDE.md) — a tour of the codebase: what every folder and file is for.

No prior web-development knowledge is assumed in this file.

---

## 1. What this project is made of

A website like this is really two separate programs talking to each other:

| Piece | What it does | Lives in | Runs on |
|---|---|---|---|
| **Client** (the website you see) | The pages, buttons, forms you click on in your browser | `client/` | `http://localhost:5174` |
| **Server** (the backend) | Stores data, checks passwords, runs the logic | `server/` | `http://localhost:5001` |
| **Database** | Where all the data (users, careers, quiz results...) is actually stored | MongoDB Atlas (in the cloud) | n/a — it's not a folder, it's a remote service |

The client talks to the server over the network (every time a page needs
data, it "calls an API" — think of it as the client politely asking the
server a question and getting an answer back as data). The server is the
only thing that talks to the database directly.

---

## 2. One-time setup

You only need to do this once (or whenever you get the project fresh on a
new machine).

### 2.1 Install dependencies

Open a terminal in the project folder and run:

```bash
cd server
npm install

cd ../client
npm install
```

This downloads all the third-party code libraries both halves of the
project depend on (things like Express, React, Mongoose, etc.).

### 2.2 Set up your `.env` file (server secrets)

The server needs a file called `.env` inside `server/` that holds secret
values it shouldn't share publicly (database password, etc.). This file is
already created for you in this project and looks like:

```
PORT=5001
MONGODB_URI=mongodb+srv://...          # connection string to the database
JWT_SECRET=...                          # random secret used to sign login tokens
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@pathseeker.com
ADMIN_PASSWORD=Iam@Admin123
EMAIL_SERVICE=gmail
EMAIL_USER=                             # leave blank until you want real emails sent
EMAIL_PASS=
EMAIL_FROM=
```

You don't need to change anything here to get started. See **Section 6**
if you later want the app to send real emails instead of just printing them
to the terminal.

### 2.3 Load starter data into the database

The database starts out empty. These commands fill it with example content
(careers, quiz questions, videos, resources, sample stories) and create the
one admin account. Run them once, from inside `server/`:

```bash
cd server
npm run seed:admin      # creates the admin login
npm run seed:careers    # adds 20 example careers
npm run seed:quiz       # adds the 17 interest-quiz questions
npm run seed:media      # adds videos/podcasts/explainers
npm run seed:resources  # adds downloadable PDF checklists/guides
npm run seed:stories    # adds example success stories
```

Each of these **replaces** that category's data — safe to re-run any time
you want to reset that section back to the starting examples.

---

## 3. Running the app day-to-day

You need **two terminal windows/tabs** open at the same time — one for the
server, one for the client. Both need to keep running while you use the app.

**Terminal 1 — start the server:**
```bash
cd server
npm run dev
```
You should see `[server] Listening on http://localhost:5001` and
`[db] Connected to MongoDB`.

**Terminal 2 — start the client:**
```bash
cd client
npm run dev
```
You should see a message with a `Local:` link.

**Then open your browser to:** `http://localhost:5174`

That's the whole app. Leave both terminals running while you use it; press
`Ctrl+C` in each to stop them when you're done.

> **Why two different ports?** The client (5174) is just serving web pages;
> the server (5001) is a separate program answering data requests. The
> client is set up to automatically forward any request starting with
> `/api` to the server, so from your browser's point of view it all feels
> like one website.

---

## 4. Logging in — what accounts exist and how

There is **no single fixed password** for the app — anyone can create their
own account. But there are two different ways to get access:

### 4.1 Create your own account (regular user)

Go to `http://localhost:5174/register` and fill in:
- Your name
- Your email (any email works — it's just stored as an identifier, e.g. `you@example.com`)
- A password (must be at least 8 characters)
- Your role: **Student**, **Graduate**, or **Professional**

Click **Register** and you're instantly logged in and taken to your
Dashboard. You can log in again later at `/login` with that same
email + password.

### 4.2 The admin account (already created for you)

One special account was created by the `npm run seed:admin` step above.
It logs in through the exact same `/login` page as everyone else — there's
no separate "admin door." The only difference is what it can *see and do*
once logged in (an **Admin** link appears in the top menu).

```
Email:    admin@pathseeker.com
Password: Iam@Admin123
```

**You can change this password** by editing `ADMIN_PASSWORD` in
`server/.env` and then re-running `npm run seed:admin` — that command
updates the existing admin account to match whatever is in `.env` instead
of creating a duplicate.

⚠️ You cannot make yourself an admin by registering with role "admin" —
the registration form only allows Student/Graduate/Professional on
purpose, so random visitors can never grant themselves admin power. Admin
accounts can only be created via the seed script (i.e., by someone with
access to the server's files).

### 4.3 What "role" changes about your account

| Role | Can do |
|---|---|
| Student / Graduate / Professional | Everything a normal user can do: browse, bookmark, take the quiz, submit a success story (goes to "pending" until an admin approves it), leave feedback |
| Admin | Everything above, **plus** the Admin Panel: add/edit/delete careers, media, quiz questions; approve or reject submitted stories; view feedback and usage statistics |

### 4.4 Forgot password

Click "Forgot password?" on the login page, enter your email, and the app
generates a 6-digit reset code. **If you haven't set up real email sending
yet** (see Section 6), that code isn't emailed anywhere — instead it's
printed to Terminal 1 (the server terminal) like this:

```
[email] EMAIL_USER/EMAIL_PASS not set — printing instead of sending:
[email] To: you@example.com
[email] Subject: Your PathSeeker password reset code
[email] Body: Your password reset code is 483920. It expires in 10 minutes.
```

Copy that 6-digit code into the app's reset screen along with your new
password.

---

## 5. A tour of what you can do in the app

Once logged in, the top navigation bar (and your account menu, the circle
avatar in the top-right) links to everything. Here's what each part is for:

| Section | What it's for |
|---|---|
| **Dashboard** | Your homepage after logging in. Shows a greeting, your recent activity, your latest quiz result, your saved bookmarks, personal career recommendations, and which careers are trending site-wide. |
| **Career Bank** | Browse and search every career in the database. Filter by domain, required skill, salary range, or demand level. Search understands typos (try typing "enginer"). You can save a filter combination as a "saved search" to reuse later. |
| **Multimedia Center** | Videos, podcasts, and short explainers — mostly real "day in the life" videos from people working in different jobs. Click one to watch it, read its transcript, and rate it (stars or thumbs up/down depending on the item). |
| **Resource Library** | Downloadable PDFs — checklists and guides (resume tips, interview prep, etc). You can preview a PDF inline before deciding to download it. |
| **Success Stories** | Real (and a few clearly-labeled example) stories from people who found their path. View as cards or as a chronological timeline. Anyone logged in can submit their own story — it stays hidden from other users until an admin approves it. |
| **Interest Quiz** | A short, timed quiz (rating scales, sliders, and multiple choice). At the end it scores your interests against 10 career categories and suggests real careers from the Career Bank that match. Your results are saved so you can look back at your history. |
| **Bookmarks** | Anything you've bookmarked (a career, a video, or a resource) lives here. You can add a private note to any bookmark, export your whole list as a PDF, email it to yourself, or generate a public shareable link (with social-share buttons) to show someone else. |
| **Notifications** | The app tells you here when something relevant happens — right now, that's when an admin approves or rejects a story you submitted. |
| **Profile** | Your personal info: education history, skills, interests, work experience, and an optional resume upload (PDF/DOC). This is also what powers your career recommendations if you haven't taken the quiz yet. |
| **Feedback** | A simple form to report a bug, suggest something, or ask a question. You can submit this even if you're not logged in. |
| **Admin Panel** *(admin account only)* | Add, edit, or remove careers, media, and quiz questions. Approve/reject/edit/delete submitted success stories. View all feedback and mark it reviewed/resolved. View usage stats — how many users are active, how many people took the quiz, which careers/media/resources are most popular. |

---

## 6. Turning on real email sending (optional)

Right now, any email the app would send (password reset codes, "email my
bookmarks to me") just gets printed to the server's terminal instead of
actually sent — this is intentional so you can test everything without
needing an email account connected. If you want real emails to go out:

1. Use a Gmail account. Turn on **2-Step Verification** on it
   (Google Account → Security).
2. Create an **App Password**: go to
   `myaccount.google.com/apppasswords`, generate one for "Mail."
3. Open `server/.env` and fill in:
   ```
   EMAIL_USER=your-address@gmail.com
   EMAIL_PASS=the-16-character-app-password-google-gave-you
   EMAIL_FROM=your-address@gmail.com
   ```
4. Restart the server (`Ctrl+C` then `npm run dev` again in Terminal 1).

That's it — no code changes needed. From then on, password resets and
bookmark emails will really be sent instead of printed.

---

## 7. If something goes wrong

| Problem | Likely fix |
|---|---|
| `npm run dev` fails with "no package.json" | You're in the wrong folder — you must be inside `client/` or `server/`, not the top-level `pathseeker/` folder. |
| Server won't connect to the database | Check `MONGODB_URI` in `server/.env` is correct, and that your MongoDB Atlas cluster isn't paused (Atlas free clusters pause after inactivity — resume it from the Atlas website). |
| "Port already in use" | Something else is already using that port. Stop the other process, or ask to change the port. |
| Client loads but every page shows an error / no data | Make sure the **server** (Terminal 1) is actually running — the client alone can't do anything without it. |
| You broke something in the database and want a clean slate | Re-run the `npm run seed:*` commands from Section 2.3 — they wipe and recreate that section's data. |

---

## 8. Where things live (quick map)

```
pathseeker/
├── client/     ← the website (React). See docs/CODE_GUIDE.md for details.
├── server/     ← the backend (Express + MongoDB). See docs/CODE_GUIDE.md.
├── README.md   ← you are here
└── docs/
    ├── API_GUIDE.md   ← what every backend endpoint does
    └── CODE_GUIDE.md  ← what every file/folder is for
```
