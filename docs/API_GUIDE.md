# API Guide — what every backend endpoint does

This explains every "API endpoint" the server offers. An API endpoint is
just a specific web address the client asks the server to do something
with — like a phone extension that connects you to one specific department.

**How to read this document:**

- Every address starts with `/api` (e.g. the full address for `/auth/login`
  is really `http://localhost:5001/api/auth/login`).
- **Method** is the "type" of request — think of it like the verb:
  - `GET` = "give me information" (doesn't change anything)
  - `POST` = "create something new"
  - `PUT` = "replace/update something that exists"
  - `PATCH` = "update just part of something"
  - `DELETE` = "remove something"
- **Who can use it** tells you what access is required:
  - 🌍 **Public** — anyone, even without logging in
  - 🔒 **Logged in** — you must be logged in (any role)
  - 👑 **Admin only** — you must be logged in *and* your account's role must be `admin`
- **"Body"** means the data you send along with the request (like filling
  out a form). **"Response"** is what you get back.

If you want to try any of these yourself outside the app, you can use a
tool like `curl` in a terminal, or an app like Postman.

---

## 1. Authentication (`/api/auth`) — registering, logging in, resetting passwords

| Method & Path | Who | What it does |
|---|---|---|
| `POST /api/auth/register` | 🌍 Public | Creates a new account. Send `{ name, email, password, role }`. `role` must be `student`, `graduate`, or `professional` — you can never register as `admin` this way. Returns a login token and your new account info. |
| `POST /api/auth/login` | 🌍 Public | Logs in. Send `{ email, password }`. If correct, returns a login **token** (a long random string proving who you are) and your account info. The client stores this token and sends it along with every future request that needs to know who you are. |
| `GET /api/auth/me` | 🔒 Logged in | Returns your own account info. Mostly used by the app to check "is my saved login token still valid?" when you first open the site. |
| `POST /api/auth/forgot-password` | 🌍 Public | Send `{ email }`. If that email has an account, a 6-digit reset code is generated and emailed (or printed to the server terminal if email isn't set up — see the main README). Always responds the same way whether or not the email exists, so nobody can use this to check who has an account. |
| `POST /api/auth/reset-password` | 🌍 Public | Send `{ email, otp, newPassword }` (`otp` is the 6-digit code from the previous step). If the code matches and hasn't expired (10-minute limit), your password is changed. |

---

## 2. Your Profile (`/api/users`) — education, skills, resume

Everything here is 🔒 **logged in only**, and only ever affects *your own*
account — there's no way to edit someone else's profile through these.

| Method & Path | What it does |
|---|---|
| `GET /api/users/me` | Returns your full profile: education, skills, interests, work experience, and resume info. |
| `PUT /api/users/me` | Updates your profile. Send any of `{ education, skills, interests, workExperience }` — only the fields you include get changed. (You *cannot* change your name, email, password, or role through this endpoint — those are protected on purpose, to stop someone quietly promoting themselves to admin by editing their profile.) |
| `POST /api/users/me/resume` | Uploads a resume file (PDF, DOC, or DOCX, max 5MB). Replaces any resume you'd already uploaded. Send the file as `multipart/form-data` with field name `resume`. |
| `GET /api/users/me/resume` | Downloads your own resume file. |
| `DELETE /api/users/me/resume` | Removes your uploaded resume. |

---

## 3. Career Bank (`/api/careers`) — browsing and searching careers

| Method & Path | Who | What it does |
|---|---|---|
| `GET /api/careers` | 🌍 Public | Lists careers. Supports filters as URL query options: `?domain=Technology&demand=high&skills=Python&salaryMin=50000&salaryMax=120000&page=1&limit=50`. All filters are optional and combine together. |
| `GET /api/careers/meta` | 🌍 Public | Returns the list of all domains, all skills, and the three demand levels — used to fill in the filter dropdown menus. |
| `GET /api/careers/search?q=...` | 🌍 Public | **Typo-tolerant** search by name. Type "enginer" and it'll still find "Engineer" jobs. Searches title, domain, skills, and tags together and ranks by relevance. |
| `GET /api/careers/suggest?q=...` | 🌍 Public | Same typo-tolerant matching as search, but returns a short list of just titles — used for the autocomplete dropdown while you type. |
| `GET /api/careers/:id` | 🌍 Public | One specific career's full details. |
| `POST /api/careers` | 👑 Admin only | Creates a new career. Send `{ title, domain, description, requiredSkills, salaryRange: { min, max }, jobDemand }`. |
| `PUT /api/careers/:id` | 👑 Admin only | Edits an existing career (send whichever fields you want to change). |
| `DELETE /api/careers/:id` | 👑 Admin only | Removes a career. |

---

## 4. Saved Searches (`/api/saved-searches`) — reusable Career Bank filters

All 🔒 **logged in only**, and each user only ever sees their own saved
searches.

| Method & Path | What it does |
|---|---|
| `GET /api/saved-searches` | Lists your saved filter combinations. |
| `POST /api/saved-searches` | Saves a new one. Send `{ name, filters: { q, domain, skills, salaryMin, salaryMax, demand } }`. |
| `DELETE /api/saved-searches/:id` | Deletes one of your saved searches. |

---

## 5. Interest Quiz (`/api/quiz`)

Everything here needs you to be 🔒 **logged in** (results are personal, so
there's no point using it while logged out) — except the `admin/questions`
management routes, which additionally need 👑 **admin**.

| Method & Path | Who | What it does |
|---|---|---|
| `GET /api/quiz/questions` | 🔒 Logged in | Returns all quiz questions, in order. Each question includes its type (`rating`, `slider`, or `multiple-choice`), the time limit, and — for multiple-choice — the list of options. **The scoring weights are hidden** so you can't peek at how your answers will be scored. |
| `POST /api/quiz/submit` | 🔒 Logged in | Send your answers: `{ answers: [{ question: "<id>", value: <your answer> }, ...] }`. The server scores every one of the 10 career categories (0–100%), picks your top matches, finds real careers from the Career Bank that fit those categories, and saves the whole attempt to your history. Returns the scores, your top categories, and the suggested careers. |
| `GET /api/quiz/history` | 🔒 Logged in | Lists every quiz attempt you've taken, most recent first. |
| `GET /api/quiz/history/:id` | 🔒 Logged in | One specific past attempt's full detail. Only works for your own attempts. |
| `GET /api/quiz/admin/questions` | 👑 Admin only | Same as `/questions` above, but includes the scoring weights — used by the admin panel's editor. |
| `POST /api/quiz/admin/questions` | 👑 Admin only | Creates a new quiz question. |
| `PUT /api/quiz/admin/questions/:id` | 👑 Admin only | Edits an existing question. |
| `DELETE /api/quiz/admin/questions/:id` | 👑 Admin only | Removes a question. |

**How scoring actually works, in plain terms:** every question is tagged
behind the scenes with which career category (or categories) it relates to,
and by how much. A rating/slider answer contributes a fraction of that
weight based on how high you scored it; a multiple-choice answer
contributes its chosen option's full weight. Add it all up per category,
divide by the maximum possible for that category, and you get a 0–100%
score per category. Your top 1–3 categories (that scored above 0) become
your "top matches," and the server looks up real careers tagged with those
same category names.

---

## 6. Multimedia Center (`/api/media`) — videos, podcasts, explainers

| Method & Path | Who | What it does |
|---|---|---|
| `GET /api/media` | 🌍 Public | Lists media items. Filters: `?type=video&domain=Technology&tag=coding&q=engineer`. |
| `GET /api/media/meta` | 🌍 Public | Lists available domains, tags, and types (video/podcast/explainer) for filter menus. |
| `GET /api/media/:id` | 🌍 Public (extra info if logged in) | One item's full detail: description, transcript, the current average rating, and up to 4 related items (matched by domain or shared tags). If you're logged in, it also tells you your own existing rating on this item, if any. |
| `POST /api/media/:id/rating` | 🔒 Logged in | Rates an item. If the item uses star ratings, send `{ stars: 1-5 }`; if it uses thumbs, send `{ thumbs: "up" }` or `{ thumbs: "down" }`. Rating the same item again updates your previous rating rather than adding a second one. |
| `DELETE /api/media/:id/rating` | 🔒 Logged in | Removes your rating from an item. |
| `POST /api/media` | 👑 Admin only | Adds a new media item. Either send `externalUrl` (e.g. a YouTube embed link) as normal form data, **or** upload an actual video/audio file as `multipart/form-data` with field name `media`. |
| `PUT /api/media/:id` | 👑 Admin only | Edits an item's details, and optionally replaces its file or external link. |
| `DELETE /api/media/:id` | 👑 Admin only | Removes a media item (and its uploaded file, and everyone's ratings on it). |

---

## 7. Resource Library (`/api/resources`) — downloadable PDFs

| Method & Path | Who | What it does |
|---|---|---|
| `GET /api/resources` | 🌍 Public | Lists resources. Filters: `?type=checklist&domain=Business&q=resume`. |
| `GET /api/resources/meta` | 🌍 Public | Lists available domains, tags, and types for filter menus. |
| `GET /api/resources/:id` | 🌍 Public | One resource's detail, including a `previewUrl` you can open in an `<iframe>` to view it without downloading. |
| `GET /api/resources/:id/download` | 🌍 Public | **This is the real download link.** Unlike the preview link, using this one increases the resource's download counter and forces the browser to save the file (rather than just display it). |
| `POST /api/resources` | 👑 Admin only | Adds a resource — either upload a file (`multipart/form-data`, field name `file`) or link to an `externalUrl`. |
| `DELETE /api/resources/:id` | 👑 Admin only | Removes a resource (and its uploaded file, if any). |

---

## 8. Success Stories (`/api/success-stories`)

| Method & Path | Who | What it does |
|---|---|---|
| `GET /api/success-stories` | 🌍 Public | Lists only the **approved** stories. Supports `?domain=...&q=...&sort=timeline` (`sort=timeline` returns them oldest-first for the Timeline view; otherwise newest-first for the Cards view). |
| `GET /api/success-stories/meta` | 🌍 Public | Lists domains/tags used by approved stories, for filter menus. |
| `GET /api/success-stories/mine` | 🔒 Logged in | Lists **your own** submissions, at any status (pending, approved, or rejected) — so you can track what happened to what you submitted. |
| `GET /api/success-stories/pending` | 👑 Admin only | The review queue — every story waiting for a decision. |
| `GET /api/success-stories/admin/all` | 👑 Admin only | Every story regardless of status, for the admin's full management page. |
| `GET /api/success-stories/:id` | 🌍 Public (with exceptions) | Returns one story if it's approved. If it's still pending/rejected, only the person who submitted it (or an admin) can see it — everyone else gets a "not found," so unapproved content never leaks publicly. |
| `POST /api/success-stories` | 🔒 Logged in | Submits a new story: `{ title, content, domain, tags, storyDate, imageUrl }`. It always starts as `pending` — it won't show up publicly until an admin approves it. |
| `PUT /api/success-stories/:id` | 👑 Admin only | Directly edits a story's content (title/author/content/domain/tags/date/image) — separate from approving/rejecting it. |
| `PUT /api/success-stories/:id/review` | 👑 Admin only | Approves or rejects a story: send `{ status: "approved" }` or `{ status: "rejected" }`. **This also sends the original submitter a notification** telling them the result. |
| `DELETE /api/success-stories/:id` | 👑 Admin only | Removes a story entirely. |

---

## 9. Bookmarks (`/api/bookmarks`) — saving careers/media/resources for later

All 🔒 **logged in only**, except the one specifically public route noted
below.

| Method & Path | Who | What it does |
|---|---|---|
| `GET /api/bookmarks` | 🔒 Logged in | Lists your bookmarks. Optional `?itemType=career` to filter to just one kind (`career`, `media`, `resource`, or `story`). |
| `POST /api/bookmarks` | 🔒 Logged in | Bookmarks something: `{ itemType, itemId, note }`. Bookmarking the same thing again just updates your note instead of creating a duplicate. |
| `PUT /api/bookmarks/:id` | 🔒 Logged in | Updates the note on one of your bookmarks. |
| `DELETE /api/bookmarks/:id` | 🔒 Logged in | Removes one of your bookmarks. |
| `GET /api/bookmarks/export/pdf` | 🔒 Logged in | Generates and downloads a PDF listing all your bookmarks (with notes) — built on the fly, not saved anywhere on the server. |
| `POST /api/bookmarks/export/email` | 🔒 Logged in | Emails your bookmark list to your own account email (or `{ toEmail: "..." }` if you want to send it somewhere else). |
| `POST /api/bookmarks/share` | 🔒 Logged in | Creates a public, read-only shareable link — a frozen snapshot of your current bookmarks. Returns a `token`; the shareable page is `/share/bookmarks/<token>` on the website. |
| `GET /api/bookmarks/share/:token` | 🌍 **Public** | Anyone with the link (no login needed) can view that snapshot — this is what powers the shared page. Editing your bookmarks later does **not** change what was already shared. |

---

## 10. Feedback (`/api/feedback`) — bug reports, suggestions, questions

| Method & Path | Who | What it does |
|---|---|---|
| `POST /api/feedback` | 🌍 Public | Submits feedback: `{ type, message, email }`. `type` must be `bug`, `suggestion`, or `query`. If you're logged in, it's automatically tied to your account and `email` is optional; if you're not logged in, you must include an `email` so there's a way to follow up. |
| `GET /api/feedback` | 👑 Admin only | Lists all submitted feedback. Optional `?type=bug&status=open` filters. |
| `PATCH /api/feedback/:id` | 👑 Admin only | Updates a feedback item's status: `{ status: "open" }`, `"reviewed"`, or `"resolved"`. |

---

## 11. Notifications (`/api/notifications`)

All 🔒 **logged in only**, and always scoped to your own notifications.

| Method & Path | What it does |
|---|---|
| `GET /api/notifications` | Lists your notifications, newest first (up to 50). |
| `GET /api/notifications/unread-count` | Just the number of unread notifications — used for the little red badge in the nav bar. |
| `PATCH /api/notifications/read-all` | Marks every one of your notifications as read. |
| `PATCH /api/notifications/:id/read` | Marks one notification as read. |
| `DELETE /api/notifications/:id` | Deletes one notification. |

*(Right now, the only thing that actually creates a notification is an
admin approving or rejecting your submitted success story. More triggers
can be added later the same way.)*

---

## 12. Admin Analytics (`/api/admin`)

Everything here is 👑 **admin only**.

| Method & Path | What it does |
|---|---|
| `GET /api/admin/analytics/feedback` | Feedback counts broken down by type (bug/suggestion/query) and by status (open/reviewed/resolved), plus the 10 most recent submissions. |
| `GET /api/admin/analytics/usage` | Real usage numbers: total users and users-by-role, how many users logged in during the last 7/30 days, total and recent quiz attempts, content counts (careers/media/resources), and "popular content" — the most-bookmarked careers and media, most-downloaded resources, and most-rated media, all computed from real activity (not made up). |

---

## 13. Dashboard (`/api/dashboard`)

| Method & Path | Who | What it does |
|---|---|---|
| `GET /api/dashboard/summary` | 🔒 Logged in | One combined response with everything your personal Dashboard page needs: your recent activity (bookmarks, quiz attempts, story submissions — merged and sorted by date), your latest quiz result, your recent bookmarks, personalized career recommendations, and site-wide trending careers. |

**How recommendations are chosen:** the server checks, in order —
1. Did you take the quiz? → recommend careers matching your top quiz categories.
2. If not (or no matches) → recommend careers matching the skills/interests on your Profile.
3. If neither → fall back to generally high-demand careers.

Careers you've already bookmarked are never suggested again.

**How "trending" is chosen:** the careers bookmarked by the most different
people (across the whole site, not just you) in the last 30 days.

---

## A note on file uploads

A few endpoints accept files instead of plain text/numbers (`POST
/api/users/me/resume`, `POST`/`PUT /api/media`, `POST /api/resources`).
These use a format called `multipart/form-data` — it's what a normal HTML
`<input type="file">` sends automatically, so you don't need to think about
it while using the actual website. It only matters if you're testing the
API directly with a tool like `curl` or Postman, where you'd need to
attach the file rather than put it in a JSON body.
