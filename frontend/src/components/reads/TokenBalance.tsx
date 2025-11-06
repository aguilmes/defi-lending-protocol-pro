'use client';
import { useAccount, useChainId, useReadContract } from 'wagmi';
import { getAddress } from '@/config/getAddress';
import { erc20Abi } from '@/abi/erc20';

export default function TokenBalance() {
    const { address } = useAccount();
    const chainId = useChainId();
    const token = getAddress(chainId, 'MockERC20');

    const { data } = useReadContract({
        address: token, abi: erc20Abi, functionName: 'balanceOf',
        args: [address!], query: { enabled: !!address },
    });

    return <span>Balance: {data?.toString() ?? '—'}</span>;
}