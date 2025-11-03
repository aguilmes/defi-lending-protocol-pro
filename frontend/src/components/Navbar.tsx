import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Navbar({ children }: { children?: React.ReactNode }) {
    return (
        <nav className="w-full py-4 px-6 flex justify-between items-center bg-gray-900 text-white shadow">
            <div className="text-2xl font-bold">DeFi Lending Protocol</div>
            <div className="flex items-center gap-4">
                <Link href="/">Home</Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/deposit">Deposit</Link>
                <Link href="/borrow">Borrow</Link>
                <ConnectButton />
            </div>
        </nav>
    );
}