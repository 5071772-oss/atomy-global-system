import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { submitBooking } from "@/lib/booking.functions";

const SLOTS = ["09:00", "11:30", "14:00", "16:30", "19:00", "20:30"];

export function BookingModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<string>("");
  const [sending, setSending] = useState(false);
  const send = useServerFn(submitBooking);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const firstName = get("firstName");
    const lastName = get("lastName");
    const phone = get("phone");
    const personalDataConsent = data.get("personalDataConsent") === "on";
    if (!firstName || !lastName || !phone || !date || !slot) {
      toast.error("Укажите имя, фамилию, дату и время консультации.");
      return;
    }
    if (!personalDataConsent) {
      toast.error("Подтвердите согласие на обработку персональных данных.");
      return;
    }
    setSending(true);
    try {
      await send({
        data: {
          firstName,
          lastName,
          country: get("country"),
          city: get("city"),
          phone,
          email: get("email"),
          // Keep the value sent to the server machine-readable for Sheets.
          day: format(date, "yyyy-MM-dd"),
          time: slot,
          goal: get("goal"),
          personalDataConsent,
        },
      });
      onOpenChange(false);
      toast.success(
        `Заявка отправлена — ${format(date, "EEE, d MMM", { locale: ru })}, ${slot}. Команда Галины подтвердит время.`,
      );
    } catch {
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">
            Запись на 30-минутный стратегический звонок
          </DialogTitle>
          <DialogDescription>
            Личный видеозвонок с Галиной Николаевой. Выберите удобные дату и время.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-2 grid gap-6 md:grid-cols-2">
          <div>
            <Label className="text-xs font-bold tracking-wider uppercase">
              Выберите дату <span className="text-destructive">*</span>
            </Label>
            <div className="bg-surface/70 mt-3 rounded-2xl border p-1">
              <Calendar
                mode="single"
                locale={ru}
                selected={date}
                onSelect={setDate}
                disabled={{ before: new Date() }}
                className={cn("pointer-events-auto p-3")}
              />
            </div>
            <div className="mt-4">
              <Label className="text-xs font-bold tracking-wider uppercase">Свободное время</Label>
              <div className="mt-3 grid grid-cols-3 gap-2" aria-required="true">
                <span className="sr-only">Выбор времени обязателен</span>
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-colors",
                      slot === s
                        ? "border-primary text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Clock className="size-3" /> {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid content-start gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Имя</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  maxLength={100}
                  placeholder="Анна"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Фамилия</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  maxLength={100}
                  placeholder="Смирнова"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="country">Страна</Label>
                <Input id="country" name="country" maxLength={100} placeholder="Россия" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Город</Label>
                <Input id="city" name="city" maxLength={100} placeholder="Москва" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                maxLength={30}
                placeholder="+7 900 123-45-67"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                maxLength={255}
                placeholder="anna@company.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="goal">Ваша цель по доходу</Label>
              <Textarea
                id="goal"
                name="goal"
                maxLength={600}
                rows={4}
                placeholder="Хочу 90 000 ₽ остаточного дохода за 6 месяцев, не оставляя работу."
              />
            </div>

            <label className="text-muted-foreground flex items-start gap-3 text-xs leading-relaxed">
              <input
                type="checkbox"
                name="personalDataConsent"
                required
                className="accent-primary mt-1 size-4 shrink-0"
              />
              <span>
                Я согласен(а) на обработку персональных данных и принимаю условия{" "}
                <Link to="/privacy" className="text-primary underline underline-offset-2">
                  политики обработки данных
                </Link>
                .
              </span>
            </label>

            <div className="bg-surface-2/60 flex items-center gap-3 rounded-xl border p-3">
              <CalendarCheck className="text-emerald size-5 shrink-0" />
              <p className="text-muted-foreground text-xs">
                {date ? format(date, "EEEE, d MMMM yyyy", { locale: ru }) : "Дата не выбрана"} ·{" "}
                {slot} · видеозвонок 30 минут
              </p>
            </div>

            <Button type="submit" variant="cta" size="xl" disabled={sending}>
              {sending ? <Loader2 className="animate-spin" /> : null}
              Подтвердить запись
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
