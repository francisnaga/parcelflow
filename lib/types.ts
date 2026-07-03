export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface Parcel {
  id: string;
  tracking_id: string;
  sender_name: string;
  sender_email?: string;
  receiver_name: string;
  receiver_email: string;
  receiver_phone: string;
  origin: string;
  destination: string;
  estimated_delivery_date?: string;
  current_status: string;
  current_location?: string;
  created_at: string;
  updated_at: string;
}

export interface TrackingUpdate {
  id: string;
  parcel_id: string;
  status: string;
  location?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateParcelInput {
  sender_name: string;
  sender_email?: string;
  receiver_name: string;
  receiver_email: string;
  receiver_phone: string;
  origin: string;
  destination: string;
  estimated_delivery_date?: string;
}

export interface CreateTrackingUpdateInput {
  parcel_id: string;
  status: string;
  location?: string;
  description?: string;
}
