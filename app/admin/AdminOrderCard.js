'use client';

import { useState } from 'react';
import { Clock, CheckCircle, Truck, MapPin, Trash2 } from 'lucide-react';

export default function AdminOrderCard({ order }) {
    const [status, setStatus] = useState(order.status);
    const [loading, setLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const updateStatus = async (newStatus) => {
        setLoading(true);
        try {
            await fetch(`/api/orders/${order.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            setStatus(newStatus);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذه الخطوة.')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${order.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setDeleted(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (deleted) return null;

    const getStatusColor = (s) => {
        switch (s) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'preparing': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
            case 'ready': return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 'completed': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
            default: return 'bg-gray-800 text-gray-400';
        }
    };

    return (
        <div className="bg-secondary-light border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-mono text-sm font-bold border border-primary/20">
                            #{order.orderNumber || '---'}
                        </span>
                        <span className="text-[10px] text-gray-600 uppercase tracking-widest">ID: {order.id.slice(0, 8)}</span>
                    </div>
                    <h3 className="font-bold text-lg text-white leading-tight">{order.customer?.name}</h3>
                    <a href={`tel:${order.customer?.phone}`} className="text-sm text-gray-500 hover:text-white transition-colors">{order.customer?.phone}</a>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusColor(status)}`}>
                        {status}
                    </div>
                </div>
            </div>

            <div className="space-y-1 mb-4 text-sm text-gray-300 border-t border-white/5 pt-3">
                {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>{item.price * item.quantity} ₪</span>
                    </div>
                ))}
                <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5 mt-2">
                    <span>المجموع</span>
                    <span>{order.total} ₪</span>
                </div>
            </div>

            {/* Customer Contact Actions */}
            <div className="flex gap-2 mb-4">
                <a
                    href={`tel:${order.customer?.phone}`}
                    className="flex-1 py-1 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs flex items-center justify-center gap-2 transition-all"
                >
                    <span className="opacity-70 text-[10px]">اتصال</span>
                </a>
                <a
                    href={`https://wa.me/${order.customer?.phone?.replace(/^0/, '970')}`}
                    target="_blank"
                    className="flex-1 py-1 px-2 bg-green-600/10 hover:bg-green-600/20 border border-green-600/20 rounded-lg text-xs text-green-500 flex items-center justify-center gap-2 transition-all"
                >
                    <span className="text-[10px]">واتساب</span>
                </a>
            </div>

            {order.deliveryMethod ? (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4 animate-pulse-once">
                    <div className="flex items-center gap-2 mb-1 font-bold text-white text-sm">
                        {order.deliveryMethod === 'delivery' ? <Truck size={16} /> : <MapPin size={16} />}
                        {order.deliveryMethod === 'delivery' ? 'طلب توصيل للمنزل' : 'استلام من الفرع'}
                    </div>
                    {order.deliveryMethod === 'delivery' && (
                        <p className="text-gray-300 text-xs leading-relaxed">{order.address}</p>
                    )}
                </div>
            ) : (
                <div className="bg-white/5 rounded-xl p-3 mb-4 text-center border border-white/5">
                    <p className="text-gray-500 text-xs italic">بانتظار تحديد طريقة الاستلام من قبل الزبون</p>
                </div>
            )}

            <div className="flex gap-2 mt-2">
                <div className="flex-1 grid grid-cols-1">
                    {status === 'pending' && (
                        <button
                            onClick={() => updateStatus('preparing')}
                            disabled={loading}
                            className="btn bg-blue-600 hover:bg-blue-700 text-white text-[10px] py-2"
                        >
                            بدء التحضير
                        </button>
                    )}
                    {status === 'preparing' && (
                        <button
                            onClick={() => updateStatus('ready')}
                            disabled={loading}
                            className="btn bg-green-600 hover:bg-green-700 text-white text-[10px] py-2"
                        >
                            جاهز للاستلام
                        </button>
                    )}
                    {status === 'ready' && (
                        <button
                            onClick={() => updateStatus('completed')}
                            disabled={loading}
                            className="btn bg-gray-700 hover:bg-gray-600 text-white text-[10px] py-2"
                        >
                            إكمال الطلب
                        </button>
                    )}
                </div>

                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-lg transition-all"
                    title="حذف الطلب"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
