'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import bn from '@/locales/bn.json';
import te from '@/locales/te.json';
import mr from '@/locales/mr.json';
import ta from '@/locales/ta.json';
import ur from '@/locales/ur.json';
import gu from '@/locales/gu.json';
import kn from '@/locales/kn.json';
import or from '@/locales/or.json';
import pa from '@/locales/pa.json';
import ml from '@/locales/ml.json';
import as from '@/locales/as.json';
import mai from '@/locales/mai.json';


type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'ur' | 'gu' | 'kn' | 'or' | 'pa' | 'ml' | 'as' | 'mai';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, any>;
}

const translationsMap = { en, hi, bn, te, mr, ta, ur, gu, kn, or, pa, ml, as, mai };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState(translationsMap.en);

  useEffect(() => {
    setTranslations(translationsMap[language] || translationsMap.en);
  }, [language]);
  

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const getNestedTranslation = (translations: Record<string, any>, key: string): string | undefined => {
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
            return undefined;
        }
    }
    return result;
}

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }

    const t = (key: string, params?: Record<string, string>): string => {
        let translation = getNestedTranslation(context.translations, key);

        // Fallback to English if translation is missing
        if (translation === undefined) {
            translation = getNestedTranslation(en, key) || key;
        }

        if (params) {
            Object.keys(params).forEach(p => {
                translation = translation!.replace(`{{${p}}}`, params[p]);
            });
        }

        return translation;
    };

    return { t };
};