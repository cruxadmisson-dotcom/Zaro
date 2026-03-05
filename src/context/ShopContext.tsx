'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

// Typen definieren
type Currency = 'EUR' | 'USD';
type Language = 'de' | 'en';

interface ShopContextType {
  currency: Currency;
  language: Language;
  t: (key: string) => string; // Funktion für Übersetzungen
  formatPrice: (priceInEur: number) => string; // Funktion für Preis-Formatierung
  toggleLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [language, setLanguage] = useState<Language>('de');
  const [isLoading, setIsLoading] = useState(true);

  // Einfacher Wechselkurs (könnte man später per API holen)
  const EXCHANGE_RATE = 1.10; // 1 EUR = 1.10 USD

  useEffect(() => {
    // 1. Check LocalStorage first
    const savedLang = localStorage.getItem('shopLanguage') as Language;
    const savedCurrency = localStorage.getItem('shopCurrency') as Currency;

    if (savedLang && savedCurrency) {
      setLanguage(savedLang);
      setCurrency(savedCurrency);
      setIsLoading(false);
      return;
    }

    // 2. IP-Check if no saved preference
    const checkLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        
        // Wenn Land USA oder UK ist -> Englisch & USD/GBP (hier nur USD vereinfacht)
        if (data.country_code === 'US' || data.country_code === 'GB' || data.country_code === 'CA') {
          setLanguage('en');
          setCurrency('USD');
        } else {
          // Standard: Deutsch & Euro
          setLanguage('de');
          setCurrency('EUR');
        }
      } catch (error) {
        console.error('Konnte Standort nicht ermitteln, nutze Standard (DE).');
      } finally {
        setIsLoading(false);
      }
    };

    checkLocation();
  }, []);

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
    const newCurrency = lang === 'en' ? 'USD' : 'EUR';
    setCurrency(newCurrency);
    
    // Persist to LocalStorage
    localStorage.setItem('shopLanguage', lang);
    localStorage.setItem('shopCurrency', newCurrency);
  };

  // Hilfsfunktion für Übersetzungen (z.B. t('nav.home'))
  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key; // Fallback, falls Schlüssel nicht gefunden
      }
    }
    return result as string;
  };

  // Hilfsfunktion für Preise
  const formatPrice = (priceInEur: number) => {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(priceInEur);
    } else {
      // Umrechnen in USD
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceInEur * EXCHANGE_RATE);
    }
  };

  return (
    <ShopContext.Provider value={{ currency, language, t, formatPrice, toggleLanguage, isLoading }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
