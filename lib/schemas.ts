import { z } from "zod";

export const createParcelSchema = z.object({
  sender_name: z.string().min(2, "Sender name must be at least 2 characters"),
  sender_email: z.string().email().optional().or(z.literal("")),
  receiver_name: z.string().min(2, "Receiver name must be at least 2 characters"),
  receiver_email: z.string().email("Invalid email address"),
  receiver_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
  origin: z.string().min(2, "Origin must be at least 2 characters"),
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  estimated_delivery_date: z.string().datetime().optional().or(z.literal("")),
});

export const trackingUpdateSchema = z.object({
  parcel_id: z.string().uuid("Invalid parcel ID"),
  status: z.enum(["pending", "in transit", "delivered", "failed", "on hold", "payment required"]),
  location: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const searchParcelSchema = z.object({
  tracking_id: z.string().min(1, "Tracking ID is required"),
});

export type CreateParcelInput = z.infer<typeof createParcelSchema>;
export type TrackingUpdateInput = z.infer<typeof trackingUpdateSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type SearchParcelInput = z.infer<typeof searchParcelSchema>;
