"use client"

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
export const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
]

export function getAuthUrl() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID || "",
    redirect_uri: typeof window !== "undefined" ? window.location.origin + "/api/auth/callback" : "",
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("google-access-token")
}

export function saveAccessToken(token: string) {
  localStorage.setItem("google-access-token", token)
}

export function isAuthenticated(): boolean {
  return !!getAccessToken()
}

export function logout() {
  localStorage.removeItem("google-access-token")
  localStorage.removeItem("google-user-info")
  localStorage.removeItem("dashboard-data")
  localStorage.removeItem("custom-houses")
}
