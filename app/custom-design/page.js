'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Sparkles, Send, Clock, BadgeCheck, Camera, PenTool, Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomDesignPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const router = useRouter();

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

        const savedUser = JSON.parse(localStorage.getItem('customer_user') || 'null');
        const userId = savedUser?.id;

        const formData = new FormData(e.target);
        const description = formData.get('description');
        const customerName = formData.get('customerName');
        const customerPhone = formData.get('customerPhone');

        try {
            let imageUrl = null;
            if (imageFile) {
                const imgData = new FormData();
                imgData.append('file', imageFile);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: imgData });
                if (uploadRes.ok) {
                    const { url } = await uploadRes.json();
                    imageUrl = url;
                }
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

            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => router.push('/'), 5000);
            }
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء إرسال الطلب');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <BadgeCheck className="text-primary w-12 h-12" />
                </div>
                <h1 className="text-4xl font-serif font-bold text-white mb-4">تم استلام طلبك الملكي</h1>
                <p className="text-gray-400 max-w-md leading-relaxed">
                    سيقوم خبراؤنا بدراسة طلبك وتحديد التكلفة المناسبة. ستتلقى اتصالاً منا خلال 24 ساعة لمناقشة التفاصيل والسعر.
                </p>
                <div className="mt-12 text-xs text-gray-600 tracking-[0.3em] uppercase">
                    Silver Bank Luxury Custom Craft
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] pb-24">
            <Header />

            <div className="container mx-auto px-4 pt-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="flex items-center justify-center gap-2 text-primary text-xs uppercase tracking-[0.5em] font-bold mb-2">
                            <Sparkles size={16} />
                            <span>Unique Masterpieces</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
                            صمم قطعة <br /> <span className="title-gradient">بصمتك الخاصة</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            حوّل خيالك إلى حقيقة ملموسة من الفضة الخالصة. أخبرنا عن فكرتك، وسنتولى صياغتها بأعلى معايير الفخامة.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        {/* Process Info */}
                        <div className="space-y-8 lg:mt-12">
                            <ProcessStep
                                icon={<PenTool size={20} />}
                                title="1. صف فكرتك"
                                desc="اكتب تفاصيل القطعة التي ترغب بها، سواء كانت خاتماً، قلادة، أو طقماً كاملاً."
                            />
                            <ProcessStep
                                icon={<Clock size={20} />}
                                title="2. التسعير الاحترافي"
                                desc="سيقوم خبراؤنا بتقدير الجهد والمواد وتقديم سعر عادل خلال ساعات."
                            />
                            <ProcessStep
                                icon={<Gem size={20} />}
                                title="3. الصياغة اليدوية"
                                desc="بمجرد موافقتك على السعر، يبدأ حرفيونا بالعمل على قطعتك الفريدة."
                            />
                        </div>

                        {/* Request Form */}
                        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-500 mr-2">الاسم الكامل</label>
                                        <input
                                            name="customerName"
                                            required
                                            placeholder="أدخل اسمك"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none text-white transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-500 mr-2">رقم التواصل</label>
                                        <input
                                            name="customerPhone"
                                            required
                                            placeholder="رقم الواتساب الخاص بك"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none text-white transition-all shadow-inner"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 mr-2">وصف التصميم</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={5}
                                        placeholder="مثال: أريد خاتم فضة عيار 925 مرصعاً بحجر عقيق يماني أحمر، مع حفر اسم 'عمر' من الداخل بخط ديواني..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary outline-none text-white transition-all shadow-inner resize-none"
                                    ></textarea>
                                </div>

                                {/* Optional Image Upload */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 mr-2">صورة توضيحية (اختياري)</label>
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-[1.5rem] cursor-pointer hover:border-primary/40 transition-all bg-black/20 group overflow-hidden">
                                        {!preview ? (
                                            <>
                                                <Camera className="text-gray-500 mb-2 group-hover:text-primary transition-colors" size={32} />
                                                <span className="text-gray-500 text-sm">ارفع صورة أو اسكتش لفكرتك</span>
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
                                            ارسال طلب التفصيل
                                            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform rotate-[inherit]" />
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
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/10 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="space-y-1">
                <h3 className="text-white font-bold">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
