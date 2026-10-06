import { ArrowRight, BadgeCheck, Crown, MessageSquareHeart, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import mentor from "@/assets/mentor-galina.webp";
import mentorSmall from "@/assets/mentor-galina-560.webp";

const FRAMEWORK = [
  {
    icon: Route,
    title: "Сначала диагностика, потом план",
    copy: "Ваша цель, свободные часы и окружение разбираются до первых действий.",
  },
  {
    icon: BadgeCheck,
    title: "Готовые сценарии действий",
    copy: "Скрипты, продуктовые routines и шаблоны касаний, которые уже работают.",
  },
  {
    icon: MessageSquareHeart,
    title: "Еженедельный контроль",
    copy: "Прямой доступ к наставнику, пока первые два партнёра не станут самостоятельными.",
  },
];

export function Mentor({ onBook }: { onBook: () => void }) {
  return (
    <section id="mentor" className="relative py-22 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <div className="relative">
          <div className="from-primary/25 to-emerald/25 absolute -inset-4 rounded-[2rem] bg-gradient-to-br blur-2xl" />
          <img
            src={mentor}
            srcSet={`${mentorSmall} 560w, ${mentor} 912w`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt="Галина Николаева, топ-наставник и лидер сетевого бизнеса"
            loading="lazy"
            decoding="async"
            width={912}
            height={1104}
            className="relative w-full rounded-3xl border object-cover"
          />
          <div className="glass animate-float absolute -bottom-6 -right-2 rounded-2xl p-4 lg:-right-8">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <Crown className="text-primary size-4" /> 30+ лет
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Экс-золотой директор Oriflame
            </p>
          </div>
        </div>

        <div>
          <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
            Наставник
          </p>
          <h2 className="mt-4 text-3xl font-extrabold lg:text-4xl">
            Галина Николаева — <span className="text-gradient">короткий путь</span> — это
            человек, который уже прошёл его
          </h2>
          <p className="text-muted-foreground mt-5 text-sm leading-relaxed lg:text-base">
            Три десятилетия в сетевом бизнесе, статус золотого директора Oriflame и
            сотни обученных партнёров в разных странах. Я не продаю мотивацию —
            я выстраиваю повторяемый процесс и держит вас в нём.
          </p>

          <div className="mt-8 grid gap-4">
            {FRAMEWORK.map((f) => (
              <div key={f.title} className="glass flex gap-4 rounded-2xl p-5">
                <span className="bg-secondary text-primary grid size-10 shrink-0 place-items-center rounded-xl">
                  <f.icon className="size-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold">{f.title}</div>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {f.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button variant="cta" size="xl" className="flex-1" onClick={onBook}>
              Поговорить с Галиной — 30 минут <ArrowRight />
            </Button>
            <Link to="/about/mentor" className="flex-1">
              <Button variant="outline" size="xl" className="w-full border-primary/20 hover:bg-primary/10">
                Подробнее о Галине
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
