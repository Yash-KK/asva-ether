import { useAccount, WagmiProvider } from "wagmi";
import { config } from "../config.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Account } from "./components/Account.tsx";
import { WalletOptions } from "./components/WalletOptions.tsx";

const queryClient = new QueryClient();

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="bg-black h-screen">
          <ConnectWallet />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
