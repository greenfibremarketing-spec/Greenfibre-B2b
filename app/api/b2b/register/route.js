import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const fullName = (body.fullName || body.full_name || "").trim();
    const companyName = (body.companyName || "").trim();
    const rawEmail = (body.email || "").trim().toLowerCase();
    const email = rawEmail.replace(/,([a-z0-9-]+)/gi, ".$1").replace(/,/g, ".");
    const phone = (body.phone || "").trim();
    const businessType = body.businessType || "Corporate Gifting & HR";
    const gstin = (body.gstin || "").trim().toUpperCase();
    const password = body.password || "";

    if (!fullName || !companyName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Full name, company name, email and password are required" },
        { status: 400 }
      );
    }

    const payload = {
      fullName,
      full_name: fullName,
      companyName,
      email,
      phone,
      businessType,
      gstin,
      password,
      rememberMe: Boolean(body.rememberMe ?? true)
    };

    const backendBase = process.env.B2B_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500";
    const endpoints = [
      `${backendBase}/api/b2b/register`,
      `${backendBase}/api/users/register`,
      `${backendBase}/api/b2b/auth/register`,
      `${backendBase}/api/auth/register`
    ];

    let backendRes = null;
    let backendData = null;

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(3000)
        });

        if (res.status !== 404) {
          backendRes = res;
          backendData = await res.json().catch(() => ({}));
          break;
        }
      } catch (err) {
        // Continue to next endpoint if failed
      }
    }

    if (backendRes) {
      if (backendRes.ok && backendData.success !== false) {
        const response = NextResponse.json({
          success: true,
          message: backendData.message || "Enterprise account registered successfully",
          token: backendData.token,
          user: backendData.user || backendData.data
        }, { status: 201 });

        if (backendData.token) {
          response.cookies.set("b2b_token", backendData.token, {
            path: "/",
            maxAge: 30 * 24 * 60 * 60,
            sameSite: "lax",
            httpOnly: false
          });
        }
        return response;
      }

      // Backend returned real database error (e.g. 409 user already exists, 400 validation)
      return NextResponse.json(
        {
          success: false,
          message: backendData.message || backendData.error || "Registration failed"
        },
        { status: backendRes.status || 400 }
      );
    }

    // Backend server on port 5500 is NOT running
    return NextResponse.json(
      {
        success: false,
        message: "Backend server is offline. Please start your Express backend on port 5500."
      },
      { status: 503 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Registration error" },
      { status: 500 }
    );
  }
}
