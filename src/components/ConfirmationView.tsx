import { motion } from 'motion/react';
import { Check, Calendar, Clock, Video, User, Download, ArrowLeft, ShieldAlert, Mail, Linkedin, MessageSquare } from 'lucide-react';
import { Meeting, Profile } from '../types';

interface ConfirmationViewProps {
  meeting: Meeting;
  onReturnHome: () => void;
  acknowledgmentTemplate?: string;
  profile?: Profile;
}

export default function ConfirmationView({ meeting, onReturnHome, acknowledgmentTemplate, profile }: ConfirmationViewProps) {
  // Format Date for premium display: Thursday, June 12, 2024
  const formatDateForDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Replace placeholders dynamically
  const getPopulatedTemplate = (templateText: string, mtg: Meeting) => {
    if (!templateText) return '';
    return templateText
      .replace(/\{\{NAME\}\}/g, mtg.name)
      .replace(/\{\{DATE\}\}/g, formatDateForDisplay(mtg.date))
      .replace(/\{\{TIME\}\}/g, mtg.timeSlot)
      .replace(/\{\{COMPANY\}\}/g, mtg.company)
      .replace(/\{\{GOAL\}\}/g, mtg.goal);
  };

  const handleDownloadICS = () => {
    try {
      const dateClean = meeting.date.replace(/-/g, '');
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Shafik Mohamed R//Portfolio Scheduler//EN',
        'BEGIN:VEVENT',
        `UID:${meeting.id}`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART;TZID=Asia/Dubai:${dateClean}T140000`, // Default/mock times corresponding to choice
        `DTEND;TZID=Asia/Dubai:${dateClean}T143000`,
        'SUMMARY:Strategy Session with Shafik Mohamed R',
        `DESCRIPTION:Digital Transformation Roadmap Consultation.\\nCorporate Representative: ${meeting.name}\\nCompany: ${meeting.company}\\nConsultation Target: ${meeting.goal}`,
        'LOCATION:Video Link (Google Meet)',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `strategy-session-${meeting.date}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Error creating ICS download:", e);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-6 bg-slate-950 overflow-hidden">
      {/* Immersive glow background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-xl glass-card rounded-2xl border border-white/10 p-8 md:p-12 text-center space-y-8 shadow-2xl"
      >
        {/* Animated Checkmark Circle */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 checkmark-anim shadow-[0_0_30px_rgba(52,211,153,0.2)]"
          >
            <Check className="w-10 h-10 stroke-[2.5]" />
          </motion.div>
        </div>

        {/* Text Headers */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 font-mono text-[9px] uppercase tracking-[0.2em] font-bold mx-auto">
            <span>TRANSMISSION CONFIRMED</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Thank You for Reaching Out!
          </h2>
          
          <p className="font-sans text-sm md:text-base text-sky-200/90 leading-relaxed font-light max-w-md mx-auto">
            Looking forward to connect with you! Your strategy session has been locked into the pipeline.
          </p>

          <p className="font-sans text-xs text-slate-400 leading-relaxed font-light max-w-md mx-auto">
            A calendar invitation and confirmation packet have been generated and dispatched to your inbox.
          </p>

          {/* Connected Social & Email Coordinates */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={profile?.linkedinUrl || "https://www.linkedin.com/in/mohamedshafi97/"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-300 hover:bg-sky-500/20 hover:border-sky-400/40 transition-all font-mono text-[10px] uppercase tracking-wider font-bold"
            >
              <Linkedin className="w-3.5 h-3.5 text-sky-400" />
              <span>LinkedIn</span>
            </a>

            <a
              href={profile?.whatsappUrl || "https://wa.me/971501234567"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-500/10 border border-teal-400/20 text-teal-300 hover:bg-teal-500/20 hover:border-teal-400/40 transition-all font-mono text-[10px] uppercase tracking-wider font-bold"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
              <span>WhatsApp</span>
            </a>

            <a
              href="mailto:muhamedshafi1899@gmail.com"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400/40 transition-all font-mono text-[10px] uppercase tracking-wider font-bold"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Email Contact</span>
            </a>
          </div>
        </div>

        {/* Bento Grid Confirmation Details Card */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-900/80 p-6 md:p-8 space-y-5 text-left font-sans">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded bg-sky-500/5 border border-sky-400/20 flex items-center justify-center text-sky-300 flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Date</span>
              <span className="text-sm font-semibold text-white">{formatDateForDisplay(meeting.date)}</span>
            </div>
          </div>

          <div className="flex items-start gap-4 border-t border-slate-900/60 pt-4">
            <div className="w-8 h-8 rounded bg-teal-500/5 border border-teal-400/20 flex items-center justify-center text-teal-300 flex-shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Time</span>
              <span className="text-sm font-semibold text-white">{meeting.timeSlot}</span>
            </div>
          </div>

          <div className="flex items-start gap-4 border-t border-slate-900/60 pt-4">
            <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 mt-0.5">
              <Video className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Location</span>
              <span className="text-sm font-semibold text-white">{meeting.location}</span>
            </div>
          </div>

          <div className="flex items-start gap-4 border-t border-slate-900/60 pt-4">
            <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 mt-0.5">
              <User className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Host</span>
              <span className="text-sm font-semibold text-white">{meeting.host}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Acknowledgment Email Preview */}
        {acknowledgmentTemplate && (
          <div className="bg-slate-950/80 rounded-xl border border-white/5 p-5 md:p-6 text-left font-sans space-y-3.5 shadow-inner">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-[10px] uppercase text-sky-400 tracking-wider font-bold">System Acknowledgment Issued</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="space-y-1 font-mono text-[9px] text-slate-500 border-b border-white/5 pb-2.5">
              <div><span className="text-slate-400 font-bold">FROM:</span> {meeting.host}</div>
              <div><span className="text-slate-400 font-bold">TO:</span> {meeting.name} &lt;{meeting.email}&gt;</div>
              <div><span className="text-slate-400 font-bold">SUBJECT:</span> Strategy Session Confirmation // {meeting.company}</div>
            </div>
            <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-light font-sans pt-1 font-sans">
              {getPopulatedTemplate(acknowledgmentTemplate, meeting)}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleDownloadICS}
            className="w-full sm:flex-1 bg-sky-100 hover:bg-white text-slate-950 font-bold font-sans text-xs uppercase tracking-wider py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer tech-border shadow-lg shadow-sky-500/5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={onReturnHome}
            className="w-full sm:flex-1 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold font-sans text-xs uppercase tracking-wider py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>
        </div>

        <div className="pt-2">
          <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest block">
            ID_REF: {meeting.id} // SECURE_SSL_VERIFIED
          </span>
        </div>
      </motion.div>
    </div>
  );
}
