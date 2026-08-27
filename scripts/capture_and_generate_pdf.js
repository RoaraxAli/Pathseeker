import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const APP_URL = 'https://pathseeker-sable.vercel.app';
const SCREENSHOT_DIR = path.resolve('./docs_screenshots');

async function run() {
  console.log('🚀 Launching automated browser for PathSeeker documentation...');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  const page = await browser.newPage();

  console.log('📸 1. Navigating to Landing Page...');
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await page.waitForTimeout ? page.waitForTimeout(2000) : new Promise((r) => setTimeout(r, 2000));

  // Hero Section
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_landing_hero.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('   ✓ 01_landing_hero.png');

  // Features Bento Grid
  const featuresElem = await page.$('#features');
  if (featuresElem) {
    await featuresElem.scrollIntoView();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_landing_bento.png'), clip: { x: 0, y: 800, width: 1440, height: 800 } });
    console.log('   ✓ 02_landing_bento.png');
  }

  // Career Bank Section
  const careersElem = await page.$('#career-bank');
  if (careersElem) {
    await careersElem.scrollIntoView();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_landing_careers.png'), clip: { x: 0, y: 1550, width: 1440, height: 850 } });
    console.log('   ✓ 03_landing_careers.png');
  }

  // AI Quiz Sampler
  const quizElem = await page.$('#ai-quiz');
  if (quizElem) {
    await quizElem.scrollIntoView();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_landing_quiz.png'), clip: { x: 0, y: 2350, width: 1440, height: 750 } });
    console.log('   ✓ 04_landing_quiz.png');
  }

  // Multimedia Section
  const mediaElem = await page.$('#multimedia');
  if (mediaElem) {
    await mediaElem.scrollIntoView();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_landing_multimedia.png'), clip: { x: 0, y: 3050, width: 1440, height: 800 } });
    console.log('   ✓ 05_landing_multimedia.png');
  }

  // Success Stories Section
  const storiesElem = await page.$('#success-stories');
  if (storiesElem) {
    await storiesElem.scrollIntoView();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_landing_stories.png'), clip: { x: 0, y: 3800, width: 1440, height: 800 } });
    console.log('   ✓ 06_landing_stories.png');
  }

  // Resources Section
  const resElem = await page.$('#resources');
  if (resElem) {
    await resElem.scrollIntoView();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_landing_resources.png'), clip: { x: 0, y: 4550, width: 1440, height: 750 } });
    console.log('   ✓ 07_landing_resources.png');
  }

  // How It Works & FAQ
  const howElem = await page.$('#how-it-works');
  if (howElem) {
    await howElem.scrollIntoView();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_landing_how_it_works.png'), clip: { x: 0, y: 5250, width: 1440, height: 800 } });
    console.log('   ✓ 08_landing_how_it_works.png');
  }

  // FAQ & Footer
  const faqElem = await page.$('#faq');
  if (faqElem) {
    await faqElem.scrollIntoView();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_landing_faq_footer.png'), clip: { x: 0, y: 6000, width: 1440, height: 950 } });
    console.log('   ✓ 09_landing_faq_footer.png');
  }

  console.log('📸 2. Navigating to Login Page...');
  await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_auth_login.png') });
  console.log('   ✓ 10_auth_login.png');

  console.log('📸 3. Navigating to Register Page...');
  await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_auth_register.png') });
  console.log('   ✓ 11_auth_register.png');

  console.log('📸 4. Performing Login & Capturing Onboarding / Dashboard...');
  // Fill login
  await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  
  // Create a fresh test user via API or UI to capture Onboarding steps!
  const testEmail = `guide.demo.${Date.now()}@pathseeker.org`;
  await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  // Fill Register Form
  const inputs = await page.$$('input');
  if (inputs.length >= 4) {
    await inputs[0].type('Elena');
    await inputs[1].type('Rostova');
    await inputs[2].type(testEmail);
    await inputs[3].type('Password123!');
    
    // Submit registration
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await new Promise((r) => setTimeout(r, 2500));
    }
  }

  // Onboarding Step 1
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_onboarding_step1_persona.png') });
  console.log('   ✓ 12_onboarding_step1_persona.png');

  // Go to Step 2
  const nextBtn1 = await page.$('button.bg-white');
  if (nextBtn1) {
    await nextBtn1.click();
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_onboarding_step2_demographics.png') });
    console.log('   ✓ 13_onboarding_step2_demographics.png');
  }

  // Go to Step 3
  const nextBtn2 = await page.$('button.bg-white');
  if (nextBtn2) {
    await nextBtn2.click();
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_onboarding_step3_domain.png') });
    console.log('   ✓ 14_onboarding_step3_domain.png');
  }

  // Finish Onboarding & Land on Dashboard
  const finishBtn = await page.$('button.bg-white');
  if (finishBtn) {
    await finishBtn.click();
    await new Promise((r) => setTimeout(r, 3500));
  }

  // Dashboard Tab 1: Overview
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_dashboard_overview.png') });
  console.log('   ✓ 15_dashboard_overview.png');

  // Helper to click sidebar nav items
  const clickSidebarTab = async (labelKeyword) => {
    const buttons = await page.$$('aside button');
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (text && text.toLowerCase().includes(labelKeyword.toLowerCase())) {
        await btn.click();
        await new Promise((r) => setTimeout(r, 800));
        break;
      }
    }
  };

  // Tab 2: Careers
  await clickSidebarTab('Career Bank');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_dashboard_careers.png') });
  console.log('   ✓ 16_dashboard_careers.png');

  // Tab 3: Quiz Assessment
  await clickSidebarTab('Assessment');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17_dashboard_quiz.png') });
  console.log('   ✓ 17_dashboard_quiz.png');

  // Tab 4: Multimedia Center
  await clickSidebarTab('Multimedia');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '18_dashboard_multimedia.png') });
  console.log('   ✓ 18_dashboard_multimedia.png');

  // Tab 5: Success Stories
  await clickSidebarTab('Stories');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '19_dashboard_stories.png') });
  console.log('   ✓ 19_dashboard_stories.png');

  // Tab 6: Resource Library
  await clickSidebarTab('Resource');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '20_dashboard_resources.png') });
  console.log('   ✓ 20_dashboard_resources.png');

  // Tab 7: Sticky Notes & Bookmarks
  await clickSidebarTab('Bookmarks');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '21_dashboard_bookmarks.png') });
  console.log('   ✓ 21_dashboard_bookmarks.png');

  // Tab 8: Feedback
  await clickSidebarTab('Feedback');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '22_dashboard_feedback.png') });
  console.log('   ✓ 22_dashboard_feedback.png');

  // Admin Portal
  console.log('📸 5. Navigating to Admin Control Panel...');
  await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  const adminInputs = await page.$$('input');
  if (adminInputs.length >= 2) {
    await adminInputs[0].type('admin@pathseeker.com');
    await adminInputs[1].type('Admin123456!');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await new Promise((r) => setTimeout(r, 2500));
    }
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '23_admin_dashboard.png') });
  console.log('   ✓ 23_admin_dashboard.png');

  await page.goto(`${APP_URL}/admin/jobs`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '24_admin_jobs.png') });
  console.log('   ✓ 24_admin_jobs.png');

  await page.goto(`${APP_URL}/admin/candidates`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '25_admin_candidates.png') });
  console.log('   ✓ 25_admin_candidates.png');

  await page.goto(`${APP_URL}/admin/statistics`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '26_admin_statistics.png') });
  console.log('   ✓ 26_admin_statistics.png');

  console.log('📄 6. Compiling HTML Documentation & Generating Executive PDF...');

  // Convert images to base64 for standalone portable PDF embedding
  const toBase64 = (filename) => {
    const p = path.join(SCREENSHOT_DIR, filename);
    if (fs.existsSync(p)) {
      return `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`;
    }
    return '';
  };

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PathSeeker - Comprehensive Platform User Guide & Documentation</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm;
      @bottom-right {
        content: counter(page);
        font-size: 8pt;
        color: #71717a;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #09090b;
      color: #f4f4f5;
      line-height: 1.5;
      font-size: 10pt;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
    }
    .page {
      page-break-after: always;
      position: relative;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 90vh;
      padding: 40px 20px;
      text-align: left;
    }
    .cover-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #d4d4d8;
      font-size: 8pt;
      font-family: monospace;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    h1.cover-title {
      font-size: 34pt;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin: 0 0 16px 0;
    }
    p.cover-subtitle {
      font-size: 13pt;
      color: #a1a1aa;
      max-width: 600px;
      line-height: 1.4;
      margin: 0 0 30px 0;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      margin-top: 40px;
    }
    .meta-item {
      font-size: 9pt;
    }
    .meta-label {
      color: #71717a;
      font-size: 7.5pt;
      font-family: monospace;
      text-transform: uppercase;
      display: block;
    }
    .meta-val {
      font-weight: 600;
      color: #ffffff;
    }
    .section-title {
      font-size: 18pt;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #ffffff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 8px;
      margin-top: 0;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .section-tag {
      font-size: 8pt;
      font-family: monospace;
      color: #a1a1aa;
      font-weight: normal;
    }
    .feature-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .feature-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .feature-name {
      font-size: 11pt;
      font-weight: 700;
      color: #ffffff;
    }
    .feature-badge {
      font-size: 7.5pt;
      font-family: monospace;
      padding: 2px 8px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.06);
      color: #e4e4e7;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .feature-desc {
      font-size: 9pt;
      color: #a1a1aa;
      line-height: 1.4;
      margin-bottom: 10px;
    }
    .screenshot-img {
      width: 100%;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      display: block;
      margin-top: 8px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .toc-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px dotted rgba(255, 255, 255, 0.1);
      font-size: 9.5pt;
    }
    .toc-title {
      font-weight: 600;
      color: #e4e4e7;
    }
    .toc-page {
      font-family: monospace;
      color: #a1a1aa;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="page cover">
    <div>
      <div class="cover-badge">Aptech TechWiz 6 &bull; Official Product Manual</div>
      <h1 class="cover-title">PathSeeker</h1>
      <p class="cover-subtitle">
        AI-Powered Career Intelligence &amp; Autonomous Career Passport Platform. Complete architectural specification, interaction guides, and feature manual.
      </p>
    </div>

    <div>
      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Product Name</span>
          <span class="meta-val">PathSeeker Global (TechWiz Edition)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Live Deployment</span>
          <span class="meta-val">https://pathseeker-sable.vercel.app</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Architecture</span>
          <span class="meta-val">React 18 &bull; Node &bull; MongoDB Atlas &bull; Express Serverless</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Manual Status</span>
          <span class="meta-val">Complete Verification &bull; All Roles &amp; Modules</span>
        </div>
      </div>
    </div>
  </div>

  <!-- TABLE OF CONTENTS -->
  <div class="page">
    <div class="section-title">
      <span>Table of Contents</span>
      <span class="section-tag">// Index &amp; Structure</span>
    </div>

    <div style="margin-top: 24px;">
      <div class="toc-item"><span class="toc-title">1. Public Visitor Landing Page (Hero, Bento Grid &amp; Career Bank)</span><span class="toc-page">Page 3</span></div>
      <div class="toc-item"><span class="toc-title">2. Visitor Experience (AI Quiz, Masterclasses, Stories &amp; Toolkits)</span><span class="toc-page">Page 4</span></div>
      <div class="toc-item"><span class="toc-title">3. Authentication &amp; Password Recovery (Sign In, Register &amp; OTP Reset)</span><span class="toc-page">Page 5</span></div>
      <div class="toc-item"><span class="toc-title">4. Guided Onboarding Calibration Wizard (Persona, Demographics, Domain)</span><span class="toc-page">Page 6</span></div>
      <div class="toc-item"><span class="toc-title">5. Authenticated Dashboard (Career Passport Overview &amp; Career Bank)</span><span class="toc-page">Page 7</span></div>
      <div class="toc-item"><span class="toc-title">6. Authenticated Dashboard (17-Q AI Assessment &amp; Masterclasses)</span><span class="toc-page">Page 8</span></div>
      <div class="toc-item"><span class="toc-title">7. Authenticated Dashboard (Stories Hub, Resource Library, Notes &amp; Feedback)</span><span class="toc-page">Page 9</span></div>
      <div class="toc-item"><span class="toc-title">8. Administrative Command Center (Telemetry, Careers CRUD &amp; Users)</span><span class="toc-page">Page 10</span></div>
    </div>
  </div>

  <!-- PAGE 3: LANDING PAGE PART 1 -->
  <div class="page">
    <div class="section-title">
      <span>1. Public Visitor Landing Page</span>
      <span class="section-tag">// Hero, Bento Grid &amp; Blueprints</span>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-name">A. Dynamic Video Hero &amp; Persona Track Selector</span>
        <span class="feature-badge">Route: /</span>
      </div>
      <p class="feature-desc">
        A high-converting SaaS landing hero featuring a looping background video, primary CTA conversion triggers, and immediate persona routing for Students, Graduates, and Professionals.
      </p>
      <img src="${toBase64('01_landing_hero.png')}" class="screenshot-img" />
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-name">B. Value Proposition Bento Grid</span>
        <span class="feature-badge">6 Core Pillars</span>
      </div>
      <p class="feature-desc">
        Monochromatic 6-pillar grid detailing AI Matchmaking, Live Salary Telemetry, Video Masterclasses, ATS Toolkits, Verified Journeys, and the Career Passport.
      </p>
      <img src="${toBase64('02_landing_bento.png')}" class="screenshot-img" />
    </div>
  </div>

  <!-- PAGE 4: LANDING PAGE PART 2 -->
  <div class="page">
    <div class="section-title">
      <span>2. Interactive Exploration Modules</span>
      <span class="section-tag">// Blueprints, AI Quiz &amp; Media</span>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-name">A. Global Career Blueprints Bank</span>
        <span class="feature-badge">20+ Live Roles</span>
      </div>
      <p class="feature-desc">
        Live database-backed explorer with domain filter pills (Cloud, AI, Security, UX, Healthcare, Fintech) and senior salary benchmarks.
      </p>
      <img src="${toBase64('03_landing_careers.png')}" class="screenshot-img" />
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-name">B. AI Interest Assessment Sampler</span>
        <span class="feature-badge">Interactive Widget</span>
      </div>
      <p class="feature-desc">
        Pre-login interactive scenario question allowing visitors to test domain matching logic before creating an account.
      </p>
      <img src="${toBase64('04_landing_quiz.png')}" class="screenshot-img" />
    </div>
  </div>

  <!-- PAGE 5: AUTHENTICATION -->
  <div class="page">
    <div class="section-title">
      <span>3. Authentication &amp; Security</span>
      <span class="section-tag">// Sign In, Register &amp; OTP</span>
    </div>

    <div class="grid-2">
      <div class="feature-card">
        <div class="feature-header">
          <span class="feature-name">A. Clean Sign In Portal</span>
          <span class="feature-badge">/login</span>
        </div>
        <p class="feature-desc">
          JWT authentication with Google Identity Services OAuth integration and simulated 6-digit OTP password reset.
        </p>
        <img src="${toBase64('10_auth_login.png')}" class="screenshot-img" />
      </div>

      <div class="feature-card">
        <div class="feature-header">
          <span class="feature-name">B. Streamlined Registration</span>
          <span class="feature-badge">/register</span>
        </div>
        <p class="feature-desc">
          Frictionless 4-field account creation with automatic new-user detection and seamless onboarding forwarding.
        </p>
        <img src="${toBase64('11_auth_register.png')}" class="screenshot-img" />
      </div>
    </div>
  </div>

  <!-- PAGE 6: ONBOARDING WIZARD -->
  <div class="page">
    <div class="section-title">
      <span>4. Guided Onboarding Calibration</span>
      <span class="section-tag">// 3-Step Passport Setup</span>
    </div>

    <div class="grid-2">
      <div class="feature-card">
        <div class="feature-header">
          <span class="feature-name">Step 1: Career Persona Selection</span>
          <span class="feature-badge">Stage Tuning</span>
        </div>
        <p class="feature-desc">
          Selects Student Explorer, Recent Graduate, or Industry Professional to calibrate dashboard views and recommendations.
        </p>
        <img src="${toBase64('12_onboarding_step1_persona.png')}" class="screenshot-img" />
      </div>

      <div class="feature-card">
        <div class="feature-header">
          <span class="feature-name">Step 2: Demographics &amp; Education</span>
          <span class="feature-badge">Profile Calibration</span>
        </div>
        <p class="feature-desc">
          Collects gender demographics and highest education background for tailored salary and readiness scoring.
        </p>
        <img src="${toBase64('13_onboarding_step2_demographics.png')}" class="screenshot-img" />
      </div>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-name">Step 3: Primary Focus Domain &amp; Launch</span>
        <span class="feature-badge">Atlas Sync</span>
      </div>
      <p class="feature-desc">
        Selects primary target domain (Cloud, AI, Security, UX, Biotech, Fintech) and triggers real-time MongoDB Atlas profile synchronization.
      </p>
      <img src="${toBase64('14_onboarding_step3_domain.png')}" class="screenshot-img" />
    </div>
  </div>

  <!-- PAGE 7: DASHBOARD PART 1 -->
  <div class="page">
    <div class="section-title">
      <span>5. Authenticated Dashboard</span>
      <span class="section-tag">// Overview &amp; Career Bank</span>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-name">A. Career Passport Overview (Tab 1)</span>
        <span class="feature-badge">Telemetry &amp; Actions</span>
      </div>
      <p class="feature-desc">
        Displays real-time Career Readiness Score, 10-domain trait radar, quick navigation hubs, and recommended next milestones.
      </p>
      <img src="${toBase64('15_dashboard_overview.png')}" class="screenshot-img" />
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-name">B. Career Bank &amp; In-Depth Insights (Tab 2)</span>
        <span class="feature-badge">Full Role Blueprints</span>
      </div>
      <p class="feature-desc">
        Complete searchable directory of 20+ roles with entry/mid/senior salary bands, growth rates, required skills, and course links.
      </p>
      <img src="${toBase64('16_dashboard_careers.png')}" class="screenshot-img" />
    </div>
  </div>

  <!-- PAGE 8: DASHBOARD PART 2 -->
  <div class="page">
    <div class="section-title">
      <span>6. Cognitive Assessment &amp; Masterclasses</span>
      <span class="section-tag">// AI Profiler &amp; Video Media</span>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-name">A. 17-Question Cognitive AI Assessment (Tab 3)</span>
        <span class="feature-badge">Likert &amp; Multi-Choice</span>
      </div>
      <p class="feature-desc">
        Interactive timed scenarios calculating percentage suitability across 10 industry domains with permanent attempt tracking.
      </p>
      <img src="${toBase64('17_dashboard_quiz.png')}" class="screenshot-img" />
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-name">B. Multimedia Masterclasses &amp; Video Center (Tab 4)</span>
        <span class="feature-badge">Interactive Transcripts</span>
      </div>
      <p class="feature-desc">
        Video masterclasses featuring verified industry leaders, 5-star session rating, and synchronized interactive lecture transcripts.
      </p>
      <img src="${toBase64('18_dashboard_multimedia.png')}" class="screenshot-img" />
    </div>
  </div>

  <!-- PAGE 9: DASHBOARD PART 3 -->
  <div class="page">
    <div class="section-title">
      <span>7. Community &amp; Toolkits</span>
      <span class="section-tag">// Stories, Resources &amp; Notes</span>
    </div>

    <div class="grid-2">
      <div class="feature-card">
        <div class="feature-header">
          <span class="feature-name">A. Success Stories Hub (Tab 5)</span>
          <span class="feature-badge">Real Trajectories</span>
        </div>
        <p class="feature-desc">
          Community-shared journey timelines detailing educational pathways, challenges overcome, outcomes, and helpful votes.
        </p>
        <img src="${toBase64('19_dashboard_stories.png')}" class="screenshot-img" />
      </div>

      <div class="feature-card">
        <div class="feature-header">
          <span class="feature-name">B. Downloadable Resources (Tab 6)</span>
          <span class="feature-badge">ATS Toolkits</span>
        </div>
        <p class="feature-desc">
          Curated ATS resume templates, 30-day interview prep roadmaps, and scholarship guides with live download telemetry.
        </p>
        <img src="${toBase64('20_dashboard_resources.png')}" class="screenshot-img" />
      </div>
    </div>

    <div class="grid-2">
      <div class="feature-card">
        <div class="feature-header">
          <span class="feature-name">C. Sticky Notes &amp; Bookmarks (Tab 7)</span>
          <span class="feature-badge">Personal Passport</span>
        </div>
        <p class="feature-desc">
          Bookmark favorite career blueprints and masterclasses, attach private sticky notes, and export PDF summaries.
        </p>
        <img src="${toBase64('21_dashboard_bookmarks.png')}" class="screenshot-img" />
      </div>

      <div class="feature-card">
        <div class="feature-header">
          <span class="feature-name">D. Feedback &amp; Support (Tab 8)</span>
          <span class="feature-badge">Direct Channel</span>
        </div>
        <p class="feature-desc">
          Direct user feedback submission with sentiment analysis and administrative moderation.
        </p>
        <img src="${toBase64('22_dashboard_feedback.png')}" class="screenshot-img" />
      </div>
    </div>
  </div>

  <!-- PAGE 10: ADMIN SUITE -->
  <div class="page">
    <div class="section-title">
      <span>8. Administrative Control Center</span>
      <span class="section-tag">// Telemetry &amp; Moderation</span>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-name">A. Executive Operations &amp; System Telemetry</span>
        <span class="feature-badge">/admin/dashboard</span>
      </div>
      <p class="feature-desc">
        Real-time telemetry showing live seekers, total career views, quiz completions, document downloads, and platform health.
      </p>
      <img src="${toBase64('23_admin_dashboard.png')}" class="screenshot-img" />
    </div>

    <div class="grid-2">
      <div class="feature-card">
        <div class="feature-header">
          <span class="feature-name">B. Career Profiles Management</span>
          <span class="feature-badge">/admin/jobs</span>
        </div>
        <p class="feature-desc">
          Full CRUD management for career blueprints, salary tiers, demand ratings, and required skill matrices.
        </p>
        <img src="${toBase64('24_admin_jobs.png')}" class="screenshot-img" />
      </div>

      <div class="feature-card">
        <div class="feature-header">
          <span class="feature-name">C. Candidate &amp; Seeker Directory</span>
          <span class="feature-badge">/admin/candidates</span>
        </div>
        <p class="feature-desc">
          User administration directory with role management (Student, Graduate, Professional, Admin) and profile inspection.
        </p>
        <img src="${toBase64('25_admin_candidates.png')}" class="screenshot-img" />
      </div>
    </div>
  </div>

</body>
</html>
`;

  const docPage = await browser.newPage();
  await docPage.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  const pdfPath = path.resolve('./PathSeeker_User_Guide_and_Documentation.pdf');
  await docPage.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
  });

  console.log(`🎉 SUCCESS! Comprehensive PDF User Guide generated at: ${pdfPath}`);
  await browser.close();
}

run().catch((err) => {
  console.error('Error generating documentation:', err);
  process.exit(1);
});
