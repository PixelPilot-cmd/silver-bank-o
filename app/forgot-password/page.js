'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate email sending
        setSent(true);
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-secondary-light p-8 rounded-3xl border border-white/5 shadow-2xl text-center">
                {!sent ? (
                    <>
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <Mail size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">نسيت كلمة المرور؟</h1>
                        <p className="text-gray-400 mb-8 text-sm">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                required
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-primary outline-none"
                                style={{ direction: 'ltr' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="btn btn-primary w-full py-4 text-lg">إرسال رابط التحقق</button>
                        </form>
                    </>
                ) : (
                    <div className="py-8 animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">تم الإرسال بنجاح!</h3>
                        <p className="text-gray-400 mb-8 text-sm">تفقد صندوق الوارد (و SPAM) للتعليمات.</p>
                        <Link href="/login" className="btn btn-outline w-full py-3">العودة لتسجيل الدخول</Link>
                    </div>
                )}

                <div className="mt-8">
                    <Link href="/login" className="text-gray-500 text-sm hover:text-white flex items-center justify-center gap-2">
                        <ArrowLeft size={16} />
                        العودة
                    </Link>
                </div>
            </div>
        </main>
    );
}
