import { cn } from "@/config/helper";
import { Wallet } from "lucide-react";
import React from "react";

interface WalletRoundedProps {
  icon?: React.ReactNode;
  size?: number;
  bgClass?: string; // Accept any background class (solid or gradient)
  className?: string;
}

const WalletRounded: React.FC<WalletRoundedProps> = ({
  icon,
  size = 64,
  bgClass = "bg-gradient-to-br from-red-600 to-red-800",
  className = "",
}) => {
  const dimension = `${size}px`;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full shadow-lg",
        bgClass,
        className,
      )}
      style={{ width: dimension, height: dimension }}
    >
      {!icon && <Wallet className="h-8 w-8 text-white" />}
      {icon}
    </div>
  );
};

export default WalletRounded;
