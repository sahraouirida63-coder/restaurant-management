import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
  FireIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = (role: string | undefined) => {
    switch (role) {
      case "owner": return "/owner";
      case "manager": return "/manager";
      case "waiter": return "/waiter";
      case "chef": return "/chef";
      case "cashier": return "/cashier";
      case "stock": return "/stock";
      case "delivery": return "/delivery";
      default: return "/";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLocalError("Email and password are required.");
      return;
    }
    try {
      setLocalError(null);
      const loggedInUser = await login(email, password);
      const targetPath = getDashboardPath(loggedInUser?.role);
      if (targetPath === "/") {
        setLocalError("Unable to determine your role. Please contact your administrator.");
        return;
      }
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      const message = err?.message || "Login failed. Please check your credentials.";
      setLocalError(message);
    }
  };

  const displayError = localError || error;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1556739738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Multi-layer dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/10 via-transparent to-transparent" />

      {/* Ambient glow blob */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-[0_0_24px_rgba(255,102,0,0.5)]">
              <FireIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-2">
            Restaurant
          </h1>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Management
            </span>
          </h2>
          <h3 className="text-xl md:text-2xl font-light text-white/60 mt-1 tracking-widest uppercase">
            System
          </h3>
          {/* Orange accent line */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(255,102,0,0.6)]" />
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="glass-card p-8"
        >
          <div className="mb-6">
            <h4 className="text-lg font-bold text-white">Welcome back</h4>
            <p className="text-sm text-zinc-400 mt-1">Sign in to access your dashboard</p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mb-5"
              >
                <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
                  <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{displayError}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@restaurant.com"
                  required
                  disabled={isLoading}
                  className="input-field"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword
                    ? <EyeSlashIcon className="w-4 h-4" />
                    : <EyeIcon className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? "Signing In..." : "Login to Dashboard"}
              </Button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Email</p>
                <p className="text-xs text-orange-400 font-mono">admin@restaurant.com</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Password</p>
                <p className="text-xs text-orange-400 font-mono">password123</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-zinc-600 text-xs"
        >
          © 2024 RestaurantPOS. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default LoginPage;
