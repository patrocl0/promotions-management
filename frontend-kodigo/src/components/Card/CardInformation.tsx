import type { Promotion } from "@/interface/Promotion";
import { BadgePercent, CalendarClock, CircleCheck, List } from "lucide-react";

interface CardInformationProps {
  promotions: Promotion[];
}

export const CardInformation = ({ promotions }: CardInformationProps) => {
  const total = promotions.length;

  const scheduled = promotions.filter(
    (promotion) => promotion.status === "programada",
  ).length;

  const active = promotions.filter(
    (promotion) => promotion.status === "activa",
  ).length;

  const today = new Date();

  const validToday = promotions.filter((promotion) => {
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);

    return start <= today && end >= today;
  }).length;

  const cards = [
    {
      title: "Total promociones",
      value: total,
      icon: List,
    },
    {
      title: "Programadas",
      value: scheduled,
      icon: CalendarClock,
    },
    {
      title: "Activas",
      value: active,
      icon: CircleCheck,
    },
    {
      title: "Vigentes hoy",
      value: validToday,
      icon: BadgePercent,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full mt-6 ">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="border rounded-md p-4 flex justify-between bg-[#171717]"
          >
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>

              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>

            <Icon className="size-6 text-muted-foreground" />
          </div>
        );
      })}
    </div>
  );
};
