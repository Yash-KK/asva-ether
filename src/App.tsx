import { WagmiProvider } from "wagmi";
import { config } from "../config.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletOptions } from "@/components/Profile";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletOptions />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
