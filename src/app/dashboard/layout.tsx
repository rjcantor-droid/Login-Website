'use client';
import { useRouter } from 'next/navigation';
import { getToken, logoutUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function DashboardLayout({children}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setIsAuthorized(false);
            router.push('/login');
        }
    }, [router]);

    function handleLogout() {
        logoutUser();
        router.push('/login');
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-gray-300 shadow-lg">
                {/* Logo */}
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold text-white">CANTOR</h1>
                    <p className="text-xs text-gray-500 mt-1">Dashboard</p>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 hover:bg-gray-800 transition-all">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </a>
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-6 left-4 right-4">
                    <Button 
                        onClick={handleLogout}
                        className="w-full bg-black hover:bg-gray-900 text-white border border-gray-700 gap-2"
                    >
                        <LogOut size={18} />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 min-h-screen p-8 bg-white">
                {/* Header */}
                <header className="mb-8">
                    <h2 className="text-4xl font-bold text-black mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Here's what's happening with your account today</p>
                </header>

                {/* Content */}
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 shadow-sm">
                    {children}
                </div>
            </main>
        </div>
    );
}