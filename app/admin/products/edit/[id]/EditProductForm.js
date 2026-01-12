'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Save } from 'lucide-react';

export default function EditProductForm({ product }) {
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
            image: formData.get('image')
        };

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                router.push('/admin/products');
                router.refresh();
            } else {
                alert('فشل تحديث المنتج');
            }
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-secondary/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">

                <div className="flex justify-center mb-4">
                    <img src={product.image} className="w-32 h-32 rounded-2xl object-cover border-2 border-primary/20 shadow-xl" alt="Preview" />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2 mr-2">اسم المنتج</label>
                    <input
                        name="name"
                        defaultValue={product.name}
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                        placeholder="مثال: خاتم فضة عيار 925"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2 mr-2">السعر (شيكل)</label>
                        <input
                            name="price"
                            type="number"
                            defaultValue={product.price}
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2 mr-2">القسم</label>
                        <select
                            name="category"
                            defaultValue={product.category}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white appearance-none"
                        >
                            <option value="watches">ساعات فاخرة</option>
                            <option value="rings">خواتم فضة</option>
                            <option value="women_sets">أطقم نسائية</option>
                            <option value="accessories">اكسسوارات</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2 mr-2">رابط الصورة</label>
                    <input
                        name="image"
                        defaultValue={product.image}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                        placeholder="https://..."
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2 mr-2">الوصف</label>
                    <textarea
                        name="description"
                        defaultValue={product.description}
                        rows={4}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white resize-none"
                        placeholder="اكتب وصفاً جذاباً للمنتج..."
                    ></textarea>
                </div>

            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-black font-black py-5 rounded-2xl text-lg transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        جاري الحفظ...
                    </>
                ) : (
                    <>
                        <Save size={22} />
                        حفظ التعديلات
                    </>
                )}
            </button>
        </form>
    );
}
