'use client';

import { useState, useEffect } from 'react';
import { PackageCheck, X, Bell } from 'lucide-react';
import Link from 'next/link';

export default function OrderNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        const checkOrderUpdates = async () => {
            const myOrderIds = JSON.parse(localStorage.getItem('my_orders') || '[]');
            if (myOrderIds.length === 0) return;

            const lastStatuses = JSON.parse(localStorage.getItem('order_statuses') || '{}');
            const history = JSON.parse(localStorage.getItem('notification_history') || '[]');
            let hasNewUpdate = false;
            const newNotifications = [];

            for (const id of myOrderIds) {
                try {
                    const res = await fetch(`/api/orders/lookup/${id}`);
                    if (res.ok) {
                        const order = await res.json();
                        const oldStatus = lastStatuses[id];

                        // If status changed and we have a previous status to compare to
                        if (oldStatus && order.status !== oldStatus) {
                            let message = '';
                            if (order.status === 'preparing') message = `بدأنا في تجهيز طلبك الفاخر #${order.orderNumber}`;
                            if (order.status === 'ready') message = `طلبك #${order.orderNumber} أصبح جاهزاً للاستلام!`;
                            if (order.status === 'completed') message = `تم تسليم طلبكم #${order.orderNumber}. نأمل أن تنال القطعة إعجابكم.`;

                            if (message) {
                                const newNotif = {
                                    id: `${order.id}-${Date.now()}`,
                                    orderId: order.id,
                                    number: order.orderNumber,
                                    message,
                                    time: new Date().toISOString(),
                                    read: false
                                };
                                newNotifications.push(newNotif);
                                history.unshift(newNotif);
                                hasNewUpdate = true;
                            }
                        }

                        lastStatuses[id] = order.status;
                    }
                } catch (err) {
                    console.error("Notification check error:", err);
                }
            }

            if (hasNewUpdate) {
                setNotifications(prev => [...newNotifications, ...prev]);
                localStorage.setItem('order_statuses', JSON.stringify(lastStatuses));
                localStorage.setItem('notification_history', JSON.stringify(history.slice(0, 20)));
                window.dispatchEvent(new Event('notifications-updated'));
                setShowOverlay(true);

                try {
                    const audio = new Audio('/notification.mp3');
                    audio.play().catch(() => { });
                } catch (e) { }
            }
        };

        const interval = setInterval(checkOrderUpdates, 30000);
        checkOrderUpdates();

        return () => clearInterval(interval);
    }, []);

    if (notifications.length === 0 || !showOverlay) return null;

    return (
        <div className="fixed top-20 left-4 z-[100] w-full max-w-sm animate-in slide-in-from-left duration-500">
            {notifications.map((notif) => (
                <div key={notif.id} className="bg-black/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 shadow-2xl relative mb-3 group overflow-hidden ring-1 ring-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent"></div>

                    <button
                        onClick={() => setShowOverlay(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors p-1"
                    >
                        <X size={14} />
                    </button>

                    <div className="flex gap-4 items-start relative z-10">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0 animate-pulse border border-primary/20">
                            <PackageCheck size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-sm mb-1">تحديث الطلب</h4>
                            <p className="text-gray-300 text-xs leading-relaxed">{notif.message}</p>
                            <Link
                                href={`/track/${notif.orderId}`}
                                onClick={() => setShowOverlay(false)}
                                className="inline-block mt-3 text-[10px] text-primary hover:text-white transition-colors font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20"
                            >
                                تتبع الطلب الآن ←
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
