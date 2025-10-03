import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { listEvents, createEvent, type CalendarEvent } from "@/lib/google-calendar"

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
    const body = await request.json()
    console.log("[v0] Received event data:", body)

    // Transform flat structure to nested financialData structure
    const event: CalendarEvent = {
      title: body.title,
      date: body.date,
      type: body.type,
    }

    // If it's a financial event, nest the financial data
    if (body.type === "income" || body.type === "expense") {
      event.financialData = {
        type: body.type,
        amount: body.amount || 0,
        currency: body.currency || "MXN",
        category: body.category || "Sin categoría",
        paymentMethod: body.paymentMethod || "Efectivo",
        notes: body.notes,
      }
    }

    console.log("[v0] Transformed event:", event)
    const createdEvent = await createEvent(session.accessToken, event)
    return NextResponse.json({ event: createdEvent })
  } catch (error) {
    console.error("[v0] Error creating event:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
