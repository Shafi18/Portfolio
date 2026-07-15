import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TechCategory } from '../types';
import { Settings, Server, CheckCircle2, Search, Sliders, Info, Cpu, CheckCircle } from 'lucide-react';

const iconMap = {
  'PM & GOVERNANCE': Settings,
  'PLATFORMS & AI': Server,
  'QA & DELIVERY': CheckCircle2,
};

interface TechArraySectionProps {
  techArray: TechCategory[];
}

const proficiencyData: Record<string, { level: string, usage: string, lastUsed: string }> = {
  'Jira & Confluence': { level: 'EXPERT', usage: 'PMO Sprint planning & documentation hub', lastUsed: 'Continuous' },
  'Agile Scrum & Kanban': { level: 'MASTER', usage: 'Cross-functional delivery orchestration', lastUsed: 'Continuous' },
  'MS Project': { level: 'EXPERT', usage: 'Enterprise gantt timeline mapping', lastUsed: 'June 2026' },
  'Mural / Miro': { level: 'EXPERT', usage: 'Strategic stakeholder scoping & roadmaps', lastUsed: 'Continuous' },
  'Next.js / React': { level: 'MASTER', usage: 'Modern portal front-ends and web apps', lastUsed: 'Continuous' },
  'Tailwind CSS': { level: 'MASTER', usage: 'High-fidelity fluid styling and micro-interaction layers', lastUsed: 'Continuous' },
  'Frappe / ERPNext': { level: 'MASTER', usage: 'Custom back-office accounting, inventory, HR doctypes', lastUsed: 'Continuous' },
  'Node.js': { level: 'EXPERT', usage: 'Server-side API handlers and lead webhook processors', lastUsed: 'Continuous' },
  'Firebase / Firestore': { level: 'EXPERT', usage: 'Real-time database triggers & authorization protocols', lastUsed: 'Continuous' },
  'Playwright / Cypress': { level: 'MASTER', usage: 'E2E regression model scripts and QA validation', lastUsed: 'Continuous' },
  'Postman / REST APIs': { level: 'MASTER', usage: 'Webhook validation and route request debugging', lastUsed: 'Continuous' },
  'Git / GitHub Actions': { level: 'MASTER', usage: 'Branch strategies, automated lints, and build tests', lastUsed: 'Continuous' },
  'Google Analytics / GTM': { level: 'MASTER', usage: 'Event pixel trigger configurations and tracking parameters', lastUsed: 'Continuous' },
};

export default function TechArraySection({ techArray }: TechArraySectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hudActive, setHudActive] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  // Filter items in categories based on query
  const filteredTechArray = techArray.map(category => {
    const matchedItems = category.items.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...category,
      items: matchedItems,
      hasMatch: matchedItems.length > 0
    };
  }).filter(category => searchQuery === '' || category.hasMatch);

  return (
    <section id="skills" className="px-6 md:px-16 py-24 max-w-7xl mx-auto w-full text-left relative">
      <div className="absolute right-[5%] bottom-[5%] w-[30vw] h-[30vw] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

      {/* Header controls layout */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-sky-300">
              ENGINEERING ARMAMENT
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-white tracking-tight">
            Tech Array & Methodologies
          </h2>
          <p className="font-sans text-sm md:text-base text-slate-400 font-light leading-relaxed">
            An executive breakdown of the platforms, toolsets, and frameworks deployed to manage projects, verify quality, and automate pipelines. Toggle HUD Mode to view competency scores.
          </p>
        </div>

        {/* Interactive Search and Toggle Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search specific tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 rounded-lg pl-10 pr-4 py-2.5 font-mono text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-sky-500/40 focus:bg-slate-950/80 transition-all"
            />
          </div>

          {/* HUD Toggle */}
          <button
            onClick={() => setHudActive(!hudActive)}
            className={`font-mono text-[10px] uppercase tracking-wider px-4 py-3 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2 ${
              hudActive 
                ? 'bg-sky-500/15 border-sky-400 text-sky-300 font-bold shadow-lg shadow-sky-500/5' 
                : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-300 hover:border-slate-800'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${hudActive ? 'animate-pulse' : ''}`} />
            <span>HUD_MODE: {hudActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Grid container with AnimatePresence */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-3 gap-8"
      >
        {filteredTechArray.map((category, idx) => {
          const Icon = iconMap[category.title as keyof typeof iconMap] || Settings;
          const isPrimary = category.color === 'primary';
          const isTertiary = category.color === 'tertiary';
          
          return (
            <motion.div
              key={idx}
              layout
              variants={cardVariants}
              className="glass-panel p-8 rounded-xl border border-white/5 flex flex-col justify-between hover:border-slate-800 transition-all relative overflow-hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center border ${
                    isPrimary ? 'bg-sky-500/10 border-sky-500/20 text-sky-300' :
                    isTertiary ? 'bg-teal-500/10 border-teal-500/20 text-teal-300' :
                    'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-widest font-semibold text-slate-200">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.items.map((item, itemIdx) => {
                    const prof = proficiencyData[item];
                    const isSelected = selectedTool === item;
                    
                    return (
                      <div 
                        key={itemIdx}
                        onClick={() => setSelectedTool(isSelected ? null : item)}
                        className={`flex flex-col gap-2 p-3 rounded border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-sky-500/5 border-sky-500/30' 
                            : 'bg-slate-950/40 border-slate-900/50 hover:bg-slate-900/20 hover:border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 font-sans text-sm text-slate-300 group select-none">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-1 h-1 rounded-full transition-all group-hover:scale-150 ${
                              isPrimary ? 'bg-sky-400 group-hover:bg-sky-300' :
                              isTertiary ? 'bg-teal-400 group-hover:bg-teal-300' :
                              'bg-slate-500 group-hover:bg-slate-400'
                            }`}></span>
                            <span className="font-medium group-hover:text-white transition-colors">{item}</span>
                          </div>
                          
                          {hudActive && prof && (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                prof.level === 'MASTER' ? 'bg-sky-950 text-sky-400 border border-sky-400/20' :
                                'bg-teal-950 text-teal-400 border border-teal-400/20'
                              }`}
                            >
                              {prof.level}
                            </motion.span>
                          )}
                        </div>

                        {/* Expandable tool detail card */}
                        <AnimatePresence>
                          {isSelected && prof && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2 mt-2 border-t border-white/5 space-y-2 text-left"
                            >
                              <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
                                {prof.usage}
                              </p>
                              <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 pt-1">
                                <span>CYCLE_TEST: <span className="text-emerald-400 font-bold">STABLE</span></span>
                                <span>LAST_ACT: {prof.lastUsed}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Decorative category label at bottom */}
              <div className="pt-6 font-mono text-[9px] text-slate-600 uppercase tracking-widest">
                CLASS_0{idx + 1} // OPERATIONAL_STACK
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
