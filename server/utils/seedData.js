import { Career } from '../models/Career.js';
import { Multimedia } from '../models/Multimedia.js';
import { QuizQuestion } from '../models/QuizQuestion.js';
import { SuccessStory } from '../models/SuccessStory.js';
import { Resource } from '../models/Resource.js';
import { Feedback } from '../models/Feedback.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

export const SEED_CAREERS = [
  {
    title: 'Full-Stack Cloud Architect',
    slug: 'full-stack-cloud-architect',
    domain: 'Software & Cloud',
    summary: 'Design and implement scalable distributed cloud applications and resilient end-to-end architectures.',
    description: 'Full-Stack Cloud Architects build modern distributed systems, integrate microservices with React/Node/TypeScript, orchestrate containerized workloads with Kubernetes, and design enterprise cloud infrastructure on AWS, Azure, and Google Cloud.',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'AWS / GCP', 'Docker & Kubernetes', 'Microservices', 'GraphQL', 'MongoDB & PostgreSQL'],
    educationPath: 'B.S. in Computer Science / Software Engineering or equivalent industry certifications (AWS Solutions Architect, CKA).',
    salaryRange: { entry: 85000, mid: 135000, senior: 195000, currency: 'USD ($)' },
    jobDemand: 'Explosive',
    growthRate: '+26% (2024-2030)',
    certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional Cloud Architect', 'Certified Kubernetes Administrator (CKA)'],
    dailyTasks: [
      'Architect resilient full-stack microservices pipelines',
      'Optimize database query throughput and caching strategies',
      'Conduct architectural reviews and CI/CD security audits',
      'Collaborate with frontend and AI engineering squads',
    ],
    recommendedCourses: [
      { name: 'Distributed Systems & Cloud Architecture', platform: 'Coursera / AWS', link: 'https://aws.amazon.com/training/' },
      { name: 'Advanced React 18 & Node Microservices', platform: 'Udemy Pro', link: 'https://www.udemy.com' },
    ],
    targetAudience: ['student', 'graduate', 'professional'],
    isTrending: true,
    viewsCount: 3840,
    bookmarkCount: 420,
    iconName: 'Cloud',
  },
  {
    title: 'AI & Generative LLM Engineer',
    slug: 'ai-generative-llm-engineer',
    domain: 'AI & Data Science',
    summary: 'Build intelligent autonomous agent workflows, fine-tune foundation models, and engineer RAG pipelines.',
    description: 'AI & Generative LLM Engineers specialize in designing multi-agent autonomous systems, creating Retrieval-Augmented Generation (RAG) architectures with vector databases, fine-tuning open-weights models, and deploying high-throughput inference endpoints.',
    requiredSkills: ['Python', 'PyTorch', 'LangChain / LlamaIndex', 'Vector Databases (Pinecone/Qdrant)', 'Transformers', 'FastAPI', 'Agentic Workflows'],
    educationPath: 'Degree in Computer Science, Artificial Intelligence, Data Science, or specialized AI Bootcamps & research projects.',
    salaryRange: { entry: 95000, mid: 155000, senior: 220000, currency: 'USD ($)' },
    jobDemand: 'Explosive',
    growthRate: '+38% (2024-2030)',
    certifications: ['DeepLearning.AI Generative AI Specialization', 'NVIDIA Certified Associate: Generative AI', 'Databricks Certified Generative AI Engineer'],
    dailyTasks: [
      'Build and evaluate multi-agent reasoning workflows',
      'Fine-tune domain-specific LLM parameters with LoRA/QLoRA',
      'Benchmark token latencies and hallucination guardrails',
      'Integrate vector embeddings with enterprise databases',
    ],
    recommendedCourses: [
      { name: 'Generative AI with Large Language Models', platform: 'DeepLearning.AI', link: 'https://deeplearning.ai' },
      { name: 'Agentic Workflows & Multi-Agent Systems', platform: 'Coursera', link: 'https://coursera.org' },
    ],
    targetAudience: ['student', 'graduate', 'professional'],
    isTrending: true,
    viewsCount: 5200,
    bookmarkCount: 680,
    iconName: 'Cpu',
  },
  {
    title: 'Cybersecurity Threat Hunter & Defense Analyst',
    slug: 'cybersecurity-threat-hunter',
    domain: 'Cybersecurity',
    summary: 'Protect digital assets, analyze zero-day attack vectors, and build zero-trust security postures.',
    description: 'Threat Hunters proactively discover hidden adversaries within networks before detection by standard automated systems. They conduct digital forensics, reverse engineer malicious payloads, and implement defense-in-depth security architectures.',
    requiredSkills: ['SIEM & SOC (Splunk/Sentinel)', 'Network Forensics', 'Penetration Testing', 'Linux & Windows Internals', 'Python/Bash Scripting', 'Cryptography', 'Zero-Trust Architecture'],
    educationPath: 'B.S. in Cybersecurity, Information Systems, or hands-on security certifications (CISSP, CEH, CompTIA Security+).',
    salaryRange: { entry: 78000, mid: 125000, senior: 180000, currency: 'USD ($)' },
    jobDemand: 'High',
    growthRate: '+32% (2024-2030)',
    certifications: ['CISSP (Certified Information Systems Security Professional)', 'CompTIA Security+', 'Certified Ethical Hacker (CEH)'],
    dailyTasks: [
      'Investigate anomalous network traffic and endpoint alerts',
      'Perform simulated adversarial penetration testing exercises',
      'Formulate incident response playbooks for zero-day vulnerabilities',
      'Audit compliance and cloud encryption standards',
    ],
    recommendedCourses: [
      { name: 'Offensive Security & Network Defense', platform: 'OffSec', link: 'https://offsec.com' },
      { name: 'Google Cybersecurity Professional Certificate', platform: 'Coursera', link: 'https://coursera.org' },
    ],
    targetAudience: ['student', 'graduate', 'professional'],
    isTrending: false,
    viewsCount: 2980,
    bookmarkCount: 310,
    iconName: 'ShieldAlert',
  },
  {
    title: 'Senior Product Designer & Design Systems Lead',
    slug: 'senior-product-designer',
    domain: 'Design & UX',
    summary: 'Craft world-class digital user experiences, typography systems, and accessible multi-platform design tokens.',
    description: 'Product Designers merge user research, visual storytelling, and systems thinking to create intuitive interfaces. They lead design token libraries, perform usability testing, and bridge design concepts directly into production code.',
    requiredSkills: ['Figma Prototyping', 'Design Systems & Tokens', 'User Research & Journey Mapping', 'Information Architecture', 'Framer / Tailwind CSS basics', 'Accessibility (WCAG 2.1)'],
    educationPath: 'Degree in Human-Computer Interaction (HCI), Graphic/Industrial Design, or demonstrable interactive design portfolio.',
    salaryRange: { entry: 72000, mid: 118000, senior: 170000, currency: 'USD ($)' },
    jobDemand: 'High',
    growthRate: '+19% (2024-2030)',
    certifications: ['Nielsen Norman Group UX Master Certified', 'Google UX Design Certificate', 'Interaction Design Foundation Specialist'],
    dailyTasks: [
      'Produce high-fidelity interactive wireframes and design system components',
      'Conduct qualitative user interviews and usability testing sessions',
      'Define component token guidelines with frontend engineers',
      'Iterate on micro-interactions and motion choreographies',
    ],
    recommendedCourses: [
      { name: 'Design System Mastery & Figma Tokens', platform: 'DesignX Academy', link: 'https://figma.com' },
      { name: 'User Experience Research Foundations', platform: 'Interaction Design Foundation', link: 'https://interaction-design.org' },
    ],
    targetAudience: ['student', 'graduate', 'professional'],
    isTrending: true,
    viewsCount: 3410,
    bookmarkCount: 450,
    iconName: 'Palette',
  },
  {
    title: 'Healthcare Informatics Specialist',
    slug: 'healthcare-informatics-specialist',
    domain: 'Healthcare & Biotech',
    summary: 'Bridge clinical medical protocols with modern digital electronic health record systems and biometric data pipelines.',
    description: 'Healthcare Informatics Specialists analyze medical data streams to enhance patient care outcomes, ensure HIPAA/GDPR regulatory compliance, and deploy AI diagnostic support algorithms within clinical workflows.',
    requiredSkills: ['Electronic Health Records (EHR)', 'HL7 & FHIR Protocols', 'Health Data Analytics', 'SQL & R / Python', 'Biostatistics', 'HIPAA Compliance'],
    educationPath: 'Degree in Health Informatics, Biomedical Science, Nursing Informatics, or Data Science in Healthcare.',
    salaryRange: { entry: 75000, mid: 115000, senior: 160000, currency: 'USD ($)' },
    jobDemand: 'High',
    growthRate: '+24% (2024-2030)',
    certifications: ['CPHIMS (Certified Professional in Healthcare Info & Mgmt)', 'RHIA (Registered Health Information Administrator)', 'Epic Systems Certified Analyst'],
    dailyTasks: [
      'Structure clinical data pipelines according to FHIR standards',
      'Analyze hospital readmission metrics and predictive indicators',
      'Collaborate with physicians to streamline digital medical charting',
      'Maintain rigorous patient data privacy controls',
    ],
    recommendedCourses: [
      { name: 'Health Informatics on FHIR', platform: 'Georgia Tech / edX', link: 'https://edx.org' },
      { name: 'Biomedical Data Science', platform: 'Johns Hopkins / Coursera', link: 'https://coursera.org' },
    ],
    targetAudience: ['graduate', 'professional'],
    isTrending: false,
    viewsCount: 1950,
    bookmarkCount: 220,
    iconName: 'Activity',
  },
  {
    title: 'Quantitative Fintech Algorithmic Trader',
    slug: 'quantitative-fintech-trader',
    domain: 'Fintech & Business',
    summary: 'Develop mathematical models, low-latency execution algorithms, and automated portfolio risk engines.',
    description: 'Quantitative Traders leverage statistical arbitrage, machine learning, and time-series modeling to execute high-volume financial transactions across global equities, crypto derivatives, and decentralized finance markets.',
    requiredSkills: ['C++ & Python', 'Stochastic Calculus & Statistics', 'Time Series Modeling (ARIMA/GARCH)', 'Low-Latency Systems', 'Algorithmic Execution', 'Risk Management'],
    educationPath: 'M.S. or Ph.D. in Quantitative Finance, Mathematics, Physics, Computer Science, or Econometrics.',
    salaryRange: { entry: 110000, mid: 190000, senior: 320000, currency: 'USD ($)' },
    jobDemand: 'High',
    growthRate: '+18% (2024-2030)',
    certifications: ['CQF (Certificate in Quantitative Finance)', 'CFA (Chartered Financial Analyst)', 'FRM (Financial Risk Manager)'],
    dailyTasks: [
      'Backtest high-frequency statistical arbitrage strategies',
      'Optimize order routing and execution slippage algorithms',
      'Monitor real-time Value-at-Risk (VaR) exposures',
      'Implement real-time market data streaming parsers',
    ],
    recommendedCourses: [
      { name: 'Computational Investing & Algorithmic Trading', platform: 'WorldQuant University', link: 'https://wqu.edu' },
      { name: 'Mathematical Methods for Quantitative Finance', platform: 'MIT OpenCourseWare', link: 'https://ocw.mit.edu' },
    ],
    targetAudience: ['graduate', 'professional'],
    isTrending: true,
    viewsCount: 4100,
    bookmarkCount: 510,
    iconName: 'TrendingUp',
  },
  {
    title: 'Technical Product Manager (AI & Data Platforms)',
    slug: 'technical-product-manager',
    domain: 'Product & Strategy',
    summary: 'Lead cross-functional engineering teams to ship high-impact data products and developer-centric APIs.',
    description: 'Technical Product Managers bridge customer pain points with deep technical architectures. They define product roadmaps, craft PRDs, prioritize sprint backlogs, and measure key adoption and North Star metrics.',
    requiredSkills: ['Product Strategy & Vision', 'Technical PRD Writing', 'Data Analytics (Mixpanel/Amplitude/SQL)', 'Scrum / Agile Leadership', 'System Architecture Awareness', 'A/B Testing'],
    educationPath: 'Degree in Engineering or Business combined with demonstrable tech product management experience or MBA.',
    salaryRange: { entry: 90000, mid: 145000, senior: 210000, currency: 'USD ($)' },
    jobDemand: 'Explosive',
    growthRate: '+21% (2024-2030)',
    certifications: ['Pragmatic Institute Certified (PMC-III)', 'Scrum Product Owner (CSPO)', 'Product School Product Leader Certification'],
    dailyTasks: [
      'Synthesize user feedback and market research into functional roadmaps',
      'Work with engineering leads to scope feature milestones',
      'Analyze conversion funnels and product retention telemetry',
      'Present quarterly release plans to executive stakeholders',
    ],
    recommendedCourses: [
      { name: 'AI Product Management Specialization', platform: 'Duke University / Coursera', link: 'https://coursera.org' },
      { name: 'Product Management Masterclass', platform: 'Product School', link: 'https://productschool.com' },
    ],
    targetAudience: ['graduate', 'professional'],
    isTrending: true,
    viewsCount: 3780,
    bookmarkCount: 490,
    iconName: 'Layers',
  },
  {
    title: 'DevOps & Site Reliability Engineer (SRE)',
    slug: 'devops-site-reliability-engineer',
    domain: 'Software & Cloud',
    summary: 'Ensure 99.999% uptime, automate infrastructure provisioning, and optimize CI/CD continuous deployment.',
    description: 'SREs apply software engineering principles to operations problems. They build automated self-healing infrastructures, manage observability stacks (Prometheus, Grafana, OpenTelemetry), and eliminate manual toil across production environments.',
    requiredSkills: ['Terraform & Ansible', 'Kubernetes & Docker', 'Linux Kernel & Networking', 'CI/CD Pipelines (GitHub Actions/GitLab)', 'Prometheus / Grafana', 'Go / Python'],
    educationPath: 'Degree in Computer Science or Software Engineering with practical Linux sysadmin & cloud experience.',
    salaryRange: { entry: 82000, mid: 130000, senior: 185000, currency: 'USD ($)' },
    jobDemand: 'High',
    growthRate: '+23% (2024-2030)',
    certifications: ['Certified Kubernetes Security Specialist (CKS)', 'HashiCorp Certified Terraform Associate', 'AWS Certified DevOps Engineer'],
    dailyTasks: [
      'Manage Terraform Infrastructure-as-Code modules',
      'Build automated multi-region failover and blue/green deployments',
      'Configure real-time telemetry alerts and on-call escalation policies',
      'Conduct post-mortem incident analyses',
    ],
    recommendedCourses: [
      { name: 'Site Reliability Engineering: Measuring & Managing Reliability', platform: 'Google Cloud / Coursera', link: 'https://coursera.org' },
      { name: 'Kubernetes Mastery with Helm & GitOps', platform: 'Udemy Pro', link: 'https://udemy.com' },
    ],
    targetAudience: ['student', 'graduate', 'professional'],
    isTrending: false,
    viewsCount: 2650,
    bookmarkCount: 290,
    iconName: 'Server',
  },
];

