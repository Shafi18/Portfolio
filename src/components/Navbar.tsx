import { Activity, Terminal, Calendar, Code2 } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onOpenScheduler: () => void;
  onOpenBookings: () => void;
  onOpenCMS: () => void;
  bookingsCount: number;
  brandName?: string;
}

export default function Navbar({ onOpenScheduler, onOpenBookings, onOpenCMS, bookingsCount, brandName }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full bg-slate-950/60 backdrop-blur-xl border-b border-white/5 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-4 flex justify-between items-center w-full">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-sky-500/10 border border-sky-400/30 flex items-center justify-center group-hover:border-sky-400/60 transition-colors">
            <Code2 className="text-sky-300 w-4 h-4" />
          </div>
          <span className="font-display text-lg md:text-xl font-bold tracking-tight text-sky-100 group-hover:text-white transition-colors">
            {brandName || "Shafik Mohamed R"}
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          <a
            className="text-slate-400 hover:text-sky-300 transition-colors font-sans text-xs uppercase tracking-widest font-semibold"
            href="#experience"
          >
            History
          </a>
          <a
            className="text-slate-400 hover:text-sky-300 transition-colors font-sans text-xs uppercase tracking-widest font-semibold"
            href="#pillars"
          >
            Domains
          </a>
          <a
            className="text-slate-400 hover:text-sky-300 transition-colors font-sans text-xs uppercase tracking-widest font-semibold"
            href="#projects"
          >
            Successes
          </a>
          <a
            className="text-slate-400 hover:text-sky-300 transition-colors font-sans text-xs uppercase tracking-widest font-semibold"
            href="#skills"
          >
            Stack
          </a>
        </div>

        <div className="flex items-center gap-4">
          {/* System status node indicator (Hidden button) */}
          <div className="hidden sm:flex flex-col items-end mr-2 text-right">
            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Node Status</span>
            <span className="font-mono text-[10px] text-emerald-500/80 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
              ONLINE
            </span>
          </div>

          {/* Bookings Tracker Button */}
          {bookingsCount > 0 && (
            <button
              onClick={onOpenBookings}
              className="relative flex items-center gap-2 bg-sky-950/40 hover:bg-sky-900/40 border border-sky-500/20 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider text-sky-200 transition-all active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sessions ({bookingsCount})</span>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-sky-400 text-slate-950 text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {bookingsCount}
              </span>
            </button>
          )}

          <button
            onClick={onOpenScheduler}
            className="bg-sky-100 hover:bg-white text-slate-950 px-5 py-2.5 rounded font-sans text-xs font-bold uppercase tracking-wider transition-all active:scale-95 tech-border shadow-lg shadow-sky-500/5 hover:shadow-sky-500/10"
          >
            Initialize Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
