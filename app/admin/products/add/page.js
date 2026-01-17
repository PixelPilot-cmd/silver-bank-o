'use client';

import { useState } from 'react';
import { ArrowRight, Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]); // Array of { file, preview }
    const router = useRouter();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert('يمكنك رفع 5 صور كحد أقصى للمنتج الواحد');
            return;
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrls = [];

            // Upload all selected images
            for (const img of images) {
                const imageFormData = new FormData();
                imageFormData.append('file', img.file);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: imageFormData
                });

                if (uploadRes.ok) {
                    const { url } = await uploadRes.json();
                    imageUrls.push(url);
                }
            }

            // If no images uploaded, use placeholder
            if (imageUrls.length === 0) {
                imageUrls.push("https://placehold.co/400x400/1a1a1a/dadada?text=No+Image");
            }

            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                name_en: formData.get('name_en'), // English Name
                name_he: formData.get('name_he'), // Hebrew Name
                price: Number(formData.get('price')),
                category: formData.get('category'),
                description: formData.get('description'),
                description_en: formData.get('description_en'), // English Description
                description_he: formData.get('description_he'), // Hebrew Description
                images: imageUrls,
                image: imageUrls[0]
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

                    {/* Multilingual Names */}
                    <div className="space-y-4 border-b border-white/5 pb-6">
                        <h3 className="text-white font-bold mb-4">اسم المنتج (Product Name)</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">العربية (Arabic)</label>
                                <input name="name" required className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-white text-right" placeholder="مثال: خاتم فضة" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">English</label>
                                <input name="name_en" className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-white text-left" placeholder="e.g. Silver Ring" dir="ltr" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">עברית (Hebrew)</label>
                                <input name="name_he" className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-white text-right" placeholder="לדוגמה: טבעת כסף" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">السعر (شيكل)</label>
                            <input name="price" type="number" required className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-white" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">القسم</label>
                            <select name="category" className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-white">
                                <option value="watches">قسم رجالي</option>
                                <option value="women_sets">قسم قطع نسائية</option>
                                <option value="rings">قسم قطع اطفال</option>
                                <option value="rosaries">قسم قطع انتيك</option>
                                <option value="accessories">قسم اكسسوارات</option>
                            </select>
                        </div>
                    </div>

                    {/* Multiple Image Upload Section */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">صور المنتج (حتى 5 صور)</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-xl border border-white/10 overflow-hidden group">
                                    <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            {images.length < 5 && (
                                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-black/50">
                                    <Plus className="w-8 h-8 text-gray-400" />
                                    <span className="text-[10px] text-gray-500 mt-1">إضافة صورة</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>

                        {images.length === 0 && (
                            <p className="text-xs text-center text-gray-500">يُرجى رفع صورة واحدة على الأقل للمنتج</p>
                        )}
                    </div>

                    {/* Multilingual Descriptions */}
                    <div className="space-y-4 border-t border-white/5 pt-6">
                        <h3 className="text-white font-bold mb-4">وصف المنتج (Description)</h3>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">الوصف (Arabic)</label>
                            <textarea name="description" rows={3} className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-white text-right" placeholder="اكتب وصفاً جذاباً للمنتج..."></textarea>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Description (English)</label>
                            <textarea name="description_en" rows={3} className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-white text-left" placeholder="Write a catchy description..." dir="ltr"></textarea>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">תיאור (Hebrew)</label>
                            <textarea name="description_he" rows={3} className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-white text-right" placeholder="כתוב תיאור קליט למוצר..."></textarea>
                        </div>
                    </div>

                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
                </button>
            </form>
        </main>
    );
}
