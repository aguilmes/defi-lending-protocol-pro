export const poolAbi = [
    {
        type: 'function', name: 'healthFactor', stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }]
    }
] as const;