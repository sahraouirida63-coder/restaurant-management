import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md" }) => {
  const sizes = {
    sm: { outer: "w-8 h-8", inner: "w-4 h-4", dot: "w-1.5 h-1.5" },
    md: { outer: "w-12 h-12", inner: "w-6 h-6", dot: "w-2 h-2" },
    lg: { outer: "w-16 h-16", inner: "w-8 h-8", dot: "w-3 h-3" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${s.outer} flex items-center justify-center`}>
        {/* Outer ring */}
        <span
          className={`absolute inset-0 rounded-full border-2 border-zinc-700/60`}
        />
        {/* Spinning orange arc */}
        <span
          className={`absolute inset-0 rounded-full border-2 border-t-orange-500 border-r-orange-500/30 border-b-transparent border-l-transparent animate-spin`}
          style={{ animationDuration: "0.8s" }}
        />
        {/* Inner ring */}
        <span
          className={`relative ${s.inner} rounded-full border border-zinc-700/40`}
        />
        {/* Spinning inner arc (opposite) */}
        <span
          className={`absolute ${s.inner} rounded-full border border-t-transparent border-r-transparent border-b-orange-400/50 border-l-orange-400/50 animate-spin`}
          style={{ animationDuration: "1.2s", animationDirection: "reverse" }}
        />
        {/* Center dot */}
        <span
          className={`absolute ${s.dot} rounded-full bg-orange-500 animate-pulse`}
          style={{ boxShadow: "0 0 8px rgba(255,102,0,0.8)" }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
