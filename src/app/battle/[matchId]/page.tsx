'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { PUNCH_BASE_CONTRACT_ADDRESS, PUNCH_BASE_ABI } from '@/lib/contracts'
import { useEffect, useState, useRef } from 'react'
import { useDemo } from '@/components/Providers'

export default function BattleArena() {
    const { matchId } = useParams()
    const { address: wagmiAddress } = useAccount()
    const { isDemo, demoAddress, setIsDemo } = useDemo()
    const router = useRouter()
    const { writeContract, isPending } = useWriteContract()
    const [mounted, setMounted] = useState(false)
    const [battleLogs, setBattleLogs] = useState<{ msg: string, type: 'info' | 'hit' | 'defend' }[]>([])
    const [isP1Hit, setIsP1Hit] = useState(false)
    const [isP2Hit, setIsP2Hit] = useState(false)
    const [isP1Attacking, setIsP1Attacking] = useState(false)
    const [isP2Attacking, setIsP2Attacking] = useState(false)
    const logContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
        }
    }, [battleLogs])

    const address = isDemo ? demoAddress : wagmiAddress;

    let safeMatchId: bigint = 0n;
    try {
        if (matchId) safeMatchId = BigInt(matchId as string);
    } catch (e) {
        console.error("Invalid matchId", matchId);
    }

    const { data: contractMatch } = useReadContract({
        address: PUNCH_BASE_CONTRACT_ADDRESS,
        abi: PUNCH_BASE_ABI,
        functionName: 'getMatch',
        args: [safeMatchId],
        query: {
            refetchInterval: 2000,
            enabled: !isDemo && !!matchId
        }
    })

    const { data: contractPlayer1Fighter } = useReadContract({
        address: PUNCH_BASE_CONTRACT_ADDRESS,
        abi: PUNCH_BASE_ABI,
        functionName: 'getFighter',
        args: [contractMatch?.player1 as `0x${string}`],
        query: { enabled: !!contractMatch?.player1 && !isDemo }
    })

    const { data: contractPlayer2Fighter } = useReadContract({
        address: PUNCH_BASE_CONTRACT_ADDRESS,
        abi: PUNCH_BASE_ABI,
        functionName: 'getFighter',
        args: [contractMatch?.player2 as `0x${string}`],
        query: { enabled: !!contractMatch?.player2 && !isDemo }
    })

    // Listen for turns on-chain
    useWatchContractEvent({
        address: PUNCH_BASE_CONTRACT_ADDRESS,
        abi: PUNCH_BASE_ABI,
        eventName: 'TurnTaken',
        enabled: !isDemo && !!contractMatch,
        onLogs(logs) {
            logs.forEach((log: any) => {
                if (log.args.matchId === BigInt(matchId as string)) {
                    const { player, action, damage } = log.args;
                    const isP1 = player === contractMatch?.player1;
                    const playerName = isP1 ? contractPlayer1Fighter?.name : contractPlayer2Fighter?.name;

                    if (action === 0n) {
                        setBattleLogs(prev => [...prev, { msg: `${playerName} ATTACKED for ${damage} damage!`, type: 'hit' }]);
                        if (isP1) {
                            setIsP1Attacking(true);
                            setTimeout(() => setIsP1Attacking(false), 500);
                            setTimeout(() => {
                                setIsP2Hit(true);
                                setTimeout(() => setIsP2Hit(false), 500);
                            }, 300);
                        } else {
                            setIsP2Attacking(true);
                            setTimeout(() => setIsP2Attacking(false), 500);
                            setTimeout(() => {
                                setIsP1Hit(true);
                                setTimeout(() => setIsP1Hit(false), 500);
                            }, 300);
                        }
                    } else {
                        setBattleLogs(prev => [...prev, { msg: `${playerName} is DEFENDING!`, type: 'defend' }]);
                    }
                }
            });
        },
    })

    // Mock match for demo
    const [mockMatch, setMockMatch] = useState({
        player1: demoAddress,
        player2: '0xSAMPLEOPPONENT',
        player1Health: 100n,
        player2Health: 100n,
        turn: demoAddress,
        active: true,
        winner: '0x0000000000000000000000000000000000000000'
    })

    if (!mounted) return <div className="loading-screen">Booting Arena...</div>

    const match = isDemo ? mockMatch : contractMatch;
    const player1Fighter = isDemo ? { name: 'Demo Hero' } : contractPlayer1Fighter;
    const player2Fighter = isDemo ? { name: 'Shadow Fighter' } : contractPlayer2Fighter;

    // A match "exists" if it's demo or has a valid player1 address
    const matchExists = match && (isDemo || match.player1 !== '0x0000000000000000000000000000000000000000');

    const isMyTurn = matchExists && match?.turn === address
    const isWinner = matchExists && match?.winner === address
    const isGameOver = matchExists && match?.active === false && match?.winner !== '0x0000000000000000000000000000000000000000'

    const takeAction = (action: number) => {
        if (isDemo) {
            const dmg = action === 0 ? 15n : 0n;
            if (action === 0) {
                setBattleLogs(prev => [...prev, { msg: `You ATTACKED for ${dmg} damage!`, type: 'hit' }]);
                setIsP1Attacking(true);
                setTimeout(() => setIsP1Attacking(false), 500);

                setTimeout(() => {
                    setIsP2Hit(true);
                    setTimeout(() => setIsP2Hit(false), 500);
                }, 300);
            } else {
                setBattleLogs(prev => [...prev, { msg: `You are DEFENDING!`, type: 'defend' }]);
            }

            setMockMatch(prev => ({
                ...prev,
                player2Health: prev.player2Health - dmg,
                turn: '0xSAMPLEOPPONENT'
            }));

            setTimeout(() => {
                const oppDmg = 12n;
                setBattleLogs(prev => [...prev, { msg: `Shadow Fighter ATTACKED for ${oppDmg} damage!`, type: 'hit' }]);
                setIsP2Attacking(true);
                setTimeout(() => setIsP2Attacking(false), 500);

                setTimeout(() => {
                    setIsP1Hit(true);
                    setTimeout(() => setIsP1Hit(false), 500);
                }, 300);

                setMockMatch(prev => ({
                    ...prev,
                    player1Health: prev.player1Health - oppDmg,
                    turn: demoAddress
                }));
            }, 1500);
            return;
        }
        writeContract({
            address: PUNCH_BASE_CONTRACT_ADDRESS,
            abi: PUNCH_BASE_ABI,
            functionName: 'takeTurn',
            args: [safeMatchId, BigInt(action)],
        })
    }

    if (!matchExists) return (
        <div className="arena loading-state">
            <div className="loading-card">
                <h2>Waiting for Arena...</h2>
                <p>Establishing connection to the Base Network.</p>
                <div className="spinner">🥊</div>
                <div className="loading-actions">
                    <button onClick={() => router.push('/lobby')} className="btn-secondary">Return to Lobby</button>
                    <button onClick={() => setIsDemo(true)} className="btn-primary">Try Demo Mode</button>
                </div>
            </div>
            <style jsx>{`
                .loading-state { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #050a1a; }
                .loading-card { background: #1a1a2e; padding: 4rem; border-radius: 32px; text-align: center; border: 1px solid #333; }
                .spinner { font-size: 4rem; margin: 2rem 0; animation: pulse 1s infinite alternate; }
                @keyframes pulse { from { transform: scale(1); opacity: 1; } to { transform: scale(1.2); opacity: 0.5; } }
                .loading-actions { display: flex; gap: 1rem; margin-top: 2rem; justify-content: center; }
                .btn-secondary { background: #333; color: white; border: none; padding: 1rem 2rem; border-radius: 12px; cursor: pointer; }
                .btn-primary { background: #0052FF; color: white; border: none; padding: 1rem 2rem; border-radius: 12px; cursor: pointer; }
            `}</style>
        </div>
    )

    const getFighterImage = (fClass: number) => {
        const classImages = [
            '/fighter_balanced.png',
            '/fighter_tank.png',
            '/fighter_assassin.png'
        ];
        return classImages[fClass] || classImages[0];
    };

    return (
        <div className="arena">
            <header className="arena-header">
                <button onClick={() => router.push('/lobby')} className="btn-back">Leave Arena</button>
                <div className="turn-indicator">
                    {match.active ? (
                        <span className={isMyTurn ? 'active' : ''}>
                            {isMyTurn ? "IT'S YOUR TURN!" : "WAITING FOR OPPONENT..."}
                        </span>
                    ) : (
                        <span className="ended">MATCH ENDED</span>
                    )}
                </div>
            </header>

            <div className="fighters-stage">
                <div className={`fighter-slot ${match.player1Health === 0n ? 'knocked-out' : ''} ${isP1Hit ? 'hit-shake' : ''}`}>
                    <div className="hp-bar"><div className="hp-fill" style={{ width: `${Number(match.player1Health)}%` }}></div></div>
                    <div className="fighter-sprite-container">
                        <img src={getFighterImage(Number(contractPlayer1Fighter?.fClass || 0))} className={`fighter-sprite p1-sprite ${isP1Attacking ? 'attack-dash-p1' : ''}`} alt="Player 1" />
                    </div>
                    <div className="fighter-info">
                        <h3>{player1Fighter?.name || '...'}</h3>
                        <p>{match.player1.slice(0, 6)}...{match.player1.slice(-4)}</p>
                    </div>
                </div>

                <div className="vs">VS</div>

                <div className={`fighter-slot ${match.player2Health === 0n ? 'knocked-out' : ''} ${isP2Hit ? 'hit-shake' : ''}`}>
                    <div className="hp-bar"><div className="hp-fill" style={{ width: `${Number(match.player2Health)}%` }}></div></div>
                    <div className="fighter-sprite-container">
                        <img src={getFighterImage(Number(contractPlayer2Fighter?.fClass || 0))} className={`fighter-sprite p2-sprite ${isP2Attacking ? 'attack-dash-p2' : ''}`} alt="Player 2" />
                    </div>
                    <div className="fighter-info">
                        <h3>{player2Fighter?.name || '...'}</h3>
                        <p>{match.player2.slice(0, 6)}...{match.player2.slice(-4)}</p>
                    </div>
                </div>
            </div>

            <div className="battle-area-bottom">
                <div className="battle-log" ref={logContainerRef}>
                    {battleLogs.length === 0 && <p className="log-empty">Waiting for the first move...</p>}
                    {battleLogs.map((log, i) => (
                        <div key={i} className={`log-entry ${log.type}`}>
                            {log.msg}
                        </div>
                    ))}
                </div>

                {match.active && (
                    <div className="controls">
                        <button onClick={() => takeAction(0)} disabled={!isMyTurn || isPending} className="btn-action attack">ATTACK</button>
                        <button onClick={() => takeAction(1)} disabled={!isMyTurn || isPending} className="btn-action defend">DEFEND</button>
                    </div>
                )}
            </div>

            {isGameOver && (
                <div className="overlay">
                    <div className="result-modal">
                        <h2>{isWinner ? 'VICTORY!' : 'DEFEATED'}</h2>
                        <p>{isWinner ? 'You won the match!' : 'Better luck next time.'}</p>
                        <button onClick={() => router.push('/lobby')} className="btn-primary">Return to Lobby</button>
                    </div>
                </div>
            )}

            <style jsx>{`
        .arena { min-height: 100vh; background: radial-gradient(circle at center, #0a1435 0%, #050a1a 100%); color: white; padding: 2rem; font-family: 'Inter', sans-serif; position: relative; overflow: hidden; }
        .arena-header { display: flex; justify-content: space-between; align-items: center; z-index: 10; position: relative; }
        .btn-back { background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
        .turn-indicator { font-size: 1.5rem; font-weight: 800; color: #888; }
        .turn-indicator .active { color: #00FF85; text-shadow: 0 0 10px rgba(0,255,133,0.5); }
        .fighters-stage { display: flex; justify-content: space-around; align-items: center; margin-top: 4rem; position: relative; }
        .fighter-slot { text-align: center; width: 320px; transition: all 0.3s; position: relative; }
        .knocked-out { opacity: 0.5; filter: grayscale(1); transform: scale(0.9); }
        .hp-bar { height: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.1); }
        .hp-fill { height: 100%; background: linear-gradient(90deg, #00FF85, #00C2FF); transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        
        .fighter-sprite-container { height: 350px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 1rem; }
        .fighter-sprite { height: 100%; object-fit: contain; filter: drop-shadow(0 0 30px rgba(0,82,255,0.2)); animation: idle-breath 3s ease-in-out infinite; }
        .p2-sprite { transform: scaleX(-1); }
        
        .vs { font-size: 4rem; font-weight: 900; color: #ff3e3e; font-style: italic; opacity: 0.8; }
        
        @keyframes idle-breath {
            0%, 100% { transform: translateY(0) scale(1.0); }
            50% { transform: translateY(-10px) scale(1.02); }
        }
        .p2-sprite.fighter-sprite { animation-name: idle-breath-p2; }
        @keyframes idle-breath-p2 {
            0%, 100% { transform: scaleX(-1) translateY(0) scale(1.0); }
            50% { transform: scaleX(-1) translateY(-10px) scale(1.02); }
        }

        .attack-dash-p1 { animation: dash-p1 0.4s ease-in-out; }
        @keyframes dash-p1 {
            0% { transform: translateX(0); }
            40% { transform: translateX(100px); }
            100% { transform: translateX(0); }
        }

        .attack-dash-p2 { animation: dash-p2 0.4s ease-in-out; }
        @keyframes dash-p2 {
            0% { transform: scaleX(-1) translateX(0); }
            40% { transform: scaleX(-1) translateX(100px); }
            100% { transform: scaleX(-1) translateX(0); }
        }
        
        .battle-area-bottom { display: grid; grid-template-columns: 1fr 400px; gap: 2rem; margin-top: 4rem; align-items: end; }
        .battle-log { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 1.5rem; height: 180px; overflow-y: auto; font-family: 'Monaco', monospace; scroll-behavior: smooth; }
        .log-entry { margin-bottom: 0.5rem; font-size: 0.9rem; padding: 0.5rem; border-radius: 8px; animation: fadeIn 0.3s ease-out; }
        .log-entry.hit { background: rgba(255, 62, 62, 0.1); color: #ff6e6e; border-left: 4px solid #ff3e3e; }
        .log-entry.defend { background: rgba(0, 82, 255, 0.1); color: #6eb1ff; border-left: 4px solid #0052FF; }
        .log-empty { color: #555; text-align: center; margin-top: 3rem; font-style: italic; }

        .controls { display: flex; flex-direction: column; gap: 1rem; }
        .btn-action { width: 100%; padding: 1.25rem; font-size: 1.5rem; font-weight: 800; border-radius: 20px; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        .attack { background: #ff3e3e; color: white; }
        .defend { background: #0052FF; color: white; }
        .btn-action:hover:not(:disabled) { transform: translateY(-3px); filter: brightness(1.1); }
        .btn-action:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
        
        @keyframes hit-shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-15px); }
            50% { transform: translateX(15px); }
            75% { transform: translateX(-15px); }
            100% { transform: translateX(0); }
        }
        .hit-shake { animation: hit-shake 0.2s ease-in-out infinite; color: #ff3e3e; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; justify-content: center; align-items: center; z-index: 100; backdrop-filter: blur(8px); }
        .result-modal { background: #1a1a2e; padding: 4rem; border-radius: 40px; text-align: center; border: 2px solid #333; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .result-modal h2 { font-size: 4rem; margin-bottom: 1rem; font-weight: 900; background: linear-gradient(to bottom, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn-primary { background: #0052FF; color: white; border: none; padding: 1.5rem 3rem; border-radius: 16px; font-weight: 800; cursor: pointer; font-size: 1.2rem; margin-top: 2rem; }
      `}</style>
        </div>
    )
}
