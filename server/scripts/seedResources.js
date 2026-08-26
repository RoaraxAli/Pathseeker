// Populates the Resource Library with generated (real, valid) PDF files —
// not placeholder links — so preview and download both work when tested.
// Usage: npm run seed:resources

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../db');
const Resource = require('../models/Resource');
const generateSamplePdf = require('../utils/generateSamplePdf');
const { UPLOAD_DIR } = require('../middleware/uploadResource');

const resources = [
  {
    title: 'Resume Checklist',
    description: 'A quick pre-submission checklist to tighten up your resume.',
    type: 'checklist',
    domain: '',
    tags: ['resume', 'job-search'],
    lines: [
      '- Tailor your resume to each job description',
      '- Keep it to one page for early-career roles',
      '- Use action verbs and quantify achievements',
      '- Proofread for typos and consistent formatting',
      '- Save and send as a PDF, not a Word doc',
    ],
  },
  {
    title: 'Interview Preparation Guide',
    description: 'A short guide covering common interview formats and how to prepare.',
    type: 'guide',
    domain: '',
    tags: ['interview', 'job-search'],
    lines: [
      '1. Research the company and the role thoroughly',
      '2. Prepare STAR-format stories for behavioral questions',
      '3. Practice explaining your resume out loud',
      '4. Prepare 2-3 thoughtful questions for the interviewer',
      '5. Follow up with a thank-you note within 24 hours',
    ],
  },
  {
    title: 'Career Change Roadmap',
    description: 'A step-by-step roadmap for switching career paths.',
    type: 'guide',
    domain: '',
    tags: ['career-change', 'planning'],
    lines: [
      'Step 1: Identify transferable skills from your current role',
      'Step 2: Take the Interest Quiz to explore new domains',
      'Step 3: Talk to people already working in your target field',
      'Step 4: Fill skill gaps with a course, certificate, or project',
      'Step 5: Update your resume and start applying',
    ],
  },
  {
    title: 'Networking Tips Sheet',
    description: 'Practical tips for building a professional network from scratch.',
    type: 'checklist',
    domain: '',
    tags: ['networking'],
    lines: [
      '- Start with people you already know (classmates, professors)',
      '- Use informational interviews, not cold asks for a job',
      '- Follow up within a week of meeting someone new',
      '- Offer help before asking for it',
    ],
  },
  {
    title: 'Salary Negotiation Guide',
    description: 'How to research and negotiate a job offer with confidence.',
    type: 'guide',
    domain: 'Business',
    tags: ['salary', 'negotiation'],
    lines: [
      '- Research market rate before the offer stage',
      '- Let the employer name a number first when possible',
      "- Negotiate the full package, not just base salary",
      '- Get the final agreement in writing',
    ],
  },
];

async function seed() {
  await connectDB();
  await Resource.deleteMany({});

  // Clear old generated files so re-running the seed doesn't accumulate.
  for (const f of fs.readdirSync(UPLOAD_DIR)) {
    fs.unlinkSync(path.join(UPLOAD_DIR, f));
  }

  const docs = [];
  for (const r of resources) {
    const buffer = generateSamplePdf(r.title, r.lines);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

    docs.push({
      title: r.title,
      description: r.description,
      type: r.type,
      domain: r.domain,
      tags: r.tags,
      sourceType: 'upload',
      file: {
        filename,
        originalName: `${r.title.replace(/\s+/g, '-')}.pdf`,
        mimeType: 'application/pdf',
        size: buffer.length,
      },
    });
  }

  const inserted = await Resource.insertMany(docs);
  console.log(`[seed:resources] Inserted ${inserted.length} resources with real generated PDFs`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed:resources] Failed:', err.message);
  process.exit(1);
});
