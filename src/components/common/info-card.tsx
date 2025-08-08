import { cn } from "@/config/helper";
import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  isDark?: boolean;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  label,
  value,
  subtext,
  isDark = false,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "rounded-lg p-4 transition-colors",
        isDark ? "bg-gray-900" : "bg-gray-50",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center space-x-2 text-gray-500">
          {icon}
          <span>{label}</span>
        </span>
        <div className="text-right">
          <div className="font-mono text-sm text-gray-800 dark:text-white">
            {value}
          </div>
          {subtext && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {subtext}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
