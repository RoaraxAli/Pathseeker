import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowUpRight,
  Play,
  Sparkles,
  BookOpen,
  Video,
  FileText,
  Award,
  Users,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  Search,
  SlidersHorizontal,
  GraduationCap,
  Briefcase,
  UserCheck,
  Star,
  Activity,
  DownloadCloud,
  ArrowRight,
  Terminal,
  CircleDot,
} from 'lucide-react';
import { FadingVideo } from '../components/FadingVideo';
import { BlurText } from '../components/BlurText';
import { careerApi, storyApi, multimediaApi } from '../services/api';
import { CareerItem, SuccessStoryItem, MultimediaItem } from '../types';

const motionProps = (delay: number) => ({
  initial: { filter: 'blur(8px)', opacity: 0, y: 16 },
  whileInView: { filter: 'blur(0px)', opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

export const LandingPage: React.FC = () => {
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [multimedia, setMultimedia] = useState<MultimediaItem[]>([]);
  const [activeDomainFilter, setActiveDomainFilter] = useState('All Domains');
  const [interactiveQuizAnswer, setInteractiveQuizAnswer] = useState<number | null>(null);

  useEffect(() => {
    careerApi.getCareers({}).then((res) => setCareers(res.slice(0, 6))).catch(() => {});
    storyApi.getAll({}).then((res) => setStories(res.slice(0, 3))).catch(() => {});
    multimediaApi.getAll({}).then((res) => setMultimedia(res.slice(0, 3))).catch(() => {});
  }, []);

  const domains = [
    'All Domains',
    'Software & Cloud',
    'AI & Data Science',
    'Cybersecurity',
    'Design & UX',
    'Healthcare & Biotech',
    'Product & Strategy',
  ];

  const filteredCareers =
    activeDomainFilter === 'All Domains'
      ? careers
      : careers.filter((c) => c.domain === activeDomainFilter);

  return (
    <div className="bg-black text-white selection:bg-zinc-800 selection:text-white font-sans overflow-x-hidden scroll-smooth">
      {/* 1. TOP NAVBAR */}
      <header className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 lg:px-16 pointer-events-auto">
        <a
          href="#hero"
          className="liquid-glass h-11 px-4 rounded-full flex items-center gap-2.5 group hover:border-white/20 transition-all border border-white/10"
          aria-label="PathSeeker Home"
        >
          <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
            <Compass className="w-3.5 h-3.5 text-black" />
          </div>
          <div className="flex items-center gap-1.5 text-left">
            <span className="font-semibold text-xs tracking-tight text-white">PathSeeker</span>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">/ Career Passport</span>
          </div>
        </a>

        {/* Center Navigation Pill */}
        <div className="hidden lg:flex items-center gap-1 liquid-glass rounded-full px-2 py-1 shadow-2xl backdrop-blur-xl border border-white/10">
          {[
            { label: 'Pillars', href: '#pillars' },
            { label: 'Career Bank', href: '#career-bank' },
            { label: 'AI Assessment', href: '#ai-quiz' },
            { label: 'Multimedia', href: '#multimedia' },
            { label: 'Stories', href: '#success-stories' },
            { label: 'Resources', href: '#resources' },
            { label: 'Sitemap', href: '#sitemap' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-full transition-all"
            >
              {item.label}
            </a>
          ))}

          <Link
            to="/register"
            className="ml-2 bg-white text-black hover:bg-zinc-200 rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
          >
            <span>Launch Passport</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="liquid-glass rounded-full px-4 py-1.5 text-xs font-medium text-zinc-200 hover:text-white hover:border-white/20 transition-all border border-white/10"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="lg:hidden bg-white text-black rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative min-h-screen overflow-hidden bg-black flex flex-col justify-between pt-28 pb-12">
        <FadingVideo
          src="/HeroSection.mp4"
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0 opacity-40"
          style={{ width: '120%', height: '120%' }}
          loop={false}
          playWhenInView={false}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black z-0 pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto mt-6">
          {/* Subtle Stage Badge */}
          <motion.div
            {...motionProps(0.2)}
            className="liquid-glass rounded-full px-3.5 py-1 inline-flex items-center gap-2 text-xs text-zinc-300 border border-white/10 mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
              TechWiz 6 &bull; Career Passport Edition
            </span>
          </motion.div>

          {/* Headline */}
          <div className="max-w-4xl">
            <BlurText
              text="Discover What Fits You Best"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-medium text-white leading-[0.95] tracking-tight font-sans"
            />
          </div>

          {/* Subtitle */}
          <motion.p
            {...motionProps(0.5)}
            className="mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl font-light leading-relaxed px-4"
          >
            Data-backed career telemetry, cognitive interest profiling, and verifiable blueprints built for <strong>Students</strong>, <strong>Graduates</strong>, and <strong>Working Professionals</strong>.
          </motion.p>

          {/* Role Persona Cards */}
          <motion.div
            {...motionProps(0.7)}
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl px-2"
          >
            <Link
              to="/register?role=student"
              className="liquid-glass hover:bg-white/[0.04] p-5 rounded-2xl text-left border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 mb-3 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Student Track</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Foundational guidance, university pathways, scholarships &amp; skill primers
              </p>
            </Link>

            <Link
              to="/register?role=graduate"
              className="liquid-glass hover:bg-white/[0.04] p-5 rounded-2xl text-left border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 mb-3 group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Graduate Track</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Entry roles, ATS resume toolkits &amp; 30-day technical interview checklists
              </p>
            </Link>

            <Link
              to="/register?role=professional"
              className="liquid-glass hover:bg-white/[0.04] p-5 rounded-2xl text-left border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 mb-3 group-hover:scale-105 transition-transform">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Professional Track</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Executive upskilling, leadership trajectories &amp; salary benchmarks
              </p>
            </Link>
          </motion.div>

          {/* Minimal Key Stats Bar */}
          <motion.div
            {...motionProps(0.9)}
            className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-12 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono">50+</div>
              <div className="text-[11px] text-zinc-400 leading-tight">Global Career<br />Profiles</div>
            </div>
            <div className="h-8 w-px bg-white/10 self-center hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono">96.8%</div>
              <div className="text-[11px] text-zinc-400 leading-tight">Assessment<br />Fit Accuracy</div>
            </div>
            <div className="h-8 w-px bg-white/10 self-center hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono">100%</div>
              <div className="text-[11px] text-zinc-400 leading-tight">Dynamic Cloud<br />Database Sync</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. PILLARS SECTION */}
      <section id="pillars" className="py-24 px-4 sm:px-8 lg:px-20 bg-zinc-950 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              The 4 Pillars of Your Career Passport
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Engineered to support every stage of lifelong professional progression.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="liquid-glass p-6 rounded-2xl space-y-3 hover:border-white/20 transition-all border border-white/[0.08] text-left">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-200">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">1. AI-Driven Discovery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Adaptive Likert-scale questions and domain trait algorithms mapping your natural strengths.
              </p>
            </div>

            <div className="liquid-glass p-6 rounded-2xl space-y-3 hover:border-white/20 transition-all border border-white/[0.08] text-left">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-200">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">2. Dynamic Career Bank</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Multi-level search, industry demand indicators, salary tiers, and actionable skill blueprints.
              </p>
            </div>

            <div className="liquid-glass p-6 rounded-2xl space-y-3 hover:border-white/20 transition-all border border-white/[0.08] text-left">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-200">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">3. Multimedia Center</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Stream masterclasses, podcast sessions, and animated explainers with interactive transcripts.
              </p>
            </div>

            <div className="liquid-glass p-6 rounded-2xl space-y-3 hover:border-white/20 transition-all border border-white/[0.08] text-left">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-200">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">4. Resource Library</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Downloadable ATS resume templates, interview roadmaps, and personal sticky notes export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAREER BANK EXPLORER (LIVE PREVIEW) */}
      <section id="career-bank" className="py-24 px-4 sm:px-8 lg:px-20 bg-black border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">// Career Bank</span>
              <h2 className="text-3xl font-semibold tracking-tight text-white mt-1">
                Explore Global Career Blueprints
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Real-time salaries, industry demand metrics, and skill roadmaps fetched dynamically.
              </p>
            </div>

            <Link
              to="/login"
              className="liquid-glass rounded-full px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-2 self-start md:self-auto border border-white/10 hover:border-white/20"
            >
              <span>Explore Full Bank</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setActiveDomainFilter(domain)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeDomainFilter === domain
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'liquid-glass text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Careers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCareers.map((career) => (
              <div
                key={career._id || career.slug}
                className="liquid-glass p-5 rounded-2xl flex flex-col justify-between hover:border-white/25 transition-all text-left space-y-4 border border-white/[0.08]"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-zinc-300 border border-white/10">
                      {career.domain}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {career.jobDemand} Demand
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white">{career.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {career.summary || career.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Senior Benchmark:</span>
                    <span className="font-mono font-medium text-zinc-200">
                      ${career.salaryRange?.senior?.toLocaleString()} / yr
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {career.requiredSkills?.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 text-[10px] rounded bg-white/[0.04] text-zinc-400 border border-white/[0.04]">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/login"
                    className="w-full py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>View Blueprint</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI INTEREST QUIZ SAMPLER */}
      <section id="ai-quiz" className="py-24 px-4 sm:px-8 lg:px-20 bg-zinc-950 border-t border-white/[0.08]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">// AI Assessment</span>
            <h2 className="text-3xl font-semibold tracking-tight text-white leading-tight">
              Adaptive Cognitive &amp; Trait Profiler
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Our algorithm evaluates analytical reasoning, creative instincts, and technical inclination to calculate your percentage role matches.
            </p>

            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Timed interactive scenarios with Likert rating scales (1-5)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time domain radar score and matched career suggestions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Permanent progress tracking stored in MongoDB Atlas</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Full 5-Step Assessment</span>
              </Link>
            </div>
          </div>

          {/* Interactive Sampler Card */}
          <div className="liquid-glass-strong p-6 sm:p-8 rounded-2xl border border-white/10 text-left space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Sample Assessment Question</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                Step 1 of 5
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-white">
              &quot;When presented with a complex challenge, what is your most natural workflow?&quot;
            </p>

            <div className="space-y-2">
              {[
                { id: 1, text: 'Architecting software algorithms and writing backend code logic', trait: 'Software & Cloud' },
                { id: 2, text: 'Analyzing statistical datasets and finding data trends', trait: 'AI & Data Science' },
                { id: 3, text: 'Designing visual interfaces and user interaction tokens', trait: 'Design & UX' },
                { id: 4, text: 'Investigating vulnerabilities and securing network infrastructure', trait: 'Cybersecurity' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setInteractiveQuizAnswer(opt.id)}
                  className={`w-full p-3 rounded-xl text-xs text-left transition-all flex items-center justify-between cursor-pointer ${
                    interactiveQuizAnswer === opt.id
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 border border-white/[0.06]'
                  }`}
                >
                  <span>{opt.text}</span>
                  {interactiveQuizAnswer === opt.id && <CheckCircle2 className="w-4 h-4 text-black shrink-0" />}
                </button>
              ))}
            </div>

            {interactiveQuizAnswer && (
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs flex items-center justify-between">
                <span className="text-zinc-300">
                  Matched: <strong className="text-white">{interactiveQuizAnswer === 1 ? 'Software & Cloud' : interactiveQuizAnswer === 2 ? 'AI & Data Science' : interactiveQuizAnswer === 3 ? 'Design & UX' : 'Cybersecurity'}</strong>
                </span>
                <Link to="/login" className="underline font-semibold text-white hover:text-zinc-200">
                  Complete Assessment &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. MULTIMEDIA SECTION */}
      <section id="multimedia" className="py-24 px-4 sm:px-8 lg:px-20 bg-black border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">// Multimedia Center</span>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Masterclasses &amp; Video Podcasts
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Learn directly from principal engineers and directors with inline interactive transcripts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {multimedia.map((item) => (
              <div
                key={item._id}
                className="liquid-glass rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between text-left border border-white/[0.08]"
              >
                <div className="relative aspect-video bg-zinc-900">
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-300">
                    {item.duration}
                  </span>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400 uppercase font-mono">{item.type} &bull; {item.domain}</span>
                      <span className="text-zinc-300 font-mono flex items-center gap-1">
                        <Star className="w-3 h-3 fill-zinc-300 text-zinc-300" /> {item.ratingAvg}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white line-clamp-2">{item.title}</h3>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                    <span>{item.speaker?.name}</span>
                    <Link to="/login" className="text-zinc-300 hover:text-white font-medium flex items-center gap-1">
                      <span>Watch</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SUCCESS STORIES */}
      <section id="success-stories" className="py-24 px-4 sm:px-8 lg:px-20 bg-zinc-950 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">// Real Trajectories</span>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              From Discovery to Industry Leaders
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Transparent career journeys: Education Path \(\rightarrow\) Challenges \(\rightarrow\) Outcome.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stories.map((story) => (
              <div
                key={story._id}
                className="liquid-glass p-6 rounded-2xl text-left space-y-4 hover:border-white/20 transition-all flex flex-col justify-between border border-white/[0.08]"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.avatarUrl}
                      alt={story.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <h3 className="text-xs font-semibold text-white">{story.name}</h3>
                      <p className="text-[11px] text-zinc-400">{story.currentRole}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] text-[11px] space-y-1 text-zinc-400 border border-white/[0.04]">
                    <span className="font-semibold text-zinc-300 block">Education Pathway:</span>
                    <p>{story.educationPath}</p>
                  </div>

                  <div className="text-xs text-zinc-300 italic leading-relaxed">
                    &quot;{story.advice}&quot;
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase">{story.domain}</span>
                  <span className="text-[11px] text-zinc-300">{story.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. RESOURCES SECTION */}
      <section id="resources" className="py-24 px-4 sm:px-8 lg:px-20 bg-black border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">// Document Library</span>
              <h2 className="text-3xl font-semibold tracking-tight text-white mt-1">
                Downloadable Career Toolkits
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                ATS resume templates, 30-day interview checklists, and roadmap toolkits.
              </p>
            </div>

            <Link
              to="/login"
              className="liquid-glass rounded-full px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-2 self-start md:self-auto border border-white/10"
            >
              <span>Explore All Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: '2026 Tech Resume Master Toolkit', type: 'Resume Template', size: '1.8 MB', downloads: '1,240' },
              { title: 'Full-Stack Developer Roadmap', type: 'Career Roadmap', size: '3.2 MB', downloads: '1,890' },
              { title: 'Technical Interview 30-Day Checklist', type: 'Interview Checklist', size: '1.2 MB', downloads: '960' },
              { title: 'Global Tech Scholarships Directory', type: 'Scholarship Guide', size: '2.6 MB', downloads: '810' },
            ].map((res, idx) => (
              <div
                key={idx}
                className="liquid-glass p-5 rounded-2xl text-left space-y-4 hover:border-white/20 transition-all flex flex-col justify-between border border-white/[0.08]"
              >
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-white/5 text-zinc-300 border border-white/5">
                    {res.type}
                  </span>
                  <h3 className="text-xs font-semibold text-white">{res.title}</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">PDF Document &bull; {res.size}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">{res.downloads} downloads</span>
                  <Link to="/login" className="text-zinc-200 hover:text-white font-medium flex items-center gap-1">
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Get PDF</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SITEMAP & FLOW DIAGRAM (SRS PAGE 12) */}
      <section id="sitemap" className="py-24 px-4 sm:px-8 lg:px-20 bg-zinc-950 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-10 text-center">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">SRS Deliverable &bull; Section 1.9</span>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              PathSeeker Application Sitemap &amp; Flow Diagram
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Visual flow depicting module connections, user interactions, and administrator controls.
            </p>
          </div>

          <div className="liquid-glass-strong p-6 sm:p-8 rounded-2xl border border-white/10 text-left space-y-6 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs shadow-sm">
                PathSeeker Web Application (/)
              </div>
              <div className="w-px h-6 bg-white/20 my-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2.5">
                <div className="font-semibold text-xs text-zinc-200 flex items-center gap-1.5 pb-2 border-b border-white/5">
                  <Shield className="w-3.5 h-3.5 text-zinc-400" />
                  <span>1. Authentication</span>
                </div>
                <ul className="space-y-1 text-[11px] text-zinc-400">
                  <li>&bull; <Link to="/login" className="hover:underline text-zinc-300">User Login (/login)</Link></li>
                  <li>&bull; <Link to="/register" className="hover:underline text-zinc-300">Role Registration (/register)</Link></li>
                  <li>&bull; Forgot Password / OTP Flow</li>
                  <li>&bull; Google OAuth 2.0</li>
                  <li>&bull; Role-Based Guards</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2.5">
                <div className="font-semibold text-xs text-zinc-200 flex items-center gap-1.5 pb-2 border-b border-white/5">
                  <Compass className="w-3.5 h-3.5 text-zinc-400" />
                  <span>2. User Portal</span>
                </div>
                <ul className="space-y-1 text-[11px] text-zinc-400">
                  <li>&bull; <Link to="/dashboard" className="hover:underline text-zinc-300">Career Passport (/dashboard)</Link></li>
                  <li>&bull; Readiness Score Tracking</li>
                  <li>&bull; Top Recommendations</li>
                  <li>&bull; In-App Notifications</li>
                  <li>&bull; Profile &amp; Resume Editor</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2.5">
                <div className="font-semibold text-xs text-zinc-200 flex items-center gap-1.5 pb-2 border-b border-white/5">
                  <Layers className="w-3.5 h-3.5 text-zinc-400" />
                  <span>3. Discovery Engine</span>
                </div>
                <ul className="space-y-1 text-[11px] text-zinc-400">
                  <li>&bull; Career Bank (Multi-level search)</li>
                  <li>&bull; AI-Powered Interest Quiz</li>
                  <li>&bull; Multimedia &amp; Transcripts</li>
                  <li>&bull; Success Stories Hub</li>
                  <li>&bull; Document Resource Library</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2.5">
                <div className="font-semibold text-xs text-zinc-200 flex items-center gap-1.5 pb-2 border-b border-white/5">
                  <Award className="w-3.5 h-3.5 text-zinc-400" />
                  <span>4. Admin Control</span>
                </div>
                <ul className="space-y-1 text-[11px] text-zinc-400">
                  <li>&bull; <Link to="/admin/dashboard" className="hover:underline text-zinc-300">Telemetry Analytics (/admin)</Link></li>
                  <li>&bull; Careers Bank CRUD</li>
                  <li>&bull; Stories Moderation</li>
                  <li>&bull; Feedback &amp; Inquiries</li>
                  <li>&bull; User Roles &amp; Directory</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="py-12 px-4 sm:px-8 lg:px-20 bg-black border-t border-white/[0.08] text-left">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="font-semibold text-sm text-white">PathSeeker</span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Discover What Fits You Best. Built for Aptech TechWiz 6 Full-Stack Application Development Competition.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-medium">
            <a href="#hero" className="hover:text-white transition-colors">Hero</a>
            <a href="#pillars" className="hover:text-white transition-colors">Pillars</a>
            <a href="#career-bank" className="hover:text-white transition-colors">Career Bank</a>
            <a href="#ai-quiz" className="hover:text-white transition-colors">AI Quiz</a>
            <a href="#sitemap" className="hover:text-white transition-colors">Sitemap</a>
            <Link to="/login" className="text-zinc-300 hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="px-4 py-1.5 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all">
              Launch Passport
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-600 font-mono">
          <span>&copy; 2026 PathSeeker &bull; Aptech Limited &bull; TicketToTechwiz</span>
          <span>Theme: Career Passport &bull; Version 1.0</span>
        </div>
      </footer>
    </div>
  );
};
