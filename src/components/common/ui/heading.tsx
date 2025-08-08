import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "xl3";
  color?: string;
  weight?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  size = "md",
  color = "text-gray-900",
  weight = "font-semibold",
  align = "left",
  className = "",
}) => {
  const sizeMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    xl3: "text-3xl",
  };

  return (
    <p
      className={`${sizeMap[size]} ${color} ${weight} text-${align} ${className}`}
    >
      {children}
    </p>
  );
};

export default Heading;
