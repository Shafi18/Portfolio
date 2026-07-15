import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerMilestone } from '../types';
import { Building2, Terminal, Cpu, Code2, Workflow, Activity, MapPin, ListFilter, ClipboardCheck, CheckCircle2, ChevronDown } from 'lucide-react';

interface TimelineProps {
  milestones: CareerMilestone[];
}

// Interactive Deliverables checklists for each milestone role
const roleLedgers: Record<string, { task: string, completed: boolean }[]> = {
  'Product Owner & Software Engineer': [
    { task: 'Orchestrated ERPNext inventory ledger mapping with 100% data fidelity.', completed: true },
    { task: 'Architected React/Next.js dashboard components and API route middleware.', completed: true },
    { task: 'Spearheaded 25+ sprint planning boards & commercial alignment roadmaps.', completed: true },
    { task: 'Engineered automated WhatsApp CRM pipeline handlers and triggers.', completed: true },
    { task: 'Coordinated cross-functional stakeholder reviews and final sign-offs.', completed: true }
  ],
  'Digital Marketing Specialist': [
    { task: 'Designed automated WhatsApp messaging rules and trigger-flow systems.', completed: true },
    { task: 'Integrated Google Analytics 4 pixels & Google Tag Manager triggers.', completed: true },
    { task: 'Optimized conversion operations leading to a verified 40% lead-intake lift.', completed: true },
    { task: 'Launched localized multi-tenant campaign funnels and landing zones.', completed: true }
  ],
  'Digital Marketing Executive': [
    { task: 'Structured automated customer onboarding sequence triggers.', completed: true },
    { task: 'Analyzed traffic attribution data models to scale advertising ROI.', completed: true },
    { task: 'Collaborated on continuous UI landing page A/B tests.', completed: true }
  ]
};

const getCompanyLogo = (m: CareerMilestone) => {
  const company = m.company;
  const norm = company.toLowerCase();
  
  if (m.logoMode === 'icon') {
    return (
      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400 group-hover:border-slate-700 transition-all select-none">
        <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">{company}</span>
      </div>
    );
  }

  let domain = m.logoDomain || '';
  let colorClass = 'bg-slate-900 border-slate-800 text-slate-300';
  
  if (!domain) {
    if (norm.includes('doodle')) {
      domain = 'doodletech.ae';
      colorClass = 'bg-sky-500/5 border-sky-400/20 text-sky-400 group-hover:border-sky-400/40';
    } else if (norm.includes('develoeper') || norm.includes('developer')) {
      domain = 'develoeper.com';
      colorClass = 'bg-amber-500/5 border-amber-400/20 text-amber-400 group-hover:border-amber-400/40';
    } else if (norm.includes('infinite')) {
      domain = 'infinite.com';
      colorClass = 'bg-purple-500/5 border-purple-400/20 text-purple-400 group-hover:border-purple-400/40';
    } else if (norm.includes('guidehouse')) {
      domain = 'guidehouse.com';
      colorClass = 'bg-teal-500/5 border-teal-400/20 text-teal-400 group-hover:border-teal-400/40';
    } else if (norm.includes('omega') || norm.includes('capgemini')) {
      domain = 'capgemini.com';
      colorClass = 'bg-emerald-500/5 border-emerald-400/20 text-emerald-300 group-hover:border-emerald-400/40';
    }
  } else {
    colorClass = 'bg-sky-500/5 border-sky-400/20 text-sky-300 group-hover:border-sky-400/40';
  }

  if (domain) {
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const logoUrl = cleanDomain === 'develoeper.com' || cleanDomain === 'doodletech.ae'
      ? `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`
      : `https://logo.clearbit.com/${cleanDomain}`;
    const fallbackUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
    
    return (
      <div className={`flex items-center gap-2 px-2.5 py-1 rounded transition-all select-none ${colorClass}`}>
        <div className="w-4 h-4 bg-white/10 rounded flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
          <img 
            src={logoUrl} 
            alt={`${company} Logo`}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src !== fallbackUrl) {
                img.src = fallbackUrl;
              }
            }}
          />
        </div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">{company}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400 group-hover:border-slate-700 transition-all select-none">
      <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">{company}</span>
    </div>
  );
};

