import { useTheme } from "@/contexts/ThemeContext";
import { CheckCircle, Clock, X, XCircle } from "lucide-react";
import React, { useEffect } from "react";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "pending";
  message: string;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 animate-pulse text-yellow-500" />;
    }
  };

  const getBgColor = () => {
    if (isDark) {
      return "bg-gray-800 border-gray-700";
    }
    return "bg-white border-gray-200 shadow-lg";
  };

  return (
    <div
      className={`${getBgColor()} animate-slide-in flex min-w-80 items-center space-x-3 rounded-lg border p-4`}
    >
      {getIcon()}
      <p
        className={`flex-1 text-sm font-medium ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        className={`${
          isDark
            ? "text-gray-400 hover:text-white"
            : "text-gray-500 hover:text-gray-700"
        } transition-colors`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
