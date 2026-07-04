import { useState, useEffect } from 'react';
import { 
  BrainCircuit, Zap, 
  Users, CheckCircle2, 
  Play, MessageSquare, 
  ArrowRight, Star, 
  BarChart3, TrendingUp, Wrench, Hammer, HardHat, Activity, Smile, Frown,
  Menu, X, Mail, User, Building, Send, ShieldAlert, Award, Eye, Lock, LogOut, Database
} from 'lucide-react';
import { db, collection, addDoc, getDocs, query, orderBy } from './firebase';

const cx = (...classes) => classes.filter(Boolean).join(' ');

// --- Custom Premium Brand Logo ---
const BrandLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M6 16C6 10.4772 10.4772 6 16 6C21.5228 6 26 10.4772 26 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 6"/>
    <circle cx="16" cy="19" r="3.5" fill="currentColor"/>
  </svg>
);

// --- Announcement Bar Removed ---

// --- Layout & Navigation ---
function NavigationBar({ setView, currentView, toggleMenu }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id) => {
    if (currentView !== 'home') {
      setView('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed w-full top-0 z-[100] px-4 sm:px-6 mt-4 sm:mt-6 transition-all duration-300">
      <nav className={cx(
        "max-w-6xl mx-auto rounded-full transition-all duration-500 flex justify-between items-center px-4 sm:px-6 py-3",
        scrolled ? "pill-nav" : "bg-brand-900/40 backdrop-blur-md border border-brand-800/85"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-800 border border-brand-700 rounded-full flex items-center justify-center shadow-md shrink-0">
            <BrandLogo className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white">EchoLoop 360</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <button onClick={() => handleScrollTo('problem')} className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors">The Problem</button>
          <button onClick={() => handleScrollTo('voice')} className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors">Why Voice</button>
          <button onClick={() => handleScrollTo('workflow')} className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors">How It Works</button>
          <button onClick={() => handleScrollTo('roi')} className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors">Business ROI</button>
          <button onClick={() => handleScrollTo('founder')} className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors">Premium Customer Program</button>
          <button onClick={() => handleScrollTo('pricing')} className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors">Pricing</button>
        </div>
        
        {/* CTAs & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => setView('signup')} 
            className="hidden md:flex bg-brand-400 text-brand-900 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-bold hover:bg-brand-500 transition-all hover:scale-105 active:scale-95 items-center gap-2 shadow-[0_0_15px_rgba(71,241,156,0.3)] whitespace-nowrap"
          >
            Join EchoLoop
          </button>
          
          <button onClick={toggleMenu} className="lg:hidden text-white hover:text-brand-400 transition-colors p-1">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </div>
  );
}

// --- Side Menubar (Drawer) ---
const SideMenu = ({ isOpen, closeMenu, setView, currentView }) => {
  const handleNav = (target) => {
    if (['problem', 'voice', 'workflow', 'roi', 'founder', 'pricing'].includes(target)) {
      if (currentView !== 'home') {
        setView('home');
        setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 150);
      } else {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setView(target);
    }
    closeMenu();
  };

  return (
    <div className={`fixed inset-0 z-[200] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-sm" onClick={closeMenu} />
      
      {/* Drawer */}
      <div className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-brand-800 border-l border-brand-700 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 sm:p-6 flex justify-between items-center border-b border-brand-700">
          <span className="font-bold text-lg text-white">Menu</span>
          <button onClick={closeMenu} className="text-slate-400 hover:text-white transition-colors p-1">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex flex-col p-5 sm:p-6 space-y-5 flex-1 overflow-y-auto">
          <button onClick={() => handleNav('home')} className="text-left text-lg font-medium text-slate-300 hover:text-brand-400 transition-colors">Home</button>
          <button onClick={() => handleNav('problem')} className="text-left text-lg font-medium text-slate-300 hover:text-brand-400 transition-colors">The Problem</button>
          <button onClick={() => handleNav('voice')} className="text-left text-lg font-medium text-slate-300 hover:text-brand-400 transition-colors">Why Voice</button>
          <button onClick={() => handleNav('workflow')} className="text-left text-lg font-medium text-slate-300 hover:text-brand-400 transition-colors">How It Works</button>
          <button onClick={() => handleNav('roi')} className="text-left text-lg font-medium text-slate-300 hover:text-brand-400 transition-colors">Business ROI</button>
          <button onClick={() => handleNav('founder')} className="text-left text-lg font-medium text-slate-300 hover:text-brand-400 transition-colors">Premium Customer Program</button>
          <button onClick={() => handleNav('pricing')} className="text-left text-lg font-medium text-slate-300 hover:text-brand-400 transition-colors">Pricing</button>
          <button onClick={() => handleNav('contact')} className="text-left text-lg font-medium text-slate-300 hover:text-brand-400 transition-colors">Watch Demo</button>
        </div>
        
        <div className="p-5 sm:p-6 border-t border-brand-700 shrink-0">
          <button onClick={() => handleNav('signup')} className="w-full bg-brand-400 text-brand-900 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-brand-500 transition-colors flex items-center justify-center gap-2">
            Join EchoLoop <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Rotating Hooks / Alternative Headlines for Hero ---
function RotatingHeadlines() {
  const hooks = [
    "Turn Happy Customers Into 5-Star Reviews Before They Leave.",
    "Know What Every Customer Really Thinks After Every Job.",
    "More Google Reviews. Fewer Complaints. Better Technicians."
  ];
  
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % hooks.length);
        setVisible(true);
      }, 500);
    }, 4500);
    return () => clearInterval(interval);
  }, [hooks.length]);

  return (
    <div className="inline-flex justify-center items-center mb-6 px-4 py-2 rounded-full bg-brand-950/80 border border-brand-700/60 backdrop-blur-md shadow-[0_4px_25px_rgba(71,241,156,0.05)] max-w-full">
      <div className={`transition-all duration-500 ease-in-out text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest text-center ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <span className="relative inline-flex h-2 w-2 mr-2 align-middle -mt-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400"></span>
        </span>
        <span className="leading-relaxed">{hooks[index]}</span>
      </div>
    </div>
  );
}

// --- Hero Section ---
const LandingHero = ({ setView }) => (
  <section className="relative min-h-[90vh] lg:min-h-[calc(100vh-70px)] flex flex-col justify-center pt-28 pb-12 px-4 overflow-hidden border-b border-brand-800">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] sm:w-[800px] sm:h-[500px] opacity-20 pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 sm:w-96 sm:h-96 bg-brand-400 rounded-full mix-blend-screen filter blur-[90px] sm:blur-[128px] animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-64 h-64 sm:w-96 sm:h-96 bg-brand-600 rounded-full mix-blend-screen filter blur-[90px] sm:blur-[128px] animate-blob animation-delay-2000"></div>
    </div>

    <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in-up">
      {/* Rotating Secondary Value Propositions */}
      <RotatingHeadlines />
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold text-white mb-6 sm:mb-8 tracking-tighter leading-[1.15] lg:leading-[1.1] text-balance">
        Never Lose Another Customer to <br className="hidden md:block" /> 
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-500">
          a Bad Google Review.
        </span>
      </h1>
      
      <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed font-medium text-balance px-2 sm:px-0">
        EchoLoop 360 helps local service businesses collect instant voice feedback, identify unhappy customers before they post public reviews, improve technician performance, and automatically grow their online reputation using AI.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4 sm:px-0">
        <button onClick={() => setView('signup')} className="w-full sm:w-auto bg-brand-400 text-brand-900 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-[14px] sm:text-[15px] hover:bg-brand-500 transition-all shadow-[0_8px_20px_rgba(71,241,156,0.2)] flex items-center justify-center gap-2 group">
          Join EchoLoop 360
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <button onClick={() => setView('contact')} className="w-full sm:w-auto flex items-center justify-center bg-brand-800 border border-brand-700 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium text-[14px] sm:text-[15px] hover:bg-brand-700 transition-all shadow-sm gap-2">
          <Play className="w-4 h-4 text-brand-400" fill="currentColor" /> Book a Demo
        </button>
      </div>
    </div>
  </section>
);

// --- The Problem Section ---
const ProblemSection = () => (
  <section id="problem" className="py-16 sm:py-24 bg-brand-900 border-b border-brand-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 sm:mb-20 text-center max-w-3xl mx-auto">
        <h2 className="text-[11px] sm:text-[12px] font-bold text-red-400 uppercase tracking-[0.2em] mb-3 sm:mb-4">The Real Leak</h2>
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 sm:mb-5 tracking-tight text-white text-balance">Your Customers Don’t Tell You What’s Wrong. They Just Leave.</h3>
        <p className="text-slate-400 text-base sm:text-lg">Most customers never complain directly. They silently take their business elsewhere.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
        <div className="bento-card p-6 sm:p-8 flex flex-col justify-between">
          <div className="w-12 h-12 bg-red-950/50 border border-red-900/50 rounded-xl flex items-center justify-center mb-6">
            <Frown className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Unhappy Customers Leave Silently</h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Most customers hate confrontation. If they have an issue, they won't voice it to your technician—they will just leave and post a 1-star review days later.
            </p>
          </div>
        </div>

        <div className="bento-card p-6 sm:p-8 flex flex-col justify-between">
          <div className="w-12 h-12 bg-yellow-955/20 border border-yellow-900/50 rounded-xl flex items-center justify-center mb-6">
            <Smile className="w-6 h-6 text-yellow-450 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Happy Customers Rarely Review</h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Unless prompted at the exact moment of peak satisfaction, even your happiest clients will forget to leave a review, leaving you with an imbalanced public score.
            </p>
          </div>
        </div>

        <div className="bento-card p-6 sm:p-8 flex flex-col justify-between">
          <div className="w-12 h-12 bg-brand-950/50 border border-brand-900/50 rounded-xl flex items-center justify-center mb-6">
            <ShieldAlert className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">The Owner Blindspot</h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Without immediate, direct feedback channels, business owners have no idea which technician, service, or process caused the issue until it's too late.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-brand-950 to-brand-900 border border-brand-700/50 rounded-[2rem] p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-md">
        <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">EchoLoop 360 changes that.</h4>
        <p className="text-slate-350 text-xs sm:text-sm max-w-2xl mx-auto">
          We build an instant, frictionless voice feedback bridge that captures honest thoughts before customers leave and helps you intercept issues privately.
        </p>
      </div>
    </div>
  </section>
);

// --- Why Voice Section ---
const WhyVoiceSection = () => (
  <section id="voice" className="py-16 sm:py-24 bg-brand-800/50 border-b border-brand-800 relative overflow-hidden">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 sm:mb-20 text-center max-w-3xl mx-auto">
        <h2 className="text-[11px] sm:text-[12px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">Why Voice?</h2>
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 sm:mb-5 tracking-tight text-white">Why Voice Instead of Surveys?</h3>
        <p className="text-slate-400 text-base sm:text-lg">Traditional text surveys get ignored. Speaking feels natural, personal, and instant.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        <div className="bento-card p-6 sm:p-10 bg-brand-900 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-brand-950 border border-brand-700 flex items-center justify-center shrink-0 mt-1">
                <Smile className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-1">Customers Hate Long Surveys</h4>
                <p className="text-xs sm:text-sm text-slate-400">Nobody wants to fill out 10 multiple-choice questions or type long paragraphs on a mobile screen after a service call.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-brand-950 border border-brand-700 flex items-center justify-center shrink-0 mt-1">
                <Activity className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-1">5-Seconds is Faster Than Typing</h4>
                <p className="text-xs sm:text-sm text-slate-400">A customer can explain exactly what went right or wrong in a simple, one-tap voice note in less time than finding the correct keys.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-brand-950 border border-brand-700 flex items-center justify-center shrink-0 mt-1">
                <MessageSquare className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-1">Voice Captures Emotion</h4>
                <p className="text-xs sm:text-sm text-slate-400">Text reviews lack tone. Voice captures frustration, urgency, relief, or delight—details that allow you to act precisely.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-brand-950 border border-brand-700 flex items-center justify-center shrink-0 mt-1">
                <BrainCircuit className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-1">AI Understands Tone & Context</h4>
                <p className="text-xs sm:text-sm text-slate-400">Our engine doesn't just convert voice to text; it scores customer sentiment, extracts intent, and spots specific mentions automatically.</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-brand-850 pt-6 mt-8">
            <div className="flex items-center gap-3 text-brand-400 font-bold text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 shrink-0" /> Higher response rates and better insights for your business.
            </div>
          </div>
        </div>

        {/* Interactive Visual Element: Tone comparison */}
        <div className="bento-card p-6 sm:p-10 bg-brand-900/50 flex flex-col justify-center border border-brand-800">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-400" /> Compare Customer Responses
          </h4>
          <div className="space-y-4">
            <div className="bg-brand-950 p-4 rounded-xl border border-brand-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Standard Text Feedback</span>
              <p className="text-sm font-semibold text-slate-450 italic">"The service was fine, but the tech left a bit of a mess."</p>
              <div className="mt-2 text-[10px] text-yellow-500 font-bold">Sentiment: Neutral (Hard to tell intensity)</div>
            </div>
            
            <div className="bg-brand-950 p-4 rounded-xl border border-brand-700/60 shadow-[0_4px_15px_rgba(71,241,156,0.05)]">
              <span className="text-[10px] uppercase font-bold text-brand-400 block mb-1">EchoLoop 360 AI Voice Analysis</span>
              <p className="text-sm font-semibold text-white italic">"The service was fine, but the tech left a bit of a mess... there's oil all over the clean carpets..."</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-brand-900 px-2 py-1 rounded text-red-400 font-bold">Tone: Highly Frustrated</div>
                <div className="bg-brand-900 px-2 py-1 rounded text-red-400 font-bold">Severity: Critical Alert</div>
                <div className="bg-brand-900 px-2 py-1 rounded text-brand-400 font-bold" colSpan="2">Auto-routed: Instant Alert to Manager Dashboard</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- Built For Local Trades Section ---
const BuiltForSection = () => (
  <section className="py-8 sm:py-10 bg-brand-900 z-20 relative border-b border-brand-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bento-card p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
        <div className="lg:w-1/3">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 sm:mb-3">Built for Local Trades</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            We skipped the enterprise bloat. EchoLoop 360 is a surgical intelligence tool built exclusively for the realities of local home services.
          </p>
        </div>
        <div className="lg:w-2/3 flex flex-wrap gap-2 sm:gap-3">
          {[
            { name: 'Plumbing & Heating', icon: <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500" /> },
            { name: 'Electrical Contractors', icon: <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500" /> },
            { name: 'General Builders', icon: <Hammer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500" /> },
            { name: 'Roofing', icon: <HardHat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500" /> },
            { name: 'HVAC Specialists', icon: <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500" /> }
          ].map((trade) => (
            <div key={trade.name} className="px-3 sm:px-5 py-2 sm:py-2.5 bg-brand-900 text-slate-300 rounded-full font-medium text-[12px] sm:text-[14px] border border-brand-700 flex items-center gap-1.5 sm:gap-2 shadow-sm hover:border-brand-500 transition-colors cursor-default">
              {trade.icon} {trade.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// --- Improved How It Works Section ---
const WorkflowSection = () => (
  <section id="workflow" className="py-16 sm:py-24 bg-brand-900 relative border-b border-brand-850">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 sm:mb-20 text-center max-w-3xl mx-auto">
        <h2 className="text-[11px] sm:text-[12px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">How it works</h2>
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 sm:mb-5 tracking-tight text-white">From Job Completion to Reputation Shield</h3>
        <p className="text-slate-400 text-base sm:text-lg">Every step of our process is designed to protect your brand and generate growth automatically.</p>
      </div>
      
      <div className="relative border-l border-brand-700/60 ml-4 md:ml-32 space-y-12">
        {/* Step 1 */}
        <div className="relative pl-8 md:pl-12 group">
          <div className="absolute -left-[17px] top-1.5 bg-brand-900 border-2 border-brand-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs group-hover:bg-brand-400 group-hover:text-brand-900 transition-all shadow-[0_0_10px_rgba(71,241,156,0.3)]">1</div>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <h4 className="text-lg font-bold text-white">Job Completed</h4>
              <p className="text-xs text-brand-400 font-semibold mt-1">SMS or QR Code Sent</p>
            </div>
            <div className="md:col-span-8">
              <p className="text-slate-300 text-sm leading-relaxed">
                As soon as a technician completes a service, the customer automatically receives an SMS request or scans a physical QR card. 
                <strong className="block mt-1.5 text-white">Business Outcome: Captures the customer feedback instantly while the service details are top of mind.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative pl-8 md:pl-12 group">
          <div className="absolute -left-[17px] top-1.5 bg-brand-900 border-2 border-brand-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs group-hover:bg-brand-400 group-hover:text-brand-900 transition-all shadow-[0_0_10px_rgba(71,241,156,0.3)]">2</div>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <h4 className="text-lg font-bold text-white">Frictionless Recording</h4>
              <p className="text-xs text-brand-400 font-semibold mt-1">5-Second Voice Note</p>
            </div>
            <div className="md:col-span-8">
              <p className="text-slate-300 text-sm leading-relaxed">
                Customers tap a single link and speak for five seconds about their experience. Zero forms, zero typing.
                <strong className="block mt-1.5 text-white">Business Outcome: Eliminates completion drop-off, yielding up to 4x higher response rates than text forms.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative pl-8 md:pl-12 group">
          <div className="absolute -left-[17px] top-1.5 bg-brand-900 border-2 border-brand-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs group-hover:bg-brand-400 group-hover:text-brand-900 transition-all shadow-[0_0_10px_rgba(71,241,156,0.3)]">3</div>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <h4 className="text-lg font-bold text-white">AI Analysis</h4>
              <p className="text-xs text-brand-400 font-semibold mt-1">Problems & Praise Detected</p>
            </div>
            <div className="md:col-span-8">
              <p className="text-slate-300 text-sm leading-relaxed">
                EchoLoop 360’s AI transcript engine parses the voice note, evaluates sentiment, and automatically tags technician names and key topics.
                <strong className="block mt-1.5 text-white">Business Outcome: Spots exact bottlenecks, tracks technician performance leaderboards, and discovers training needs.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="relative pl-8 md:pl-12 group">
          <div className="absolute -left-[17px] top-1.5 bg-brand-900 border-2 border-brand-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs group-hover:bg-brand-400 group-hover:text-brand-900 transition-all shadow-[0_0_10px_rgba(71,241,156,0.3)]">4</div>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <h4 className="text-lg font-bold text-white">Auto-Routing</h4>
              <p className="text-xs text-brand-400 font-semibold mt-1">Happy vs. Unhappy paths</p>
            </div>
            <div className="md:col-span-8">
              <p className="text-slate-300 text-sm leading-relaxed">
                Happy customers are instantly invited to post on Google. Unhappy feedback routes directly to the owner/manager dashboard.
                <strong className="block mt-1.5 text-white">Business Outcome: Unhappy customers are heard privately before public review. Happy customers automatically generate Google Reviews.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="relative pl-8 md:pl-12 group">
          <div className="absolute -left-[17px] top-1.5 bg-brand-900 border-2 border-brand-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs group-hover:bg-brand-400 group-hover:text-brand-900 transition-all shadow-[0_0_10px_rgba(71,241,156,0.3)]">5</div>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <h4 className="text-lg font-bold text-white">Private Intervention</h4>
              <p className="text-xs text-brand-400 font-semibold mt-1">Managers Alerted Privately</p>
            </div>
            <div className="md:col-span-8">
              <p className="text-slate-300 text-sm leading-relaxed">
                If the AI detects negative sentiment or complaints, the manager receives an alert.
                <strong className="block mt-1.5 text-white">Business Outcome: Resolves issues, corrects mistakes, and changes customer outcomes before they post negative reviews online.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Step 6 */}
        <div className="relative pl-8 md:pl-12 group">
          <div className="absolute -left-[17px] top-1.5 bg-brand-900 border-2 border-brand-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs group-hover:bg-brand-400 group-hover:text-brand-900 transition-all shadow-[0_0_10px_rgba(71,241,156,0.3)]">6</div>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <h4 className="text-lg font-bold text-white">Improved Operations</h4>
              <p className="text-xs text-brand-400 font-semibold mt-1">Service & Reputation Protected</p>
            </div>
            <div className="md:col-span-8">
              <p className="text-slate-300 text-sm leading-relaxed">
                Owner uses dashboards to optimize hiring, track operational performance, and build consistent brand value.
                <strong className="block mt-1.5 text-white">Business Outcome: Drives long-term organic growth, higher technician accountability, and a pristine 5-star reputation.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- ROI / Business Results Section ---
const RoiSection = () => (
  <section id="roi" className="py-16 sm:py-24 bg-brand-800/40 border-b border-brand-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 sm:mb-20 text-center max-w-3xl mx-auto">
        <h2 className="text-[11px] sm:text-[12px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">Operational Value</h2>
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 sm:mb-5 tracking-tight text-white">Built to Deliver Measurable Business Results</h3>
        <p className="text-slate-400 text-base sm:text-lg">We don't focus on AI buzzwords. We focus on outcome metrics that drive profitability.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="bento-card p-6 sm:p-8 bg-brand-900 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-brand-950 border border-brand-700/50 flex items-center justify-center mb-6 shrink-0">
            <Star className="w-5 h-5 text-brand-400" fill="currentColor" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">More Google Reviews</h4>
            <p className="text-xs sm:text-sm text-slate-450 leading-relaxed">
              Frictionless voice feedback routes delighted customers straight to Google. Elevate local SEO, outperform local competitors, and drive more incoming customer phone calls automatically.
            </p>
          </div>
        </div>

        <div className="bento-card p-6 sm:p-8 bg-brand-900 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-brand-950 border border-brand-700/50 flex items-center justify-center mb-6 shrink-0">
            <ShieldAlert className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Faster Complaint Resolution</h4>
            <p className="text-xs sm:text-sm text-slate-455 leading-relaxed">
              AI flags friction, allowing managers to call back within 15 minutes of job completion. Turn potential customer disasters into 5-star brand loyalty.
            </p>
          </div>
        </div>

        <div className="bento-card p-6 sm:p-8 bg-brand-900 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-brand-950 border border-brand-700/50 flex items-center justify-center mb-6 shrink-0">
            <Smile className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Higher Customer Satisfaction</h4>
            <p className="text-xs sm:text-sm text-slate-455 leading-relaxed">
              Listen to the pulse of your clients after every task. Ensure quality standards are consistently maintained, keeping service delivery premium.
            </p>
          </div>
        </div>

        <div className="bento-card p-6 sm:p-8 bg-brand-900 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-brand-950 border border-brand-700/50 flex items-center justify-center mb-6 shrink-0">
            <Users className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Better Technician Accountability</h4>
            <p className="text-xs sm:text-sm text-slate-455 leading-relaxed">
              Link customer sentiment scores to specific staff. Track leaderboards, award top performers, and quickly address technicians who generate complaints.
            </p>
          </div>
        </div>

        <div className="bento-card p-6 sm:p-8 bg-brand-900 flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-full bg-brand-950 border border-brand-700/50 flex items-center justify-center mb-6 shrink-0">
            <TrendingUp className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Increased Customer Retention</h4>
            <p className="text-xs sm:text-sm text-slate-455 leading-relaxed">
              Retaining clients is cheaper than finding new ones. Identify drifting customers, address unresolved jobs, and secure your recurring commercial service revenue.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- AI Insights Showcase Block ---
const InsightsDemo = () => (
  <section id="insights" className="py-16 sm:py-24 bg-brand-800 relative overflow-hidden border-y border-brand-700">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <h2 className="text-[11px] sm:text-[12px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">The Platform</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight text-white leading-tight">
            Voice recording is just feedback. <br className="hidden lg:block"/><span className="text-brand-400">AI Intelligence is the result.</span>
          </h3>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
            You don't have to listen to hundreds of voice memos. Our dashboard automatically extracts facts, sentiment, and technician names, giving you actionable operational control in seconds.
          </p>
          
          <div className="space-y-5 sm:space-y-6">
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-900 border border-brand-700 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-0.5 sm:mb-1">Customer Satisfaction Score</h4>
                <p className="text-xs sm:text-sm text-slate-400">Track your daily CSAT out of 100.</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-900 border border-brand-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-0.5 sm:mb-1">Top Praised Staff</h4>
                <p className="text-xs sm:text-sm text-slate-400">"James did a great job" automatically credits James on your team leaderboard.</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-900 border border-brand-700 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-0.5 sm:mb-1">Common Complaints Tracker</h4>
                <p className="text-xs sm:text-sm text-slate-400">Instantly see if "Mess left behind" or "Pricing" is trending negatively.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bento-card p-3 sm:p-4 bg-brand-900/80 backdrop-blur-xl relative">
          <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 bg-brand-400 text-brand-900 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg">
            Live AI Output
          </div>
          <div className="bg-brand-800 rounded-xl border border-brand-700 overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-brand-700 bg-brand-900 flex items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" />
              </div>
              <div className="flex-1">
                <div className="h-1.5 sm:h-2 w-3/4 bg-brand-700 rounded-full mb-1.5 sm:mb-2"></div>
                <div className="h-1.5 sm:h-2 w-1/2 bg-brand-700 rounded-full"></div>
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-slate-400">0:06s</span>
            </div>
            
            <div className="p-4 sm:p-6">
              <p className="text-base sm:text-lg text-white font-medium italic mb-5 sm:mb-6">
                "The boiler fix by James was great, but the callout time was way too long today."
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-brand-900 p-3 sm:p-4 rounded-lg border border-brand-700">
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1">Sentiment</p>
                  <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm sm:text-base">
                    <Frown className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Mixed / Negative
                  </div>
                </div>
                <div className="bg-brand-900 p-3 sm:p-4 rounded-lg border border-brand-700">
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1">Category</p>
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm sm:text-base">
                     Callout Time
                  </div>
                </div>
                <div className="bg-brand-900 p-3 sm:p-4 rounded-lg border border-brand-700">
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1">Severity</p>
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-sm sm:text-base">
                     Medium
                  </div>
                </div>
                <div className="bg-brand-900 p-3 sm:p-4 rounded-lg border border-brand-700">
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1">Staff Tagged</p>
                  <div className="flex items-center gap-2 text-brand-400 font-bold text-sm sm:text-base">
                     James (Praise)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- Why EchoLoop Section ---
const WhyEchoLoop = () => (
  <section className="py-16 sm:py-24 bg-brand-900 border-b border-brand-850">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-[11px] sm:text-[12px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">Why EchoLoop 360</h2>
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 sm:mb-5 tracking-tight text-white">Why Businesses Choose EchoLoop 360</h3>
        <p className="text-slate-400 text-base sm:text-lg">Designed for local service operators, not desk-bound corporate teams.</p>
      </div>

      <div className="bento-card p-6 sm:p-12 bg-brand-800/80 grid sm:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8">
        {[
          "AI identifies customer issues automatically",
          "Technician-level performance insights",
          "Instant complaint alerts",
          "More verified Google Reviews",
          "No complicated setup",
          "Built specifically for local service businesses"
        ].map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 sm:gap-4">
            <div className="w-6 h-6 rounded-full bg-brand-900 border border-brand-700/60 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
            </div>
            <span className="text-slate-200 font-medium text-sm sm:text-base">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- Founder Program Section ---
const FounderProgram = ({ setView }) => (
  <section id="founder" className="py-16 sm:py-24 bg-brand-850 border-b border-brand-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bento-card p-8 sm:p-12 bg-gradient-to-br from-brand-900 to-brand-850 border-brand-700/80 relative overflow-hidden">
        {/* Decorative Badge */}
        <div className="absolute top-4 right-4 bg-brand-400 text-brand-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider hidden sm:block">
          Premium Partner
        </div>
        
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <h2 className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-3">Early Access</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Become One of Our Premium Customers</h3>
            <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
              We’re inviting a small number of businesses to join our premium customer program. Work directly with our product team to optimize the tool for your business.
            </p>
            
            <button onClick={() => setView('signup')} className="bg-brand-400 text-brand-900 px-6 sm:px-8 py-3.5 rounded-full font-bold hover:bg-brand-500 transition-all shadow-lg shadow-brand-400/20 text-sm sm:text-base flex items-center justify-center gap-2 group w-full sm:w-auto">
              Become an Early Partner
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-brand-700/60 pt-8 lg:pt-0 lg:pl-10">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">Premium Customer Program Perks:</h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                "Lifetime premium customer pricing",
                "Direct access to the product team",
                "Priority support",
                "Early feature access",
                "Opportunity to influence the roadmap"
              ].map((perk, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-355">
                  <Award className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- Improved Pricing Section ---
const PricingSection = ({ setView }) => (
  <section id="pricing" className="py-16 sm:py-24 bg-brand-900 text-white border-b border-brand-850">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-[11px] sm:text-[12px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">Disruptive Pricing</h2>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-5 tracking-tight text-white text-balance">Choose your growth engine.</h3>
        <p className="text-slate-400 text-base sm:text-lg">Premium customer pricing available for our active partners during the launch phase.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        
        {/* Starter Plan */}
        <div className="bento-card p-6 sm:p-8 bg-brand-900 flex flex-col justify-between border border-brand-800">
          <div>
            <h4 className="text-xl font-bold text-white mb-2">Starter</h4>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              For businesses starting to collect customer feedback.
              <strong className="block mt-1.5 text-slate-350 font-semibold">Outcome: Instantly capture customer sentiment and listen to your front line.</strong>
            </p>
            <div className="mb-5 sm:mb-6 flex items-end">
              <span className="text-4xl font-extrabold text-white">$9</span>
              <span className="text-slate-500 text-sm mb-1 ml-1">/mo</span>
            </div>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-300 border-t border-brand-800/80 pt-6">
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> 100 Voice Feedbacks / mo</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> QR Code Integration</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> Basic AI Analytics</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> Standard Dashboard</li>
            </ul>
          </div>
          <button onClick={() => setView('signup')} className="w-full mt-8 py-3 px-4 bg-brand-800 border border-brand-700 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors text-xs sm:text-sm">
            Join EchoLoop
          </button>
        </div>

        {/* Growth Plan (Highlighted) */}
        <div className="bento-card p-6 sm:p-8 bg-brand-850 border-brand-500 relative transform lg:-translate-y-4 shadow-[0_0_40px_rgba(71,241,156,0.15)] order-first md:order-none md:col-span-2 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-400 text-brand-900 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide whitespace-nowrap">
              Most Popular
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Growth</h4>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Generate more reviews, recover unhappy customers, and improve team performance.
              <strong className="block mt-1.5 text-slate-200 font-semibold">Outcome: Accelerate Google search visibility and shield your reputation.</strong>
            </p>
            <div className="mb-5 sm:mb-6 flex items-end">
              <span className="text-5xl font-extrabold text-brand-400">$19</span>
              <span className="text-slate-400 text-sm mb-2 ml-1">/mo</span>
            </div>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-200 border-t border-brand-800/80 pt-6">
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-450 text-brand-400 shrink-0 mt-0.5" /> <strong>Unlimited</strong> Feedback</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-450 text-brand-400 shrink-0 mt-0.5" /> Advanced AI Insights</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-450 text-brand-400 shrink-0 mt-0.5" /> WhatsApp / SMS Automation</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-450 text-brand-400 shrink-0 mt-0.5" /> Auto Google Review Prompts</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-450 text-brand-400 shrink-0 mt-0.5" /> Direct Manager Intercept Routing</li>
            </ul>
          </div>
          <button onClick={() => setView('signup')} className="w-full mt-8 py-3 px-4 bg-brand-400 text-brand-900 rounded-xl font-bold hover:bg-brand-500 transition-colors shadow-lg shadow-brand-400/20 text-xs sm:text-sm">
            Become an Early Partner
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bento-card p-6 sm:p-8 bg-brand-900 flex flex-col justify-between border border-brand-800">
          <div>
            <h4 className="text-xl font-bold text-white mb-2">Premium</h4>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              For multi-location businesses that need complete reputation intelligence.
              <strong className="block mt-1.5 text-slate-350 font-semibold">Outcome: Enterprise-grade intelligence, team leaderboards, and staff tracking.</strong>
            </p>
            <div className="mb-5 sm:mb-6 flex items-end">
              <span className="text-4xl font-extrabold text-white">$49</span>
              <span className="text-slate-500 text-sm mb-1 ml-1">/mo</span>
            </div>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-300 border-t border-brand-800/80 pt-6">
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> Multi-branch Dashboard</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> Team Leaderboards</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> Custom AI Sentiment Reports</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> Dedicated Account Manager</li>
            </ul>
          </div>
          <button onClick={() => setView('signup')} className="w-full mt-8 py-3 px-4 bg-brand-800 border border-brand-700 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors text-xs sm:text-sm">
            Request Early Access
          </button>
        </div>

      </div>
    </div>
  </section>
);

// --- Final Call to Action Section ---
const FinalCtaSection = ({ setView }) => (
  <section className="py-20 sm:py-28 bg-brand-850 relative overflow-hidden border-b border-brand-800">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] opacity-15 pointer-events-none">
      <div className="absolute w-full h-full bg-brand-400 rounded-full filter blur-[120px] animate-blob"></div>
    </div>
    
    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight text-balance">
        Ready to Protect Your Reputation Before It Becomes Public?
      </h2>
      <p className="text-slate-450 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-medium">
        Join our early partner program and help shape the future of AI-powered reputation management. Lock in lifetime premium pricing.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={() => setView('signup')} className="w-full sm:w-auto bg-brand-400 text-brand-900 px-8 py-4 rounded-full font-bold hover:bg-brand-500 transition-all shadow-xl shadow-brand-400/20 text-sm sm:text-base flex items-center justify-center gap-2">
          Join EchoLoop 360
        </button>
        <button onClick={() => setView('contact')} className="w-full sm:w-auto flex items-center justify-center bg-brand-800 border border-brand-700 text-white px-8 py-4 rounded-full font-medium hover:bg-brand-700 transition-all shadow-sm gap-2 text-sm sm:text-base">
          Book a Demo
        </button>
      </div>
    </div>
  </section>
);


// ==========================================
// NEW PAGE VIEWS (Repurposed Signup, Contact, Demo, Legal)
// ==========================================

const BetaSignupView = ({ setView }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const company = formData.get('company');
    const industry = formData.get('industry');

    try {
      await addDoc(collection(db, "beta_applications"), {
        name,
        email,
        company,
        industry,
        timestamp: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting application: ", err);
      setError('Connection failed. Please check your internet or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-36 sm:pt-44 pb-16 sm:pb-20 px-4 bg-brand-900 flex items-center justify-center animate-fade-in-up">
      <div className="w-full max-w-lg bg-brand-800 rounded-[2rem] border border-brand-700 p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {submitted ? (
          <div className="text-center animate-fade-in-up py-8 sm:py-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-900 text-brand-400 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-brand-700">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Application Submitted!</h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
              Thank you for applying for the EchoLoop 360 Premium Customer Program. Our team will review your details and contact you via email within 24 hours to schedule your onboarding.
            </p>
            <button onClick={() => setView('home')} className="bg-brand-900 border border-brand-700 text-white px-6 py-3 rounded-xl hover:bg-brand-850 transition-all font-bold text-sm sm:text-base">
              Return Home
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6 sm:mb-8">
              <BrandLogo className="w-8 h-8 sm:w-10 sm:h-10 text-brand-400 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">Join the Premium Customer Program</h2>
              <p className="text-slate-455 text-xs sm:text-sm">Only accepting 25 UK & US Home Service Businesses. Apply today.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
                  <input name="name" type="text" required placeholder="John Doe" className="w-full pl-10 sm:pl-12 pr-4 py-3.5 sm:py-4 rounded-xl border border-brand-700 bg-brand-900 text-white placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm sm:text-base" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
                    <input name="email" type="email" required placeholder="john@company.com" className="w-full pl-10 sm:pl-12 pr-4 py-3.5 sm:py-4 rounded-xl border border-brand-700 bg-brand-900 text-white placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm sm:text-base" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">Company Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
                    <input name="company" type="text" required placeholder="Ace Plumbing Inc" className="w-full pl-10 sm:pl-12 pr-4 py-3.5 sm:py-4 rounded-xl border border-brand-700 bg-brand-900 text-white placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm sm:text-base" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">Your Business Industry</label>
                <select name="industry" required className="w-full px-4 py-3.5 sm:py-4 rounded-xl border border-brand-700 bg-brand-900 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm sm:text-base">
                  <option value="" disabled selected>Select industry</option>
                  <option value="plumbing">Plumbing & Heating</option>
                  <option value="hvac">HVAC / Air Conditioning</option>
                  <option value="electrical">Electrical Services</option>
                  <option value="roofing">Roofing & Building</option>
                  <option value="pest-control">Pest Control</option>
                  <option value="restaurant">Restaurants & Hospitality</option>
                  <option value="other">Other Business / Trade</option>
                </select>
              </div>
              
              {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

              <button type="submit" disabled={loading} className="w-full bg-brand-400 text-brand-900 font-extrabold py-3.5 sm:py-4 rounded-xl hover:bg-brand-500 transition-colors mt-4 sm:mt-6 shadow-[0_0_20px_rgba(71,241,156,0.2)] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Submitting Application...' : 'Apply for Premium Customer Spot'}
              </button>
              
              <p className="text-center text-[10px] sm:text-xs text-slate-500 mt-3 sm:mt-4">
                By applying, you agree to receive communications about our early partner program. We never sell your data.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const ContactView = ({ setView }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const technicians = formData.get('technicians');
    const goals = formData.get('goals');

    try {
      await addDoc(collection(db, "demo_requests"), {
        firstName,
        lastName,
        email,
        technicians,
        goals,
        timestamp: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting demo request: ", err);
      setError('Connection failed. Please check your internet or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-36 sm:pt-44 pb-16 sm:pb-20 px-4 bg-brand-900 flex items-center justify-center animate-fade-in-up">
      <div className="w-full max-w-2xl bg-brand-800 rounded-[2rem] border border-brand-700 p-6 sm:p-8 md:p-12 shadow-2xl">
        {submitted ? (
          <div className="text-center animate-fade-in-up py-8 sm:py-10">
            <div className="w-14 h-14 sm:w-16 h-16 bg-brand-900 text-brand-400 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-brand-700">
              <Send className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Message Sent!</h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
              We have received your demo/partnership request and will contact you shortly.
            </p>
            <button onClick={() => setView('home')} className="bg-brand-900 border border-brand-700 text-white px-6 py-3 rounded-xl hover:bg-brand-850 transition-all font-bold text-sm sm:text-base">
              Return Home
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">Request a Demo</h2>
              <p className="text-slate-400 text-base sm:text-lg px-2">Tell us about your home service business, and let's explore how EchoLoop 360 can protect your local reputation.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">First Name</label>
                  <input name="firstName" type="text" required placeholder="John" className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl border border-brand-700 bg-brand-900 text-white placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 outline-none transition-all text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">Last Name</label>
                  <input name="lastName" type="text" required placeholder="Doe" className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl border border-brand-700 bg-brand-900 text-white placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 outline-none transition-all text-sm sm:text-base" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">Work Email</label>
                  <input name="email" type="email" required placeholder="john@company.com" className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl border border-brand-700 bg-brand-900 text-white placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 outline-none transition-all text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">Total Technicians</label>
                  <select name="technicians" required className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl border border-brand-700 bg-brand-900 text-white focus:border-brand-500 focus:ring-1 outline-none transition-all appearance-none text-sm sm:text-base">
                    <option value="" disabled selected>Select size</option>
                    <option value="1-5">1-5 techs</option>
                    <option value="6-20">6-20 techs</option>
                    <option value="21+">21+ techs</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">Briefly describe your goals</label>
                <textarea name="goals" required rows="4" placeholder="Tell us if you want more Google Reviews, better technician tracking, or to reduce complaints..." className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl border border-brand-700 bg-brand-900 text-white placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 outline-none transition-all text-sm sm:text-base"></textarea>
              </div>
              
              {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

              <button type="submit" disabled={loading} className="w-full bg-brand-400 text-brand-900 font-extrabold py-3.5 sm:py-4 rounded-xl hover:bg-brand-500 transition-colors shadow-[0_0_20px_rgba(71,241,156,0.2)] text-sm sm:text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Sending Request...' : 'Book My Demo'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const DemoView = ({ setView }) => {
  return (
    <div className="min-h-screen pt-36 sm:pt-44 pb-16 sm:pb-20 px-4 bg-brand-900 flex flex-col items-center justify-center animate-fade-in-up">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <h2 className="text-[10px] sm:text-[12px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">EchoLoop Demo</h2>
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 sm:mb-5 tracking-tight text-white">Witness AI Reputation Intelligence.</h3>
        <p className="text-slate-400 text-sm sm:text-lg px-2">Watch how a local plumbing contractor intercepts negative feedback in 60 seconds.</p>
      </div>
      
      <div className="w-full max-w-4xl aspect-video bg-brand-800 rounded-2xl sm:rounded-[2rem] border border-brand-700 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-brand-900/40 group-hover:bg-brand-900/20 transition-colors z-10"></div>
        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-brand-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(71,241,156,0.4)] z-20 group-hover:scale-110 transition-transform duration-300">
          <Play className="w-6 h-6 sm:w-8 sm:h-8 text-brand-900 ml-1" fill="currentColor" />
        </div>
        <p className="mt-4 sm:mt-6 text-white font-bold tracking-wide z-20 text-sm sm:text-base">Play 2-Minute Guided Demo</p>
      </div>
      
      <button onClick={() => setView('home')} className="mt-10 sm:mt-12 text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-medium text-sm sm:text-base">
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
      </button>
    </div>
  );
};

const LegalView = ({ title, setView }) => {
  return (
    <div className="min-h-screen pt-36 sm:pt-44 pb-16 sm:pb-20 px-4 bg-brand-900">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <button onClick={() => setView('home')} className="mb-6 sm:mb-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-medium text-sm sm:text-base">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
        </button>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 sm:mb-8">{title}</h1>
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 space-y-4 sm:space-y-6 leading-relaxed text-sm sm:text-base">
          <p>Last updated: June 29, 2026</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">1. Introduction</h2>
          <p>This is a placeholder page for the {title}. EchoLoop 360 takes privacy, data sovereignty, and security seriously for local trade service providers.</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">2. Data Processing & GDPR</h2>
          <p>EchoLoop 360 strictly adheres to the guidelines set by GDPR and local data protection regulations. All voice memos, client logs, and analytics are fully encrypted at rest and in transit.</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">3. Contact Us</h2>
          <p>For legal inquiries, contact our beta team via the <span onClick={() => setView('contact')} className="text-brand-400 cursor-pointer hover:underline">Request a Demo</span> page.</p>
        </div>
      </div>
    </div>
  );
};

// --- Admin Portal View ---
const AdminPortalView = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('beta');
  const [betaData, setBetaData] = useState([]);
  const [demoData, setDemoData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const targetPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
    if (password === targetPassword) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const qBeta = query(collection(db, "beta_applications"), orderBy("timestamp", "desc"));
      const betaSnap = await getDocs(qBeta);
      const betas = betaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBetaData(betas);

      const qDemo = query(collection(db, "demo_requests"), orderBy("timestamp", "desc"));
      const demoSnap = await getDocs(qDemo);
      const demos = demoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDemoData(demos);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-36 sm:pt-44 pb-16 sm:pb-20 px-4 bg-brand-900 flex items-center justify-center animate-fade-in-up">
        <div className="w-full max-w-md bg-brand-800 rounded-[2rem] border border-brand-700 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <Lock className="w-10 h-10 text-brand-400 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Admin Authentication</h2>
            <p className="text-slate-450 text-xs sm:text-sm mt-1">Please enter the portal password to view incoming submissions.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Portal Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password" 
                className="w-full px-4 py-3.5 rounded-xl border border-brand-700 bg-brand-900 text-white placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm" 
              />
            </div>
            {loginError && <p className="text-red-400 text-xs font-semibold">{loginError}</p>}
            <button type="submit" className="w-full bg-brand-400 text-brand-900 font-extrabold py-3.5 rounded-xl hover:bg-brand-500 transition-colors shadow-lg shadow-brand-400/20 text-sm mt-4">
              Enter Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 bg-brand-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
              <Database className="w-7 h-7 text-brand-400" /> Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Securely reviewing beta applications and demo requests from Firestore.</p>
          </div>
          <button 
            onClick={() => { setIsAuthenticated(false); setPassword(''); }} 
            className="flex items-center gap-2 px-4 py-2 border border-brand-700 bg-brand-850 hover:bg-brand-800 rounded-lg text-xs font-semibold text-slate-300 transition-all hover:text-white"
          >
            <LogOut className="w-4 h-4 text-slate-400" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-brand-750 mb-6 gap-2">
          <button 
            onClick={() => setActiveTab('beta')} 
            className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all ${activeTab === 'beta' ? 'border-brand-400 text-brand-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Premium Customer Applicants ({betaData.length})
          </button>
          <button 
            onClick={() => setActiveTab('demo')} 
            className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all ${activeTab === 'demo' ? 'border-brand-400 text-brand-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Demo Requests ({demoData.length})
          </button>
        </div>

        {loadingData ? (
          <div className="py-20 text-center text-slate-450 text-sm">
            <span className="inline-block animate-pulse">Fetching records from Firestore database...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'beta' ? (
              betaData.length === 0 ? (
                <div className="bg-brand-800 border border-brand-700 rounded-2xl p-12 text-center text-slate-450 text-sm">
                  No beta applications found in Firestore yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {betaData.map((item) => (
                    <div key={item.id} className="bento-card p-5 sm:p-6 bg-brand-800 border border-brand-700 flex flex-col justify-between hover:border-brand-500/30 transition-all duration-300">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[9px] uppercase tracking-widest font-mono text-slate-500 bg-brand-950 px-2 py-0.5 rounded">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white mb-1">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-brand-400 font-semibold mb-3">{item.email}</p>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs border-t border-brand-750 pt-3 mt-3">
                          <div>
                            <span className="block text-[9px] uppercase text-slate-500 font-bold mb-0.5">Company</span>
                            <span className="text-slate-200 font-medium">{item.company}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase text-slate-500 font-bold mb-0.5">Trade Industry</span>
                            <span className="text-slate-200 font-medium capitalize">{item.industry}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              demoData.length === 0 ? (
                <div className="bg-brand-800 border border-brand-700 rounded-2xl p-12 text-center text-slate-450 text-sm">
                  No demo requests found in Firestore yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {demoData.map((item) => (
                    <div key={item.id} className="bento-card p-5 sm:p-6 bg-brand-800 border border-brand-700 flex flex-col justify-between hover:border-brand-500/30 transition-all duration-300">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[9px] uppercase tracking-widest font-mono text-slate-500 bg-brand-950 px-2 py-0.5 rounded">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white mb-1">{item.firstName} {item.lastName}</h4>
                        <p className="text-xs sm:text-sm text-brand-400 font-semibold mb-3">{item.email}</p>
                        
                        <div className="text-xs border-t border-brand-750 pt-3 mt-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold uppercase text-[9px]">Technicians:</span>
                            <span className="text-slate-200 font-medium">{item.technicians}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase text-slate-500 font-bold mb-1">Goals Description</span>
                            <p className="text-slate-300 bg-brand-950 p-2.5 rounded border border-brand-700/60 leading-relaxed text-xs italic">
                              "{item.goals}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Footer Component ---
const FooterBlock = ({ setView }) => (
  <footer className="bg-brand-900 py-10 sm:py-12 border-t border-brand-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-5 sm:gap-6">
      
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-brand-800 border border-brand-700 rounded-md flex items-center justify-center">
          <BrandLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
        </div>
        <span className="font-bold text-white text-base sm:text-lg">EchoLoop 360</span>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-[12px] sm:text-[13px] text-slate-500 font-medium">
        <span>© 2026 EchoLoop 360</span>
        <span className="hidden sm:inline">•</span>
        <span>Built for local service businesses in US & UK 🇺🇸 🇬🇧</span>
      </div>
      
      <div className="flex gap-4 sm:gap-5 text-[12px] sm:text-[13px] font-medium text-slate-500">
        <button onClick={() => setView('privacy')} className="hover:text-brand-400 transition-colors">Privacy</button>
        <button onClick={() => setView('terms')} className="hover:text-brand-400 transition-colors">Terms</button>
        <button onClick={() => setView('contact')} className="hover:text-brand-400 transition-colors">Contact / Book Demo</button>
        <span className="hidden sm:inline text-slate-700">•</span>
        <button onClick={() => setView('admin')} className="hover:text-brand-400 transition-colors font-bold">Admin Portal</button>
      </div>
      
    </div>
  </footer>
);

export default function App() {
  const [currentView, setInternalView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const setView = (view) => {
    if (view === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = view;
    }
    setInternalView(view);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['signup', 'contact', 'demo', 'privacy', 'terms', 'admin'].includes(hash)) {
        setInternalView(hash);
      } else {
        setInternalView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentView]);

  return (
    <div className="min-h-screen bg-brand-900 selection:bg-brand-400 selection:text-brand-900 flex flex-col justify-between">
      
      <div>
        
        {/* Global Navigation */}
        <NavigationBar 
          setView={setView} 
          currentView={currentView} 
          toggleMenu={() => setIsMenuOpen(true)} 
        />
        
        <SideMenu 
          isOpen={isMenuOpen} 
          closeMenu={() => setIsMenuOpen(false)} 
          setView={setView}
          currentView={currentView}
        />

        {/* View Router */}
        {currentView === 'home' && (
          <>
            <LandingHero setView={setView} />
            <BuiltForSection />
            <ProblemSection />
            <WhyVoiceSection />
            <WorkflowSection />
            <InsightsDemo />
            <RoiSection />
            <WhyEchoLoop />
            <FounderProgram setView={setView} />
            <PricingSection setView={setView} />
            <FinalCtaSection setView={setView} />
          </>
        )}

        {currentView === 'signup' && <BetaSignupView setView={setView} />}
        {currentView === 'contact' && <ContactView setView={setView} />}
        {currentView === 'demo' && <DemoView setView={setView} />}
        {currentView === 'privacy' && <LegalView title="Privacy Policy" setView={setView} />}
        {currentView === 'terms' && <LegalView title="Terms of Service" setView={setView} />}
        {currentView === 'admin' && <AdminPortalView />}
      </div>

      {/* Global Footer */}
      <FooterBlock setView={setView} />
      
    </div>
  );
}