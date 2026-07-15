import { CareerMilestone, SuccessStory, TechCategory, Profile, Metric, PortfolioData } from './types';

export const milestones: CareerMilestone[] = [
  {
    id: 'm1',
    period: '2023 – PRESENT',
    role: 'IT Project Manager & SaaS Product Owner',
    company: 'Doodle Technologies',
    location: 'Abu Dhabi, UAE',
    color: 'primary',
    highlights: [
      'Delivered 25+ projects (SaaS, ERP, WMS, Cloud) to closure.',
      'Led pre-sales and technical solution presentations.',
      'Achieved 20% delivery timeline improvement via Agile.',
      'Rolled out MS Copilot to 80+ nodes with change mgmt.'
    ]
  },
  {
    id: 'm2',
    period: '2023 – PRESENT',
    role: 'Developer',
    company: 'Doodle Technologies',
    location: 'Abu Dhabi',
    color: 'tertiary',
    description: 'Spearheading internal technical initiatives, leveraging AI frameworks and modern web stacks to automate workflows and enhance platform performance.'
  },
  {
    id: 'm3',
    period: '2022 – 2023',
    role: 'Senior Software Tester',
    company: 'Infinite Computer Solutions',
    location: 'India',
    color: 'outline',
    description: 'Built 200+ automated test scripts (Selenium/Java) cutting regression cycles from 3 days to 6 hours.'
  },
  {
    id: 'm4',
    period: '2021 – 2022',
    role: 'IT Associate',
    company: 'Guidehouse India',
    location: 'India',
    color: 'outline'
  },
  {
    id: 'm5',
    period: '2019 – 2021',
    role: 'Executive AR / GIS',
    company: 'Omega Healthcare / Capgemini',
    location: 'India',
    color: 'outline'
  }
];

export const successStories: SuccessStory[] = [
  {
    id: 's1',
    title: 'Warehouse Management (WMS)',
    category: 'PO & PMO',
    tech: 'Laravel / Agile Delivery / Custom Build',
    description: 'Managed full project delivery of a custom WMS for a UAE logistics client. Established PMO governance to streamline stakeholder approvals and vendor coordination, significantly reducing fulfillment delays.',
    iconName: 'WMS'
  },
  {
    id: 's2',
    title: 'CRM Follow-up Automation',
    category: 'AI AUTOMATION',
    tech: 'Frappe CRM / Claude API / MS Outlook',
    description: 'Deployed an AI-powered email pipeline that auto-generates follow-ups from proposal PDFs, reducing manual outreach by 3 hours daily.',
    iconName: 'CRM'
  },
  {
    id: 's3',
    title: 'ERP Implementation',
    category: 'ENTERPRISE ERP',
    tech: 'ERP Next / Frappe / Change Mgmt',
    description: 'Led end-to-end ERP deployment (Inventory, HR, Purchase) for 3 enterprise clients, reducing operational processing delays by 15%.',
    iconName: 'ERP'
  },
  {
    id: 's4',
    title: 'WhatsApp Lead Automation',
    category: 'LEAD OPTIMIZATION',
    tech: 'Business API / CRM Integration / Webhooks',
    description: 'Automated lead intake and routing system that cut average response time from 4+ hours to under 10 minutes.',
    iconName: 'WHATSAPP'
  },
  {
    id: 's5',
    title: 'Executive Portfolio & System Console',
    category: 'FULL-STACK COMPOSITE',
    tech: 'React / TypeScript / Tailwind / Live Simulator',
    description: 'Designed and engineered an executive portfolio featuring a hidden client-side System Console accessible via custom URLs. Integrated dynamic SEO meta tag modifiers, real-time Google Analytics (GA4) streams, and a simulated automated confirmation responder workflow.',
    iconName: 'PORTFOLIO'
  }
];

export const techArray: TechCategory[] = [
  {
    title: 'PM & GOVERNANCE',
    color: 'primary',
    items: ['Jira', 'Confluence', 'MS Project', 'Agile (Scrum)', 'PMO Frameworks']
  },
  {
    title: 'PLATFORMS & AI',
    color: 'tertiary',
    items: ['Frappe / ERPNext', 'Claude & OpenAI', 'Azure Cloud', 'Power Automate']
  },
  {
    title: 'QA & DELIVERY',
    color: 'on-surface-variant',
    items: ['Selenium', 'Postman', 'SaaS DevOps', 'UAT Protocols']
  }
];

