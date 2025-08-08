import { useAccount, WagmiProvider } from "wagmi";
import { config } from "../config.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Account } from "./components/Account.tsx";
import { WalletOptions } from "./components/WalletOptions.tsx";
import { SendTransaction } from "./components/SendTransaction.tsx";

const queryClient = new QueryClient();

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected)
    return (
      <div className="bg-blue-800">
        <Account />
        <SendTransaction />
      </div>
    );
  return <WalletOptions />;
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="h-screen">
          <ConnectWallet />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
