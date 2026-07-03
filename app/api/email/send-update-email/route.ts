import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/db";
import { generateUpdateEmailTemplate } from "@/lib/email";

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
        from: process.env.RESEND_FROM_EMAIL || "ParcelFlow Support <support@parcelflow.jointaccount.org>",
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
    console.log("[EMAIL] Successfully sent to:", to);
    return { success: true, id: result.id };
  } catch (error) {
    console.error("[EMAIL] Fetch error:", error);
    return { success: false, error: String(error) };
  }
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
    const { subject, html, text } = generateUpdateEmailTemplate(parcel, update, trackingUrl);

    // Send email
    const emailResult = await sendEmailWithResend(
      parcel.receiver_email,
      subject,
      html,
      text
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
