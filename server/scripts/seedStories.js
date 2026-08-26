// Populates Success Stories with example content — these are clearly
// fictional/illustrative, not real people, and are labeled as such.
// Requires the admin account to already exist (npm run seed:admin first).
// Usage: npm run seed:stories

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db');
const User = require('../models/User');
const SuccessStory = require('../models/SuccessStory');

const stories = [
  {
    title: 'From Bootcamp to Backend Engineer',
    authorName: 'Jordan M. (example story)',
    domain: 'Technology',
    tags: ['career-change', 'bootcamp'],
    status: 'approved',
    storyDate: new Date('2023-03-15'),
    content:
      "I spent six years in retail management before deciding to switch to software. I did a 12-week bootcamp, built three portfolio projects, and applied to over 80 jobs before landing my first developer role. Eighteen months later I'm a backend engineer at a mid-size startup. The Interest Quiz on this site would have saved me a year of second-guessing.",
  },
  {
    title: 'Nursing School at 30',
    authorName: 'Priya R. (example story)',
    domain: 'Healthcare',
    tags: ['career-change', 'nursing'],
    status: 'approved',
    storyDate: new Date('2023-08-02'),
    content:
      'I went back to school for nursing at 30 after years in an unrelated office job. It was hard balancing classes with a part-time job, but the Career Bank helped me understand the actual day-to-day of the role before I committed. Now I work in a pediatric unit and genuinely look forward to my shifts.',
  },
  {
    title: 'Electrician Apprenticeship Instead of a 4-Year Degree',
    authorName: 'Sam T. (example story)',
    domain: 'Skilled Trades',
    tags: ['trade-school', 'apprenticeship'],
    status: 'approved',
    storyDate: new Date('2024-01-20'),
    content:
      "Everyone around me assumed I'd go to a four-year college. I went the apprenticeship route instead — paid to learn, no student debt, and I was earning a full electrician's wage by 22. I don't regret skipping the traditional path at all.",
  },
  {
    title: 'Switching from Journalism to UX Design',
    authorName: 'Alex K. (example story)',
    domain: 'Design',
    tags: ['career-change', 'design'],
    status: 'approved',
    storyDate: new Date('2024-06-10'),
    content:
      "My journalism degree felt like a dead end as the industry shrank. I noticed I always cared more about how a story's website looked and worked than the writing itself, so I taught myself UX fundamentals and built a case study portfolio. That instinct — noticing what actually held my attention — is exactly what the quiz on this site tries to surface faster.",
  },
  {
    title: 'First-Generation Law School Graduate',
    authorName: 'Morgan D. (example story)',
    domain: 'Law',
    tags: ['first-generation', 'law-school'],
    status: 'approved',
    storyDate: new Date('2025-05-01'),
    content:
      "Nobody in my family had gone to law school, so I had no idea what the actual path looked like. The Career Bank's salary and demand data helped me have a realistic conversation with my family about the tradeoffs before I applied. I start at a public defender's office next month.",
  },
  {
    title: 'Still Figuring It Out — Pending Review',
    authorName: 'Casey P. (example story)',
    domain: 'Business',
    tags: ['in-progress'],
    status: 'pending',
    storyDate: new Date(),
    content:
      "I'm partway through switching from retail into project management and wanted to share where I'm at so far — this one's still awaiting admin approval to demonstrate the review queue.",
  },
];

async function seed() {
  await connectDB();

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('[seed:stories] No admin user found — run `npm run seed:admin` first.');
    process.exit(1);
  }

  await SuccessStory.deleteMany({});
  const docs = stories.map((s) => ({
    ...s,
    submittedBy: admin._id,
    ...(s.status === 'approved' ? { reviewedBy: admin._id, reviewedAt: new Date() } : {}),
  }));
  const inserted = await SuccessStory.insertMany(docs);
  console.log(`[seed:stories] Inserted ${inserted.length} stories`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed:stories] Failed:', err.message);
  process.exit(1);
});
