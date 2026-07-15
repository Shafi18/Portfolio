import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Compass, BarChart3, Star, CheckCircle, ArrowRight, Play, Settings, ShieldAlert, Cpu } from 'lucide-react';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function Domains() {
  const [activeDomain, setActiveDomain] = useState<'architecture' | 'generation' | 'governance' | null>('architecture');
  
  // Interactive Simulator States
  // Domain 1: SDLC Steps
  const [sdlcStep, setSdlcStep] = useState(0);
  const sdlcSteps = [
    { title: 'Requirements Ingestion', desc: 'Synthesizing commercial objectives from stakeholders and scoping agile milestones.' },
    { title: 'PRD & Spec Compilation', desc: 'Formulating modular software schemas, database tables, and system boundary documents.' },
    { title: 'Frappe/ERP Customization', desc: 'Developing custom ERPNext doctypes, Python controllers, and database indexes.' },
    { title: 'Code Review & QA Validation', desc: 'Running unit validation models, lint checks, and pre-deployment audits.' },
    { title: 'Production CI/CD Release', desc: 'Staging, testing database migrations, and launching containerized services.' }
  ];

  // Domain 2: Lead webhook simulation
  const [leadSimState, setLeadSimState] = useState<'idle' | 'routing' | 'notified'>('idle');
  const [leadInput, setLeadInput] = useState({ name: 'Alexander', company: 'NextGen Corp', goal: 'ERP Automation' });

  // Domain 3: PMO Kanban board
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 1, title: 'Map Multi-tenant Accounts', status: 'TODO', priority: 'HIGH' },
    { id: 2, title: 'Configure GA4 Stream Keys', status: 'PROGRESS', priority: 'MEDIUM' },
    { id: 3, title: 'Audit SSL Certificates', status: 'REVIEW', priority: 'CRITICAL' },
    { id: 4, title: 'Sync WhatsApp API triggers', status: 'DONE', priority: 'HIGH' }
  ]);

  const moveTask = (id: number) => {
    setKanbanTasks(prev => prev.map(t => {
      if (t.id === id) {
        const statuses = ['TODO', 'PROGRESS', 'REVIEW', 'DONE'];
        const currentIdx = statuses.indexOf(t.status);
        const nextStatus = statuses[(currentIdx + 1) % statuses.length];
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const runLeadSimulation = () => {
    if (leadSimState !== 'idle') return;
    setLeadSimState('routing');
    setTimeout(() => {
      setLeadSimState('notified');
    }, 1200);
  };

  const resetLeadSimulation = () => {
    setLeadSimState('idle');
  };

  return (
    <section id="pillars" className="px-6 md:px-16 py-24 max-w-7xl mx-auto w-full text-left space-y-16 relative">
      <div className="absolute right-[-10%] top-[20%] w-[35vw] h-[35vw] rounded-full bg-sky-500/5 blur-[120px] pointer-events-none"></div>

      {/* Section Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping"></span>
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-sky-300">
            STRATEGIC PILLARS
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-white tracking-tight">
          Core Capacities & Strategic Domains
        </h2>
        <p className="font-sans text-sm md:text-base text-slate-400 font-light leading-relaxed">
          Bridging the gap between software engineering, agile management, and enterprise deployment to drive continuous efficiency. Click any domain to access its live playbook simulation.
        </p>
      </div>

      {/* Bento Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-12 gap-8"
      >
        {/* Domain 1: Product Ownership & Engineering */}
        <motion.div 
          variants={cardVariants}
          onClick={() => setActiveDomain('architecture')}
          className={`md:col-span-6 lg:col-span-7 glass-card rounded-xl p-8 flex flex-col justify-between cursor-pointer border transition-all duration-300 relative group overflow-hidden ${
            activeDomain === 'architecture' 
              ? 'border-sky-500/40 bg-sky-500/5 shadow-lg shadow-sky-500/5' 
              : 'border-white/5 hover:border-sky-400/20'
          }`}
        >
          {activeDomain === 'architecture' && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
          )}
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded flex items-center justify-center border transition-all ${
                activeDomain === 'architecture' 
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300' 
                  : 'bg-sky-500/10 border-sky-400/20 text-sky-300 group-hover:bg-sky-500/20'
              }`}>
                <Layers className="w-5 h-5 icon-glow" />
              </div>
              <span className="font-mono text-[9px] text-sky-400 uppercase tracking-widest font-bold">
                {activeDomain === 'architecture' ? '● ACTIVE PLAYBOOK' : 'CLICK TO SIMULATE'}
              </span>
            </div>
            
            <div className="space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-400 font-bold">
                Domain_01 // ARCHITECTURE
              </span>
              <h3 className="font-display text-2xl font-bold text-white tracking-tight group-hover:text-sky-100 transition-colors">
                Product Ownership & Engineering
              </h3>
              <p className="font-sans text-sm text-slate-300 font-light leading-relaxed">
                Spearheading the alignment of product roadmaps with commercial targets. Translating strategic vision into modular technical tasks across standard ERP and custom SaaS solutions.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-900/80 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-sky-300 rounded-full"></div>
              <span className="font-mono text-[11px] text-slate-300">React/Next.js Arc</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-sky-300 rounded-full"></div>
              <span className="font-mono text-[11px] text-slate-300">Enterprise CMS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-300 rounded-full"></div>
              <span className="font-mono text-[11px] text-slate-300">Frappe Framework</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-300 rounded-full"></div>
              <span className="font-mono text-[11px] text-slate-300">Full SDLC Mgmt</span>
            </div>
          </div>
        </motion.div>

        {/* Domain 2: Digital Marketing & Leads */}
        <motion.div 
          variants={cardVariants}
          onClick={() => setActiveDomain('generation')}
          className={`md:col-span-6 lg:col-span-5 glass-card rounded-xl p-8 flex flex-col justify-between cursor-pointer border transition-all duration-300 relative group overflow-hidden ${
            activeDomain === 'generation' 
              ? 'border-teal-500/40 bg-teal-500/5 shadow-lg shadow-teal-500/5' 
              : 'border-white/5 hover:border-teal-400/20'
          }`}
        >
          {activeDomain === 'generation' && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded flex items-center justify-center border transition-all ${
                activeDomain === 'generation' 
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300' 
                  : 'bg-teal-500/10 border-teal-400/20 text-teal-300 group-hover:bg-teal-500/20'
              }`}>
                <Compass className="w-5 h-5 icon-glow" />
              </div>
              <span className="font-mono text-[9px] text-teal-400 uppercase tracking-widest font-bold">
                {activeDomain === 'generation' ? '● ACTIVE PLAYBOOK' : 'CLICK TO SIMULATE'}
              </span>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-sky-400 font-bold">
                Domain_02 // GENERATION
              </span>
              <h3 className="font-display text-2xl font-bold text-white tracking-tight group-hover:text-teal-100 transition-colors">
                Digital Marketing & Leads
              </h3>
              <p className="font-sans text-sm text-slate-300 font-light leading-relaxed">
                Integrating automation protocols across marketing operations, streamlining tracking, data synchronization, and nurturing ecosystems for maximized ROI.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-900/80 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">CRM Operations Lift</span>
              <span className="text-teal-400 font-bold">+40%</span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-teal-500 to-sky-400 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
              <Star className="w-3 h-3 text-teal-400" />
              <span>AI_Lead strategy integration</span>
            </div>
          </div>
        </motion.div>

        {/* Domain 3: PMO & Transformation */}
        <motion.div 
          variants={cardVariants}
          onClick={() => setActiveDomain('governance')}
          className={`md:col-span-12 glass-card rounded-xl p-8 flex flex-col justify-between cursor-pointer border transition-all duration-300 relative group overflow-hidden ${
            activeDomain === 'governance' 
              ? 'border-sky-500/40 bg-sky-500/5 shadow-lg shadow-sky-500/5' 
              : 'border-white/5 hover:border-sky-400/20'
          }`}
        >
          {activeDomain === 'governance' && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
          )}

          <div className="grid lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded border transition-all flex items-center justify-center ${
                  activeDomain === 'governance' 
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300' 
                    : 'bg-sky-500/10 border-sky-400/20 text-sky-300 group-hover:bg-sky-500/20'
                }`}>
                  <BarChart3 className="w-5 h-5 icon-glow" />
                </div>
                <span className="font-mono text-[9px] text-sky-400 uppercase tracking-widest font-bold lg:hidden">
                  {activeDomain === 'governance' ? '● ACTIVE PLAYBOOK' : 'CLICK TO SIMULATE'}
                </span>
              </div>

              <div className="space-y-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-sky-400 font-bold">
                  Domain_03 // GOVERNANCE
                </span>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                  Agile PMO Governance & Stakeholder Mgmt
                </h3>
                <p className="font-sans text-sm text-slate-300 font-light leading-relaxed">
                  Fostering strong cross-functional communication and applying robust governance architectures. Ensuring highly aligned objectives from C-level executives to engineering delivery modules.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="hidden lg:inline-block font-mono text-[9px] text-sky-400 uppercase tracking-widest font-bold">
                  {activeDomain === 'governance' ? '● ACTIVE PLAYBOOK' : 'CLICK TO SIMULATE'}
                </span>
              </div>
              
              <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-6 space-y-4 font-mono">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Metrics Compliance</div>
                    <div className="text-sm font-semibold text-white">100% Stakeholder Sign-off</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Scope Delivery</div>
                    <div className="text-sm font-semibold text-white">25+ Projects End-to-End</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Playbook interactive simulator panels container */}
      <AnimatePresence mode="wait">
        {activeDomain && (
          <motion.div
            key={activeDomain}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-slate-950/85 rounded-xl border border-white/5 p-6 md:p-8"
          >
            {activeDomain === 'architecture' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span className="font-mono text-xs uppercase tracking-wider text-sky-300 font-bold">SDLC PIPELINE BLUEPRINT</span>
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Interactive Stepper Console</span>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-5 space-y-4">
                    <h4 className="font-sans text-sm font-semibold text-white uppercase tracking-wider">Methodology Execution Map</h4>
                    <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
                      Shafik's technical delivery approach maps strictly to a five-stage system alignment. Click each milestone step to view the specific operational parameters.
                    </p>
                    <div className="flex flex-col gap-2">
                      {sdlcSteps.map((step, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSdlcStep(idx)}
                          className={`flex items-center justify-between p-3 rounded font-mono text-xs transition-all cursor-pointer ${
                            sdlcStep === idx 
                              ? 'bg-sky-500/10 border border-sky-500/30 text-sky-300 font-bold' 
                              : 'bg-slate-900/40 border border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={sdlcStep === idx ? 'text-sky-400' : 'text-slate-600'}>0{idx + 1}</span>
                            <span>{step.title}</span>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${sdlcStep === idx ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-7 bg-slate-950 border border-slate-900 rounded-lg p-6 relative min-h-[220px] flex flex-col justify-between">
                    <div className="space-y-4 text-left">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="font-mono text-[10px] text-slate-500 font-bold">PIPELINE PHASE 0{sdlcStep + 1}</span>
                        <span className="font-mono text-[9px] text-teal-400 px-2 py-0.5 bg-teal-950/40 border border-teal-500/20 rounded font-bold">OPERATIONAL</span>
                      </div>
                      <h5 className="font-display text-lg font-bold text-white tracking-tight">{sdlcSteps[sdlcStep].title}</h5>
                      <p className="font-sans text-sm text-slate-300 leading-relaxed font-light">{sdlcSteps[sdlcStep].desc}</p>
                    </div>

                    <div className="border-t border-slate-900/60 pt-4 mt-6 flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-sky-400 font-mono">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Audit Sign-off Approved</span>
                      </div>
                      <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">LEDGER_ID_#SHF_0{sdlcStep + 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDomain === 'generation' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-teal-400" />
                    <span className="font-mono text-xs uppercase tracking-wider text-teal-300 font-bold">WEBHOOK API & LEADS SIMULATOR</span>
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Real-time Automation Sandbox</span>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-5 space-y-4">
                    <h4 className="font-sans text-sm font-semibold text-white uppercase tracking-wider">Test Automated Conversion Flow</h4>
                    <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
                      Simulate a client booking request. This shows how lead details trigger secure API webhooks, sync metrics, and generate real-time confirmations in milliseconds.
                    </p>

                    <div className="space-y-3 font-mono text-xs bg-slate-950 p-4 rounded border border-slate-900">
                      <div className="space-y-1">
                        <label className="text-slate-500 uppercase tracking-wider text-[10px]">Client Name</label>
                        <input
                          type="text"
                          value={leadInput.name}
                          onChange={(e) => setLeadInput(p => ({ ...p, name: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 focus:border-teal-500/40 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 uppercase tracking-wider text-[10px]">Company</label>
                        <input
                          type="text"
                          value={leadInput.company}
                          onChange={(e) => setLeadInput(p => ({ ...p, company: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 focus:border-teal-500/40 outline-none"
                        />
                      </div>
                      <button
                        onClick={runLeadSimulation}
                        disabled={leadSimState === 'routing'}
                        className="w-full bg-teal-400 hover:bg-teal-300 text-slate-950 font-sans text-xs font-bold uppercase tracking-wider py-2.5 rounded transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Trigger Ingest Pipeline</span>
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-7 bg-slate-950 border border-slate-900 rounded-lg p-6 min-h-[260px] flex flex-col justify-between font-mono text-xs">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-500">API ROUTING PATHWAY</span>
                        <span className={`text-[10px] font-bold ${
                          leadSimState === 'idle' ? 'text-slate-500' :
                          leadSimState === 'routing' ? 'text-amber-400 animate-pulse' :
                          'text-emerald-400'
                        }`}>
                          {leadSimState === 'idle' && '● STANDBY_WAIT'}
                          {leadSimState === 'routing' && '● INGESTING...'}
                          {leadSimState === 'notified' && '● COMPLETED'}
                        </span>
                      </div>

                      <div className="space-y-2 text-[11px] leading-relaxed">
                        <div className="flex gap-2 text-slate-500">
                          <span>[00.00s]</span>
                          <span className="text-slate-400">REST API hook initialized at <span className="text-white">/api/v1/leads</span></span>
                        </div>

                        {leadSimState !== 'idle' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 text-slate-500">
                            <span>[00.12s]</span>
                            <span className="text-amber-300">Ingested Payload: &#123; name: "{leadInput.name}", company: "{leadInput.company}" &#125;</span>
                          </motion.div>
                        )}

                        {leadSimState === 'notified' && (
                          <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 text-slate-500">
                              <span>[00.42s]</span>
                              <span className="text-sky-300 font-bold">CRM Synced: Database row matched securely with company criteria.</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 text-slate-500">
                              <span>[00.91s]</span>
                              <span className="text-emerald-400">Triggered auto WhatsApp-dispatch endpoint payload securely.</span>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-900/60 pt-4 mt-4 flex items-center justify-between">
                      {leadSimState === 'notified' ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>WhatsApp & Auto-Email active!</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">Waiting for payload dispatch trigger...</span>
                      )}
                      {leadSimState === 'notified' && (
                        <button onClick={resetLeadSimulation} className="text-slate-500 hover:text-white transition-all underline cursor-pointer text-[10px] uppercase">
                          Reset Simulation
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDomain === 'governance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-sky-400" />
                    <span className="font-mono text-xs uppercase tracking-wider text-sky-300 font-bold">AGILE PMO GOVERNANCE BOARD</span>
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Interactive Agile Kanban board</span>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-white uppercase tracking-wider">Scrum Board Interactive Telemetry</h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
                        Click on any of the active PMO tickets below to cycle them through their corresponding agile statuses.
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-sky-400 font-bold bg-sky-950/40 border border-sky-400/20 px-2.5 py-1 rounded">
                      VELOCITY LEVEL: EXCELLENT (96.8%)
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-4 gap-4 pt-2">
                    {['TODO', 'PROGRESS', 'REVIEW', 'DONE'].map((column) => (
                      <div key={column} className="bg-slate-950 rounded border border-slate-900 p-4 space-y-3 min-h-[160px]">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="font-mono text-[10px] tracking-wider text-slate-400 font-bold">{column}</span>
                          <span className="text-[10px] text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded-full font-mono">
                            {kanbanTasks.filter(t => t.status === column).length}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {kanbanTasks.filter(t => t.status === column).map((task) => (
                            <motion.div
                              layout
                              key={task.id}
                              onClick={() => moveTask(task.id)}
                              className="bg-slate-900 border border-slate-800 rounded p-3 text-left space-y-2 hover:border-sky-400/30 cursor-pointer active:scale-95 transition-all select-none group"
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded font-bold ${
                                  task.priority === 'CRITICAL' ? 'bg-red-950/60 text-red-400 border border-red-500/20' :
                                  task.priority === 'HIGH' ? 'bg-amber-950/60 text-amber-400 border border-amber-500/20' :
                                  'bg-slate-950 text-slate-400'
                                }`}>
                                  {task.priority}
                                </span>
                                <span className="font-mono text-[8px] text-slate-600 group-hover:text-sky-400 transition-colors">❯ MOVE</span>
                              </div>
                              <p className="font-sans text-xs text-slate-300 font-medium leading-tight">{task.title}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
