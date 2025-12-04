'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { API_BASE } from '@/lib/config';
import { FormEvent } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function RegisterPage() {

    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.message || 'Register failed');
            return;
        }

        router.push('/login');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
            </div>

            <Card className="w-full max-w-md border-2 border-black shadow-2xl bg-white relative z-10">
                <CardContent className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-black mb-2">CANTOR</h1>
                        <p className="text-gray-600 font-semibold">Create Account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-red-700 font-medium text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="text-sm font-bold text-black uppercase tracking-wider block mb-2">Username</label>
                            <Input 
                                placeholder="Choose your username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                className="border-2 border-black rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="text-sm font-bold text-black uppercase tracking-wider block mb-2">Password</label>
                            <Input 
                                type="password" 
                                placeholder="Create a strong password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-2 border-black rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                required
                            />
                        </div>

                        <Button 
                            className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 rounded-lg border-2 border-black transition-all flex items-center justify-center gap-2 mt-6" 
                            type="submit"
                            disabled={loading}
                        >
                            <UserPlus size={20} />
                            {loading ? 'Creating account...' : 'Register'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 border-t-2 border-gray-300"></div>
                        <span className="text-gray-500 text-sm font-semibold">OR</span>
                        <div className="flex-1 border-t-2 border-gray-300"></div>
                    </div>

                    {/* Login Link */}
                    <Button 
                        variant="outline"
                        className="w-full border-2 border-black text-black hover:bg-black hover:text-white font-bold py-3 rounded-lg transition-all"
                        onClick={() => router.push('/login')}
                    >
                        Back to Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}