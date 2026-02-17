'use client'

import { useReadContract, useReadContracts } from 'wagmi'
import { PUNCH_BASE_CONTRACT_ADDRESS, PUNCH_BASE_ABI } from '@/lib/contracts'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useDemo } from '@/components/Providers'

export default function Leaderboard() {
    const router = useRouter()
    const { isDemo } = useDemo()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch all fighter addresses
    const { data: addresses } = useReadContract({
        address: PUNCH_BASE_CONTRACT_ADDRESS,
        abi: PUNCH_BASE_ABI,
        functionName: 'getAllFighterAddresses',
        query: { enabled: !isDemo }
    })

    // Fetch details for each fighter
    const { data: fightersData } = useReadContracts({
        contracts: (addresses || []).map((addr) => ({
            address: PUNCH_BASE_CONTRACT_ADDRESS,
            abi: PUNCH_BASE_ABI,
            functionName: 'getFighter',
            args: [addr],
        })),
        query: { enabled: !!addresses && addresses.length > 0 && !isDemo }
    })

    // Mock data for demo mode
    const mockFighters = [
        { name: 'Base King', wins: 25n, losses: 2n, owner: '0x123...456', fClass: 1 },
        { name: 'Shadow Boxer', wins: 18n, losses: 5n, owner: '0x789...012', fClass: 2 },
        { name: 'Combo Master', wins: 15n, losses: 8n, owner: '0x345...678', fClass: 0 },
        { name: 'Tank Destroyer', wins: 12n, losses: 10n, owner: '0x901...234', fClass: 1 },
        { name: 'Punch Guru', wins: 8n, losses: 12n, owner: '0x567...890', fClass: 0 },
    ]

    const getFighterImage = (fClass: number) => {
        const classImages = [
            '/fighter_balanced.png',
            '/fighter_tank.png',
            '/fighter_assassin.png'
        ];
        return classImages[fClass] || classImages[0];
    };

    const leaderboardData = isDemo
        ? mockFighters
        : (fightersData || [])
            .filter(f => f.status === 'success' && f.result)
            .map((f, i) => ({
                ...(f.result as any),
                owner: addresses?.[i]
            }))
            .sort((a, b) => Number(b.wins || 0) - Number(a.wins || 0));

    if (!mounted) return <div className="leaderboard-page" />

    return (
        <div className="leaderboard-page">
            <header className="header">
                <h1 onClick={() => router.push('/lobby')} style={{ cursor: 'pointer' }}>PunchBase</h1>
                <button onClick={() => router.push('/lobby')} className="btn-secondary">Back to Lobby</button>
            </header>

            <main className="main-content">
                <section className="title-section">
                    <h2>Global Hall of Fame</h2>
                    <p>The strongest fighters on the Base Network</p>
                </section>

                <div className="leaderboard-list">
                    {leaderboardData.length > 0 ? (
                        leaderboardData.map((f, i) => (
                            <div key={i} className={`rank-card rank-${i + 1}`}>
                                <div className="rank-badge">{i + 1}</div>
                                <div className="fighter-avatar-mini">
                                    <img src={getFighterImage(Number(f.fClass || 0))} alt={f.name} />
                                </div>
                                <div className="fighter-details">
                                    <h3>{f.name}</h3>
                                    <code>{String(f.owner).slice(0, 6)}...{String(f.owner).slice(-4)}</code>
                                </div>
                                <div className="fighter-stats-row">
                                    <div className="stat">
                                        <label>WINS</label>
                                        <span>{Number(f.wins)}</span>
                                    </div>
                                    <div className="stat">
                                        <label>LOSSES</label>
                                        <span>{Number(f.losses)}</span>
                                    </div>
                                    <div className="stat win-rate">
                                        <label>WIN RATE</label>
                                        <span>{Number(f.wins + f.losses) > 0 ? Math.round(Number(f.wins) / Number(f.wins + f.losses) * 100) : 0}%</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">No fighters found yet. Be the first to join!</div>
                    )}
                </div>
            </main>

            <style jsx>{`
                .leaderboard-page { min-height: 100vh; background: #050a1a; color: white; padding: 2rem; font-family: 'Inter', sans-serif; }
                .header { max-width: 1000px; margin: 0 auto 4rem; display: flex; justify-content: space-between; align-items: center; }
                h1 { color: #0052FF; font-weight: 900; font-size: 2rem; }
                .btn-secondary { background: #111a33; border: 1px solid #222; color: white; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; }
                
                .main-content { max-width: 800px; margin: 0 auto; }
                .title-section { text-align: center; margin-bottom: 4rem; }
                .title-section h2 { font-size: 3rem; font-weight: 900; margin-bottom: 0.5rem; background: linear-gradient(to bottom, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .title-section p { color: #888; font-size: 1.2rem; }

                .leaderboard-list { display: flex; flex-direction: column; gap: 1rem; }
                .rank-card { 
                    background: #111a33; border: 1px solid #222; border-radius: 24px; padding: 1.5rem 2rem; 
                    display: grid; grid-template-columns: 60px 80px 1fr auto; align-items: center; gap: 2rem;
                    transition: all 0.2s;
                }
                .rank-card:hover { transform: scale(1.02); border-color: #0052FF; box-shadow: 0 10px 30px rgba(0,82,255,0.1); }
                
                .rank-badge { font-size: 1.5rem; font-weight: 900; color: #888; text-align: center; }
                .rank-1 .rank-badge { color: #FFD700; font-size: 2rem; }
                .rank-2 .rank-badge { color: #C0C0C0; font-size: 1.8rem; }
                .rank-3 .rank-badge { color: #CD7F32; font-size: 1.6rem; }
                
                .rank-1 { border-color: rgba(255, 215, 0, 0.3); background: linear-gradient(90deg, #111a33, rgba(255, 215, 0, 0.05)); }

                .fighter-avatar-mini { height: 60px; display: flex; align-items: flex-end; justify-content: center; background: #0a1428; border-radius: 12px; padding: 5px; }
                .fighter-avatar-mini img { height: 100%; object-fit: contain; }

                .fighter-details h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.25rem; }
                .fighter-details code { color: #555; font-size: 0.8rem; }

                .fighter-stats-row { display: flex; gap: 2rem; text-align: center; }
                .stat label { display: block; font-size: 0.7rem; font-weight: 700; color: #555; margin-bottom: 0.25rem; }
                .stat span { font-size: 1.1rem; font-weight: 800; }
                .win-rate span { color: #00FF85; }

                .empty-state { text-align: center; padding: 4rem; color: #555; font-style: italic; }
            `}</style>
        </div>
    )
}
