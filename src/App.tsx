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

  const renderActiveTab = () => {
    switch (activeTab) {
      case "contract":
        return <ContractInteraction />;
      case "wallet":
        return <WalletConnect />;
      default:
        return <ContractInteraction />;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="transition-all duration-300">{renderActiveTab()}</main>
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
