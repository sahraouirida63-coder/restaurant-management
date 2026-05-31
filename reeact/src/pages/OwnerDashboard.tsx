import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const StatCard = ({ icon: Icon, label, value, colorClass, trend }: any) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -3, transition: { duration: 0.2 } }}
    className="glass-dark p-5 rounded-2xl group cursor-default"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`${colorClass} p-3 rounded-xl transition-all group-hover:scale-110`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-full">
          <ArrowTrendingUpIcon className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
    <p className="text-3xl font-black text-white">{value}</p>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark px-4 py-3 rounded-xl text-sm border border-orange-500/20">
        <p className="text-zinc-400 mb-1 font-medium">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const chartData = [
    { name: "Mon", revenue: 4000, orders: 24 },
    { name: "Tue", revenue: 3000, orders: 13 },
    { name: "Wed", revenue: 2000, orders: 9 },
    { name: "Thu", revenue: 2780, orders: 39 },
    { name: "Fri", revenue: 1890, orders: 22 },
    { name: "Sat", revenue: 2390, orders: 22 },
    { name: "Sun", revenue: 3490, orders: 20 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
              <span className="text-orange-400">{user?.name?.split(" ")[0]}</span> 👋
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5">Here's your restaurant overview</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-white/[0.04] border border-white/[0.08] px-3 py-2 rounded-xl">
            <SparklesIcon className="w-3.5 h-3.5 text-orange-400" />
            Owner Dashboard
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Stat Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard icon={CurrencyDollarIcon} label="Total Revenue" value={`$${stats?.totalRevenue?.toLocaleString() || "0"}`} colorClass="icon-bg-green" trend="+12.5%" />
          <StatCard icon={ShoppingCartIcon} label="Total Orders" value={stats?.totalOrders?.toLocaleString() || "0"} colorClass="icon-bg-blue" trend="+8.2%" />
          <StatCard icon={CubeIcon} label="Total Products" value={stats?.totalProducts?.toLocaleString() || "0"} colorClass="icon-bg-purple" trend="+3.1%" />
          <StatCard icon={TruckIcon} label="Active Deliveries" value={stats?.activeDeliveries?.toLocaleString() || "0"} colorClass="icon-bg-orange" trend="+5.7%" />
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-dark p-6 rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <ArrowTrendingUpIcon className="w-5 h-5 text-orange-400" />
              <h2 className="text-base font-bold text-white">Revenue Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="#FF6600" strokeWidth={2.5} dot={{ r: 4, fill: "#FF6600" }} activeDot={{ r: 6, fill: "#FF6600" }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Orders Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-dark p-6 rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <ShoppingCartIcon className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Orders by Day</h2>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="orders" fill="#FF6600" fillOpacity={0.85} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-dark p-6 rounded-2xl"
        >
          <h2 className="text-base font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: UsersIcon, label: "Manage Staff", color: "icon-bg-blue" },
              { icon: CubeIcon, label: "Inventory", color: "icon-bg-purple" },
              { icon: ShoppingCartIcon, label: "View Orders", color: "icon-bg-green" },
              { icon: ArrowTrendingUpIcon, label: "Reports", color: "icon-bg-orange" },
            ].map(({ icon: Icon, label, color }) => (
              <motion.button
                key={label}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.12] rounded-xl transition-all text-center group"
              >
                <div className={`${color} w-fit mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
