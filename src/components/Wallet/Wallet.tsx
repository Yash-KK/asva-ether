import InfoCard from "@/components/common/info-card";
import StepIndicator from "@/components/common/step-indicator";
import Button from "@/components/common/ui/button";
import Heading from "@/components/common/ui/heading";
import WalletRounded from "@/components/common/ui/wallet-rounded";
import { cn } from "@/config/helper";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContainer";
import { CheckCircle, Globe, Wallet } from "lucide-react";
import React from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useChains,
  useConnect,
  useDisconnect,
} from "wagmi";

const steps = [
  {
    title: "Install Wallet",
    description: "Install MetaMask or another Web3 wallet",
  },
  {
    title: "Connect",
    description: "Click the connect button above",
  },
  {
    title: "Start Using",
    description: "Access all Web3 features",
  },
];

const WalletConnect: React.FC = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const chains = useChains();
  const chainId = useChainId();

  const currentChain = chains.find((chain) => chain.id === chainId);
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const balance = useBalance({ address });

  const cardBg = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <WalletRounded />
        <Heading
          className={cn(isDark ? "text-white" : "text-black")}
          size="xl3"
        >
          Wallet Connection
        </Heading>
        <p className={cn(textSecondary)}>
          Connect your Web3 wallet to get started
        </p>
      </div>

      <div className={cn("rounded-xl border p-6 shadow-lg sm:p-8", cardBg)}>
        {!isConnected ? (
          <div className="flex flex-col items-center text-center">
            <WalletRounded bgClass="bg-gray-900" className="mb-4" size={70} />
            <Heading
              className={cn(isDark ? "text-white" : "text-black")}
              size="xl"
            >
              No Wallet Connected
            </Heading>
            <p className={cn(textSecondary, "mb-6")}>
              Connect your wallet to access Web3 features
            </p>
            <div className="mb-6 flex flex-wrap justify-center gap-4">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  label={connector.name}
                  icon={<Wallet className="h-5 w-5" />}
                  onClick={() => connect({ connector })}
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg hover:from-red-700 hover:to-red-800"
                />
              ))}
            </div>
            <StepIndicator
              steps={steps}
              textPrimary={isDark ? "text-white" : "text-gray-900"}
              textSecondary={isDark ? "text-gray-400" : "text-gray-600"}
              stepColor="bg-red-600"
            />
          </div>
        ) : (
          <div>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <Heading className={cn(textPrimary)} size="xl">
                Wallet Connected
              </Heading>
              <p className="font-medium text-green-600">
                Successfully connected to your wallet
              </p>
            </div>

            <div className="mb-6 grid gap-4">
              <InfoCard
                icon={<Wallet className="h-4 w-4" />}
                label="Wallet Address"
                value={`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                subtext="Click to copy"
                isDark={isDark}
              />
              <InfoCard
                icon={<Globe className="h-4 w-4" />}
                label="Balance"
                value={`${balance.data?.value} ${balance.data?.symbol}`}
                subtext={
                  <span className="inline-flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-green-600">Connected</span>
                  </span>
                }
                isDark={isDark}
              />
              <InfoCard
                icon={<Globe className="h-4 w-4" />}
                label="Network"
                value={currentChain?.name}
                subtext={
                  <span className="inline-flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-green-600">Connected</span>
                  </span>
                }
                isDark={isDark}
              />
            </div>

            <Button
              label="Disconnect Wallet"
              icon={<Wallet className="h-5 w-5" />}
              onClick={() => {
                disconnect();
                showToast("success", "Wallet disconnected");
              }}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;
