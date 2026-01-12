'use client';

import { useState, useEffect } from 'react';

export default function BackgroundMarquee() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="marquee-text animate-marquee select-none" dir="ltr">
            SILVER BANK LUXURY . TIMELESS ELEGANCE . SILVER BANK LUXURY . TIMELESS ELEGANCE .
            SILVER BANK LUXURY . TIMELESS ELEGANCE . SILVER BANK LUXURY . TIMELESS ELEGANCE .
        </div>
    );
}
