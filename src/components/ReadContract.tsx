import { wagmiContractConfig } from "@/config/contracts";
import {
  useReadContracts,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import type { BaseError } from "viem";
import { useState } from "react";

export function ReadContract() {
  const { address: connectedAddress } = useAccount();

  const [inputAddress, setInputAddress] = useState<string>("");
  const [submittedAddress, setSubmittedAddress] = useState("");
  const [showBalance, setShowBalance] = useState(false);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

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

  const totalSupply = data?.[0]?.result as bigint | undefined;
  const decimals = data?.[1]?.result as number | undefined;
  const name = data?.[2]?.result as string | undefined;
  const balance = showBalance
    ? (data?.[3]?.result as bigint | undefined)
    : undefined;

  const handleSubmit = () => {
    if (inputAddress.startsWith("0x") && inputAddress.length === 42) {
      setSubmittedAddress(inputAddress);
      setShowBalance(false);
    } else {
      alert("Please enter a valid Ethereum contract address.");
    }
  };

  const handleFetchBalance = () => {
    if (!submittedAddress) {
      alert("Please first fetch token info by entering the contract address.");
      return;
    }
    setShowBalance(true);
  };

  const handleTransfer = async () => {
    if (!recipient || !amount || !decimals) {
      alert("Please enter recipient and amount.");
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
          },
        }
      );
    } catch (e) {
      alert("Invalid input.");
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-md">
      <input
        type="text"
        placeholder="Enter contract address"
        value={inputAddress}
        onChange={(e) => setInputAddress(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Fetch Token Info
        </button>
        <button
          onClick={handleFetchBalance}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={!connectedAddress || !submittedAddress}
        >
          Get My Balance
        </button>
      </div>

      {submittedAddress && isPending && <div>Loading...</div>}

      {error && (
        <div className="text-red-500">
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}

      {submittedAddress && data && (
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {name ?? "Unknown"}
          </p>
          <p>
            <strong>Decimals:</strong> {decimals ?? "?"}
          </p>
          <p>
            <strong>Total Supply:</strong>{" "}
            {totalSupply && decimals !== undefined
              ? formatUnits(totalSupply, decimals)
              : "0"}{" "}
            {name ?? "TOKEN"}
          </p>

          {showBalance && balance !== undefined && decimals !== undefined && (
            <p>
              <strong>Your Balance:</strong> {formatUnits(balance, decimals)}{" "}
              {name ?? "TOKEN"}
            </p>
          )}

          {connectedAddress && (
            <div className="pt-4 border-t mt-4 space-y-2">
              <h3 className="font-semibold">Transfer Tokens</h3>
              <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                placeholder="Amount to Transfer"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <button
                onClick={handleTransfer}
                className="bg-purple-600 text-white px-4 py-2 rounded"
                disabled={isWriting || isConfirming}
              >
                {isWriting
                  ? "Sending..."
                  : isConfirming
                  ? "Confirming..."
                  : "Send Tokens"}
              </button>

              {writeError && (
                <p className="text-red-500">
                  Error:{" "}
                  {(writeError as BaseError).shortMessage || writeError.message}
                </p>
              )}
              {txReceipt && (
                <p className="text-green-600">
                  ✅ Transfer confirmed! Tx Hash:{" "}
                  {txReceipt.transactionHash.slice(0, 10)}...
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
