import { getProducts } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Gem, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import AddToCartButton from './AddToCartButton';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
    const products = await getProducts();
    const product = products.find(p => p.id === params.id);

    if (!product) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
                <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
                <Link href="/shop" className="btn btn-primary">العودة للمعرض</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] pb-32">
            <Header />

            <div className="container mx-auto px-4 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Cinematic Image Gallery (Single Image for now) */}
                    <div className="relative group perspective-1000">
                        <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 group-hover:border-white/20">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Glass Reflection Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Floating Decoration */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 blur-[60px] rounded-full animate-pulse-slow"></div>
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 blur-[80px] rounded-full"></div>
                    </div>

                    {/* Product Details Content */}
                    <div className="flex flex-col animate-in fade-in slide-in-from-right duration-700">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-[0.4em] font-bold mb-4 opacity-70">
                                <Sparkles size={14} />
                                <span>صياغة فاخرة</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                                {product.name}
                            </h1>
                            <div className="text-3xl md:text-5xl font-light text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
                                {product.price} <span className="text-sm font-bold text-primary">₪</span>
                            </div>
                        </div>

                        {/* Description Box */}
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-10 backdrop-blur-xl">
                            <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                                <Gem size={14} className="text-primary" />
                                جوهر القطعة
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg font-light">
                                {product.description || "هذه القطعة تم اختيارها بعناية فائقة لتجسد التوازن المثالي بين الحداثة والتقاليد. صُنعت يدوياً لتدوم طويلاً وتمنحك حضوراً واثقاً وفخماً في كل لحظة."}
                            </p>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            <FeatureBadge
                                icon={<ShieldCheck size={20} />}
                                title="ضمان الأصالة"
                                desc="فضة 925 أصلية 100%"
                            />
                            <FeatureBadge
                                icon={<Truck size={20} />}
                                title="توصيل ملكي"
                                desc="تغليف هدايا فاخر مجاني"
                            />
                        </div>

                        {/* Action Area */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <AddToCartButton product={product} />
                            </div>
                            <Link
                                href="/track"
                                className="flex items-center justify-center px-8 py-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-gray-400 hover:text-white"
                            >
                                <ArrowRight size={20} className="rotate-180 ml-2" />
                                تتبع الطلبات
                            </Link>
                        </div>

                        <p className="text-center text-[10px] text-gray-600 mt-6 tracking-widest uppercase">
                            Premium Craftsmanship . Silver Bank 3 . 2026
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

function FeatureBadge({ icon, title, desc }) {
    return (
        <div className="flex items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5">
                {icon}
            </div>
            <div>
                <h4 className="text-white text-sm font-bold leading-none mb-1">{title}</h4>
                <p className="text-gray-500 text-xs">{desc}</p>
            </div>
        </div>
    );
}
