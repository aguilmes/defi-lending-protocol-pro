'use client';
import { useAccount, useChainId, useReadContract } from 'wagmi';
import { poolAbi } from '@/abi/pool';
import { getAddress } from '@/config/getAddress';

export default function HealthFactor() {
    const { address } = useAccount();
    const chainId = useChainId();
    const pool = getAddress(chainId, 'LendingPool');

    const { data } = useReadContract({
        address: pool, abi: poolAbi, functionName: 'healthFactor',
        args: [address!], query: { enabled: !!address },
    });

    return <span>HF: {data ? data.toString() : '—'}</span>;
}