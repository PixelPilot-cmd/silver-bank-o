'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';

export default function ClientProviders({ children }) {
    return (
        <LanguageProvider>
            {children}
        </LanguageProvider>
    );
}
