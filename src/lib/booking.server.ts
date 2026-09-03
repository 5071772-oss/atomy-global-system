import type { BookingInput } from "./booking-schema";

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby5GfZOg4KS-gh_dvx2ImyGM_tBVEW_YY-M8Wc-oNwmD6JnR5R2AIFytl_JCfvb1DTSig/exec";

export async function appendBookingRow(data: BookingInput): Promise<void> {
  const submittedAt = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  const row = [
    submittedAt,
    data.firstName,
    data.lastName,
    data.country,
    data.city,
    data.phone,
    data.email,
    data.day,
    data.time,
    data.goal,
    data.personalDataConsent ? "Да" : "Нет",
    new Date().toISOString(),
  ];

  const payload = {
    // Keep the named fields because the Apps Script reads the request as an object.
    submittedAt,
    firstName: data.firstName,
    lastName: data.lastName,
    country: data.country,
    city: data.city,
    phone: data.phone,
    email: data.email,
    day: data.day,
    time: data.time,
    goal: data.goal,
    personalDataConsent: data.personalDataConsent,
    timestamp: new Date().toISOString(),
    // Keep the row as a fallback for scripts that append a supplied array.
    values: [row],
  };

  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Sheets append failed [${response.status}]: ${errorBody}`);
    throw new Error(`Sheets append failed [${response.status}]: ${errorBody}`);
  }
}
