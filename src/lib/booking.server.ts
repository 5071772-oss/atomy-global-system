import type { BookingInput } from "./booking-schema";

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyOpH7s7u1mZBnfbF55CVTP7Bld4uLrc2mZfJdEan-RFCgwya8ZsAgc7__6Ec77RD4BhQ/exec";

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
    // Match the sheet columns exactly: C = Email, D = Телефон.
    email: data.email,
    phone: data.phone,
    country: data.country,
    city: data.city,
    // Provide the date/time aliases used by the deployed Apps Script.
    date: data.day,
    day: data.day,
    callDate: data.day,
    consultationDate: data.day,
    time: data.time,
    callTime: data.time,
    consultationTime: data.time,
    goal: data.goal,
    personalDataConsent: data.personalDataConsent,
  };

  // Apps Script returns a 302 after doPost. Following it can turn the POST
  // into a GET and lose the request body.
  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    redirect: "manual",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.text();
  let result: { ok?: boolean; error?: string } = {};
  try {
    result = JSON.parse(responseBody) as typeof result;
  } catch {
    // Apps Script normally responds with a redirect after processing doPost.
  }

  const processedByAppsScript = response.status >= 300 && response.status < 400;
  if ((!response.ok && !processedByAppsScript) || result.ok === false) {
    console.error(`Sheets append failed [${response.status}]: ${responseBody}`);
    throw new Error(`Sheets append failed [${response.status}]: ${result.error || responseBody}`);
  }
}
