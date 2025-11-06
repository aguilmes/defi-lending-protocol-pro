'use client';
import { useAccount, useChainId, useReadContract } from 'wagmi';
import { getAddress } from '@/config/getAddress';
import { erc20Abi } from '@/abi/erc20';

export default function TokenAllowance() {
    const { address } = useAccount();
    const chainId = useChainId();
    const token = getAddress(chainId, 'MockERC20');
    const spender = getAddress(chainId, 'LendingPool');

    const { data } = useReadContract({
        address: token, abi: erc20Abi, functionName: 'allowance',
        args: [address!, spender], query: { enabled: !!address },
    });

    return <span>Allowance → Pool: {data?.toString() ?? '—'}</span>;
}