'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { PUNCH_BASE_CONTRACT_ADDRESS, PUNCH_BASE_ABI } from '@/lib/contracts'
import { useDemo } from '@/components/Providers'

export default function Lobby() {
    const { address: wagmiAddress, isConnected } = useAccount()
    const { isDemo, demoAddress } = useDemo()
    const router = useRouter()
    const { writeContract } = useWriteContract()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])
    const address = isDemo ? demoAddress : wagmiAddress;

    // In a real app, we'd index events. For now, we'll use a few "known" match IDs or just mock for demo.
    // Actually, let's try to get the fighter's wins/losses.
    const { data: contractFighter } = useReadContract({
        address: PUNCH_BASE_CONTRACT_ADDRESS,
        abi: PUNCH_BASE_ABI,
        functionName: 'getFighter',
        args: [address as `0x${string}`],
        query: {
            enabled: !!address && !isDemo,
        }
    })

    const fighter = isDemo ? {
        name: 'Demo Fighter',
        wins: 10n,
        losses: 2n
    } : contractFighter;

    const [opponentAddr, setOpponentAddr] = useState('')

    if (!mounted) return <div className="container" />

    const handleChallenge = () => {
        if (isDemo) {
            alert("Demo Mode: Simulated challenge sent!");
            return;
        }
        if (!opponentAddr) return
        writeContract({
            address: PUNCH_BASE_CONTRACT_ADDRESS,
            abi: PUNCH_BASE_ABI,
            functionName: 'challengePlayer',
            args: [opponentAddr as `0x${string}`],
        })
    }

    const handleAccept = (matchId: bigint) => {
        if (isDemo) {
            router.push(`/battle/${matchId}`)
            return;
        }
        writeContract({
            address: PUNCH_BASE_CONTRACT_ADDRESS,
            abi: PUNCH_BASE_ABI,
            functionName: 'acceptChallenge',
            args: [matchId],
        }, {
            onSuccess: () => {
                router.push(`/battle/${matchId}`)
            }
        })
    }

    if (!isConnected && !isDemo) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '10rem' }}>
            <h2>Please connect your wallet or use Demo Mode</h2>
            <button onClick={() => router.push('/')} className="btn-primary" style={{ width: 'auto', marginTop: '2rem' }}>Back to Home</button>
        </div>
    )

    return (
        <div className="container">
            <header className="header">
                <h1 onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>PunchBase</h1>
                <div className="header-actions">
                    <button onClick={() => router.push('/leaderboard')} className="btn-secondary">Leaderboard 🏆</button>
                    <div className="stats">
                        <span>{fighter?.name || 'No Fighter'}</span>
                        <span>Wins: {Number(fighter?.wins || 0)}</span>
                        <span>Losses: {Number(fighter?.losses || 0)}</span>
                    </div>
                </div>
            </header>

            <div className="lobby-content">
                <section className="challenge-form">
                    <h2>Challenge a Player</h2>
                    <input
                        type="text"
                        placeholder="Opponent Address (0x...)"
                        value={opponentAddr}
                        onChange={(e) => setOpponentAddr(e.target.value)}
                    />
                    <button onClick={handleChallenge} className="btn-primary">Send Challenge</button>
                </section>

                <section className="pending-challenges">
                    <h2>Nearby Challenges</h2>
                    {/* Mock for demo if no events found */}
                    <div className="challenge-item">
                        <span>Opponent: 0x123...456</span>
                        <button onClick={() => handleAccept(0n)} className="btn-small">Accept & Fight</button>
                    </div>
                    <p className="hint">Note: In this MVP, manually enter match ID 0 to test if needed, or wait for events.</p>
                </section>
            </div>

            <style jsx>{`
        .container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; padding-bottom: 1rem; border-bottom: 1px solid #111a33; }
        h1 { color: #0052FF; font-weight: 900; font-size: 2rem; }
        .header-actions { display: flex; align-items: center; gap: 2rem; }
        .stats { background: #0a1428; padding: 0.75rem 1.5rem; border-radius: 16px; border: 1px solid #111a33; }
        .stats span { margin-left: 1rem; font-weight: 700; color: #fff; font-size: 0.9rem; }
        .stats span:first-child { margin-left: 0; color: #00FF85; }
        .lobby-content { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        h2 { margin-bottom: 2rem; font-size: 1.5rem; font-weight: 800; }
        input { width: 100%; padding: 1.25rem; border: 2px solid #111a33; background: #050a1a; color: white; border-radius: 16px; margin-bottom: 1rem; }
        .challenge-item { 
          background: #0a1428; padding: 1.5rem; border-radius: 20px; border: 1px solid #111a33;
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;
        }
        .btn-primary { background: #0052FF; color: white; border: none; padding: 1rem 2rem; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; transition: all 0.2s; }
        .btn-primary:hover { background: #0042CC; transform: translateY(-2px); }
        .btn-secondary { background: #111a33; border: 1px solid #222; color: white; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { border-color: #0052FF; }
        .btn-small { background: #00C2FF; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 700; cursor: pointer; }
        .hint { color: #444; font-size: 0.8rem; margin-top: 2rem; }
      `}</style>
        </div>
    )
}
