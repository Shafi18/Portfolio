import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, ChevronRight, CheckCircle, Shield, ExternalLink } from 'lucide-react';
import { availableTimeSlots } from '../data';
import { Meeting } from '../types';

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'location' | 'host'>) => void;
  useCalendly?: boolean;
  calendlyUrl?: string;
}

// Generate the next 10 business days (Monday-Friday) starting from tomorrow
function getNextBusinessDays(): { dateString: string; displayDay: string; displayDate: string }[] {
  const days: { dateString: string; displayDay: string; displayDate: string }[] = [];
  let current = new Date();
  
  // Start from tomorrow
  while (days.length < 10) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    // 0 = Sunday, 6 = Saturday. Only add business days (1-5)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateString = current.toISOString().split('T')[0];
      const displayDay = current.toLocaleDateString('en-US', { weekday: 'short' });
      const displayDate = current.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      days.push({ dateString, displayDay, displayDate });
    }
  }
  return days;
}

export default function SchedulerModal({ isOpen, onClose, onConfirm, useCalendly, calendlyUrl }: SchedulerModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const businessDays = getNextBusinessDays();

  if (!isOpen) return null;

  if (useCalendly && calendlyUrl) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          ></motion.div>

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-4xl h-[85vh] overflow-hidden glass-card rounded-xl border border-white/10 shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-900/80">
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-400 font-bold">
                  EXTERNAL SCHEDULER ACTIVE
                </span>
                <h3 className="font-display text-xl font-bold text-white tracking-tight">
                  Calendly Synchronization Pipeline
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-slate-900/60 border border-transparent hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded view */}
            <div className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
              <div className="bg-slate-900/40 border-b border-slate-900/80 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    Direct routing to <span className="text-white">{calendlyUrl}</span>
                  </span>
                </div>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-100 hover:bg-white text-slate-950 font-sans text-xs font-bold uppercase tracking-wider px-4 py-2 rounded flex items-center gap-1.5 transition-all active:scale-95 text-center justify-center cursor-pointer"
                >
                  <span>Open in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex-1 relative">
                {/* Fallback loading status */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 pointer-events-none z-0">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans text-sm font-semibold text-white">Loading Calendly Module...</h4>
                    <p className="font-sans text-xs text-slate-500 max-w-sm">
                      If the booking calendar does not load below, please click "Open in New Tab" to access the direct booking window.
                    </p>
                  </div>
                </div>

                <iframe
                  src={calendlyUrl}
                  width="100%"
                  height="100%"
                  className="relative z-10 w-full h-full bg-transparent border-none"
                  title="Calendly Booking Widget"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setFormError('Please select a date.');
      return;
    }
    if (!selectedTime) {
      setFormError('Please select a time slot.');
      return;
    }
    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid business email.');
      return;
    }
    if (!company.trim()) {
      setFormError('Please enter your company/organization.');
      return;
    }
    if (!goal.trim()) {
      setFormError('Please describe your transformation target.');
      return;
    }

    setFormError('');
    onConfirm({
      name,
      email,
      company,
      date: selectedDate,
      timeSlot: selectedTime,
      goal,
    });
  };

  const selectedDateObject = businessDays.find(d => d.dateString === selectedDate);
  const formattedDateString = selectedDateObject 
    ? `${selectedDateObject.displayDay}, ${selectedDateObject.displayDate}`
    : '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        ></motion.div>

        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-xl border border-white/10 shadow-2xl p-6 md:p-10 text-left z-10 flex flex-col space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-900/80">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-sky-400 font-bold">
                TRANSFORMATION PROTOCOL
              </span>
              <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                Initialize Strategy Session
              </h3>
              <p className="font-sans text-xs text-slate-400 font-light">
                Secure a focused consultation session with Mohamed Shafi to map your system goals.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-900/60 border border-transparent hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded font-mono text-xs">
                SYSTEM ERROR // {formError}
              </div>
            )}

            {/* Step 1: Select Date */}
            <div className="space-y-3">
              <label className="font-mono text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Step 1: Select Session Date</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {businessDays.map((d) => {
                  const isSelected = selectedDate === d.dateString;
                  return (
                    <button
                      key={d.dateString}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d.dateString);
                        setFormError('');
                      }}
                      className={`py-3 px-2 rounded border font-mono text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/10 border-sky-400 text-sky-300'
                          : 'bg-slate-950/40 border-slate-900/80 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider text-slate-500">{d.displayDay}</span>
                      <span className="text-sm font-semibold tracking-tight mt-0.5">{d.displayDate}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Time Slot */}
            {selectedDate && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <label className="font-mono text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Step 2: Select Time Slot (GST / UAE Standard Time)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {availableTimeSlots.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setSelectedTime(slot);
                          setFormError('');
                        }}
                        className={`py-2.5 px-3 rounded border font-mono text-xs text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-500/10 border-teal-400 text-teal-300 shadow-sm shadow-teal-500/5'
                            : 'bg-slate-950/40 border-slate-900/80 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Enter Details */}
            {selectedTime && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="w-full h-px bg-slate-900"></div>
                <div className="font-mono text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>Step 3: Business Information</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Corporate Representative</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-900 focus:border-sky-400/50 rounded p-3 text-slate-100 font-sans text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Corporate Email</label>
                    <input
                      type="email"
                      placeholder="e.g. s.jenkins@enterprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-900 focus:border-sky-400/50 rounded p-3 text-slate-100 font-sans text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Logistics UAE"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-900 focus:border-sky-400/50 rounded p-3 text-slate-100 font-sans text-sm outline-none transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Primary Transformation Target / Goal</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state your current process bottlenecks, digital targets, or project scope."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-900 focus:border-sky-400/50 rounded p-3 text-slate-100 font-sans text-sm outline-none transition-colors resize-none"
                    required
                  ></textarea>
                </div>
              </motion.div>
            )}

            {/* Actions Footer */}
            {selectedTime && (
              <div className="pt-4 border-t border-slate-900/80 flex items-center justify-between">
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Scheduled Window</span>
                  <span className="font-mono text-xs text-sky-300 font-semibold">{formattedDateString} @ {selectedTime.split(' (')[0]}</span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-sky-100 hover:bg-white text-slate-950 font-bold font-sans text-xs uppercase tracking-wider px-6 py-3.5 rounded flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer tech-border shadow-xl shadow-sky-500/5"
                >
                  <span>Confirm Strategy Session</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
