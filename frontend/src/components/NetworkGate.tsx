'use client';
import { useChainId, useSwitchChain } from 'wagmi';

const allowed = (process.env.NEXT_PUBLIC_ALLOWED_CHAINS || '31337,11155111')
    .split(',').map((x) => Number(x.trim()));

export default function NetworkGate({ children }: { children: React.ReactNode }) {
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    if (!allowed.includes(chainId)) {
        const target = allowed[0];
        return (
            <div className="p-4 rounded-xl bg-amber-100 text-amber-900">
                <p>Red no soportada. Cambiá a <b>{target}</b>.</p>
                <button className="mt-2 px-3 py-1 rounded bg-black text-white"
                    onClick={() => switchChain({ chainId: target })}>
                    Cambiar de red
                </button>
            </div>
        );
    }
    return <>{children}</>;
}