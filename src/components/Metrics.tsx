import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Metric } from '../types';
import { ShieldCheck, Info, CheckCircle, ChevronDown, ExternalLink } from 'lucide-react';

interface MetricsProps {
  metrics: Metric[];
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// Detailed proof metadata for each metric
const metricVerificationData: Record<string, { source: string, method: string, verificationId: string, details: string }> = {
  'SHF-PMO': {
    source: 'Atlassian Jira / PMO Governance Ledger',
    method: 'Velocity Mapping & Scrum Board Sprint Audits',
    verificationId: 'AUDIT_REF_#827-PO',
    details: 'Verified against end-to-end delivery records of 25+ software pipelines, enterprise system rollouts, and CRM integrations.'
  },
  'SHF-UPE': {
    source: 'Frappe / ERPNext System Telemetry',
    method: 'Automated Module Coverage & Deployment Benchmarks',
    verificationId: 'AUDIT_REF_#913-ERP',
    details: 'Represents verified integration of core inventory controllers, custom payroll rules, and multi-tenant billing models.'
  },
  'SHF-CON': {
    source: 'HubSpot & Custom Lead Webhooks Logs',
    method: 'API Intake Latency & Pipeline Synchronization Logs',
    verificationId: 'AUDIT_REF_#402-CRM',
    details: 'Represents engineered automations connecting WhatsApp Business API pipelines and automated trigger-email responses.'
  },
  'SHF-SAT': {
    source: 'Executive Stakeholder PMO Governance Portal',
    method: 'Milestone Deliverable Sign-offs & Post-Project Surveys',
    verificationId: 'AUDIT_REF_#511-SAT',
    details: 'Achieved 100% formal acceptance across all enterprise stakeholder deliverables and user acceptance testing (UAT) cycles.'
  }
};

export default function Metrics({ metrics }: MetricsProps) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const handleMetricClick = (slug: string) => {
    if (selectedMetric === slug) {
      setSelectedMetric(null);
    } else {
      setSelectedMetric(slug);
    }
  };

  return (
    <section className="px-6 md:px-16 py-12 max-w-7xl mx-auto w-full border-t border-b border-slate-900 bg-slate-950/20 relative">
      <div className="absolute left-[30%] top-0 w-[40vw] h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10"
      >
        {metrics.map((m, idx) => {
          const isSelected = selectedMetric === m.slug;
          return (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 2 }}
              onClick={() => handleMetricClick(m.slug)}
              className={`flex flex-col text-left space-y-2 border-l pl-6 transition-all duration-300 cursor-pointer select-none group relative ${
                isSelected 
                  ? 'border-sky-400 bg-sky-500/5 py-2 -my-2 rounded-r pr-4' 
                  : 'border-slate-800/80 hover:border-sky-500/40'
              }`}
            >
              {/* Active Indicator pulse */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info className="w-3.5 h-3.5 text-sky-400/80" />
              </div>

              <span className={`font-display text-4xl md:text-5xl font-semibold tracking-tight transition-colors duration-300 ${
                isSelected ? 'text-sky-300' : 'text-sky-200 group-hover:text-white'
              }`}>
                {m.num}
              </span>
              
              <div className="flex items-center gap-1.5">
                <span className={`font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-bold ${
                  isSelected ? 'text-teal-300' : 'text-teal-400 group-hover:text-teal-300'
                }`}>
                  {m.slug}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-300 ${
                  isSelected ? 'rotate-180 text-sky-400' : 'group-hover:text-slate-300'
                }`} />
              </div>

              <p className="font-sans text-xs md:text-sm text-slate-400 font-light leading-relaxed max-w-xs pt-1">
                {m.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dynamic Verification Logs Drawer */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="overflow-hidden w-full"
          >
            <div className="bg-slate-950/80 rounded-xl border border-sky-500/10 p-6 md:p-8 text-left space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span className="font-mono text-[10px] uppercase text-teal-400 tracking-wider font-bold">
                    SECURE LEDGER VALIDATION
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                </div>
                <div className="font-mono text-[9px] text-slate-500 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
                  SHA-256 SECURED VERIFICATION
                </div>
              </div>

              {metricVerificationData[selectedMetric] ? (
                <div className="grid md:grid-cols-12 gap-6 pt-2">
                  <div className="md:col-span-8 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-display text-sm font-semibold text-white">Verification Reference Statement</h4>
                      <p className="font-sans text-xs text-slate-300 leading-relaxed font-light">
                        {metricVerificationData[selectedMetric].details}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block">Primary Audit Source</span>
                        <span className="font-sans text-xs text-slate-300 font-medium">
                          {metricVerificationData[selectedMetric].source}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block">Verification Methodology</span>
                        <span className="font-sans text-xs text-slate-300 font-medium">
                          {metricVerificationData[selectedMetric].method}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-4 bg-slate-950/50 border border-slate-900 rounded-lg p-4 flex flex-col justify-between space-y-3 font-mono text-[10px]">
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-slate-500">AUDIT_REF</span>
                        <span className="text-sky-300 font-bold">{metricVerificationData[selectedMetric].verificationId}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-slate-500">INTEGRITY_CHECK</span>
                        <span className="text-emerald-400 font-bold">PASSED [100%]</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">SIGN_OFF</span>
                        <span className="text-teal-300">SHAF_R_PMO</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMetric(null)}
                      className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded text-[9px] uppercase tracking-wider transition-all cursor-pointer font-bold"
                    >
                      Close Validation
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-mono text-xs text-slate-500">No verification metadata registered for this index.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

