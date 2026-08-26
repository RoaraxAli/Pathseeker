# Code Guide — a tour of every folder and file

This explains **what each file is for**, in plain language, so you can find
your way around without having to open and read every single file yourself.
It doesn't require prior programming experience, but it helps to know these
few words first:

- **Model** = a description of one "type of thing" the app stores (a User,
  a Career, a Bookmark...) and what information it holds. Think of it like
  a form template — it says "every Career has a title, a domain, a salary
  range," etc.
- **Route** = the code that runs when a specific API address is called
  (see `docs/API_GUIDE.md` for the full list of addresses).
- **Middleware** = a small check that runs *before* a route's main code —
  usually "is this person logged in?" or "are they an admin?"
- **Component** = a reusable piece of a web page (a button, a form, a card)
  built in React.
- **Page** = a full screen of the app, usually made of several components.

---

## Part 1 — The Server (`server/`)

The server is a Node.js program using a framework called **Express**. It
talks to **MongoDB** (the database) using a library called **Mongoose**.

```
server/
├── server.js              ← the starting point — see below
├── db.js                  ← connects to MongoDB
├── models/                ← what each "thing" in the database looks like
├── routes/                ← the actual API logic, one file per feature
├── middleware/             ← reusable checks (login required? admin only? file uploads)
├── utils/                  ← small helper functions used across multiple routes
├── scripts/                ← one-off commands you run from the terminal (seeding data)
└── uploads/                ← where uploaded files (resumes, videos, PDFs) are physically saved
```

### `server.js` — the starting point

This is the file that actually starts the server. In order, it:
1. Connects to the database.
2. Sets up middleware that runs on *every* request (allowing the client to
   talk to it, reading JSON data from requests).
3. Registers every feature's routes at their web address (e.g. anything
   starting with `/api/careers` gets handed to `routes/careerRoutes.js`).
4. Starts listening for requests on port 5001.

### `db.js`

One job: connect to MongoDB using the address in `.env`, and stop the
server with a clear error message if that address is missing or still has
placeholder text in it (so you never accidentally run the app pointing at
nothing).

### `models/` — what gets stored, and its shape

Each file here defines one collection of data. In plain terms:

| File | What it represents |
|---|---|
| `User.js` | A person's account: name, email, hashed password, role, and their profile (education, skills, interests, work experience, resume). Passwords are never stored as plain text — they're scrambled ("hashed") in a way that can be checked but not reversed. |
| `Career.js` | One career entry: title, domain, description, required skills, salary range, and demand level. |
| `QuizQuestion.js` | One quiz question: its text, its type (rating/slider/multiple-choice), and which career categories it affects (this scoring info is kept hidden from regular users — see the API guide). |
| `QuizAttempt.js` | A record of one time someone took the quiz: their answers, their computed scores, and which careers got suggested. |
| `Media.js` | One video/podcast/explainer: title, type, where the actual video file/link lives, its transcript, and whether it uses star or thumbs ratings. |
| `MediaRating.js` | One person's rating of one media item. |
| `Resource.js` | One downloadable PDF: title, type, where the file lives, and how many times it's been downloaded. |
| `SuccessStory.js` | One submitted story: content, who submitted it, and its approval status (pending/approved/rejected). |
| `Bookmark.js` | One "I saved this" record — generalized so the same model works for bookmarking a career, a video, a resource, or a story (it just remembers *which type* of thing plus its ID). |
| `BookmarkShare.js` | A frozen snapshot of someone's bookmarks at the moment they generated a public share link. |
| `Feedback.js` | One submitted bug report / suggestion / question. |
| `Notification.js` | One in-app notification for one user. |
| `SavedSearch.js` | One saved Career Bank filter combination. |
| `Ping.js` | Leftover from the very first "does the database work at all?" test route from Phase 0 — not used by any real feature. |

### `routes/` — the actual logic behind every API address

Each file handles one feature area and is named to match (e.g.
`careerRoutes.js` handles everything under `/api/careers`). Every single
endpoint in every one of these files is documented in
[`docs/API_GUIDE.md`](API_GUIDE.md) — that's the file to read for "what
does calling this address actually do."

### `middleware/` — reusable gatekeepers

