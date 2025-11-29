import { google } from "googleapis"

interface ParsedExpense {
  title: string
  amount: number
  house: string
  category: string
  date: string
}

export async function getGoogleCalendarClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_REDIRECT_URI,
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  return google.calendar({ version: "v3", auth: oauth2Client })
}

export async function getCalendarEvents(accessToken: string, timeMin?: string) {
  try {
    const calendar = await getGoogleCalendarClient(accessToken)

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: timeMin || new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    })

    return response.data.items || []
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    throw error
  }
}

export function parseExpenseFromEvent(event: any): ParsedExpense | null {
  // Check if event title starts with $
  if (!event.summary || !event.summary.startsWith("$")) {
    return null
  }

  try {
    // Parse title format: $amount houseName category
    // Example: "$50 House A Utilities"
    const titleParts = event.summary.substring(1).trim().split(" ")

    if (titleParts.length < 2) {
      return null
    }

    const amount = Number.parseFloat(titleParts[0])
    if (isNaN(amount)) {
      return null
    }

    // Extract house name (usually second part or from description)
    let house = "General"
    let category = "Other"

    if (titleParts.length >= 2) {
      house = titleParts[1]
    }

    if (titleParts.length >= 3) {
      category = titleParts.slice(2).join(" ")
    }

    // Try to extract more info from description
    if (event.description) {
      const descLines = event.description.split("\n")
      for (const line of descLines) {
        if (line.toLowerCase().startsWith("house:")) {
          house = line.substring(6).trim()
        }
        if (line.toLowerCase().startsWith("category:")) {
          category = line.substring(9).trim()
        }
      }
    }

    return {
      title: event.summary,
      amount,
      house,
      category,
      date: event.start.dateTime || event.start.date,
    }
  } catch (error) {
    console.error("Error parsing event:", error)
    return null
  }
}

export function parseExpenseFromEvents(events: any[]): ParsedExpense[] {
  return events
    .map((event) => parseExpenseFromEvent(event))
    .filter((expense): expense is ParsedExpense => expense !== null)
}
