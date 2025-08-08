import { cn } from "@/config/helper";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  inputBg?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = "",
  error = false,
  inputBg = "bg-white",
  className = "",
  ...props
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-lg border px-4 py-3 text-sm placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-red-500",
        inputBg,
        error ? "border-red-500" : "border-gray-300",
        className,
      )}
      {...props}
    />
  );
};

export default Input;
