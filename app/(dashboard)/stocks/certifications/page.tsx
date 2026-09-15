"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  GraduationCap,
  DollarSign,
  TrendingUp,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Building,
  BarChart2,
  PieChart,
  Layers,
  ChevronRight,
  HelpCircle,
  Clock,
  AlertCircle,
  Calculator
} from "lucide-react";

interface ExamDetail {
  id: string;
  series: string;
  title: string;
  hindiTitle: string;
  category: "distribution" | "advisory" | "derivatives" | "operations" | "sebi_direct";
  role: string;
  qualification: string;
  examFee: string;
  passingMarks: string;
  negativeMarking: string;
  questionsCount: number;
  duration: string;
  validity: string;
  syllabus: string[];
  careerOpportunities: string[];
  earningModel: string;
  officialLink: string;
}

const SEBI_NISM_EXAMS: ExamDetail[] = [
  {
    id: "mfd-va",
    series: "NISM Series V-A",
    title: "Mutual Fund Distributors Certification Examination",
    hindiTitle: "म्यूचुअल फंड डिस्ट्रीब्यूटर (MFD / ARN लाइसेंस)",
    category: "distribution",
    role: "AMFI Registered Mutual Fund Distributor (ARN Holder), IFA, Wealth Manager",
    qualification: "10+2 (12th Pass) या किसी भी स्ट्रीम में Graduate (No experience required)",
    examFee: "₹1,500 + GST",
    passingMarks: "50% (50 / 100 Marks)",
    negativeMarking: "कोई नेगेटिव मार्किंग नहीं (Zero Negative Marking)",
    questionsCount: 100,
    duration: "2 घंटे (120 मिनट)",
    validity: "3 साल (CPE से रिन्यू होता है)",
    syllabus: [
      "म्यूचुअल फंड की संरचना, ट्रस्टी, स्पॉन्सर और AMC ऑपरेशन्स",
      "NAV कैलकुलेशन, टोटल एक्सपेंस रेश्यो (TER), एग्जिट लोड और कट-ऑफ टाइमिंग",
      "इक्विटी, डेट, हाइब्रिड, लिक्विड, इंडेक्स और सॉल्यूशन ओरिएंटेड फंड्स की स्कीम्स",
      "इन्वेस्टर रिस्क प्रोफाइलिंग, SIP, SWP, STP और सिस्टेमैटिक एलोकेशन",
      "टैक्सेशन रूल्स (LTCG, STCG, इंडेक्सेशन बदलाव) और SEBI कोड ऑफ कंडक्ट"
    ],
    careerOpportunities: [
      "खुद की म्यूचुअल फंड डिस्ट्रीब्यूशन एजेंसी / फिनटेक प्लेटफॉर्म शुरू करना",
      "बैंकों (HDFC, SBI, ICICI) और ब्रोकिंग फर्म्स में Relationship Manager (RM)",
      "लाइफटाइम पैसिव ट्रेल कमीशन इनकम (₹50,000 से ₹5,00,000+ प्रतिमाह)"
    ],
    earningModel: "Client AUM पर 0.75% से 1.20% वार्षिक Life-time Recurring Trail Commission। ₹10 करोड़ AUM = ~₹70,000/माह गारंटीड पैसिव इनकम।",
    officialLink: "https://certifications.nism.ac.in/"
  },
  {
    id: "ra-xv",
    series: "NISM Series XV",
    title: "Research Analyst Certification Examination",
    hindiTitle: "SEBI रजिस्टर्ड रिसर्च एनालिस्ट (RA)",
    category: "advisory",
    role: "SEBI Registered Research Analyst (Individual / Entity), Equity Analyst, Portfolio Strategist",
    qualification: "Graduate in Finance / Commerce / Engineering / CA / CFA / MBA Finance या कोई भी प्रोफेशनल डिग्री",
    examFee: "₹3,000 + GST",
    passingMarks: "60% (60 / 100 Marks)",
    negativeMarking: "25% नेगेटिव मार्किंग (0.25 मार्क्स कटेंगे)",
    questionsCount: 100,
    duration: "2 घंटे (120 मिनट)",
    validity: "3 साल",
    syllabus: [
      "फंडामेंटल एनालिसिस: Balance Sheet, Profit & Loss, Cash Flows, DCF और P/E वैल्यूएशन",
      "टेक्निकल एनालिसिस: सपोर्ट/रेजिस्टेंस, चार्ट पैटर्न्स, मूविंग एवरेज, RSI, MACD",
      "मैक्रो-इकोनॉमिक्स: GDP, महंगाई (CPI), ब्याज दरें, फिस्कल डेफिसिट, क्रूड ऑयल इम्पैक्ट",
      "कंपनी और इंडस्ट्री रिसर्च रिपोर्ट तैयार करने के मानक और एथिक्स",
      "SEBI (Research Analysts) Regulations, 2014 और डिस्क्लोजर नॉर्म्स"
    ],
    careerOpportunities: [
      "SEBI से RA लाइसेंस लेकर खुद की पेड स्टॉक एडवाइजरी / टिप्स / मॉडल पोर्टफोलियो सर्विस चलाना",
      "ब्रोकरेज फर्म्स (Motilal Oswal, Zerodha, Groww) में Equity Analyst जॉब (₹8L - ₹25L पैकेज)",
      "Smallcase, TradingView या अपनी खुद की वेबसाइट पर SEBI कंप्लायंट स्ट्रेटेजी बेचना"
    ],
    earningModel: "मंथली/क्वार्टरली रिसर्च सब्सक्रिप्शन फीस (जैसे ₹3,500/माह x 100 क्लाइंट्स = ₹3.5 लाख/माह) या संस्थागत रिसर्च रिपोर्ट फीस।",
    officialLink: "https://certifications.nism.ac.in/"
  },
  {
    id: "ria-x",
    series: "NISM Series X-A & X-B",
    title: "Investment Adviser Certification Examination (Level 1 & Level 2)",
    hindiTitle: "SEBI रजिस्टर्ड इन्वेस्टमेंट एडवाइजर (RIA - Fee Only Planner)",
    category: "advisory",
    role: "SEBI Registered Investment Adviser (RIA), Chief Wealth Planner, Family Office Advisor",
    qualification: "Post Graduate in Finance / CA / CFA / CFP / MBA Finance + 5 साल का फाइनेंशियल मार्केट्स में अनुभव",
    examFee: "₹3,000 (Level 1) + ₹3,000 (Level 2) + GST",
    passingMarks: "60% (प्रत्येक लेवल में)",
    negativeMarking: "25% नेगेटिव मार्किंग",
    questionsCount: 100,
    duration: "2 घंटे प्रति लेवल",
    validity: "3 साल",
    syllabus: [
      "व्यक्तिगत वित्तीय नियोजन (Personal Financial Planning) और कैश फ्लो मैनेजमेंट",
      "रिटायरमेंट, बच्चों की उच्च शिक्षा और लाइफ गोल्स प्लानिंग",
      "इन्वेस्टमेंट, इंश्योरेंस, रियल एस्टेट, गोल्ड और टैक्स ऑप्टिमाइजेशन",
      "एस्टेट प्लानिंग, वसीयत (Will) और फैमिली ट्रस्ट फॉर्मेशन",
      "SEBI (Investment Advisers) Regulations, 2013 एवं कॉन्फ्लिक्ट ऑफ इंटरेस्ट गाइडलाइन्स"
    ],
    careerOpportunities: [
      "High-Net-Worth Individuals (HNIs) और कॉर्पोरेट लीडर्स के फैमिली ऑफिस को मैनेज करना",
      "बिना किसी ब्रोकरेज कमीशन के 100% ट्रांसपेरेंट फिक्स्ड कंसल्टिंग फीस चार्ज करना"
    ],
    earningModel: "वार्षिक रिटेनर फीस (₹25,000 से ₹1,00,000 प्रति क्लाइंट परिवार)। 50 बड़े क्लाइंट्स = ₹25 लाख से ₹50 लाख सालाना फिक्स्ड रेवेन्यू।",
    officialLink: "https://certifications.nism.ac.in/"
  },
  {
    id: "fno-viii",
    series: "NISM Series VIII",
    title: "Equity Derivatives Certification Examination",
    hindiTitle: "इक्विटी डेरिवेटिव्स (Futures & Options) डीलर",
    category: "derivatives",
    role: "F&O Trading Desk Dealer, Algo Trader, Prop Desk Execution Manager, Brokerage Dealer",
    qualification: "10+2 (12th Pass) या Graduate",
    examFee: "₹1,500 + GST",
    passingMarks: "60% (60 / 100 Marks)",
    negativeMarking: "25% नेगेटिव मार्किंग",
    questionsCount: 100,
    duration: "2 घंटे (120 मिनट)",
    validity: "3 साल",
    syllabus: [
      "डेरिवेटिव्स मार्केट का बेसिक्स और फ्यूचर्स एवं ऑप्शंस कॉन्ट्रैक्ट स्पेसिफिकेशन्स",
      "ऑप्शंस पे-ऑफ चार्ट्स, बुल/बेयर स्प्रेड्स, स्ट्रैडल, स्ट्रैंगल और आयरन कोंडोर",
      "ऑप्शंस ग्रीक्स (Delta, Gamma, Theta, Vega) और वोलैटिलिटी मैकेनिज्म",
      "क्लियरिंग, सेटलमेंट, SPAN मार्जिन, एक्सपोज़र मार्जिन और मार्क-टू-मार्केट (MTM)",
      "SEBI और एक्सचेंजों के रिस्क मैनेजमेंट सिस्टम और सर्विलांस रूल्स"
    ],
    careerOpportunities: [
      "स्टॉक ब्रोकरेज (Angel One, Kotak, ICICI Direct) में F&O टर्मिनल डीलर",
      "प्रॉप-ट्रेडिंग फर्म्स में आर्बिट्राज और एल्गो ट्रेडर (₹6L - ₹18L पैकेज + प्रॉफिट शेयर)"
    ],
    earningModel: "ब्रोकरेज डीलर सैलरी + मंथली वॉल्यूम इंसेंटिव्स या प्रॉप ट्रेडिंग प्रॉफिट शेयरिंग (15-30%)।",
    officialLink: "https://certifications.nism.ac.in/"
  },
  {
    id: "pms-xxi",
    series: "NISM Series XXI-A & XXI-B",
    title: "Portfolio Managers Certification Examination",
    hindiTitle: "PMS फंड मैनेजर और पोर्टफोलियो मैनेजर",
    category: "advisory",
    role: "PMS Portfolio Manager, AIF Fund Manager, AMC Chief Investment Officer (CIO)",
    qualification: "Post Graduate in Finance / CA / CFA / CS + 5 साल का फंड मैनेजमेंट अनुभव",
    examFee: "₹3,000 + GST",
    passingMarks: "60%",
    negativeMarking: "25% नेगेटिव मार्किंग",
    questionsCount: 100,
    duration: "2 घंटे",
    validity: "3 साल",
    syllabus: [
      "पोर्टफोलियो थ्योरी, मॉडर्न पोर्टफोलियो मैनेजमेंट (CAPM, Sharpe Ratio, Treynor Ratio)",
      "एसेट एलोकेशन स्ट्रैटेजीज और अल्टरनेटिव इन्वेस्टमेंट फंड्स (AIF Cat I, II, III)",
      "SEBI (Portfolio Managers) Regulations, 2020 और मिनिमम ₹50 लाख इन्वेस्टमेंट टिकट नॉर्म्स"
    ],
    careerOpportunities: [
      "PMS फर्म्स और हेज फंड्स में चीफ फंड मैनेजर (₹25L - ₹1 Cr+ पैकेज + 20% कैरी/परफॉर्मेंस फीस)"
    ],
    earningModel: "1-2% फिक्स्ड मैनेजमेंट फीस + 15-20% हाई वाटर मार्क परफॉर्मेंस इंसेंटिव।",
    officialLink: "https://certifications.nism.ac.in/"
  },
  {
    id: "curr-i",
    series: "NISM Series I",
    title: "Currency Derivatives Certification Examination",
    hindiTitle: "करेंसी डेरिवेटिव्स (Forex Trading) डीलर",
    category: "derivatives",
    role: "Forex Dealer, Import-Export Currency Hedging Specialist, Treasury Analyst",
    qualification: "10+2 / Graduate",
    examFee: "₹1,500 + GST",
    passingMarks: "60%",
    negativeMarking: "25% नेगेटिव मार्किंग",
    questionsCount: 100,
    duration: "2 घंटे",
    validity: "3 साल",
    syllabus: [
      "करेंसी मार्केट, USDINR, EURINR, GBPINR, JPYINR पेयर्स और एक्सचेंज ट्रेडेड फ्यूचर्स",
      "इंटरेस्ट रेट पैरिटी, RBI नीतियां और फॉरेक्स हेजिंग स्ट्रेटेजीज"
    ],
    careerOpportunities: [
      "बैंक ट्रेजरी डेस्क, कॉरपोरेट फॉरेक्स हेजिंग डिपार्टमेंट, ब्रोकरेज फॉरेक्स डीलर"
    ],
    earningModel: "ट्रेजरी मैनेजर सैलरी (₹7L - ₹18L) + कॉर्पोरेट हेजिंग कंसल्टिंग।",
    officialLink: "https://certifications.nism.ac.in/"
  },
  {
    id: "sorm-vii",
    series: "NISM Series VII",
    title: "Securities Operations and Risk Management (SORM)",
    hindiTitle: "सिक्योरिटीज ऑपरेशन्स और रिस्क मैनेजमेंट ऑफिसर",
    category: "operations",
    role: "Brokerage Back Office Manager, Compliance Officer, Trade Settlement Head",
    qualification: "10+2 / Graduate",
    examFee: "₹1,500 + GST",
    passingMarks: "60%",
    negativeMarking: "25% नेगेटिव मार्किंग",
    questionsCount: 100,
    duration: "2 घंटे",
    validity: "3 साल",
    syllabus: [
      "ट्रेड लाइफ साइकिल, ऑर्डर मैचिंग, क्लियरिंग कॉर्पोरेशन (NSCCL/ICCL) सेटलमेंट",
      "मार्जिन रिपोर्टिंग, क्लाइंट फंड सेग्रिगेशन और AML / KYC कंप्लायंस"
    ],
    careerOpportunities: [
      "हर सेबी रजिस्टर्ड स्टॉक ब्रोकर में कंप्लायंस एवं ऑपरेशन्स टीम में अनिवार्य पोस्टिंग"
    ],
    earningModel: "कंप्लायंस और ऑपरेशन्स स्पेशलिस्ट सैलरी (₹5L - ₹14L)।",
    officialLink: "https://certifications.nism.ac.in/"
  },
  {
    id: "dp-vi",
    series: "NISM Series VI",
    title: "Depository Operations Certification Examination",
    hindiTitle: "डिपॉजिटरी ऑपरेशन्स (CDSL / NSDL) एग्जीक्यूटिव",
    category: "operations",
    role: "Depository Participant (DP) Executive, Demat Account & Pledge Operations Head",
    qualification: "10+2 / Graduate",
    examFee: "₹1,500 + GST",
    passingMarks: "60%",
    negativeMarking: "25% नेगेटिव मार्किंग",
    questionsCount: 100,
    duration: "2 घंटे",
    validity: "3 साल",
    syllabus: [
      "CDSL और NSDL का ढांचा, डिमैट अकाउंट ओपनिंग, ट्रांसमिशन, नॉमिनेशन",
      "शेयर गिरवी (Pledge/Re-pledge) प्रक्रिया, कॉरपोरेट एक्शन्स (बोनस/डिविडेंड/स्प्लिट)"
    ],
    careerOpportunities: [
      "बैंकों और ब्रोकिंग फर्म्स के DP डिपार्टमेंट में अनिवार्य सर्टिफाइड कर्मचारी"
    ],
    earningModel: "DP हेड / ऑपरेशन्स सैलरी (₹4L - ₹10L)।",
    officialLink: "https://certifications.nism.ac.in/"
  },
  {
    id: "ib-ix",
    series: "NISM Series IX",
    title: "Merchant Banking Certification Examination",
    hindiTitle: "मर्चेंट बैंकिंग और इनवेस्टमेंट बैंकर (IPO Lead Manager)",
    category: "operations",
    role: "Investment Banker, IPO Lead Manager, Underwriter, M&A Deal Advisory",
    qualification: "Graduate / MBA Finance / CA / CFA",
    examFee: "₹1,500 + GST",
    passingMarks: "60%",
    negativeMarking: "25% नेगेटिव मार्किंग",
    questionsCount: 100,
    duration: "2 घंटे",
    validity: "3 साल",
    syllabus: [
      "IPO/FPO ड्राफ्ट रेड हेरिंग प्रॉस्पेक्टस (DRHP) फाइलिंग, बुक बिल्डिंग और प्राइस बैंड",
      "राइट्स इश्यू, ओपन ऑफर, बायबैक और SEBI (ICDR) रेगुलेशंस"
    ],
    careerOpportunities: [
      "इन्वेस्टमेंट बैंकिंग फर्म्स (Kotak IB, Morgan Stanley, Axis Capital) में एसोसिएट"
    ],
    earningModel: "इन्वेस्टमेंट बैंकिंग सैलरी (₹15L - ₹45L) + IPO सक्सेस फीस बोनस।",
    officialLink: "https://certifications.nism.ac.in/"
  },
  {
    id: "sebi-grade-a",
    series: "SEBI Grade A Officer",
    title: "SEBI Direct Recruitment - Assistant Manager (Grade A)",
    hindiTitle: "SEBI डायरेक्ट ऑफिसर परीक्षा (असिस्टेंट मैनेजर - ग्रेड A)",
    category: "sebi_direct",
    role: "Assistant Manager in SEBI (Headquarters Mumbai / Regional Offices)",
    qualification: "Master's Degree in any discipline / Law Degree / Engineering Degree / CA / CFA / CS",
    examFee: "₹1,000 + GST (General/OBC)",
    passingMarks: "कट-ऑफ आधारित मेरिट लिस्ट (Phase 1, Phase 2 & Interview)",
    negativeMarking: "25% नेगेटिव मार्किंग (Prelims & Mains)",
    questionsCount: 200,
    duration: "Phase 1 + Phase 2 (Descriptive + Domain)",
    validity: "परमानेंट क्लास-1 रेगुलेटरी सरकारी पद",
    syllabus: [
      "Phase 1: GA, इंग्लिश, क्वांट, रीजनिंग, कॉमर्स, अकाउंटेंसी, मैनेजमेंट, फाइनेंस, कॉस्टिंग, इकोनॉमिक्स",
      "Phase 2: इंग्लिश डिस्क्रिप्टिव राइटिंग (प्रिसी, एस्से) + डीप सिक्योरिटीज लॉ व फाइनेंस पेपर",
      "Phase 3: पर्सनल इंटरव्यू SEBI बोर्ड के सामने"
    ],
    careerOpportunities: [
      "भारत के सबसे प्रतिष्ठित फाइनेंशियल रेगुलेटर (SEBI) में क्लास-1 गैजेटेड समकक्ष पद",
      "डिवीजन चीफ, चीफ जनरल मैनेजर (CGM) और एग्जीक्यूटिव डायरेक्टर बनने का अवसर"
    ],
    earningModel: "मंथली ग्रॉस सैलरी ~₹1,55,000/माह + मुंबई/मेट्रो में SEBI का आलीशान फ्लैट + मेडिकल, चिल्ड्रन एजुकेशन व LTC (कुल CTC ~₹34 लाख/वर्ष)।",
    officialLink: "https://www.sebi.gov.in/"
  }
];

