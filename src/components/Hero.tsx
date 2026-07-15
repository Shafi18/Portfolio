import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, ShieldCheck as VerifiedIcon, Cpu, Play, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Profile } from '../types';

interface HeroProps {
  onOpenScheduler: () => void;
  profile: Profile;
}

export default function Hero({ onOpenScheduler, profile }: HeroProps) {
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [auditState, setAuditState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditProgress, setAuditProgress] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setMouseCoords({ x, y });
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const runAudit = () => {
    if (auditState === 'running') return;
    setAuditState('running');
    setAuditProgress(0);
    setAuditLogs([]);

    const steps = [
      'Establishing handshake with secure endpoint...',
      'Initializing core diagnostic modules...',
      'Reading profile metadata & cryptographic keys...',
      'Mapping agile delivery velocity logs...',
      'Verifying ERP & SaaS product ownership tokens...',
      'Compiling Google Analytics tracking status...',
      'Systems fully operational. Integrity verified: 100%'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setAuditLogs(prev => [...prev, `[SYSTEM] ${steps[currentStep]}`]);
        setAuditProgress(Math.round(((currentStep + 1) / steps.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setAuditState('completed');
      }
    }, 450);
  };

  return (
    <section className="relative min-h-[90vh] pt-36 pb-20 overflow-hidden flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto">
      {/* Light Leaks */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-400/5 blur-[120px] pointer-events-none"></div>

      <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-8 z-10 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-4 px-4 py-1.5 bg-sky-500/5 border border-sky-400/20 rounded"
          >
            <span className="font-mono text-[10px] md:text-[11px] text-sky-200 uppercase tracking-[0.2em] font-medium">
              {profile.role1}
            </span>
            <div className="w-px h-4 bg-slate-700/50"></div>
            <span className="font-mono text-[10px] md:text-[11px] text-teal-300 uppercase tracking-[0.2em] font-medium">
              {profile.role2}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-4xl md:text-6xl font-semibold leading-tight tracking-tight text-white"
          >
            {profile.headline}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-sans text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed font-light"
          >
            {profile.bio}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-5 pt-4"
          >
            <button
              onClick={onOpenScheduler}
              className="bg-sky-200 hover:bg-sky-100 text-slate-950 px-8 py-4.5 rounded font-sans text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-3 tech-border shadow-xl shadow-sky-500/5 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer animate-pulse"
            >
              Discuss Transformation
              <TerminalIcon className="w-4 h-4 text-slate-950" />
            </button>
            
            <button
              onClick={runAudit}
              className="flex items-center gap-3 px-5 py-4 border border-slate-800 hover:border-sky-500/30 rounded text-sky-400 font-mono text-xs tracking-wider bg-slate-950/40 hover:bg-sky-950/20 transition-all select-none cursor-pointer group"
            >
              <Cpu className={`w-4 h-4 text-sky-400 group-hover:rotate-90 transition-transform duration-300 ${auditState === 'running' ? 'animate-spin' : ''}`} />
              <span>{auditState === 'running' ? `RUNNING AUDIT [${auditProgress}%]` : 'RUN DIAGNOSTIC AUDIT'}</span>
            </button>
          </motion.div>

          {/* Interactive Diagnostic Output Terminal */}
          <AnimatePresence>
            {auditState !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: 10 }}
                className="bg-slate-950/90 rounded-lg border border-white/5 p-4 max-w-2xl overflow-hidden shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-sky-300 font-bold">SYSTEM TELEMETRY CONSOLE</span>
                  </div>
                  <span className="font-mono text-[9px] text-slate-500">HOST: {profile.idBadge}</span>
                </div>

                <div className="space-y-1.5 max-h-[120px] overflow-y-auto font-mono text-[10px] text-slate-400 scrollbar-thin scrollbar-thumb-slate-800">
                  {auditLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-teal-400">❯</span>
                      <span className={index === auditLogs.length - 1 && auditState === 'running' ? 'text-white' : ''}>{log}</span>
                    </div>
                  ))}
                  {auditState === 'running' && (
                    <div className="flex items-center gap-1.5 text-[10px] text-sky-400 italic font-mono">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Retrieving telemetry parameters...</span>
                    </div>
                  )}
                </div>

                {auditState === 'completed' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                      <Check className="w-3.5 h-3.5" />
                      <span>AUDIT PASSED // DEPLOYMENT STACK SECURE</span>
                    </div>
                    <button 
                      onClick={() => setAuditState('idle')} 
                      className="font-mono text-[9px] text-slate-500 hover:text-white uppercase transition-colors"
                    >
                      Clear
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full aspect-[4/5] max-w-[360px] md:max-w-[380px]"
          >
            {/* Ambient decorative glowing frames */}
            <div className="absolute -inset-6 border border-sky-500/5 rounded-xl z-0 opacity-40"></div>
            <div className="absolute -inset-3 border border-sky-400/10 rounded-lg z-0"></div>

            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="glass-card rounded-lg overflow-hidden relative z-10 h-full tech-border group select-none cursor-crosshair"
            >
              {/* Animated scanning line */}
              <div className="scan-line"></div>

              {/* Glowing gradient inside */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 pointer-events-none"></div>

              <img 
                alt={`${profile.name} Portrait`}
                className="w-full h-full object-cover grayscale-[15%] contrast-110 group-hover:scale-[1.02] transition-transform duration-700"
                src={profile.portraitUrl}
                referrerPolicy="no-referrer"
              />

              {/* Coordinate overlay details on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 pointer-events-none border border-sky-400/20 font-mono"
                  >
                    {/* Retro Grid crosshair */}
                    <div className="absolute left-0 right-0 border-t border-sky-400/10" style={{ top: `${mouseCoords.y}px` }}></div>
                    <div className="absolute top-0 bottom-0 border-l border-sky-400/10" style={{ left: `${mouseCoords.x}px` }}></div>

                    {/* Coordinates box */}
                    <div className="absolute bottom-4 right-4 bg-slate-950/90 text-[9px] text-sky-400 border border-sky-500/20 rounded px-2 py-1 font-bold tracking-wider">
                      GRID_LOC [X:{mouseCoords.x} Y:{mouseCoords.y}]
                    </div>

                    <div className="absolute top-4 left-4 bg-slate-950/90 text-[9px] text-teal-400 border border-teal-500/20 rounded px-2 py-1 font-bold tracking-wider animate-pulse">
                      SCAN_INDEX: 04-SHF
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tech Overlay badges */}
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-20 font-mono text-[9px] select-none">
                <span className="text-sky-300 bg-slate-950/80 px-2.5 py-1 border border-sky-500/30 rounded backdrop-blur-sm uppercase tracking-wider">
                  ID: {profile.idBadge}
                </span>
                <span className="text-teal-300 bg-slate-950/80 px-2.5 py-1 border border-teal-500/30 rounded backdrop-blur-sm uppercase tracking-wider flex items-center gap-1">
                  <VerifiedIcon className="w-2.5 h-2.5 text-teal-400" />
                  AUTH: VERIFIED
                </span>
              </div>
            </div>

            {/* Float-badge representing experience */}
            <div className="absolute -bottom-6 -left-6 glass-card p-5.5 rounded-lg z-20 border-l-4 border-sky-400 tech-border flex flex-col shadow-2xl hover:border-teal-400 transition-colors duration-300">
              <span className="text-sky-300 font-display text-4xl leading-none font-bold group-hover:text-teal-300">{profile.yearsExp}</span>
              <span className="text-slate-400 font-mono text-[9px] uppercase tracking-widest mt-1.5 font-medium">
                Cycle_Years_Exp
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

