import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import { 
  Github, 
  Linkedin, 
  Globe, 
  MapPin, 
  Mail, 
  Phone,
  Briefcase, 
  ArrowLeft,
  Terminal,
  Cpu,
  Layers,
  GraduationCap,
  Sparkles,
  Compass,
  MessageSquare,
  Sun,
  Moon,
  ExternalLink,
  ChevronUp,
  UserCheck,
  Search,
  X
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { API_URL } from '../config';

// Custom Animated Progress Bar Component
function AnimatedSkillBar({ name, proficiency, level, onClick, isSelected }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div 
      ref={ref} 
      onClick={onClick}
      className={`space-y-1.5 p-4 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
        isSelected 
          ? 'bg-primary/10 border-2 border-primary/50 shadow-md scale-[1.02]' 
          : 'clay-badge border border-transparent hover:border-border hover:bg-surface/40'
      }`}
    >
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-text">{name}</span>
        <span className="text-text-muted">{proficiency}% ({level})</span>
      </div>
      <div className="w-full bg-border/40 rounded-full h-2 overflow-hidden p-[1px]">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: '0%' }}
          animate={isInView ? { width: `${proficiency}%` } : { width: '0%' }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Scroll Reveal Wrapper
function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-primary/10 dark:text-secondary/15"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.06 + path.id * 0.012}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Interactive Developer Terminal Component
function DeveloperTerminal({ user, skills, projects }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'input', text: 'welcome' },
    { type: 'output', text: 'Initializing Khadija OS v4.0.0...\nConnection: SECURE\nType "help" or click badges below to explore my workspace.' }
  ]);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdText) => {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    let reply = '';
    switch (trimmed) {
      case 'help':
        reply = 'Available commands:\n  about    - Show professional bio, location & website\n  skills   - List technical competencies by category\n  projects - Show published software products\n  contact  - Show social channels & email credentials\n  clear    - Clear terminal shell';
        break;
      case 'about':
        reply = `Biography:\n${user.about || 'Senior AI & Full-Stack Developer'}\n\nLocation: ${user.location || 'N/A'}\nEducation: ${user.education || 'N/A'}\nGoals: ${user.careerGoals || 'N/A'}`;
        break;
      case 'skills':
        const names = skills && skills.length > 0
          ? skills.map(s => `• ${s.name} (${s.level || 'Intermediate'} - ${s.proficiency}%)`).join('\n')
          : 'No technical skills registered.';
        reply = `Technical Stack:\n${names}`;
        break;
      case 'projects':
        const titles = projects && projects.length > 0
          ? projects.map(p => `• [${p.status || 'Completed'}] ${p.title} - ${p.description.slice(0, 70)}...`).join('\n')
          : 'No projects registered.';
        reply = `Featured Work:\n${titles}`;
        break;
      case 'contact':
        reply = `Get In Touch:\n  Email: ${user.email}\n  GitHub: ${user.github || 'N/A'}\n  LinkedIn: ${user.linkedin || 'N/A'}\n  Website: ${user.website || 'N/A'}`;
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        reply = `Command "${trimmed}" not recognized. Type "help" for a list of valid commands.`;
    }

    setHistory(prev => [...prev, { type: 'input', text: cmdText }, { type: 'output', text: reply }]);
    setInput('');
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-green-400 text-xs font-mono shadow-2xl flex flex-col h-72 terminal-window">
      {/* Top Header Bar */}
      <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-900 select-none shrink-0">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-danger/80"></span>
          <span className="h-3 w-3 rounded-full bg-warning/80"></span>
          <span className="h-3 w-3 rounded-full bg-success/80"></span>
        </div>
        <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">khadija@developer-os:~</span>
        <div className="w-8"></div>
      </div>

      {/* Terminal Display Logs */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2.5 scrollbar-thin select-text">
        {history.map((h, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {h.type === 'input' ? (
              <div className="flex items-center gap-1.5">
                <span className="text-primary font-bold">khadija$</span>
                <span className="text-white">{h.text}</span>
              </div>
            ) : (
              <div className="text-slate-300 pl-4">{h.text}</div>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Inputs Bar */}
      <div className="bg-slate-950/50 p-2.5 border-t border-slate-900/60 flex flex-col sm:flex-row items-center gap-2.5 select-none shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleCommand(input); }} 
          className="flex items-center gap-1.5 w-full bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-850 focus-within:border-primary/50"
        >
          <span className="text-primary font-bold">khadija$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command (e.g. help, skills)..."
            className="bg-transparent border-none outline-none text-white w-full text-xs font-mono"
          />
          <button type="submit" className="hidden" />
        </form>
        {/* Quick Click badging */}
        <div className="flex gap-1.5 flex-wrap">
          {['about', 'skills', 'projects', 'contact', 'clear'].map(c => (
            <button
              key={c}
              type="button"
              onClick={() => handleCommand(c)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] transition-colors cursor-pointer border border-slate-700"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Testimonial Carousel Component
function TestimonialCarousel({ testimonials }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials]);

  const current = testimonials[index];

  return (
    <div className="relative overflow-hidden w-full py-2">
      <div className="clay-card p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 justify-between relative min-h-[220px]">
        {/* Left quote decoration */}
        <div className="absolute top-4 left-6 text-7xl font-serif text-primary/10 select-none pointer-events-none">“</div>
        <div className="absolute bottom-4 right-8 text-7xl font-serif text-secondary/10 select-none pointer-events-none">”</div>

        <motion.div 
          key={index}
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -25 }}
          transition={{ duration: 0.45 }}
          className="space-y-4 md:col-span-2 relative z-10 flex-1"
        >
          <p className="text-text-muted text-sm md:text-base leading-relaxed italic font-medium">
            "{current.quote}"
          </p>
          <div className="flex items-center gap-3 pt-4 border-t border-border/40">
            <img 
              src={current.avatar} 
              alt={current.name} 
              className="h-11 w-11 rounded-full object-cover border-2 border-primary/20 shadow-md"
            />
            <div>
              <h4 className="text-xs md:text-sm font-extrabold text-text leading-none">{current.name}</h4>
              <span className="text-[10px] md:text-xs text-text-muted font-semibold block mt-1">{current.role}</span>
            </div>
          </div>
        </motion.div>

        {/* Carousel indicators/nav */}
        <div className="flex md:flex-col gap-2 justify-center shrink-0 z-10">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`h-2.5 w-2.5 rounded-full transition-all cursor-pointer ${
                index === idx ? 'bg-primary scale-125' : 'bg-border/60 hover:bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PublicPortfolio() {
  const { userId } = useParams();
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active section state for navbar
  const [activeSection, setActiveSection] = useState('home');
  const [projectFilter, setProjectFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch Public Portfolio Data
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        // If userId exists in route, use target endpoint, otherwise fallback to root profile
        const endpoint = userId 
          ? `${API_URL}/api/portfolio/public/${userId}`
          : `${API_URL}/api/profile`;
        
        const res = await axios.get(endpoint);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load portfolio. Please check database connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [userId]);

  // Real-time Editor Preview Listener
  useEffect(() => {
    const handlePreviewMessage = (event) => {
      if (event.data && event.data.type === 'PREVIEW_PROFILE_UPDATE') {
        setData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            user: {
              ...prev.user,
              ...event.data.data
            }
          };
        });
      }
    };

    window.addEventListener('message', handlePreviewMessage);
    return () => window.removeEventListener('message', handlePreviewMessage);
  }, []);

  // Set up Section Observer for Nav Highlight
  useEffect(() => {
    if (!data) return;

    const sections = ['home', 'about', 'skills', 'projects', 'testimonials', 'contact'];
    const observers = [];

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px', // trigger when section dominates viewport
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [data]);

  // Group skills by category
  const getGroupedSkills = () => {
    if (!data?.skills) return {};
    const groups = {};
    data.skills.forEach(skill => {
      const cat = skill.category || 'Other';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(skill);
    });
    return groups;
  };

  // Static Testimonials (Realistic and Professional)
  const testimonials = [
    {
      quote: "Khadija is an exceptionally motivated developer. During her front-end internship, her attention to clean architecture and UI polish exceeded expectations. She picks up new technologies at lightning speed.",
      name: "Elena Rostova",
      role: "Tech Lead at Codiora Software",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
    },
    {
      quote: "Working with Khadija on open-source projects was a pleasure. Her code is extremely structured, and she is always willing to document logic properly. She has a bright career ahead as a full stack engineer.",
      name: "Marcus Aurelius",
      role: "Senior Solutions Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
    },
    {
      quote: "Khadija demonstrates absolute professionalism. She understands the alignment between user experience and visual aesthetics, translating backend APIs into seamless, high-performance UI states.",
      name: "Amina Begum",
      role: "Product Manager",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
    }
  ];

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-text-muted text-xs font-bold tracking-widest uppercase">Loading Showcase...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-border text-center">
          <Layers className="h-12 w-12 text-text-muted/60 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-text mb-2">Showcase Currently Offline</h2>
          <p className="text-text-muted text-xs mb-6">{error || 'Unable to retrieve user portfolio data.'}</p>
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark">
            <ArrowLeft className="h-3.5 w-3.5" /> Portal Administration
          </Link>
        </div>
      </div>
    );
  }

  const { user, projects } = data;
  const groupedSkills = getGroupedSkills();

  // Get project categories list for filter tabs
  const getProjectCategories = () => {
    const list = new Set(['All']);
    projects.forEach(p => {
      if (p.category) list.add(p.category);
    });
    return Array.from(list);
  };

  const filteredProjects = projects.filter(p => {
    if (projectFilter !== 'All' && p.category !== projectFilter) {
      return false;
    }
    if (selectedSkill && (!p.technologies || !p.technologies.some(t => t.toLowerCase() === selectedSkill.toLowerCase()))) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = p.title?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const techMatch = p.technologies?.some(t => t.toLowerCase().includes(q));
      if (!titleMatch && !descMatch && !techMatch) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-bg text-text relative pb-20 selection:bg-primary/30">
      
      {/* Background Animated Paths */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      
      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo / Initials */}
          <button onClick={() => handleScrollTo('home')} className="flex items-center gap-2 font-extrabold text-base tracking-tight cursor-pointer">
            <div className="bg-gradient-to-tr from-primary to-secondary p-1.5 rounded-lg">
              <Briefcase className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {user.name}
            </span>
          </button>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {['home', 'about', 'skills', 'projects', 'testimonials', 'contact'].map((sect) => (
              <button
                key={sect}
                onClick={() => handleScrollTo(sect)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer uppercase tracking-wider ${
                  activeSection === sect 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-muted hover:text-text hover:bg-surface'
                }`}
              >
                {sect}
              </button>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Switch */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-border hover:bg-surface text-text-muted hover:text-text transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-warning" /> : <Moon className="h-4.5 w-4.5 text-secondary" />}
            </button>

            {/* Portal Dashboard Link */}
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-text hover:text-primary transition-colors bg-surface border border-border px-3.5 py-2 rounded-xl shadow-sm"
            >
              Dashboard
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-20 relative z-10">
        
        {/* 1. HERO / WELCOME SECTION */}
        <section id="home" className="pt-8">
          <div 
            onMouseMove={handleMouseMove}
            className="clay-card spotlight-card p-8 md:p-12 flex flex-col gap-8 relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

            {/* Profile Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full z-10">
              <div className="space-y-6 max-w-2xl text-center md:text-left">
                {/* Header role */}
                {user.role && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    {user.role}
                  </span>
                )}
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-text tracking-tight leading-tight">
                  {user.name}
                </h1>

                {user.tagline && (
                  <p className="text-lg font-medium text-text-muted/95 leading-relaxed">
                    {user.tagline}
                  </p>
                )}

                {/* Quick links */}
                <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
                  {user.github && (
                    <a 
                      href={user.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-900 dark:bg-slate-950 hover:bg-slate-800 dark:hover:bg-slate-800 text-white border border-slate-800 dark:border-slate-900 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Github className="h-4 w-4 text-white" />
                      GitHub
                    </a>
                  )}
                  {user.linkedin && (
                    <a 
                      href={user.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white border border-[#0A66C2] shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Linkedin className="h-4 w-4 text-white" />
                      LinkedIn
                    </a>
                  )}
                  {user.website && (
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-primary hover:bg-primary-dark text-white border border-primary shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Globe className="h-4 w-4 text-white" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              {/* Profile Image card */}
              <div className="relative shrink-0 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-md opacity-35 group-hover:scale-105 transition-all duration-300"></div>
                <div className="h-48 w-48 rounded-full border-4 border-surface overflow-hidden shadow-2xl relative bg-surface">
                  <img 
                    src={user.profileImage 
                      ? (user.profileImage.startsWith('/uploads/') ? `${API_URL}${user.profileImage}` : user.profileImage)
                      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'} 
                    alt={user.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87534a5a2?auto=format&fit=crop&q=80&w=250'; }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Stats Grid */}
            <div className="w-full border-t border-border/40 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 z-10">
              {[
                { value: '3+', label: 'Years of Dev Active' },
                { value: '4+', label: 'Specialties Built' },
                { value: '90%+', label: 'Average Proficiency' },
                { value: '100%', label: 'Clean Code Polish' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-4 rounded-2xl bg-surface/30 hover:bg-surface/50 border border-border/20 transition-all select-none hover:scale-[1.02] shadow-sm">
                  <div className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. ABOUT ME SECTION */}
        <section id="about" className="space-y-8 scroll-mt-20">
          
            <div className="border-l-4 border-primary pl-4">
              <h2 className="text-2xl font-extrabold text-text flex items-center gap-2 tracking-tight">
                <UserCheck className="h-6 w-6 text-primary" />
                About Me
              </h2>
              <p className="text-text-muted text-xs mt-0.5">Academic details and career aspirations</p>
            </div>
          

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bio Card */}
            <div 
              onMouseMove={handleMouseMove}
              className="md:col-span-2 clay-card spotlight-card p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-3">Biography</h3>
                <p className="text-text-muted text-sm leading-relaxed font-normal">
                  {user.about || 'Motivated student focused on building modern web applications.'}
                </p>
              </div>

              {/* Meta details list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-muted border-t border-border/60 pt-4 mt-6">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${user.email}`} className="hover:underline hover:text-primary truncate">
                    {user.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Career/Edu Highlights */}
            <div className="space-y-6">
              {/* Education */}
              {user.education && (
                <div 
                  onMouseMove={handleMouseMove}
                  className="clay-card spotlight-card p-5"
                >
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                    <GraduationCap className="h-4.5 w-4.5" />
                    Education
                  </div>
                  <p className="text-text font-semibold text-xs leading-relaxed">
                    {user.education}
                  </p>
                </div>
              )}

              {/* Career Goals */}
              {user.careerGoals && (
                <div 
                  onMouseMove={handleMouseMove}
                  className="clay-card spotlight-card p-5"
                >
                  <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider mb-2">
                    <Compass className="h-4.5 w-4.5" />
                    Focus & Aspirations
                  </div>
                  <p className="text-text-muted text-xs leading-relaxed">
                    {user.careerGoals}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Developer Terminal */}
          <div className="w-full pt-4">
            <div className="border-l-4 border-primary pl-4 mb-4">
              <h3 className="text-sm font-bold text-text uppercase tracking-wider">Interactive Developer Console</h3>
              <p className="text-text-muted text-[10px] mt-0.5">Direct sandbox to query stack registry, biography & project catalogs</p>
            </div>
            <DeveloperTerminal user={user} skills={data.skills} projects={projects} />
          </div>
        </section>

        {/* 3. SKILLS SECTION */}
        <section id="skills" className="space-y-8 scroll-mt-20">
          
            <div className="border-l-4 border-secondary pl-4">
              <h2 className="text-2xl font-extrabold text-text flex items-center gap-2 tracking-tight">
                <Cpu className="h-6 w-6 text-secondary" />
                Technical Competencies
              </h2>
              <p className="text-text-muted text-xs mt-0.5">My engineering stack organized by category</p>
            </div>
          

          {Object.keys(groupedSkills).length > 0 ? (
            <div className="space-y-8">
              {Object.keys(groupedSkills).map((category) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted border-b border-border pb-1.5 flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-secondary" />
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedSkills[category].map((skill) => (
                      <AnimatedSkillBar
                        key={skill._id}
                        name={skill.name}
                        proficiency={skill.proficiency !== undefined ? skill.proficiency : (skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 65 : 30)}
                        level={skill.level || 'Intermediate'}
                        onClick={() => setSelectedSkill(prev => prev === skill.name ? null : skill.name)}
                        isSelected={selectedSkill === skill.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-surface/20 border border-dashed border-border text-center">
              <p className="text-text-muted italic text-xs">No technical skills published yet.</p>
            </div>
          )}
        </section>

        {/* 4. PROJECTS SECTION */}
        <section id="projects" className="space-y-8 scroll-mt-20">
          
            <div className="border-l-4 border-primary pl-4">
              <h2 className="text-2xl font-extrabold text-text flex items-center gap-2 tracking-tight">
                <Layers className="h-6 w-6 text-primary" />
                Featured Engineering Work
              </h2>
              <p className="text-text-muted text-xs mt-0.5">Browse my projects and live applications</p>
            </div>
          

          {projects.length > 0 ? (
            <div className="space-y-6">
              {/* Search & Active Filters Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects by title, stack..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-xs text-text transition-all"
                  />
                </div>

                {/* Active Skill Filter Badge */}
                {selectedSkill && (
                  <div className="flex items-center gap-2 self-stretch sm:justify-end">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Active Competency:</span>
                    <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-xl">
                      {selectedSkill}
                      <button 
                        onClick={() => setSelectedSkill(null)}
                        className="hover:text-danger cursor-pointer font-bold shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </div>
                )}
              </div>

              {/* Project Category Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border">
                {getProjectCategories().map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProjectFilter(cat)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all border cursor-pointer ${
                      projectFilter === cat 
                        ? 'bg-primary text-white border-primary shadow-sm' 
                        : 'bg-surface text-text-muted border-border hover:bg-border/30 hover:text-text'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Projects Cards Grid */}
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      isReadOnly={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-surface/20 border border-dashed border-border text-center">
                  <p className="text-text-muted italic text-sm">No projects match the selected filters or search query.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSkill(null);
                      setProjectFilter('All');
                    }}
                    className="mt-3 text-xs text-primary font-bold hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-surface/20 border border-dashed border-border text-center">
              <p className="text-text-muted italic text-xs">No project showcase published yet.</p>
            </div>
          )}
        </section>

        {/* 5. TESTIMONIALS SECTION */}
        <section id="testimonials" className="space-y-8 scroll-mt-20">
          
            <div className="border-l-4 border-secondary pl-4">
              <h2 className="text-2xl font-extrabold text-text flex items-center gap-2 tracking-tight">
                <MessageSquare className="h-6 w-6 text-secondary" />
                Recommendations
              </h2>
              <p className="text-text-muted text-xs mt-0.5">What mentors and peers say about my work</p>
            </div>
          

          <TestimonialCarousel testimonials={testimonials} />
        </section>

        {/* 6. CONTACT SECTION */}
        <section id="contact" className="space-y-8 scroll-mt-20 pb-8">
          
            <div className="border-l-4 border-primary pl-4">
              <h2 className="text-2xl font-extrabold text-text flex items-center gap-2 tracking-tight">
                <Mail className="h-6 w-6 text-primary" />
                Get In Touch
              </h2>
              <p className="text-text-muted text-xs mt-0.5">Let's discuss opportunities and collaborations</p>
            </div>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact details */}
            <div className="clay-card p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-text">Contact Information</h3>
              <p className="text-text-muted text-xs leading-relaxed">
                I am actively seeking software development internships, full-stack learning opportunities, and collaborations. Drop me an email or call!
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-surface flex items-center justify-center text-primary border border-border shadow-sm">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-text-muted uppercase font-bold block">Email Address</span>
                    <a href={`mailto:${user.email}`} className="text-xs font-bold text-text hover:text-primary hover:underline">
                      {user.email}
                    </a>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-surface flex items-center justify-center text-primary border border-border shadow-sm">
                      <Phone className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-text-muted uppercase font-bold block">Phone Number</span>
                      <span className="text-xs font-bold text-text">
                        {user.phone}
                      </span>
                    </div>
                  </div>
                )}

                {user.location && (
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-surface flex items-center justify-center text-primary border border-border shadow-sm">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-text-muted uppercase font-bold block">Physical Address</span>
                      <span className="text-xs font-bold text-text">
                        {user.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Static Message Form */}
            <div className="clay-card p-6 sm:p-8">
              <h3 className="text-base font-bold text-text mb-4">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent (demonstration)!'); }}>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full p-4 rounded-xl glass-input text-xs leading-relaxed"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary hover:to-primary-dark text-white font-semibold text-xs shadow-md transition-all cursor-pointer text-center"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Back to top button */}
        <div className="flex justify-center pt-8">
          <button 
            onClick={() => handleScrollTo('home')}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text px-4 py-2 rounded-xl bg-surface border border-border cursor-pointer shadow-sm"
          >
            <ChevronUp className="h-4 w-4" />
            Back to Top
          </button>
        </div>

      </div>

    </div>
  );
}
