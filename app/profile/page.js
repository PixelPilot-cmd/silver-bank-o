'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { User, Gem, ShoppingBag, Package, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('customer_user') || 'null');
        if (savedUser) {
            fetch(`/api/auth/me?id=${savedUser.id}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) setUser(data);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

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

            <div className="container mx-auto px-4 pt-32">
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
