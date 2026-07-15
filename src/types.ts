export interface Meeting {
  id: string;
  name: string;
  email: string;
  company: string;
  date: string; // ISO date format: YYYY-MM-DD
  timeSlot: string; // e.g. "2:00 PM - 2:30 PM"
  goal: string;
  createdAt: string;
  location: string;
  host: string;
}

export interface Profile {
  name: string;
  role1: string; // e.g. "Deployment Specialist"
  role2: string; // e.g. "IT PMO • SaaS PO"
  headline: string; // e.g. "Engineering Digital Evolution & Strategic Growth"
  bio: string;
  portraitUrl: string;
  idBadge: string;
  uptimeText: string;
  yearsExp: string;
  linkedinUrl: string;
  resumeUrl?: string;
  whatsappUrl: string;
  location: string;
  gaMeasurementId?: string;
  seoDescription?: string;
  seoKeywords?: string;
  whatsappNumber?: string;
  acknowledgmentTemplate?: string;
  calendlyUrl?: string;
  useCalendly?: boolean;
}

export interface Metric {
  num: string;
  slug: string;
  desc: string;
}

export interface CareerMilestone {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  highlights?: string[];
  description?: string;
  color: 'primary' | 'tertiary' | 'outline';
  logoDomain?: string;
  logoMode?: 'logo' | 'icon';
}

export interface SuccessStory {
  id: string;
  title: string;
  category: string;
  tech: string;
  description: string;
  iconName: 'WMS' | 'CRM' | 'ERP' | 'WHATSAPP' | 'PORTFOLIO';
}

export interface TechCategory {
  title: string;
  items: string[];
  color: 'primary' | 'tertiary' | 'on-surface-variant';
}

export interface PortfolioData {
  profile: Profile;
  metrics: Metric[];
  milestones: CareerMilestone[];
  successStories: SuccessStory[];
  techArray: TechCategory[];
}
