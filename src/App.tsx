import ContractInteraction from "@/components/ContractInteraction/ContractInteraction.tsx";
import WalletConnect from "@/components/Wallet/Wallet";
import Header from "@/components/common/header.tsx";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import ToastContainer from "@/contexts/ToastContainer";
import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "../config.ts";

const queryClient = new QueryClient();

function AppContent() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"contract" | "wallet">("wallet");

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="transition-all duration-300">
        <div className={activeTab === "contract" ? "block" : "hidden"}>
          <ContractInteraction />
        </div>
        <div className={activeTab === "wallet" ? "block" : "hidden"}>
          <WalletConnect />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastContainer>
            <AppContent />
          </ToastContainer>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
