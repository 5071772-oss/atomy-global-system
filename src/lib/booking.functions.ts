import { createServerFn } from "@tanstack/react-start";

import { bookingSchema } from "./booking-schema";

/**
 * Копия записи в Google Sheets — запасной канал к приёму в Chatium.
 * Основной приём идёт из браузера (`lead-intake.ts`), поэтому сбой копии
 * запись не отменяет и человеку о нём не сообщается.
 */
export const copyBookingToSheets = createServerFn({ method: "POST" })
  .validator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { appendBookingRow } = await import("./booking.server");
    await appendBookingRow(data);

    return { ok: true } as const;
  });
