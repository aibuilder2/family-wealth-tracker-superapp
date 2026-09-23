/**
 * VENDOR UDHAR SYSTEM — TERMS & CONDITIONS TEMPLATES
 * 
 * Standard Indian B2B trade agreement templates + Custom Template persistence.
 */

export interface UdharTermsTemplate {
  id: string;
  title: string;
  content: string;
  isDefault?: boolean;
}

export const PREBUILT_UDHAR_TEMPLATES: UdharTermsTemplate[] = [
  {
    id: 't-30-days',
    title: '⚡ 30 दिन में पूर्ण भुगतान (1.5% विलंब शुल्क)',
    content: 'तय तारीख (30 दिन) के अंदर पूरा भुगतान अनिवार्य है। विलंब होने पर 1.5% प्रति माह की दर से हर्जाना/विलंब शुल्क देय होगा।',
    isDefault: true
  },
  {
    id: 't-weekly-installment',
    title: '🗓️ साप्ताहिक किश्त (25% प्रति सप्ताह)',
    content: 'कुल उधारी का भुगतान 4 बराबर साप्ताहिक किश्तों (25% प्रति सप्ताह) में नियत तिथियों पर अनिवार्य रूप से चुकता किया जाएगा।',
    isDefault: false
  },
  {
    id: 't-delivery-claim',
    title: '📦 माल प्राप्ति पर 3 दिन में क्लेम',
    content: 'माल प्राप्त होने के 3 कार्यदिवसों के भीतर गुणवत्ता व गिनती का सत्यापन अनिवार्य है। 3 दिन पश्चात माल वापसी या कटौती मान्य नहीं होगी।',
    isDefault: false
  },
  {
    id: 't-court-jurisdiction',
    title: '⚖️ स्थानीय न्यायालय क्षेत्राधिकार',
    content: 'यह आपसी व्यापारिक साख पर आधारित उधार है। किसी भी विवाद या भुगतान में चूक की स्थिति में केवल स्थानीय दीवानी न्यायालय का क्षेत्राधिकार मान्य होगा।',
    isDefault: false
  },
  {
    id: 't-3way-settle',
    title: '🌾 3-Way चुकता (कैश / माल / सेवा)',
    content: 'नियत तारीख तक नकद भुगतान न होने पर आपसी सहमति अनुसार किराना/अनाज (माल) अथवा मजदूरी/सेवा द्वारा हिसाब काटा जा सकेगा।',
    isDefault: false
  }
];

const STORAGE_KEY = 'fwa_custom_udhar_templates_v1';

export function getCustomTemplates(): UdharTermsTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomTemplate(content: string): UdharTermsTemplate | null {
  if (typeof window === 'undefined') return null;
  const trimmed = content.trim();
  if (!trimmed || trimmed.length < 10) return null;

  // Check if identical content exists in prebuilt or custom
  const isPrebuilt = PREBUILT_UDHAR_TEMPLATES.some(t => t.content === trimmed);
  if (isPrebuilt) return null;

  const existing = getCustomTemplates();
  const alreadyExists = existing.some(t => t.content === trimmed);
  if (alreadyExists) return null;

  const titlePreview = trimmed.length > 40 ? trimmed.substring(0, 38) + '...' : trimmed;
  const newTemplate: UdharTermsTemplate = {
    id: 'custom-' + Date.now(),
    title: `📝 ${titlePreview}`,
    content: trimmed,
    isDefault: false
  };

  const updated = [newTemplate, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  return newTemplate;
}
