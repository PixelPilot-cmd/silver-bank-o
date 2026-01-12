'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hidden, setHidden] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [mouseDown, setMouseDown] = useState(false);

    useEffect(() => {
        setMounted(true);
        const addEventListeners = () => {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseenter", onMouseEnter);
            document.addEventListener("mouseleave", onMouseLeave);
            document.addEventListener("mousedown", onMouseDown);
            document.addEventListener("mouseup", onMouseUp);

            // Add hover effect to all clickable elements
            const clickables = document.querySelectorAll('a, button, input, textarea, .cursor-hover');
            clickables.forEach((el) => {
                el.addEventListener("mouseenter", onHoverStart);
                el.addEventListener("mouseleave", onHoverEnd);
            });
        };

        const removeEventListeners = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);

            const clickables = document.querySelectorAll('a, button, input, textarea, .cursor-hover');
            clickables.forEach((el) => {
                el.removeEventListener("mouseenter", onHoverStart);
                el.removeEventListener("mouseleave", onHoverEnd);
            });
        };

        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const onMouseEnter = () => setHidden(false);
        const onMouseLeave = () => setHidden(true);
        const onMouseDown = () => setMouseDown(true);
        const onMouseUp = () => setMouseDown(false);
        const onHoverStart = () => setHovering(true);
        const onHoverEnd = () => setHovering(false);

        addEventListeners();

        // Re-add listeners when DOM changes (simple observation for SPA nav)
        const observer = new MutationObserver(addEventListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            removeEventListeners();
            observer.disconnect();
        };
    }, []);

    if (!mounted) return null;

    // Don't render on mobile touches to avoid double cursor
    if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return null; // Don't show custom cursor on mobile
    }

    return (
        <div
            className={`fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference transition-opacity duration-300 ${hidden ? 'opacity-0' : 'opacity-100'}`}
            style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            }}
        >
            {/* Main Dot */}
            <div
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-150 ease-out
                ${hovering ? 'w-12 h-12 opacity-80 mix-blend-normal blur-[1px]' : 'w-3 h-3 opacity-100'}
                ${mouseDown ? 'scale-75' : 'scale-100'}
                `}
            />

            {/* Trailing Ring (Optional, creates a liquid feel) */}
            <div
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 transition-all duration-300 ease-out -z-10
                ${hovering ? 'w-12 h-12 opacity-100' : 'w-8 h-8 opacity-0'}
                `}
            />
        </div>
    );
}
