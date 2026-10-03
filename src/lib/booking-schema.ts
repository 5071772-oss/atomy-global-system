import { z } from "zod";

export const bookingSchema = z.object({
  firstName: z.string().trim().min(1, "Укажите имя").max(100),
  lastName: z.string().trim().min(1, "Укажите фамилию").max(100),
  country: z.string().trim().max(100).default(""),
  city: z.string().trim().max(100).default(""),
  phone: z.string().trim().min(5, "Укажите телефон").max(30),
  email: z.string().trim().email("Некорректный email").max(255).or(z.literal("")).default(""),
  day: z.string().trim().min(1).max(100),
  time: z.string().trim().min(1).max(20),
  goal: z.string().trim().max(600).default(""),
  personalDataConsent: z.literal(true, {
    errorMap: () => ({ message: "Необходимо согласиться с обработкой персональных данных" }),
  }),

  /** Дата звонка машинным видом: 2026-10-05. Нужна приёму записей, «day» — для письма и таблицы. */
  callDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Дата звонка в виде 2026-10-05")
    .or(z.literal(""))
    .default(""),

  /** Откуда пришла запись: страница, источник перехода и utm-метки. */
  pageUrl: z.string().trim().max(2000).default(""),
  referrer: z.string().trim().max(2000).default(""),
  utmSource: z.string().trim().max(200).default(""),
  utmMedium: z.string().trim().max(200).default(""),
  utmCampaign: z.string().trim().max(200).default(""),
  utmContent: z.string().trim().max(200).default(""),
  utmTerm: z.string().trim().max(200).default(""),

  /** Ловушка для роботов: поле скрыто от человека и всегда пустое. */
  company: z.string().trim().max(200).default(""),
});

export type BookingInput = z.infer<typeof bookingSchema>;
