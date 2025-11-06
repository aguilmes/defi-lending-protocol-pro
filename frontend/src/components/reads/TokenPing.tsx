'use client';
import { useChainId, useReadContract } from 'wagmi';
import { getAddress } from '@/config/getAddress';
import { erc20Abi } from '@/abi/erc20';

export default function TokenPing() {
    const chainId = useChainId();
    const token = getAddress(chainId, 'MockERC20');

    const { data, isLoading, error } = useReadContract({
        address: token, abi: erc20Abi, functionName: 'name',
    });

    if (isLoading) return <span>Loading…</span>;
    if (error) return <span className="text-red-500">Error: {String(error.shortMessage || error.message)}</span>;
    return <span>Token: {data as string}</span>;
}