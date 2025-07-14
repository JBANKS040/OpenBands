// components/ConnectWalletButton.tsx
'use client'

import { useState } from 'react';
import { BrowserProvider } from 'ethers';

export default function ConnectWalletButton() {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed!');
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-700"
    >
      {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
    </button>
  );
}