export const availableTimeSlots: string[] = [
  '09:00 AM - 09:30 AM (GST)',
  '10:30 AM - 11:00 AM (GST)',
  '11:30 AM - 12:00 PM (GST)',
  '02:00 PM - 02:30 PM (GST)',
  '03:30 PM - 04:00 PM (GST)',
  '05:00 PM - 05:30 PM (GST)'
];

export const defaultProfile: Profile = {
  name: 'Shafik Mohamed R',
  role1: 'Deployment Specialist',
  role2: 'IT PMO • SaaS PO',
  headline: 'Engineering Digital Evolution & Strategic Growth.',
  bio: "Architecting transformation across UAE's enterprise landscape. 6+ years of lifecycle mastery in Agile delivery, PMO governance, and AI-driven automation systems.",
  portraitUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc0zVZpWTIj9vSVrCl3DLcJTCn7IjdICx_iP9ykXCxpB88BKQfdA4Dp6mTC-oK8KBwAGGcAAi0e74tOZ3x2Gn6X6XIs2pGWq6jdUKNM6-Wsr4RI8TcL7hr_CqV6N3YS4NeSvF8jFTTocHaHej83CHNGic4AKXAZZo69zEHuZpdnYU0Xu94jbMke4hX2Mw6COrS4y7G4zwOrF8VuN9TIPvrO0m5aOZb_mdVuONtg3FJ2QEmBb_VdCoSF6JdvNMcwqluL6SSauqzFBVj',
  idBadge: 'SHFK_06',
  uptimeText: 'UPTIME: 99.9%_OPERATIONAL',
  yearsExp: '06+',
  linkedinUrl: 'https://www.linkedin.com/in/mohamedshafi97/',
  resumeUrl: 'https://drive.google.com/file/d/1Xy_Y-U7nbe6V_3Y67x8aZ95tLg-Wp8Hh/view?usp=sharing',
  whatsappUrl: 'https://wa.me/971501234567',
  location: 'Abu Dhabi, UAE',
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  seoDescription: 'IT Project Manager, Deployment Specialist, and SaaS Product Owner based in UAE. Expert in Agile delivery, PMO governance, and enterprise AI automation.',
  seoKeywords: 'Shafik Mohamed R, IT Project Manager, Deployment Specialist, SaaS Product Owner, PMO Governance, Agile Scrum, ERP Implementation, Abu Dhabi, Dubai, UAE',
  whatsappNumber: '971501234567',
  acknowledgmentTemplate: 'Dear {{NAME}},\n\nYour strategy session has been successfully acknowledged! Details are outlined below:\n\n📅 Date: {{DATE}}\n⏰ Time Slot: {{TIME}}\n🏢 Organization: {{COMPANY}}\n🎯 Focus Objective: {{GOAL}}\n\nI have locked this slot into my active project pipeline and will perform a preliminary systems audit of {{COMPANY}} prior to our synchronization. Looking forward to our discussion.\n\nRespectfully,\nShafik Mohamed R',
  calendlyUrl: 'https://calendly.com/mohamedshafi97',
  useCalendly: false
};

export const defaultMetrics: Metric[] = [
  {
    num: "25+",
    slug: "Deployments",
    desc: "Delivered SaaS, Cloud, WMS & ERP architectures across enterprise layers."
  },
  {
    num: "20%",
    slug: "Sprint_V_Gain",
    desc: "Aggregated development velocity gains optimized via tailored Agile methodologies."
  },
  {
    num: "40%",
    slug: "Lead_Efficiency",
    desc: "Marketing & CRM pipelines accelerated through intelligent automation systems."
  },
  {
    num: "80+",
    slug: "Copilot_Nodes",
    desc: "Enterprise-wide rollout, integration, and adoption nodes established."
  }
];

export const defaultPortfolioData: PortfolioData = {
  profile: defaultProfile,
  metrics: defaultMetrics,
  milestones,
  successStories,
  techArray
};

