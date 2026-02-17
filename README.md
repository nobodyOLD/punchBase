# 🥊 PunchBase

PunchBase is a tactical 1:1 fighting game built on the **Base Network**. Strategy meets blockchain in this high-stakes arena where your fighter's stats and your tactical choices determine the victor.

## 🚀 Features

- **Fighter Classes**: Choose between **Balanced**, **Tank**, or **Assassin**, each with unique HP, Attack, and Defense stats.
- **On-Chain Combat**: Every hit and block is recorded on the Base blockchain.
- **Dynamic Animations**: Experience the fight with smooth dash attacks and hit-shake feedback.
- **Global Leaderboard**: Compete for the top spot in the Hall of Fame.
- **Farcaster Ready**: Specifically designed to work as a Farcaster Mini-App/Frame.
- **Demo Mode**: Test the game mechanics instantly without a wallet.

## 🛠️ Tech Stack

- **L2 Blockchain**: Base
- **Frontend**: Next.js (App Router), TypeScript
- **Smart Contracts**: Solidity (Hardhat)
- **Web3 Library**: Wagmi, Viem
- **Animations**: Framer Motion & CSS Keyframes

## 🏁 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```

3. **Smart Contract**:
   Located in `/contracts/PunchBaseGame.sol`. Deploy to Base Sepolia or Localhost using Hardhat.

## 🕹️ How to Play

1. **Enlist**: Create your fighter and name them.
2. **Challenge**: Enter an opponent's address or find a pending challenge in the lobby.
3. **Fight**: Take turns to **ATTACK** or **DEFEND**. If you defend, you take half damage on the next hit!
4. **Win**: Reduce your opponent's HP to 0 to claim victory and climb the leaderboard.

---
Built with 🔵 on Base.
