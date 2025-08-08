import { cn } from "@/config/helper";

interface CardProps {
  children: React.ReactNode;
  isDark?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  isDark = false,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border p-6 shadow-lg transition-colors",
        isDark ? "bg-gray-900" : "bg-gray-50",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
