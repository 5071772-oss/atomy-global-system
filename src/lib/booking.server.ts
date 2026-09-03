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

  // Apps Script web apps respond with a redirect after doPost finishes.
  // Let fetch follow it so we can inspect the JSON result from the deployed
  // script instead of treating every redirect (including script errors) as success.
  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });

  const responseBody = await response.text();
  let result: { ok?: boolean; error?: string } | null = null;
  try {
    result = JSON.parse(responseBody) as { ok?: boolean; error?: string };
  } catch {
    // Apps Script may return an HTML error page when the deployment fails.
  }

  if (!response.ok || result?.ok === false || !result?.ok) {
    let errorMessage = responseBody || "Google Apps Script did not accept the request";
    try {
      const result = JSON.parse(responseBody) as { error?: string; ok?: boolean };
      if (result.error) errorMessage = result.error;
      if (result.ok === false) errorMessage = result.error || errorMessage;
    } catch {
      // Keep the provider response as the useful error message.
    }
    console.error(`Sheets append failed [${response.status}]: ${responseBody}`);
    throw new Error(`Sheets append failed [${response.status}]: ${errorMessage}`);
  }
}
