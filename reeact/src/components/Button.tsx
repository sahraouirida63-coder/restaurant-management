import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  className,
  ...props
}) => {
  const baseStyle =
    "relative font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white border border-orange-500/40 shadow-[0_0_20px_rgba(255,102,0,0.3)] hover:shadow-[0_0_30px_rgba(255,102,0,0.5)]",
    secondary:
      "bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 text-white border border-white/10 shadow-card",
    outline:
      "border-2 border-orange-500/60 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 hover:shadow-[0_0_15px_rgba(255,102,0,0.2)]",
    danger:
      "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <motion.button
      {...(props as any)}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
      disabled={disabled || isLoading}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className || ""}
      `}
    >
      {/* Shine overlay on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />

      {isLoading && (
        <span className="relative w-4 h-4 flex-shrink-0">
          <span className="absolute inset-0 border-2 border-white/30 rounded-full" />
          <span className="absolute inset-0 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </span>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
