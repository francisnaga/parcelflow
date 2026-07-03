"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Package } from "lucide-react";

export default function CreateParcelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_email: "",
    receiver_name: "",
    receiver_email: "",
    receiver_phone: "",
    origin: "",
    destination: "",
    estimated_delivery_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/parcels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create parcel");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

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
            Create New Parcel
          </h1>
          <p className="text-muted-foreground mb-8">
            Fill in the details to create a new parcel and send tracking information to the receiver.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sender Name *
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.sender_name}
                  onChange={(e) =>
                    setFormData({ ...formData, sender_name: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sender Email
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.sender_email}
                  onChange={(e) =>
                    setFormData({ ...formData, sender_email: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Receiver Name *
                </label>
                <Input
                  type="text"
                  placeholder="Jane Smith"
                  value={formData.receiver_name}
                  onChange={(e) =>
                    setFormData({ ...formData, receiver_name: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Receiver Email *
                </label>
                <Input
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.receiver_email}
                  onChange={(e) =>
                    setFormData({ ...formData, receiver_email: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Receiver Phone *
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.receiver_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, receiver_phone: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Est. Delivery Date
                </label>
                <Input
                  type="datetime-local"
                  value={formData.estimated_delivery_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimated_delivery_date: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Origin *
                </label>
                <Input
                  type="text"
                  placeholder="San Francisco, CA"
                  value={formData.origin}
                  onChange={(e) =>
                    setFormData({ ...formData, origin: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Destination *
                </label>
                <Input
                  type="text"
                  placeholder="New York, NY"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground h-10"
              >
                {loading ? "Creating..." : "Create Parcel"}
              </Button>
              <Link href="/admin/dashboard">
                <Button variant="outline" className="h-10">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
