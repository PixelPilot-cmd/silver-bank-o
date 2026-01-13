'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function ProductGallery({ images = [], name }) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Fallback if no images
    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] rounded-[2.5rem] bg-secondary-light flex items-center justify-center">
                <span className="text-gray-500">لا توجد صور</span>
            </div>
        );
    }

    const nextImage = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-6">
            {/* Main Image Container */}
            <div className="relative group perspective-1000">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 group-hover:border-white/20">
                    <img
                        src={images[activeIndex]}
                        alt={`${name} - ${activeIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {/* Navigation Arrows (Visible only if more than 1 image) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Progress Dots */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`h-1.5 transition-all rounded-full ${i === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-white/40'}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                </div>

                {/* Lighting effects */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 blur-[60px] rounded-full animate-pulse-slow"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 blur-[80px] rounded-full"></div>
            </div>

            {/* Thumbnails Bar */}
            {images.length > 1 && (
                <div className="flex gap-4 px-2 overflow-x-auto no-scrollbar">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${i === activeIndex ? 'border-primary' : 'border-white/5 opacity-50'}`}
                        >
                            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
