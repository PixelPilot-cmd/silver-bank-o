'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        // Updated to the secure admin password
        if (password === 'Oo123456!') {
            // Setting a session cookie (expires when browser closes)
            document.cookie = 'admin_token=true; path=/; SameSite=Strict';
            router.push('/admin');
            router.refresh();
        } else {
            setError(true);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-secondary-light p-8 rounded-2xl border border-white/10">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <Lock size={32} />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-white text-center mb-8">تسجيل دخول الإدارة</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="كلمة المرور"
                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-center focus:border-primary outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">كلمة المرور غير صحيحة</p>}
                    <button className="btn btn-primary w-full py-4 text-lg">دخول</button>
                </form>
            </div>
        </main>
    );
}
