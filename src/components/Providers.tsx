'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
import sdk from '@farcaster/miniapp-sdk'

interface DemoContextType {
    isDemo: boolean;
    setIsDemo: (val: boolean) => void;
    demoAddress: `0x${string}`;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function useDemo() {
    const context = useContext(DemoContext);
    if (!context) throw new Error('useDemo must be used within a Providers');
    return context;
}

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    const [isSDKLoaded, setIsSDKLoaded] = useState(false)
    const [isDemo, setIsDemo] = useState(false)
    const demoAddress: `0x${string}` = '0xDEADAbeEf1234567890123456789012345678901';

    useEffect(() => {
        const saved = localStorage.getItem('punchbase_demo')
        if (saved === 'true') setIsDemo(true)
    }, [])

    const handleSetDemo = (val: boolean) => {
        setIsDemo(val)
        localStorage.setItem('punchbase_demo', val.toString())
    }

    useEffect(() => {
        const load = async () => {
            sdk.actions.ready();
        };
        if (sdk && !isSDKLoaded) {
            setIsSDKLoaded(true);
            load();
        }
    }, [isSDKLoaded]);

    return (
        <DemoContext.Provider value={{ isDemo, setIsDemo: handleSetDemo, demoAddress }}>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </WagmiProvider>
        </DemoContext.Provider>
    )
}
