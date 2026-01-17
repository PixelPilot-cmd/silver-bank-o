'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import LuxuryClock from '@/components/LuxuryClock';
import { useLanguage } from '@/contexts/LanguageContext';

export const dynamic = 'force-dynamic';

export default function Home() {
    const { t } = useLanguage();

    const categories = [
        { name: t('categories.watches'), icon: '⌚', id: 'watches' },
        { name: t('categories.women_sets'), icon: '💎', id: 'women_sets' },
        { name: t('categories.rings'), icon: '🧸', id: 'rings' },
        { name: t('categories.rosaries'), icon: '🏺', id: 'rosaries' },
        { name: t('categories.accessories'), icon: '🕶️', id: 'accessories' }
    ];

    return (
        <main className="min-h-screen pb-20 overflow-x-hidden">
            <Header />

            {/* Hero Section */}
            <section className="relative min-h-[75vh] flex flex-col items-center justify-center pt-10 px-4">
                <div className="relative z-20 flex flex-col items-center max-w-4xl w-full">
                    <LuxuryClock />
                    <div className="text-center mt-12 animate-fade-in transition-all duration-1000">
                        <h1 className="text-6xl md:text-9xl font-black mb-6 title-gradient tracking-tighter drop-shadow-2xl">{t('siteName')}</h1>
                        <p className="text-gray-400 text-lg md:text-2xl font-light tracking-[0.2em] uppercase mb-2">{t('subtitle')}</p>
                    </div>
                </div>
            </section>

            {/* Premium Categories Grid */}
            <div className="w-full px-6 mb-24 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 perspective-1000">
                    {categories.map((cat, i) => (
                        <Link
                            key={cat.id}
                            href={`/shop?category=${cat.id}`}
                            className="group relative h-48 rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-2xl hover:bg-white/10 transition-all duration-700 flex flex-col items-center justify-center gap-5 overflow-hidden transform-style-3d hover:rotate-y-12 hover:-translate-y-4 shadow-2xl animate-slide-up"
                            style={{ animationDelay: `${i * 150}ms` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            {/* Icon Container */}
                            <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-inner relative z-10">
                                <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{cat.icon}</span>
                            </div>

                            <span className="text-lg font-bold text-gray-300 group-hover:text-white relative z-10 tracking-widest font-serif transition-colors">{cat.name}</span>

                            {/* Decorative Background Element */}
                            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-all duration-700"></div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Exhibition Link */}
            <div className="text-center pb-32">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-4 px-12 py-5 bg-white text-black font-black text-lg rounded-full hover:bg-primary hover:text-white transition-all duration-700 group shadow-[0_25px_60px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_80px_rgba(215,0,0,0.4)]"
                >
                    <span>{t('enterGallery')}</span>
                    <ShoppingBag size={24} className="group-hover:translate-x-1 group-hover:-rotate-12 transition-transform" />
                </Link>
            </div>
        </main>
    );
}
