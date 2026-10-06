import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useState } from "react";
import { BookingModalLazy as BookingModal } from "@/components/site/BookingModalLazy";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about/company")({
  head: () => ({
    meta: [
      { title: "О компании Atomy — Atomy Global Engine" },
      { name: "description", content: "Узнайте больше о философии Atomy: Абсолютное качество по абсолютной цене." },
    ],
  }),
  component: CompanyPage,
});

function CompanyPage() {
  const [booking, setBooking] = useState(false);
  const openBooking = () => setBooking(true);

  return (
    <div className="min-h-screen scroll-smooth bg-[#0b0f19] text-white">
      <Navbar onBook={openBooking} />
      <main className="pt-24 lg:pt-32">
        <section className="relative py-20 lg:py-32">
          <div className="grid-backdrop absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-4xl px-5 lg:px-8 text-center">
            <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6">О компании</p>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-8">
              Atomy: <span className="text-gradient">Глобальный масштаб</span> и корейские традиции
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed mb-12">
              Atomy — это южнокорейская сетевая компания, которая перевернула представление о МЛМ-индустрии, поставив во главу угла интересы потребителя. Мы строим бизнес, основываясь на глубоком уважении к человеку.
            </p>
          </div>

          <div className="mx-auto max-w-7xl px-5 lg:px-8 grid gap-8 lg:grid-cols-2 mt-12">
            <div className="glass p-8 lg:p-12 rounded-3xl border-white/5 bg-[#161e2e]/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ShieldCheck className="text-primary" /> Наша философия
              </h2>
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-primary/20">
                  <h3 className="text-xl font-bold text-primary mb-2">«Абсолютное качество по абсолютной цене»</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Это означает, что компания предлагает продукцию премиального уровня по цене, доступной каждому. Мы не идем на компромиссы в качестве и при этом удерживаем цены на минимально возможном уровне.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-emerald-500/20">
                  <h3 className="text-xl font-bold text-emerald-500 mb-2">«Служение в смирении»</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Один из четырех девизов Atomy. Мы верим, что истинный успех возможен только тогда, когда компания служит своим клиентам и обществу с любовью и скромностью.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-8 rounded-3xl h-full flex flex-col justify-center border-white/5 bg-[#161e2e]/50">
                <h2 className="text-2xl font-bold mb-6">Почему выбирают Atomy?</h2>
                <ul className="space-y-5">
                  {[
                    "Основана в 2009 году и входит в Топ-10 мировых MLM-компаний.",
                    "Собственное производство и научные разработки.",
                    "Отсутствие обязательных закупок и взносов за вход.",
                    "Единый глобальный сервер — ваш бизнес не имеет границ.",
                    "Система, ориентированная на долгосрочный пассивный доход."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <CheckCircle2 className="text-primary size-5 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm lg:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="cta" size="xl" className="mt-12" onClick={openBooking}>
                  Начать путь с Atomy <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter onBook={openBooking} />
      <BookingModal open={booking} onOpenChange={setBooking} />
    </div>
  );
}
