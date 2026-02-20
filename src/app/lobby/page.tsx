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
        address: PUNCH_BASE_CONTRACT_ADDRESS as `0x${string}`,
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

    if (!mounted) return <div className="lobby-container" style={{ background: '#050a1a', minHeight: '100vh' }} />

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
        <div className="lobby-container">
            <header className="lobby-header">
                <h1 onClick={() => router.push('/')} className="logo">PunchBase</h1>
                <div className="header-right">
                    <button onClick={() => router.push('/leaderboard')} className="btn-leader">Leaderboard 🏆</button>
                    <div className="player-badge">
                        <span className="player-name">{fighter?.name || 'No Fighter'}</span>
                        <div className="player-record">
                            <span className="win-count">{Number(fighter?.wins || 0)}W</span>
                            <span className="loss-count">{Number(fighter?.losses || 0)}L</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="lobby-grid">
                <section className="lobby-card challenge-card">
                    <h2>Challenge a Player</h2>
                    <p className="card-desc">Enter a wallet address to issue a direct challenge.</p>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Opponent Address (0x...)"
                            value={opponentAddr}
                            onChange={(e) => setOpponentAddr(e.target.value)}
                        />
                        <button onClick={handleChallenge} className="btn-action-primary">Send Challenge</button>
                    </div>
                </section>

                <section className="lobby-card pending-card">
                    <h2>Nearby Challenges</h2>
                    <div className="challenges-list">
                        <div className="challenge-item">
                            <div className="opp-info">
                                <span className="label">Opponent</span>
                                <span className="addr">0x123...456</span>
                            </div>
                            <button onClick={() => handleAccept(0n)} className="btn-accept">Accept & Fight</button>
                        </div>
                        <p className="hint">Note: Match ID 0 is available for instant testing.</p>
                    </div>
                </section>
            </main>

            <style jsx>{`
        .lobby-container { 
            min-height: 100vh; 
            background: #050a1a;
            color: white; 
            padding: 1.5rem; 
            font-family: 'Inter', sans-serif;
        }
        
        .lobby-header { 
            display: flex; 
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 2.5rem; 
            padding-bottom: 1.5rem; 
            border-bottom: 1px solid rgba(255,255,255,0.05); 
        }
        
        .logo { 
            color: #0052FF; 
            font-weight: 900; 
            font-size: 2rem; 
            margin: 0;
            cursor: pointer;
            text-align: center;
        }

        .header-right { 
            display: flex; 
            flex-direction: column;
            gap: 1rem;
            align-items: center;
        }

        .btn-leader { 
            background: rgba(255,255,255,0.05); 
            border: 1px solid rgba(255,255,255,0.1); 
            color: white; 
            padding: 0.75rem 1.5rem; 
            border-radius: 12px; 
            font-weight: 600; 
            cursor: pointer; 
            width: 100%;
            transition: all 0.2s; 
        }
        .btn-leader:hover { border-color: #0052FF; background: rgba(0,82,255,0.1); }

        .player-badge { 
            background: #0a1428; 
            padding: 0.75rem 1.25rem; 
            border-radius: 16px; 
            border: 1px solid rgba(255,255,255,0.05); 
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
        .player-name { font-weight: 800; color: #00FF85; font-size: 0.95rem; }
        .player-record { display: flex; gap: 0.75rem; font-size: 0.85rem; font-weight: 700; }
        .win-count { color: #00FF85; }
        .loss-count { color: #ff3e3e; }

        .lobby-grid { 
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .lobby-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 24px;
            padding: 1.5rem;
        }

        h2 { margin-bottom: 0.5rem; font-size: 1.25rem; font-weight: 800; }
        .card-desc { color: #888; font-size: 0.9rem; margin-bottom: 1.5rem; }

        input { 
            width: 100%; 
            padding: 1.1rem; 
            border: 1px solid rgba(255,255,255,0.1); 
            background: #02050d; 
            color: white; 
            border-radius: 14px; 
            margin-bottom: 1rem;
            font-family: inherit;
        }
        input:focus { outline: none; border-color: #0052FF; }

        .btn-action-primary { 
            background: #0052FF; 
            color: white; 
            border: none; 
            padding: 1.1rem; 
            border-radius: 14px; 
            font-weight: 800; 
            cursor: pointer; 
            width: 100%; 
            transition: all 0.2s; 
        }

        .challenges-list { display: flex; flex-direction: column; gap: 1rem; }
        
        .challenge-item { 
          background: #0a1428; 
          padding: 1.25rem; 
          border-radius: 18px; 
          border: 1px solid rgba(255,255,255,0.05);
          display: flex; 
          flex-direction: column;
          gap: 1rem;
        }

        .opp-info { display: flex; flex-direction: column; }
        .label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #555; font-weight: 800; }
        .addr { font-family: monospace; font-size: 0.9rem; color: #ddd; }

        .btn-accept { 
            background: #00C2FF; 
            color: white; 
            border: none; 
            padding: 0.75rem; 
            border-radius: 10px; 
            font-weight: 800; 
            cursor: pointer; 
            text-align: center;
        }

        .hint { color: #444; font-size: 0.75rem; margin-top: 1rem; text-align: center; }

        @media (min-width: 768px) {
            .lobby-container { padding: 3rem; }
            .lobby-header { flex-direction: row; justify-content: space-between; align-items: center; }
            .logo { text-align: left; font-size: 2.5rem; }
            .header-right { flex-direction: row; gap: 2rem; width: auto; }
            .btn-leader { width: auto; }
            .player-badge { width: 280px; }
            .lobby-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
            .challenge-item { flex-direction: row; justify-content: space-between; align-items: center; }
        }
      `}</style>
        </div>
    )
}
