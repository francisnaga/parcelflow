"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { Parcel } from "@/lib/types";

export default function EditParcelPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [updateData, setUpdateData] = useState({
    status: "in transit",
    location: "",
    description: "",
    feeAmount: "",
  });

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const response = await fetch(`/api/admin/parcels/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to load parcel");
        const data = await response.json();
        setParcel(data.parcel);
        setUpdateData((prev) => ({
          ...prev,
          status: data.parcel.current_status || "in transit",
        }));
      } catch (err) {
        setError("Error loading parcel details");
      } finally {
        setLoading(false);
      }
    };
    fetchParcel();
  }, [id]);

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      const response = await fetch("/api/admin/tracking-updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          parcel_id: id,
          status: updateData.status,
          location: updateData.location,
          description: updateData.status === "payment required" && updateData.feeAmount
            ? `Fee Amount: ${updateData.feeAmount} | ${updateData.description}`
            : updateData.description,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add tracking update");
      }

      setSuccess("Tracking update added successfully and email notification sent.");
      // Refresh parcel to get new status
      const pRes = await fetch(`/api/admin/parcels/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        setParcel(pData.parcel);
      }
      setUpdateData({ status: "in transit", location: "", description: "", feeAmount: "" });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center">Loading...</div>;
  }

  if (!parcel) {
    return <div className="p-12 text-center text-red-500">Parcel not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Package className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">ParcelFlow</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-primary hover:opacity-80 transition-opacity mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border bg-card p-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Update Parcel Status
          </h1>
          <p className="text-muted-foreground mb-8">
            Tracking ID: <span className="font-mono font-bold">{parcel.tracking_id}</span>
            <br />
            Current Status: <span className="font-bold">{parcel.current_status}</span>
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-800 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleAddUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Status *
              </label>
              <select
                value={updateData.status}
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="pending">Pending</option>
                <option value="payment required">Payment Required</option>
                <option value="in transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="on hold">On Hold</option>
              </select>
            </div>
            
            {updateData.status === "payment required" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fee Amount *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. $150.00"
                  value={updateData.feeAmount}
                  onChange={(e) => setUpdateData({ ...updateData, feeAmount: e.target.value })}
                  className="w-full"
                  required={updateData.status === "payment required"}
                />
                <p className="text-xs text-muted-foreground mt-1">This amount will be shown to the user in the billing email.</p>
              </motion.div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Current Location (optional)
              </label>
              <Input
                type="text"
                placeholder="e.g. Chicago Sort Facility"
                value={updateData.location}
                onChange={(e) => setUpdateData({ ...updateData, location: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description (optional)
              </label>
              <Input
                type="text"
                placeholder="e.g. Package arrived at facility and is being sorted"
                value={updateData.description}
                onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={updating}
                className="bg-primary text-primary-foreground h-10"
              >
                {updating ? "Updating..." : "Add Update"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
