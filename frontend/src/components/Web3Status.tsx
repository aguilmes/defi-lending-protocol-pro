'use client';
import { useAccount, useChainId, useBalance } from 'wagmi';

export default function Web3Status() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { data: bal } = useBalance({ address, query: { enabled: !!address } });

    if (!isConnected) return <span>Desconectado</span>;
    return (
        <div className="text-sm opacity-80">
            <div>Chain: {chainId}</div>
            <div>Addr: {address?.slice(0, 6)}…{address?.slice(-4)}</div>
            <div>Balance: {bal?.formatted} {bal?.symbol}</div>
        </div>
    );
}