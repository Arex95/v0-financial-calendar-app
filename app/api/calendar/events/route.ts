import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { listEvents, createEvent } from "@/lib/google-calendar"
import type { CalendarEvent } from "@/lib/types"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const timeMin = searchParams.get("timeMin")
  const timeMax = searchParams.get("timeMax")

  if (!timeMin || !timeMax) {
    return NextResponse.json({ error: "timeMin and timeMax are required" }, { status: 400 })
  }

  try {
    const events = await listEvents(session.accessToken, timeMin, timeMax)
    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const event: CalendarEvent = await request.json()
    const createdEvent = await createEvent(session.accessToken, event)
    return NextResponse.json({ event: createdEvent })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
