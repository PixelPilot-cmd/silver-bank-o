'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Package, Clock } from 'lucide-react';
import Link from 'next/link';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const loadNotifications = () => {
        const history = JSON.parse(localStorage.getItem('notification_history') || '[]');
        setNotifications(history);
        setHasUnread(history.some(n => !n.read));
    };

    useEffect(() => {
        loadNotifications();
        window.addEventListener('notifications-updated', loadNotifications);
        return () => window.removeEventListener('notifications-updated', loadNotifications);
    }, []);

    const markAllRead = () => {
        const history = notifications.map(n => ({ ...n, read: true }));
        localStorage.setItem('notification_history', JSON.stringify(history));
        setNotifications(history);
        setHasUnread(false);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) markAllRead();
    };

    return (
        <div className="relative">
            <button
                onClick={toggleOpen}
                className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
                title="الإشعارات"
            >
                <Bell size={22} className={hasUnread ? "text-primary animate-bounce-subtle" : "text-gray-300"} />
                {hasUnread && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-black animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute left-0 mt-2 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Bell size={16} className="text-primary" />
                                الإشعارات
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <Link
                                        key={notif.id}
                                        href={`/track/${notif.orderId}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block p-4 border-b border-white/5 hover:bg-white/5 transition-all group"
                                    >
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                                                <Package size={14} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-200 leading-relaxed mb-1">{notif.message}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-light">
                                                    <Clock size={10} />
                                                    {new Date(notif.time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell size={24} className="opacity-20" />
                                    </div>
                                    <p className="text-xs">لا توجد إشعارات حالياً</p>
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-3 bg-white/5 text-center">
                                <Link
                                    href="/track"
                                    className="text-[10px] text-gray-400 hover:text-primary transition-colors uppercase tracking-widest font-bold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    تتبع جميع طلباتك
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
