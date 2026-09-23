/**
 * VENDOR UDHAR SYSTEM — VALIDATION & DEDUPLICATION UTILITIES
 * 
 * Strict format checkers and identity matchers for Indian B2B trade.
 */

export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/**
 * Strips formatting, country codes (+91 / 0) and leaves pure 10 digits.
 */
export function normalizePhoneNumber(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.substring(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.substring(1);
  }
  return digits;
}

/**
 * Validates 10-digit Indian mobile number.
 */
export function isValidIndianPhone(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return INDIAN_PHONE_REGEX.test(normalized);
}

/**
 * Normalizes and validates 15-digit GSTIN format.
 */
export function normalizeGstin(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().toUpperCase();
  return cleaned.length > 0 ? cleaned : null;
}

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function isValidGstin(gstin: string): boolean {
  const cleaned = normalizeGstin(gstin);
  if (!cleaned) return false;
  return GSTIN_REGEX.test(cleaned);
}

/**
 * Normalizes and validates 10-character Indian PAN format.
 */
export function normalizePan(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().toUpperCase();
  return cleaned.length > 0 ? cleaned : null;
}

export function isValidPan(pan: string): boolean {
  const cleaned = normalizePan(pan);
  if (!cleaned) return false;
  return PAN_REGEX.test(cleaned);
}

export interface VendorIdentityCheckResult<T> {
  isMatch: boolean;
  matchType?: 'phone' | 'gstin';
  existingVendor?: T;
  message?: string;
}

/**
 * Deduplication Matcher:
 * Checks if a vendor already exists in the list by phone number or GSTIN.
 */
export function findExistingVendor<T extends { phone?: string; phone_number?: string; party_gstin?: string; gst_number?: string; person_name?: string; vendor_name?: string }>(
  phone: string,
  gstin: string | undefined,
  existingList: T[]
): VendorIdentityCheckResult<T> {
  const normPhone = normalizePhoneNumber(phone);
  const normGst = normalizeGstin(gstin);

  // 1. Phone match takes top priority (mandatory unique identity)
  if (normPhone && normPhone.length === 10) {
    const matchByPhone = existingList.find(v => {
      const vPhone = normalizePhoneNumber(v.phone || v.phone_number || '');
      return vPhone === normPhone;
    });

    if (matchByPhone) {
      const name = matchByPhone.person_name || matchByPhone.vendor_name || 'मौजूदा वेंडर';
      return {
        isMatch: true,
        matchType: 'phone',
        existingVendor: matchByPhone,
        message: `✅ मौजूदा वेंडर मिला: "${name}" (मोबाइल: ${normPhone}) — यही वेंडर लिंक होगा।`
      };
    }
  }

  // 2. GSTIN match
  if (normGst && normGst.length === 15) {
    const matchByGst = existingList.find(v => {
      const vGst = normalizeGstin(v.party_gstin || v.gst_number);
      return vGst === normGst;
    });

    if (matchByGst) {
      const name = matchByGst.person_name || matchByGst.vendor_name || 'मौजूदा वेंडर';
      return {
        isMatch: true,
        matchType: 'gstin',
        existingVendor: matchByGst,
        message: `✅ GSTIN रिकॉर्ड मिला: "${name}" (GSTIN: ${normGst}) — यही वेंडर लिंक होगा।`
      };
    }
  }

  return { isMatch: false };
}

export interface TrustScoreTransaction {
  id?: string;
  status?: string;
  pipeline_stage?: string;
  delivery_feedback?: 'all_ok' | 'discrepancy_reported';
  promised_tenure_days: number;
  actual_settled_days?: number;
  actual_settled_date?: string;
  start_date?: string;
  is_dispute_resolved?: boolean;
  our_business_gstin?: string;
  our_business_name?: string;
}

/**
 * Task 3: Checks if transaction is in active, unresolved dispute.
 * Active disputes are strictly neutral and excluded from trust score calculations.
 */
export function isTransactionActiveDispute(tx: {
  status?: string;
  pipeline_stage?: string;
  is_dispute_resolved?: boolean;
}): boolean {
  if (tx.is_dispute_resolved) return false;
  return tx.status === 'disputed' || tx.pipeline_stage === 'disputed';
}

/**
 * Task 3: Calculate Merchant Delivery Trust with Dispute Exclusion.
 * Active unresolved disputes are excluded so neither merchant nor buyer is unfairly penalized.
 */
export function calculateDeliveryTrustScore(transactions: TrustScoreTransaction[]): number {
  const eligible = transactions.filter(tx => 
    tx.delivery_feedback && !isTransactionActiveDispute(tx)
  );
  if (eligible.length === 0) return 100;

  const okCount = eligible.filter(tx => tx.delivery_feedback === 'all_ok').length;
  return Math.round((okCount / eligible.length) * 100);
}

/**
 * Task 3: Calculate Customer Repayment Trust with Dispute Exclusion.
 * Only settles and confirms records where dispute is not pending.
 */
