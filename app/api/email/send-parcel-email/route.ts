import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/db";
import { generateParcelEmailTemplate } from "@/lib/email";
import { Parcel } from "@/lib/types";

async function sendEmailWithResend(
  to: string,
  subject: string,
  html: string
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
        from: "ParcelFlow <noreply@parcelflow.com>",
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[EMAIL] Resend API error:", error);
      return { success: false, error };
    }

    const result = await response.json();
    console.log("[EMAIL] Successfully sent to:", to);
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
      return NextResponse.json(
        { error: "Missing parcelId" },
        { status: 400 }
      );
    }

    // Fetch parcel from database
    const supabaseAdmin = getSupabaseAdmin();
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
