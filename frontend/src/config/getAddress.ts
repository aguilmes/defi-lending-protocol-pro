import { ADDRESSES } from './addresses';

export const getAddress = (chainId: number, key: keyof (typeof ADDRESSES)[31337]) => {
    const addr = ADDRESSES[chainId]?.[key];
    if (!addr) throw new Error(`Falta address para ${key} en chain ${chainId}`);
    return addr;
};