| File | What it does |
|---|---|
| `auth.js` | Three checks used across almost every route file: **`protect`** (rejects the request unless a valid login token is attached), **`optionalAuth`** (attaches the user if a valid token is present, but doesn't reject the request if not — used on pages that work for everyone but behave slightly differently when you're logged in, like showing "your rating" on a video), and **`requireRole`** (rejects the request unless the logged-in user has a specific role, e.g. `admin`). |
| `upload.js`, `uploadMedia.js`, `uploadResource.js` | Configure how file uploads are handled for resumes, media files, and resource PDFs respectively — where they get saved on disk, what file types are allowed, and the maximum file size. |

### `utils/` — small reusable helpers

| File | What it does |
|---|---|
| `serializeUser.js` | Takes a full User record and strips it down to only the fields that are safe to send to the browser (never the password, never reset codes). |
| `otp.js` | Generates the random 6-digit password-reset code and a way to check a submitted code against the stored one without keeping the real code in the database (only a scrambled version is stored). |
| `sendEmail.js` | Sends an email if `EMAIL_USER`/`EMAIL_PASS` are configured in `.env`; otherwise just prints what *would* have been sent to the terminal, so email-dependent features are still testable without real email set up. |
| `careerSearchIndex.js` | Builds and caches the "fuzzy search" index for the Career Bank (using a library called Fuse.js) so typo-tolerant search doesn't have to rebuild itself on every keystroke. |
| `scoreQuiz.js` | The actual quiz-scoring math — explained in plain English in the API Guide's Interest Quiz section. |
| `aggregateRating.js` | Given a media item, adds up everyone's ratings into either an average star rating or a "% liked this" number. |
| `generateSamplePdf.js` / `generateListPdf.js` | Build real, valid PDF files from scratch (no external PDF library) — one for single-page resource documents (checklists/guides), one for the possibly-multi-page bookmark export. |
| `notify.js` | One function, `notify(userId, type, message, link)`, used by other routes to create a notification for someone without needing to duplicate that logic everywhere. |

### `scripts/` — one-off terminal commands

These aren't part of the running server — you run them manually with
`npm run seed:...` (see the main README, Section 2.3) to fill the database
with starter data, or to create/update the admin account.

### `uploads/`

Where files people actually upload get physically saved on disk —
`uploads/media/`, `uploads/resources/` (publicly viewable, since that
content is meant to be shared) — resumes are stored separately and only
served back to the account that uploaded them.

---

## Part 2 — The Client (`client/`)

The client is a **React** app (a JavaScript framework for building
interactive web pages), built and served using a tool called **Vite**.

```
client/src/
├── main.jsx           ← the very first file that runs
├── App.jsx             ← defines the navigation bar and every page's web address
├── App.css / index.css ← the visual design system (colors, spacing, fonts, buttons...)
├── api/client.js        ← the one place that knows how to talk to the server
├── context/AuthContext.jsx ← keeps track of "who's logged in" across the whole app
├── components/          ← small reusable pieces used on multiple pages
└── pages/                ← one file per full screen of the app
```

### `main.jsx`

The very first code that runs. It wraps the whole app in two things every
page needs access to: the router (so URLs like `/careers` show the right
page) and the login-state provider (`AuthContext`, described below).

### `App.jsx`

Two jobs:
1. **The navigation bar** — the header at the top of every page, including
   the account menu (the little circle avatar) that expands into
   Dashboard/Bookmarks/Notifications/Profile/Admin/Log out.
2. **The route map** — a list matching every web address (like `/quiz` or
   `/admin/careers`) to the page component that should be shown. Some
   routes are wrapped in `<ProtectedRoute>` (redirects to login if you're
   not logged in) or `<AdminRoute>` (redirects away if you're not an
   admin).

### `api/client.js`

Every single network request the app makes to the server goes through one
function here, `apiFetch(path, options)`. It automatically attaches your
login token (if you have one) and turns error responses into a clean error
message. This means individual pages don't need to repeat that boilerplate
— they just call `apiFetch('/careers')` and get back data or a thrown
error.

### `context/AuthContext.jsx`

