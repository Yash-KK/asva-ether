import { cn } from "@/config/helper";
import React from "react";

interface ButtonProps {
  label?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick: (e?: any) => void;
  isDark?: boolean;
  compact?: boolean;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  isActive = false,
  onClick,
  compact,
  isDark = false,
  className = "",
  disabled = false,
}) => {
  const activeClasses = "bg-red-800 text-white shadow-lg hover:bg-red-700/50";
  const inactiveClasses = isDark
    ? "text-gray-300 hover:text-white hover:bg-gray-700"
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center rounded-md text-sm font-medium transition-all duration-200",
        compact ? "p-2" : "space-x-2 px-4 py-2",
        isActive ? activeClasses : inactiveClasses,
        className,
      )}
    >
      {icon}
      {!compact && label && <span>{label}</span>}
    </button>
  );
};

export default Button;
