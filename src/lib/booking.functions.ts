import { createServerFn } from "@tanstack/react-start";

import { bookingSchema } from "./booking-schema";

export const submitBooking = createServerFn({ method: "POST" })
  .validator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    // Главный приём — Chatium: запись, письмо наставнику и напоминания.
    // Заявка считается принятой только после его ответа.
    const { sendBookingToChatium } = await import("./lead-intake.server");
    await sendBookingToChatium(data);

    // Копия в Google Sheets — запасной канал: её сбой не отменяет запись.
    try {
      const { appendBookingRow } = await import("./booking.server");
      await appendBookingRow(data);
    } catch (error) {
      console.error("Запись сохранена в Chatium, но не скопирована в Google Sheets", error);
    }

    return { ok: true } as const;
  });
