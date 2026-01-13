'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, ArrowRight, Gem, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

import OrderSearch from '@/components/OrderSearch';

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [user, setUser] = useState(null);
    const [usePoints, setUsePoints] = useState(false);
    const [successOrder, setSuccessOrder] = useState(null);
    const router = useRouter();
    const { t, language } = useLanguage();

    const getLocalized = (obj, field) => {
        if (!obj) return '';
        if (language === 'en' && obj[field + '_en']) return obj[field + '_en'];
        if (language === 'he' && obj[field + '_he']) return obj[field + '_he'];
        return obj[field]; // Default to Arabic/base field
    };

    const DISCOUNT_THRESHOLD = 1000;
    const DISCOUNT_VALUE = 50;

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);

        // Load User and Points
        const savedUser = JSON.parse(localStorage.getItem('customer_user') || 'null');
        if (savedUser) {
            fetch(`/api/auth/me?id=${savedUser.id}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setUser(data);
                        setName(data.name || '');
                        setPhone(data.phone || '');
                    }
                });
        }

        setLoading(false);
    }, []);

    const clearCart = () => {
        setCart([]);
        localStorage.setItem('cart', '[]');
        window.dispatchEvent(new Event('cart-updated'));
    };

    const removeItem = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cart-updated'));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = (usePoints && user?.points >= DISCOUNT_THRESHOLD) ? DISCOUNT_VALUE : 0;
    const total = Math.max(0, subtotal - discount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setSubmitting(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: { name, phone },
                    customerEmail: user?.email,
                    customerPhone: phone || user?.phone,
                    items: cart,
                    subtotal,
                    discountAmount: discount,
                    usePoints,
                    total
                })
            });

            if (res.ok) {
                const order = await res.json();

                // Track this order
                const myOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
                if (!myOrders.includes(order.id)) {
                    myOrders.push(order.id);
                    localStorage.setItem('my_orders', JSON.stringify(myOrders));
                }

                clearCart();
                setSuccessOrder(order);
                // The screen will show the success message
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center p-8 text-center text-gray-500 font-light">
            {t('cart.loading')}
        </div>
    );

    if (successOrder) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                    <div className="relative w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 shadow-[0_0_50px_rgba(215,0,0,0.3)]">
                        <Check size={48} className="text-primary animate-in zoom-in duration-500 delay-300" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">{t('cart.successTitle')}</h1>
                <p className="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
                    {t('cart.successDesc')}
                </p>

                <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-10 mb-12 w-full max-w-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16"></div>
                    <p className="text-gray-500 text-xs uppercase tracking-[0.4em] mb-4 font-bold">{t('cart.orderNumber')}</p>
                    <p className="text-6xl font-mono font-bold text-primary tracking-tighter shadow-primary/20 drop-shadow-2xl">
                        #{successOrder.orderNumber}
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button
                        onClick={() => window.location.href = `/track/${successOrder.id}`}
                        className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-primary hover:text-white transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
                    >
                        {t('cart.trackStatus')}
                    </button>
                    <Link
                        href="/"
                        className="w-full py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
                    >
                        {t('cart.backToHome')}
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#050505] py-20 px-4 flex flex-col items-center justify-center">
                <div className="max-w-xl w-full text-center space-y-12">
                    <div className="space-y-6">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mx-auto shadow-2xl">
                            <span className="text-4xl filter grayscale opacity-40">🛍️</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-serif text-white tracking-wide">{t('cart.emptyCart')}</h2>
                            <p className="text-gray-500 font-light text-sm tracking-wider">{t('cart.emptyCartDesc')}</p>
                        </div>
                        <Link href="/shop" className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-primary hover:text-white transition-all shadow-xl hover:-translate-y-1">
                            {t('cart.goToShop')}
                        </Link>
                    </div>

                    <div className="pt-12 border-t border-white/5">
                        <p className="text-gray-400 text-sm mb-6 font-light">{t('cart.trackPreviousOrder')}</p>
                        <OrderSearch />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen container max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-serif font-bold mb-8 flex items-center gap-4 text-white">
                <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors"><ArrowRight size={24} /></Link>
                {t('cart.title')}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-6 bg-[#111] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                            <div className="w-24 h-24 bg-[#0a0a0a] rounded-xl overflow-hidden shadow-inner shrink-0">
                                <img src={item.image} alt={getLocalized(item, 'name')} className="w-full h-full object-cover opacity-90" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-serif text-lg text-white tracking-wide mb-1">{getLocalized(item, 'name')}</h3>
                                    <p className="text-xl font-light text-primary">{item.price} ₪</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-gray-500 font-light bg-white/5 px-3 py-1 rounded-full border border-white/5">{t('cart.quantity')}: {item.quantity}</span>
                                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-full transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checkout Summary */}
                <div className="h-fit">
                    <div className="bg-[#111] p-6 rounded-3xl border border-white/10 sticky top-4 shadow-2xl">
                        <div className="space-y-4 mb-6 pb-6 border-b border-white/5 font-serif">
                            <div className="flex justify-between text-base">
                                <span className="text-gray-500">{t('cart.subtotal')}:</span>
                                <span className="text-white">{subtotal} ₪</span>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-base text-primary">
                                    <span>{t('cart.discountPoints')}:</span>
                                    <span>-{discount} ₪</span>
                                </div>
                            )}

                            <div className="flex justify-between text-xl pt-2">
                                <span className="text-gray-400">{t('cart.total')}:</span>
                                <span className="text-white font-bold">{total} ₪</span>
                            </div>
                        </div>

                        {/* Loyalty Points Redemption (Optional) */}
                        {user && user.points >= DISCOUNT_THRESHOLD && (
                            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl animate-in fade-in zoom-in duration-500">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                            <Gem size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white font-bold">{t('cart.havePoints').replace('{points}', user.points)}</p>
                                            <p className="text-[10px] text-gray-500">{t('cart.redeemPoints')}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setUsePoints(!usePoints)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${usePoints ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                                    >
                                        {usePoints ? t('cart.activated') : t('cart.activateDiscount')}
                                    </button>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase tracking-widest">{t('cart.fullName')}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-white/30 outline-none transition-all placeholder:text-gray-700 font-light"
                                    placeholder={t('cart.namePlaceholder')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase tracking-widest">{t('cart.phone')}</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-white/30 outline-none transition-all placeholder:text-gray-700 font-light"
                                    placeholder={t('cart.phonePlaceholder')}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {submitting ? t('cart.processing') : t('cart.confirmOrder')}
                            </button>

                            <p className="text-center text-[10px] text-gray-600 mt-4 leading-relaxed">
                                {t('cart.terms')}
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <div className="mt-20 pt-10 border-t border-white/5 max-w-lg mx-auto">
                <p className="text-center text-gray-500 text-sm mb-6 font-light">{t('cart.trackInProgress')}</p>
                <OrderSearch />
            </div>
        </main>
    );
}
