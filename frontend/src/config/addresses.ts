export const ADDRESSES = {
    31337: {
        MockERC20: process.env.NEXT_PUBLIC_LOCAL_MOCK_ERC20 as `0x${string}`,
        LendingPool: process.env.NEXT_PUBLIC_LOCAL_LENDING_POOL as `0x${string}`,
    },
    11155111: {
        MockERC20: process.env.NEXT_PUBLIC_SEPOLIA_MOCK_ERC20 as `0x${string}`,
        LendingPool: process.env.NEXT_PUBLIC_SEPOLIA_LENDING_POOL as `0x${string}`,
    },
    1: {
        MockERC20: process.env.NEXT_PUBLIC_MAINNET_LENDING_POOL as `0x${string}`,
        LendingPool: process.env.NEXT_PUBLIC_MAINNET_LENDING_POOL as `0x${string}`,
    },
} as const;