Keeps track of who's currently logged in, everywhere in the app, without
every page needing to check separately. It exposes `login()`, `register()`,
`logout()`, and the current `user` object. When the app first loads, it
checks if a login token was saved from last time and, if so, quietly logs
you back in.

### `components/` — small reusable pieces

| File | What it does |
|---|---|
| `BookmarkButton.jsx` | The "☆ Bookmark" / "★ Bookmarked" toggle button used on career, media, and other detail pages. Checks whether the item is already bookmarked when it first appears, and adds/removes the bookmark when clicked. |
| `ProtectedRoute.jsx` | A wrapper that sends you to `/login` if you try to visit a page that requires being logged in. |
| `AdminRoute.jsx` | Same idea, but for admin-only pages — sends you home if you're logged in but not an admin. |

### `pages/` — one file per screen

| File | The screen it shows |
|---|---|
| `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx` | Signing in, creating an account, and the two-step password-reset flow. |
| `Profile.jsx` | Editing your education, skills, interests, work experience, and resume. |
| `Dashboard.jsx` | Your personal homepage after logging in — greeting, recent activity, quiz result, saved items, recommendations, trending careers. |
| `CareerBank.jsx` | Browsing/searching/filtering careers, plus saved searches. |
| `Quiz.jsx` | The actual interest quiz — one question at a time, with a countdown timer, ending in a results screen. |
| `QuizHistory.jsx` | The list of your past quiz attempts. |
| `MediaCenter.jsx`, `MediaDetail.jsx` | Browsing videos/podcasts, and watching/rating one plus its transcript and related items. |
| `ResourceLibrary.jsx` | Browsing and previewing/downloading PDF resources. |
| `SuccessStories.jsx` | Reading stories (cards or timeline view) and submitting your own. |
| `Bookmarks.jsx`, `BookmarkShareView.jsx` | Your saved bookmarks (with export/share tools), and the public page someone sees when you share a bookmark link with them. |
| `Feedback.jsx` | The bug/suggestion/question form. |
| `Notifications.jsx` | Your notification inbox. |
| `AdminPanel.jsx` | The admin section's home page — links to every admin tool. |
| `admin/AdminCareers.jsx`, `admin/AdminMedia.jsx`, `admin/AdminQuizQuestions.jsx`, `admin/AdminStories.jsx` | Add/edit/delete tools for each of those content types. |
| `admin/AdminFeedback.jsx` | Viewing all submitted feedback and its statistics, and updating its status. |
| `admin/AdminUsageStats.jsx` | The usage-statistics dashboard (active users, quiz attempts, popular content). |

### The visual design (`App.css`, `index.css`)

All the colors, spacing, fonts, and reusable visual pieces (buttons,
cards, badges, form fields) are defined once in `index.css` as a set of
named values (e.g. "the accent color" or "the standard card style") and
then reused everywhere, rather than each page inventing its own styling.
This is what keeps every page looking consistent. `App.css` holds styles
specific to the navigation bar and the homepage's hero section.

---

## How a typical action flows through the whole system

To tie it all together, here's what actually happens, step by step, when
you click **"Bookmark"** on a career:

1. **Component**: `BookmarkButton.jsx` runs its `toggle()` function.
2. **Client → Server**: it calls `apiFetch('/bookmarks', { method: 'POST', body: { itemType: 'career', itemId: '...' } })`.
3. **`api/client.js`** attaches your login token to the request and sends it to `http://localhost:5001/api/bookmarks`.
4. **Server**: `server.js` sees the address starts with `/api/bookmarks` and hands it to `routes/bookmarkRoutes.js`.
5. **Middleware**: `middleware/auth.js`'s `protect` check runs first — confirms your token is valid, rejects the request if not.
6. **Route logic**: checks the career ID is real, then saves (or updates) a `Bookmark` document in MongoDB via the `models/Bookmark.js` model.
7. **Response**: the server sends back the saved bookmark as data.
8. **Component**: `BookmarkButton.jsx` receives that response and updates the button to show "★ Bookmarked".

Every other feature in the app follows this same basic shape — a page
calls `apiFetch`, a route file in `server/routes/` handles it (usually
after a middleware check), a model reads or writes MongoDB, and the
response flows back to update what you see.
