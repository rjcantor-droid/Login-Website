"use client";
import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface JwtPayload {
    sub: number;
    username: string;
    role: string;
    exp: number;
    iat: number;
}

export default function DashboardHome() {
    const [username, setUsername] = useState('Guest');
    const [role, setRole] = useState('User');
    const [token, setToken] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const retrievedToken = getToken();
        setToken(retrievedToken);

        if (retrievedToken) {
            try {
                const decoded = jwtDecode<JwtPayload>(retrievedToken);
                if (decoded.username) {
                    setUsername(decoded.username);
                }
                if (decoded.role) {
                    setRole(decoded.role);
                }
            } catch (e) {
                console.error("Token decoding failed:", e);
            }
        }
    }, []);

    const handleCopyToken = () => {
        if (token) {
            navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Card */}
            <div className="bg-black border border-gray-400 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Welcome, {username}!</h3>
                <p className="text-gray-300">You're logged in as <span className="text-black font-semibold bg-white px-2 py-1 rounded">{role}</span></p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-black rounded-lg p-6 hover:shadow-lg transition-all">
                    <p className="text-black text-sm font-bold mb-2 uppercase">Status</p>
                    <p className="text-2xl font-bold text-black">Active</p>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-6 hover:shadow-lg transition-all">
                    <p className="text-black text-sm font-bold mb-2 uppercase">Role</p>
                    <p className="text-2xl font-bold text-black capitalize">{role}</p>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-6 hover:shadow-lg transition-all">
                    <p className="text-black text-sm font-bold mb-2 uppercase">Session</p>
                    <p className="text-2xl font-bold text-black">Secure</p>
                </div>
            </div>

            {/* Token Section */}
            {token && (
                <div className="bg-white border-2 border-black rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-black uppercase">Bearer Token</h4>
                        <button
                            onClick={handleCopyToken}
                            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-all text-sm font-semibold border-2 border-black"
                        >
                            {copied ? (
                                <>
                                    <Check size={16} />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                    <pre className="bg-gray-100 border-2 border-black rounded p-4 text-xs text-black overflow-auto max-h-32 font-mono">
                        {token}
                    </pre>
                </div>
            )}
        </div>
    );
}