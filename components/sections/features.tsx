"use client";

import { motion } from "framer-motion";
import { Package, Clock, MapPin, Bell, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Real-Time Tracking",
    description: "Get instant updates on your parcel location and status throughout its journey.",
  },
  {
    icon: Clock,
    title: "Accurate ETAs",
    description: "Precise estimated delivery dates with hourly precision for better planning.",
  },
  {
    icon: MapPin,
    title: "Detailed Route",
    description: "View complete tracking history from origin to final destination.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Receive timely alerts for every important milestone in your parcel's journey.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience instant loading times and seamless parcel searches.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security protecting your tracking data and personal information.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Premium Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for seamless parcel tracking with professional-grade features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <Icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
