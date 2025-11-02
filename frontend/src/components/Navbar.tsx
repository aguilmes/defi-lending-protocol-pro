import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar({ children }: { children?: React.ReactNode }) {
    return (
        <nav className="w-full py-4 px-6 flex justify-between items-center bg-gray-900 text-white shadow">
            <div className="text-2xl font-bold">DeFi Lending Protocol</div>
            <div className="flex items-center gap-4">
                {children}
                <ConnectButton />
            </div>
        </nav>
    );
}