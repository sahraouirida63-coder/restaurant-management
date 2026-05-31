import React, { useState, useEffect } from "react";
import { apiClient } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "../components/Button";
import { motion } from "framer-motion";
import {
  TruckIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export const DeliveryDashboard: React.FC = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await apiClient.getDeliveries();
        setDeliveries(data);
      } catch (err) { console.error("Failed to fetch deliveries:", err); }
      finally { setLoading(false); }
    };
    fetchDeliveries();
  }, []);

  const handleStatusUpdate = async (deliveryId: number, newStatus: string) => {
    try {
      await apiClient.updateDeliveryStatus(deliveryId, newStatus);
      setDeliveries(deliveries.map((d) => (d.id === deliveryId ? { ...d, status: newStatus } : d)));
    } catch (err) { console.error("Failed to update delivery status:", err); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  const columns = [
    {
      key: "pending",
      title: "Pending",
      icon: ClockIcon,
      items: deliveries.filter((d) => d.status === "pending"),
      dotClass: "bg-zinc-400",
      headerBg: "bg-zinc-500/5 border-zinc-500/20",
      badgeClass: "badge-gray",
    },
    {
      key: "accepted",
      title: "Accepted",
      icon: CheckCircleIcon,
      items: deliveries.filter((d) => d.status === "accepted"),
      dotClass: "bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.8)]",
      headerBg: "bg-yellow-500/5 border-yellow-500/20",
      badgeClass: "badge-yellow",
    },
    {
      key: "on_the_way",
      title: "On the Way",
      icon: TruckIcon,
      items: deliveries.filter((d) => d.status === "on_the_way"),
      dotClass: "bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]",
      headerBg: "bg-blue-500/5 border-blue-500/20",
      badgeClass: "badge-blue",
    },
    {
      key: "delivered",
      title: "Delivered",
      icon: CheckCircleIcon,
      items: deliveries.filter((d) => d.status === "delivered"),
      dotClass: "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]",
      headerBg: "bg-green-500/5 border-green-500/20",
      badgeClass: "badge-green",
    },
  ];

  const DeliveryCard = ({ delivery, col }: { delivery: any; col: typeof columns[0] }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="glass-dark p-4 rounded-xl"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-white text-sm">{delivery.customer_name}</p>
          <p className="text-zinc-500 text-xs mt-0.5">Order #{delivery.order_id}</p>
        </div>
        <span className={`badge ${col.badgeClass} text-[10px]`}>
          {col.title}
        </span>
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <PhoneIcon className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
          <span>{delivery.customer_phone || "N/A"}</span>
        </div>
        <div className="flex items-start gap-2 text-zinc-400 text-xs">
          <MapPinIcon className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{delivery.address || "Address not provided"}</span>
        </div>
      </div>

      <div>
        {col.key === "pending" && (
          <Button variant="secondary" size="sm" className="w-full" onClick={() => handleStatusUpdate(delivery.id, "accepted")}>
            <CheckCircleIcon className="w-4 h-4" /> Accept
          </Button>
        )}
        {col.key === "accepted" && (
          <Button variant="primary" size="sm" className="w-full" onClick={() => handleStatusUpdate(delivery.id, "on_the_way")}>
            <TruckIcon className="w-4 h-4" /> On the Way
          </Button>
        )}
        {col.key === "on_the_way" && (
          <Button variant="primary" size="sm" className="w-full" onClick={() => handleStatusUpdate(delivery.id, "delivered")}>
            <CheckCircleIcon className="w-4 h-4" /> Mark Delivered
          </Button>
        )}
        {col.key === "delivered" && (
          <div className="w-full bg-green-500/10 border border-green-500/25 text-green-400 py-2 rounded-lg text-center text-xs font-semibold flex items-center justify-center gap-1.5">
            <CheckCircleIcon className="w-3.5 h-3.5" /> Completed
          </div>
        )}
      </div>
    </motion.div>
  );

  const totalActive = deliveries.filter((d) => d.status !== "delivered").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      <div className="page-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Delivery <span className="text-orange-400">Management</span></h1>
            <p className="text-zinc-500 text-sm mt-0.5">Track and manage all deliveries</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{deliveries.length}</p>
              <p className="text-zinc-500 text-xs">Total</p>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div className="text-center">
              <p className="text-2xl font-black text-orange-400">{totalActive}</p>
              <p className="text-zinc-500 text-xs">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Flow indicator */}
        <div className="hidden md:flex items-center justify-center gap-2 mb-6 text-xs text-zinc-600 font-medium">
          {columns.map((col, i) => (
            <React.Fragment key={col.key}>
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${col.headerBg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${col.dotClass}`} />
                <span className="text-zinc-400">{col.title} ({col.items.length})</span>
              </span>
              {i < columns.length - 1 && <ArrowRightIcon className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {/* Kanban grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {columns.map((col) => {
            const Icon = col.icon;
            return (
              <div key={col.key}>
                {/* Column header */}
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border mb-4 ${col.headerBg}`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dotClass}`} />
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span className="font-bold text-white text-sm">{col.title}</span>
                  <span className="ml-auto text-xs text-zinc-500 bg-white/[0.06] px-1.5 py-0.5 rounded-full">
                    {col.items.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {col.items.map((delivery) => (
                    <DeliveryCard key={delivery.id} delivery={delivery} col={col} />
                  ))}
                  {col.items.length === 0 && (
                    <div className="text-center py-8 text-zinc-700 text-xs">No deliveries</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