export default function SebiCertificationsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<ExamDetail>(SEBI_NISM_EXAMS[0]);
  const [userEducation, setUserEducation] = useState<string>("12th");

  const filteredExams = SEBI_NISM_EXAMS.filter((exam) => {
    const matchesCategory = activeCategory === "all" || exam.category === activeCategory;
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.hindiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 p-4 md:p-8 font-sans pb-28">
      {/* Top Breadcrumb & Title */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" /> SEBI & NISM Complete Career Directory
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
          SEBI और NISM के प्रमुख एग्जाम्स, योग्यता और करियर के बड़े अवसर
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-4xl leading-relaxed">
          शेयर मार्केट, म्यूचुअल फंड और एडवाइजरी इंडस्ट्री में कानूनी रूप से काम करने के लिए NISM (National Institute of Securities Markets) और SEBI के सभी सर्टिफिकेशन्स, एग्जाम फीस, पासिंग मार्क्स और कमाई के मॉडल की पूरी जानकारी।
        </p>
      </div>

      {/* Interactive Quick Qualification Finder */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 font-bold text-xs rounded-full uppercase">
              1-Click Eligibility Check
            </span>
            <h3 className="text-lg md:text-xl font-bold text-white mt-2">
              आपकी पढ़ाई (Qualification) के हिसाब से आप कौन सा एग्जाम दे सकते हैं?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">अपनी डिग्री चुनें और तुरंत देखें कि आपके लिए सबसे बेस्ट सर्टिफिकेशन कौन सा है।</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "12वीं पास (10+2)", val: "12th" },
              { label: "Graduate (Any Field)", val: "grad" },
              { label: "Post Graduate / MBA / CA / CFA", val: "pg" }
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setUserEducation(item.val)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  userEducation === item.val
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3">
          {userEducation === "12th" && (
            <>
              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-emerald-500/30">
                <div className="text-xs font-bold text-emerald-400">👑 NISM Series V-A (MFD)</div>
                <p className="text-[11px] text-slate-300 mt-1">म्यूचुअल फंड डिस्ट्रीब्यूटर बनकर लाइफटाइम ट्रेल कमीशन कमाएं।</p>
              </div>
              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-blue-500/30">
                <div className="text-xs font-bold text-blue-400">⚡ NISM Series VIII (F&O)</div>
                <p className="text-[11px] text-slate-300 mt-1">ब्रोकरेज फर्म में डेरिवेटिव्स और टर्मिनल डीलर बनें।</p>
              </div>
              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-purple-500/30">
                <div className="text-xs font-bold text-purple-400">🏛️ NISM Series VI & VII</div>
                <p className="text-[11px] text-slate-300 mt-1">डिपॉजिटरी (CDSL/NSDL) और ब्रोकर बैक-ऑफिस ऑपरेशन में जॉब।</p>
              </div>
            </>
          )}

          {userEducation === "grad" && (
            <>
              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-emerald-500/30">
                <div className="text-xs font-bold text-emerald-400">🎯 NISM Series XV (Research Analyst)</div>
                <p className="text-[11px] text-slate-300 mt-1">लीगल स्टॉक रिकमेंडेशन, टारगेट और मॉडल पोर्टफोलियो पब्लिश करें।</p>
              </div>
              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-amber-500/30">
                <div className="text-xs font-bold text-amber-400">👑 NISM Series V-A (MFD)</div>
                <p className="text-[11px] text-slate-300 mt-1">बड़े HNI इन्वेस्टर्स के वेल्थ पोर्टफोलियो और SIPs हैंडल करें।</p>
              </div>
              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-indigo-500/30">
                <div className="text-xs font-bold text-indigo-400">🏢 SEBI Grade A (Direct Officer)</div>
                <p className="text-[11px] text-slate-300 mt-1">Law/Engineering ग्रेजुएट्स सीधे SEBI असिस्टेंट मैनेजर बन सकते हैं।</p>
              </div>
            </>
          )}

          {userEducation === "pg" && (
            <>
              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-emerald-500/30">
                <div className="text-xs font-bold text-emerald-400">💎 NISM Series X-A & X-B (SEBI RIA)</div>
                <p className="text-[11px] text-slate-300 mt-1">लाखों की सालाना फीस पर HNIs के लिए उच्च स्तरीय वित्तीय योजना बनाएं।</p>
              </div>
              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-blue-500/30">
                <div className="text-xs font-bold text-blue-400">📈 NISM Series XXI (Portfolio Manager)</div>
                <p className="text-[11px] text-slate-300 mt-1">PMS और AIF फंड मैनेजर बनकर ₹50L+ इन्वेस्टमेंट पोर्टफोलियो चलाएं।</p>
              </div>
              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-amber-500/30">
                <div className="text-xs font-bold text-amber-400">🏛️ SEBI Grade A (Direct Officer)</div>
                <p className="text-[11px] text-slate-300 mt-1">किसी भी स्ट्रीम में Master's / CA / CFA धारक सीधे अधिकारी बन सकते हैं।</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full md:w-auto">
          {[
            { id: "all", label: "All Exams (सभी 10+ एग्जाम्स)" },
            { id: "distribution", label: "Distribution & MFD" },
            { id: "advisory", label: "Research (RA) & Advisory (RIA)" },
            { id: "derivatives", label: "F&O & Currency Trading" },
            { id: "operations", label: "Operations & Merchant Banking" },
            { id: "sebi_direct", label: "SEBI Direct Officer (Grade A)" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="सर्च करें (MFD, RA, RIA, F&O)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Main Grid: Left List + Right Detailed Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Exam Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredExams.map((exam) => {
            const isSelected = selectedExam.id === exam.id;
            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#111827] border-amber-500 shadow-lg shadow-amber-500/10"
                    : "bg-[#0B0F19] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-md text-[10px] font-bold text-amber-400 uppercase">
                      {exam.series}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1.5">{exam.hindiTitle}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{exam.title}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${isSelected ? "text-amber-400 translate-x-1" : "text-slate-600"}`} />
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span>फीस: <strong className="text-slate-200">{exam.examFee}</strong></span>
                  <span>पासिंग: <strong className="text-emerald-400">{exam.passingMarks.split(" ")[0]}</strong></span>
                  <span>वैधता: <strong className="text-slate-200">{exam.validity.split(" ")[0]}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Deep Detailed View */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 font-bold text-xs uppercase">
                {selectedExam.series}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white mt-2">{selectedExam.hindiTitle}</h2>
              <p className="text-xs text-slate-400 mt-1">{selectedExam.title}</p>
            </div>
            <a
              href={selectedExam.officialLink}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 shrink-0"
            >
              NISM पोर्टल पर अप्लाई करें <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">एग्जाम फीस</span>
              <div className="text-sm font-black text-white mt-0.5">{selectedExam.examFee}</div>
            </div>
            <div className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">पासिंग मार्क्स</span>
              <div className="text-sm font-black text-emerald-400 mt-0.5">{selectedExam.passingMarks}</div>
            </div>
            <div className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">सवालों की संख्या</span>
              <div className="text-sm font-black text-white mt-0.5">{selectedExam.questionsCount} MCQs ({selectedExam.duration})</div>
            </div>
            <div className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">नेगेटिव मार्किंग</span>
              <div className="text-sm font-black text-rose-400 mt-0.5">{selectedExam.negativeMarking}</div>
            </div>
          </div>

          {/* Role & Qualification */}
          <div className="space-y-3">
            <div className="p-4 bg-[#0B0F19] rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                <GraduationCap className="w-4 h-4" /> अनिवार्य शैक्षणिक योग्यता (Qualification):
              </div>
              <p className="text-xs md:text-sm text-slate-200 font-semibold">{selectedExam.qualification}</p>
            </div>

            <div className="p-4 bg-[#0B0F19] rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
                <Briefcase className="w-4 h-4" /> पास करने के बाद बनने वाला रोल (Job / Business Role):
              </div>
              <p className="text-xs md:text-sm text-slate-200 font-semibold">{selectedExam.role}</p>
            </div>
          </div>

          {/* Syllabus */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" /> इस एग्जाम के सिलेबस में क्या पढ़ाया जाता है?
            </h4>
            <div className="space-y-2">
              {selectedExam.syllabus.map((item, idx) => (
                <div key={idx} className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800 flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career & Earning Potential */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <DollarSign className="w-4 h-4" /> करियर के अवसर और कमाई का मॉडल (Earning Potential)
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-white">कमाई का जरिया:</div>
              <p className="text-slate-300 leading-relaxed">{selectedExam.earningModel}</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <div className="font-semibold text-white text-xs mb-1.5">करियर के रास्ते:</div>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {selectedExam.careerOpportunities.map((opp, idx) => (
                  <li key={idx}>{opp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* How to Register Step-by-Step */}
          <div className="p-4 bg-[#0B0F19] rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" /> एग्जाम देने की 4 आसान स्टेप्स (Registration Steps)
            </h4>
            <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>NISM की आधिकारिक वेबसाइट <strong className="text-slate-200">certifications.nism.ac.in</strong> पर जाकर फ्री अकाउंट बनाएं।</li>
              <li>अपना मनपसंद एग्जाम (जैसे NISM Series V-A या XV) और पास का टेस्ट सेंटर (NSE/TCS Center) या Online Proctored स्लॉट चुनें।</li>
              <li>ऑनलाइन फीस पे करें और NISM की ऑफिशियल PDF स्टडी वर्कबुक तुरंत डाउनलोड करें।</li>
              <li>एग्जाम देने के तुरंत बाद स्क्रीन पर स्कोरकार्ड और डिजिटल सर्टिफिकेट जनरेट हो जाता है।</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
