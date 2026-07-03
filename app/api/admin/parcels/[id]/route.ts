import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

function verifyAuth(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  return token ? true : false;
}

interface ParcelParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: ParcelParams
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from("parcels")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({ parcel: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch parcel" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: ParcelParams
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("parcels")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ parcel: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update parcel" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: ParcelParams
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { error } = await supabaseAdmin
      .from("parcels")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete parcel" },
      { status: 500 }
    );
  }
}
