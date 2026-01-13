'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'ar', label: 'العربية', flag: '🇸🇦' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'he', label: 'עברית', flag: '🇮🇱' },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLang = languages.find(l => l.code === language) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Change Language"
            >
                <Globe size={20} />
                <span className="text-xs font-bold uppercase hidden xs:block">{currentLang.code}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-32 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 ltr:right-0 rtl:left-0">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-sm ${language === lang.code ? 'text-primary' : 'text-gray-300'}`}
                        >
                            <span>{lang.label}</span>
                            <span className="text-base">{lang.flag}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
