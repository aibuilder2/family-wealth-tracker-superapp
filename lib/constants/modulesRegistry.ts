import {
  Truck, UtensilsCrossed, HardHat, Building2, ShieldCheck,
  Fuel, Coins, Store, PartyPopper, Landmark, TrendingUp,
  HandCoins, Briefcase, Sprout, Scale, Users, Compass,
  HeartPulse, Car
} from 'lucide-react';

export interface AppModuleConfig {
  id: string;
  title: string;
  subtitle: string;
  category: 'original_core' | 'business' | 'finance' | 'family';
  icon: any;
  defaultPinned: boolean;
  color: string;
}

export const ALL_APP_MODULES: AppModuleConfig[] = [
  // 1. Core Financial & Loan Modules
  {
    id: 'bank-loans',
    title: 'Bank Loans & Family EMI',
    subtitle: 'होम लोन, कार लोन, पारिवारिक EMI हिस्सा व ब्याज दर',
    category: 'finance',
    icon: Landmark,
    defaultPinned: true,
    color: 'from-amber-600 to-amber-700'
  },
  {
    id: 'udhar-ledger',
    title: 'उधार बही-खाता (Promissory OTP)',
    subtitle: 'पिता का नाम, प्रॉमिसरी नोट, OTP सत्यापन व 3-Way चुकता',
    category: 'finance',
    icon: HandCoins,
    defaultPinned: true,
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'investments-sip',
    title: 'SIP, RD, FD & Stocks',
    subtitle: 'म्यूचुअल फंड SIP, बैंक FD, शेयर्स व डिमैट पोर्टफोलियो',
    category: 'finance',
    icon: TrendingUp,
    defaultPinned: true,
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'jewellery-loan',
    title: 'Gold Loan (सोना गिरवी)',
    subtitle: 'सोने का वजन, 75% LTV, मासिक ब्याज हिसाब',
    category: 'finance',
    icon: Coins,
    defaultPinned: false,
    color: 'from-yellow-500 to-amber-600'
  },

  // 2. Original Core Life & Family Modules
  {
    id: 'trips-splitter',
    title: 'Holiday & Trips Splitter',
    subtitle: 'एडवांस पूल फंड, ग्रुप होटल/टैक्सी ख़र्च व सदस्य हिसाब',
    category: 'family',
    icon: Compass,
    defaultPinned: true,
    color: 'from-cyan-600 to-blue-700'
  },
  {
    id: 'hospital-episodes',
    title: 'Hospital & Surgery Episodes',
    subtitle: 'सर्जरी, डिलीवरी, अस्पताल भर्ती बिल व मेडिक्लेम क्लेम',
    category: 'family',
    icon: HeartPulse,
    defaultPinned: true,
    color: 'from-rose-600 to-red-700'
  },
  {
    id: 'family-hisab',
    title: 'Member Aapsi Hisab (आपसी लेन-देन)',
    subtitle: 'परिवार के सदस्यों का आपस में खर्च, सामान लाना व रनिंग बैलेंस',
    category: 'family',
    icon: Users,
    defaultPinned: true,
    color: 'from-indigo-600 to-violet-700'
  },
  {
    id: 'court-cases',
    title: 'Court Case & Legal Tracker',
    subtitle: 'ज़मीन विवाद, कोर्ट पेशी तारीख, वकील फीस व सुनवाई डायरी',
    category: 'family',
    icon: Scale,
    defaultPinned: true,
    color: 'from-red-600 to-slate-800'
  },
  {
    id: 'household-staff',
    title: 'Household Staff Manager',
    subtitle: 'मेड, ड्राइवर, रसोइया की 1-31 दैनिक हाजिरी, एडवांस व वेतन',
    category: 'family',
    icon: Users,
    defaultPinned: false,
    color: 'from-sky-600 to-indigo-700'
  },
  {
    id: 'vehicles-garage',
    title: 'Personal Garage & Vehicles',
    subtitle: 'निजी कार/बाइक, सर्विस बिल, इंश्योरेंस व PUC एक्सपायरी अलर्ट',
    category: 'family',
    icon: Car,
    defaultPinned: false,
    color: 'from-teal-600 to-emerald-700'
  },

  // 3. Core Business & Property Modules
  {
    id: 'business-firms',
    title: 'Business Firms, GST & Drawings',
    subtitle: 'पार्टनरशिप/प्रोपराइटरशिप फर्म, GSTIN, करंट अकाउंट व ड्रॉइंग्स',
    category: 'business',
    icon: Building2,
    defaultPinned: true,
    color: 'from-slate-700 to-slate-900'
  },
  {
    id: 'business-setup',
    title: 'Business Setup (Pre-Op CapEx)',
    subtitle: 'नया बिज़नेस शुरू करने का Day-0 ख़र्च व लोन किश्तें',
    category: 'business',
    icon: Briefcase,
    defaultPinned: false,
    color: 'from-purple-600 to-indigo-800'
  },
  {
    id: 'transport',
    title: 'Transport & Fleet (JCB/Truck)',
    subtitle: 'घंटे व KM भाड़ा, जेसीबी/पोकलेन, डीज़ल व EMI',
    category: 'business',
    icon: Truck,
    defaultPinned: false,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'cloud-kitchen',
    title: 'Cloud Kitchen & Tiffin',
    subtitle: 'टिफिन ग्राहक, Swiggy/Zomato, काउंटर सेल',
    category: 'business',
    icon: UtensilsCrossed,
    defaultPinned: false,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'construction',
    title: 'House Construction ERP',
    subtitle: 'फाउंडेशन से फिनिशिंग, माल बिल, लेबर हाजिरी',
    category: 'business',
    icon: HardHat,
    defaultPinned: false,
    color: 'from-stone-600 to-stone-800'
  },
  {
    id: 'hostel-pg',
    title: 'Hostel, PG & Rentals',
    subtitle: 'कमरा नंबर, किरायेदार रिकॉर्ड, बकाया किराया व डिपॉजिट',
    category: 'business',
    icon: Building2,
    defaultPinned: false,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'agriculture',
    title: 'Krishi & Agri Land',
    subtitle: 'खुद की खेती, ठेका/अधिया, खाद/डीजल ख़र्च व मंडी बोनस',
    category: 'business',
    icon: Sprout,
    defaultPinned: false,
    color: 'from-green-600 to-emerald-800'
  },

  // 4. Optional Extra Business Modules
  {
    id: 'petrol-pump',
    title: 'Petrol Pump ERP (ऑप्शनल)',
    subtitle: 'शिफ्ट मीटर, कैश/POS/उधारी, टैंक डिप स्टॉक',
    category: 'business',
    icon: Fuel,
    defaultPinned: false,
    color: 'from-red-500 to-rose-700'
  },
  {
    id: 'insurance-property-crm',
    title: 'Insurance & Property CRM (ऑप्शनल)',
    subtitle: 'क्लाइंट लीड्स, फॉलोअप तारीख, कमीशन व ब्रोकरेज',
    category: 'business',
    icon: ShieldCheck,
    defaultPinned: false,
    color: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'retail-shop',
    title: 'Retail Shop & Kirana (ऑप्शनल)',
    subtitle: 'दुकान काउंटर बिक्री, उधारी बही-खाता व रिकवरी',
    category: 'business',
    icon: Store,
    defaultPinned: false,
    color: 'from-teal-600 to-cyan-700'
  },
  {
    id: 'events-functions',
    title: 'Shaadi & Shagun Diary (ऑप्शनल)',
    subtitle: 'शादी, गृह प्रवेश ख़र्च और शगुन लिफाफा डायरी',
    category: 'family',
    icon: PartyPopper,
    defaultPinned: false,
    color: 'from-pink-500 to-rose-600'
  }
];

export const STORAGE_KEY_PINNED_MODULES = 'fwa_active_home_modules';
