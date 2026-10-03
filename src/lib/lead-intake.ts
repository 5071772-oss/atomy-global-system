import type { BookingInput } from "./booking-schema";

/**
 * Приём записей на звонок в Chatium — там запись живёт целиком: видно контакт,
 * выбранное время и источник, наставнику уходит письмо, а необработанная запись
 * напоминает о себе.
 *
 * Запрос уходит прямо из браузера человека, а не через серверную функцию сайта:
 * серверные вызовы зависят от переменных окружения площадки, а форма записи
 * терять заявки не должна.
 */
const DEFAULT_INTAKE_URL =
  "https://avnhome2012.chatium.ru/uspeshnye-atomiantcy/leads/api/public/create";

/** Версия согласия: политика обработки данных на сайте. */
const CONSENT_VERSION = "site-privacy-v1";

const TIMEOUT_MS = 15000;

export interface IntakeResult {
  id: string | null;
  skipped: boolean;
}

export async function sendBookingToChatium(data: BookingInput): Promise<IntakeResult> {
  const url = import.meta.env["VITE_LEADS_INTAKE_URL"] || DEFAULT_INTAKE_URL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || undefined,
        country: data.country || undefined,
        city: data.city || undefined,
        goal: data.goal || undefined,
        callDate: data.callDate || undefined,
        callTime: data.time,
        pageUrl: data.pageUrl || undefined,
        formName: "Запись на 30-мин. звонок",
        utmSource: data.utmSource || undefined,
        utmMedium: data.utmMedium || undefined,
        utmCampaign: data.utmCampaign || undefined,
        utmContent: data.utmContent || undefined,
        utmTerm: data.utmTerm || undefined,
        referrer: data.referrer || undefined,
        consentVersion: CONSENT_VERSION,
        consentAt: new Date().toISOString(),
        company: data.company || undefined,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new Error(`Приём записей ответил ошибкой ${response.status}`);
  }

  const payload = (await response.json()) as {
    ok?: boolean;
    id?: string;
    skipped?: boolean;
    error?: string;
  };

  if (!payload.ok) {
    throw new Error(payload.error || "Запись не сохранилась");
  }

  return { id: payload.id ?? null, skipped: payload.skipped === true };
}
