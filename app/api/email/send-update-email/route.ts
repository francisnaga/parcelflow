import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { generateUpdateEmailTemplate } from "@/lib/email";

async function sendEmailWithResend(
  to: string,
  subject: string,
  html: string
) {
  // Since we don't have a Resend API key set up, we'll log the email
  console.log(`[EMAIL] Sending to: ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] HTML: ${html.substring(0, 100)}...`);
  
  // For demo purposes, return success
  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    const { parcelId, updateId } = await request.json();

    if (!parcelId || !updateId) {
      return NextResponse.json(
        { error: "Missing parcelId or updateId" },
        { status: 400 }
      );
    }

    // Fetch parcel
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

    // Fetch tracking update
    const { data: update, error: updateError } = await supabaseAdmin
      .from("tracking_updates")
      .select("*")
      .eq("id", updateId)
      .single();

    if (updateError || !update) {
      return NextResponse.json(
        { error: "Update not found" },
        { status: 404 }
      );
    }

    // Generate email
    const trackingUrl = `${request.nextUrl.origin}/track?id=${parcel.tracking_id}`;
    const { subject, html } = generateUpdateEmailTemplate(parcel, update, trackingUrl);

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
