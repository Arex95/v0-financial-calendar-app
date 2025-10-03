import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { updateEvent } from "@/lib/google-calendar"
import type { CalendarEvent } from "@/lib/types"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const event: CalendarEvent = await request.json()
    const updatedEvent = await updateEvent(session.accessToken, params.id, event)
    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  ```typescript file="app/api/calendar/events/[id]/route.ts"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { updateEvent, deleteEvent } from "@/lib/google-calendar"
import type { CalendarEvent } from "@/lib/types"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const event: CalendarEvent = await request.json()
    const updatedEvent = await updateEvent(session.accessToken, params.id, event)
    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await deleteEvent(session.accessToken, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
