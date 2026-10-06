import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useState } from "react";
import { BookingModalLazy as BookingModal } from "@/components/site/BookingModalLazy";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown, Users, GraduationCap, Trophy } from "lucide-react";
import mentor from "@/assets/mentor-galina.webp";
import mentorSmall from "@/assets/mentor-galina-560.webp";

export const Route = createFileRoute("/about/mentor")({
  head: () => ({
    meta: [
      { title: "Галина Николаева — О наставнике" },
      { name: "description", content: "30+ лет в сетевом бизнесе. Экс-золотой директор Oriflame. Ваш проводник в мир Atomy." },
    ],
  }),
  component: MentorPage,
});

function MentorPage() {
  const [booking, setBooking] = useState(false);
  const openBooking = () => setBooking(true);

  return (
    <div className="min-h-screen scroll-smooth bg-[#0b0f19] text-white">
      <Navbar onBook={openBooking} />
      <main className="pt-24 lg:pt-32">
        <section className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="from-primary/25 to-emerald/25 absolute -inset-6 rounded-[3rem] bg-gradient-to-br blur-3xl" />
              <img
                src={mentor}
                srcSet={`${mentorSmall} 560w, ${mentor} 912w`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt="Галина Николаева"
                loading="lazy"
                decoding="async"
                width={912}
                height={1104}
                className="relative w-full rounded-[2rem] border-white/10 border object-cover shadow-2xl"
              />
              <div className="glass absolute -bottom-8 -left-4 lg:-left-12 p-6 rounded-3xl animate-float border-white/5 bg-[#161e2e]/80">
                <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase mb-2">
                  <Crown className="text-primary size-5" /> 30+ лет опыта
                </div>
                <p className="text-muted-foreground text-sm">В индустрии сетевого маркетинга</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">Наставник</p>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-8">
                Галина <span className="text-gradient">Николаева</span>
              </h1>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Я пришла в сетевой бизнес более 30 лет назад, когда индустрия только зарождалась в нашей стране. Это был путь проб, ошибок и грандиозных побед.
                </p>
                <p>
                  В моем послужном списке — статус <strong>Золотого директора Oriflame</strong>, где я выстроила огромную структуру, охватывающую сотни людей в разных городах и странах.
                </p>
                <p>
                  Сегодня моя команда насчитывает порядка <strong>300 человек</strong>. Это не просто цифры — это люди, которые изменили свою жизнь, обрели финансовую свободу и уверенность в завтрашнем дне.
                </p>
                <p>
                  Я не просто даю инструменты — я передаю философию успеха, проверенную десятилетиями практики.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mt-12">
                {[
                  { icon: Users, label: "300+", sub: "Партнеров в структуре" },
                  { icon: GraduationCap, label: "Авторская", sub: "Система дупликации" },
                  { icon: Trophy, label: "30+ лет", sub: "Практического опыта" },
                  { icon: Trophy, label: "Топ-лидер", sub: "В нескольких компаниях" },
                ].map((item, i) => (
                  <div key={i} className="glass p-5 rounded-2xl flex items-center gap-4 border-white/5 bg-[#161e2e]/50">
                    <div className="bg-white/5 p-3 rounded-xl">
                      <item.icon className="text-primary size-6" />
                    </div>
                    <div>
                      <div className="font-bold">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="cta" size="xl" className="mt-12 w-full sm:w-auto" onClick={openBooking}>
                Записаться на консультацию <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter onBook={openBooking} />
      <BookingModal open={booking} onOpenChange={setBooking} />
    </div>
  );
}
