'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useDemo } from '@/components/Providers'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { setIsDemo } = useDemo()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const startDemo = () => {
    setIsDemo(true)
    router.push('/lobby')
  }

  if (!mounted) return <div className="container" style={{ background: '#050a1a', minHeight: '100vh' }} />

  return (
    <main className="container">
      <header className="header">
        <h1>PunchBase</h1>
        <div className="wallet-info">
          {isConnected ? (
            <>
              <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              <button onClick={() => disconnect()} className="btn-secondary">Disconnect</button>
            </>
          ) : (
            <div className="connection-options">
              {connectors.find(c => c.id === 'farcaster') ? (
                <button
                  onClick={() => connect({ connector: connectors.find(c => c.id === 'farcaster')! })}
                  className="btn-primary"
                >
                  Connect Farcaster
                </button>
              ) : (
                <button
                  onClick={() => connect({ connector: connectors[0] })}
                  className="btn-primary"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <section className="hero">
        <h2>Enter the Arena</h2>
        <p>A 1v1 turn-based fighting game built on Base. Create your fighter, challenge others, and climb the leaderboard.</p>

        <div className="actions">
          <Link href="/create" className="btn-large">Create Fighter</Link>
          <button onClick={startDemo} className="btn-large btn-alt">Browse Lobby</button>
        </div>
      </section>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 900;
          color: #0052FF; /* Base blue */
          letter-spacing: -1px;
        }
        .wallet-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .connection-options {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .hero {
          text-align: center;
          margin-top: 8rem;
        }
        h2 {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(90deg, #0052FF, #00C2FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.25rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto 3rem auto;
          line-height: 1.6;
        }
        .actions {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }
        .btn-primary, .btn-large, .btn-demo {
          background: #0052FF;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          text-decoration: none;
        }
        .btn-demo {
          background: #00C2FF;
        }
        .btn-large {
          padding: 1.25rem 2.5rem;
          font-size: 1.25rem;
        }
        .btn-alt {
          background: #f0f0f0;
          color: #333;
        }
        .btn-secondary {
          background: #f0f0f0;
          color: #333;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-primary:hover, .btn-large:hover, .btn-demo:hover {
          background: #0042CC;
          transform: translateY(-2px);
        }
        .btn-alt:hover {
          background: #e0e0e0;
        }
      `}</style>
    </main>
  )
}
