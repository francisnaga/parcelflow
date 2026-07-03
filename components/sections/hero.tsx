"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function HeroSection() {
  const [tracking, setTracking] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (tracking.trim()) {
      window.location.href = `/track?id=${encodeURIComponent(tracking)}`;
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Track Your Parcels{" "}
                <span className="text-primary">in Real-Time</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                ParcelFlow provides premium parcel tracking with real-time updates,
                professional insights, and complete transparency from origin to destination.
              </p>
            </div>

            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2 max-w-lg">
              <Input
                type="text"
                placeholder="Enter tracking ID (e.g., PF-XXXXX-XXX)"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                className="flex-1 h-12 bg-card border border-border rounded-lg"
              />
              <Button
                type="submit"
                className="h-12 bg-primary text-primary-foreground hover:opacity-90"
              >
                Track
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/track">
                <Button variant="outline" className="w-full sm:w-auto border-border">
                  Detailed Tracking
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="ghost" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-96 md:h-full min-h-[400px]"
          >
            <Image
              src="/images/parcelflow-cargo-plane.png"
              alt="ParcelFlow Cargo Aircraft"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
