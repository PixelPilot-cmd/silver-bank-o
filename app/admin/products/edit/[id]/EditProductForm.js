'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload, X } from 'lucide-react';

export default function EditProductForm({ product }) {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(product.image);
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
        setImagePreview(product.image);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = product.image;

            // Upload new image if selected
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

                {/* Image Upload/Change Section */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2 mr-2">صورة المنتج</label>

                    <div className="relative w-full h-48 border border-white/10 rounded-xl overflow-hidden bg-black/50">
                        <img
                            src={imagePreview}
                            alt="Product"
                            className="w-full h-full object-cover"
                        />

                        {imageFile && (
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors z-10"
                            >
                                <X size={20} />
                            </button>
                        )}

                        <label className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-black font-bold rounded-lg cursor-pointer transition-colors">
                            <Upload size={18} />
                            <span>تغيير الصورة</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
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
