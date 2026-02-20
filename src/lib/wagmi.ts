import { http, createConfig } from 'wagmi'
import { base, baseSepolia, hardhat } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { farcasterFrame } from '@farcaster/miniapp-wagmi-connector'

export const config = createConfig({
    chains: [base, baseSepolia, hardhat],
    connectors: [
        farcasterFrame(),
        injected(),
    ],
    transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
        [hardhat.id]: http(),
    },
})
