'use client';

import { useEffect, useState } from 'react';

export default function LuxuryClock() {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setTimeout(() => setMounted(true), 300);

        const now = new Date();
        setTime({
            h: (now.getHours() % 12) * 30 + now.getMinutes() * 0.5,
            m: now.getMinutes() * 6,
            s: now.getSeconds() * 6
        });

        const handleMouseMove = (e) => {
            if (!mounted) return;
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / 25; // Sensitivity
            const y = (e.clientY - innerHeight / 2) / 25;
            setRotation({ x: -y, y: x });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mounted]);

    return (
        <div className="perspective-[1000px] flex justify-center items-center py-10">
            <div
                className={`relative transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] transform-style-3d ${mounted
                    ? 'scale-100 opacity-100'
                    : 'scale-50 opacity-0'
                    }`}
                style={{
                    transform: mounted
                        ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                        : 'rotateY(-90deg)'
                }}
            >
                {/* Watch Case */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full p-[2px] bg-gradient-to-br from-[#ffffff] via-[#d4d4d4] to-[#888888] shadow-[0_0_80px_rgba(255,255,255,0.05)] animate-float-slow">

                    {/* Bezel */}
                    <div className="absolute inset-0 rounded-full border-[16px] border-[#e0e0e0] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.5)] bg-[#111]"></div>

                    {/* Dial */}
                    <div className="absolute inset-[20px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#222,#000)] shadow-inner overflow-hidden flex items-center justify-center">

                        {/* Markers */}
                        {[...Array(60)].map((_, i) => (
                            <div
                                key={i}
                                className={`absolute top-4 left-1/2 -translate-x-1/2 w-[1px] ${i % 5 === 0 ? 'h-3 bg-[#e0e0e0]/80' : 'h-1.5 bg-[#555]'}`}
                                style={{ transform: `rotate(${i * 6}deg)`, transformOrigin: '0 156px' }}
                            ></div>
                        ))}

                        {/* Branding */}
                        <div className="absolute top-[28%] text-center z-0">
                            <span className="block text-white/90 text-sm font-bold tracking-[0.3em] font-serif">SILVER BANK</span>
                            <span className="block text-primary/80 text-[10px] tracking-widest mt-1 uppercase">Automatic</span>
                        </div>

                        {/* Hands Container - Centered */}
                        {time && (
                            <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10">
                                <RealtimeHands initialTime={time} />
                            </div>
                        )}

                        {/* Center Cap */}
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#e0e0e0] border-2 border-gray-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg z-50"></div>

                        {/* Glass Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-full z-40 pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RealtimeHands({ initialTime }) {
    const [style, setStyle] = useState({
        h: { transform: `rotate(${initialTime.h}deg)` },
        m: { transform: `rotate(${initialTime.m}deg)` },
        s: { transform: `rotate(${initialTime.s}deg)` }
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const h = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;
            const m = now.getMinutes() * 6;
            const s = now.getSeconds() * 6;

            setStyle({
                h: { transform: `rotate(${h}deg)` },
                m: { transform: `rotate(${m}deg)` },
                s: { transform: `rotate(${s}deg)` }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Hour */}
            <div className="absolute top-0 left-0 w-0 h-0 flex justify-center transition-transform duration-1000 ease-linear" style={style.h}>
                <div className="absolute bottom-0 -translate-x-1/2 w-3 h-24 bg-gradient-to-t from-[#fff] to-[#d0d0d0] rounded-full shadow-2xl origin-bottom"></div>
            </div>
            {/* Minute */}
            <div className="absolute top-0 left-0 w-0 h-0 flex justify-center transition-transform duration-1000 ease-linear" style={style.m}>
                <div className="absolute bottom-0 -translate-x-1/2 w-2 h-32 bg-gradient-to-t from-[#fff] to-[#d0d0d0] rounded-full shadow-2xl origin-bottom"></div>
            </div>
            {/* Second */}
            <div className="absolute top-0 left-0 w-0 h-0 flex justify-center transition-transform duration-75 ease-out" style={style.s}>
                <div className="absolute bottom-[-15px] -translate-x-1/2 w-0.5 h-40 bg-[#D70000] rounded-full shadow-[0_0_10px_rgba(215,0,0,0.5)] origin-bottom">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-white rounded-full"></div>
                </div>
            </div>
        </>
    );
}
