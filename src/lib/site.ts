/** Основные адреса и настройки сайта. */

export const SITE_URL = "https://atomy-global-system.relaxdev.ru";

/**
 * Номер счётчика Яндекс.Метрики.
 * Пока пустая строка — счётчик не подключается, цели не отправляются.
 * Как только счётчик создан, сюда вписывается его номер (только цифры).
 */
export const METRIKA_COUNTER_ID = "";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
