import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { trackingUpdateSchema } from "@/lib/schemas";

function verifyAuth(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  return token ? true : false;
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = trackingUpdateSchema.parse(body);

    // Create tracking update
    const { data: update, error: updateError } = await supabaseAdmin
      .from("tracking_updates")
      .insert([validated])
      .select()
      .single();

    if (updateError) throw updateError;

    // Update parcel current status and location
    const { error: parcelError } = await supabaseAdmin
      .from("parcels")
      .update({
        current_status: validated.status,
        current_location: validated.location,
        updated_at: new Date().toISOString(),
      })
      .eq("id", validated.parcel_id);

    if (parcelError) throw parcelError;

    // Send email notification
    try {
      await fetch(`${request.nextUrl.origin}/api/email/send-update-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: validated.parcel_id,
          updateId: update.id,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ update }, { status: 201 });
  } catch (error) {
    console.error("Error creating tracking update:", error);
    return NextResponse.json(
      { error: "Failed to create tracking update" },
      { status: 500 }
    );
  }
}
