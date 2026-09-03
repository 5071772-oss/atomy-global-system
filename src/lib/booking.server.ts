import type { BookingInput } from "./booking-schema";

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby5GfZOg4KS-gh_dvx2ImyGM_tBVEW_YY-M8Wc-oNwmD6JnR5R2AIFytl_JCfvb1DTSig/exec";

export async function appendBookingRow(data: BookingInput): Promise<void> {
  const submittedAt = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  const timestamp = new Date().toISOString();
  const payload = {
    // These aliases match the Google Apps Script column mapping:
    // A timestamp, B name, C email, D phone, E country, F call date, G time.
    timestamp,
    submittedAt,
    name: `${data.firstName} ${data.lastName}`.trim(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    country: data.country,
    city: data.city,
    date: data.day,
    day: data.day,
    time: data.time,
    goal: data.goal,
    personalDataConsent: data.personalDataConsent ? "Да" : "Нет",
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