const getRoleIcon = (role: string, isPrimary: boolean, isTertiary: boolean) => {
  const norm = role.toLowerCase();
  let IconComponent = Activity;
  
  if (norm.includes('manager') || norm.includes('owner') || norm.includes('pmo') || norm.includes('product')) {
    IconComponent = Workflow; // Product orchestration & work pipelines
  } else if (norm.includes('developer') || norm.includes('engineer') || norm.includes('code')) {
    IconComponent = Terminal; // Coding/development environments
  } else if (norm.includes('tester') || norm.includes('qa') || norm.includes('testing')) {
    IconComponent = Code2; // Software testing architectures
  } else if (norm.includes('associate') || norm.includes('executive') || norm.includes('it')) {
    IconComponent = Cpu; // System execution & IT operations
  }

  const iconColor = isPrimary ? 'text-sky-300' : isTertiary ? 'text-teal-300' : 'text-slate-500';

  return <IconComponent className={`w-3.5 h-3.5 ${iconColor}`} />;
};

export default function Timeline({ milestones }: TimelineProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'key'>('all');
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>('1'); // Expand first by default
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const filteredMilestones = milestones.filter(m => {
    if (filterMode === 'key') {
      // Only show current PO / DEV roles (primary/tertiary color tags)
      return m.color === 'primary' || m.color === 'tertiary';
    }
    return true;
  });

  const toggleTask = (key: string) => {
    setCheckedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <section id="experience" className="px-6 md:px-16 py-24 max-w-7xl mx-auto w-full text-left relative">
      {/* Radial ambient glow */}
      <div className="absolute left-[-5%] bottom-[10%] w-[40vw] h-[40vw] rounded-full bg-sky-500/5 blur-[120px] pointer-events-none"></div>

      {/* Header with layout and controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-sky-300">
              SYSTEM EVOLUTION
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-white tracking-tight">
            Career Milestones & Chronology
          </h2>
          <p className="font-sans text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Tracing the path of technical execution, platform launches, and digital leadership across enterprise layers. Select a milestone to inspect specific deliverables.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-900 self-start lg:self-auto font-mono text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-2 rounded transition-all cursor-pointer flex items-center gap-2 ${
              filterMode === 'all' 
                ? 'bg-sky-500/10 text-sky-300 font-bold border border-sky-500/20' 
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Chronology</span>
          </button>
          <button
            onClick={() => setFilterMode('key')}
            className={`px-3.5 py-2 rounded transition-all cursor-pointer flex items-center gap-2 ${
              filterMode === 'key' 
                ? 'bg-sky-500/10 text-sky-300 font-bold border border-sky-500/20' 
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            <span>System Leadership</span>
          </button>
        </div>
      </div>

      {/* Chronology List */}
      <div className="relative border-l border-slate-900 ml-4 md:ml-6 pl-8 md:pl-12 space-y-12">
        {/* Animated Line Indicator */}
        <div className="absolute top-0 bottom-0 left-[-1px] w-0.5 bg-gradient-to-b from-sky-400 via-teal-400/50 to-slate-950"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          {filteredMilestones.map((m) => {
            const isPrimary = m.color === 'primary';
            const isTertiary = m.color === 'tertiary';
            const isExpanded = expandedMilestone === m.id;
            const ledger = roleLedgers[m.role] || [];
            
            return (
              <motion.div
                key={m.id}
                layout
                variants={itemVariants}
                className="relative group"
              >
                {/* Custom timeline bubble icon */}
                <div className={`absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-slate-950 border-2 transition-colors duration-300 ${
                  isPrimary ? 'border-sky-400 group-hover:bg-sky-400/10' :
                  isTertiary ? 'border-teal-400 group-hover:bg-teal-400/10' :
                  'border-slate-800 group-hover:bg-slate-800/20'
                }`}>
                  {getRoleIcon(m.role, isPrimary, isTertiary)}
                </div>

                {/* Main Card Content */}
                <div 
                  onClick={() => setExpandedMilestone(isExpanded ? null : m.id)}
                  className={`glass-panel p-6 md:p-8 rounded-xl border transition-all duration-300 cursor-pointer select-none ${
                    isExpanded 
                      ? 'border-sky-500/20 bg-sky-500/5 shadow-xl shadow-sky-500/5' 
                      : 'border-white/5 hover:border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-xl font-bold text-white tracking-tight">
                          {m.role}
                        </h3>
                        {isPrimary && (
                          <span className="font-mono text-[9px] font-semibold text-sky-300 bg-sky-950/40 border border-sky-400/30 px-2 py-0.5 rounded">
                            CURRENT_PO
                          </span>
                        )}
                        {isTertiary && (
                          <span className="font-mono text-[9px] font-semibold text-teal-300 bg-teal-950/40 border border-teal-400/30 px-2 py-0.5 rounded">
                            CURRENT_DEV
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5 text-slate-400 font-sans text-sm pt-0.5">
                        {getCompanyLogo(m)}
                        <span className="text-slate-800 text-[10px] select-none font-mono">|</span>
                        <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{m.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`font-mono text-xs md:text-sm px-3.5 py-1.5 rounded border ${
                        isPrimary ? 'bg-sky-950/20 text-sky-300 border-sky-500/20' :
                        isTertiary ? 'bg-teal-950/20 text-teal-300 border-teal-500/20' :
                        'bg-slate-950 text-slate-400 border-slate-900'
                      }`}>
                        {m.period}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-sky-400' : ''}`} />
                    </div>
                  </div>

                  {m.highlights && m.highlights.length > 0 ? (
                    <ul className="space-y-2.5 text-left pt-2 pb-2">
                      {m.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5 text-slate-300 text-sm font-light leading-relaxed">
                          <span className="text-sky-400 font-mono text-xs mt-1 select-none">▸</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : m.description ? (
                    <p className="text-slate-300 text-sm font-light leading-relaxed pt-1 pb-2 max-w-4xl">
                      {m.description}
                    </p>
                  ) : null}

                  {/* Expandable deliverable checkboxes ledger */}
                  <AnimatePresence>
                    {isExpanded && ledger.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/5 mt-6 pt-5 space-y-4"
                        onClick={(e) => e.stopPropagation()} // Prevent card collapse when clicking checkboxes
                      >
                        <div className="flex items-center gap-2">
                          <ClipboardCheck className="w-4 h-4 text-sky-400" />
                          <span className="font-mono text-[10px] uppercase text-sky-400 tracking-wider font-bold">
                            TECHNICAL DELIVERABLES LEDGER (AUDIT MODE)
                          </span>
                        </div>

                        <div className="grid gap-2.5 bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                          {ledger.map((task, tIdx) => {
                            const taskKey = `${m.id}-${tIdx}`;
                            const isChecked = checkedTasks[taskKey] !== false; // Checked by default
                            
                            return (
                              <div 
                                key={tIdx}
                                onClick={() => toggleTask(taskKey)}
                                className="flex items-start gap-3 p-2 hover:bg-slate-900/40 rounded transition-colors cursor-pointer select-none group"
                              >
                                <button className="mt-0.5 flex-shrink-0 outline-none">
                                  <CheckCircle2 className={`w-4 h-4 transition-colors ${
                                    isChecked 
                                      ? 'text-emerald-400 fill-emerald-400/10' 
                                      : 'text-slate-700 group-hover:text-slate-500'
                                  }`} />
                                </button>
                                <span className={`font-sans text-xs transition-all ${
                                  isChecked 
                                    ? 'text-slate-300' 
                                    : 'text-slate-600 line-through'
                                }`}>
                                  {task.task}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 px-1">
                          <span>UAT STATUS: <span className="text-emerald-400 font-bold">VERIFIED SIGN-OFF</span></span>
                          <span>COMPLIANCE INDEX: 100%</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
