import { getOrders } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, Package, Truck, CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import TrackingStatus from './TrackingStatus';
import Header from '@/components/Header';

export const dynamic = 'force-dynamic';

export default async function TrackingPage({ params }) {
    const orders = await getOrders();
    const order = orders.find(o => o.id === params.id);

    if (!order) {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                    <ShoppingBag size={40} className="text-gray-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">عذراً، الطلب غير موجود</h1>
                <p className="text-gray-500 mb-8">تأكد من رقم الطلب الصحيح وحاول مرة أخرى.</p>
                <Link href="/track" className="btn btn-primary px-8">العودة للتتبع</Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black pb-32">
            <Header />

            <div className="max-w-2xl mx-auto px-4 pt-12">
                {/* Order Summary Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-[2.5rem] p-8 mb-10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -translate-y-16 translate-x-16"></div>

                    <div className="text-center relative z-10">
                        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-3">رقم الطلب التسلسلي</p>
                        <h2 className="text-4xl font-mono font-bold text-primary mb-6 tracking-wider">#{order.orderNumber || '---'}</h2>

                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${order.status === 'completed' ? 'bg-gray-400' : 'bg-primary'}`}></div>
                            <span className="text-sm font-bold text-gray-200">{getStatusText(order.status)}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Visual */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 md:p-12 mb-10 shadow-inner">
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-[22px] bottom-[22px] right-[23px] w-[2px] bg-white/5">
                            <div
                                className="absolute top-0 right-0 w-full bg-primary transition-all duration-1000 shadow-[0_0_10px_rgba(215,0,0,0.5)]"
                                style={{ height: getProgressHeight(order.status) }}
                            ></div>
                        </div>

                        <div className="space-y-12">
                            <TimelineStep
                                active={true}
                                done={['preparing', 'ready', 'completed'].includes(order.status)}
                                icon={<Clock size={20} />}
                                title="تأكيد الطلب"
                                desc="تم استلام طلبك بنجاح وهو الآن قيد المراجعة."
                            />
                            <TimelineStep
                                active={['preparing', 'ready', 'completed'].includes(order.status)}
                                done={['ready', 'completed'].includes(order.status)}
                                icon={<Package size={20} />}
                                title="تجهيز القطع"
                                desc="نقوم الآن بتجهيز طلبك وتغليفه بعناية تليق بك."
                            />
                            <TimelineStep
                                active={['ready', 'completed'].includes(order.status)}
                                done={['completed'].includes(order.status)}
                                icon={<CheckCircle size={20} />}
                                title="جاهز للإرسال"
                                desc="انتهينا من التجهيز، يرجى اختيار وسيلة الوصول."
                            />
                            <TimelineStep
                                active={order.status === 'completed'}
                                done={order.status === 'completed'}
                                icon={<Truck size={20} />}
                                title="تم التسليم"
                                desc="وصلت القطعة الفاخرة لمقرها الجديد. شكراً لثقتك."
                            />
                        </div>
                    </div>
                </div>

                {/* Integration for Delivery Choice */}
                <div className="animate-in slide-in-from-bottom duration-700 delay-300">
                    <TrackingStatus order={order} />
                </div>

                {/* Back to Home CTA */}
                <div className="text-center mt-12">
                    <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
                        <ArrowRight size={16} />
                        العودة للمتجر الرئيسي
                    </Link>
                </div>
            </div>
        </main>
    );
}

function TimelineStep({ active, done, icon, title, desc }) {
    return (
        <div className={`relative flex items-start gap-8 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-20 translate-x-2'}`}>
            <div className={`
                relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-700
                ${done ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(215,0,0,0.3)]' :
                    active ? 'bg-black border-primary text-primary shadow-[0_0_15px_rgba(215,0,0,0.1)]' :
                        'bg-black border-white/10 text-gray-600'}
            `}>
                {icon}
            </div>
            <div className="pt-1">
                <h3 className={`font-bold transition-colors duration-500 ${active ? 'text-white' : 'text-gray-500'}`}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{desc}</p>
            </div>
        </div>
    );
}

function getStatusText(status) {
    switch (status) {
        case 'pending': return 'تم الاستلام';
        case 'preparing': return 'قيد التجهيز';
        case 'ready': return 'جاهز للإرسال';
        case 'completed': return 'تم التسليم بنجاح';
        default: return 'جاري المعالجة';
    }
}

function getProgressHeight(status) {
    switch (status) {
        case 'pending': return '12%';
        case 'preparing': return '42%';
        case 'ready': return '72%';
        case 'completed': return '100%';
        default: return '0%';
    }
}
