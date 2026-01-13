import { getOrders } from '@/lib/db';
import Link from 'next/link'; // Import Link
import { Package, Plus, LogOut, Sparkles } from 'lucide-react'; // Import icons
import AdminOrderCard from './AdminOrderCard';
import LogoutButton from './LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const orders = await getOrders();

    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <main className="min-h-screen bg-black p-6">
            <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-bold text-white">لوحة تحكم الإدارة</h1>
                    <Link href="/admin/products" className="flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <Plus size={16} />
                        إدارة المنتجات
                    </Link>
                    <Link href="/admin/custom-orders" className="flex items-center gap-2 text-blue-500 hover:text-white transition-colors text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <Sparkles size={16} />
                        طلبات التفصيل
                    </Link>
                </div>
                <LogoutButton />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedOrders.map((order) => (
                    <AdminOrderCard key={order.id} order={order} />
                ))}
                {sortedOrders.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        لا توجد طلبات حتى الآن
                    </div>
                )}
            </div>
        </main>
    );
}
