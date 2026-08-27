# PathSeeker — Discover What Fits You Best...
### Aptech TechWiz 6 | Theme: Career Passport | Category: Full-Stack Application Development

---

## 1. Problem Definition & Background
In today’s competitive global market, students, graduates, and professionals struggle to find personalized career trajectories matching their strengths. Existing portals are either generic, static, or fragmented. **PathSeeker** is a responsive, full-stack **Career Passport** platform providing interest-based AI quizzes, dynamic global career exploration, multimedia masterclasses with transcripts, real timeline success stories, and downloadable ATS resume toolkits.

---

## 2. Key Architecture & Features

### A. Authentication & Role-Based Access
- Role-based account creation: **Student**, **Graduate**, **Working Professional**, and **Administrator**.
- JWT session management with bcrypt cryptographic password hashing.
- Google OAuth 2.0 and OTP / tokenized password reset.
- Profile customization: Education Level, Skills, Interests, Work Experience, Resume link, and Target Roles.

### B. Dynamic User Career Passport (`/dashboard`)
1. **Passport Overview**: Personalized greeting according to stage, Career Readiness Score, Active Goals, and recent quiz traits.
2. **Dynamic Career Bank**: Multi-level filtering by Domain, Required Skills, Salary Range, and Job Demand level (Explosive, High, Moderate), with detailed career blueprints and day-in-the-life tasks.
3. **AI-Powered Interest Quiz**: 5-step cognitive assessment with Likert scales & scenario questions, automated trait scoring (Software & Cloud, AI & Data, Design & UX, Leadership, Healthcare, Cybersecurity), percentage role matching, and history tracker.
4. **Interactive Multimedia Center**: Video explainers and podcasts with embedded media player, interactive transcript reader, and 5-star community ratings synced to MongoDB.
5. **Success Stories Hub**: Timeline visualizer (*Educational Path \(\rightarrow\) Challenges \(\rightarrow\) Key Milestones \(\rightarrow\) Career Outcome & Advice*) with community submission modal.
6. **Document Resource Library**: Categorized PDF toolkits, ATS resume templates, roadmaps, and cheat sheets with auto-preview and download counter.
7. **My Sticky Notes & Bookmarks**: Save careers/videos/resources with editable personal sticky notes, shareable links, and instant summary export.
8. **Feedback & Support**: Category tagging (Bug, Suggestion, Query, Appreciation) with sentiment tracking and in-app response notifications.

### C. Admin Control Panel (`/admin/*`)
- **Dashboard**: Live system telemetry (Active Seekers, Quiz Submissions, Total Downloads, Sentiment Analysis).
- **Careers Manager**: Full database CRUD for global job roles, salary bands, and trending tags.
- **Stories Moderation**: Approve, reject, or feature community journey submissions.
- **Feedback & Inquiries**: Resolve bug reports and post replies that trigger in-app user notifications.
- **Multimedia Manager**: Publish video/podcast masterclasses and inline transcripts.
- **User Directory & Roles**: Manage seeker personas (Student, Graduate, Professional, Admin).
- **Resources Manager**: Upload/edit downloadable career documents and track download metrics.
- **System Settings & Data Seeder**: Database status monitoring and one-click initial dataset re-seeder.

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Axios, React Router 6, Vite.
- **Backend**: Node.js, Express.js REST API, JSON Web Tokens (JWT), bcryptjs.
- **Database**: MongoDB Atlas / Mongoose (100% dynamic models and zero hardcoded records).
- **Deployment**: Vercel Serverless Function (`/api/index.js`) + Single Page Application.

---

## 4. Test User Credentials

| Role | Email | Password | Persona Purpose |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@pathseeker.org` | `AdminPass2026!` | Full CRUD moderation, analytics & user management |
| **Student** | `student@pathseeker.org` | `StudentPass2026!` | Foundational guidance, AI quiz & scholarships |
| **Graduate** | `graduate@pathseeker.org` | `GraduatePass2026!` | Entry jobs, ATS resume templates & interview prep |
| **Professional** | `pro@pathseeker.org` | `ProfessionalPass2026!` | Leadership tracks, salary benchmarks & career pivots |

---

## 5. Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance

### Steps:
1. **Clone repository**:
   ```bash
   git clone https://github.com/RoaraxAli/TicketToTechwiz.git
   cd TicketToTechwiz
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` in the project root:
   ```env
   VITE_API_URL=/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start Development Environment**:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`

5. **Production Build**:
   ```bash
   npm run build
   ```

---

## 6. Database Entity Relationships (ER Summary)
- **Users**: `_id`, `email`, `password`, `displayName`, `role` (`student`/`graduate`/`professional`/`admin`), `educationLevel`, `skills`, `interests`, `workExperience`, `resumeUrl`, `targetRole`, `readinessScore`.
- **Careers**: `_id`, `title`, `slug`, `domain`, `description`, `requiredSkills`, `educationPath`, `salaryRange` (`entry`, `mid`, `senior`), `jobDemand`, `growthRate`, `certifications`, `dailyTasks`, `isTrending`, `viewsCount`, `bookmarkCount`.
- **Multimedia**: `_id`, `title`, `type` (`video`/`podcast`/`explainer`), `url`, `thumbnailUrl`, `domain`, `duration`, `speaker`, `transcript`, `ratingAvg`, `ratingCount`, `ratings` (`[{ userId, rating }]`).
- **QuizQuestions**: `_id`, `questionText`, `category`, `type`, `options` (`[{ label, traitScores }]`), `timeLimitSec`, `order`.
- **QuizAttempts**: `_id`, `userId`, `scores` (`tech`, `data`, `creative`, `leadership`, `healthcare`, `cybersecurity`), `primaryDomain`, `recommendedCareers`, `completedAt`.
- **SuccessStories**: `_id`, `name`, `avatarUrl`, `domain`, `currentRole`, `company`, `educationPath`, `challenges`, `milestones`, `outcome`, `advice`, `status` (`pending`/`approved`/`featured`), `likesCount`.
- **Resources**: `_id`, `title`, `category`, `description`, `fileUrl`, `previewSnippet`, `fileType`, `fileSize`, `tags`, `targetAudience`, `downloadsCount`.
- **Feedback**: `_id`, `userId`, `userName`, `userEmail`, `category`, `subject`, `message`, `sentiment`, `status`, `adminResponse`, `respondedAt`.
- **Bookmarks**: `_id`, `userId`, `itemType`, `itemId`, `title`, `subtitle`, `notes`, `tags`.
- **Notifications**: `_id`, `userId`, `title`, `message`, `type`, `read`, `createdAt`.
