'use client';

import { useState } from 'react';
import { MapPin, Truck, ChevronLeft, Map, Navigation } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function TrackingStatus({ order }) {
    const router = useRouter();
    const [method, setMethod] = useState(null); // 'pickup' | 'delivery'
    const [address, setAddress] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // If order is not ready or already has a method selected, don't show choice
    if (order.status !== 'ready' || order.deliveryMethod) {
        if (order.deliveryMethod === 'pickup') {
            return (
                <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 p-8 rounded-[2rem] shadow-2xl animate-fade-in">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white">معلومات الاستلام</h3>
                            <p className="text-gray-500 text-sm">تفضل بزيارتنا لاستلام قطعتك</p>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl text-sm leading-relaxed border border-white/5 mb-6 text-gray-300">
                        <p className="font-bold text-white mb-2 text-lg">بنك الفضة - الفرع الرئيسي</p>
                        <p>رام الله - دوار الساعة</p>
                        <p>عمارة البرج - الطابق الأرضي</p>
                        <p className="mt-2 text-primary">ساعات العمل: 10:00 صباحاً - 8:00 مساءً</p>
                    </div>

                    <a
                        href="https://maps.google.com"
                        target="_blank"
                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all group"
                    >
                        <span>فتح الموقع في الخرائط</span>
                        <Navigation size={18} className="group-hover:translate-x-[-4px] transition-transform" />
                    </a>
                </div>
            );
        }
        if (order.deliveryMethod === 'delivery') {
            return (
                <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 p-8 rounded-[2rem] shadow-2xl animate-fade-in">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white">معلومات التوصيل</h3>
                            <p className="text-gray-500 text-sm">طلبك في الطريق إليك</p>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-gray-300">
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">عنوان التسليم المعتمد:</p>
                        <p className="text-lg font-medium leading-relaxed">{order.address}</p>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-6 italic">سيتصل بك مندوب التوصيل فور وصوله لمنطقتك.</p>
                </div>
            );
        }
        return null;
    }

    const handleUpdate = async (selectedMethod, addr = '') => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/orders/${order.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deliveryMethod: selectedMethod,
                    address: addr,
                    status: 'ready'
                })
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (e) {
            console.error(e);
            setSubmitting(false);
        }
    };

    if (method === 'delivery') {
        return (
            <div className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] animate-in slide-in-from-right duration-500">
                <button onClick={() => setMethod(null)} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors group">
                    <ChevronLeft size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span>العودة للخيارات</span>
                </button>

                <h3 className="text-2xl font-bold text-white mb-2">أين نرسل طلبك؟</h3>
                <p className="text-gray-500 text-sm mb-8">يرجى كتابة العنوان بالتفصيل (المدينة، الحي، رقم الهاتف البديل إن وجد).</p>

                <textarea
                    autoFocus
                    className="w-full bg-black border border-white/10 rounded-2xl p-5 mb-8 h-32 focus:border-primary outline-none transition-all placeholder:text-gray-800 text-lg shadow-inner"
                    placeholder="مثال: رام الله، حي الطيرة، خلف سوبر ماركت..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <button
                    onClick={() => handleUpdate('delivery', address)}
                    disabled={!address || submitting}
                    className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:bg-primary hover:text-white transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transform active:scale-95"
                >
                    {submitting ? 'جاري الحفظ...' : 'تأكيد العنوان والطلب'}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-primary/20 via-black to-black border border-primary/30 p-10 rounded-[3rem] shadow-[0_0_50px_rgba(215,0,0,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-1000"></div>

            <div className="text-center relative z-10 mb-10">
                <h3 className="text-3xl font-bold text-white mb-3">الطلب جاهز!</h3>
                <p className="text-gray-400 font-light tracking-wide leading-relaxed">وصلنا للمحطة القبل الأخيرة، اختر الطريقة الأنسب لك لاستلام قطعتك الفاخرة.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                    onClick={() => handleUpdate('pickup')}
                    disabled={submitting}
                    className="flex flex-col items-center justify-center p-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] transition-all hover:border-primary hover:-translate-y-2 group/btn active:scale-95"
                >
                    <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center mb-6 border border-white/5 group-hover/btn:scale-110 transition-transform shadow-2xl">
                        <MapPin size={36} className="text-primary" />
                    </div>
                    <span className="font-black text-xl text-white">استلام من الفرع</span>
                    <span className="text-xs text-gray-500 mt-2">مجاني - فوري</span>
                </button>

                <button
                    onClick={() => setMethod('delivery')}
                    disabled={submitting}
                    className="flex flex-col items-center justify-center p-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] transition-all hover:border-primary hover:-translate-y-2 group/btn active:scale-95"
                >
                    <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center mb-6 border border-white/5 group-hover/btn:scale-110 transition-transform shadow-2xl">
                        <Truck size={36} className="text-primary" />
                    </div>
                    <span className="font-black text-xl text-white">توصيل للمنزل</span>
                    <span className="text-xs text-gray-500 mt-2">كافة المناطق</span>
                </button>
            </div>
        </div>
    );
}
