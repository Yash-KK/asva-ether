import React, { useState } from "react";
import {
  Search,
  Send,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContainer";
import { wagmiContractConfig } from "@/config/contracts";
import {
  useReadContracts,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import type { BaseError } from "viem";

const ContractInteraction: React.FC = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const { address: connectedAddress } = useAccount();

  const [walletAddress, setWalletAddress] = useState("");
  const [submittedAddress, setSubmittedAddress] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [transactions, setTransactions] = useState<any[]>([]);

  const {
    writeContract,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  const { data: txReceipt, isLoading: isConfirming } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  const { data, error, isPending } = useReadContracts({
    contracts: submittedAddress
      ? [
          {
            ...wagmiContractConfig,
            address: submittedAddress as `0x${string}`,
            functionName: "totalSupply",
          },
          {
            ...wagmiContractConfig,
            address: submittedAddress as `0x${string}`,
            functionName: "decimals",
          },
          {
            ...wagmiContractConfig,
            address: submittedAddress as `0x${string}`,
            functionName: "name",
          },
          {
            ...wagmiContractConfig,
            address: submittedAddress as `0x${string}`,
            functionName: "symbol",
          },
          ...(showBalance && connectedAddress
            ? [
                {
                  ...wagmiContractConfig,
                  address: submittedAddress as `0x${string}`,
                  functionName: "balanceOf",
                  args: [connectedAddress],
                },
              ]
            : []),
        ]
      : [],
  });

  // Watch for Transfer events
  useWatchContractEvent({
    ...wagmiContractConfig,
    address: submittedAddress as `0x${string}`,
    eventName: "Transfer",
    enabled: !!submittedAddress,
    onLogs(logs) {
      logs.forEach((log) => {
        const newTransaction = {
          hash: log.transactionHash,
          type: log.args.from === connectedAddress ? "Transfer" : "Receive",
          amount: log.args.value
            ? formatUnits(log.args.value as bigint, decimals || 18)
            : "0",
          address:
            log.args.from === connectedAddress ? log.args.to : log.args.from,
          timestamp: new Date().toLocaleTimeString(),
          status: "confirmed",
          blockNumber: log.blockNumber,
        };

        setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)]); // Keep last 10 transactions
      });
    },
  });

  const totalSupply = data?.[0]?.result as bigint | undefined;
  const decimals = data?.[1]?.result as number | undefined;
  const name = data?.[2]?.result as string | undefined;
  const symbol = data?.[3]?.result as string | undefined;
  const balance = showBalance
    ? (data?.[4]?.result as bigint | undefined)
    : undefined;

  const [errors, setErrors] = useState<{
    address?: string;
    recipient?: string;
    amount?: string;
  }>({});

  const validateAddress = (address: string) => {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  };

  const validateAmount = (amount: string) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  };

  const handleGetInfo = () => {
    const newErrors: typeof errors = {};

    if (!walletAddress) {
      newErrors.address = "Contract address is required";
    } else if (!validateAddress(walletAddress)) {
      newErrors.address = "Invalid Ethereum address format";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("error", "Please fix the validation errors");
      return;
    }

    if (walletAddress.startsWith("0x") && walletAddress.length === 42) {
      setSubmittedAddress(walletAddress);
      setShowBalance(false);
      showToast("pending", "Fetching token information...");
    }
  };

  const handleFetchBalance = () => {
    if (!submittedAddress) {
      showToast(
        "error",
        "Please first fetch token info by entering the contract address."
      );
      return;
    }
    if (!connectedAddress) {
      showToast("error", "Please connect your wallet first.");
      return;
    }
    setShowBalance(true);
    showToast("success", "Fetching your balance...");
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!recipient) {
      newErrors.recipient = "Recipient address is required";
    } else if (!validateAddress(recipient)) {
      newErrors.recipient = "Invalid Ethereum address format";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (!validateAmount(amount)) {
      newErrors.amount = "Amount must be a positive number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("error", "Please fix the validation errors");
      return;
    }

    if (!decimals) {
      showToast("error", "Token decimals not loaded");
      return;
    }

    try {
      const parsedAmount = parseUnits(amount, decimals);

      writeContract(
        {
          ...wagmiContractConfig,
          address: submittedAddress as `0x${string}`,
          functionName: "transfer",
          args: [recipient as `0x${string}`, parsedAmount],
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
            showToast("pending", "Transaction submitted...");
          },
        }
      );
    } catch (e) {
      showToast("error", "Invalid input or transaction failed");
    }
  };

  // Show success when transaction is confirmed
  React.useEffect(() => {
    if (txReceipt) {
      showToast("success", "Transfer successful!");
      setRecipient("");
      setAmount("");
      setTxHash(undefined);
    }
  }, [txReceipt, showToast]);

  // Show success when token info is loaded
  React.useEffect(() => {
    if (data && submittedAddress && !isPending) {
      showToast("success", "Token information retrieved successfully!");
    }
  }, [data, submittedAddress, isPending, showToast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const cardBg = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const inputBg = isDark
    ? "bg-gray-900 border-gray-600 text-white"
    : "bg-gray-50 border-gray-300 text-gray-900";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contract Lookup */}
          <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
            <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
              Token Contract Lookup
            </h2>
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    if (errors.address) {
                      setErrors((prev) => ({ ...prev, address: undefined }));
                    }
                  }}
                  placeholder="Enter contract address (0x...)"
                  className={`w-full px-4 py-3 ${inputBg} border rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.address ? "border-red-500" : ""
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>
              <button
                onClick={handleGetInfo}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                {submittedAddress && isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>Get Info</span>
              </button>
              {submittedAddress && (
                <button
                  onClick={handleFetchBalance}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200"
                  disabled={!connectedAddress || !submittedAddress}
                >
                  Get My Balance
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
              Error: {(error as BaseError).shortMessage || error.message}
            </div>
          )}

          {/* Token Info Card */}
          {submittedAddress && data && (
            <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${textPrimary}`}>
                  Token Information
                </h2>
                {getStatusIcon("confirmed")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className={`${
                    isDark ? "bg-gray-900" : "bg-gray-50"
                  } rounded-lg p-4`}
                >
                  <p className={`${textSecondary} text-sm mb-1`}>
                    Total Supply
                  </p>
                  <p className={`${textPrimary} font-semibold text-lg`}>
                    {totalSupply && decimals !== undefined
                      ? formatUnits(totalSupply, decimals)
                      : "0"}
                  </p>
                </div>
                <div
                  className={`${
                    isDark ? "bg-gray-900" : "bg-gray-50"
                  } rounded-lg p-4`}
                >
                  <p className={`${textSecondary} text-sm mb-1`}>Token Name</p>
                  <p className={`${textPrimary} font-semibold`}>
                    {name ?? "Unknown"}
                  </p>
                </div>
                <div
                  className={`${
                    isDark ? "bg-gray-900" : "bg-gray-50"
                  } rounded-lg p-4`}
                >
                  <p className={`${textSecondary} text-sm mb-1`}>Symbol</p>
                  <p className={`${textPrimary} font-semibold`}>
                    {symbol ?? "?"}
                  </p>
                </div>
                <div
                  className={`${
                    isDark ? "bg-gray-900" : "bg-gray-50"
                  } rounded-lg p-4`}
                >
                  <p className={`${textSecondary} text-sm mb-1`}>Decimals</p>
                  <p className={`${textPrimary} font-semibold`}>
                    {decimals ?? "?"}
                  </p>
                </div>
              </div>

              {showBalance &&
                balance !== undefined &&
                decimals !== undefined && (
                  <div
                    className={`${
                      isDark ? "bg-gray-900" : "bg-gray-50"
                    } rounded-lg p-4 mt-4`}
                  >
                    <p className={`${textSecondary} text-sm mb-1`}>
                      Your Balance
                    </p>
                    <p className={`${textPrimary} font-semibold text-lg`}>
                      {formatUnits(balance, decimals)} {symbol ?? "TOKEN"}
                    </p>
                  </div>
                )}
            </div>
          )}

          {/* Transfer Form */}
          {connectedAddress && submittedAddress && (
            <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
              <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
                Transfer Tokens
              </h2>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label
                    htmlFor="recipient"
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    id="recipient"
                    value={recipient}
                    onChange={(e) => {
                      setRecipient(e.target.value);
                      if (errors.recipient) {
                        setErrors((prev) => ({
                          ...prev,
                          recipient: undefined,
                        }));
                      }
                    }}
                    placeholder="0x..."
                    className={`w-full px-4 py-3 ${inputBg} border rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.recipient ? "border-red-500" : ""
                    }`}
                  />
                  {errors.recipient && (
                    <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.recipient}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="amount"
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="amount"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.amount) {
                          setErrors((prev) => ({ ...prev, amount: undefined }));
                        }
                      }}
                      placeholder="0.0"
                      className={`w-full px-4 py-3 ${inputBg} border rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 pr-16 ${
                        errors.amount ? "border-red-500" : ""
                      }`}
                    />
                    <span
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${textSecondary} font-medium`}
                    >
                      {symbol || "TOKEN"}
                    </span>
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.amount}</span>
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isWriting || isConfirming}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  {isWriting || isConfirming ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  <span>
                    {isWriting
                      ? "Sending..."
                      : isConfirming
                      ? "Confirming..."
                      : "Send Tokens"}
                  </span>
                </button>
              </form>

              {writeError && (
                <p className="text-red-500 mt-4">
                  Error:{" "}
                  {(writeError as BaseError).shortMessage || writeError.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Balance Display */}
          {showBalance && balance !== undefined && decimals !== undefined && (
            <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-xl p-6 border border-red-700 shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-2">
                Your Balance
              </h2>
              <div className="text-3xl font-bold text-white mb-2">
                {formatUnits(balance, decimals)}
              </div>
              <div className="text-red-200 font-medium">
                {symbol || "TOKEN"}
              </div>
            </div>
          )}

          {/* Transaction History */}
          <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
            <h2 className={`text-lg font-semibold ${textPrimary} mb-4`}>
              Transaction History
            </h2>
            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <div
                    key={`${tx.hash}-${index}`}
                    className={`${
                      isDark
                        ? "bg-gray-900 hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    } rounded-lg p-4 transition-colors duration-200`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            tx.type === "Transfer"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {tx.type}
                        </span>
                        {getStatusIcon(tx.status)}
                      </div>
                      <span className={`${textSecondary} text-xs`}>
                        {tx.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`${textPrimary} font-medium`}>
                          {tx.amount} {symbol || "TOKEN"}
                        </p>
                        <p className={`${textSecondary} text-sm`}>
                          {tx.address?.slice(0, 6)}...{tx.address?.slice(-4)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className={`p-1 ${textSecondary} hover:${textPrimary} transition-colors`}
                          onClick={() => navigator.clipboard.writeText(tx.hash)}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-1 ${textSecondary} hover:${textPrimary} transition-colors`}
                          onClick={() =>
                            window.open(
                              `https://etherscan.io/tx/${tx.hash}`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`${textSecondary} text-center py-8`}>
                  No transactions yet. Connect a contract to see transfer
                  events.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractInteraction;
