// Populates the Career Bank with sample data.
// Usage: npm run seed:careers  (wipes existing careers and re-inserts these)

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db');
const Career = require('../models/Career');

const careers = [
  {
    title: 'Software Engineer',
    domain: 'Technology',
    description: 'Designs, builds, and maintains software systems and applications.',
    requiredSkills: ['JavaScript', 'Python', 'Git', 'Problem Solving'],
    salaryRange: { min: 70000, max: 160000 },
    jobDemand: 'high',
    tags: ['coding', 'developer', 'programming'],
  },
  {
    title: 'Data Scientist',
    domain: 'Technology',
    description: 'Analyzes complex data to help organizations make better decisions.',
    requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'SQL'],
    salaryRange: { min: 85000, max: 170000 },
    jobDemand: 'high',
    tags: ['analytics', 'ML', 'AI'],
  },
  {
    title: 'UX Designer',
    domain: 'Design',
    description: 'Researches user needs and designs intuitive digital experiences.',
    requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Communication'],
    salaryRange: { min: 60000, max: 130000 },
    jobDemand: 'medium',
    tags: ['design', 'ux', 'ui'],
  },
  {
    title: 'Registered Nurse',
    domain: 'Healthcare',
    description: 'Provides direct patient care and coordinates with medical teams.',
    requiredSkills: ['Patient Care', 'Clinical Judgment', 'Communication'],
    salaryRange: { min: 55000, max: 100000 },
    jobDemand: 'high',
    tags: ['nursing', 'medical', 'clinical'],
  },
  {
    title: 'Physical Therapist',
    domain: 'Healthcare',
    description: 'Helps patients recover mobility and manage pain through therapy.',
    requiredSkills: ['Anatomy', 'Patient Care', 'Rehabilitation'],
    salaryRange: { min: 65000, max: 110000 },
    jobDemand: 'medium',
    tags: ['therapy', 'rehab', 'medical'],
  },
  {
    title: 'Financial Analyst',
    domain: 'Finance',
    description: 'Evaluates financial data to guide investment and business decisions.',
    requiredSkills: ['Excel', 'Financial Modeling', 'Accounting'],
    salaryRange: { min: 60000, max: 120000 },
    jobDemand: 'medium',
    tags: ['finance', 'investing', 'accounting'],
  },
  {
    title: 'Accountant',
    domain: 'Finance',
    description: 'Prepares and examines financial records for accuracy and compliance.',
    requiredSkills: ['Accounting', 'Attention to Detail', 'Excel'],
    salaryRange: { min: 50000, max: 95000 },
    jobDemand: 'medium',
    tags: ['bookkeeping', 'tax', 'audit'],
  },
  {
    title: 'High School Teacher',
    domain: 'Education',
    description: 'Plans lessons and instructs students in a specific subject area.',
    requiredSkills: ['Communication', 'Curriculum Design', 'Patience'],
    salaryRange: { min: 45000, max: 80000 },
    jobDemand: 'medium',
    tags: ['teaching', 'education', 'school'],
  },
  {
    title: 'Instructional Designer',
    domain: 'Education',
    description: 'Creates learning materials and courses for schools or companies.',
    requiredSkills: ['Curriculum Design', 'E-Learning Tools', 'Writing'],
    salaryRange: { min: 55000, max: 100000 },
    jobDemand: 'medium',
    tags: ['edtech', 'training', 'learning'],
  },
  {
    title: 'Mechanical Engineer',
    domain: 'Engineering',
    description: 'Designs and tests mechanical devices, tools, and systems.',
    requiredSkills: ['CAD', 'Physics', 'Problem Solving'],
    salaryRange: { min: 65000, max: 125000 },
    jobDemand: 'medium',
    tags: ['engineering', 'manufacturing', 'design'],
  },
  {
    title: 'Civil Engineer',
    domain: 'Engineering',
    description: 'Plans and oversees construction of infrastructure like roads and bridges.',
    requiredSkills: ['CAD', 'Project Management', 'Structural Analysis'],
    salaryRange: { min: 65000, max: 120000 },
    jobDemand: 'medium',
    tags: ['engineering', 'construction', 'infrastructure'],
  },
  {
    title: 'Electrician',
    domain: 'Skilled Trades',
    description: 'Installs and repairs electrical wiring, equipment, and fixtures.',
    requiredSkills: ['Electrical Systems', 'Safety Codes', 'Troubleshooting'],
    salaryRange: { min: 45000, max: 90000 },
    jobDemand: 'high',
    tags: ['trade', 'electrical', 'construction'],
  },
  {
    title: 'Plumber',
    domain: 'Skilled Trades',
    description: 'Installs and repairs piping systems for water, gas, and drainage.',
    requiredSkills: ['Pipefitting', 'Safety Codes', 'Troubleshooting'],
    salaryRange: { min: 45000, max: 85000 },
    jobDemand: 'high',
    tags: ['trade', 'plumbing', 'construction'],
  },
  {
    title: 'Graphic Designer',
    domain: 'Design',
    description: 'Creates visual content for branding, marketing, and media.',
    requiredSkills: ['Adobe Creative Suite', 'Typography', 'Creativity'],
    salaryRange: { min: 40000, max: 85000 },
    jobDemand: 'medium',
    tags: ['design', 'visual', 'branding'],
  },
  {
    title: 'Marketing Manager',
    domain: 'Business',
    description: 'Develops and executes strategies to promote products or services.',
    requiredSkills: ['Strategy', 'Analytics', 'Communication'],
    salaryRange: { min: 60000, max: 130000 },
    jobDemand: 'medium',
    tags: ['marketing', 'branding', 'growth'],
  },
  {
    title: 'Human Resources Manager',
    domain: 'Business',
    description: 'Oversees recruiting, employee relations, and workplace policy.',
    requiredSkills: ['Communication', 'Conflict Resolution', 'Organization'],
    salaryRange: { min: 55000, max: 115000 },
    jobDemand: 'medium',
    tags: ['hr', 'recruiting', 'people'],
  },
  {
    title: 'Lawyer',
    domain: 'Law',
    description: 'Advises and represents clients on legal matters.',
    requiredSkills: ['Legal Research', 'Writing', 'Negotiation'],
    salaryRange: { min: 70000, max: 200000 },
    jobDemand: 'medium',
    tags: ['legal', 'attorney', 'law'],
  },
  {
    title: 'Research Scientist',
    domain: 'Science',
    description: 'Conducts experiments and research to advance scientific knowledge.',
    requiredSkills: ['Research Methods', 'Statistics', 'Lab Techniques'],
    salaryRange: { min: 60000, max: 130000 },
    jobDemand: 'medium',
    tags: ['research', 'lab', 'science'],
  },
  {
    title: 'Environmental Scientist',
    domain: 'Science',
    description: 'Studies environmental problems and develops solutions to protect ecosystems.',
    requiredSkills: ['Research Methods', 'Data Analysis', 'Fieldwork'],
    salaryRange: { min: 50000, max: 100000 },
    jobDemand: 'medium',
    tags: ['environment', 'sustainability', 'ecology'],
  },
  {
    title: 'Product Manager',
    domain: 'Technology',
    description: 'Guides product strategy and coordinates teams to build and ship it.',
    requiredSkills: ['Strategy', 'Communication', 'Prioritization'],
    salaryRange: { min: 80000, max: 160000 },
    jobDemand: 'high',
    tags: ['product', 'strategy', 'tech'],
  },
];

async function seed() {
  await connectDB();
  try {
    await Career.collection.dropIndexes();
  } catch (e) {
    // Ignore if collection doesn't exist yet
  }
  await Career.deleteMany({});
  const inserted = await Career.insertMany(careers);
  console.log(`[seed:careers] Inserted ${inserted.length} careers`);
  await Career.syncIndexes();
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed:careers] Failed:', err.message);
  process.exit(1);
});
