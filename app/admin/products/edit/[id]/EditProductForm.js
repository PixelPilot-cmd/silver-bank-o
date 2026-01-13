'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload, X, Plus } from 'lucide-react';

export default function EditProductForm({ product }) {
    const [loading, setLoading] = useState(false);

    // Existing images (URLs)
    const [existingImages, setExistingImages] = useState(product.images || (product.image ? [product.image] : []));

    // New images to be uploaded
    const [newImages, setNewImages] = useState([]); // Array of { file, preview }

    const router = useRouter();

    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + existingImages.length + newImages.length > 5) {
            alert('يمكنك رفع 5 صور كحد أقصى للمنتج الواحد');
            return;
        }

        const added = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setNewImages(prev => [...prev, ...added]);
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrls = [...existingImages];

            // Upload all new selected images
            for (const img of newImages) {
                const imageFormData = new FormData();
                imageFormData.append('file', img.file);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: imageFormData
                });

                if (uploadRes.ok) {
                    const { url } = await uploadRes.json();
                    finalImageUrls.push(url);
                }
            }

            // If no images at all, add a placeholder
            if (finalImageUrls.length === 0) {
                finalImageUrls.push("https://placehold.co/400x400/1a1a1a/dadada?text=No+Image");
            }

            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                name_en: formData.get('name_en'),
                name_he: formData.get('name_he'),
                price: Number(formData.get('price')),
                category: formData.get('category'),
                description: formData.get('description'),
                description_en: formData.get('description_en'),
                description_he: formData.get('description_he'),
                images: finalImageUrls,
                image: finalImageUrls[0] // Main image
            };

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

                {/* Multilingual Names */}
                <div className="space-y-4 border-b border-white/5 pb-6">
                    <h3 className="text-white font-bold mb-4">اسم المنتج (Product Name)</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2 mr-2">العربية (Arabic)</label>
                            <input
                                name="name"
                                defaultValue={product.name}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white text-right"
                                placeholder="مثال: خاتم فضة عيار 925"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2 mr-2">English</label>
                            <input
                                name="name_en"
                                defaultValue={product.name_en}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white text-left"
                                placeholder="e.g. Silver Ring"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2 mr-2">עברית (Hebrew)</label>
                            <input
                                name="name_he"
                                defaultValue={product.name_he}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white text-right"
                                placeholder="לדוגמה: טבעת כסף"
                            />
                        </div>
                    </div>
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

                {/* Multiple Image Management Section */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2 mr-2">صور المنتج (حتى 5 صور)</label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {/* Existing Images */}
                        {existingImages.map((url, index) => (
                            <div key={`existing-${index}`} className="relative aspect-square rounded-xl border border-white/10 overflow-hidden group">
                                <img src={url} alt="Product" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center p-0.5 text-gray-400 italic">مرفوعة مسبقاً</div>
                            </div>
                        ))}

                        {/* New Images */}
                        {newImages.map((img, index) => (
                            <div key={`new-${index}`} className="relative aspect-square rounded-xl border border-primary/30 overflow-hidden group">
                                <img src={img.preview} alt="New" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-[8px] text-center p-0.5 text-black font-bold">جديدة</div>
                            </div>
                        ))}

                        {/* Add More Button */}
                        {existingImages.length + newImages.length < 5 && (
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-black/50">
                                <Plus className="w-8 h-8 text-gray-400" />
                                <span className="text-[10px] text-gray-500 mt-1">إضافة صورة</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleNewImageChange}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Multilingual Descriptions */}
                <div className="space-y-4 border-t border-white/5 pt-6">
                    <h3 className="text-white font-bold mb-4">وصف المنتج (Description)</h3>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2 mr-2">الوصف (Arabic)</label>
                        <textarea
                            name="description"
                            defaultValue={product.description}
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white resize-none text-right"
                            placeholder="اكتب وصفاً جذاباً للمنتج..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2 mr-2">Description (English)</label>
                        <textarea
                            name="description_en"
                            defaultValue={product.description_en}
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white resize-none text-left"
                            placeholder="Write a catchy description..."
                            dir="ltr"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2 mr-2">תיאור (Hebrew)</label>
                        <textarea
                            name="description_he"
                            defaultValue={product.description_he}
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white resize-none text-right"
                            placeholder="כתוב תיאור קליט למוצר..."
                        ></textarea>
                    </div>
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
