'use client';

import { useState, useEffect } from 'react';

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted || !loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center animate-fade-out duration-500 delay-1000 fill-mode-forwards">
            <div className="relative">
                <div className="w-24 h-24 border-2 border-white/5 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-tr from-primary to-black rounded-full flex items-center justify-center font-bold text-2xl text-white border border-white/20 animate-pulse">
                        3
                    </div>
                </div>
            </div>
            <div className="mt-8 overflow-hidden h-[1px] w-32 bg-white/5 relative">
                <div className="absolute inset-0 bg-primary animate-progress origin-left"></div>
            </div>
            <p className="mt-4 text-[10px] text-gray-500 uppercase tracking-[0.5em] animate-pulse">Silver Bank Luxury</p>
        </div>
    );
}
