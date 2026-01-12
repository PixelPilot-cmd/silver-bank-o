import { getProducts } from '@/lib/db';
import Link from 'next/link';
import { ShoppingBag, Watch, Gem, Circle, Sparkles, Orbit, Search } from 'lucide-react';
import Header from '@/components/Header';

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }) {
    const allProducts = await getProducts();
    const activeCategory = searchParams?.category || null;
    const searchQuery = searchParams?.search?.toLowerCase() || '';

    // Filter products
    let products = activeCategory
        ? allProducts.filter(p => p.category === activeCategory)
        : allProducts;

    if (searchQuery) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            p.description?.toLowerCase().includes(searchQuery)
        );
    }

    const categories = [
        { id: 'watches', name: 'ساعات فاخرة', icon: Watch },
        { id: 'rings', name: 'خواتم فضة', icon: Circle },
        { id: 'women_sets', name: 'أطقم نسائية', icon: Gem },
        { id: 'rosaries', name: 'سبح ملكية', icon: Orbit },
        { id: 'accessories', name: 'اكسسوارات', icon: Sparkles },
    ];

    return (
        <main className="min-h-screen pb-20">
            <Header />

            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">المعرض</h1>
                    <p className="text-gray-400 tracking-widest text-sm uppercase">Exclusive Collection</p>
                </div>

                {/* Category Navigation (Functional) */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    <Link
                        href="/shop"
                        className={`group relative h-24 w-24 md:h-28 md:w-28 rounded-2xl border ${!activeCategory ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'} backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden shadow-lg hover:scale-105 hover:shadow-primary/20`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 border ${!activeCategory ? 'bg-primary text-black border-primary' : 'bg-black/20 text-gray-400 border-white/5 group-hover:text-white'}`}>
                            <span className="text-xl font-bold">∞</span>
                        </div>
                        <span className={`text-xs md:text-sm font-bold transition-colors ${!activeCategory ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>الكل</span>
                    </Link>

                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;

                        return (
                            <Link
                                key={cat.id}
                                href={`/shop?category=${cat.id}`}
                                className={`group relative h-24 w-24 md:h-28 md:w-28 rounded-2xl border ${isActive ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'} backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden shadow-lg hover:scale-105 hover:shadow-primary/20`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 border ${isActive ? 'bg-primary text-black border-primary' : 'bg-black/20 text-gray-400 border-white/5 group-hover:text-white'}`}>
                                    <Icon size={20} strokeWidth={1.5} />
                                </div>
                                <span className={`text-xs md:text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{cat.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Products Grid */}
                <div className="w-full max-w-[1600px] mx-auto">
                    {/* Active Filters / Navigation */}
                    <div className="flex flex-wrap items-center gap-4 mb-10">
                        {activeCategory && (
                            <div className="flex items-center gap-2 text-gray-500 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5 animate-in fade-in slide-in-from-right duration-500">
                                <Link href="/shop" className="hover:text-white transition-colors">المعرض</Link>
                                <span>/</span>
                                <span className="text-white font-medium">{categories.find(c => c.id === activeCategory)?.name}</span>
                                <Link href="/shop" className="mr-2 text-gray-600 hover:text-white transition-colors" title="إلغاء الفرز">×</Link>
                            </div>
                        )}

                        {searchQuery && (
                            <div className="flex items-center gap-3 bg-primary/10 px-5 py-2.5 rounded-full border border-primary/20 text-sm animate-in fade-in slide-in-from-right duration-700">
                                <Search size={14} className="text-primary" />
                                <span className="text-white font-light tracking-wide">نتائج البحث عن: <span className="font-bold">"{searchQuery}"</span></span>
                                <Link href={activeCategory ? `/shop?category=${activeCategory}` : '/shop'} className="mr-3 w-5 h-5 flex items-center justify-center bg-primary/20 hover:bg-primary/40 rounded-full text-primary transition-all" title="مسح البحث">×</Link>
                            </div>
                        )}
                    </div>

                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                {activeCategory === 'watches' ? <Watch size={40} className="text-gray-500" /> :
                                    activeCategory === 'rings' ? <Circle size={40} className="text-gray-500" /> :
                                        <ShoppingBag size={40} className="text-gray-500" />}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif text-white tracking-wide">
                                    {searchQuery
                                        ? `لم نجد نتائج لـ "${searchQuery}"`
                                        : activeCategory
                                            ? `لا توجد ${categories.find(c => c.id === activeCategory)?.name} حالياً`
                                            : 'لا توجد منتجات حالياً'}
                                </h3>
                                <p className="text-gray-400 font-light text-sm tracking-wider">
                                    {searchQuery
                                        ? 'حاول البحث بعبارة أخرى أو تصفح الأقسام المتوفرة.'
                                        : activeCategory
                                            ? 'نعمل على اختيار قطع فاخرة لهذا القسم بعناية.'
                                            : 'المتجر قيد التحديث، يرجى العودة لاحقاً.'}
                                </p>
                            </div>
                            <Link href="/shop" className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm transition-all text-white font-medium">
                                العودة للمعرض الشامل
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <Link href={`/product/${product.id}`} key={product.id} className="group relative bg-transparent border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-500 flex flex-col">
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                                        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                                            <button className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-medium hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg">
                                                <ShoppingBag size={18} />
                                                <span>إضافة للسلة</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-5 text-center flex-1 flex flex-col justify-between bg-gradient-to-b from-[#0a0a0a] to-black">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2 font-serif tracking-wide">{product.name}</h3>
                                            <p className="text-sm text-gray-500 font-light tracking-wider">{categories.find(c => c.id === product.category)?.name || 'قطعة فاخرة'}</p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <span className="text-xl font-medium text-white block tracking-widest">{product.price} <span className="text-xs text-primary/80">₪</span></span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
