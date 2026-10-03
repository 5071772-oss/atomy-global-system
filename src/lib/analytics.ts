/**
 * Аналитика сайта: Яндекс.Метрика.
 *
 * Номер счётчика задаётся в `src/lib/site.ts`. Пока он пустой, счётчик не
 * подключается, а цели молча ничего не делают — код можно держать в проекте
 * до создания счётчика.
 */
import { METRIKA_COUNTER_ID } from "./site";

export const GOALS = {
  /** Открыта форма записи на звонок */
  bookingOpen: "booking_open",
  /** Запись успешно отправлена */
  bookingSubmit: "booking_submit",
} as const;

export type GoalName = (typeof GOALS)[keyof typeof GOALS];

type YandexMetrika = (counterId: number, action: string, goal?: string) => void;

declare global {
  interface Window {
    ym?: YandexMetrika;
  }
}

export function reachGoal(goal: GoalName): void {
  if (typeof window === "undefined" || !METRIKA_COUNTER_ID) return;
  window.ym?.(Number(METRIKA_COUNTER_ID), "reachGoal", goal);
}
