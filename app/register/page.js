'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('customer_user', JSON.stringify(data.user));
                router.push('/');
                router.refresh();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('حدث خطأ أثناء التسجيل');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">إنشاء حساب جديد</h1>
                    <p className="text-gray-400">انضم لعائلة بنك الفضة</p>
                </div>

                <div className="bg-secondary-light p-8 rounded-3xl border border-white/5 shadow-2xl">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">الاسم الكامل</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-primary outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-primary outline-none"
                                style={{ direction: 'ltr' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">كلمة المرور</label>
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
                            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        لديك حساب بالفعل؟ <Link href="/login" className="text-white font-bold hover:underline">سجل دخولك</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
