import Toast, { type ToastProps } from "@/components/common/ui/toast";
import React, { useState, useCallback } from "react";

interface ToastContainerProps {
  children: React.ReactNode;
}

export interface ToastContextType {
  showToast: (type: "success" | "error" | "pending", message: string) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastContainer");
  }
  return context;
};

const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Omit<ToastProps, "onClose">[]>([]);

  const showToast = useCallback(
    (type: "success" | "error" | "pending", message: string) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, type, message }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContainer;
