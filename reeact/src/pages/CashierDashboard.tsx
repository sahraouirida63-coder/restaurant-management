import React, { useState, useEffect, Component } from "react";
import { apiClient } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  XMarkIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";

// ─── Safe price formatter ─────────────────────────────────────────────────────
// Laravel returns total_price as a decimal string ("14.99"), NOT a JS number.
// Calling .toFixed() on a string throws TypeError → black screen.
const fmt = (v: any): string => {
  const n = parseFloat(String(v ?? 0));
  return isNaN(n) ? "0.00" : n.toFixed(2);
};

// ─── Error Boundary ───────────────────────────────────────────────────────────
class CashierErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: error?.message ?? "Unknown error" };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
          <div className="text-center max-w-sm px-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <XMarkIcon className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-white font-bold text-lg mb-1">Cashier Error</p>
            <p className="text-zinc-400 text-sm mb-2 font-mono bg-zinc-900 px-3 py-2 rounded-lg">
              {this.state.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-5 py-2.5 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-xl text-sm font-semibold hover:bg-orange-500/30 transition-all"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const CashierDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "online">("card");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Orders the cashier cares about — pending, preparing, and ready (not yet completed)
  const BILLABLE = ["pending", "preparing", "ready"];

  const applyFilter = (raw: any) => {
    const list = Array.isArray(raw) ? raw : [];
    return list.filter((o: any) => BILLABLE.includes(o.status));
  };

  const loadOrders = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getOrders();
      setOrders(applyFilter(data));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 403 ? "Access denied — please log in as cashier." : null) ||
        "Failed to load orders. Check your connection.";
      console.error("Cashier fetchOrders:", err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(true);
    const interval = setInterval(() => loadOrders(false), 8000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayment = async () => {
    if (!selectedOrder) return;
    try {
      await apiClient.updateOrderStatus(selectedOrder.id, "completed");
      setPaymentSuccess(true);
      setTimeout(() => {
        setOrders(orders.filter((o) => o.id !== selectedOrder.id));
        setSelectedOrder(null);
        setPaymentSuccess(false);
      }, 1800);
    } catch (err) { console.error("Payment failed:", err); }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-zinc-500 text-sm animate-pulse">Loading billing data…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XMarkIcon className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-white font-bold text-lg mb-1">Failed to Load Orders</p>
          <p className="text-zinc-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => loadOrders(true)}
            className="px-5 py-2.5 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-xl text-sm font-semibold hover:bg-orange-500/30 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );

  const paymentMethods = [
    { key: "cash", label: "Cash", icon: BanknotesIcon },
    { key: "card", label: "Card", icon: CreditCardIcon },
    { key: "online", label: "Online", icon: DevicePhoneMobileIcon },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #111111 50%, #0d0d0d 100%)" }}>
      <div className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Billing <span className="text-orange-400">System</span></h1>
          <p className="text-zinc-500 text-sm mt-0.5">Process customer payments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Pending Orders</h2>
              <span className="badge-orange badge">{orders.length} orders</span>
            </div>
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="glass-dark p-10 rounded-2xl text-center">
                  <CheckCircleIcon className="w-12 h-12 text-green-500/40 mx-auto mb-3" />
                  <p className="text-zinc-500">All orders have been processed</p>
                </div>
              ) : (
                orders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`glass-dark p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                      selectedOrder?.id === order.id
                        ? "border border-orange-500/40 shadow-[0_0_20px_rgba(255,102,0,0.15)]"
                        : "border border-transparent hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedOrder?.id === order.id ? "icon-bg-orange" : "bg-white/[0.05]"}`}>
                          <ReceiptPercentIcon className={`w-5 h-5 ${selectedOrder?.id === order.id ? "text-orange-400" : "text-zinc-500"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">Order #{order.id}</p>
                          <p className="text-zinc-500 text-xs">Table {order.table?.number ?? order.table_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-orange-400">${fmt(order.total_price)}</p>
                        <span className={`badge text-[10px] ${
                          order.status === "ready" ? "badge-green" :
                          order.status === "preparing" ? "badge-blue" :
                          "badge-yellow"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Payment panel */}
          <div>
            <h2 className="section-title mb-4">Payment</h2>
            <div className="glass-dark p-5 rounded-2xl sticky top-20">
              <AnimatePresence mode="wait">
                {paymentSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10"
                  >
                    <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-white font-bold text-lg">Payment Complete!</p>
                    <p className="text-zinc-500 text-sm mt-1">Order processed successfully</p>
                  </motion.div>
                ) : selectedOrder ? (
                  <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Order summary */}
                    <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Order</span>
                        <span className="text-white font-bold">#{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-zinc-400">Table</span>
                        <span className="text-white font-bold">{selectedOrder.table?.number ?? selectedOrder.table_id}</span>
                      </div>
                      <div className="border-t border-white/[0.06] pt-3 flex justify-between items-center">
                        <span className="text-zinc-300 font-semibold">Total</span>
                        <span className="text-2xl font-black text-orange-400">${fmt(selectedOrder.total_price)}</span>
                      </div>
                    </div>

                    {/* Payment method */}
                    <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {paymentMethods.map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => setPaymentMethod(key)}
                          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all text-xs font-semibold ${
                            paymentMethod === key
                              ? "bg-orange-500/15 border-orange-500/40 text-orange-400 shadow-[0_0_12px_rgba(255,102,0,0.15)]"
                              : "bg-white/[0.04] border-white/[0.08] text-zinc-500 hover:text-white hover:bg-white/[0.07]"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Credit card visual */}
                    {paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4 rounded-xl mb-4 border border-blue-500/30"
                        style={{ boxShadow: "0 8px 24px rgba(59,130,246,0.3)" }}
                      >
                        <div className="flex justify-between items-start mb-5">
                          <span className="text-blue-200 text-xs font-semibold tracking-wider">VISA</span>
                          <CreditCardIcon className="w-5 h-5 text-blue-300" />
                        </div>
                        <p className="font-mono text-white text-base tracking-widest mb-4">•••• •••• •••• 4242</p>
                        <div className="flex justify-between text-blue-200 text-xs">
                          <span>Valid Thru: 12/25</span><span>CVV: •••</span>
                        </div>
                      </motion.div>
                    )}

                    <Button variant="primary" size="lg" className="w-full mb-2" onClick={handlePayment}>
                      Complete Payment
                    </Button>
                    <Button variant="outline" size="md" className="w-full" onClick={() => setSelectedOrder(null)}>
                      <XMarkIcon className="w-4 h-4" /> Cancel
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <CreditCardIcon className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm">Select an order to process payment</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap with error boundary so any future crash shows a recoverable UI instead of a black screen
const CashierDashboardWithBoundary: React.FC = () => (
  <CashierErrorBoundary>
    <CashierDashboard />
  </CashierErrorBoundary>
);

export default CashierDashboardWithBoundary;
