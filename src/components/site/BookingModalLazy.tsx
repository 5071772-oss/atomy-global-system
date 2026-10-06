import { Suspense, lazy } from "react";

const BookingModal = lazy(() =>
  import("./BookingModal").then((module) => ({ default: module.BookingModal })),
);

/**
 * Форма записи грузится только когда её открывают. Внутри неё календарь, поля и
 * проверка данных — это заметная часть веса страницы, а нужна она лишь после
 * нажатия кнопки, поэтому в первую загрузку её не тянем.
 */
export function BookingModalLazy({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!open) return null;

  return (
    <Suspense fallback={null}>
      <BookingModal open={open} onOpenChange={onOpenChange} />
    </Suspense>
  );
}
