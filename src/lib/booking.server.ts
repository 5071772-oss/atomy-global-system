import { google } from "googleapis";
import type { BookingInput } from "./booking-schema";

const SPREADSHEET_ID = "1LVJu2ukwSLkj7T1MrSuma-TbW0RqcU6hrv_DQWYiDTU";
const SHEET_NAME = "Leads";
const SERVICE_ACCOUNT_EMAIL = "atomy-leads@atomy-leads-integration.iam.gserviceaccount.com";

function getGoogleAuth() {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!privateKey) {
    throw new Error("Google Service Account private key is not configured");
  }

  return new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/**
 * Запасная копия записи в Google Sheets. Основной приём — Chatium
 * (`lead-intake.server.ts`): сбой копии запись не отменяет.
 */
export async function appendBookingRow(data: BookingInput): Promise<void> {
  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const submittedAt = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  const row = [
    submittedAt,
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.country || "",
    data.city,
    data.day,
    data.time,
    data.goal,
    data.personalDataConsent ? "Да" : "Нет",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:K`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
