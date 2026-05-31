import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  TableCellsIcon,
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"employees" | "menu" | "stock">("menu");
  const [employeeForm, setEmployeeForm] = useState({ name: "", email: "", password: "", role: "", phone: "" });
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [menuForm, setMenuForm] = useState({ name: "", description: "", price: "", category: "" });
  const [menuImageFile, setMenuImageFile] = useState<File | null>(null);
  const [menuImagePreview, setMenuImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesData, productsData, stockData] = await Promise.all([
          apiClient.getUsers(), apiClient.getProducts(), apiClient.getStock(),
        ]);
        setEmployees(employeesData);
        setProducts(productsData);
        setStockItems(stockData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddEmployee = () => setShowEmployeeForm(!showEmployeeForm);
  const handleEmployeeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormError(""); setFormSuccess("");
    setEmployeeForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const validateEmployeeForm = () => {
    if (!employeeForm.name.trim()) return "Name is required";
    if (!employeeForm.email.trim()) return "Email is required";
    if (!employeeForm.email.includes("@")) return "Valid email is required";
    if (!employeeForm.password.trim()) return "Password is required";
    if (employeeForm.password.length < 6) return "Password must be at least 6 characters";
    if (!employeeForm.role.trim()) return "Role is required";
    return "";
  };
  const handleSubmitEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmployeeForm();
    if (validationError) { setFormError(validationError); return; }
    try {
      setMenuLoading(true); setFormError(""); setFormSuccess("");
      const payload = {
        name: employeeForm.name.trim(), email: employeeForm.email.trim(),
        password: employeeForm.password.trim(),
        role: employeeForm.role.trim() as any,
        phone: employeeForm.phone.trim() || undefined,
      };
      const newEmployee = await apiClient.createUser(payload);
      setEmployees((prev) => [...prev, newEmployee]);
      setEmployeeForm({ name: "", email: "", password: "", role: "", phone: "" });
      setShowEmployeeForm(false);
      setFormSuccess("Employee added successfully.");
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to add employee.");
    } finally { setMenuLoading(false); }
  };
  const handleMenuInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormError(""); setFormSuccess("");
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0] ?? null;
      setMenuImageFile(file);
      setMenuImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setMenuForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };
  const validateMenuForm = () => {
    if (!menuForm.name.trim()) return "Name is required";
    if (!menuForm.price.trim() || Number(menuForm.price) <= 0) return "Price must be greater than 0";
    return "";
  };
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateMenuForm();
    if (validationError) { setFormError(validationError); return; }
    try {
      setMenuLoading(true); setFormError(""); setFormSuccess("");
      const formData = new FormData();
      formData.append("name", menuForm.name.trim());
      formData.append("price", String(Number(menuForm.price)));
      formData.append("category", menuForm.category.trim() || "main");
      if (menuForm.description.trim()) formData.append("description", menuForm.description.trim());
      if (menuImageFile) formData.append("image", menuImageFile);
      const newProduct = await apiClient.createProduct(formData);
      setProducts((prev) => [...prev, newProduct]);
      setMenuForm({ name: "", description: "", price: "", category: "" });
      setMenuImageFile(null);
      setMenuImagePreview(null);
      setFormSuccess("Menu item added successfully.");
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to add menu item.");
    } finally { setMenuLoading(false); }
  };
  const handleEditMenuItem = (product: any) => {
    const newName = prompt("New name:", product.name);
    const newPrice = prompt("New price:", product.price.toString());
    if (newName && newPrice) handleUpdateMenuItem(product.id, { name: newName, price: Number(newPrice) });
  };
  const handleUpdateMenuItem = async (id: number, data: any) => {
    try {
      await apiClient.updateProduct(id, data);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
      setFormSuccess("Menu item updated.");
    } catch { setFormError("Failed to update menu item."); }
  };
  const handleDeleteMenuItem = async (product: any) => {
    if (!confirm(`Delete ${product.name}?`)) return;
    try {
      await apiClient.deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setFormSuccess("Menu item deleted.");
    } catch { setFormError("Failed to delete menu item."); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  const tabs = [
    { key: "employees", label: "Employees", icon: UsersIcon, count: employees.length },
    { key: "menu", label: "Menu", icon: TableCellsIcon, count: products.length },
    { key: "stock", label: "Stock", icon: CubeIcon, count: stockItems.length },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      <div className="page-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Manager <span className="text-orange-400">Dashboard</span></h1>
            <p className="text-zinc-500 text-sm mt-0.5">Manage staff, menu, and stock</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-white/[0.04] border border-white/[0.08] px-3 py-2 rounded-xl">
            <SparklesIcon className="w-3.5 h-3.5 text-orange-400" />
            Manager Portal
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-5">
        {/* Tab Bar */}
        <div className="tab-bar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-item ${isActive ? "active" : ""} flex-1`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-orange-500/30 text-orange-300" : "bg-white/[0.06] text-zinc-500"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback messages */}
        <AnimatePresence>
          {formError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
              <XCircleIcon className="w-4 h-4 flex-shrink-0" />{formError}
            </motion.div>
          )}
          {formSuccess && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl text-sm">
              <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />{formSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── EMPLOYEES TAB ── */}
        {activeTab === "employees" && user?.role === "manager" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Staff Management</h2>
              <Button variant="primary" size="md" onClick={handleAddEmployee}>
                <PlusIcon className="w-4 h-4" />
                {showEmployeeForm ? "Hide Form" : "Add Employee"}
              </Button>
            </div>

            <AnimatePresence>
              {showEmployeeForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="glass-dark p-6 rounded-2xl">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">New Employee</h3>
                    <form onSubmit={handleSubmitEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                        { name: "email", label: "Email Address", type: "email", placeholder: "john@restaurant.com" },
                        { name: "password", label: "Password", type: "password", placeholder: "Min. 6 characters" },
                        { name: "phone", label: "Phone (optional)", type: "text", placeholder: "+1234567890" },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-zinc-400 mb-1.5">{field.label}</label>
                          <input name={field.name} type={field.type} value={(employeeForm as any)[field.name]} onChange={handleEmployeeInputChange} className="input-field" placeholder={field.placeholder} />
                        </div>
                      ))}
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Role</label>
                        <select name="role" value={employeeForm.role} onChange={handleEmployeeInputChange} className="input-select" required>
                          <option value="">Select role</option>
                          {["waiter", "chef", "cashier", "stock", "delivery"].map((r) => (
                            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <Button type="submit" variant="primary" size="md" isLoading={menuLoading}>
                          {menuLoading ? "Saving..." : "Save Employee"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass-dark rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                      {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, idx) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {emp.profile_image_url ? (
                              <img
                                src={emp.profile_image_url}
                                alt={emp.name}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/30"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white text-xs font-bold">
                                {emp.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="text-white font-medium text-sm">{emp.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-zinc-400 text-sm">{emp.email}</td>
                        <td className="px-5 py-3.5">
                          <span className="badge badge-blue">{emp.role}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`badge ${emp.status === "active" || !emp.status ? "badge-green" : "badge-red"}`}>
                            {emp.status || "active"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => console.log("Edit employee", emp)} className="p-2 hover:bg-blue-500/15 rounded-lg transition-colors group">
                              <PencilSquareIcon className="w-4 h-4 text-zinc-500 group-hover:text-blue-400" />
                            </button>
                            <button onClick={() => console.log("Delete employee", emp)} className="p-2 hover:bg-red-500/15 rounded-lg transition-colors group">
                              <TrashIcon className="w-4 h-4 text-zinc-500 group-hover:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {employees.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-12 text-zinc-600 text-sm">No employees found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── MENU TAB ── */}
        {activeTab === "menu" && user?.role === "manager" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Menu Management</h2>
            </div>
            <div className="glass-dark p-6 rounded-2xl">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Add Menu Item</h3>
              <form onSubmit={handleAddMenuItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Item Name</label>
                  <input name="name" value={menuForm.name} onChange={handleMenuInputChange} className="input-field pl-4" placeholder="Pizza Margherita" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Category</label>
                  <select name="category" value={menuForm.category} onChange={handleMenuInputChange} className="input-select">
                    <option value="main">Main</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="dessert">Dessert</option>
                    <option value="drink">Drink</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Price ($)</label>
                  <input name="price" type="number" step="0.01" min="0" value={menuForm.price} onChange={handleMenuInputChange} className="input-field pl-4" placeholder="12.99" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description</label>
                  <textarea name="description" value={menuForm.description} onChange={handleMenuInputChange} className="input-textarea" placeholder="Describe the dish..." rows={2} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Dish Image (optional)</label>
                  <label
                    htmlFor="menu-image-upload"
                    className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-xl p-5 cursor-pointer transition-colors group bg-white/[0.02] hover:bg-orange-500/5"
                  >
                    {menuImagePreview ? (
                      <img src={menuImagePreview} alt="Preview" className="h-28 object-contain rounded-lg" />
                    ) : (
                      <>
                        <PhotoIcon className="w-8 h-8 text-zinc-600 group-hover:text-orange-400 transition-colors" />
                        <span className="text-zinc-500 text-sm group-hover:text-zinc-400">Click to upload image</span>
                        <span className="text-zinc-600 text-xs">PNG, JPG, GIF, WEBP up to 4 MB</span>
                      </>
                    )}
                    <input
                      id="menu-image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleMenuInputChange}
                    />
                  </label>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" variant="primary" size="md" isLoading={menuLoading}>
                    <PlusIcon className="w-4 h-4" />
                    {menuLoading ? "Saving..." : "Add to Menu"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="glass-dark rounded-2xl overflow-hidden group"
                >
                  <div className="aspect-video bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent flex items-center justify-center border-b border-white/[0.06] overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-5xl group-hover:scale-110 transition-transform">🍽️</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-white text-sm">{product.name}</h3>
                        <span className="badge-orange badge text-[10px] mt-1">{product.category || "main"}</span>
                      </div>
                      <span className="text-xl font-black text-orange-400">${product.price}</span>
                    </div>
                    {product.description && <p className="text-zinc-500 text-xs mt-2 line-clamp-2">{product.description}</p>}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleEditMenuItem(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-colors">
                        <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => handleDeleteMenuItem(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors">
                        <TrashIcon className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── STOCK TAB ── */}
        {activeTab === "stock" && user?.role === "manager" && (
          <div className="space-y-4">
            <h2 className="section-title">Stock Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockItems.map((item, idx) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="glass-dark p-5 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="icon-bg-purple"><CubeIcon className="w-4 h-4" /></div>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.product_name}</p>
                      <p className="text-zinc-500 text-xs">{item.stock_type || item.category || "General"}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Qty: <span className="text-white font-bold">{item.quantity}</span></span>
                    <span className="text-zinc-400">Weight: <span className="text-white font-bold">{item.weight ?? item.unit ?? "—"} kg</span></span>
                  </div>
                </motion.div>
              ))}
              {stockItems.length === 0 && <p className="text-zinc-600 text-sm col-span-3 text-center py-8">No stock items found</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
