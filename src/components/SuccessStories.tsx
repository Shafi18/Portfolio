import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SuccessStory } from '../types';
import { Package, Mail, Globe, MessageCircle, ArrowUpRight, ListFilter, Terminal as TerminalIcon, X, CheckCircle, RefreshCw } from 'lucide-react';

const iconMap = {
  WMS: Package,
  CRM: Mail,
  ERP: Globe,
  WHATSAPP: MessageCircle,
  PORTFOLIO: Globe,
};

interface SuccessStoriesProps {
  successStories: SuccessStory[];
}

// Complex specifications for the interactive terminal inspection
const storyBlueprints: Record<string, { problem: string, solution: string, architectureLogs: string[] }> = {
  '1': {
    problem: 'Manual inventory sync lags of up to 48 hours, causing supply chains to experience critical order stockouts.',
    solution: 'Engineered a real-time automated mapping adapter, linking transactional point-of-sale data with backend ERP databases with zero lag.',
    architectureLogs: [
      'Configuring dual ERPNext sync triggers...',
      'Mapping transaction tables to ledger indexes...',
      'Testing inventory lock concurrency rules...',
      'Triggering bulk data compaction routine...',
      'SYSTEM STATUS // ONLINE & DEPLOYED'
    ]
  },
  '2': {
    problem: 'Cold-leads losing engagement due to high intake response latency in customer communications.',
    solution: 'Designed and deployed an automated WhatsApp API notification agent, routing leads to local CRM pipelines within 1.5 seconds.',
    architectureLogs: [
      'Establishing connection to WhatsApp Cloud API...',
      'Mapping inbound HubSpot webhook payload...',
      'Compiling fluid automated sequence routes...',
      'Running simulation of WhatsApp dispatch rules...',
      'SYSTEM STATUS // ONLINE & DEPLOYED'
    ]
  },
  '3': {
    problem: 'Siloed communication and scope creeps across multiple legacy development pipelines.',
    solution: 'Structured a data-driven Agile Scrum PMO framework, reducing task cycle time and aligning delivery milestones directly with executive objectives.',
    architectureLogs: [
      'Setting Jira Sprint Board parameters...',
      'Mapping story point metrics to velocity charts...',
      'Aligning cross-functional milestone cards...',
      'Running automated velocity assessment test...',
      'SYSTEM STATUS // ONLINE & DEPLOYED'
    ]
  }
};

