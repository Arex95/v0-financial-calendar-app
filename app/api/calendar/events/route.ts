import { google } from "googleapis"

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`,
)

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accessToken = authHeader.substring(7)
    oauth2Client.setCredentials({ access_token: accessToken })

    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    const now = new Date()
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: threeMonthsAgo.toISOString(),
      maxResults: 250,
      singleEvents: true,
      orderBy: "startTime",
    })

    return Response.json(response.data.items || [])
  } catch (error) {
    console.error("Calendar API error:", error)
    return Response.json({ error: "Failed to fetch calendar" }, { status: 500 })
  }
}
