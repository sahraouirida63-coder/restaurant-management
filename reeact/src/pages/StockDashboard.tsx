import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExclamationTriangleIcon,
  CubeIcon,
  PlusIcon,
  ChartBarIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export const StockDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stock, setStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockLoading, setStockLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"inventory" | "reports" | "notifications">("inventory");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [stockForm, setStockForm] = useState({ product_name: "", stock_type: "", weight: "", quantity: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await apiClient.getStock();
        setStock(data);
        setNotifications([
          { id: 1, type: "chef_alert", message: "Chef reported low tomato stock for pizza orders", date: new Date().toISOString() },
          { id: 2, type: "system", message: "Weekly stock report generated", date: new Date().toISOString() },
        ]);
      } catch (err) { console.error("Failed to fetch stock:", err); }
      finally { setLoading(false); }
    };
    fetchStock();
  }, []);

  const handleStockInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormError(""); setFormSuccess("");
    setStockForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStockForm = () => {
    if (!stockForm.product_name.trim()) return "Product name is required";
    if (!stockForm.stock_type.trim()) return "Stock type is required";
    if (!stockForm.weight.trim() || Number(stockForm.weight) <= 0) return "Weight must be greater than 0";
    if (!stockForm.quantity.trim() || Number(stockForm.quantity) <= 0) return "Quantity must be greater than 0";
    return "";
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateStockForm();
    if (validationError) { setFormError(validationError); return; }
    try {
      setStockLoading(true); setFormError(""); setFormSuccess("");
      const payload = {
        product_name: stockForm.product_name.trim(),
        stock_type: stockForm.stock_type.trim(),
        weight: Number(stockForm.weight),
        quantity: Number(stockForm.quantity),
      };
      const newStock = await apiClient.createStock(payload);
      setStock((prev) => [...prev, newStock]);
      setStockForm({ product_name: "", stock_type: "", weight: "", quantity: "" });
      setShowForm(false);
      setFormSuccess("Stock item added successfully.");
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to add stock.");
    } finally { setStockLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  const lowStockItems = stock.filter((item) => item.quantity <= item.min_quantity);
  const normalStockItems = stock.filter((item) => item.quantity > item.min_quantity);

  const tabs = [
    { key: "inventory", label: "Inventory", icon: CubeIcon, count: stock.length },
    { key: "reports", label: "Reports", icon: ChartBarIcon, count: null },
    { key: "notifications", label: "Alerts", icon: BellIcon, count: notifications.length },
  ] as const;

  const StockCard = ({ item, isLow }: any) => {
    const pct = item.min_quantity > 0 ? Math.min(100, Math.round((item.quantity / (item.min_quantity * 2)) * 100)) : 100;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className={`glass-dark p-5 rounded-2xl ${isLow ? "border border-red-500/30" : "border border-transparent"}`}
        style={isLow ? { boxShadow: "0 0 20px rgba(239,68,68,0.08)" } : {}}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={isLow ? "icon-bg-red" : "icon-bg-green"}>
              <CubeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{item.product_name}</h3>
              <p className="text-zinc-500 text-xs">ID: {item.product_id}</p>
            </div>
          </div>
          {isLow && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/25 px-2 py-1 rounded-full animate-pulse">
              <ExclamationTriangleIcon className="w-3 h-3" />LOW
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Current Stock</span>
            <span className="text-white font-bold">{item.quantity} {item.unit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Minimum Level</span>
            <span className={isLow ? "text-red-400 font-bold" : "text-zinc-400"}>{item.min_quantity} {item.unit}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-zinc-600 mb-1.5">
            <span>Stock Level</span><span>{pct}%</span>
          </div>
          <div className="bg-white/[0.06] rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className={`h-full rounded-full ${isLow ? "bg-gradient-to-r from-red-600 to-red-500" : "bg-gradient-to-r from-green-600 to-green-400"}`}
              style={isLow ? { boxShadow: "0 0 8px rgba(239,68,68,0.6)" } : { boxShadow: "0 0 8px rgba(34,197,94,0.5)" }}
            />
          </div>
        </div>

        {isLow && (
          <div className="mt-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center py-2 rounded-lg">
            ⚠ Reorder Required
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      <div className="page-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Inventory <span className="text-orange-400">Management</span></h1>
            <p className="text-zinc-500 text-sm mt-0.5">Monitor and manage stock levels</p>
          </div>
          {lowStockItems.length > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-xl text-xs font-semibold animate-pulse">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {lowStockItems.length} Low Stock
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-5">
        {/* Tabs */}
        <div className="tab-bar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`tab-item ${activeTab === tab.key ? "active" : ""} flex-1`}>
                <Icon className="w-4 h-4" />{tab.label}
                {tab.count !== null && (
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-orange-500/30 text-orange-300" : "bg-white/[0.06] text-zinc-500"}`}>{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {formError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
              <XCircleIcon className="w-4 h-4" />{formError}
            </motion.div>
          )}
          {formSuccess && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl text-sm">
              <CheckCircleIcon className="w-4 h-4" />{formSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── INVENTORY TAB ── */}
        {activeTab === "inventory" && user?.role === "stock" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button variant="primary" size="md" onClick={() => setShowForm(!showForm)}>
                <PlusIcon className="w-4 h-4" />{showForm ? "Hide Form" : "Add Stock"}
              </Button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="glass-dark p-6 rounded-2xl">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4">New Stock Item</h3>
                    <form onSubmit={handleAddStock} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Product Name</label>
                        <input name="product_name" value={stockForm.product_name} onChange={handleStockInputChange} className="input-field pl-4" placeholder="Tomato" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Stock Type</label>
                        <select name="stock_type" value={stockForm.stock_type} onChange={handleStockInputChange} className="input-select" required>
                          <option value="">Select type</option>
                          {["fruit", "légumes", "viande", "poisson", "other"].map((t) => (
                            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Weight (kg)</label>
                        <input name="weight" type="number" step="0.01" min="0" value={stockForm.weight} onChange={handleStockInputChange} className="input-field pl-4" placeholder="1.5" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Quantity</label>
                        <input name="quantity" type="number" min="1" value={stockForm.quantity} onChange={handleStockInputChange} className="input-field pl-4" placeholder="10" required />
                      </div>
                      <div className="md:col-span-2">
                        <Button type="submit" variant="primary" size="md" isLoading={stockLoading}>
                          {stockLoading ? "Saving..." : "Save Stock Item"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Low stock */}
            {lowStockItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                  <h2 className="section-title text-red-400">Critical Stock ({lowStockItems.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockItems.map((item) => <StockCard key={item.id} item={item} isLow={true} />)}
                </div>
              </div>
            )}

            {/* Normal stock */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <h2 className="section-title">Healthy Stock ({normalStockItems.length})</h2>
              </div>
              {normalStockItems.length === 0 ? (
                <div className="glass-dark p-10 rounded-2xl text-center text-zinc-600 text-sm">All items are low on stock</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {normalStockItems.map((item) => <StockCard key={item.id} item={item} isLow={false} />)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── REPORTS TAB ── */}
        {activeTab === "reports" && user?.role === "stock" && (
          <div className="space-y-5">
            <h2 className="section-title">Stock Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Total Items", value: stock.length, colorClass: "icon-bg-blue", icon: CubeIcon },
                { label: "Low Stock", value: lowStockItems.length, colorClass: "icon-bg-red", icon: ExclamationTriangleIcon },
                { label: "Healthy Stock", value: normalStockItems.length, colorClass: "icon-bg-green", icon: CheckCircleIcon },
              ].map(({ label, value, colorClass, icon: Icon }) => (
                <div key={label} className="glass-dark p-5 rounded-2xl flex items-center gap-4">
                  <div className={colorClass}><Icon className="w-5 h-5" /></div>
                  <div>
                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{label}</p>
                    <p className="text-3xl font-black text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-dark p-6 rounded-2xl">
              <h3 className="font-bold text-white mb-4">Generate Report</h3>
              <Button variant="primary" size="md" onClick={() => alert("Report generated!")}>
                <ChartBarIcon className="w-4 h-4" />Generate Weekly Report
              </Button>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {activeTab === "notifications" && user?.role === "stock" && (
          <div className="space-y-4">
            <h2 className="section-title">Notifications</h2>
            {notifications.map((notif, idx) => (
              <motion.div key={notif.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
                className="glass-dark p-4 rounded-xl flex items-start gap-3">
                <div className="icon-bg-orange mt-0.5 flex-shrink-0"><BellIcon className="w-4 h-4" /></div>
                <div>
                  <p className="text-white text-sm font-medium">{notif.message}</p>
                  <p className="text-zinc-600 text-xs mt-1">{new Date(notif.date).toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDashboard;
