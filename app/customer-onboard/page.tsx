'use client';

import React, { useState } from 'react';
import { 
  Store, CheckCircle2, ShieldCheck, MapPin, User, Phone, 
  FileText, CreditCard, Building2, Check, ArrowRight
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import Link from 'next/link';

export default function CustomerOnboardPublicPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [partnerType, setPartnerType] = useState('b2b_dealer');
  const [tradeName, setTradeName] = useState('');
  const [constitution, setConstitution] = useState('proprietorship');
  const [gstin, setGstin] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [businessStartedYear, setBusinessStartedYear] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('छत्तीसगढ़');
  const [pincode, setPincode] = useState('');
  const [premisesType, setPremisesType] = useState<'owned' | 'rented'>('owned');

  // Owner KYC
  const [ownerName, setOwnerName] = useState('');
  const [ownerDob, setOwnerDob] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerWhatsapp, setOwnerWhatsapp] = useState('');
  const [ownerAadhar, setOwnerAadhar] = useState('');
  const [ownerResidentialAddress, setOwnerResidentialAddress] = useState('');

  // Business Profile & Bank
  const [annualTurnoverBracket, setAnnualTurnoverBracket] = useState('20L_to_1Cr');
  const [dealingProducts, setDealingProducts] = useState('');
  const [requestedCreditLimit, setRequestedCreditLimit] = useState<number | ''>('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [reference1Name, setReference1Name] = useState('');
  const [reference1Phone, setReference1Phone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeName || !ownerName || !ownerPhone || !city) {
      alert('कृपया दुकान का नाम, मालिक का नाम, फोन और शहर अनिवार्य रूप से भरें।');
      return;
    }

    const newRecord = {
      id: `kyc-self-${Date.now()}`,
      partnerType,
      tradeName,
      legalEntityName: tradeName,
      constitution,
      gstin: gstin.toUpperCase(),
      panNumber: panNumber.toUpperCase(),
      businessStartedYear,
      shopAddress,
      landmark,
      city,
      state,
      pincode,
      premisesType,
      ownerName,
      ownerDob,
      ownerPhone,
      ownerWhatsapp: ownerWhatsapp || ownerPhone,
      ownerAadhar,
      ownerResidentialAddress,
      annualTurnoverBracket,
      dealingProducts,
      requestedCreditLimit: Number(requestedCreditLimit) || 0,
      approvedCreditLimit: 0,
      creditPaymentDays: 15,
      securityChequeGiven: false,
      bankName,
      bankAccountNumber,
      bankIfsc,
      reference1Name,
      reference1Phone,
      kycStatus: 'pending_review',
      createdAt: new Date().toISOString().split('T')[0],
      isSelfSubmitted: true
    };

    // Save to localStorage
    try {
      const existing = localStorage.getItem('fwa_customer_kyc_v1');
      let records = [];
      if (existing) {
        records = JSON.parse(existing);
      }
      records.unshift(newRecord);
      localStorage.setItem('fwa_customer_kyc_v1', JSON.stringify(records));
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-navy text-gold rounded-2xl shadow-md">
            <Store size={28} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            पार्टनर व डीलरशिप डिजिटल KYC ऑनबोर्डिंग
          </h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            कृपया अपनी फर्म, दुकान एवं मालिक की सही जानकारी भरें ताकि आपका अधिकृत डीलर खाता व क्रेडिट लिमिट शीघ्र स्वीकृत हो सके।
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                KYC आवेदन सफलतापूर्वक जमा हुआ!
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                धन्यवाद <strong>{ownerName}</strong> जी। आपकी फर्म <strong>{tradeName}</strong> का विवरण हमारे मुख्य कार्यालय में समीक्षा हेतु सुरक्षित दर्ज हो चुका है।
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">पार्टनर:</span>
                <span className="font-bold text-slate-800">{tradeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">स्थान:</span>
                <span className="font-semibold text-slate-800">{city}, {state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">समीक्षा स्थिति:</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                  समीक्षा जारी (Pending Verification)
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/business?tab=customer-kyc"
                className="inline-flex items-center gap-1.5 text-xs text-navy font-bold hover:underline"
              >
                <span>बिजनेस डैशबोर्ड में विवरण देखें</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
            {/* Steps Tab */}
            <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-center py-2.5">
              <span className={`py-1 ${formStep === 1 ? 'text-navy font-bold border-b-2 border-navy' : 'text-slate-500'}`}>
                1. फर्म व दुकान
              </span>
              <span className={`py-1 ${formStep === 2 ? 'text-navy font-bold border-b-2 border-navy' : 'text-slate-500'}`}>
                2. मालिक पहचान
              </span>
              <span className={`py-1 ${formStep === 3 ? 'text-navy font-bold border-b-2 border-navy' : 'text-slate-500'}`}>
                3. व्यापार व बैंक
              </span>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              {/* STEP 1 */}
              {formStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      पार्टनरशिप श्रेणी (Category) *
                    </label>
                    <select
                      value={partnerType}
                      onChange={e => setPartnerType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-navy"
                    >
                      <option value="b2b_dealer">B2B अधिकृत डीलर (Dealer)</option>
                      <option value="distributor">थोक वितरक (Distributor / Stockist)</option>
                      <option value="retailer">खुदरा व्यापारी (Retailer)</option>
                      <option value="franchise">फ्रैंचाइज़ी पार्टनर (Franchisee)</option>
                      <option value="b2c_high_value">थोक नियमित ग्राहक</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      दुकान / फर्म का नाम (Trade Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="जैसे: श्री बालाजी हार्डवेयर"
                      value={tradeName}
                      onChange={e => setTradeName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-navy"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        GSTIN नंबर (यदि उपलब्ध हो)
                      </label>
                      <input
                        type="text"
                        placeholder="15 डिजिट GST"
                        value={gstin}
                        onChange={e => setGstin(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 uppercase"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        कब से काम शुरू किया है? (Year)
                      </label>
                      <input
                        type="text"
                        placeholder="जैसे: 2015 या 10 साल से"
                        value={businessStartedYear}
                        onChange={e => setBusinessStartedYear(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      दुकान / ऑफिस का पूरा पता *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="दुकान नंबर, मार्केट का नाम, सड़क"
                      value={shopAddress}
                      onChange={e => setShopAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-navy"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">शहर / कस्बा *</label>
                      <input
                        type="text"
                        required
                        placeholder="शहर"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">पिनकोड</label>
                      <input
                        type="text"
                        placeholder="6 अंक"
                        value={pincode}
                        onChange={e => setPincode(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">दुकान स्वामित्व</label>
                    <div className="flex gap-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="pub_premises"
                          checked={premisesType === 'owned'}
                          onChange={() => setPremisesType('owned')}
                          className="accent-navy"
                        />
                        <span>खुद की दुकान (Owned)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="pub_premises"
                          checked={premisesType === 'rented'}
                          onChange={() => setPremisesType('rented')}
                          className="accent-navy"
                        />
                        <span>किराये की दुकान (Rented)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-5 py-2.5 bg-navy text-gold-soft font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <span>अगला: मालिक पहचान</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {formStep === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        प्रोपराइटर / मालिक का नाम *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="मालिक का पूरा नाम"
                        value={ownerName}
                        onChange={e => setOwnerName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        जन्म तिथि (Date of Birth)
                      </label>
                      <input
                        type="date"
                        value={ownerDob}
                        onChange={e => setOwnerDob(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        मोबाइल नंबर (Phone) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10 अंकों का फोन नंबर"
                        value={ownerPhone}
                        onChange={e => setOwnerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        व्हाट्सएप नंबर
                      </label>
                      <input
                        type="tel"
                        placeholder="WhatsApp नंबर"
                        value={ownerWhatsapp}
                        onChange={e => setOwnerWhatsapp(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        मालिक का आधार कार्ड नंबर
                      </label>
                      <input
                        type="text"
                        placeholder="12 अंकों का आधार"
                        value={ownerAadhar}
                        onChange={e => setOwnerAadhar(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        पैन नंबर (PAN Number)
                      </label>
                      <input
                        type="text"
                        placeholder="10 अंकों का पैन"
                        value={panNumber}
                        onChange={e => setPanNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      मालिक का घर का स्थायी पता
                    </label>
                    <textarea
                      rows={2}
                      placeholder="आवासीय पता"
                      value={ownerResidentialAddress}
                      onChange={e => setOwnerResidentialAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      पीछे
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="px-5 py-2.5 bg-navy text-gold-soft font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <span>अगला: व्यापार व बैंक</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {formStep === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      वार्षिक टर्नओवर (Annual Turnover)
                    </label>
                    <select
                      value={annualTurnoverBracket}
                      onChange={e => setAnnualTurnoverBracket(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                    >
                      <option value="below_20L">₹20 लाख से कम</option>
                      <option value="20L_to_1Cr">₹20 लाख से ₹1 करोड़</option>
                      <option value="1Cr_to_5Cr">₹1 करोड़ से ₹5 करोड़</option>
                      <option value="above_5Cr">₹5 करोड़ से अधिक</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      मांगी गई उधार सीमा (Requested Credit Limit ₹)
                    </label>
                    <input
                      type="number"
                      placeholder="जैसे: 200000"
                      value={requestedCreditLimit}
                      onChange={e => setRequestedCreditLimit(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">बैंक का नाम</label>
                      <input
                        type="text"
                        placeholder="जैसे: SBI / HDFC"
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">बैंक खाता संख्या</label>
                      <input
                        type="text"
                        placeholder="खाता नंबर"
                        value={bankAccountNumber}
                        onChange={e => setBankAccountNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      व्यापारिक रेफरेंस (अन्य फर्म का नाम व मोबाइल)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="रेफरेंस फर्म का नाम"
                        value={reference1Name}
                        onChange={e => setReference1Name(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                      <input
                        type="tel"
                        placeholder="रेफरेंस मोबाइल नंबर"
                        value={reference1Phone}
                        onChange={e => setReference1Phone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      पीछे
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <CheckCircle2 size={15} />
                      <span>KYC फॉर्म सबमिट करें</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
