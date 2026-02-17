'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract } from 'wagmi'
import { PUNCH_BASE_CONTRACT_ADDRESS, PUNCH_BASE_ABI } from '@/lib/contracts'

export default function CreateFighter() {
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState(0) // 0: BALANCED, 1: TANK, 2: ASSASSIN
  const { isConnected } = useAccount()
  const { writeContract, isPending, isError, error } = useWriteContract()
  const router = useRouter()

  const classes = [
    { name: 'Balanced', hp: 100, atk: 15, def: 5, icon: '🤺', image: '/fighter_balanced.png', desc: 'Good for most situations.' },
    { name: 'Tank', hp: 150, atk: 10, def: 10, icon: '🛡️', image: '/fighter_tank.png', desc: 'High HP and defense.' },
    { name: 'Assassin', hp: 80, atk: 25, def: 2, icon: '🗡️', image: '/fighter_assassin.png', desc: 'High damage, fragile.' },
  ]

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    writeContract({
      address: PUNCH_BASE_CONTRACT_ADDRESS,
      abi: PUNCH_BASE_ABI,
      functionName: 'createFighter',
      args: [name, selectedClass],
    })
  }

  if (!isConnected) {
    return (
      <div className="container center">
        <h1>Connect your wallet to create a fighter</h1>
        <button onClick={() => router.push('/')} className="btn-submit" style={{ width: 'auto', marginTop: '2rem', padding: '1rem 2rem' }}>Back to Home</button>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <h1 onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>PunchBase</h1>
      </header>

      <div className="form-card">
        <h2>Spawn Your Warrior</h2>
        <form onSubmit={handleCreate}>
          <div className="input-group">
            <label>Fighter Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Iron Punch"
              maxLength={20}
              required
            />
          </div>

          <div className="class-selection">
            <label>Choose Your Class</label>
            <div className="class-grid">
              {classes.map((c, i) => (
                <div
                  key={i}
                  className={`class-card ${selectedClass === i ? 'selected' : ''}`}
                  onClick={() => setSelectedClass(i)}
                >
                  <div className="class-sprite-preview">
                    <img src={c.image} alt={c.name} />
                  </div>
                  <div className="class-header">
                    <h3>{c.name}</h3>
                    <div className="class-stats">
                      <span>HP: {c.hp}</span>
                      <span>ATK: {c.atk}</span>
                      <span>DEF: {c.def}</span>
                    </div>
                  </div>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? 'ENLISTING...' : 'FINALIZE FIGHTER'}
          </button>
        </form>
        {isError && <p className="error">{error?.message}</p>}
      </div>

      <style jsx>{`
        .create-page { min-height: 100vh; background: #050a1a; color: white; padding: 4rem 2rem; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: center; }
        .create-form { width: 100%; max-width: 800px; background: #111a33; padding: 3rem; border-radius: 40px; border: 1px solid #222; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        h1 { font-size: 3rem; font-weight: 900; margin-bottom: 3rem; text-align: center; background: linear-gradient(to bottom, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .input-group { margin-bottom: 3rem; }
        label { display: block; font-size: 1.2rem; font-weight: 700; color: #888; margin-bottom: 1rem; }
        input { width: 100%; background: #0a1428; border: 2px solid #222; color: white; padding: 1.5rem; border-radius: 20px; font-size: 1.5rem; transition: border-color 0.2s; }
        input:focus { border-color: #0052FF; outline: none; }

        .class-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .class-card { background: #0a1428; border: 2px solid #222; border-radius: 24px; padding: 1.5rem; cursor: pointer; transition: all 0.2s; }
        .class-card:hover { transform: translateY(-5px); border-color: #444; }
        .class-card.selected { border-color: #0052FF; background: rgba(0, 82, 255, 0.05); box-shadow: 0 0 30px rgba(0,82,255,0.2); }
        
        .class-sprite-preview { height: 160px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 1rem; background: rgba(255,255,255,0.02); border-radius: 16px; padding: 1rem; }
        .class-sprite-preview img { height: 100%; object-fit: contain; }

        .class-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .class-header h3 { font-size: 1.25rem; font-weight: 800; }
        .class-stats { display: flex; flex-direction: column; font-size: 0.75rem; color: #00FF85; font-weight: 700; text-align: right; }
        .class-card p { font-size: 0.85rem; color: #888; line-height: 1.4; }
        .btn-primary { width: 100%; background: #0052FF; color: white; border: none; padding: 1.25rem; font-size: 1.25rem; font-weight: 800; border-radius: 20px; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #0042CC; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,82,255,0.2); }
        .btn-primary:disabled { background: #ccc; cursor: not-allowed; transform: none; }
        .error { color: #ff4d4d; margin-top: 1rem; font-size: 0.9rem; text-align: center; }
      `}</style>
    </div>
  )
}
