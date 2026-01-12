import { getProducts } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import AdminProductCard from '../AdminProductCard';

export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
    const products = await getProducts();

    return (
        <main className="min-h-screen bg-black p-6">
            <header className="flex items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-white/10 rounded-full text-white">
                        <ArrowLeft />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">إدارة المنتجات</h1>
                </div>
                <Link href="/admin/products/add" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-black font-bold px-6 py-3 rounded-full transition-all shadow-lg shadow-primary/20">
                    <Plus size={20} />
                    <span>إضافة قطعة فاخرة</span>
                </Link>
            </header>

            <div className="max-w-4xl mx-auto space-y-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <AdminProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus size={40} className="text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">لا توجد منتجات بعد</h3>
                        <p className="text-gray-500 mb-8">ابدأ بإضافة أول قطعة فاخرة لمجموعتك</p>
                        <Link href="/admin/products/add" className="text-primary hover:underline font-bold">إضافة أول منتج الآن</Link>
                    </div>
                )}
            </div>
        </main>
    );
}
