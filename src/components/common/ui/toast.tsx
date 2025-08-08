import React, { useEffect } from "react";
import { CheckCircle, XCircle, Clock, X } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
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
      className={`${getBgColor()} border rounded-lg p-4 flex items-center space-x-3 min-w-80 animate-slide-in`}
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
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
