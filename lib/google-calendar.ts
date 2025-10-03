import { google } from "googleapis"
import type { CalendarEvent } from "./types"

export interface FinancialEventData {
  type: "income" | "expense"
  amount: number
  currency: string
  category: string
  paymentMethod: string
  notes?: string
}

export function formatFinancialEvent(event: CalendarEvent): { summary: string; description: string } {
  if (event.type === "normal") {
    return {
      summary: event.title,
      description: event.description || "",
    }
  }

  // Use flat structure
  if (!event.amount) {
    throw new Error("Amount is required for financial events")
  }

  // Title format: $[AMOUNT] - [TITLE]
  const summary = `$${event.amount} - ${event.title}`

  // Description format: Structured fields
  const description = [
    `Tipo: ${event.type === "income" ? "Ingreso" : "Gasto"}`,
    `Monto: ${event.amount}`,
    `Moneda: MXN`,
    `Categoría: ${event.category || "Sin categoría"}`,
    `Método de Pago: ${event.paymentMethod || "Efectivo"}`,
  ]
    .filter(Boolean)
    .join("\n")

  return { summary, description }
}

export function parseFinancialEvent(googleEvent: any): CalendarEvent {
  const summary = googleEvent.summary || ""
  const description = googleEvent.description || ""

  // Check if it's a financial event (starts with $)
  const isFinancial = summary.startsWith("$")

  if (!isFinancial) {
    return {
      id: googleEvent.id,
      title: summary,
      date: googleEvent.start.date || googleEvent.start.dateTime?.split("T")[0],
      type: "normal",
      description: description || undefined,
    }
  }

  // Parse financial event
  const titleMatch = summary.match(/^\$(\d+(?:\.\d+)?)\s*-\s*(.+)$/)
  const amount = titleMatch ? Number.parseFloat(titleMatch[1]) : 0
  const title = titleMatch ? titleMatch[2] : summary

  // Parse description fields
  const fields: Record<string, string> = {}
  description.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":")
    if (key && valueParts.length > 0) {
      fields[key.trim()] = valueParts.join(":").trim()
    }
  })

  const type = fields["Tipo"] === "Ingreso" ? "income" : "expense"

  // Return flat structure matching lib/types.ts
  return {
    id: googleEvent.id,
    title,
    date: googleEvent.start.date || googleEvent.start.dateTime?.split("T")[0],
    type,
    amount: Number.parseFloat(fields["Monto"]) || amount,
    category: fields["Categoría"] || "Sin categoría",
    paymentMethod: fields["Método de Pago"] || "Efectivo",
  }
}

export async function getCalendarClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)

  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  return google.calendar({ version: "v3", auth: oauth2Client })
}

export async function listEvents(accessToken: string, timeMin: string, timeMax: string) {
  const calendar = await getCalendarClient(accessToken)

  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
  })

  return (response.data.items || []).map(parseFinancialEvent)
}

export async function createEvent(accessToken: string, event: CalendarEvent) {
  const calendar = await getCalendarClient(accessToken)
  const { summary, description } = formatFinancialEvent(event)

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary,
      description,
      start: {
        date: event.date,
      },
      end: {
        date: event.date,
      },
    },
  })

  return parseFinancialEvent(response.data)
}

export async function updateEvent(accessToken: string, eventId: string, event: CalendarEvent) {
  const calendar = await getCalendarClient(accessToken)
  const { summary, description } = formatFinancialEvent(event)

  const response = await calendar.events.update({
    calendarId: "primary",
    eventId,
    requestBody: {
      summary,
      description,
      start: {
        date: event.date,
      },
      end: {
        date: event.date,
      },
    },
  })

  return parseFinancialEvent(response.data)
}

export async function deleteEvent(accessToken: string, eventId: string) {
  const calendar = await getCalendarClient(accessToken)

  await calendar.events.delete({
    calendarId: "primary",
    eventId,
  })
}
