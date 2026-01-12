'use client';

import { useState } from 'react';
import { ArrowRight, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const router = useRouter();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "https://placehold.co/400x400/1a1a1a/dadada?text=No+Image";

            // Upload image if selected
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('file', imageFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: imageFormData
                });

                if (uploadRes.ok) {
                    const { url } = await uploadRes.json();
                    imageUrl = url;
                }
            }

            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                price: Number(formData.get('price')),
                category: formData.get('category'),
                description: formData.get('description'),
                image: imageUrl
            };

            await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            router.push('/admin/products');
            router.refresh();
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء إضافة المنتج');
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

                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">صورة المنتج</label>

                        {!imagePreview ? (
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-black/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-12 h-12 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-400">
                                        <span className="font-semibold">اضغط لرفع صورة</span> أو اسحب الصورة هنا
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        ) : (
                            <div className="relative w-full h-48 border border-white/10 rounded-xl overflow-hidden">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">الوصف</label>
                        <textarea name="description" rows={4} className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none" placeholder="اكتب وصفاً جذاباً للمنتج..."></textarea>
                    </div>

                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
                </button>
            </form>
        </main>
    );
}