export const SEED_MULTIMEDIA = [
  {
    title: 'The Modern Career Passport: Navigating the 2026 AI Economy',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    domain: 'Software & Cloud',
    duration: '18:42',
    speaker: {
      name: 'Dr. Aris Thorne',
      role: 'Principal Cloud Strategist',
      company: 'PathSeeker Global',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    tags: ['Career Growth', 'Cloud Architecture', 'AI Economy', 'Skills Passport'],
    transcript: 'Welcome to this PathSeeker masterclass. Today we dissect the fundamental shifts in full-stack architecture and AI agents. Transitioning from academic fundamentals to production engineering requires building tangible portfolio projects, mastering cloud-native tooling, and understanding continuous learning cycles. In this 18-minute session, we will break down the essential milestones for students, entry graduates, and seasoned engineers seeking promotion.',
    ratingAvg: 4.9,
    ratingCount: 142,
    viewsCount: 3820,
    targetAudience: ['student', 'graduate', 'professional'],
    isFeatured: true,
  },
  {
    title: 'Podcast: From Junior Student to Lead AI Engineer in 3 Years',
    type: 'podcast',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop',
    domain: 'AI & Data Science',
    duration: '32:15',
    speaker: {
      name: 'Elena Rostova',
      role: 'Founding Engineer',
      company: 'Cognitive Matrix Labs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    tags: ['AI Roadmap', 'Interview Prep', 'Fast-Track Career', 'Mentorship'],
    transcript: 'Host: Today on PathSeeker Audio Sessions, we sit down with Elena Rostova. Elena, you transitioned straight out of your undergraduate degree into building multimodal agent systems. What was your core strategy? Elena: The biggest difference was hands-on execution. Instead of simply following tutorials, I built open-source tools that solved real operational bottlenecks.',
    ratingAvg: 4.8,
    ratingCount: 98,
    viewsCount: 2450,
    targetAudience: ['student', 'graduate'],
    isFeatured: true,
  },
  {
    title: 'Animated Explainer: How to Pass Cybersecurity Technical Interviews',
    type: 'explainer',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
    domain: 'Cybersecurity',
    duration: '11:10',
    speaker: {
      name: 'Marcus Chen',
      role: 'Lead Threat Researcher',
      company: 'CyberShield International',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    tags: ['Cybersecurity', 'Technical Interview', 'SOC', 'Live Explainer'],
    transcript: 'In this animated breakdown, we visualize the 4 key stages of high-level security interviews: network packet inspection scenarios, incident response live roleplays, cryptography design questions, and behavioural integrity testing.',
    ratingAvg: 4.7,
    ratingCount: 67,
    viewsCount: 1980,
    targetAudience: ['graduate', 'professional'],
    isFeatured: false,
  },
  {
    title: 'UX/UI Design Systems & Product Strategy Breakdown',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop',
    domain: 'Design & UX',
    duration: '15:20',
    speaker: {
      name: 'Amira Patel',
      role: 'Design Director',
      company: 'Apex Design Collective',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    },
    tags: ['Design Systems', 'Figma', 'UI/UX', 'Portfolio Review'],
    transcript: 'Designing at enterprise scale is about governance, token systems, and accessibility. In this session, we construct a scalable typography and colour palette that transitions smoothly into Tailwind CSS and React component libraries.',
    ratingAvg: 4.9,
    ratingCount: 112,
    viewsCount: 3100,
    targetAudience: ['student', 'graduate', 'professional'],
    isFeatured: true,
  },
];

export const SEED_QUIZ_QUESTIONS = [
  {
    order: 1,
    questionText: 'When solving a complex problem, which activity excites you the most?',
    category: 'Problem Solving Style',
    type: 'multiple_choice',
    timeLimitSec: 45,
    options: [
      {
        label: 'Architecting algorithms, coding software logic, and building functional applications.',
        traitScores: { tech: 5, data: 3, creative: 1, leadership: 1, healthcare: 0, cybersecurity: 2 },
      },
      {
        label: 'Analyzing statistical datasets, detecting patterns, and training predictive models.',
        traitScores: { tech: 3, data: 5, creative: 1, leadership: 1, healthcare: 2, cybersecurity: 2 },
      },
      {
        label: 'Crafting beautiful, intuitive visual interfaces and conceptualizing user journeys.',
        traitScores: { tech: 2, data: 0, creative: 5, leadership: 2, healthcare: 0, cybersecurity: 0 },
      },
      {
        label: 'Investigating vulnerabilities, breaking down security loopholes, and protecting networks.',
        traitScores: { tech: 4, data: 2, creative: 0, leadership: 1, healthcare: 0, cybersecurity: 5 },
      },
    ],
  },
  {
    order: 2,
    questionText: 'I enjoy collaborating with stakeholders to define roadmaps, prioritize team goals, and lead product launches.',
    category: 'Leadership & Strategy',
    type: 'likert',
    timeLimitSec: 30,
    options: [
      { label: 'Strongly Agree (5/5)', traitScores: { leadership: 5, tech: 2, data: 2, creative: 3, healthcare: 1, cybersecurity: 1 } },
      { label: 'Agree (4/5)', traitScores: { leadership: 4, tech: 2, data: 2, creative: 2, healthcare: 1, cybersecurity: 1 } },
      { label: 'Neutral (3/5)', traitScores: { leadership: 2, tech: 2, data: 2, creative: 2, healthcare: 1, cybersecurity: 1 } },
      { label: 'Disagree (2/5)', traitScores: { leadership: 1, tech: 3, data: 3, creative: 2, healthcare: 1, cybersecurity: 2 } },
      { label: 'Strongly Disagree (1/5)', traitScores: { leadership: 0, tech: 4, data: 4, creative: 3, healthcare: 1, cybersecurity: 3 } },
    ],
  },
  {
    order: 3,
    questionText: 'Scenario: A server cluster suddenly experiences an abnormal traffic surge and potential unauthorized access attempt. What is your immediate instinct?',
    category: 'Security & Systems',
    type: 'scenario',
    timeLimitSec: 60,
    options: [
      {
        label: 'Inspect packet headers, trace malicious IP origins, and enact firewall containment rules.',
        traitScores: { cybersecurity: 5, tech: 3, data: 2, leadership: 1, creative: 0, healthcare: 0 },
      },
      {
        label: 'Analyze traffic volume metrics and spin up auto-scaling cloud replica nodes.',
        traitScores: { tech: 5, data: 3, cybersecurity: 3, leadership: 2, creative: 0, healthcare: 0 },
      },
      {
        label: 'Coordinate communication across engineering and management to manage user impact.',
        traitScores: { leadership: 5, tech: 1, data: 2, creative: 1, cybersecurity: 2, healthcare: 0 },
      },
      {
        label: 'Run automated anomaly detection scripts to classify pattern deviations in historical records.',
        traitScores: { data: 5, tech: 3, cybersecurity: 3, leadership: 1, creative: 0, healthcare: 1 },
      },
    ],
  },
  {
    order: 4,
    questionText: 'How comfortable are you working with mathematical models, statistics, and machine learning algorithms?',
    category: 'Mathematical & AI Proficiency',
    type: 'likert',
    timeLimitSec: 30,
    options: [
      { label: 'Extremely Enthusiastic & Fluent', traitScores: { data: 5, tech: 4, creative: 0, leadership: 1, healthcare: 2, cybersecurity: 1 } },
      { label: 'Comfortable with applied concepts', traitScores: { data: 4, tech: 3, creative: 1, leadership: 2, healthcare: 2, cybersecurity: 1 } },
      { label: 'Moderate / Willing to learn', traitScores: { data: 3, tech: 3, creative: 2, leadership: 2, healthcare: 2, cybersecurity: 1 } },
      { label: 'Prefer visual and design workflows', traitScores: { creative: 5, tech: 2, data: 1, leadership: 2, healthcare: 0, cybersecurity: 0 } },
    ],
  },
  {
    order: 5,
    questionText: 'Which work environment and impact motivates you the most for your daily career?',
    category: 'Career Value & Passion',
    type: 'multiple_choice',
    timeLimitSec: 45,
    options: [
      {
        label: 'Pushing the boundaries of software and building global web applications used by millions.',
        traitScores: { tech: 5, creative: 2, leadership: 2, data: 3, healthcare: 0, cybersecurity: 2 },
      },
      {
        label: 'Pioneering AI reasoning, neural networks, and automated decision-making engines.',
        traitScores: { data: 5, tech: 4, leadership: 1, creative: 1, healthcare: 2, cybersecurity: 2 },
      },
      {
        label: 'Improving healthcare diagnostics, patient data systems, and biomedical advancements.',
        traitScores: { healthcare: 5, data: 3, tech: 2, leadership: 2, creative: 1, cybersecurity: 1 },
      },
      {
        label: 'Shaping unforgettable brand aesthetics, visual interfaces, and delightful digital experiences.',
        traitScores: { creative: 5, tech: 2, leadership: 2, data: 1, healthcare: 0, cybersecurity: 0 },
      },
    ],
  },
];

export const SEED_STORIES = [
  {
    name: 'Sarah Lin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    domain: 'Software & Cloud',
    currentRole: 'Lead Cloud Solutions Architect',
    company: 'CloudMatrix Global',
    educationPath: 'B.S. in Computer Science \u2192 AWS Certified Solutions Architect Professional',
    challenges: 'Felt overwhelmed by the sheer number of frameworks in college. Struggled with imposter syndrome when applying for competitive tech internships.',
    milestones: [
      { year: '2022', title: 'First Full-Stack Project', description: 'Built an open-source collaborative dashboard that gained 400+ GitHub stars.' },
      { year: '2023', title: 'Junior Cloud Developer', description: 'Joined a high-growth startup handling Kubernetes cluster migrations.' },
      { year: '2025', title: 'Promotion to Lead Architect', description: 'Spearheaded zero-downtime infrastructure powering 10M+ daily API transactions.' },
    ],
    outcome: 'Successfully leading a 14-person distributed cloud engineering team with a total compensation exceeding $180,000.',
    advice: 'Do not try to learn everything at once. Pick one solid full-stack foundation (MERN/TypeScript), deploy real projects with active databases, and learn to communicate technical tradeoffs.',
    status: 'featured',
    likesCount: 248,
  },
  {
    name: 'Tariq Mansoor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    domain: 'AI & Data Science',
    currentRole: 'Senior Machine Learning Specialist',
    company: 'NeuralFlow Technologies',
    educationPath: 'Electrical Engineering graduate \u2192 Self-taught AI & LangChain practitioner',
    challenges: 'Transitioned from non-CS engineering background without prior Python or deep learning experience.',
    milestones: [
      { year: '2023', title: 'Intensive AI Skill Building', description: 'Completed 6 end-to-end LLM agent projects and contributed to open-source RAG libraries.' },
      { year: '2024', title: 'AI Research Fellowship', description: 'Published benchmark evaluations on multi-agent code generation.' },
      { year: '2026', title: 'Senior ML Specialist', description: 'Directing enterprise generative AI implementations for Fortune 500 financial clients.' },
    ],
    outcome: 'Earned career independence and works remotely with top international AI researchers.',
    advice: 'Proof of work is king. A working GitHub repository and an interactive live demo will beat a generic resume every single time.',
    status: 'approved',
    likesCount: 189,
  },
  {
    name: 'Chloe Dubois',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    domain: 'Design & UX',
    currentRole: 'Principal UX Director',
    company: 'Starlight Interactive',
    educationPath: 'Fine Arts B.A. \u2192 Interaction Design Bootcamp \u2192 Nielsen Norman Certification',
    challenges: 'Navigating the shift from traditional print media to complex interactive design systems and developer handoffs.',
    milestones: [
      { year: '2021', title: 'Junior UI Designer', description: 'Created icon systems and mobile responsive layouts for fintech apps.' },
      { year: '2023', title: 'Design System Architect', description: 'Unified 8 fragmented product lines into a single accessible design token system.' },
      { year: '2026', title: 'Principal UX Director', description: 'Managing cross-platform UX strategy for web, mobile, and spatial computing.' },
    ],
    outcome: 'Recipient of 2 international Awwwards and regular keynote speaker on human-centered AI interfaces.',
    advice: 'Learn how engineers build your components. When you understand Flexbox, Grid, and component state, your designs become 10x more executable and respected.',
    status: 'featured',
    likesCount: 312,
  },
  {
    name: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    domain: 'Cybersecurity',
    currentRole: 'Lead Threat Hunter & Forensics Analyst',
    company: 'CyberVault Defense',
    educationPath: 'B.S. in Information Systems \u2192 CompTIA Security+ \u2192 CISSP & OSCP Certified',
    challenges: 'Overcoming entry-level experience requirements by building home lab environments and participating in global CTF (Capture The Flag) competitions.',
    milestones: [
      { year: '2022', title: 'SOC Tier 1 Analyst', description: 'Triaged 500+ security alerts daily and automated phishing analysis via Python.' },
      { year: '2024', title: 'Incident Responder', description: 'Led forensic investigations into zero-day ransomware incidents across healthcare networks.' },
      { year: '2026', title: 'Lead Threat Hunter', description: 'Architecting proactive threat hunting models and adversary emulation routines.' },
    ],
    outcome: 'Published 4 critical CVE vulnerability advisories and leads security operations for critical financial infrastructure.',
    advice: 'Build a home lab. Documenting your network capture analysis and vulnerability walk-throughs in public blog posts proves real-world capability faster than any test.',
    status: 'approved',
    likesCount: 204,
  },
  {
    name: 'Dr. Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    domain: 'Healthcare & Biotech',
    currentRole: 'Director of Clinical Health Informatics',
    company: 'BioHealth Analytics',
    educationPath: 'Biomedical Science Degree \u2192 M.S. in Health Data Science & FHIR Protocols',
    challenges: 'Bridging the cultural and technical gap between clinical healthcare providers and software engineering data teams.',
    milestones: [
      { year: '2021', title: 'Clinical Data Coordinator', description: 'Standardized EHR records across 6 regional medical clinics.' },
      { year: '2023', title: 'Health Informatics Lead', description: 'Deployed machine learning early-warning sepsis alert systems in intensive care units.' },
      { year: '2026', title: 'Director of Informatics', description: 'Overseeing clinical data pipelines and HIPAA-compliant AI diagnostic integrations.' },
    ],
    outcome: 'Her diagnostic pipeline reduced ICU emergency response latency by 34% across 12 partner hospitals.',
    advice: 'Healthcare desperately needs technologists who respect clinical workflows. Focus on data ethics, compliance, and user empathy alongside raw algorithms.',
    status: 'featured',
    likesCount: 278,
  },
  {
    name: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    domain: 'Product & Strategy',
    currentRole: 'VP of AI Product Strategy',
    company: 'Nexus Platforms',
    educationPath: 'B.A. in Economics \u2192 Technical Product Management Certification',
    challenges: 'Navigating rapid technological transitions and translating deep engineering complexities into clear commercial value propositions.',
    milestones: [
      { year: '2021', title: 'Associate Product Manager', description: 'Shipped customer self-service onboarding flows improving conversion by 28%.' },
      { year: '2023', title: 'Senior Product Manager', description: 'Managed cross-functional roadmap for developer API platforms handling 100M+ requests.' },
      { year: '2026', title: 'VP of Product Strategy', description: 'Defining generative AI product vision and enterprise go-to-market roadmaps.' },
    ],
    outcome: 'Guided 3 zero-to-one product launches generating over $45M in annual recurring revenue.',
    advice: 'The best product managers are master listeners. Spend twice as much time talking to frustrated users as you spend writing specifications.',
    status: 'approved',
    likesCount: 195,
  },
  {
    name: 'Liam O Connor',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    domain: 'Fintech & Business',
    currentRole: 'Principal Quantitative Strategy Lead',
    company: 'Horizon Capital Quant',
    educationPath: 'B.S. in Applied Mathematics & Statistics \u2192 CQF (Certificate in Quantitative Finance)',
    challenges: 'Mastering high-frequency execution architecture while maintaining strict risk management guardrails in volatile market conditions.',
    milestones: [
      { year: '2022', title: 'Quantitative Data Analyst', description: 'Engineered time-series statistical models for global ETF rebalancing.' },
      { year: '2024', title: 'Algorithmic Trader', description: 'Automated order-routing pipelines with sub-millisecond execution latency.' },
      { year: '2026', title: 'Principal Strategy Lead', description: 'Directing mathematical modeling for systematic multi-asset portfolio portfolios.' },
    ],
    outcome: 'Recognized in Forbes 30 Under 30 for algorithmic risk modeling innovation.',
    advice: 'Math and statistics are your superpower. Code is the vehicle, but rigorous probabilistic thinking is what separates great quants from the pack.',
    status: 'approved',
    likesCount: 167,
  },
];

export const SEED_RESOURCES = [
  {
    title: 'The 2026 Tech & Engineering Resume Master Toolkit',
    category: 'Resume Template',
    description: 'ATS-optimized resume templates in Markdown & PDF format with 50+ battle-tested bullet points for Software, Cloud, and AI roles.',
    fileUrl: 'https://example.com/pathseeker-resume-toolkit-2026.pdf',
    previewSnippet: 'Includes executive summary formulas, metric-driven achievement statements (e.g., "Reduced latency by 42% via Redis caching"), and skill categorization grids.',
    fileType: 'PDF & DOCX',
    fileSize: '1.8 MB',
    tags: ['ATS Resume', 'Software Engineer', 'Career Starter', 'Template'],
    targetAudience: ['student', 'graduate', 'professional'],
    downloadsCount: 1240,
    viewsCount: 3400,
    isPopular: true,
  },
  {
    title: 'Full-Stack & Cloud Developer Comprehensive Career Roadmap',
    category: 'Career Roadmap',
    description: 'Step-by-step visual progression guide from fundamentals (HTML/CSS/JS) to advanced distributed systems, Kubernetes, and AI integration.',
    fileUrl: 'https://example.com/pathseeker-fullstack-roadmap.pdf',
    previewSnippet: 'Phase 1: Modern Frontend & React 18 -> Phase 2: Express/Node & MongoDB Atlas -> Phase 3: Cloud Infrastructure & Docker -> Phase 4: Production SRE & Observability.',
    fileType: 'Interactive PDF',
    fileSize: '3.2 MB',
    tags: ['Roadmap', 'Full-Stack', 'Cloud', 'Beginner to Advanced'],
    targetAudience: ['student', 'graduate'],
    downloadsCount: 1890,
    viewsCount: 4620,
    isPopular: true,
  },
  {
    title: 'High-Impact Technical Interview Preparation Checklist',
    category: 'Interview Checklist',
    description: 'A 30-day structured checklist covering Data Structures & Algorithms, System Design walkthroughs, and behavioural STAR method answers.',
    fileUrl: 'https://example.com/pathseeker-interview-checklist.pdf',
    previewSnippet: 'Day 1-10: Core Data Structures -> Day 11-20: System Architecture & DB Indexing -> Day 21-27: Mock Interviews & Whiteboarding -> Day 28-30: Offer Negotiation Playbook.',
    fileType: 'PDF Checklist',
    fileSize: '1.2 MB',
    tags: ['Interview Prep', 'System Design', 'Algorithms', 'Checklist'],
    targetAudience: ['graduate', 'professional'],
    downloadsCount: 960,
    viewsCount: 2800,
    isPopular: false,
  },
  {
    title: 'Global Tech Scholarships & Graduate Fellowship Directory',
    category: 'Scholarship Guide',
    description: 'Curated list of 40+ international tech scholarships, diversity grants, and research fellowships for students and recent graduates.',
    fileUrl: 'https://example.com/pathseeker-scholarship-directory.pdf',
    previewSnippet: 'Covers eligibility criteria, application deadlines, portfolio recommendations, and recommendation letter templates for top tech institutions.',
    fileType: 'PDF Guide',
    fileSize: '2.6 MB',
    tags: ['Scholarships', 'Grants', 'Students', 'Global Education'],
    targetAudience: ['student', 'graduate'],
    downloadsCount: 810,
    viewsCount: 2150,
    isPopular: false,
  },
];

export const SEED_FEEDBACK = [
  {
    userName: 'David Vance',
    userEmail: 'david.vance@example.com',
    category: 'suggestion',
    subject: 'Additional Filters for Remote International Roles',
    message: 'The Career Bank is phenomenal! It would be even better if we could filter careers specifically by remote timezone flexibility (e.g., GMT vs EST).',
    sentiment: 'positive',
    status: 'resolved',
    adminResponse: 'Thank you David! We have added global remote and hybrid demand indicators across all career profiles.',
    respondedAt: new Date(Date.now() - 86400000),
  },
  {
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@example.com',
    category: 'appreciation',
    subject: 'AI Quiz Accuracy is Outstanding',
    message: 'I took the 5-step interest quiz and the suggested Full-Stack Cloud Architect role matched my exact skillset and target trajectory. Super impressed with the UI!',
    sentiment: 'positive',
    status: 'resolved',
    adminResponse: 'Thank you for your feedback Elena! Best of luck on your career passport journey.',
    respondedAt: new Date(Date.now() - 172800000),
  },
  {
    userName: 'Marcus Chen',
    userEmail: 'marcus.chen@example.com',
    category: 'query',
    subject: 'Request for Cybersecurity Podcast Video Subtitles',
    message: 'Are downloadable SRT or PDF transcripts available for the multimedia lectures?',
    sentiment: 'neutral',
    status: 'in-progress',
    adminResponse: 'We are currently adding interactive inline transcript toggles directly into the multimedia player component!',
    respondedAt: new Date(),
  },
];

export const seedDatabase = async () => {
  try {
    const careersCount = await Career.countDocuments();
    if (careersCount === 0) {
      console.log('🌱 Seeding Career Bank...');
      await Career.insertMany(SEED_CAREERS);
    }

    const multimediaCount = await Multimedia.countDocuments();
    if (multimediaCount === 0) {
      console.log('🌱 Seeding Multimedia Center...');
      await Multimedia.insertMany(SEED_MULTIMEDIA);
    }

    const quizCount = await QuizQuestion.countDocuments();
    if (quizCount === 0) {
      console.log('🌱 Seeding Quiz Questions...');
      await QuizQuestion.insertMany(SEED_QUIZ_QUESTIONS);
    }

    const storiesCount = await SuccessStory.countDocuments();
    if (storiesCount === 0) {
      console.log('🌱 Seeding Success Stories...');
      await SuccessStory.insertMany(SEED_STORIES);
    }

    const resourcesCount = await Resource.countDocuments();
    if (resourcesCount === 0) {
      console.log('🌱 Seeding Document Resource Library...');
      await Resource.insertMany(SEED_RESOURCES);
    }

    const feedbackCount = await Feedback.countDocuments();
    if (feedbackCount === 0) {
      console.log('🌱 Seeding Initial Feedback...');
      await Feedback.insertMany(SEED_FEEDBACK);
    }

    const notificationsCount = await Notification.countDocuments();
    if (notificationsCount === 0) {
      console.log('🌱 Seeding Welcome Notifications...');
      await Notification.create({
        userId: null,
        title: 'Welcome to PathSeeker!',
        message: 'Your Career Passport platform is fully active. Complete the AI interest quiz and explore trending careers in the Career Bank.',
        type: 'system',
      });
    }

    console.log('✅ PathSeeker database verified / seeded with comprehensive datasets.');
  } catch (err) {
    console.error('Error during database seed:', err.message);
  }
};
