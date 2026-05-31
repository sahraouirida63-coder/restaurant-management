import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  HomeIcon,
  UsersIcon,
  ShoppingCartIcon,
  CubeIcon,
  TruckIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [readyCount, setReadyCount] = useState(0);
  const [showBellPulse, setShowBellPulse] = useState(false);

  // Poll for ready orders every 8 seconds to power the waiter notification bell
  useEffect(() => {
    const poll = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://127.0.0.1:8000/api/orders", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        const ready = Array.isArray(data)
          ? data.filter((o: any) => o.status === "ready").length
          : 0;
        setReadyCount((prev) => {
          if (ready > prev) setShowBellPulse(true);
          return ready;
        });
      } catch {}
    };
    poll();
    const id = setInterval(poll, 8000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const roles: Record<string, { label: string; path: string; icon: React.ElementType }[]> = {
    owner: [
      { label: "Dashboard", path: "/owner", icon: ChartBarIcon },
    ],
    manager: [
      { label: "Dashboard", path: "/manager", icon: HomeIcon },
      { label: "Employees", path: "/manager", icon: UsersIcon },
      { label: "Menu", path: "/manager", icon: DocumentTextIcon },
    ],
    waiter: [
      { label: "POS System", path: "/waiter", icon: ShoppingCartIcon },
    ],
    chef: [
      { label: "Kitchen", path: "/chef", icon: FireIcon },
    ],
    cashier: [
      { label: "Billing", path: "/cashier", icon: DocumentTextIcon },
    ],
    stock: [
      { label: "Inventory", path: "/stock", icon: CubeIcon },
    ],
    delivery: [
      { label: "Deliveries", path: "/delivery", icon: TruckIcon },
    ],
  };

  const navigationItems = user?.role ? (roles[user.role as keyof typeof roles] || []) : [];

  const roleColors: Record<string, string> = {
    owner: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    manager: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    waiter: "text-green-400 bg-green-400/10 border-green-400/30",
    chef: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    cashier: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    stock: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
    delivery: "text-pink-400 bg-pink-400/10 border-pink-400/30",
  };

  const roleColor = user?.role ? (roleColors[user.role] || "text-orange-400 bg-orange-400/10 border-orange-400/30") : "text-orange-400 bg-orange-400/10 border-orange-400/30";

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(255,102,0,0.4)]">
            <FireIcon className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="font-bold text-white text-sm leading-tight">RestaurantPOS</p>
                <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Management</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex w-7 h-7 items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all flex-shrink-0"
        >
          {sidebarCollapsed
            ? <ChevronDoubleRightIcon className="w-3.5 h-3.5" />
            : <ChevronDoubleLeftIcon className="w-3.5 h-3.5" />
          }
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-zinc-500 hover:text-white flex-shrink-0"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* User card */}
      <div className="px-3 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] overflow-hidden transition-all ${sidebarCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-[0_0_10px_rgba(255,102,0,0.3)]">
            {initials}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden min-w-0"
              >
                <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name}</p>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${roleColor} mt-0.5`}>
                  {user?.role}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {!sidebarCollapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-3 pb-2">Navigation</p>
        )}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={`${item.path}-${item.label}`}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                isActive
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/25"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] border border-transparent"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-r-full shadow-[0_0_8px_rgba(255,102,0,0.8)]" />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-orange-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Tooltip when collapsed */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-white/[0.06] flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-150 group ${sidebarCollapsed ? "justify-center" : ""}`}
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 flex-shrink-0 group-hover:text-red-400" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] font-inter">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen z-30 bg-[#0d0d0d] border-r border-white/[0.06] overflow-hidden flex-shrink-0"
        style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.4)" }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-64 z-50 bg-[#0d0d0d] border-r border-white/[0.06] md:hidden overflow-hidden"
              style={{ boxShadow: "4px 0 32px rgba(0,0,0,0.6)" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area — do NOT override marginLeft with a static style */}
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 md:px-6 bg-black/30 backdrop-blur-xl border-b border-white/[0.06]">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          {/* Date */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-zinc-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Notification bell with live ready-order count */}
            <button
              onClick={() => setShowBellPulse(false)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
              title={readyCount > 0 ? `${readyCount} order(s) ready for pickup` : "Notifications"}
            >
              <BellIcon className={`w-5 h-5 ${showBellPulse ? "animate-bounce text-orange-400" : ""}`} />
              {readyCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(255,102,0,0.8)] animate-pulse">
                  {readyCount}
                </span>
              ) : (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-zinc-600 rounded-full" />
              )}
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(255,102,0,0.3)]">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
                <span className={`text-[10px] font-semibold uppercase tracking-wider border px-1.5 py-0.5 rounded ${roleColor}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </motion.div>
    </div>
  );
};

export default Layout;
