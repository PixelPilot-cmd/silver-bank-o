'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Sparkles, Send, Clock, Camera, PenTool, Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CustomDesignPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const router = useRouter();
    const { t } = useLanguage();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const savedUser = JSON.parse(localStorage.getItem('customer_user') || 'null');
            const userId = savedUser?.id || null;

            const formData = new FormData(e.target);
            const description = formData.get('description');
            const customerName = formData.get('customerName');
            const customerPhone = formData.get('customerPhone');

            if (!description || !customerName || !customerPhone) {
                alert('الرجاء ملء جميع الحقول المطلوبة');
                setLoading(false);
                return;
            }

            let imageUrl = null;
            if (imageFile) {
                try {
                    const imgData = new FormData();
                    imgData.append('file', imageFile);
                    const uploadRes = await fetch('/api/upload', { method: 'POST', body: imgData });
                    if (uploadRes.ok) {
                        const { url } = await uploadRes.json();
                        imageUrl = url;
                    }
                } catch (err) { }
            }

            const res = await fetch('/api/custom-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    customerName,
                    customerPhone,
                    userId,
                    image: imageUrl,
                    status: 'pending'
                })
            });

            if (res.ok) setSubmitted(true);
            else alert('حدث خطأ أثناء إرسال الطلب');
        } catch (err) {
            alert('حدث خطأ تقني، يرجى المحاولة لاحقاً');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/30 shadow-[0_0_50px_rgba(215,0,0,0.3)]">
                        <Sparkles size={40} className="text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">{t('custom.successTitle')}</h1>
                <p className="text-gray-400 max-w-md mx-auto leading-relaxed mb-12 text-lg">
                    {t('custom.successDesc')}
                </p>
                <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                    <button
                        onClick={() => router.push('/profile')}
                        className="w-full py-5 bg-white text-black font-bold rounded-2xl active:scale-95 transition-all shadow-lg text-lg"
                    >
                        {t('custom.trackInProfile')}
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 text-gray-500 hover:text-white transition-all text-sm font-bold uppercase tracking-widest"
                    >
                        {t('custom.backToHome')}
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] pb-24">
            <Header />
            <div className="container mx-auto px-4 pt-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <div className="flex items-center justify-center gap-2 text-primary text-xs uppercase tracking-[0.5em] font-bold mb-2">
                            <Sparkles size={16} />
                            <span>{t('custom.subtitle')}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
                            {t('custom.title')}
                        </h1>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            {t('custom.desc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <div className="space-y-8 lg:mt-12">
                            <ProcessStep
                                icon={<PenTool size={20} />}
                                title={t('custom.step1Title')}
                                desc={t('custom.step1Desc')}
                            />
                            <ProcessStep
                                icon={<Clock size={20} />}
                                title={t('custom.step2Title')}
                                desc={t('custom.step2Desc')}
                            />
                            <ProcessStep
                                icon={<Gem size={20} />}
                                title={t('custom.step3Title')}
                                desc={t('custom.step3Desc')}
                            />
                        </div>

                        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-500 mr-2">{t('custom.fullName')}</label>
                                        <input
                                            name="customerName"
                                            required
                                            placeholder={t('custom.namePlaceholder')}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none text-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-500 mr-2">{t('custom.phoneNumber')}</label>
                                        <input
                                            name="customerPhone"
                                            required
                                            placeholder={t('custom.phonePlaceholder')}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none text-white transition-all"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 mr-2">{t('custom.designDesc')}</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={5}
                                        placeholder={t('custom.designDescPlaceholder')}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none text-white resize-none"
                                    ></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 mr-2">{t('custom.uploadImage')}</label>
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-[1.5rem] cursor-pointer hover:border-primary/40 transition-all bg-black/20 group overflow-hidden">
                                        {!preview ? (
                                            <>
                                                <Camera className="text-gray-500 mb-2 group-hover:text-primary transition-colors" size={32} />
                                                <span className="text-gray-500 text-sm">{t('custom.uploadPlaceholder')}</span>
                                            </>
                                        ) : (
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn btn-primary py-6 text-xl flex items-center justify-center gap-4 group"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {t('custom.submit')}
                                            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function ProcessStep({ icon, title, desc }) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/10 group-hover:scale-110 transition-transform">{icon}</div>
            <div className="space-y-1">
                <h3 className="text-white font-bold">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
