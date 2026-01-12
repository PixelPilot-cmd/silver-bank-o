'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Save user to local storage for client state
                localStorage.setItem('customer_user', JSON.stringify(data.user));
                router.push('/');
                router.refresh();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('حدث خطأ غير متوقع');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold title-gradient mb-2">بنك الفضة</h1>
                    <p className="text-gray-400">سجل دخولك للمتابعة</p>
                </div>

                <div className="bg-secondary-light p-8 rounded-3xl border border-white/5 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-primary outline-none text-left" // ltr check
                                style={{ direction: 'ltr' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm text-gray-400">كلمة المرور</label>
                                <Link href="/forgot-password" className="text-xs text-primary hover:underline">نسيت كلمة المرور؟</Link>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-primary outline-none"
                                style={{ direction: 'ltr' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

                        <button disabled={loading} className="btn btn-primary w-full py-4 text-lg">
                            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        ليس لديك حساب؟ <Link href="/register" className="text-white font-bold hover:underline">أنشئ حساباً جديداً</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
