import React from "react";
import { Wallet, CheckCircle, Globe } from "lucide-react";
import { useToast } from "@/contexts/ToastContainer";
import { useTheme } from "@/contexts/ThemeContext";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useConnect,
  useChains,
  useChainId,
} from "wagmi";

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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-4 shadow-lg">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
          Wallet Connection
        </h1>
        <p className={textSecondary}>Connect your Web3 wallet to get started</p>
      </div>

      <div className={`${cardBg} rounded-xl p-8 border shadow-lg`}>
        {!isConnected ? (
          <div className="text-center">
            <div className="mb-6">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 ${
                  isDark ? "bg-gray-900" : "bg-gray-100"
                } rounded-full mb-4`}
              >
                <Wallet className={`w-10 h-10 ${textSecondary}`} />
              </div>
              <h2 className={`text-xl font-semibold ${textPrimary} mb-2`}>
                No Wallet Connected
              </h2>
              <p className={textSecondary}>
                Connect your wallet to access Web3 features
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Wallet className="w-5 h-5" />
                  <span>{connector.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[1, 2, 3].map((step, idx) => {
                const titles = ["Install Wallet", "Connect", "Start Using"];
                const descriptions = [
                  "Install MetaMask or another Web3 wallet",
                  "Click the connect button above",
                  "Access all Web3 features",
                ];
                return (
                  <div key={step}>
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">{step}</span>
                    </div>
                    <h4 className={`${textPrimary} font-medium mb-2`}>
                      {titles[idx]}
                    </h4>
                    <p className={`${textSecondary} text-sm`}>
                      {descriptions[idx]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className={`text-xl font-semibold ${textPrimary} mb-2`}>
                Wallet Connected
              </h2>
              <p className="text-green-600 font-medium">
                Successfully connected to your wallet
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div
                className={`${
                  isDark ? "bg-gray-900" : "bg-gray-50"
                } rounded-lg p-4`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`${textSecondary} flex items-center space-x-2`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Wallet Address</span>
                  </span>
                  <div className="text-right">
                    <div className={`${textPrimary} font-mono text-sm`}>
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                    <div className={`${textSecondary} text-xs`}>
                      Click to copy
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  isDark ? "bg-gray-900" : "bg-gray-50"
                } rounded-lg p-4`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`${textSecondary} flex items-center space-x-2`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Balance</span>
                  </span>
                  <div className="text-right">
                    <div className={`${textPrimary} font-medium`}>
                      {balance.data?.formatted} {balance.data?.symbol}
                    </div>
                    <div className="inline-flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 text-xs">Connected</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  isDark ? "bg-gray-900" : "bg-gray-50"
                } rounded-lg p-4`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`${textSecondary} flex items-center space-x-2`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Network</span>
                  </span>
                  <div className="text-right">
                    <div className={`${textPrimary} font-medium`}>
                      {currentChain?.name}
                    </div>
                    <div className="inline-flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 text-xs">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                disconnect();
                showToast("success", "Wallet disconnected");
              }}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Disconnect Wallet</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;
