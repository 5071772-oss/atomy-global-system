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

  // Google Apps Script returns a redirect after processing doPost. Keep the
  // redirect manual: following it can turn the POST into a GET and discard
  // the JSON body. A 3xx response is the success response for this endpoint.
  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    redirect: "manual",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });

  const responseBody = await response.text();
  const isAppsScriptRedirect =
    response.status >= 300 && response.status < 400 &&
    Boolean(response.headers.get("location"));

  if (!response.ok && !isAppsScriptRedirect) {
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
