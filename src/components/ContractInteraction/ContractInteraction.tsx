import { useState, useEffect } from "react";
import {
  Search,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Layers3,
  CircleDollarSign,
  Hash,
  BadgePercent,
  Wallet,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
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
import Heading from "@/components/common/ui/heading";
import Button from "@/components/common/ui/button";
import Input from "@/components/common/ui/input";
import InfoCard from "@/components/common/info-card";
import { cn } from "@/config/helper";
import Card from "@/components/common/ui/card";
import TransactionItem from "@/components/common/transaction-item";

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
  console.log("transactions: ", transactions);
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

  useWatchContractEvent({
    abi: wagmiContractConfig.abi,
    address: submittedAddress as `0x${string}`,
    eventName: "Transfer",
    enabled: !!submittedAddress,
    onLogs(logs) {
      logs.forEach((log) => {
        console.log("log: ", log);
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

        setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)]);
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
        "Please first fetch token info by entering the contract address.",
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
        },
      );
    } catch (e) {
      showToast("error", "Invalid input or transaction failed");
    }
  };

  const handleClear = () => {
    setWalletAddress("");
    setSubmittedAddress("");
    setShowBalance(false);
    setRecipient("");
    setAmount("");
    setTxHash(undefined);
    setTransactions([]);
    setErrors({});
  };

  useEffect(() => {
    if (txReceipt) {
      showToast("success", "Transfer successful!");
      setRecipient("");
      setAmount("");
      setTxHash(undefined);
    }
  }, [txReceipt, showToast]);

  useEffect(() => {
    if (data && submittedAddress && !isPending) {
      showToast("success", "Token information retrieved successfully!");
    }
  }, [data, submittedAddress, isPending, showToast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 animate-pulse text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className={cn("rounded-xl border p-6 shadow-lg", cardBg)}>
            <div className="mb-2 flex items-center justify-between">
              <Heading color={textPrimary} size="xl" className="m-0">
                Token Contract Lookup
              </Heading>

              <Button
                label="Clear"
                onClick={handleClear}
                className="rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-1 font-medium text-white transition-all duration-200 hover:from-gray-700 hover:to-gray-800"
              />
            </div>{" "}
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    if (errors.address) {
                      setErrors((prev) => ({ ...prev, address: undefined }));
                    }
                  }}
                  placeholder="Enter contract address (0x...)"
                  error={!!errors.address}
                />
              </div>
              <Button
                isActive
                onClick={handleGetInfo}
                label="Get Info"
                icon={
                  submittedAddress && isPending ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )
                }
              />

              <Button
                isActive
                onClick={handleFetchBalance}
                label="Get My Balance"
                disabled={!connectedAddress || !submittedAddress}
                className="bg-green-800 hover:bg-green-700/50"
              />
            </div>
            {errors.address && (
              <p className="mt-1 flex items-center space-x-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.address}</span>
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-500">
              Error: {(error as BaseError).shortMessage || error.message}
            </div>
          )}

          {submittedAddress && data && (
            <div className={`${cardBg} rounded-xl border p-6 shadow-lg`}>
              <div className="mb-4 flex items-center justify-between">
                <Heading color={textPrimary} size="xl" className="m-0">
                  Token Information
                </Heading>
                {getStatusIcon("confirmed")}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<Layers3 className="h-4 w-4" />}
                  label="Total Supply"
                  value={
                    totalSupply && decimals !== undefined
                      ? formatUnits(totalSupply, decimals)
                      : "0"
                  }
                  isDark={isDark}
                />

                <InfoCard
                  icon={<CircleDollarSign className="h-4 w-4" />}
                  label="Token Name"
                  value={name ?? "Unknown"}
                  isDark={isDark}
                />

                <InfoCard
                  icon={<Hash className="h-4 w-4" />}
                  label="Symbol"
                  value={symbol ?? "?"}
                  isDark={isDark}
                />

                <InfoCard
                  icon={<BadgePercent className="h-4 w-4" />}
                  label="Decimals"
                  value={decimals ?? "?"}
                  isDark={isDark}
                />
              </div>

              {showBalance &&
                balance !== undefined &&
                decimals !== undefined && (
                  <InfoCard
                    icon={<Wallet className="h-4 w-4" />}
                    label="Your Balance"
                    value={`${formatUnits(balance, decimals)} ${symbol ?? "TOKEN"}`}
                    isDark={isDark}
                    className="mt-4"
                  />
                )}
            </div>
          )}

          {connectedAddress && submittedAddress && (
            <div className={`${cardBg} rounded-xl border p-6 shadow-lg`}>
              <Heading color={textPrimary} size="xl" className="mb-3">
                Transfer Tokens
              </Heading>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <Heading size="sm" color={textSecondary} className="mb-2">
                    Recipient Address
                  </Heading>
                  <Input
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
                    error={!!errors.recipient}
                    inputBg={inputBg}
                  />
                  {errors.recipient && (
                    <p className="mt-1 flex items-center space-x-1 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.recipient}</span>
                    </p>
                  )}
                </div>

                <div>
                  <Heading size="sm" color={textSecondary} className="mb-2">
                    Amount
                  </Heading>
                  <div className="relative">
                    <Input
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.amount) {
                          setErrors((prev) => ({ ...prev, amount: undefined }));
                        }
                      }}
                      placeholder="0.0"
                      error={!!errors.amount}
                      inputBg={inputBg}
                      className="pr-16"
                    />
                    <span
                      className={cn(
                        "absolute top-1/2 right-4 -translate-y-1/2 transform font-medium",
                        textSecondary,
                      )}
                    >
                      {symbol || "TOKEN"}
                    </span>
                  </div>
                  {errors.amount && (
                    <p className="mt-1 flex items-center space-x-1 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.amount}</span>
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleTransfer}
                  isActive
                  isDark
                  className="w-full justify-center"
                  disabled={isWriting || isConfirming}
                  icon={
                    isWriting || isConfirming ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )
                  }
                  label={
                    isWriting
                      ? "Sending..."
                      : isConfirming
                        ? "Confirming..."
                        : "Send Tokens"
                  }
                />
              </form>

              {writeError && (
                <p className="mt-4 text-red-500">
                  Error:{" "}
                  {(writeError as BaseError).shortMessage || writeError.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {showBalance && balance !== undefined && decimals !== undefined && (
            <div className="rounded-xl border border-red-700 bg-gradient-to-br from-red-900 to-red-800 p-6 shadow-lg">
              <h2 className="mb-2 text-lg font-semibold text-white">
                Your Balance
              </h2>
              <div className="mb-2 text-3xl font-bold text-white">
                {formatUnits(balance, decimals)}
              </div>
              <div className="font-medium text-red-200">
                {symbol || "TOKEN"}
              </div>
            </div>
          )}

          <Card className={cardBg}>
            <Heading color={textPrimary} size="lg" className="mb-4">
              Transaction History
            </Heading>

            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <TransactionItem
                    key={`${tx.hash}-${index}`}
                    tx={tx}
                    isDark={isDark}
                    symbol={symbol}
                    getStatusIcon={getStatusIcon}
                    textPrimary={textPrimary}
                    textSecondary={textSecondary}
                  />
                ))
              ) : (
                <div className={`${textSecondary} py-8 text-center`}>
                  No transactions yet. Connect a contract to see transfer
                  events.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractInteraction;
