import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import Domains from './components/Domains';
import Timeline from './components/Timeline';
import SuccessStories from './components/SuccessStories';
import TechArraySection from './components/TechArraySection';
import SchedulerModal from './components/SchedulerModal';
import ConfirmationView from './components/ConfirmationView';
import BookedMeetingsView from './components/BookedMeetingsView';
import Footer from './components/Footer';
import CMSPanel from './components/CMSPanel';
import { Meeting, PortfolioData } from './types';
import { defaultPortfolioData } from './data';
import { Calendar, HelpCircle, Sparkles, Terminal } from 'lucide-react';
import { initGA, trackEvent, trackPageView } from './lib/gtag';

export default function App() {
  const [activeView, setActiveView] = useState<'portfolio' | 'confirmed'>('portfolio');
  const [showScheduler, setShowScheduler] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showCMS, setShowCMS] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [latestBookedMeeting, setLatestBookedMeeting] = useState<Meeting | null>(null);

  // Dynamic portfolio content state
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem('shafik_portfolio_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading portfolio data from localStorage', e);
    }
    return defaultPortfolioData;
  });

  // Dynamically synchronize SEO Head metadata & Google Analytics
  useEffect(() => {
    // 1. Google Analytics Dynamic Init
    if (portfolioData.profile.gaMeasurementId) {
      initGA(portfolioData.profile.gaMeasurementId);
    }

    // 2. SEO Document Title update
    if (portfolioData.profile.name) {
      const displayTitle = `${portfolioData.profile.name} | ${portfolioData.profile.role1 || 'Portfolio'}`;
      document.title = displayTitle;

      // Update Open Graph and Twitter Card titles as well
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', displayTitle);
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute('content', displayTitle);
    }

    // 3. SEO Description update
    if (portfolioData.profile.seoDescription) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', portfolioData.profile.seoDescription);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', portfolioData.profile.seoDescription);
      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute('content', portfolioData.profile.seoDescription);
    }

    // 4. SEO Keywords update
    if (portfolioData.profile.seoKeywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute('content', portfolioData.profile.seoKeywords);
    }
  }, [portfolioData.profile]);

  // Track page path / home view on mount
  useEffect(() => {
    trackPageView('/');
  }, []);

  // Secret CMS door listener: open console when URL path, hash or query matches /sha-fi18
  useEffect(() => {
    const detectSecretActivation = () => {
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;
      const currentSearch = window.location.search;

      if (
        currentPath.includes('sha-fi18') ||
        currentHash.includes('sha-fi18') ||
        currentSearch.includes('sha-fi18')
      ) {
        setShowCMS(true);
        // Clean the URL silently so the user does not see it persistently in the address bar
        try {
          window.history.replaceState(null, '', '/');
        } catch (err) {
          console.warn('URL clean reset bypassed:', err);
        }
      }
    };

    // Run check on initial load/mount
    detectSecretActivation();

    // Attach runtime navigation/hash observers
    window.addEventListener('popstate', detectSecretActivation);
    window.addEventListener('hashchange', detectSecretActivation);

    return () => {
      window.removeEventListener('popstate', detectSecretActivation);
      window.removeEventListener('hashchange', detectSecretActivation);
    };
  }, []);

  // Save portfolio helper
  const handleUpdatePortfolioData = (newData: PortfolioData) => {
    setPortfolioData(newData);
    try {
      localStorage.setItem('shafik_portfolio_data', JSON.stringify(newData));
    } catch (e) {
      console.error('Error writing portfolio data to localStorage', e);
    }
  };

  // Load meetings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('shafik_meetings');
      if (saved) {
        setMeetings(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
  }, []);


  const handleOpenScheduler = () => {
    trackEvent({ action: 'view_scheduler', category: 'Engagement', label: 'Scheduler Modal Opened' });
    setShowScheduler(true);
  };

  const handleOpenCMS = () => {
    trackEvent({ action: 'view_cms', category: 'System', label: 'CMS Panel Opened' });
    setShowCMS(true);
  };

  // Save meetings helper
  const saveMeetings = (updated: Meeting[]) => {
    setMeetings(updated);
    try {
      localStorage.setItem('shafik_meetings', JSON.stringify(updated));
    } catch (e) {
      console.error('Error writing localStorage', e);
    }
  };

  const handleConfirmMeeting = (meetingInput: Omit<Meeting, 'id' | 'createdAt' | 'location' | 'host'>) => {
    const newMeeting: Meeting = {
      ...meetingInput,
      id: `MS-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      location: 'Video Link (Google Meet)',
      host: 'Mohamed Shafi'
    };

    const updatedList = [newMeeting, ...meetings];
    saveMeetings(updatedList);
    setLatestBookedMeeting(newMeeting);
    setShowScheduler(false);
    setActiveView('confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track conversions as standard Lead event in GA4
    trackEvent({
      action: 'generate_lead',
      category: 'Engagement',
      label: 'Strategy Session Scheduled',
      value: 1,
      company: newMeeting.company,
      goal: newMeeting.goal
    });
  };

  const handleCancelMeeting = (id: string) => {
    const meetingToCancel = meetings.find(m => m.id === id);
    const updated = meetings.filter(m => m.id !== id);
    saveMeetings(updated);

    // Track cancellation event
    trackEvent({
      action: 'cancel_lead',
      category: 'Engagement',
      label: 'Strategy Session Cancelled',
      value: 0,
      company: meetingToCancel?.company || 'Unknown'
    });
  };

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-on-surface font-sans selection:bg-sky-500/20 selection:text-sky-200">
      
      {/* Decorative ambient backdrop details */}
      <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-sky-950/20 to-transparent pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {activeView === 'confirmed' && latestBookedMeeting ? (
          <motion.div
            key="confirmed-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ConfirmationView 
              meeting={latestBookedMeeting} 
              acknowledgmentTemplate={portfolioData.profile.acknowledgmentTemplate}
              profile={portfolioData.profile}
              onReturnHome={() => {
                setActiveView('portfolio');
                setLatestBookedMeeting(null);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="portfolio-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            {/* Top Navigation */}
            <Navbar 
              onOpenScheduler={handleOpenScheduler}
              onOpenBookings={() => setShowBookings(true)}
              onOpenCMS={handleOpenCMS}
              bookingsCount={meetings.length}
              brandName={portfolioData.profile.name}
            />

            {/* Sections */}
            <main className="flex-1 w-full flex flex-col">
              <Hero 
                profile={portfolioData.profile} 
                onOpenScheduler={handleOpenScheduler} 
              />
              <Metrics metrics={portfolioData.metrics} />
              <Domains />
              <Timeline milestones={portfolioData.milestones} />
              <SuccessStories successStories={portfolioData.successStories} />
              <TechArraySection techArray={portfolioData.techArray} />
              
              {/* Strategic CTA Section */}
              <section className="relative px-6 md:px-16 py-28 max-w-7xl mx-auto w-full text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="relative glass-card border border-white/10 rounded-2xl p-10 md:p-16 max-w-4xl mx-auto space-y-8 flex flex-col items-center">
                  <div className="w-12 h-12 rounded bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-300">
                    <Sparkles className="w-6 h-6 icon-glow" />
                  </div>

                  <div className="space-y-4 text-center max-w-2xl">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-400 font-bold">
                      TRANSFORMATION ROADMAP // INITIATION
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-white tracking-tight">
                      Secure Your Transformation Roadmap Today
                    </h2>
                    <p className="font-sans text-sm md:text-base text-slate-400 font-light leading-relaxed">
                      Initialize a dedicated strategy session with {portfolioData.profile.name}. Map out operational deficiencies, automate reporting pipelines, and build a high-velocity development model.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenScheduler}
                    className="bg-sky-100 hover:bg-white text-slate-950 font-sans text-xs font-bold uppercase tracking-[0.2em] px-8 py-5 rounded transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-xl shadow-sky-500/5 hover:shadow-sky-500/10 cursor-pointer tech-border"
                  >
                    Initialize Strategy Session
                  </button>
                  
                  <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">
                    SYSTEMS ARCHITECTURE & GOVERNANCE OUTCOME COMMITMENT
                  </span>
                </div>
              </section>
            </main>

            {/* Footer */}
            <Footer 
              profile={portfolioData.profile} 
              onOpenCMS={handleOpenCMS} 
              milestones={portfolioData.milestones}
              techArray={portfolioData.techArray}
            />

            {/* Floating Action Badge / Calendly Trigger */}
            <div className="fixed bottom-6 right-6 z-40">
              <button
                onClick={handleOpenScheduler}
                className="w-14 h-14 rounded-full bg-sky-100 text-slate-950 flex items-center justify-center shadow-2xl hover:bg-white active:scale-95 transition-all cursor-pointer tech-border group"
                title="Book Strategy Session"
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Form Dialog */}
      <SchedulerModal 
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
        onConfirm={handleConfirmMeeting}
        useCalendly={portfolioData.profile.useCalendly}
        calendlyUrl={portfolioData.profile.calendlyUrl}
      />

      {/* Bookings Ledger Dialog */}
      <BookedMeetingsView 
        isOpen={showBookings}
        onClose={() => setShowBookings(false)}
        meetings={meetings}
        onCancelMeeting={handleCancelMeeting}
      />

      {/* Dynamic Systems CMS Panel Dialog */}
      <CMSPanel
        isOpen={showCMS}
        onClose={() => setShowCMS(false)}
        currentData={portfolioData}
        onUpdateData={handleUpdatePortfolioData}
        meetings={meetings}
        onCancelMeeting={handleCancelMeeting}
      />
    </div>
  );
}
