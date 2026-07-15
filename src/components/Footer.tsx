import React, { useState } from 'react';
import { Heart, Linkedin, MessageSquare, Terminal, Download, FileText, RefreshCw, CheckCircle, Mail } from 'lucide-react';
import { Profile, CareerMilestone, TechCategory } from '../types';

interface FooterProps {
  profile: Profile;
  onOpenCMS: () => void;
  milestones?: CareerMilestone[];
  techArray?: TechCategory[];
}

export default function Footer({ profile, onOpenCMS, milestones, techArray }: FooterProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [compileSuccess, setCompileSuccess] = useState(false);

  // Generate and download Markdown file of the resume dynamically
  const executeDynamicExport = () => {
    let md = `# ${profile.name.toUpperCase()}\n`;
    md += `${profile.role1} | ${profile.role2}\n`;
    md += `Location: ${profile.location}\n`;
    md += `LinkedIn: ${profile.linkedinUrl}\n\n`;
    
    md += `## PROFESSIONAL BIOGRAPHY\n`;
    md += `${profile.bio}\n\n`;
    
    if (techArray && techArray.length > 0) {
      md += `## SKILLS & ENGINEERING ARMAMENT\n`;
      techArray.forEach(cat => {
        md += `### ${cat.title}\n`;
        md += `${cat.items.join(', ')}\n\n`;
      });
    }
    
    if (milestones && milestones.length > 0) {
      md += `## PROFESSIONAL CHRONOLOGY & DELIVERABLES\n`;
      milestones.forEach(m => {
        md += `### ${m.role} | ${m.company}\n`;
        md += `${m.period} • ${m.location}\n`;
        if (m.highlights && m.highlights.length > 0) {
          m.highlights.forEach(h => {
            md += `- ${h}\n`;
          });
        } else if (m.description) {
          md += `${m.description}\n`;
        }
        md += `\n`;
      });
    }
    
    md += `---\n`;
    md += `Generated dynamically from ${profile.name}'s Operational Console on ${new Date().toLocaleDateString()}.\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${profile.name.replace(/\s+/g, '_')}_Resume.md`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Run simulated terminal packaging steps
  const triggerResumeCompile = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setCompileSuccess(false);
    setCompileLogs([]);

    const steps = [
      'Initializing core resume packaging adapter...',
      'Mapping executive identity strings...',
      'Injecting live professional biography parameters...',
      'Compiling career chronology data...',
      'Aggregating engineering armament indices...',
      'Building file payload: SHFK_RESUME.MD...',
      'SYSTEM EXPORT READY'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setCompileLogs(prev => [...prev, `[CORE_SYS] ${steps[currentStep]}`]);
        currentStep++;
      } else {
        clearInterval(interval);
        executeDynamicExport();
        setCompileSuccess(true);
        setIsCompiling(false);
        // Reset success state after a delay
        setTimeout(() => setCompileSuccess(false), 5000);
      }
    }, 350);
  };

  return (
    <footer className="px-6 md:px-16 py-16 max-w-7xl mx-auto w-full border-t border-slate-900 bg-slate-950/20 text-left space-y-12">
      {/* Upper Deck: Resume and Dossier Download Center */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch bg-slate-950/40 rounded-xl p-6 md:p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-sky-500/5 blur-[80px] pointer-events-none"></div>
        
        {/* Title and context */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-300">
                EXECUTIVE DOSSIER TRANSMISSION
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              Download Credentials & Resume
            </h3>
            <p className="font-sans text-xs md:text-sm text-slate-400 font-light leading-relaxed">
              Retrieve a comprehensive resume package matching the current operational state of this console. Download the live-compiled Markdown dossier or access the standard PDF portfolio.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {/* Download Live Markdown Resume */}
            <button
              onClick={triggerResumeCompile}
              disabled={isCompiling}
              className={`font-mono text-[11px] uppercase tracking-wider px-5 py-3 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2 font-bold ${
                isCompiling
                  ? 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-sky-500/10 border-sky-400/20 text-sky-300 hover:bg-sky-500/20 hover:border-sky-400/40'
              }`}
            >
              {isCompiling ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Export Live CV (.md)</span>
            </button>

            {/* Download Standard PDF Portfolio */}
            <a
              href={profile.resumeUrl || "https://drive.google.com/file/d/1Xy_Y-U7nbe6V_3Y67x8aZ95tLg-Wp8Hh/view?usp=sharing"}
              target="_blank"
              rel="noopener noreferrer"
              download={profile.resumeUrl?.startsWith('data:') ? `${profile.name.replace(/\s+/g, '_')}_Resume.pdf` : undefined}
              className="font-mono text-[11px] uppercase tracking-wider px-5 py-3 rounded-lg border bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center gap-2 font-bold"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Retrieve Standard PDF</span>
            </a>
          </div>
        </div>

        {/* Console logs output */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-lg p-5 font-mono text-[11px] text-slate-400 flex flex-col justify-between min-h-[160px] relative select-none">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-[9px] text-slate-500 font-bold">
            <span>COMPILATION TERMINAL ROUTER</span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isCompiling ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
              <span>{isCompiling ? 'PACKAGING_DOSSIER' : 'STANDBY'}</span>
            </span>
          </div>

          <div className="space-y-1 max-h-[110px] overflow-y-auto custom-scrollbar flex-1">
            {compileLogs.length === 0 ? (
              <span className="text-slate-600 block italic">Terminal console idle. Trigger Export Live CV to initiate compilation loop...</span>
            ) : (
              compileLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sky-400/80">❯</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>

          {compileSuccess && (
            <div className="flex items-center gap-2 text-emerald-400 border-t border-white/5 pt-2 mt-2 text-[10px] font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>EXPORT COMPLETED // RESUME DOSSIER DOWNLOAD INITIATED SUCCESSFULLY</span>
            </div>
          )}
        </div>
      </div>

      {/* Lower Deck: Profile Info & Social Coordinates */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pt-6">
        <div className="space-y-2">
          <div className="font-display text-lg font-bold text-white tracking-tight">
            {profile.name}
          </div>
          <p className="font-sans text-xs text-slate-500 font-light">
            {profile.role1} • {profile.role2}
          </p>
          <div className="font-mono text-[9px] text-slate-600 uppercase tracking-widest pt-1">
            LOCATION // {profile.location} • EST_2019
          </div>
        </div>

        {/* Network Links */}
        <div className="flex flex-wrap items-center gap-6">
          <a 
            href={profile.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-sky-300 transition-colors font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5"
          >
            <Linkedin className="w-3.5 h-3.5 text-sky-400" />
            <span>LinkedIn</span>
          </a>

          <a 
            href={profile.whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-teal-300 transition-colors font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
            <span>WhatsApp</span>
          </a>

          <a 
            href="mailto:muhamedshafi1899@gmail.com" 
            className="text-slate-400 hover:text-indigo-300 transition-colors font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Email</span>
          </a>

          <div className="text-slate-600 font-mono text-[10px] select-none flex items-center gap-1">
            <Terminal className="w-3 h-3 text-slate-700" />
            <span>SSL_SECURE // LATENCY_12ms</span>
          </div>
        </div>

        <div className="font-mono text-[10px] text-slate-500 flex flex-col items-start md:items-end gap-1">
          <span>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span className="flex items-center gap-1 text-[9px] text-slate-600">
            Engineered with <Heart className="w-2.5 h-2.5 text-red-500/60" /> in UAE.
          </span>
        </div>
      </div>
    </footer>
  );
}
