import { getProducts } from '@/lib/db';
import EditProductForm from './EditProductForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }) {
    const products = await getProducts();
    const product = products.find(p => p.id === params.id);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black p-6">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-white/10 rounded-full text-white">
                    <ArrowRight />
                </Link>
                <h1 className="text-2xl font-bold text-white">تعديل المنتج: {product.name}</h1>
            </header>

            <div className="max-w-xl mx-auto">
                <EditProductForm product={product} />
            </div>
        </main>
    );
}
