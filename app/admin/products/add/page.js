'use client';

import { useState } from 'react';
import { ArrowRight, Upload, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            price: Number(formData.get('price')),
            category: formData.get('category'),
            description: formData.get('description'),
            image: formData.get('image') || "https://placehold.co/400x400/1a1a1a/dadada?text=No+Image"
        };

        try {
            await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            router.push('/admin/products');
            router.refresh();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black p-6">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-white/10 rounded-full text-white">
                    <ArrowRight />
                </Link>
                <h1 className="text-2xl font-bold text-white">إضافة منتج جديد</h1>
            </header>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
                <div className="bg-secondary-light p-6 rounded-2xl border border-white/5 space-y-4">

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">اسم المنتج</label>
                        <input name="name" required className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none" placeholder="مثال: خاتم فضة عيار 925" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">السعر (شيكل)</label>
                            <input name="price" type="number" required className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">القسم</label>
                            <select name="category" className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none">
                                <option value="watches">ساعات فاخرة</option>
                                <option value="rings">خواتم فضة</option>
                                <option value="women_sets">أطقم نسائية</option>
                                <option value="accessories">اكسسوارات</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">رابط الصورة</label>
                        <input name="image" className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none" placeholder="https://..." />
                        <p className="text-xs text-gray-500 mt-1">يمكنك استخدام رابط خارجي حالياً</p>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">الوصف</label>
                        <textarea name="description" rows={4} className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none" placeholder="اكتب وصفاً جذاباً للمنتج..."></textarea>
                    </div>

                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 text-lg">
                    {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
                </button>
            </form>
        </main>
    );
}
