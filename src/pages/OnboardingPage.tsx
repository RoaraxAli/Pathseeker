import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  GraduationCap,
  Briefcase,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Cloud,
  Cpu,
  ShieldAlert,
  Palette,
  HeartPulse,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, logout } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(profile?.role || 'student');
  const [selectedGender, setSelectedGender] = useState<string>(profile?.gender || '');
  const [selectedEducation, setSelectedEducation] = useState<string>(
    profile?.educationLevel || 'Undergraduate'
  );
  const [selectedDomain, setSelectedDomain] = useState<string>(
    profile?.targetRole || 'Full-Stack Cloud Architect'
  );
  const [completionStatus, setCompletionStatus] = useState('Initializing your passport...');

  const handleFinishOnboarding = async () => {
    setStep(4);

    const statuses = [
      'Calibrating your Career Readiness Score...',
      'Tailoring ATS toolkits and course tracks...',
      'Synchronizing Career Passport with MongoDB Atlas...',
      'Ready! Launching your personalized dashboard...',
    ];

    statuses.forEach((msg, idx) => {
      setTimeout(() => {
        setCompletionStatus(msg);
      }, (idx + 1) * 600);
    });

    try {
      await updateProfile({
        role: selectedRole,
        gender: selectedGender,
        educationLevel: selectedEducation,
        targetRole: selectedDomain,
        isOnboarded: true,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2600);
    } catch (err) {
      console.error('Failed to update profile during onboarding:', err);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }
  };

  const personas = [
    {
      id: 'student',
      title: 'Student Explorer',
      subtitle: 'Currently studying or exploring initial tech trajectories',
      description: 'Unlock degree roadmaps, fundamentals primers, scholarship guides, and entry skill blueprints.',
      icon: GraduationCap,
      tags: ['Degree Primers', 'Scholarships', 'Foundations'],
    },
    {
      id: 'graduate',
      title: 'Recent Graduate',
      subtitle: 'Transitioning from academia into entry industry roles',
      description: 'Access ATS-optimized resume packs, 30-day technical interview checklists, and project kits.',
      icon: Briefcase,
      tags: ['ATS Resumes', 'Interview Prep', 'First Job'],
    },
    {
      id: 'professional',
      title: 'Industry Professional',
      subtitle: 'Currently in the workforce aiming for promotion or pivot',
      description: 'Explore senior compensation tiers, leadership masterclasses, and executive skill frameworks.',
      icon: UserCheck,
      tags: ['Senior Salaries', 'Leadership', 'Domain Shift'],
    },
  ];

  const genderOptions = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'non-binary', label: 'Non-Binary' },
    { id: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];

  const educationLevels = [
    'High School / Secondary College',
    'Undergraduate Student (In Progress)',
    'Bachelor’s Degree Graduate',
    'Master’s or Doctoral (Postgraduate)',
    'Self-Taught Developer / Bootcamp Graduate',
    'Experienced Working Professional',
  ];

  const domains = [
    { id: 'Full-Stack Cloud Architect', name: 'Software & Cloud Architecture', icon: Cloud, count: '6 Roles' },
    { id: 'AI & Generative LLM Engineer', name: 'AI & Machine Learning', icon: Cpu, count: '5 Roles' },
    { id: 'Cybersecurity Threat Hunter', name: 'Cybersecurity & Defense', icon: ShieldAlert, count: '4 Roles' },
    { id: 'Senior Product Designer', name: 'Product Design & UI/UX', icon: Palette, count: '3 Roles' },
    { id: 'Clinical Health Informatics', name: 'Healthcare & Biotech', icon: HeartPulse, count: '2 Roles' },
    { id: 'Quantitative Strategy Lead', name: 'Fintech & Strategy', icon: TrendingUp, count: '3 Roles' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Header Navigation */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shadow-md">
            <Compass className="w-4 h-4 text-black" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white">PathSeeker</span>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">&bull; Career Passport</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Logged in as <strong className="text-white">{profile?.displayName || profile?.email}</strong>
          </span>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-full liquid-glass text-zinc-400 hover:text-white hover:border-white/20 text-xs flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Multi-Step Wizard Container */}
      <main className="max-w-3xl w-full mx-auto my-auto py-8">
        {/* Step Progress Header */}
        {step < 4 && (
          <div className="mb-8 space-y-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Step {step} of 3 &bull; Profile Calibration</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {step === 1 && 'Select Your Career Persona'}
              {step === 2 && 'Tell Us About Yourself'}
              {step === 3 && 'Choose Your Primary Target Domain'}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
              {step === 1 && 'This customizes your dashboard roadmap, career recommendations, and downloadable toolkits.'}
              {step === 2 && 'Personalize your demographic profile and educational background for exact benchmark calibration.'}
              {step === 3 && 'Select the industry domain you want featured in your first Career Blueprint recommendations.'}
            </p>

            {/* Stepper Dots & Bars */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-12 bg-white'
                      : s < step
                      ? 'w-6 bg-zinc-600'
                      : 'w-6 bg-zinc-900'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-2xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: CAREER PERSONA */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-3.5">
                  {personas.map((persona) => {
                    const Icon = persona.icon;
                    const isSelected = selectedRole === persona.id;
                    return (
                      <div
                        key={persona.id}
                        onClick={() => setSelectedRole(persona.id as UserRole)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left group ${
                          isSelected
                            ? 'bg-white/[0.08] border-white shadow-lg'
                            : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-white border border-white/10 group-hover:scale-105'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-white">{persona.title}</h3>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full bg-white text-black text-[10px] font-bold">
                                  Selected
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400">{persona.subtitle}</p>
                            <p className="text-[11px] text-zinc-500 pt-0.5">{persona.description}</p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                          <div className="flex flex-wrap gap-1">
                            {persona.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-zinc-400 border border-white/5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'bg-white border-white text-black'
                                : 'border-white/20 text-transparent'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 fill-black text-white" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-7 py-3 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Continue to Step 2</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: GENDER & EDUCATION LEVEL */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                {/* Gender Picker */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-zinc-200 uppercase font-mono tracking-wider block">
                    1. What is your gender?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {genderOptions.map((opt) => {
                      const isSelected = selectedGender === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedGender(opt.id)}
                          className={`p-3.5 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-white text-black border-white shadow-md'
                              : 'bg-white/[0.02] text-zinc-300 border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 fill-black text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Education Level Selector */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-zinc-200 uppercase font-mono tracking-wider block">
                    2. Highest Education / Current Background
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {educationLevels.map((lvl) => {
                      const isSelected = selectedEducation === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSelectedEducation(lvl)}
                          className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-white text-black font-semibold border-white shadow-md'
                              : 'bg-white/[0.02] text-zinc-300 border-white/[0.08] hover:bg-white/[0.05]'
                          }`}
                        >
                          <span className="truncate">{lvl}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-black text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-full liquid-glass text-zinc-300 hover:text-white font-medium text-xs border border-white/10 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-7 py-3 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Continue to Step 3</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PRIMARY TARGET DOMAIN */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-zinc-200 uppercase font-mono tracking-wider block">
                    Choose Your Primary Domain Interest
                  </label>
                  <p className="text-xs text-zinc-400">
                    We will prioritize roles and learning roadmaps from this domain in your initial overview.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {domains.map((dom) => {
                      const Icon = dom.icon;
                      const isSelected = selectedDomain === dom.id;
                      return (
                        <div
                          key={dom.id}
                          onClick={() => setSelectedDomain(dom.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-white/[0.08] border-white shadow-md'
                              : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/10'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">{dom.name}</h4>
                              <span className="text-[10px] text-zinc-500 font-mono">{dom.count}</span>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-white border-white text-black'
                                : 'border-white/20 text-transparent'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 fill-black text-white" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3 Actions */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-full liquid-glass text-zinc-300 hover:text-white font-medium text-xs border border-white/10 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishOnboarding}
                    className="px-8 py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Complete &amp; Enter Dashboard</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: FINALIZING ANIMATION */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="py-12 px-4 text-center space-y-6"
              >
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-white/20 border-t-white animate-spin absolute" />
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                    <Compass className="w-6 h-6 animate-pulse text-black" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Generating Your Career Passport
                  </h2>
                  <p className="text-xs font-mono text-zinc-400 animate-pulse">
                    {completionStatus}
                  </p>
                </div>

                <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Target Persona:</span>
                    <span className="font-semibold text-white capitalize">{selectedRole}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Gender:</span>
                    <span className="font-semibold text-white capitalize">{selectedGender || 'Not Specified'}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Education Level:</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{selectedEducation}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Primary Domain:</span>
                    <span className="font-semibold text-white">{selectedDomain}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center py-3 text-[11px] text-zinc-600 font-mono">
        &copy; {new Date().getFullYear()} PathSeeker Inc. All rights reserved. &bull; Career Passport Platform
      </footer>
    </div>
  );
};
