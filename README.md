# Asva Ether

A modern React-based Web3 frontend interface to interact with ERC-20 token contracts. Built using **Wagmi**, **Viem**, **Tailwind CSS**, and **Lucide Icons**, this app allows users to:

- ✅ Connect their wallet (MetaMask, etc.)
- 🔍 Read token details from any ERC-20 contract
- 👛 View their token balance
- 💸 Transfer tokens from their wallet
- 🌗 Enjoy a responsive dark/light UI

---

## 🔧 Tech Stack

- ⚛️ **React** (with Vite)
- 🎨 **Tailwind CSS** (dark/light theme support)
- 🦄 **Wagmi** + **Viem** (Web3 wallet + contract interaction)
- 🔌 **Lucide Icons** (for UI icons)
- 🪄 **Custom Contexts** (Theme & Toast notifications)

---

## ✨ Features

| Feature              | Description |
|----------------------|-------------|
| 🔐 Wallet Connection | Connect/disconnect wallets using MetaMask or any injected provider |
| 📦 Read Contract     | Enter any ERC-20 token contract address to fetch name, decimals, and total supply |
| 👛 Get Balance       | View your token balance for the connected wallet |
| 🔄 Transfer Tokens   | Transfer tokens from your wallet to any valid address |
| 🌙 Dark Mode         | Seamless dark/light UI toggle |
| ✅ Toasts & UX       | User-friendly feedback using toasts |

---

## 📦 Getting Started

### 1. Clone the repo

```bash
https://github.com/Yash-KK/asva-ether.git
cd asva-ether
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure contract (optional)

Edit the contract config in:

```
/src/config/contracts.ts
```

Replace with your desired ERC-20 ABI or use the default.

### 4. Run the app

```bash
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173)

---

## 📝 To-Do / Improvements
- [ ] Transaction history (Sometimes works sometimes is does not so its Work in Progress)
---
