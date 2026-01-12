'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Clear the admin token cookie
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/20"
        >
            <LogOut size={18} />
            <span>خروج</span>
        </button>
    );
}
