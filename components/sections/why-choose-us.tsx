"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const benefits = [
  "99.9% uptime reliability guaranteed",
  "Trusted by thousands of logistics partners",
  "24/7 professional customer support",
  "ISO 27001 certified security standards",
  "Real-time data synchronization",
  "Advanced fraud detection systems",
];

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-32 bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Why Choose ParcelFlow?
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-lg text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { number: "50K+", label: "Parcels Tracked" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
              { number: "150+", label: "Countries" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-border bg-card text-center"
              >
                <p className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
