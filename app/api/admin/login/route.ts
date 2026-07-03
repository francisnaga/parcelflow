import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: admin, error } = await supabase
      .from("admins")
      .select("id, email, password_hash")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Plain-text comparison (upgrade to bcrypt for production)
    const passwordMatch = admin.password_hash === password;

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = Buffer.from(`${admin.id}:${admin.email}:${Date.now()}`).toString("base64");
    return NextResponse.json({ token, email: admin.email });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