export function calculateRepaymentTrustScore(transactions: TrustScoreTransaction[]): number {
  const eligible = transactions.filter(tx => 
    tx.actual_settled_days !== undefined && 
    tx.status === 'settled' && 
    !isTransactionActiveDispute(tx)
  );
  if (eligible.length === 0) return 100;

  const onTimeCount = eligible.filter(tx => (tx.actual_settled_days || 0) <= tx.promised_tenure_days).length;
  return Math.round((onTimeCount / eligible.length) * 100);
}

/**
 * Task 4: Recency-Weighted Trust Score Formula
 * - Last 6 months (180 days): 70% weight
 * - Older than 6 months: 30% weight
 */
export function calculateRecencyWeightedScore(transactions: TrustScoreTransaction[]): {
  score: number;
  totalTransactions: number;
  onTimeCount: number;
  delayedCount: number;
  activeDisputesExcluded: number;
} {
  const now = new Date().getTime();
  const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;

  let activeDisputesExcluded = 0;
  const eligible: { tx: TrustScoreTransaction; isOnTime: boolean; isRecent: boolean }[] = [];

  for (const tx of transactions) {
    if (isTransactionActiveDispute(tx)) {
      activeDisputesExcluded++;
      continue;
    }
    if (tx.actual_settled_days === undefined && tx.status !== 'settled') {
      continue;
    }

    const txDate = tx.actual_settled_date || tx.start_date || '';
    const txTime = txDate ? new Date(txDate).getTime() : now;
    const isRecent = (now - txTime) <= SIX_MONTHS_MS;
    const isOnTime = (tx.actual_settled_days || 0) <= tx.promised_tenure_days;

    eligible.push({ tx, isOnTime, isRecent });
  }

  if (eligible.length === 0) {
    return { score: 100, totalTransactions: 0, onTimeCount: 0, delayedCount: 0, activeDisputesExcluded };
  }

  const recentList = eligible.filter(e => e.isRecent);
  const olderList = eligible.filter(e => !e.isRecent);

  const onTimeCount = eligible.filter(e => e.isOnTime).length;
  const delayedCount = eligible.length - onTimeCount;

  const recentScore = recentList.length > 0
    ? (recentList.filter(e => e.isOnTime).length / recentList.length) * 100
    : null;

  const olderScore = olderList.length > 0
    ? (olderList.filter(e => e.isOnTime).length / olderList.length) * 100
    : null;

  let finalScore = 100;
  if (recentScore !== null && olderScore !== null) {
    finalScore = Math.round(recentScore * 0.70 + olderScore * 0.30);
  } else if (recentScore !== null) {
    finalScore = Math.round(recentScore);
  } else if (olderScore !== null) {
    finalScore = Math.round(olderScore);
  }

  return {
    score: finalScore,
    totalTransactions: eligible.length,
    onTimeCount,
    delayedCount,
    activeDisputesExcluded
  };
}

export interface PartyTrustSummary {
  partyKey: string;
  personName: string;
  phone: string;
  partyGstin?: string;
  address?: string;
  vendorCount: number;
  totalTransactions: number;
  onTimeCount: number;
  delayedCount: number;
  activeDisputesCount: number;
  weightedScore: number;
  hasEnoughData: boolean; // Minimum 2 distinct vendors required per Task 4
}

/**
 * Task 4: Aggregates credit performance data across multiple vendors for each party.
 * Enforces privacy: No raw amounts, bilty numbers, or vendor identities are exposed.
 * Enforces business rule: Minimum 2 vendors required to consider the score valid.
 */
export function aggregateCrossVendorPartySummaries(contacts: any[]): PartyTrustSummary[] {
  const partyMap = new Map<string, {
    personName: string;
    phone: string;
    partyGstin?: string;
    address?: string;
    vendors: Set<string>;
    transactions: any[];
  }>();

  for (const c of contacts) {
    const key = normalizePhoneNumber(c.phone || '') || normalizeGstin(c.party_gstin || '') || c.person_name;
    if (!key) continue;

    const vendorIdentifier = c.our_business_gstin || c.our_business_name || 'merchant_self';

    if (!partyMap.has(key)) {
      partyMap.set(key, {
        personName: c.person_name,
        phone: c.phone || '',
        partyGstin: c.party_gstin,
        address: c.address,
        vendors: new Set([vendorIdentifier]),
        transactions: [c]
      });
    } else {
      const entry = partyMap.get(key)!;
      entry.vendors.add(vendorIdentifier);
      entry.transactions.push(c);
      if (!entry.address && c.address) entry.address = c.address;
      if (!entry.partyGstin && c.party_gstin) entry.partyGstin = c.party_gstin;
    }
  }

  const summaries: PartyTrustSummary[] = [];

  partyMap.forEach((data, key) => {
    const vendorCount = data.vendors.size;
    const { score, totalTransactions, onTimeCount, delayedCount, activeDisputesExcluded } = 
      calculateRecencyWeightedScore(data.transactions);

    summaries.push({
      partyKey: key,
      personName: data.personName,
      phone: data.phone,
      partyGstin: data.partyGstin,
      address: data.address,
      vendorCount,
      totalTransactions,
      onTimeCount,
      delayedCount,
      activeDisputesCount: activeDisputesExcluded,
      weightedScore: score,
      hasEnoughData: vendorCount >= 2
    });
  });

  return summaries;
}