export default function SuccessStories({ successStories }: SuccessStoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [inspectProgress, setInspectProgress] = useState<'idle' | 'running' | 'done'>('idle');
  const [activeLogs, setActiveLogs] = useState<string[]>([]);

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  // Extract unique categories for tabs
  const categories = ['ALL', 'PO & PMO', 'AI AUTOMATION'];

  const filteredStories = successStories.filter(s => {
    if (activeCategory === 'ALL') return true;
    return s.category.toUpperCase() === activeCategory.toUpperCase();
  });

  const runSystemInspection = (story: SuccessStory) => {
    setSelectedStory(story);
    setInspectProgress('running');
    setActiveLogs([]);

    const blueprint = storyBlueprints[story.id] || {
      problem: 'Unoptimized project dependencies or manual processing delays.',
      solution: 'Customized web-hook integrations and automations built in Next.js/React.',
      architectureLogs: ['Compiling environment variables...', 'Establishing secure pipeline connection...', 'SYSTEM STATUS // ONLINE & DEPLOYED']
    };

    let step = 0;
    const interval = setInterval(() => {
      if (step < blueprint.architectureLogs.length) {
        setActiveLogs(prev => [...prev, `[AUDIT] ${blueprint.architectureLogs[step]}`]);
        step++;
      } else {
        clearInterval(interval);
        setInspectProgress('done');
      }
    }, 400);
  };

  return (
    <section id="projects" className="px-6 md:px-16 py-24 max-w-7xl mx-auto w-full text-left relative">
      {/* Light leaks */}
      <div className="absolute right-[-15%] bottom-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

      {/* Section Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-sky-300">
              CASE ARCHIVES
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-white tracking-tight">
            Key Success Stories
          </h2>
          <p className="font-sans text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Tangible solutions designed, engineered, and executed to capture efficiencies, automate work, and build value. Click any card to run an architectural audit.
          </p>
        </div>

        {/* Categories Tab Row */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-900 self-start lg:self-auto font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-sky-500/10 text-sky-300 font-bold border border-sky-500/20' 
                  : 'text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-2 gap-8"
      >
        {filteredStories.map((s) => {
          const IconComponent = iconMap[s.iconName] || Globe;
          const isAI = s.category === 'AI AUTOMATION';
          const isWMS = s.category === 'PO & PMO';
          
          return (
            <motion.div
              layout
              key={s.id}
              variants={itemVariants}
              onClick={() => runSystemInspection(s)}
              whileHover={{ 
                scale: 1.018, 
                y: -5,
                borderColor: 'rgba(56, 189, 248, 0.25)',
                boxShadow: '0 15px 30px -10px rgba(56, 189, 248, 0.15)'
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 24 }}
              className="glass-card rounded-xl p-8 flex flex-col justify-between border border-white/5 relative group cursor-pointer"
            >
              <div className="space-y-6">
                {/* Header indicators */}
                <div className="flex justify-between items-center w-full">
                  <div className={`w-10 h-10 rounded flex items-center justify-center border ${
                    isAI ? 'bg-teal-500/10 border-teal-500/20 text-teal-300' :
                    isWMS ? 'bg-sky-500/10 border-sky-400/20 text-sky-300' :
                    'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <IconComponent className="w-5 h-5 icon-glow" />
                  </div>

                  <span className={`font-mono text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded border ${
                    isAI ? 'bg-teal-950/40 text-teal-400 border-teal-500/20' :
                    isWMS ? 'bg-sky-950/40 text-sky-300 border-sky-500/20' :
                    'bg-slate-950 text-slate-400 border-slate-900'
                  }`}>
                    {s.category}
                  </span>
                </div>

                {/* Info titles */}
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-white group-hover:text-sky-100 transition-colors tracking-tight">
                    {s.title}
                  </h3>
                  <div className="font-mono text-[10px] text-sky-300/80 uppercase tracking-widest bg-sky-950/10 inline-block px-1 rounded">
                    {s.tech}
                  </div>
                </div>

                <p className="font-sans text-sm text-slate-300 font-light leading-relaxed">
                  {s.description}
                </p>
              </div>

              {/* Decorative detail at the bottom */}
              <div className="mt-8 pt-6 border-t border-slate-900/80 flex items-center justify-between text-xs font-mono text-slate-500 group-hover:text-slate-400 transition-colors">
                <span className="flex items-center gap-1.5 text-sky-400/80">
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>RUN SYSTEM INSPECT</span>
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-sky-400" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Case Study Terminal Inspection Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded bg-slate-900/60 border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2 text-left">
                <div className="inline-flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-sky-400" />
                  <span className="font-mono text-[10px] uppercase text-sky-400 tracking-wider font-bold">
                    Case Study Code Audit Portal
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight">{selectedStory.title}</h3>
                <span className="font-mono text-xs text-slate-400 block pt-1">Target Stack: <span className="text-sky-300 font-bold">{selectedStory.tech}</span></span>
              </div>

              {/* Problem/Solution Specifications */}
              <div className="space-y-4 text-left border-t border-b border-white/5 py-4">
                <div className="space-y-1">
                  <h4 className="font-sans text-xs font-bold uppercase text-red-400 tracking-wider">01 // Executive Problem Context</h4>
                  <p className="font-sans text-sm text-slate-300 leading-relaxed font-light">
                    {storyBlueprints[selectedStory.id]?.problem || 'Core optimization bottleneck and manual task processing scaling limitations.'}
                  </p>
                </div>

                <div className="space-y-1 pt-2">
                  <h4 className="font-sans text-xs font-bold uppercase text-teal-400 tracking-wider">02 // Engineered Solution Blueprint</h4>
                  <p className="font-sans text-sm text-slate-300 leading-relaxed font-light">
                    {storyBlueprints[selectedStory.id]?.solution || 'Deploying automated workflows, custom integrations, and centralized dashboard status reporting.'}
                  </p>
                </div>
              </div>

              {/* Simulated Deployment Logs */}
              <div className="bg-slate-950 border border-slate-900 rounded-lg p-5 font-mono text-xs text-left space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-[10px] text-slate-500 font-bold">
                  <span>DEPLOYMENT RECONNAISSANCE</span>
                  <span>BUILD_STATUS: {inspectProgress === 'done' ? 'STABLE' : 'AUDITING'}</span>
                </div>

                <div className="space-y-1.5 min-h-[100px] text-slate-400">
                  {activeLogs.map((log, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-2">
                      <span className="text-teal-400">❯</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  {inspectProgress === 'running' && (
                    <div className="flex items-center gap-2 text-sky-400 italic">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Inspecting platform dependencies...</span>
                    </div>
                  )}
                </div>

                {inspectProgress === 'done' && (
                  <div className="flex items-center gap-2 text-emerald-400 border-t border-white/5 pt-3 mt-3 text-[11px]">
                    <CheckCircle className="w-4 h-4" />
                    <span>AUDIT PASSED // ARCHITECTURE VERIFIED 100% STABLE</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-6 py-2.5 rounded font-sans text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
