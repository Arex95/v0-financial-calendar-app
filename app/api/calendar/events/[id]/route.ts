import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { updateEvent, deleteEvent, type CalendarEvent } from "@/lib/google-calendar"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const event: CalendarEvent = await request.json()
    const updatedEvent = await updateEvent(session.accessToken, params.id, event)
    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error("[v0] Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await deleteEvent(session.accessToken, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
