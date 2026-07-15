import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Trash2, Shield, Video, Building } from 'lucide-react';
import { Meeting } from '../types';

interface BookedMeetingsViewProps {
  isOpen: boolean;
  onClose: () => void;
  meetings: Meeting[];
  onCancelMeeting: (id: string) => void;
}

export default function BookedMeetingsView({ isOpen, onClose, meetings, onCancelMeeting }: BookedMeetingsViewProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        ></motion.div>

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-card rounded-xl border border-white/10 shadow-2xl p-6 md:p-8 z-10 flex flex-col space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-900/80">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-400 font-bold">
                SESSION_LEDGER // LIVE
              </span>
              <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                Your Scheduled Strategy Sessions
              </h3>
              <p className="font-sans text-xs text-slate-400 font-light">
                Monitor, configure, or cancel your upcoming consultation appointments with Shafik Mohamed.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-900/60 border border-transparent hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {meetings.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full border border-dashed border-slate-800 flex items-center justify-center text-slate-600 mx-auto">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="font-sans text-sm text-slate-500">No active strategy sessions scheduled.</p>
              </div>
            ) : (
              meetings.map((m) => (
                <div 
                  key={m.id}
                  className="bg-slate-950/50 rounded-xl border border-slate-900/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-800 transition-all text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-sm font-semibold text-white">{m.name}</span>
                      <span className="text-slate-700">•</span>
                      <span className="font-mono text-[10px] text-sky-300 bg-sky-950/40 border border-sky-400/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <Building className="w-2.5 h-2.5" />
                        {m.company}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        {m.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        {m.timeSlot}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-slate-500" />
                        Google Meet
                      </span>
                    </div>

                    <p className="font-sans text-xs text-slate-400 bg-slate-950/80 p-2.5 rounded border border-slate-900/60 leading-relaxed font-light">
                      <strong className="text-slate-500">Target:</strong> {m.goal}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 border-slate-900/50 pt-3 sm:pt-0">
                    <button
                      onClick={() => onCancelMeeting(m.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 px-3 py-2 rounded font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                    
                    <span className="font-mono text-[8px] text-slate-600 block">ID: {m.id.slice(0, 8)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer warning */}
          <div className="pt-4 border-t border-slate-900/80 flex items-center gap-3 font-mono text-[10px] text-slate-500">
            <Shield className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>ALL SESSIONS CORRELATED TO VERIFIED INTENT LOGS AND DISCORD SYSTEM NOTIFICATION TRIGGERS.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
