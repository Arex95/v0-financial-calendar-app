import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", request.url))
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url))
    }

    const { access_token } = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const userInfo = await userResponse.json()

    // Redirect back with token in URL (will be handled by client)
    const redirectUrl = new URL("/dashboard", request.url)
    redirectUrl.searchParams.set("token", access_token)
    redirectUrl.searchParams.set("user", JSON.stringify(userInfo))
    redirectUrl.searchParams.set("auth_success", "true")

    const response = NextResponse.redirect(redirectUrl)
    // Store in httpOnly cookie for server-side access
    response.cookies.set("google_access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url))
  }
}
