'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ParsedVoiceExpense {
  amount?: number;
  category?: string;
  note?: string;
  member_name?: string;
}

export function useVoiceInput(onParsed?: (data: ParsedVoiceExpense) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSupported(true);
    }
  }, []);

  const parseVoiceText = (text: string): ParsedVoiceExpense => {
    const lower = text.toLowerCase();
    const result: ParsedVoiceExpense = { note: text };

    const matchAmt = lower.match(/(?:rupaye|rs|inr|₹|s|^)(d+(?:,d+)*(?:.d+)?)/i) || lower.match(/(d+)/);
    if (matchAmt && matchAmt[1]) {
      result.amount = parseFloat(matchAmt[1].replace(/,/g, ''));
    }

    if (lower.includes('sabzi') || lower.includes('ration') || lower.includes('grocery')) {
      result.category = 'Sabzi/Ration';
    } else if (lower.includes('petrol') || lower.includes('fuel') || lower.includes('diesel')) {
      result.category = 'Petrol/Fuel';
    } else if (lower.includes('bill') || lower.includes('bijli') || lower.includes('recharge')) {
      result.category = 'Bills & Recharge';
    } else if (lower.includes('shopping') || lower.includes('kapde') || lower.includes('amazon')) {
      result.category = 'Shopping';
    } else if (lower.includes('dawai') || lower.includes('medicine') || lower.includes('doctor')) {
      result.category = 'Health/Medicine';
    } else if (lower.includes('fees') || lower.includes('tuition') || lower.includes('school') || lower.includes('college')) {
      result.category = 'Education';
    } else if (lower.includes('salary') || lower.includes('kamai')) {
      result.category = 'Salary';
    }

    if (lower.includes('papa')) result.member_name = 'Papa';
    else if (lower.includes('mummy')) result.member_name = 'Mummy';
    else if (lower.includes('rohan')) result.member_name = 'Rohan';
    else if (lower.includes('priya')) result.member_name = 'Priya';

    return result;
  };

  const startListening = useCallback(() => {
    if (!isSupported) {
      alert('Aapke browser me Voice Speech Recognition support nahi hai. Chrome ya Edge use karein.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        const parsed = parseVoiceText(text);
        if (onParsed) onParsed(parsed);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  }, [isSupported, onParsed]);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    parseVoiceText,
  };
}
