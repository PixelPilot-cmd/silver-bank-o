'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('ar');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load saved language
        const savedLang = localStorage.getItem('site_language');
        if (savedLang && ['ar', 'en', 'he'].includes(savedLang)) {
            setLanguage(savedLang);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        localStorage.setItem('site_language', language);

        // Handle Direction
        const dir = language === 'en' ? 'ltr' : 'rtl';
        document.documentElement.dir = dir;
        document.documentElement.lang = language;

        // Update body class for specific fonts if needed
        // For now we use the same font

    }, [language, isLoaded]);

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isLoaded }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        // Fallback if context is not available
        return {
            language: 'ar',
            setLanguage: () => { },
            t: (key) => key,
            isLoaded: true
        };
    }
    return context;
}
