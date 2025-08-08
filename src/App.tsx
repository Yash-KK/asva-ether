import { useState } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import ContractInteraction from "./components/Contract/ContractInteraction";
import WalletConnect from "./components/Wallet/Wallet";
import Header from "./components/common/ui/header";
import ToastContainer from "./contexts/ToastContainer";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../config.ts";
import { WagmiProvider } from "wagmi";

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
        {/* Keep both components mounted but show/hide them */}
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
