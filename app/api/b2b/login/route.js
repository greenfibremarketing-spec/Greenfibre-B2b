import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const rawEmail = (body.email || "").trim().toLowerCase();
    const email = rawEmail.replace(/,([a-z0-9-]+)/gi, ".$1").replace(/,/g, ".");
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const backendBase = process.env.B2B_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500";
    const endpoints = [
      `${backendBase}/api/b2b/login`,
      `${backendBase}/api/users/login`,
      `${backendBase}/api/b2b/auth/login`,
      `${backendBase}/api/auth/login`
    ];

    let backendRes = null;
    let backendData = null;
    let connectionError = null;

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, rememberMe: body.rememberMe ?? true }),
          signal: AbortSignal.timeout(3000)
        });

        if (res.status !== 404) {
          backendRes = res;
          backendData = await res.json().catch(() => ({}));
          break;
        }
      } catch (err) {
        connectionError = err;
      }
    }

    // If backend was reached and responded
    if (backendRes) {
      if (backendRes.ok && backendData.success !== false) {
        const response = NextResponse.json({
          success: true,
          message: backendData.message || "Sign in successful",
          token: backendData.token,
          user: backendData.user || backendData.data
        }, { status: 200 });

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

      // Backend returned error (401 invalid password / 404 user not found / 400 bad request)
      return NextResponse.json(
        {
          success: false,
          message: backendData.message || backendData.error || "Invalid email or password"
        },
        { status: backendRes.status || 401 }
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
      { success: false, message: err.message || "Authentication error" },
      { status: 500 }
    );
  }
}
