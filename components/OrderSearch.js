'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderSearch() {
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!orderId) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/orders/lookup/${encodeURIComponent(orderId)}`);
            const data = await res.json();

            if (res.ok && data.id) {
                router.push(`/track/${data.id}`);
            } else {
                setError('لم نتمكن من العثور على هذا الطلب. تأكد من الرقم الصحيح.');
            }
        } catch (err) {
            setError('حدث خطأ أثناء البحث. يرجى المحاولة لاحقاً.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative group">
                <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="أدخل رقم الطلب (مثلاً: 1001)..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-12 text-white focus:border-primary focus:bg-white/10 outline-none transition-all shadow-2xl text-center font-mono placeholder:font-sans"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-4 text-center animate-in fade-in slide-in-from-top-2">{error}</p>}
        </div>
    );
}
