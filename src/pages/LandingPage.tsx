import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
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
  BarChart3,
  Target,
} from 'lucide-react';
import { FadingVideo } from '../components/FadingVideo';
import { BlurText } from '../components/BlurText';
import { careerApi, storyApi, multimediaApi, resourceApi } from '../services/api';
import { CareerItem, SuccessStoryItem, MultimediaItem, ResourceItem } from '../types';

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
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [activeDomainFilter, setActiveDomainFilter] = useState('All Domains');
  const [interactiveQuizAnswer, setInteractiveQuizAnswer] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    careerApi.getCareers({}).then((res) => setCareers(res.slice(0, 6))).catch(() => {});
    storyApi.getAll({}).then((res) => setStories(res.slice(0, 3))).catch(() => {});
    multimediaApi.getAll({}).then((res) => setMultimedia(res.slice(0, 3))).catch(() => {});
    resourceApi.getResources({}).then((res) => setResources(res.slice(0, 4))).catch(() => {});
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
      {/* 1. TOP FLOATING NAVBAR */}
      <header className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 lg:px-16 pointer-events-auto">
        <a
          href="#hero"
          className="liquid-glass h-11 px-4 rounded-full flex items-center gap-2.5 group hover:border-white/20 transition-all border border-white/10 shadow-lg"
          aria-label="PathSeeker Home"
        >
          <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
            <Compass className="w-3.5 h-3.5 text-black" />
          </div>
          <div className="flex items-center gap-1.5 text-left">
            <span className="font-semibold text-xs tracking-tight text-white">PathSeeker</span>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">&bull; Career Passport</span>
          </div>
        </a>

        {/* Center Navigation Pill */}
        <div className="hidden lg:flex items-center gap-1 liquid-glass rounded-full px-2 py-1 shadow-2xl backdrop-blur-xl border border-white/10">
          {[
            { label: 'Career Bank', href: '#career-bank' },
            { label: 'AI Assessment', href: '#ai-quiz' },
            { label: 'Masterclasses', href: '#multimedia' },
            { label: 'Success Stories', href: '#success-stories' },
            { label: 'Resources', href: '#resources' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'FAQ', href: '#faq' },
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
            <span>Get Started</span>
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
      <section id="hero" className="relative min-h-screen overflow-hidden bg-black flex flex-col justify-between pt-32 pb-16">
        <FadingVideo
          src="/HeroSection.mp4"
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0 opacity-35"
          style={{ width: '120%', height: '120%' }}
          loop={true}
          playWhenInView={false}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black z-0 pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto mt-4">
          {/* Subtle Platform Badge */}
          <motion.div
            {...motionProps(0.1)}
            className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2 text-xs text-zinc-300 border border-white/10 mb-6 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-medium text-zinc-300">
              AI-Powered Career Intelligence Platform
            </span>
          </motion.div>

          {/* Main Headline */}
          <div className="max-w-4xl">
            <BlurText
              text="Stop Guessing. Discover the Career Built for You."
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-bold text-white leading-[1.02] tracking-tight font-sans"
            />
          </div>

          {/* Value Subtitle */}
          <motion.p
            {...motionProps(0.3)}
            className="mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl font-light leading-relaxed px-4"
          >
            Personalized AI interest assessments, verified salary benchmarks, video masterclasses from working leaders, and ATS-ready toolkits — all in one modern Career Passport.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            {...motionProps(0.5)}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full justify-center px-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Take Free Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#career-bank"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full liquid-glass text-zinc-200 hover:text-white font-semibold text-sm border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Explore 20+ Careers</span>
            </a>
          </motion.div>

          {/* Persona Track Selector Cards */}
          <motion.div
            {...motionProps(0.7)}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl px-2"
          >
            <Link
              to="/register?role=student"
              className="liquid-glass hover:bg-white/[0.05] p-5 rounded-2xl text-left border border-white/10 hover:border-white/25 transition-all group shadow-lg"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>For Students</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Foundational guidance, university pathways, scholarships &amp; skill primers.
              </p>
            </Link>

            <Link
              to="/register?role=graduate"
              className="liquid-glass hover:bg-white/[0.05] p-5 rounded-2xl text-left border border-white/10 hover:border-white/25 transition-all group shadow-lg"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>For Graduates</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Entry roles, ATS resume toolkits &amp; 30-day technical interview checklists.
              </p>
            </Link>

            <Link
              to="/register?role=professional"
              className="liquid-glass hover:bg-white/[0.05] p-5 rounded-2xl text-left border border-white/10 hover:border-white/25 transition-all group shadow-lg"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 mb-3 group-hover:scale-110 transition-transform">
                <UserCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>For Professionals</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Executive upskilling, leadership trajectories &amp; senior salary benchmarks.
              </p>
            </Link>
          </motion.div>

          {/* Social Proof & Metrics */}
          <motion.div
            {...motionProps(0.85)}
            className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-left bg-zinc-950/70 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">20+</div>
              <div className="text-[11px] text-zinc-400 leading-tight">In-Depth Career<br />Profiles</div>
            </div>
            <div className="h-8 w-px bg-white/10 self-center hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">98.4%</div>
              <div className="text-[11px] text-zinc-400 leading-tight">Assessment Fit<br />Accuracy</div>
            </div>
            <div className="h-8 w-px bg-white/10 self-center hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <div className="text-[11px] text-zinc-400 leading-tight">Rated 4.9/5 by<br />10k+ Seekers</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION BENTO GRID */}
      <section id="features" className="py-24 px-4 sm:px-8 lg:px-20 bg-zinc-950 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Why PathSeeker</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Everything You Need to Chart Your Future
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Built with precision tools and verified data to turn career ambiguity into actionable career milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bento Card 1 */}
            <div className="liquid-glass p-7 rounded-3xl space-y-4 hover:border-white/20 transition-all border border-white/[0.08] text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">AI Cognitive Matchmaking</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Take an intelligent assessment scored across 10 specialized domain traits to find the exact roles where your natural abilities shine.
              </p>
            </div>

            {/* Bento Card 2 */}
            <div className="liquid-glass p-7 rounded-3xl space-y-4 hover:border-white/20 transition-all border border-white/[0.08] text-left">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Live Salary &amp; Demand Telemetry</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Explore real market compensation bands from entry-level to senior roles, 5-year growth rates, and required tech stacks.
              </p>
            </div>

            {/* Bento Card 3 */}
            <div className="liquid-glass p-7 rounded-3xl space-y-4 hover:border-white/20 transition-all border border-white/[0.08] text-left">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Day-in-the-Life Masterclasses</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Watch verified industry leaders break down their daily workflows, architecture decisions, and interview tips with synchronized transcripts.
              </p>
            </div>

            {/* Bento Card 4 */}
            <div className="liquid-glass p-7 rounded-3xl space-y-4 hover:border-white/20 transition-all border border-white/[0.08] text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <DownloadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">ATS-Ready Toolkits &amp; Guides</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download proven resume checklists, 30-day interview prep roadmaps, and salary negotiation guides tailored for career success.
              </p>
            </div>

            {/* Bento Card 5 */}
            <div className="liquid-glass p-7 rounded-3xl space-y-4 hover:border-white/20 transition-all border border-white/[0.08] text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Verified Career Journeys</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Learn from transparent transition timelines: see the education pathways, challenges overcome, and exact advice from working professionals.
              </p>
            </div>

            {/* Bento Card 6 */}
            <div className="liquid-glass p-7 rounded-3xl space-y-4 hover:border-white/20 transition-all border border-white/[0.08] text-left">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Personal Career Passport</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Save bookmarked roles, attach personal sticky notes, monitor your Career Readiness Score, and export structured PDF summaries.
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
            {resources.map((res) => (
              <div
                key={res._id}
                className="liquid-glass p-5 rounded-2xl text-left space-y-4 hover:border-white/20 transition-all flex flex-col justify-between border border-white/[0.08]"
              >
                <div className="space-y-1.5">
                  <span className="px-2.5 py-0.5 text-[10px] font-medium rounded bg-white/5 text-zinc-300 border border-white/5">
                    {res.category}
                  </span>
                  <h3 className="text-xs font-semibold text-white line-clamp-2">{res.title}</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">{res.fileType || 'PDF'} &bull; {res.fileSize || '2.4 MB'}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">{res.downloadsCount?.toLocaleString() || 0} downloads</span>
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

      {/* 9. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4 sm:px-8 lg:px-20 bg-zinc-950 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Step-By-Step</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              How PathSeeker Powers Your Trajectory
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              A frictionless 3-step journey from career curiosity to guaranteed industry readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="liquid-glass p-7 rounded-3xl space-y-4 border border-white/[0.08]">
              <div className="w-10 h-10 rounded-2xl bg-white text-black font-bold text-sm flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="text-base font-bold text-white">Select Your Persona</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Choose your track (Student, Graduate, or Professional) to customize the dashboard view, toolkits, and career recommendations for your exact stage.
              </p>
            </div>

            <div className="liquid-glass p-7 rounded-3xl space-y-4 border border-white/[0.08]">
              <div className="w-10 h-10 rounded-2xl bg-white text-black font-bold text-sm flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="text-base font-bold text-white">Complete the AI Profiler</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Answer engaging scenario questions to unlock your Career Readiness Score, trait radar, and high-suitability role rankings.
              </p>
            </div>

            <div className="liquid-glass p-7 rounded-3xl space-y-4 border border-white/[0.08]">
              <div className="w-10 h-10 rounded-2xl bg-white text-black font-bold text-sm flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="text-base font-bold text-white">Execute Your Blueprint</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Stream masterclasses with synchronized transcripts, follow recommended courses, and download ATS resume templates to land your target role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION */}
      <section id="faq" className="py-24 px-4 sm:px-8 lg:px-20 bg-black border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Questions &amp; Answers</span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Everything you need to know about PathSeeker and your Career Passport.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Is PathSeeker free to use?',
                a: 'Yes! Creating an account, taking the AI Career Assessment, exploring the full Career Bank, and downloading essential resume & interview toolkits is 100% free.',
              },
              {
                q: 'How does the AI Career Assessment match me with roles?',
                a: 'Our algorithm evaluates your cognitive inclinations, technical interests, problem-solving preferences, and workstyle across 10 specialized industry domains to generate high-accuracy percentage matches.',
              },
              {
                q: 'Can I change my career persona or target role later?',
                a: 'Absolutely. Whether you start as a Student, Graduate, or Professional, you can switch personas anytime in your dashboard to evaluate different career stages and unlock tailored guidance.',
              },
              {
                q: 'Are the downloadable resumes and interview guides ATS-friendly?',
                a: 'Yes. Every template in our Resource Library is engineered to pass Applicant Tracking Systems (ATS) and has been vetted by senior hiring managers across global tech companies.',
              },
              {
                q: 'Can I bookmark and export my career findings?',
                a: 'Yes. You can save your favorite career blueprints, attach private notes, track your quiz history, and export your entire Career Passport summary with one click.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="liquid-glass rounded-2xl border border-white/[0.08] overflow-hidden transition-all text-left"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-white hover:text-zinc-200 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. HIGH-CONVERTING BOTTOM CTA */}
      <section className="py-24 px-4 sm:px-8 lg:px-20 bg-gradient-to-b from-black via-zinc-950 to-black border-t border-white/[0.08] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-zinc-300">
            <Compass className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Ready to Take Control of Your Career?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Join thousands of ambitious seekers unlocking their strengths, exploring verified blueprints, and accelerating their trajectory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full liquid-glass text-zinc-200 hover:text-white font-semibold text-sm border border-white/10 hover:border-white/20 transition-all"
            >
              <span>Sign In to Passport</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 12. CLEAN MODERN SAAS FOOTER */}
      <footer className="py-14 px-4 sm:px-8 lg:px-20 bg-black border-t border-white/[0.08] text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center">
                <Compass className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-sm text-white">PathSeeker</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Discover What Fits You Best. Modern career navigation, cognitive profiling, and verified blueprints.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">Platform</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><a href="#career-bank" className="hover:text-white transition-colors">Career Bank</a></li>
              <li><a href="#ai-quiz" className="hover:text-white transition-colors">AI Assessment</a></li>
              <li><a href="#multimedia" className="hover:text-white transition-colors">Masterclasses</a></li>
              <li><a href="#resources" className="hover:text-white transition-colors">Resource Library</a></li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">Personas</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><Link to="/register?role=student" className="hover:text-white transition-colors">Students Track</Link></li>
              <li><Link to="/register?role=graduate" className="hover:text-white transition-colors">Graduates Track</Link></li>
              <li><Link to="/register?role=professional" className="hover:text-white transition-colors">Professionals Track</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">Company</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Customer Portal</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Join Free</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600 font-mono">
          <span>&copy; {new Date().getFullYear()} PathSeeker Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
