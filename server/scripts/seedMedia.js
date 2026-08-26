// Populates the Multimedia Center with sample content.
// All externalUrl video IDs were verified via web search to be real,
// currently-live YouTube uploads (not guessed) — see PR discussion for
// sources. Transcripts here are short illustrative placeholders for
// demonstrating the transcript-toggle UI, not verbatim captions of the
// linked videos (those aren't something this script has access to).
// Usage: npm run seed:media

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db');
const Media = require('../models/Media');

function youtubeEmbed(id) {
  return `https://www.youtube.com/embed/${id}`;
}
function youtubeThumb(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

const items = [
  {
    title: 'A Day in the Life of a Software Engineer at Meta',
    type: 'video',
    domain: 'Technology',
    tags: ['software', 'coding', 'day-in-the-life'],
    description: 'Follow a software engineer through a typical workday at Meta.',
    sourceType: 'external',
    externalUrl: youtubeEmbed('f9sH5SgCYbY'),
    thumbnailUrl: youtubeThumb('f9sH5SgCYbY'),
    transcript:
      "[Illustrative transcript excerpt] Today I'm walking through my typical day as a software engineer — morning standups, deep-focus coding blocks, code review, and how I balance meetings with actually shipping features.",
    ratingType: 'stars',
  },
  {
    title: 'A Day in the Life of a Registered Nurse',
    type: 'video',
    domain: 'Healthcare',
    tags: ['nursing', 'clinical', 'day-in-the-life'],
    description: 'A registered nurse walks through a full shift, patient care, and teamwork.',
    sourceType: 'external',
    externalUrl: youtubeEmbed('VnNvQvect-U'),
    thumbnailUrl: youtubeThumb('VnNvQvect-U'),
    transcript:
      '[Illustrative transcript excerpt] Every shift starts with handoff from the previous nurse, then rounds to check on each patient, medication administration, and constant communication with doctors and families.',
    ratingType: 'stars',
  },
  {
    title: 'A Day in the Life of an Electrician',
    type: 'video',
    domain: 'Skilled Trades',
    tags: ['electrical', 'trade', 'day-in-the-life'],
    description: 'An electrician shows what a real workday on the job looks like.',
    sourceType: 'external',
    externalUrl: youtubeEmbed('lifunadBZ3U'),
    thumbnailUrl: youtubeThumb('lifunadBZ3U'),
    transcript:
      '[Illustrative transcript excerpt] Safety checks first, then reviewing the job site plan, running wire, and troubleshooting a panel that was giving the client trouble.',
    ratingType: 'thumbs',
  },
  {
    title: 'A Day in the Life of a Lawyer — What Does a Lawyer Actually Do?',
    type: 'video',
    domain: 'Law',
    tags: ['legal', 'attorney', 'day-in-the-life'],
    description: 'A practicing lawyer breaks down what their actual day-to-day work involves.',
    sourceType: 'external',
    externalUrl: youtubeEmbed('fMTLYRedBwo'),
    thumbnailUrl: youtubeThumb('fMTLYRedBwo'),
    transcript:
      "[Illustrative transcript excerpt] Contrary to courtroom dramas, most of my day is spent drafting documents, researching case law, and client calls — court appearances are a smaller slice than people expect.",
    ratingType: 'stars',
  },
  {
    title: 'A Day in the Life of a Graphic Designer',
    type: 'video',
    domain: 'Design',
    tags: ['design', 'creative', 'day-in-the-life'],
    description: 'A graphic designer walks through client work, revisions, and creative process.',
    sourceType: 'external',
    externalUrl: youtubeEmbed('c3k5U8gHAH4'),
    thumbnailUrl: youtubeThumb('c3k5U8gHAH4'),
    transcript:
      '[Illustrative transcript excerpt] I start by reviewing client feedback from yesterday, then block off focus time for concepting before afternoon revisions and a check-in call.',
    ratingType: 'stars',
  },
  {
    title: 'Day in the Life of a Financial Analyst in Corporate Finance',
    type: 'video',
    domain: 'Finance',
    tags: ['finance', 'corporate', 'day-in-the-life'],
    description: 'A financial analyst shares their daily workflow in a corporate finance role.',
    sourceType: 'external',
    externalUrl: youtubeEmbed('QcCWRXzrnRk'),
    thumbnailUrl: youtubeThumb('QcCWRXzrnRk'),
    transcript:
      '[Illustrative transcript excerpt] Mornings are for checking overnight market movement and updating models, then a mix of meetings and forecasting work in the afternoon.',
    ratingType: 'thumbs',
  },
  {
    title: 'How to Choose a Career Based on Your Interests',
    type: 'explainer',
    domain: '',
    tags: ['career-advice', 'explainer', 'general'],
    description: 'A general explainer on matching your interests to potential career paths.',
    sourceType: 'external',
    externalUrl: youtubeEmbed('9pvWJEYhfvc'),
    thumbnailUrl: youtubeThumb('9pvWJEYhfvc'),
    transcript:
      "[Illustrative transcript excerpt] Choosing a career isn't just about salary — start by listing what you actually enjoy doing, then look for roles and industries where that overlaps with market demand.",
    ratingType: 'stars',
  },
];

async function seed() {
  await connectDB();
  await Media.deleteMany({});
  const inserted = await Media.insertMany(items);
  console.log(`[seed:media] Inserted ${inserted.length} media items`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed:media] Failed:', err.message);
  process.exit(1);
});
