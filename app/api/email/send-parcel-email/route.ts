import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/db";
import { generateParcelEmailTemplate } from "@/lib/email";
import { Parcel } from "@/lib/types";

async function sendEmailWithResend(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error("[EMAIL] RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "ParcelFlow Support <support@parcelflow.jointaccount.org>",
        to,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[EMAIL] Resend API error:", error);
      return { success: false, error };
    }

    const result = await response.json();
    console.log("[EMAIL] Successfully sent to:", to, "Email ID:", result.id);
    return { success: true, id: result.id };
  } catch (error) {
    console.error("[EMAIL] Fetch error:", error);
    return { success: false, error: String(error) };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { parcelId } = await request.json();

    if (!parcelId) {
      console.error("[EMAIL] Missing parcelId in request");
      return NextResponse.json(
        { error: "Missing parcelId" },
        { status: 400 }
      );
    }

    console.log("[EMAIL] Processing email for parcel:", parcelId);

    // Fetch parcel from database
    const supabaseAdmin = getSupabaseAdmin();
    const { data: parcel, error: parcelError } = await supabaseAdmin
      .from("parcels")
      .select("*")
      .eq("id", parcelId)
      .single();

    if (parcelError || !parcel) {
      console.error("[EMAIL] Parcel not found:", parcelId, parcelError);
      return NextResponse.json(
        { error: "Parcel not found" },
        { status: 404 }
      );
    }

    console.log("[EMAIL] Parcel found. Sending to:", parcel.receiver_email);

    // Generate email
    const trackingUrl = `${request.nextUrl.origin}/track?id=${parcel.tracking_id}`;
    const { subject, html, text } = generateParcelEmailTemplate(parcel, trackingUrl);

    // Send email
    const emailResult = await sendEmailWithResend(
      parcel.receiver_email,
      subject,
      html,
      text
    );

    if (!emailResult.success) {
      console.error("[EMAIL] Failed to send email to", parcel.receiver_email, emailResult.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Email sent", emailId: emailResult.id });
  } catch (error) {
    console.error("[EMAIL] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}