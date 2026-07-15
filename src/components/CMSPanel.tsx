import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Save, Plus, Trash2, Settings, Terminal, Lock, Unlock, 
  Download, Upload, RotateCcw, Briefcase, Globe, 
  Check, Edit, User, Image, ArrowUp, ArrowDown, Sparkles, 
  Linkedin, Calendar, Search, Layers, RefreshCw, AlertCircle,
  Building, MapPin, AlignLeft, ShieldCheck, Mail, MessageSquare, PlusCircle,
  Clock, Eye, EyeOff, Cpu, ShieldAlert
} from 'lucide-react';
import { Profile, Metric, CareerMilestone, SuccessStory, TechCategory, PortfolioData, Meeting } from '../types';
import { defaultPortfolioData } from '../data';

interface CMSPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: PortfolioData;
  onUpdateData: (newData: PortfolioData) => void;
  meetings: Meeting[];
  onCancelMeeting: (id: string) => void;
}

type CMSTab = 'profile' | 'metrics' | 'milestones' | 'stories' | 'tech' | 'bookings' | 'system';

export default function CMSPanel({ 
  isOpen, 
  onClose, 
  currentData, 
  onUpdateData, 
  meetings, 
  onCancelMeeting 
}: CMSPanelProps) {
  // Authorization State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginProgress, setLoginProgress] = useState<number>(0);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<CMSTab>('profile');

  // Working States (Deep Copy of Current Data to edit without immediately saving or saving instantly)
  const [profile, setProfile] = useState<Profile>({ ...currentData.profile });
  const [metrics, setMetrics] = useState<Metric[]>([...currentData.metrics.map(m => ({ ...m }))]);
  const [milestones, setMilestones] = useState<CareerMilestone[]>([...currentData.milestones.map(m => ({ ...m, highlights: m.highlights ? [...m.highlights] : [] }))]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([...currentData.successStories.map(s => ({ ...s }))]);
  const [techArray, setTechArray] = useState<TechCategory[]>([...currentData.techArray.map(t => ({ ...t, items: [...t.items] }))]);

  // Search filter for bookings
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Save Indicator
  const [saveStatus, setSaveStatus] = useState<'idle' | 'unsaved' | 'saving' | 'saved'>('idle');

  // PDF Upload Indicator
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Trigger Auth when already authenticated in browser
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('shafik_cms_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync state if currentData updates externally
  useEffect(() => {
    if (saveStatus !== 'unsaved') {
      setProfile({ ...currentData.profile });
      setMetrics([...currentData.metrics.map(m => ({ ...m }))]);
      setMilestones([...currentData.milestones.map(m => ({ ...m, highlights: m.highlights ? [...m.highlights] : [] }))]);
      setSuccessStories([...currentData.successStories.map(s => ({ ...s }))]);
      setTechArray([...currentData.techArray.map(t => ({ ...t, items: [...t.items] }))]);
    }
  }, [currentData]);

  if (!isOpen) return null;

  // Passcode verification
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const userClean = username.toLowerCase().trim();
    const passClean = passcode.trim();

    if (!userClean) {
      setAuthError('REQUIRED_FIELD // USERNAME IS REQUIRED');
      return;
    }
    if (!passClean) {
      setAuthError('REQUIRED_FIELD // SECURE AUTHORIZATION KEY IS REQUIRED');
      return;
    }

    // Accept common admin usernames and passwords
    const isValidUser = ['admin', 'shafik', 'shafi', 'sha-fi18'].includes(userClean);
    const isValidPass = ['admin', 'shafik', 'shafi18'].includes(passClean.toLowerCase());

    if (isValidUser && isValidPass) {
      setIsLoggingIn(true);
      setLoginProgress(10);
      
      const interval = setInterval(() => {
        setLoginProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsAuthenticated(true);
            setIsLoggingIn(false);
            setAuthError('');
            sessionStorage.setItem('shafik_cms_auth', 'true');
            return 100;
          }
          return prev + 18;
        });
      }, 120);
    } else {
      setAuthError('INVALID CREDENTIALS // SYSTEM CONTROL ACCESS DENIED');
    }
  };

  const handleDeauthenticate = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('shafik_cms_auth');
    setPasscode('');
    setUsername('');
    setLoginProgress(0);
  };

  // Safe save handler
  const triggerSave = (
    updatedProfile = profile,
    updatedMetrics = metrics,
    updatedMilestones = milestones,
    updatedStories = successStories,
    updatedTech = techArray
  ) => {
    setSaveStatus('saving');
    
    // Construct the new integrated object
    const newPayload: PortfolioData = {
      profile: updatedProfile,
      metrics: updatedMetrics,
      milestones: updatedMilestones,
      successStories: updatedStories,
      techArray: updatedTech
    };

    onUpdateData(newPayload);
    
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  // Profile fields change handler
  const handleProfileChange = (field: keyof Profile, value: any) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    setSaveStatus('unsaved');
    triggerSave(updated);
  };

  const handlePdfUpload = (file: File) => {
    setUploadError('');
    setUploadSuccess(false);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('REJECTED: File type must be application/pdf.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setUploadError('REJECTED: File exceeds maximum client DB limit of 3MB. Please compress the PDF first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        handleProfileChange('resumeUrl', base64);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 5000);
      }
    };
    reader.onerror = () => {
      setUploadError('READ_ERROR: Failed to process document payload.');
    };
    reader.readAsDataURL(file);
  };

  // Metrics Change handler
  const handleMetricChange = (index: number, field: keyof Metric, value: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: value };
    setMetrics(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, updated);
  };

  // Milestone Add, Edit, Remove, Reorder
  const handleAddMilestone = () => {
    const newItem: CareerMilestone = {
      id: `m-${Date.now()}`,
      period: '2026 – PRESENT',
      role: 'New Lead Role Title',
      company: 'Enterprise Group LLC',
      location: 'Dubai, UAE',
      color: 'outline',
      highlights: ['Added key objective outcome benchmark.'],
      description: ''
    };
    const updated = [newItem, ...milestones];
    setMilestones(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, updated);
  };

  const handleEditMilestone = (index: number, field: keyof CareerMilestone, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, updated);
  };

  const handleMilestoneHighlightChange = (mIndex: number, hIndex: number, value: string) => {
    const updated = [...milestones];
    const highlights = updated[mIndex].highlights ? [...updated[mIndex].highlights!] : [];
    highlights[hIndex] = value;
    updated[mIndex] = { ...updated[mIndex], highlights };
    setMilestones(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, updated);
  };

  const handleAddMilestoneHighlight = (mIndex: number) => {
    const updated = [...milestones];
    const highlights = updated[mIndex].highlights ? [...updated[mIndex].highlights!] : [];
    highlights.push('New system delivery metric achieved.');
    updated[mIndex] = { ...updated[mIndex], highlights };
    setMilestones(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, updated);
  };

  const handleRemoveMilestoneHighlight = (mIndex: number, hIndex: number) => {
    const updated = [...milestones];
    const highlights = updated[mIndex].highlights ? [...updated[mIndex].highlights!] : [];
    highlights.splice(hIndex, 1);
    updated[mIndex] = { ...updated[mIndex], highlights };
    setMilestones(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, updated);
  };

  const handleRemoveMilestone = (index: number) => {
    const updated = milestones.filter((_, i) => i !== index);
    setMilestones(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, updated);
  };

  const handleMoveMilestone = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === milestones.length - 1) return;
    
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...milestones];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    
    setMilestones(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, updated);
  };

  // Success Stories handlers
  const handleAddStory = () => {
    const newItem: SuccessStory = {
      id: `s-${Date.now()}`,
      title: 'Enterprise ERP Implementation',
      category: 'ENTERPRISE ERP',
      tech: 'Frappe / ERPNext / Change Management',
      description: 'Engineered clean data migration framework delivering full system visibility.',
      iconName: 'ERP'
    };
    const updated = [...successStories, newItem];
    setSuccessStories(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, milestones, updated);
  };

  const handleEditStory = (index: number, field: keyof SuccessStory, value: any) => {
    const updated = [...successStories];
    updated[index] = { ...updated[index], [field]: value };
    setSuccessStories(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, milestones, updated);
  };

  const handleRemoveStory = (index: number) => {
    const updated = successStories.filter((_, i) => i !== index);
    setSuccessStories(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, milestones, updated);
  };

  const handleMoveStory = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === successStories.length - 1) return;
    
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...successStories];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    
    setSuccessStories(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, milestones, updated);
  };

  // Tech array handlers
  const handleEditTechCategoryTitle = (catIndex: number, newTitle: string) => {
    const updated = [...techArray];
    updated[catIndex] = { ...updated[catIndex], title: newTitle };
    setTechArray(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, milestones, successStories, updated);
  };

  const handleEditTechItem = (catIndex: number, itemIndex: number, newValue: string) => {
    const updated = [...techArray];
    const items = [...updated[catIndex].items];
    items[itemIndex] = newValue;
    updated[catIndex] = { ...updated[catIndex], items };
    setTechArray(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, milestones, successStories, updated);
  };

  const handleAddTechItem = (catIndex: number) => {
    const updated = [...techArray];
    const items = [...updated[catIndex].items, 'New Toolset Node'];
    updated[catIndex] = { ...updated[catIndex], items };
    setTechArray(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, milestones, successStories, updated);
  };

  const handleRemoveTechItem = (catIndex: number, itemIndex: number) => {
    const updated = [...techArray];
    const items = [...updated[catIndex].items];
    items.splice(itemIndex, 1);
    updated[catIndex] = { ...updated[catIndex], items };
    setTechArray(updated);
    setSaveStatus('unsaved');
    triggerSave(profile, metrics, milestones, successStories, updated);
  };

  // Factory reset
  const handleFactoryReset = () => {
    if (confirm('Are you absolutely sure you want to revert all content changes to factory defaults? Your custom profile edits will be cleared.')) {
      setProfile({ ...defaultPortfolioData.profile });
      setMetrics([...defaultPortfolioData.metrics.map(m => ({ ...m }))]);
      setMilestones([...defaultPortfolioData.milestones.map(m => ({ ...m, highlights: m.highlights ? [...m.highlights] : [] }))]);
      setSuccessStories([...defaultPortfolioData.successStories.map(s => ({ ...s }))]);
      setTechArray([...defaultPortfolioData.techArray.map(t => ({ ...t, items: [...t.items] }))]);
      
      onUpdateData(defaultPortfolioData);
      setSaveStatus('saved');
      alert('Content reset successful. Local state refreshed.');
    }
  };

  // Download Backup JSON
  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        profile,
        metrics,
        milestones,
        successStories,
        techArray
      }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `portfolio-cms-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.removeChild(downloadAnchor);
    } catch (e) {
      alert('Failed to compile data payload backup.');
    }
  };

  // Upload JSON File
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile && parsed.milestones && parsed.successStories && parsed.techArray) {
            setProfile(parsed.profile);
            setMetrics(parsed.metrics || defaultPortfolioData.metrics);
            setMilestones(parsed.milestones);
            setSuccessStories(parsed.successStories);
            setTechArray(parsed.techArray);
            onUpdateData(parsed);
            setSaveStatus('saved');
            alert('Custom backup restoration successful. CMS memory updated.');
          } else {
            alert('Error: Selected JSON file does not comply with Schema guidelines.');
          }
        } catch (err) {
          alert('Error parsing uploaded backup document.');
        }
      };
    }
  };

  // Filter strategy meetings
  const filteredMeetings = meetings.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.goal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
        {/* Backdrop glass */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
        ></motion.div>

        {/* Outer Frame Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full h-full md:max-w-6xl md:h-[92vh] glass-card md:rounded-2xl border-0 md:border border-white/10 shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header Bar */}
          <div className="bg-slate-950/90 border-b border-slate-900/80 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
                <Settings className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="text-left">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-sky-400 font-bold block">
                  INTEGRATED CONTROL CENTRE
                </span>
                <h2 className="font-display text-lg font-bold text-white leading-tight">
                  Systems CMS Console
                </h2>
              </div>
            </div>

            {/* Real-time Status Badges */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-900 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                  CMS_ACTIVE_OK
                </span>
              </div>

              {/* Saved feedback */}
              <div className="font-mono text-[10px] uppercase tracking-wider">
                {saveStatus === 'saving' && (
                  <span className="text-sky-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Auto_Saving...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    <Check className="w-3 h-3" /> Live_Sync_Ok
                  </span>
                )}
                {saveStatus === 'unsaved' && (
                  <span className="text-amber-400 animate-pulse">
                    ● Modified_Draft
                  </span>
                )}
                {saveStatus === 'idle' && (
                  <span className="text-slate-500">
                    ● Stable_State
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secure Gate */}
          {!isAuthenticated ? (
            <div className="flex-1 bg-slate-950 flex flex-col md:grid md:grid-cols-12 overflow-hidden">
              {/* Left Side: System Metrics & Cyber Dashboard (Visible on Desktop) */}
              <div className="hidden md:flex md:col-span-5 border-r border-slate-900/60 p-8 flex-col justify-between bg-slate-950/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="space-y-6 relative z-10 text-left">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-sky-400 animate-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500 font-bold">SHA-FI18 // CORE_NODE</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                      Administrative Control Gate
                    </h3>
                    <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
                      Authorized operator terminal to manage live profiles, resume payloads, meeting ledgers, and metrics indices.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-4">
                    <div className="border-l-2 border-sky-500/30 pl-3.5 space-y-1">
                      <p className="font-mono text-[9px] uppercase text-slate-500 font-bold">REST API Gateway</p>
                      <p className="font-mono text-[10px] text-emerald-400 font-bold">STATUS // active_ok</p>
                    </div>

                    <div className="border-l-2 border-slate-800 pl-3.5 space-y-1">
                      <p className="font-mono text-[9px] uppercase text-slate-500 font-bold">Database Instance</p>
                      <p className="font-mono text-[10px] text-sky-300 font-bold">LOCALSTORAGE_DB // loaded</p>
                    </div>

                    <div className="border-l-2 border-slate-800 pl-3.5 space-y-1">
                      <p className="font-mono text-[9px] uppercase text-slate-500 font-bold">Network Socket Encryption</p>
                      <p className="font-mono text-[10px] text-teal-400 font-bold">TLS_1.3_AES_256 // encrypted</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 relative z-10 text-left">
                  <div className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-900/60 font-mono text-[9px] text-slate-500 space-y-1.5 leading-relaxed">
                    <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>GATEWAY_IDENTITY</span>
                    </div>
                    <p>Operator nodes must verify identity and passcode parameters to receive cryptographic write session tokens.</p>
                  </div>
                  <span className="font-mono text-[8px] text-slate-600 block uppercase">SHA_CORE_V4.2 // SECURITY_RESTRICTED_PROTOCOL</span>
                </div>
              </div>

              {/* Right Side: Immersive Credentials Form */}
              <div className="flex-1 md:col-span-7 flex flex-col justify-center p-6 sm:p-12 md:p-16 space-y-8 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="space-y-2.5 max-w-sm mx-auto w-full text-center md:text-left">
                  <div className="inline-flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[9px] uppercase tracking-wider mx-auto mb-2">
                    <Lock className="w-3 h-3 text-sky-400 animate-pulse" />
                    <span>SECURE_GATE // RESTRICTED</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                    Sign In to Console
                  </h3>
                  <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
                    Access administrative CMS by supplying your supervisor credentials.
                  </p>
                </div>

                {isLoggingIn ? (
                  /* Cyber-simulation logging progress */
                  <div className="w-full max-w-sm mx-auto space-y-5 py-6">
                    <div className="space-y-2 text-center">
                      <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
                      <p className="font-mono text-[10px] uppercase text-sky-300 font-bold tracking-widest animate-pulse">
                        {loginProgress < 35 && 'INITIATING HANDSHAKE PROTOCOL...'}
                        {loginProgress >= 35 && loginProgress < 70 && 'EXCHANGING CRYPTO SECURE KEYS...'}
                        {loginProgress >= 70 && loginProgress < 95 && 'SYNCHRONIZING ADMINISTRATIVE STATES...'}
                        {loginProgress >= 95 && 'AUTHORIZATION GRANTED. WELCOME...'}
                      </p>
                    </div>

                    <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden p-0.5">
                      <div 
                        className="bg-gradient-to-r from-sky-500 to-teal-400 h-full rounded-full transition-all duration-150"
                        style={{ width: `${loginProgress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[9px] text-slate-500">
                      <span>SYNC_PROGRESS</span>
                      <span>{loginProgress}%</span>
                    </div>
                  </div>
                ) : (
                  /* Beautiful Credentials Input form */
                  <form onSubmit={handleAuthenticate} className="w-full max-w-sm mx-auto space-y-4 text-left">
                    {/* Username input */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] uppercase text-slate-400 tracking-wider block font-bold">
                        Supervisor Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. admin or sha-fi18"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 focus:border-sky-500/40 focus:text-sky-400 rounded-lg py-3 px-10 text-slate-200 font-mono text-xs outline-none transition-all placeholder-slate-700"
                          autoFocus
                        />
                        <User className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    {/* Passcode input */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] uppercase text-slate-400 tracking-wider block font-bold">
                        Security Authorization Key
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 focus:border-sky-500/40 focus:text-sky-400 rounded-lg py-3 px-10 text-slate-200 font-mono text-xs outline-none transition-all placeholder-slate-700"
                        />
                        <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                        
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-slate-600 hover:text-slate-400 transition-colors"
                          title={showPassword ? 'Hide Security Key' : 'Reveal Security Key'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {authError && (
                      <div className="flex items-start gap-2 font-mono text-[10px] text-red-400 bg-red-500/5 p-3 border border-red-500/15 rounded-lg leading-relaxed">
                        <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-500" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-sky-200 hover:bg-white text-slate-950 font-mono text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-sky-500/5"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Authenticate Access</span>
                    </button>
                  </form>
                )}

                {/* Secure Helper Credentials card */}
                <div className="w-full max-w-sm mx-auto">
                  <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 font-mono text-[9px] text-slate-500 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold uppercase text-slate-400">Supervisor Debug Credentials</p>
                      <p>Username: <span className="text-sky-300 font-bold">admin</span></p>
                      <p>Security Key: <span className="text-sky-300 font-bold">admin</span> or <span className="text-sky-300 font-bold">shafik</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-brand-bg">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 bg-slate-950/60 border-r border-slate-900/80 flex flex-col justify-between overflow-x-auto md:overflow-y-auto">
                <div className="p-4 space-y-1.5 flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 md:gap-1.5 flex-nowrap md:flex-wrap">
                  <span className="hidden md:block font-mono text-[9px] text-slate-500 uppercase tracking-widest font-bold px-3 pt-2 pb-1 text-left">
                    Portfolios Elements
                  </span>

                  {[
                    { id: 'profile', label: 'Identity / Socials', icon: User },
                    { id: 'metrics', label: 'Key Metrics', icon: Sparkles },
                    { id: 'milestones', label: 'Career History', icon: Briefcase },
                    { id: 'stories', label: 'Case Successes', icon: Globe },
                    { id: 'tech', label: 'Methodology Stack', icon: Layers },
                    { id: 'bookings', label: 'Sessions Ledger', icon: Calendar },
                    { id: 'system', label: 'Database Backup', icon: RotateCcw }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as CMSTab)}
                        className={`flex items-center gap-3 py-2.5 px-3.5 rounded text-xs font-mono tracking-wider transition-all cursor-pointer text-nowrap w-auto md:w-full text-left ${
                          isActive 
                            ? 'bg-sky-500/10 border border-sky-400/30 text-sky-300 font-medium shadow-sm' 
                            : 'bg-transparent border border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                        }`}
                      >
                        <TabIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Session lock */}
                <div className="hidden md:block p-4 border-t border-slate-900/80">
                  <div className="bg-slate-900/40 p-3 rounded border border-slate-900 flex items-center justify-between gap-2">
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-[9px] text-slate-500">AUTHORIZATION</span>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">ADMIN_MODE</span>
                    </div>
                    <button
                      onClick={handleDeauthenticate}
                      className="p-1.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Lock CMS Console Session"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content Workspace */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 text-left bg-slate-950/10">
                
                {/* Profile Editor Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-white">General Identity</h3>
                      <p className="font-sans text-xs text-slate-400">Modify the primary presentation text, portrait photos, and lead social targets.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Developer Display Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-sans text-sm outline-none text-slate-200 focus:border-sky-500/40"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Present Location / Station</label>
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => handleProfileChange('location', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-sans text-sm outline-none text-slate-200 focus:border-sky-500/40"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Primary Role (e.g. Hero Tagline Role)</label>
                        <input
                          type="text"
                          value={profile.role1}
                          onChange={(e) => handleProfileChange('role1', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-sans text-sm outline-none text-slate-200 focus:border-sky-500/40"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Secondary Role / Titles Badge</label>
                        <input
                          type="text"
                          value={profile.role2}
                          onChange={(e) => handleProfileChange('role2', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-sans text-sm outline-none text-slate-200 focus:border-sky-500/40"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Hero Headline (Display Font Text)</label>
                        <input
                          type="text"
                          value={profile.headline}
                          onChange={(e) => handleProfileChange('headline', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-sans text-sm outline-none text-slate-200 focus:border-sky-500/40"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Hero Professional Bio Overview</label>
                        <textarea
                          rows={3}
                          value={profile.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-sans text-sm outline-none text-slate-200 focus:border-sky-500/40 resize-none leading-relaxed"
                        ></textarea>
                      </div>

                      <div className="space-y-2 sm:col-span-2 bg-slate-950/40 rounded-lg p-4 border border-slate-900/60">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
                          <span>Interactive Portrait Configuration</span>
                        </label>
                        <div className="flex flex-col md:flex-row items-start gap-4">
                          <div className="w-24 h-30 md:w-28 md:h-35 rounded border border-slate-800 bg-slate-950 overflow-hidden relative flex-shrink-0 group">
                            <div className="scan-line pointer-events-none"></div>
                            {profile.portraitUrl ? (
                              <img
                                src={profile.portraitUrl}
                                alt="Console Profile Portrait Preview"
                                className="w-full h-full object-cover grayscale-[15%] contrast-110"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">
                                NO_IMG
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-3 w-full">
                            <div className="space-y-1.5">
                              <span className="font-mono text-[9px] uppercase text-slate-500 tracking-wider">Direct Image / Avatar Source URL</span>
                              <input
                                type="text"
                                placeholder="Paste an image URL here..."
                                value={profile.portraitUrl}
                                onChange={(e) => handleProfileChange('portraitUrl', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-900 rounded p-2.5 font-mono text-xs outline-none text-sky-400 placeholder-slate-700 focus:border-sky-500/40"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="font-mono text-[9px] uppercase text-slate-500 tracking-wider block">Recommended Presets</span>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { label: 'Shafik Mohamed R (Original)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc0zVZpWTIj9vSVrCl3DLcJTCn7IjdICx_iP9ykXCxpB88BKQfdA4Dp6mTC-oK8KBwAGGcAAi0e74tOZ3x2Gn6X6XIs2pGWq6jdUKNM6-Wsr4RI8TcL7hr_CqV6N3YS4NeSvF8jFTTocHaHej83CHNGic4AKXAZZo69zEHuZpdnYU0Xu94jbMke4hX2Mw6COrS4y7G4zwOrF8VuN9TIPvrO0m5aOZb_mdVuONtg3FJ2QEmBb_VdCoSF6JdvNMcwqluL6SSauqzFBVj' },
                                  { label: 'Corporate Professional', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop' },
                                  { label: 'Tech Specialist', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop' },
                                  { label: 'Digital AI Avatar', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop' }
                                ].map((p, i) => (
                                  <button
                                    type="button"
                                    key={i}
                                    onClick={() => handleProfileChange('portraitUrl', p.url)}
                                    className={`font-sans text-[10px] px-2 py-1 rounded border transition-all cursor-pointer ${
                                      profile.portraitUrl === p.url 
                                        ? 'bg-sky-500/10 border-sky-400/40 text-sky-300' 
                                        : 'bg-slate-900/60 border-slate-900 text-slate-400 hover:text-slate-300'
                                    }`}
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">ID Badge String</label>
                        <input
                          type="text"
                          value={profile.idBadge}
                          onChange={(e) => handleProfileChange('idBadge', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-mono text-xs outline-none text-slate-300 focus:border-sky-500/40"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Years Experience Number Label</label>
                        <input
                          type="text"
                          value={profile.yearsExp}
                          onChange={(e) => handleProfileChange('yearsExp', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-mono text-xs outline-none text-slate-300 focus:border-sky-500/40"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">LinkedIn Profile URL</label>
                        <input
                          type="text"
                          placeholder="e.g. https://www.linkedin.com/in/username"
                          value={profile.linkedinUrl}
                          onChange={(e) => handleProfileChange('linkedinUrl', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-mono text-xs outline-none text-slate-300 focus:border-sky-500/40"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider flex justify-between items-center">
                          <span>Resume Document / PDF Source</span>
                          <span className="text-[8px] text-slate-500 normal-case">Direct URL or Local PDF Upload</span>
                        </label>
                        
                        {/* URL input */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g. https://drive.google.com/..."
                            value={profile.resumeUrl || ''}
                            onChange={(e) => handleProfileChange('resumeUrl', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-mono text-xs outline-none text-slate-300 focus:border-sky-500/40 text-sky-400 pr-16"
                          />
                          {profile.resumeUrl?.startsWith('data:') && (
                            <span className="absolute right-3 top-3 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-400/20 text-sky-400 font-mono text-[8px] uppercase tracking-wider font-bold">
                              Base64 PDF
                            </span>
                          )}
                        </div>

                        {/* Drag and Drop Zone */}
                        <div
                          onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragActive(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handlePdfUpload(file);
                          }}
                          className={`border border-dashed rounded-lg p-5 flex flex-col items-center justify-center gap-2.5 transition-all relative overflow-hidden text-center min-h-[120px] ${
                            dragActive 
                              ? 'border-sky-400 bg-sky-500/5' 
                              : profile.resumeUrl?.startsWith('data:')
                                ? 'border-emerald-500/20 bg-emerald-500/5'
                                : 'border-slate-800 bg-slate-950/40 hover:bg-slate-950/60 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePdfUpload(file);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          
                          {profile.resumeUrl?.startsWith('data:') ? (
                            <div className="flex flex-col items-center gap-2">
                              <ShieldCheck className="w-8 h-8 text-emerald-400" />
                              <div className="space-y-1">
                                <p className="font-mono text-xs text-emerald-300 font-bold">PDF Uploaded Successfully</p>
                                <p className="font-sans text-[10px] text-slate-500">
                                  Size: ~{Math.round((profile.resumeUrl.length * 3) / 4 / 1024)} KB stored in local database.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProfileChange('resumeUrl', '');
                                }}
                                className="mt-1 font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer relative z-10 font-bold"
                              >
                                Clear Uploaded PDF
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="w-8 h-8 text-slate-500" />
                              <div className="space-y-1">
                                <p className="font-mono text-xs text-slate-300 font-bold">Drag & Drop Resume PDF here</p>
                                <p className="font-sans text-[10px] text-slate-500">
                                  or click to browse local files (max 3MB for database persistence)
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Local alerts inside CMSPanel */}
                        {uploadError && (
                          <div className="flex items-start gap-2 text-red-400 font-mono text-[10px] bg-red-500/5 border border-red-500/15 p-2.5 rounded">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{uploadError}</span>
                          </div>
                        )}
                        
                        {uploadSuccess && (
                          <div className="flex items-start gap-2 text-emerald-400 font-mono text-[10px] bg-emerald-500/5 border border-emerald-500/15 p-2.5 rounded">
                            <Check className="w-4 h-4 flex-shrink-0" />
                            <span>RESUME PACKAGED SUCCESSFULLY AND SAVED TO CLIENT STORAGE DB</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">WhatsApp Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 971501234567"
                          value={profile.whatsappNumber || ''}
                          onChange={(e) => {
                            const numericOnly = e.target.value.replace(/\D/g, '');
                            const updated = {
                              ...profile,
                              whatsappNumber: numericOnly,
                              whatsappUrl: numericOnly ? `https://wa.me/${numericOnly}` : ''
                            };
                            setProfile(updated);
                            setSaveStatus('unsaved');
                            triggerSave(updated);
                          }}
                          className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-mono text-xs outline-none text-slate-300 focus:border-sky-500/40 text-emerald-400"
                        />
                        <span className="font-mono text-[9px] text-slate-500 tracking-wide block mt-1">
                          Auto URL: {profile.whatsappUrl || 'None generated'}
                        </span>
                      </div>

                      {/* Scheduling & Automation Settings */}
                      <div className="sm:col-span-2 pt-5 border-t border-slate-900/60 mt-4 space-y-4">
                        <div className="space-y-1">
                          <h4 className="font-mono text-[11px] uppercase tracking-wider text-teal-400 font-bold">Scheduling & Communication Automations</h4>
                          <p className="font-sans text-[11px] text-slate-500">Toggle Calendly booking, set your active scheduling address, and customize automatic email confirmations.</p>
                        </div>

                        <div className="bg-slate-950/60 rounded-lg p-4 border border-slate-900/80 space-y-4">
                          {/* Calendly Integration Row */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider block">Calendly Integration State</label>
                              <div className="flex items-center gap-3 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleProfileChange('useCalendly', !profile.useCalendly)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                    profile.useCalendly ? 'bg-teal-500' : 'bg-slate-800'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      profile.useCalendly ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                                <span className="font-mono text-[11px] text-slate-300">
                                  {profile.useCalendly ? 'ENABLED (Auto-Routing)' : 'DISABLED (Manual Scheduler)'}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Calendly Booking link URL</label>
                              <input
                                type="text"
                                placeholder="e.g. https://calendly.com/yourname"
                                value={profile.calendlyUrl || ''}
                                onChange={(e) => handleProfileChange('calendlyUrl', e.target.value)}
                                disabled={!profile.useCalendly}
                                className={`w-full bg-slate-950 border rounded p-3 font-mono text-xs outline-none transition-all ${
                                  profile.useCalendly 
                                    ? 'border-slate-900 text-teal-300 focus:border-teal-500/40' 
                                    : 'border-slate-900/40 text-slate-600 cursor-not-allowed opacity-50'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Email Auto-Responder Template Section */}
                          <div className="space-y-2 pt-2 border-t border-slate-900/40">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">
                                Post-Booking 'Acknowledgment Email' Template
                              </label>
                              <span className="font-mono text-[9px] text-sky-400 font-bold uppercase">Variables Available</span>
                            </div>
                            
                            {/* Dynamic placeholder chips */}
                            <div className="flex flex-wrap gap-1.5 pb-1">
                              {['{{NAME}}', '{{DATE}}', '{{TIME}}', '{{COMPANY}}', '{{GOAL}}'].map((tag) => (
                                <button
                                  type="button"
                                  key={tag}
                                  onClick={() => {
                                    const textarea = document.getElementById('ack-email-template') as HTMLTextAreaElement;
                                    if (textarea) {
                                      const start = textarea.selectionStart;
                                      const end = textarea.selectionEnd;
                                      const currentText = profile.acknowledgmentTemplate || '';
                                      const newText = currentText.substring(0, start) + tag + currentText.substring(end);
                                      handleProfileChange('acknowledgmentTemplate', newText);
                                      
                                      // refocus
                                      setTimeout(() => {
                                        textarea.focus();
                                        textarea.setSelectionRange(start + tag.length, start + tag.length);
                                      }, 50);
                                    }
                                  }}
                                  title={`Click to insert ${tag} tag`}
                                  className="font-mono text-[9px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-sky-300 border border-slate-800 px-2 py-0.5 rounded transition-all cursor-pointer"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>

                            <textarea
                              id="ack-email-template"
                              rows={5}
                              placeholder="Type the email content to be displayed in the inbox simulation on booking completion..."
                              value={profile.acknowledgmentTemplate || ''}
                              onChange={(e) => handleProfileChange('acknowledgmentTemplate', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-sans text-xs outline-none text-slate-300 placeholder-slate-700 focus:border-sky-500/40 resize-none leading-relaxed"
                            />
                            <p className="font-sans text-[10px] text-slate-500 leading-normal">
                              This template populates dynamic confirmation content displayed in the simulated customer inbox after scheduling.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SEO & Analytics Optimization Section */}
                      <div className="sm:col-span-2 pt-5 border-t border-slate-900/60 mt-4 space-y-4">
                        <div className="space-y-1">
                          <h4 className="font-mono text-[11px] uppercase tracking-wider text-sky-400 font-bold">SEO & Systems Telemetry Integrations</h4>
                          <p className="font-sans text-[11px] text-slate-500">Configure search engine visibility criteria and the live Google Analytics (GA4) telemetry stream.</p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
                              <span>Google Analytics (GA4) Measurement ID</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. G-26QEL8Z7C3"
                              value={profile.gaMeasurementId || ''}
                              onChange={(e) => handleProfileChange('gaMeasurementId', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-mono text-xs outline-none text-sky-300 placeholder-slate-700 focus:border-sky-500/40"
                            />
                          </div>

                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">SEO Meta Description</label>
                            <textarea
                              rows={2}
                              placeholder="Optimized snippet for search results..."
                              value={profile.seoDescription || ''}
                              onChange={(e) => handleProfileChange('seoDescription', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-sans text-xs outline-none text-slate-300 placeholder-slate-700 focus:border-sky-500/40 resize-none leading-relaxed"
                            />
                          </div>

                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">SEO Meta Keywords (Comma Separated)</label>
                            <input
                              type="text"
                              placeholder="e.g. Shafik Mohamed R, IT Project Manager, UAE..."
                              value={profile.seoKeywords || ''}
                              onChange={(e) => handleProfileChange('seoKeywords', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-900 rounded p-3 font-sans text-xs outline-none text-slate-300 placeholder-slate-700 focus:border-sky-500/40"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Metrics Config Tab */}
                {activeTab === 'metrics' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-white">Performance Metrics</h3>
                      <p className="font-sans text-xs text-slate-400">Configure the four high-profile statistics blocks shown beneath the hero header.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {metrics.map((m, idx) => (
                        <div key={idx} className="bg-slate-950/40 border border-slate-900/80 p-5 rounded-lg space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest font-bold">Metrics Slot 0{idx + 1}</span>
                            <span className="font-mono text-[10px] text-sky-400 font-bold uppercase">Dynamic_Data</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] uppercase text-slate-500">Value (e.g. 25+)</label>
                              <input
                                type="text"
                                value={m.num}
                                onChange={(e) => handleMetricChange(idx, 'num', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-sm font-sans outline-none text-sky-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] uppercase text-slate-500">System Tag (e.g. Deployments)</label>
                              <input
                                type="text"
                                value={m.slug}
                                onChange={(e) => handleMetricChange(idx, 'slug', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-xs font-mono outline-none text-teal-400"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] uppercase text-slate-500">Brief Descriptive Text</label>
                            <input
                              type="text"
                              value={m.desc}
                              onChange={(e) => handleMetricChange(idx, 'desc', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-xs font-sans outline-none text-slate-300"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestones History Tab */}
                {activeTab === 'milestones' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-display text-xl font-bold text-white">Career History Timeline</h3>
                        <p className="font-sans text-xs text-slate-400">Define the chronological experience log. Reorder, add accomplishments, or manage titles.</p>
                      </div>

                      <button
                        onClick={handleAddMilestone}
                        className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 px-3.5 py-2 rounded font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Position</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {milestones.map((m, idx) => (
                        <div key={m.id} className="bg-slate-950/40 border border-slate-900 p-5 rounded-xl space-y-4 relative group">
                          {/* Reordering Controls and Deletion */}
                          <div className="flex items-center justify-between border-b border-slate-900/80 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs text-slate-500">Node_0{idx + 1}</span>
                              <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-900">
                                <button
                                  type="button"
                                  onClick={() => handleMoveMilestone(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 hover:text-white text-slate-500 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveMilestone(idx, 'down')}
                                  disabled={idx === milestones.length - 1}
                                  className="p-1 hover:text-white text-slate-500 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveMilestone(idx)}
                              className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                              title="Delete Milestone Entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Detail inputs */}
                          <div className="grid sm:grid-cols-12 gap-4">
                            <div className="sm:col-span-4 space-y-1.5">
                              <label className="font-mono text-[9px] uppercase text-slate-400">Position Period</label>
                              <input
                                type="text"
                                value={m.period}
                                onChange={(e) => handleEditMilestone(idx, 'period', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-900 rounded p-2.5 font-mono text-xs text-slate-300 outline-none"
                              />
                            </div>

                            <div className="sm:col-span-5 space-y-1.5">
                              <label className="font-mono text-[9px] uppercase text-slate-400">Role Title</label>
                              <input
                                type="text"
                                value={m.role}
                                onChange={(e) => handleEditMilestone(idx, 'role', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-900 rounded p-2.5 font-sans text-xs text-white outline-none font-semibold"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1.5">
                              <label className="font-mono text-[9px] uppercase text-slate-400">Color Variant Tag</label>
                              <select
                                value={m.color}
                                onChange={(e) => handleEditMilestone(idx, 'color', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-900 rounded p-2.5 font-mono text-xs text-slate-300 outline-none"
                              >
                                <option value="primary">Primary Cyan</option>
                                <option value="tertiary">Tertiary Teal</option>
                                <option value="outline">Outline Slate</option>
                              </select>
                            </div>

                            <div className="sm:col-span-5 space-y-1.5">
                              <label className="font-mono text-[9px] uppercase text-slate-400">Corporate Entity</label>
                              <input
                                type="text"
                                value={m.company}
                                onChange={(e) => handleEditMilestone(idx, 'company', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-900 rounded p-2.5 font-sans text-xs text-slate-300 outline-none"
                              />
                            </div>

                            <div className="sm:col-span-7 space-y-1.5">
                              <label className="font-mono text-[9px] uppercase text-slate-400">Location Base</label>
                              <input
                                type="text"
                                value={m.location}
                                onChange={(e) => handleEditMilestone(idx, 'location', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-900 rounded p-2.5 font-sans text-xs text-slate-300 outline-none"
                              />
                            </div>
                          </div>

                          {/* Logo and Icon Customization */}
                          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-900/40">
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase text-slate-400 block">Logo Display Mode</label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditMilestone(idx, 'logoMode', 'logo')}
                                  className={`flex-1 font-mono text-[10px] uppercase tracking-wider py-2 rounded border transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
                                    (m.logoMode || 'logo') === 'logo'
                                      ? 'bg-sky-500/10 border-sky-400/30 text-sky-300'
                                      : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-400'
                                  }`}
                                >
                                  <Image className="w-3.5 h-3.5" />
                                  <span>Brand Logo</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditMilestone(idx, 'logoMode', 'icon')}
                                  className={`flex-1 font-mono text-[10px] uppercase tracking-wider py-2 rounded border transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
                                    m.logoMode === 'icon'
                                      ? 'bg-sky-500/10 border-sky-400/30 text-sky-300'
                                      : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-400'
                                  }`}
                                >
                                  <Briefcase className="w-3.5 h-3.5" />
                                  <span>Briefcase Icon</span>
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase text-slate-400 flex items-center gap-1.5">
                                <span>Logo Domain Override</span>
                                <span className="font-sans text-[8px] text-slate-500 normal-case">(e.g. website link/domain)</span>
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. doodletech.ae, develoeper.com"
                                value={m.logoDomain || ''}
                                onChange={(e) => handleEditMilestone(idx, 'logoDomain', e.target.value)}
                                disabled={m.logoMode === 'icon'}
                                className={`w-full bg-slate-950 border rounded p-2.5 font-mono text-xs outline-none transition-all ${
                                  m.logoMode === 'icon'
                                    ? 'border-slate-950 text-slate-700 cursor-not-allowed placeholder-slate-800'
                                    : 'border-slate-900 text-slate-300 focus:border-sky-500/40 focus:text-sky-400 placeholder-slate-700'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Highlights bulleted lists or paragraph */}
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between border-t border-slate-900/60 pt-3">
                              <span className="font-mono text-[9px] uppercase text-slate-400 font-bold block">Objective Delivery Highlights (Bulleted)</span>
                              <button
                                type="button"
                                onClick={() => handleAddMilestoneHighlight(idx)}
                                className="text-sky-400 hover:text-sky-300 font-mono text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Highlight
                              </button>
                            </div>

                            {m.highlights && m.highlights.length > 0 ? (
                              <div className="space-y-2 pl-3">
                                {m.highlights.map((h, hIdx) => (
                                  <div key={hIdx} className="flex items-center gap-2 group/h">
                                    <span className="font-mono text-slate-600 text-xs select-none">▸</span>
                                    <input
                                      type="text"
                                      value={h}
                                      onChange={(e) => handleMilestoneHighlightChange(idx, hIdx, e.target.value)}
                                      className="flex-1 bg-slate-950 border border-slate-900 rounded p-2 font-sans text-xs text-slate-300 outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveMilestoneHighlight(idx, hIdx)}
                                      className="text-slate-600 hover:text-red-400 p-1 cursor-pointer opacity-0 group-hover/h:opacity-100 transition-opacity"
                                      title="Remove Highlight Item"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-1.5 pt-1.5">
                                <label className="font-mono text-[9px] uppercase text-slate-500">Brief Overview Description (if highlights are empty)</label>
                                <textarea
                                  rows={2}
                                  value={m.description || ''}
                                  onChange={(e) => handleEditMilestone(idx, 'description', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-900 rounded p-2.5 font-sans text-xs text-slate-300 outline-none resize-none"
                                ></textarea>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Stories Tab */}
                {activeTab === 'stories' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-display text-xl font-bold text-white">Case Success Archives</h3>
                        <p className="font-sans text-xs text-slate-400">Manage case studies and project success cards featured in the central portfolio dashboard.</p>
                      </div>

                      <button
                        onClick={handleAddStory}
                        className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 px-3.5 py-2 rounded font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Case Study</span>
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {successStories.map((s, idx) => (
                        <div key={s.id} className="bg-slate-950/40 border border-slate-900 p-5 rounded-xl space-y-4 relative flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                              <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">Case_Node_0{idx + 1}</span>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveStory(idx, 'up')}
                                    disabled={idx === 0}
                                    className="p-1 hover:text-white text-slate-500 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveStory(idx, 'down')}
                                    disabled={idx === successStories.length - 1}
                                    className="p-1 hover:text-white text-slate-500 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleRemoveStory(idx)}
                                  className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="font-mono text-[9px] uppercase text-slate-400">Core Subject</label>
                                  <input
                                    type="text"
                                    value={s.title}
                                    onChange={(e) => handleEditStory(idx, 'title', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-xs font-sans text-white outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="font-mono text-[9px] uppercase text-slate-400">Operational Sector</label>
                                  <input
                                    type="text"
                                    value={s.category}
                                    onChange={(e) => handleEditStory(idx, 'category', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-xs font-mono text-sky-300 outline-none"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="font-mono text-[9px] uppercase text-slate-400">Framework Icon</label>
                                  <select
                                    value={s.iconName}
                                    onChange={(e) => handleEditStory(idx, 'iconName', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-xs font-mono text-slate-300 outline-none"
                                  >
                                    <option value="WMS">WMS Box</option>
                                    <option value="CRM">CRM Email</option>
                                    <option value="ERP">ERP Globe</option>
                                    <option value="WHATSAPP">WhatsApp Bubble</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="font-mono text-[9px] uppercase text-slate-400">Technology Tag</label>
                                  <input
                                    type="text"
                                    value={s.tech}
                                    onChange={(e) => handleEditStory(idx, 'tech', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-xs font-mono text-teal-400 outline-none"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="font-mono text-[9px] uppercase text-slate-400">Impact Description</label>
                                <textarea
                                  rows={3}
                                  value={s.description}
                                  onChange={(e) => handleEditStory(idx, 'description', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-xs font-sans text-slate-300 outline-none resize-none leading-relaxed"
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Array Stack Editor */}
                {activeTab === 'tech' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-white">Methodology & Toolset Stack</h3>
                      <p className="font-sans text-xs text-slate-400">Manage the technical categories and lists of tags displayed in the armament breakdown.</p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                      {techArray.map((cat, catIdx) => (
                        <div key={catIdx} className="bg-slate-950/40 border border-slate-900 p-5 rounded-xl space-y-4">
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase text-slate-500 font-bold block">Domain Category Label</label>
                            <input
                              type="text"
                              value={cat.title}
                              onChange={(e) => handleEditTechCategoryTitle(catIdx, e.target.value)}
                              className="w-full bg-slate-950 border border-slate-900 rounded p-2 font-mono text-xs text-white outline-none"
                            />
                          </div>

                          <div className="space-y-2 border-t border-slate-900/60 pt-3">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] uppercase text-slate-500">Node Tags</span>
                              <button
                                type="button"
                                onClick={() => handleAddTechItem(catIdx)}
                                className="text-teal-400 hover:text-teal-300 font-mono text-[9px] uppercase flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                Add Tag
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {cat.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex items-center gap-1.5 group/t">
                                  <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleEditTechItem(catIdx, itemIdx, e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-900 rounded p-2 font-sans text-xs text-slate-300 outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTechItem(catIdx, itemIdx)}
                                    className="text-slate-600 hover:text-red-400 p-1 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategy Bookings Ledger */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-white">Client Sessions Ledger</h3>
                      <p className="font-sans text-xs text-slate-400">View corporate strategy meetings requested by visitors on this platform. Data is preserved locally in secure secure-SSL memory.</p>
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search Bookings Ledger by Company, Goal, or Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-900 rounded-lg p-3 pl-10 text-xs font-sans outline-none text-slate-200 focus:border-sky-500/40"
                      />
                    </div>

                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                      {filteredMeetings.length === 0 ? (
                        <div className="text-center py-12 space-y-2 border border-slate-900 rounded-xl">
                          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">ledger empty</p>
                          <p className="font-sans text-xs text-slate-600">No sessions match your current filtration query.</p>
                        </div>
                      ) : (
                        filteredMeetings.map((m) => (
                          <div 
                            key={m.id}
                            className="bg-slate-950/60 rounded-xl border border-slate-900 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-2 text-left">
                              <div className="flex items-center gap-2.5">
                                <span className="font-sans text-sm font-semibold text-white">{m.name}</span>
                                <span className="text-slate-700">•</span>
                                <span className="font-mono text-[9px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                                  <Building className="w-2.5 h-2.5" />
                                  {m.company}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10px] text-slate-400">
                                <span className="flex items-center gap-1 text-slate-500">
                                  <Mail className="w-3.5 h-3.5" />
                                  {m.email}
                                </span>
                                <span className="flex items-center gap-1 text-slate-500">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {m.date}
                                </span>
                                <span className="flex items-center gap-1 text-slate-500">
                                  <Clock className="w-3.5 h-3.5" />
                                  {m.timeSlot}
                                </span>
                              </div>

                              <p className="font-sans text-xs text-slate-300 bg-slate-950/80 p-3 rounded border border-slate-900 leading-relaxed max-w-2xl font-light">
                                <strong className="font-mono text-[9px] uppercase text-slate-500 mr-1">TARGET:</strong> {m.goal}
                              </p>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-slate-900 pt-3 md:pt-0">
                              <button
                                onClick={() => onCancelMeeting(m.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/25 px-3 py-1.5 rounded font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Purge</span>
                              </button>
                              <span className="font-mono text-[8px] text-slate-600 block">UUID: {m.id}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* System backup/restore/factory reset */}
                {activeTab === 'system' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-white">Database Backup & Recovery</h3>
                      <p className="font-sans text-xs text-slate-400">Export your customized content configurations to secure JSON backups, restore them, or perform factory-level resets.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* JSON export/import card */}
                      <div className="bg-slate-950/40 border border-slate-900 p-6 rounded-xl space-y-4">
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-sky-400" />
                          <h4 className="font-display text-md font-bold text-white">System Export/Import</h4>
                        </div>
                        <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
                          Ensure no data loss by downloading your portfolio structure as a cohesive JSON document. This preserves your biographies, metrics, milestones, and success cards on your desktop.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={handleExportJSON}
                            className="flex-1 bg-sky-950/50 hover:bg-sky-900/40 text-sky-300 border border-sky-400/30 px-4 py-3 rounded font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                          >
                            <Download className="w-4 h-4" />
                            <span>Export Backup</span>
                          </button>

                          <label className="flex-1 bg-teal-950/40 hover:bg-teal-900/30 text-teal-300 border border-teal-400/20 px-4 py-3 rounded font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all text-center">
                            <Upload className="w-4 h-4" />
                            <span>Restore Backup</span>
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportJSON}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Hard reset card */}
                      <div className="bg-slate-950/40 border border-slate-900 p-6 rounded-xl space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4 text-amber-500" />
                            <h4 className="font-display text-md font-bold text-white">Factory Data Reset</h4>
                          </div>
                          <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
                            Revert all customizable sections (Identity, Metrics, Milestones, Projects, Stack) back to the original portfolio settings created by the developer. This operation is permanent.
                          </p>
                        </div>

                        <button
                          onClick={handleFactoryReset}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25 px-4 py-3 rounded font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Revert Defaults</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Status footer bar */}
          <div className="bg-slate-950/90 border-t border-slate-900/80 px-6 py-2.5 flex items-center justify-between font-mono text-[9px] text-slate-600 select-none">
            <span>SECURE_SESSION_ENCRYPTED // DESKTOP_FIRST_VALIDATED</span>
            <span>SHAF_PMO_SYSTEM_V4.2</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
