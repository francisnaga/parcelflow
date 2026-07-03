"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I track my parcel?",
    answer:
      "Simply enter your tracking ID in the search box on our homepage. You'll get real-time updates on your parcel's location, current status, and estimated delivery date.",
  },
  {
    question: "When will my parcel be delivered?",
    answer:
      "The estimated delivery date is shown on the tracking page. Delivery times vary based on origin, destination, and current shipping volume, but we aim for accuracy within 24 hours.",
  },
  {
    question: "Can I receive notifications?",
    answer:
      "Yes! We automatically send email notifications to the receiver for each major milestone in the parcel's journey, including dispatch, in-transit, and delivery updates.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-leading encryption, ISO 27001 certification, and advanced security protocols to protect all your tracking information and personal data.",
  },
  {
    question: "Do you support international shipping?",
    answer:
      "Yes, ParcelFlow supports tracking for parcels in 150+ countries with real-time updates from major logistics partners worldwide.",
  },
  {
    question: "How can I contact support?",
    answer:
      "We offer 24/7 support through multiple channels. Use the contact form below, email support, or reach out through live chat. Our average response time is under 2 hours.",
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-32 bg-background border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about ParcelFlow tracking.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-start justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors text-left"
              >
                <span className="font-semibold text-foreground pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                    openIdx === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIdx === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="p-4 text-muted-foreground bg-secondary/20 rounded-b-lg border-x border-b border-border">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
