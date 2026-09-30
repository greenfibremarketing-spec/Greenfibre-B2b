import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies.get("b2b_token")?.value;

    const renewedToken = token || `b2b_jwt_${Date.now()}`;
    const response = NextResponse.json({
      success: true,
      token: renewedToken,
      message: "Token refreshed successfully"
    });

    response.cookies.set("b2b_token", renewedToken, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax"
    });

    return response;
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
