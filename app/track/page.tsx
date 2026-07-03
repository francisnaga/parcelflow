"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabaseClient } from "@/lib/db";
import { Parcel, TrackingUpdate } from "@/lib/types";
import { formatDateTime, getStatusIcon, getStatusColor } from "@/lib/utils";

function TrackingContent() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState<string>(
    searchParams?.get("id") || ""
  );
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [updates, setUpdates] = useState<TrackingUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent, searchValue?: string) => {
    e.preventDefault();
    const idToSearch = searchValue || trackingId;

    if (!idToSearch.trim()) {
      setError("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    setError(null);
    setParcel(null);
    setUpdates([]);

    try {
      const { data: parcelData, error: parcelError } = await supabaseClient
        .from("parcels")
        .select("*")
        .eq("tracking_id", idToSearch.toUpperCase())
        .single();

      if (parcelError || !parcelData) {
        setError("Tracking ID not found. Please check and try again.");
        setSearched(true);
        setLoading(false);
        return;
      }

      const { data: updatesData, error: updatesError } = await supabaseClient
        .from("tracking_updates")
        .select("*")
        .eq("parcel_id", parcelData.id)
        .order("created_at", { ascending: false });

      setParcel(parcelData);
      setUpdates(updatesData || []);
      setSearched(true);
    } catch (err) {
      setError("Failed to fetch tracking information. Please try again.");
      console.error("Tracking error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingId && !parcel && !searched) {
      const form = new FormData();
      const event = new FormEvent("submit", form);
      handleSearch(event as any);
    }
  }, []);

  const copyToClipboard = () => {
    if (parcel?.tracking_id) {
      navigator.clipboard.writeText(parcel.tracking_id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 md:py-20 bg-gradient-to-b from-background via-background to-secondary/20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:opacity-80 transition-opacity mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Track Your Parcel
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Enter your tracking ID to get real-time updates on your shipment.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Enter tracking ID (e.g., PF-XXXXX-XXX)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 h-12"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-12 bg-primary text-primary-foreground hover:opacity-90"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>
      </section>

      {error && !parcel && (
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-lg border border-border bg-card text-center"
            >
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tracking ID Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                {error}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => setSearched(false)}>
                  Try Another Search
                </Button>
                <Link href="/">
                  <Button variant="ghost">Return Home</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {parcel && (
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Parcel Summary */}
              <div className="p-8 rounded-lg border border-border bg-card">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-3xl font-bold text-foreground">
                        {parcel.tracking_id}
                      </h2>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-secondary rounded transition-colors"
                        title="Copy tracking ID"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {formatDateTime(parcel.updated_at)}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      parcel.current_status
                    )}`}
                  >
                    {parcel.current_status.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">From</p>
                    <p className="text-lg font-semibold text-foreground">
                      {parcel.origin}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">To</p>
                    <p className="text-lg font-semibold text-foreground">
                      {parcel.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Sender
                    </p>
                    <p className="text-foreground">{parcel.sender_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Receiver
                    </p>
                    <p className="text-foreground">{parcel.receiver_name}</p>
                  </div>
                  {parcel.current_location && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Current Location
                      </p>
                      <p className="text-foreground">
                        {parcel.current_location}
                      </p>
                    </div>
                  )}
                  {parcel.estimated_delivery_date && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Est. Delivery
                      </p>
                      <p className="text-foreground">
                        {formatDateTime(parcel.estimated_delivery_date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              {updates.length > 0 && (
                <div className="p-8 rounded-lg border border-border bg-card">
                  <h3 className="text-2xl font-bold text-foreground mb-8">
                    Tracking Timeline
                  </h3>
                  <div className="space-y-0">
                    {updates.map((update, idx) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-6 relative"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                              idx === 0
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-foreground"
                            }`}
                          >
                            {getStatusIcon(update.status)}
                          </div>
                          {idx < updates.length - 1 && (
                            <div className="w-0.5 h-16 bg-border my-2" />
                          )}
                        </div>
                        <div className="pb-8 pt-1">
                          <p className="text-lg font-semibold text-foreground">
                            {update.status}
                          </p>
                          {update.location && (
                            <p className="text-muted-foreground">
                              📍 {update.location}
                            </p>
                          )}
                          {update.description && (
                            <p className="text-muted-foreground">
                              {update.description}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-2">
                            {formatDateTime(update.created_at)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
