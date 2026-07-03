import { NextRequest, NextResponse } from "next/server";

const DEMO_CREDENTIALS = {
  email: "admin@parcelflow.com",
  password: "password123",
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (
      email === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
      return NextResponse.json({ token, email });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
