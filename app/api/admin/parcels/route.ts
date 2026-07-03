import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { generateTrackingId } from "@/lib/utils";
import { createParcelSchema } from "@/lib/schemas";

function verifyAuth(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  return token ? true : false;
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("parcels")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ parcels: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch parcels" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createParcelSchema.parse(body);

    const tracking_id = generateTrackingId();

    const insertData: any = {
      ...validated,
      tracking_id,
      current_status: "pending",
    };

    if (insertData.estimated_delivery_date === "") {
      insertData.estimated_delivery_date = null;
    }

    const { data, error } = await supabaseAdmin
      .from("parcels")
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    // Send email notification to receiver
    // Await the fetch so Vercel doesn't freeze the process before it completes
    try {
      await fetch(`${request.nextUrl.origin}/api/email/send-parcel-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: data.id,
        }),
      });
    } catch (err) {
      console.error("[PARCEL] Failed to send email notification:", err);
    }

    return NextResponse.json({ parcel: data }, { status: 201 });
  } catch (error) {
    console.error("[PARCEL] Error creating parcel:", error);
    return NextResponse.json(
      { error: "Failed to create parcel" },
      { status: 500 }
    );
  }
}