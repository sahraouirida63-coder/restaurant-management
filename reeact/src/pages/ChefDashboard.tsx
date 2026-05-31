import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  FireIcon,
  BeakerIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

export const ChefDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "recipes" | "ingredients">("orders");
  const [recipeForm, setRecipeForm] = useState({ name: "", description: "", ingredients: "" });
  const [ingredientForm, setIngredientForm] = useState({ name: "", quantity: "", unit: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersData, stockData] = await Promise.all([apiClient.getOrders(), apiClient.getStock()]);
        setOrders(ordersData);
        setIngredients(stockData);
        setRecipes([
          { id: 1, name: "Margherita Pizza", description: "Classic pizza", ingredients: "Dough, Tomato, Cheese" },
          { id: 2, name: "Pasta Carbonara", description: "Creamy pasta", ingredients: "Pasta, Eggs, Bacon" },
        ]);
        const lowStock = stockData.filter((item: any) => item.quantity <= item.min_quantity);
        setNotifications(lowStock.map((item: any) => ({ id: item.id, type: "low_stock", message: `Low stock: ${item.product_name} (${item.quantity} remaining)` })));
      } catch (err) { console.error("Failed to fetch data:", err); }
      finally { setLoading(false); }
    };

    // Fetch orders silently (no loading spinner) for subsequent polls
    const refreshOrders = async () => {
      try {
        const ordersData = await apiClient.getOrders();
        setOrders(ordersData);
      } catch (err) { console.error("Poll failed:", err); }
    };

    fetchData();
    // Poll every 10 seconds so new waiter orders appear automatically
    const interval = setInterval(refreshOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) { console.error("Failed to update order status:", err); }
  };

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeForm.name.trim()) { setMessage("Recipe name is required"); return; }
    try {
      setFormLoading(true); setMessage("");
      setRecipes((prev) => [...prev, { id: Date.now(), name: recipeForm.name.trim(), description: recipeForm.description.trim(), ingredients: recipeForm.ingredients.trim() }]);
      setRecipeForm({ name: "", description: "", ingredients: "" });
      setMessage("Recipe added successfully.");
    } catch { setMessage("Failed to add recipe."); }
    finally { setFormLoading(false); }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientForm.name.trim() || !ingredientForm.quantity.trim()) { setMessage("Name and quantity are required"); return; }
    try {
      setFormLoading(true); setMessage("");
      const payload = { product_name: ingredientForm.name.trim(), stock_type: "ingredient", weight: 1, quantity: Number(ingredientForm.quantity) };
      const newIngredient = await apiClient.createStock(payload);
      setIngredients((prev) => [...prev, newIngredient]);
      setIngredientForm({ name: "", quantity: "", unit: "" });
      setMessage("Ingredient added successfully.");
    } catch (err: any) { setMessage(err?.response?.data?.message || "Failed to add ingredient."); }
    finally { setFormLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  const columnConfig = [
    { title: "Pending", count: pendingOrders.length, orders: pendingOrders, status: "pending", color: "blue", headerClass: "border-blue-500/30 bg-blue-500/5", dotClass: "bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]" },
    { title: "Preparing", count: preparingOrders.length, orders: preparingOrders, status: "preparing", color: "yellow", headerClass: "border-yellow-500/30 bg-yellow-500/5", dotClass: "bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.8)]" },
    { title: "Ready", count: readyOrders.length, orders: readyOrders, status: "ready", color: "green", headerClass: "border-green-500/30 bg-green-500/5", dotClass: "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" },
  ];

  const tabs = [
    { key: "orders", label: "Orders", icon: FireIcon, count: orders.length },
    { key: "recipes", label: "Recipes", icon: BookOpenIcon, count: recipes.length },
    { key: "ingredients", label: "Ingredients", icon: BeakerIcon, count: ingredients.length },
  ] as const;

  const OrderCard = ({ order, status }: any) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-dark p-4 rounded-xl"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-white text-sm">Order #{order.id}</p>
          <p className="text-zinc-500 text-xs">Table {order.table?.number ?? order.table_id} · {new Date(order.created_at).toLocaleTimeString()}</p>
        </div>
        <span className={`badge ${status === "ready" ? "badge-green" : status === "preparing" ? "badge-yellow" : "badge-blue"}`}>
          {status}
        </span>
      </div>
      <div className="space-y-1 mb-3 max-h-24 overflow-y-auto">
        {(order.order_items ?? order.orderItems ?? order.items ?? []).map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between text-xs text-zinc-400">
            <span>× {item.quantity} {item.menu_item?.name ?? item.name ?? "Item"}</span>
            {item.notes && <span className="italic text-zinc-600">"{item.notes}"</span>}
          </div>
        ))}
      </div>
      <div>
        {status === "pending" && <Button variant="secondary" size="sm" className="w-full" onClick={() => handleStatusChange(order.id, "preparing")}>Start Preparing</Button>}
        {status === "preparing" && <Button variant="primary" size="sm" className="w-full" onClick={() => handleStatusChange(order.id, "ready")}><CheckCircleIcon className="w-4 h-4" /> Mark Ready</Button>}
        {status === "ready" && <div className="w-full bg-green-500/15 border border-green-500/30 text-green-400 py-2 rounded-lg text-center text-xs font-semibold">✓ Ready for Pickup</div>}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      <div className="page-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Kitchen <span className="text-orange-400">Display</span></h1>
            <p className="text-zinc-500 text-sm mt-0.5">Manage food preparation and recipes</p>
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-xl text-xs font-semibold">
              <ExclamationTriangleIcon className="w-4 h-4 animate-pulse" />
              {notifications.length} Low Stock Alert{notifications.length > 1 ? "s" : ""}
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
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-orange-500/30 text-orange-300" : "bg-white/[0.06] text-zinc-500"}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>

        {/* Notifications banner */}
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-300 px-4 py-2.5 rounded-xl text-sm">
                  <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />{n.message}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orders Tab — Kanban */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {columnConfig.map((col) => (
              <div key={col.title}>
                <div className={`flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl border ${col.headerClass}`}>
                  <span className={`w-2 h-2 rounded-full ${col.dotClass}`} />
                  <span className="font-bold text-white text-sm">{col.title}</span>
                  <span className="ml-auto text-xs text-zinc-500">{col.count}</span>
                </div>
                <div className="space-y-3">
                  {col.orders.map((order) => <OrderCard key={order.id} order={order} status={col.status} />)}
                  {col.orders.length === 0 && <p className="text-zinc-700 text-xs text-center py-8">No orders</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === "recipes" && user?.role === "chef" && (
          <div className="space-y-5">
            <div className="glass-dark p-6 rounded-2xl">
              {message && <p className={`text-sm mb-3 ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>{message}</p>}
              <form onSubmit={handleAddRecipe} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Recipe Name</label>
                  <input name="name" value={recipeForm.name} onChange={(e) => { setMessage(""); setRecipeForm((p) => ({ ...p, name: e.target.value })); }} className="input-field pl-4" placeholder="Margherita Pizza" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description</label>
                  <textarea name="description" value={recipeForm.description} onChange={(e) => setRecipeForm((p) => ({ ...p, description: e.target.value }))} className="input-textarea" placeholder="Classic pizza recipe" rows={2} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Ingredients</label>
                  <textarea name="ingredients" value={recipeForm.ingredients} onChange={(e) => setRecipeForm((p) => ({ ...p, ingredients: e.target.value }))} className="input-textarea" placeholder="Dough, Tomato Sauce, Cheese, Basil" rows={2} />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" variant="primary" size="md" isLoading={formLoading}><PlusIcon className="w-4 h-4" />{formLoading ? "Saving..." : "Save Recipe"}</Button>
                </div>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe, idx) => (
                <motion.div key={recipe.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }} className="glass-dark p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white text-sm">{recipe.name}</h3>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-blue-500/15 rounded-lg transition-colors"><PencilSquareIcon className="w-3.5 h-3.5 text-zinc-500 hover:text-blue-400" /></button>
                      <button className="p-1.5 hover:bg-red-500/15 rounded-lg transition-colors"><TrashIcon className="w-3.5 h-3.5 text-zinc-500 hover:text-red-400" /></button>
                    </div>
                  </div>
                  <p className="text-zinc-500 text-xs mb-2">{recipe.description}</p>
                  <p className="text-zinc-600 text-xs"><span className="text-zinc-500 font-medium">Ingredients:</span> {recipe.ingredients}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients Tab */}
        {activeTab === "ingredients" && user?.role === "chef" && (
          <div className="space-y-5">
            <div className="glass-dark p-6 rounded-2xl">
              {message && <p className={`text-sm mb-3 ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>{message}</p>}
              <form onSubmit={handleAddIngredient} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Ingredient Name</label>
                  <input name="name" value={ingredientForm.name} onChange={(e) => { setMessage(""); setIngredientForm((p) => ({ ...p, name: e.target.value })); }} className="input-field pl-4" placeholder="Tomato" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Quantity</label>
                  <input name="quantity" type="number" min="1" value={ingredientForm.quantity} onChange={(e) => setIngredientForm((p) => ({ ...p, quantity: e.target.value }))} className="input-field pl-4" placeholder="10" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Unit</label>
                  <input name="unit" value={ingredientForm.unit} onChange={(e) => setIngredientForm((p) => ({ ...p, unit: e.target.value }))} className="input-field pl-4" placeholder="kg" />
                </div>
                <div className="md:col-span-3">
                  <Button type="submit" variant="primary" size="md" isLoading={formLoading}><PlusIcon className="w-4 h-4" />{formLoading ? "Saving..." : "Add Ingredient"}</Button>
                </div>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredients.map((item, idx) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="glass-dark p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{item.product_name}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{item.stock_type || "ingredient"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-bold">{item.quantity}</p>
                    <p className="text-zinc-600 text-xs">{item.unit || "units"}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefDashboard;
