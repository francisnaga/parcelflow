import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { generateParcelEmailTemplate } from "@/lib/email";
import { Parcel } from "@/lib/types";

async function sendEmailWithResend(
  to: string,
  subject: string,
  html: string
) {
  // Since we don't have a Resend API key set up, we'll log the email
  // In production, this would use: const { Resend } = require('resend');
  console.log(`[EMAIL] Sending to: ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] HTML: ${html.substring(0, 100)}...`);
  
  // For demo purposes, return success
  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    const { parcelId } = await request.json();

    if (!parcelId) {
      return NextResponse.json(
        { error: "Missing parcelId" },
        { status: 400 }
      );
    }

    // Fetch parcel from database
    const { data: parcel, error: parcelError } = await supabaseAdmin
      .from("parcels")
      .select("*")
      .eq("id", parcelId)
      .single();

    if (parcelError || !parcel) {
      return NextResponse.json(
        { error: "Parcel not found" },
        { status: 404 }
      );
    }

    // Generate email
    const trackingUrl = `${request.nextUrl.origin}/track?id=${parcel.tracking_id}`;
    const { subject, html } = generateParcelEmailTemplate(parcel, trackingUrl);

    // Send email
    const emailResult = await sendEmailWithResend(
      parcel.receiver_email,
      subject,
      html
    );

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
