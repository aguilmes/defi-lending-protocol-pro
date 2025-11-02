"use client";
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hardhat } from '@/config/chains'; // tu chain local id=31337


const queryClient = new QueryClient();

const projectId_placeholder = '00000000000000000000000000000000';


// 1) Toggle (ON salvo que pongas 'false' en .env)
const enable_walletConnect = process.env.NEXT_PUBLIC_ENABLE_WALLETCONNECT !== 'false';


// 2) Guard, para no-dev (staging/prod): exige que exista el Project ID
if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
    throw new Error('Falta NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID en entorno no-dev');
}


// 3) Fallback solo-DEV (si falta la env en dev, usa placeholder)
const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || projectId_placeholder;


const config = getDefaultConfig({
    appName: 'DeFi Lending Protocol',
    projectId: enable_walletConnect ? wcProjectId : projectId_placeholder, // 4) Si Toggle OFF, fuerzo placeholder
    chains: [hardhat, sepolia],
    transports: { // Fuerza el RPC correcto, por cada chain
        [hardhat.id]: http('http://127.0.0.1:8545'),
        [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_SEPOLIA || 'https://rpc.sepolia.org'),
    },
});


export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}