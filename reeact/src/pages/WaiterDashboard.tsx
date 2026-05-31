import React, { useState, useEffect, useRef } from "react";
import { apiClient } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  CheckCircleIcon,
  TableCellsIcon,
  BellIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

export const WaiterDashboard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState("1");
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // ── Notification state ──────────────────────────────────────────────────
  const [readyOrders, setReadyOrders] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());
  const prevReadyIds = useRef<Set<number>>(new Set());

  // Fetch menu products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Poll orders every 8 seconds to detect newly-ready orders
  useEffect(() => {
    const pollOrders = async () => {
      try {
        const data = await apiClient.getOrders();
        const ready = data.filter((o: any) => o.status === "ready");
        setReadyOrders(ready);

        // Ring the bell if there are new ready orders since last poll
        const currentIds = new Set<number>(ready.map((o: any) => o.id));
        const hasNew = [...currentIds].some((id) => !prevReadyIds.current.has(id));
        if (hasNew && ready.length > 0) {
          setShowNotifications(true);
        }
        prevReadyIds.current = currentIds;
      } catch (err) {
        console.error("Poll failed:", err);
      }
    };

    pollOrders();
    const id = setInterval(pollOrders, 8000);
    return () => clearInterval(id);
  }, []);

  // Orders visible to the waiter (not yet dismissed)
  const visibleReadyOrders = readyOrders.filter((o) => !dismissedIds.has(o.id));
  const unreadCount = visibleReadyOrders.length;

  const dismissOrder = (id: number) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  // ── Cart helpers ─────────────────────────────────────────────────────────
  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => setCart(cart.filter((item) => item.id !== productId));

  const decrementQuantity = (productId: number) => {
    setCart(
      cart
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(String(item.price ?? 0)) * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setMessage("Cart is empty");
      setMessageType("error");
      return;
    }
    try {
      setOrderLoading(true);
      setMessage("");
      const storedUser = localStorage.getItem("user");
      const authUser = storedUser ? JSON.parse(storedUser) : null;
      const orderData = {
        table_id: parseInt(selectedTable),
        waiter_id: authUser?.id,
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      };
      const order = await apiClient.createOrder(orderData);
      setCart([]);
      setMessage("Order placed successfully!");
      setMessageType("success");
      console.log("Order created", order);
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const firstError = errors ? Object.values(errors).flat().join(" ") : null;
      setMessage(firstError || err?.response?.data?.message || "Failed to place order");
      setMessageType("error");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setMessage("");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              POS <span className="text-orange-400">System</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5">Take orders for customers</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Ready-order notification bell */}
            <button
              onClick={() => setShowNotifications((s) => !s)}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all"
              title={unreadCount > 0 ? `${unreadCount} table(s) ready for pickup` : "No ready orders"}
            >
              {unreadCount > 0 ? (
                <>
                  <BellAlertIcon className="w-5 h-5 text-orange-400 animate-bounce" />
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(255,102,0,0.8)]">
                    {unreadCount}
                  </span>
                </>
              ) : (
                <BellIcon className="w-5 h-5" />
              )}
            </button>

            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 px-3 py-2 rounded-xl">
              <TableCellsIcon className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-semibold">Table {selectedTable}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ready-order notification dropdown ─────────────────────────── */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto px-6 pt-4"
          >
            <div className="glass-dark rounded-2xl p-4 border border-orange-500/25 shadow-[0_0_30px_rgba(255,102,0,0.12)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BellAlertIcon className="w-5 h-5 text-orange-400" />
                  <span className="font-bold text-white text-sm">
                    Ready for Pickup
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-orange-500/20 text-orange-300 text-xs px-2 py-0.5 rounded-full border border-orange-500/30">
                        {unreadCount} order{unreadCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {visibleReadyOrders.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-4">
                  No orders ready right now — great job! 🎉
                </p>
              ) : (
                <div className="space-y-2">
                  {visibleReadyOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm flex-shrink-0">
                          #{order.id}
                        </span>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            Table {order.table?.number ?? order.table_id}
                          </p>
                          <p className="text-zinc-500 text-xs">
                            {(order.order_items ?? order.orderItems ?? order.items ?? [])
                              .map((i: any) => `${i.quantity}× ${i.menu_item?.name ?? i.name ?? "Item"}`)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-green text-[10px]">Ready</span>
                        <button
                          onClick={() => dismissOrder(order.id)}
                          title="Mark as served"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-500/20 hover:bg-green-500/40 text-green-400 transition-all"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky ready-order banner (when dropdown is closed) ────────── */}
      <AnimatePresence>
        {!showNotifications && unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-6 pt-3"
          >
            <button
              onClick={() => setShowNotifications(true)}
              className="w-full flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 text-orange-300 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-500/15 transition-all"
            >
              <BellAlertIcon className="w-4 h-4 animate-bounce flex-shrink-0" />
              {unreadCount} order{unreadCount > 1 ? "s" : ""} ready for pickup — click to view
              <span className="ml-auto text-zinc-500">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Products */}
          <div className="lg:col-span-2 space-y-5">
            {/* Table selector */}
            <div className="glass-dark p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <TableCellsIcon className="w-4 h-4 text-zinc-400" />
                <label className="text-sm font-semibold text-zinc-300">Select Table</label>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.button
                    key={i + 1}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedTable(String(i + 1))}
                    className={`aspect-square rounded-xl font-bold text-sm transition-all relative ${
                      selectedTable === String(i + 1)
                        ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_0_12px_rgba(255,102,0,0.5)] border border-orange-400/50"
                        : "bg-white/[0.05] text-zinc-400 hover:bg-white/[0.09] hover:text-white border border-white/[0.06]"
                    }`}
                  >
                    {i + 1}
                    {/* Green dot if table has a ready order */}
                    {readyOrders.some(
                      (o) =>
                        !dismissedIds.has(o.id) &&
                        String(o.table?.number ?? o.table_id) === String(i + 1)
                    ) && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a0a] shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div>
              <h2 className="text-base font-bold text-white mb-3">
                Menu Items{" "}
                <span className="text-zinc-600 font-normal text-sm">({products.length})</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {products.map((product, idx) => {
                  const inCart = cart.find((i) => i.id === product.id);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      whileHover={{ y: -3 }}
                      onClick={() => addToCart(product)}
                      className="glass-dark rounded-2xl overflow-hidden cursor-pointer group relative"
                    >
                      <div className="aspect-square bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent flex items-center justify-center border-b border-white/[0.06] relative overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-4xl group-hover:scale-110 transition-transform">🍽️</span>
                        )}
                        {inCart && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-[0_0_8px_rgba(255,102,0,0.6)]">
                            {inCart.quantity}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/20 transition-colors flex items-center justify-center">
                          <PlusIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-white text-sm truncate">{product.name}</h3>
                        {product.category && (
                          <span className="badge-orange badge text-[10px] mt-1">{product.category}</span>
                        )}
                        <p className="text-orange-400 font-black text-base mt-2">${product.price}</p>
                      </div>
                    </motion.div>
                  );
                })}
                {products.length === 0 && (
                  <p className="col-span-3 text-center text-zinc-600 py-12 text-sm">No menu items found</p>
                )}
              </div>
            </div>
          </div>

          {/* Right — Cart */}
          <div className="glass-dark p-5 rounded-2xl h-fit sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <ShoppingCartIcon className="w-5 h-5 text-orange-400" />
                Order
              </h2>
              {totalItems > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingCartIcon className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-600 text-sm">Cart is empty</p>
                <p className="text-zinc-700 text-xs mt-1">Click menu items to add</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4 max-h-72 overflow-y-auto">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white/[0.04] border border-white/[0.06] p-3 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white text-sm font-semibold truncate flex-1">{item.name}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-600 hover:text-red-400 transition-colors ml-2"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-white/[0.06] rounded-lg p-0.5">
                            <button
                              onClick={() => decrementQuantity(item.id)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors"
                            >
                              <MinusIcon className="w-3 h-3 text-zinc-400" />
                            </button>
                            <span className="text-white font-bold text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors"
                            >
                              <PlusIcon className="w-3 h-3 text-zinc-400" />
                            </button>
                          </div>
                          <span className="text-orange-400 font-bold text-sm">
                            ${(parseFloat(String(item.price ?? 0)) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-white/[0.06] pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white">
                    <span>Total</span>
                    <span className="text-orange-400 text-lg">${total.toFixed(2)}</span>
                  </div>

                  <AnimatePresence>
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                          messageType === "success"
                            ? "bg-green-500/10 text-green-400 border border-green-500/25"
                            : "bg-red-500/10 text-red-400 border border-red-500/25"
                        }`}
                      >
                        {messageType === "success" ? (
                          <CheckCircleIcon className="w-4 h-4" />
                        ) : (
                          <XMarkIcon className="w-4 h-4" />
                        )}
                        {message}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handlePlaceOrder}
                    isLoading={orderLoading}
                  >
                    {orderLoading ? "Placing Order..." : "Place Order"}
                  </Button>
                  <Button variant="outline" size="md" className="w-full" onClick={handleClearCart}>
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;
