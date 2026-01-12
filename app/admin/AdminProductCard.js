'use client';

import { useState } from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProductCard({ product }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.refresh();
            } else {
                alert('فشل حذف المنتج');
            }
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء الاتصال بالخادم');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={`bg-secondary/50 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4 transition-all hover:bg-white/5 ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/5 flex-shrink-0">
                    <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-primary font-medium">{product.price} ₪</span>
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                            {product.category}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all border border-white/10"
                    title="تعديل"
                >
                    <Edit2 size={18} />
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 transition-all border border-red-500/20"
                    title="حذف"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
