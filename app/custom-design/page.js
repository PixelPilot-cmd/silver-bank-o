'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Sparkles, Send, Clock, BadgeCheck, Camera, PenTool, Gem } from 'lucide-react';
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

            // Validate required fields
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
                        const uploadResult = await uploadRes.json();
                        imageUrl = uploadResult.url;
                    } else {
                        console.error('Image upload failed:', await uploadRes.text());
                        // Continue without image if upload fails
                    }
                } catch (uploadErr) {
                    console.error('Image upload error:', uploadErr);
                    // Continue without image if upload fails
                }
            }

            const requestBody = {
                description: description.trim(),
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim(),
                userId: userId,
                image: imageUrl,
                status: 'pending'
            };

            console.log('Sending custom request:', requestBody);

            const res = await fetch('/api/custom-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (res.ok) {
                const result = await res.json();
                console.log('Custom request created:', result);
                setSubmitted(true);
            } else {
                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Server error:', errorData);
                alert('حدث خطأ أثناء إرسال الطلب: ' + (errorData.error || 'خطأ غير معروف'));
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-4xl">✨</span>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">تم إرسال طلبك بنجاح</h1>
                <p className="text-gray-400 max-w-sm mx-auto mb-10">
                    شكراً لك. تم استلام طلب التفصيل الخاص بك. يمكنك متابعة حالة الطلب من صفحة حسابك الشخصي.
                </p>

                <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                    <button
                        onClick={() => router.push('/profile')}
                        className="w-full py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform"
                    >
                        الذهاب إلى حسابي
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-3 text-gray-500 text-sm hover:text-white"
                    >
                        العودة للرئيسية
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
                    {/* Header Section */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="flex items-center justify-center gap-2 text-primary text-xs uppercase tracking-[0.5em] font-bold mb-2">
                            <Sparkles size={16} />
                            <span>Unique Masterpieces</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
                            صمم قطعة بصمتك الخاصة
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
