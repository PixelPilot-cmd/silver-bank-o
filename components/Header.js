'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, LogOut, Store, Truck, Gem, Lock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check for customer login
        const customer = localStorage.getItem('customer_user');
        if (customer) {
            setUser(JSON.parse(customer));
        }

        // Sync Cart Count
        const syncCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(count);
        };

        syncCart();
        window.addEventListener('cart-updated', syncCart);
        window.addEventListener('storage', syncCart); // Sync between tabs

        return () => {
            window.removeEventListener('cart-updated', syncCart);
            window.removeEventListener('storage', syncCart);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('customer_user');
        setUser(null);
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-white/10 px-4 py-4">
            <div className="container flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-black rounded-full flex items-center justify-center font-bold text-xl text-white border border-white/20">
                        3
                    </div>
                    <span className="font-bold text-lg tracking-wide hidden sm:block">بنك الفضة</span>
                </Link>

                {/* Search Bar */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (searchTerm.trim()) router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
                    }}
                    className="hidden md:flex flex-1 max-w-md mx-8"
                >
                    <div className="relative w-full group">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث عن قطعة فاخرة..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pr-10 pl-10 text-sm focus:border-primary focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                        />
                        <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-primary transition-colors">
                            <Search className="w-4 h-4" />
                        </button>
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="absolute left-3 top-2.5 text-gray-600 hover:text-white transition-colors"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </form>

                {/* Main Navigation (Desktop) */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase">المتجر</Link>
                    <Link href="/custom-design" className="text-primary hover:text-white transition-colors text-sm font-bold tracking-widest uppercase flex items-center gap-1">
                        <Sparkles size={14} />
                        طلب خاص
                    </Link>
                    <Link href="/track" className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase">تتبع الطلب</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-3">
                    {user ? (
                        <div className="flex items-center gap-1 sm:gap-3">
                            <Link href="/profile" className="flex flex-col items-end leading-tight hover:text-primary transition-all cursor-pointer">
                                <span className="text-[10px] sm:text-sm font-bold truncate max-w-[80px] sm:max-w-none">
                                    {user.name}
                                </span>
                                {user.points > 0 ? (
                                    <span className="text-[9px] sm:text-[10px] text-primary flex items-center gap-0.5">
                                        <Gem size={8} className="sm:w-2.5" />
                                        {user.points} <span className="hidden xs:inline">نقطة</span>
                                    </span>
                                ) : (
                                    <span className="text-[9px] text-gray-500">حساب فضي</span>
                                )}
                            </Link>
                            <button onClick={handleLogout} className="p-1.5 sm:p-2 hover:bg-red-500/10 rounded-full text-red-500 transition-colors" title="تسجيل خروج">
                                <LogOut size={18} className="sm:w-5" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="px-4 sm:px-6 py-2 bg-white text-black text-xs sm:text-sm font-bold rounded-full hover:bg-primary hover:text-white transition-all">
                            دخول
                        </Link>
                    )}

                    {/* Admin Quick Access */}
                    <Link href="/admin/login" className="p-2 text-gray-500 hover:text-primary transition-colors" title="لوحة التحكم">
                        <Lock size={18} className="sm:w-5" />
                    </Link>

                    {/* Desktop/Tablet Store Link */}
                    <Link href="/shop" className="hidden sm:flex p-2 hover:bg-white/10 rounded-full transition-colors" title="المعرض">
                        <Store size={22} />
                    </Link>


                    {/* Tracking Link */}
                    <Link href="/track" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="تتبع الطلب">
                        <Truck size={22} />
                    </Link>

                    {/* Cart Link */}
                    <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors" title="سلة المشتريات">
                        <ShoppingBag size={22} className="md:w-6 md:h-6" />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center border border-black animate-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Admin Link (More hidden on small screens) */}
                    <Link href="/admin" className="hidden xs:block text-[10px] text-gray-500 hover:text-white px-2 border-r border-white/10 ml-1">
                        Admin
                    </Link>
                </div>
            </div>
        </header>
    );
}
