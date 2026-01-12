import Header from '@/components/Header';
import OrderSearch from '@/components/OrderSearch';
import { PackageSearch, ShieldCheck, Truck } from 'lucide-react';

export default function TrackingLanding() {
    return (
        <main className="min-h-screen pb-20 overflow-x-hidden">
            <Header />

            <div className="container mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">تتبع رحلة طلبك</h1>
                    <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                        أدخل رقم الطلب الذي استلمته عند تأكيد الشراء لمتابعة حالة التجهيز والشحن لحظة بلحظة.
                    </p>
                </div>

                <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <OrderSearch />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
                    <FeatureCard
                        icon={<PackageSearch className="text-primary" size={32} />}
                        title="تجهيز دقيق"
                        desc="يتم تغليف كل قطعة بعناية فائقة لضمان وصولها بأبهى صورة."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="text-primary" size={32} />}
                        title="أصالة مضمونة"
                        desc="جميع منتجاتنا فضة أصلية مع شهادة ضمان حقيقية."
                    />
                    <FeatureCard
                        icon={<Truck className="text-primary" size={32} />}
                        title="توصيل سريع"
                        desc="نغطي كافة مناطق الضفة والقدس والداخل المحتل."
                    />
                </div>
            </div>
        </main>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center hover:bg-white/10 transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
