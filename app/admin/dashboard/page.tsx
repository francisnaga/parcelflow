"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Plus, Edit2, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Parcel } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default function AdminDashboard() {
  const router = useRouter();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
  });

  useEffect(() => {
    const checkAuth = (): void => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin");
        return;
      }
      loadParcels();
    };

    checkAuth();
  }, [router]);

  const loadParcels = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/parcels", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load parcels");
      }

      const data = await response.json();
      setParcels(data.parcels);
      setStats({
        total: data.parcels.length,
        pending: data.parcels.filter(
          (p: Parcel) => p.current_status === "pending"
        ).length,
        inTransit: data.parcels.filter(
          (p: Parcel) => p.current_status === "in transit"
        ).length,
        delivered: data.parcels.filter(
          (p: Parcel) => p.current_status === "delivered"
        ).length,
      });
    } catch (error) {
      console.error("Error loading parcels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this parcel?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/parcels/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      if (response.ok) {
        loadParcels();
      }
    } catch (error) {
      console.error("Error deleting parcel:", error);
    }
  };

  const statCards = [
    { label: "Total Parcels", value: stats.total, color: "text-primary" },
    { label: "Pending", value: stats.pending, color: "text-yellow-500" },
    { label: "In Transit", value: stats.inTransit, color: "text-blue-500" },
    { label: "Delivered", value: stats.delivered, color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Package className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">ParcelFlow</span>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Parcel Management
            </h1>
            <p className="text-muted-foreground">
              Manage your parcels, tracking updates, and notifications.
            </p>
          </div>
          <Link href="/admin/dashboard/create">
            <Button className="bg-primary text-primary-foreground h-10 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Parcel
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-lg border border-border bg-card"
            >
              <p className="text-sm text-muted-foreground mb-2">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Parcels Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border bg-card overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">All Parcels</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground">
              Loading parcels...
            </div>
          ) : parcels.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No parcels yet</p>
              <Link href="/admin/dashboard/create">
                <Button variant="outline">Create First Parcel</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-secondary/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Tracking ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Receiver
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {parcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-primary">
                        {parcel.tracking_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {parcel.receiver_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {parcel.origin} → {parcel.destination}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            parcel.current_status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : parcel.current_status === "in transit"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {parcel.current_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDateTime(parcel.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/dashboard/edit/${parcel.id}`}
                            className="p-2 hover:bg-secondary rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </Link>
                          <button
                            onClick={() => handleDelete(parcel.id)}
                            className="p-2 hover:bg-secondary rounded transition-colors text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
