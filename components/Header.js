'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, LogOut, Store, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NotificationBell from './NotificationBell';

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

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold hidden sm:block">مرحباً، {user.name}</span>
                            <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 rounded-full text-red-500 transition-colors" title="تسجيل خروج">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
                            <User size={20} />
                            <span className="hidden sm:block">دخول / تسجيل</span>
                        </Link>
                    )}

                    {/* Shop Page Link */}
                    <Link href="/shop" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="المعرض">
                        <Store size={22} />
                    </Link>

                    {/* Tracking Page Link */}
                    <NotificationBell />

                    <Link href="/track" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="تتبع الطلب">
                        <Truck size={22} />
                    </Link>

                    <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors" title="سلة المشتريات">
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black animate-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Admin Link (Subtle) */}
                    <Link href="/admin" className="text-xs text-gray-500 hover:text-white px-2 border-r border-white/10 mr-2">
                        Admin
                    </Link>
                </div>
            </div>
        </header>
    );
}
