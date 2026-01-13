'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Phone, MessageSquare, Clock, CheckCircle2, DollarSign, XCircle, Trash2 } from 'lucide-react';

export default function AdminCustomOrders() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const res = await fetch('/api/custom-requests');
        const data = await res.json();
        setRequests(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
    };

    const updateStatus = async (id, status) => {
        await fetch(`/api/custom-requests/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchRequests();
    };

    const deleteRequest = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذه الخطوة.')) return;

        await fetch(`/api/custom-requests/${id}`, { method: 'DELETE' });
        fetchRequests();
    };

    const setPrice = async (id) => {
        const price = prompt('أدخل السعر المقترح لهذه القطعة (شيكل):');
        if (price) {
            await fetch(`/api/custom-requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: Number(price), status: 'priced' })
            });
            fetchRequests();
        }
    };

    if (loading) return <div className="p-10 text-white text-center">جاري تحميل الطلبات الخاصة...</div>;

    return (
        <main className="min-h-screen bg-black p-6">
            <header className="mb-10">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-2">
                    <Sparkles size={14} />
                    <span>Exclusive Requests</span>
                </div>
                <h1 className="text-3xl font-bold text-white">طلبات التصميم الخاص</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {requests.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-500 border border-white/5 rounded-3xl">
                        لا توجد طلبات خاصة حالياً
                    </div>
                )}

                {requests.map((req) => (
                    <div key={req.id} className="bg-secondary-light border border-white/10 rounded-[2rem] overflow-hidden flex flex-col">
                        {req.image && (
                            <div className="h-48 w-full overflow-hidden">
                                <img src={req.image} alt="Request Sketch" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="p-6 space-y-4 flex-1">
                            <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                    req.status === 'priced' ? 'bg-blue-500/20 text-blue-500' :
                                        req.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                                            'bg-white/10 text-gray-400'
                                    }`}>
                                    {req.status === 'pending' ? 'بانتظار التسعير' :
                                        req.status === 'priced' ? 'تم التسعير' :
                                            req.status === 'approved' ? 'تمت الموافقة' : req.status}
                                </span>
                                <span className="text-[10px] text-gray-500">{new Date(req.createdAt).toLocaleDateString('ar-EG')}</span>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-white font-bold text-lg">{req.customerName}</h3>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Phone size={14} />
                                    <span dir="ltr">{req.customerPhone}</span>
                                </div>
                            </div>

                            <div className="bg-black/30 p-4 rounded-xl text-gray-300 text-sm leading-relaxed border border-white/5">
                                {req.description}
                            </div>

                            {req.price && (
                                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/20">
                                    <span className="text-primary text-xs font-bold">السعر المحدد:</span>
                                    <span className="text-white font-bold text-lg">{req.price} ₪</span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-black/40 border-t border-white/5 grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setPrice(req.id)}
                                className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-xs font-bold transition-colors"
                            >
                                <DollarSign size={14} />
                                وضع السعر
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateStatus(req.id, 'completed')}
                                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 rounded-xl text-white text-xs font-bold transition-colors"
                                >
                                    <CheckCircle2 size={14} />
                                    تم
                                </button>
                                <button
                                    onClick={() => deleteRequest(req.id)}
                                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all"
                                    title="حذف الطلب"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
