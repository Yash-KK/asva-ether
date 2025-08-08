import { cn } from "@/config/helper";
import { Copy } from "lucide-react";

interface TransactionItemProps {
  tx: {
    hash: string;
    type: string;
    status: string;
    timestamp: string;
    amount: string;
    address: string;
  };
  isDark?: boolean;
  symbol?: string;
  getStatusIcon: (status: string) => React.ReactNode;
  textPrimary: string;
  textSecondary: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  tx,
  isDark,
  symbol,
  getStatusIcon,
  textPrimary,
  textSecondary,
}) => {
  return (
    <div
      className={cn(
        "rounded-lg p-4 transition-colors duration-200",
        isDark
          ? "bg-gray-900 hover:bg-gray-700"
          : "bg-gray-50 hover:bg-gray-100",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={cn(
              "rounded-full px-2 py-1 text-xs font-medium",
              tx.type === "Transfer"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800",
            )}
          >
            {tx.type}
          </span>
          {getStatusIcon(tx.status)}
        </div>
        <span className={cn("text-xs", textSecondary)}>{tx.timestamp}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className={cn("font-medium", textPrimary)}>
            {tx.amount} {symbol || "TOKEN"}
          </p>
          <p className={cn("text-sm", textSecondary)}>
            {tx.address.slice(0, 6)}...{tx.address.slice(-4)}
          </p>
        </div>
        <button
          className={cn("cursor-pointer p-1 hover:text-current", textSecondary)}
          onClick={() => navigator.clipboard.writeText(tx.hash)}
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
