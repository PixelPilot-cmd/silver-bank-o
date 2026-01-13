'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { User, Gem, ShoppingBag, Package, Star, ArrowLeft, Sparkles, Check, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customRequests, setCustomRequests] = useState([]);
    const [approvingId, setApprovingId] = useState(null);
    const [successOrder, setSuccessOrder] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('customer_user') || 'null');
        if (!savedUser) {
            setLoading(false);
            return;
        }

        // 1. Fetch Profile First
        fetch(`/api/auth/me?id=${savedUser.id}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(userData => {
                if (!userData.error) {
                    setUser(userData);
                }

                // 2. Fetch Requests AFTER Profile (or with savedUser fallback)
                return fetch('/api/custom-requests', { cache: 'no-store' })
                    .then(res => res.json())
                    .then(requestsData => {
                        const normalize = (p) => p ? p.toString().replace(/[^0-9]/g, '') : null;
                        const userPhone = normalize(userData?.phone || savedUser.phone);

                        const myRequests = requestsData.filter(r => {
                            const reqPhone = normalize(r.customerPhone);
                            return (r.userId && r.userId === savedUser.id) ||
                                (reqPhone && userPhone && reqPhone === userPhone);
                        });

                        setCustomRequests(myRequests);
                        setLoading(false);
                    });
            })
            .catch(err => {
                console.error('Error loading profile data:', err);
                setLoading(false);
            });
    }, []);

    const handleApprove = async (requestId) => {
        if (!confirm('هل أنت متأكد من الموافقة على السعر والبدء في تنفيذ الطلب؟')) return;

        setApprovingId(requestId);
        try {
            const res = await fetch(`/api/custom-requests/${requestId}/approve`, {
                method: 'POST'
            });

            if (res.ok) {
                const result = await res.json();
                setSuccessOrder(result.order);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setApprovingId(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (successOrder) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                    <div className="relative w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]">
                        <Check size={48} className="text-primary animate-in zoom-in duration-500 delay-300" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">تمت الموافقة بنجاح</h1>
                <p className="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
                    تم تحويل طلبك الخاص إلى طلب رسمي.
                </p>

                <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-10 mb-12 w-full max-w-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16"></div>
                    <p className="text-gray-500 text-xs uppercase tracking-[0.4em] mb-4 font-bold">رقم الطلب الملكي</p>
                    <p className="text-6xl font-mono font-bold text-white tracking-tighter shadow-primary/20 drop-shadow-2xl">
                        #{successOrder.orderNumber}
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <p className="text-gray-400 text-sm mb-4">يرجى مراجعة الاوردر من خلال تتبع الطلبات باستخدام رقم الاوردر</p>
                    <button
                        onClick={() => window.location.href = `/track/${successOrder.id}`}
                        className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-primary hover:text-white transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
                    >
                        تتبع التحفة الفنية
                    </button>
                    <button
                        onClick={() => setSuccessOrder(null)}
                        className="w-full py-4 text-gray-500 hover:text-white transition-all text-sm font-bold uppercase tracking-widest"
                    >
                        العودة للملف الشخصي
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <main className="min-h-screen bg-black">
                <Header />
                <div className="container mx-auto px-4 py-32 text-center">
                    <h2 className="text-2xl font-serif text-white mb-6">يرجى تسجيل الدخول لعرض نقاطك</h2>
                    <Link href="/login" className="btn btn-primary">تسجيل الدخول</Link>
                </div>
            </main>
        );
    }

    const tier =
        user.points >= 5000 ? { name: 'عضو بلاتيني', color: 'text-gray-200', bg: 'bg-gray-200/10' } :
            user.points >= 2000 ? { name: 'عضو ذهبي', color: 'text-gold', bg: 'bg-gold/10' } :
                { name: 'عضو فضي', color: 'text-accent', bg: 'bg-accent/10' };

    return (
        <main className="min-h-screen bg-[#050505] pb-20">
            <Header />

            <div className="container mx-auto px-4 pt-20 md:pt-32">
                <div className="max-w-4xl mx-auto">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-in fade-in slide-in-from-bottom duration-700">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-tr from-primary to-black rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl">
                                <User size={64} className="text-white/80" />
                            </div>
                            <div className={`absolute -bottom-2 -right-2 px-4 py-1 rounded-full border border-white/10 backdrop-blur-md shadow-xl ${tier.bg} ${tier.color} text-[10px] font-black uppercase tracking-widest`}>
                                {tier.name}
                            </div>
                        </div>

                        <div className="text-center md:text-right">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{user.name}</h1>
                            <p className="text-gray-500 font-light tracking-wide">{user.email}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {/* Points Card */}
                        <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-primary/50 transition-all duration-500 shadow-2xl">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 border border-primary/20">
                                    <Gem size={32} />
                                </div>
                                <h3 className="text-gray-400 text-sm uppercase tracking-[0.3em] font-bold mb-2">رصيد النقاط</h3>
                                <div className="text-6xl font-black text-white mb-4 tracking-tighter">
                                    {user.points || 0}
                                </div>
                                <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[200px]">
                                    كل 1000 نقطة تمنحك خصماً بقيمة 50 شيكل على مشترياتك القادمة.
                                </p>
                            </div>
                        </div>

                        {/* Orders Card */}
                        <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-white/30 transition-all duration-500 shadow-2xl">
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/80 mb-6 border border-white/10">
                                    <ShoppingBag size={32} />
                                </div>
                                <h3 className="text-gray-400 text-sm uppercase tracking-[0.3em] font-bold mb-2">إجمالي الطلبات</h3>
                                <div className="text-6xl font-black text-white mb-4 tracking-tighter">
                                    {user.totalOrdersCompleted || 0}
                                </div>
                                <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[200px]">
                                    شكراً لثقتك بنا. نحن نقدر ولائك لـ Silver Bank.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Next Reward Progress */}
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-12">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-white font-bold text-lg">الهدية القادمة</h3>
                                <p className="text-gray-500 text-xs mt-1">اجمع 1000 نقطة لتفعيل الخصم</p>
                            </div>
                            <div className="text-right">
                                <span className="text-primary font-bold">{Math.min(100, ((user.points % 1000) / 10))}%</span>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
                            <div
                                className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000"
                                style={{ width: `${Math.min(100, ((user.points || 0) % 1000) / 10)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Custom Requests Section */}
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                        <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                            <Sparkles size={24} className="text-primary" />
                            طلبات التفصيل الخاصة
                        </h2>

                        {customRequests.length === 0 ? (
                            <div className="bg-white/5 border border-dashed border-white/10 rounded-[2rem] p-12 text-center">
                                <p className="text-gray-500 font-light">لا توجد طلبات تفصيل خاصة بك حالياً.</p>
                                <Link href="/custom-design" className="text-primary text-sm mt-4 inline-block hover:underline">
                                    اطلب تصميمك الخاص الآن
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {customRequests.map((req) => (
                                    <div key={req.id} className="bg-secondary-light border border-white/10 rounded-[2rem] p-5 md:p-8 flex flex-col md:flex-row gap-6 hover:border-primary/30 transition-all group overflow-hidden relative">
                                        {/* Status Tag for Mobile - Absolute Positioned */}
                                        <div className="absolute top-4 left-4 z-20 md:hidden">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-xl ${req.status === 'priced' ? 'bg-blue-500/80 text-white' :
                                                req.status === 'approved' ? 'bg-green-500/80 text-white' :
                                                    'bg-white/10 text-gray-400'
                                                }`}>
                                                {req.status === 'pending' ? 'يرجى انتظار تسعير الأدمن' :
                                                    req.status === 'priced' ? 'بانتظار موافقتك' :
                                                        req.status === 'approved' ? 'تمت الموافقة' : req.status}
                                            </span>
                                        </div>

                                        {req.image && (
                                            <div className="w-full md:w-32 h-48 md:h-32 bg-black rounded-2xl overflow-hidden shrink-0 border border-white/5 group-hover:border-primary/30 transition-colors">
                                                <img src={req.image} alt="Custom" className="w-full h-full object-cover" />
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-4 mt-2 md:mt-0">
                                                <span className={`hidden md:inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${req.status === 'priced' ? 'bg-blue-500/20 text-blue-400' :
                                                    req.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                        'bg-white/5 text-gray-500'
                                                    }`}>
                                                    {req.status === 'pending' ? 'يرجى انتظار تسعير الأدمن' :
                                                        req.status === 'priced' ? 'بانتظار موافقتك' :
                                                            req.status === 'approved' ? 'تمت الموافقة' : req.status}
                                                </span>
                                                <span className="text-[10px] text-gray-600 font-mono flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(req.createdAt).toLocaleDateString('ar-EG')}
                                                </span>
                                            </div>

                                            <p className="text-gray-300 text-sm mb-4 font-light whitespace-pre-wrap leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">تفاصيل طلبك:</span>
                                                {req.description}
                                            </p>

                                            {(req.status === 'priced' || req.status === 'approved') && (
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5 pt-4 mt-auto">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                                                            {req.status === 'approved' ? 'السعر المتفق عليه' : 'السعر المقترح'}
                                                        </span>
                                                        <span className="text-3xl font-black text-primary">{req.price} ₪</span>
                                                    </div>

                                                    {req.status === 'priced' && (
                                                        <button
                                                            onClick={() => handleApprove(req.id)}
                                                            disabled={approvingId === req.id}
                                                            className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-2xl text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl active:scale-95"
                                                        >
                                                            {approvingId === req.id ? (
                                                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                            ) : (
                                                                <>
                                                                    <Check size={18} />
                                                                    موافقة وتأكيد الطلب
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/shop" className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-primary hover:text-white transition-all">
                            <ShoppingBag size={20} />
                            تسوق الآن
                        </Link>
                        <Link href="/track" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                            <Package size={20} />
                            تتبع طلباتي
                        </Link>
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => {
                                localStorage.removeItem('customer_user');
                                window.location.href = '/';
                            }}
                            className="text-gray-600 hover:text-red-500 text-xs uppercase tracking-widest transition-colors"
                        >
                            تسجيل الخروج من الحساب
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
