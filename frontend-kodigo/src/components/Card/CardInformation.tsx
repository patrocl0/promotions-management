import type { Promotion } from "@/interface/Promotion";
import {
  BadgePercent,
  CalendarClock,
  CircleCheck,
  List,
  TrendingUp,
} from "lucide-react";

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
      detail: "En tu catálogo",
    },
    {
      title: "Programadas",
      value: scheduled,
      icon: CalendarClock,
      detail: "Listas para iniciar",
    },
    {
      title: "Activas",
      value: active,
      icon: CircleCheck,
      detail: "En circulación",
    },
    {
      title: "Vigentes hoy",
      value: validToday,
      icon: BadgePercent,
      detail: "Según sus fechas",
    },
  ];

  return (
    <div className="stat-grid" aria-label="Resumen de promociones">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="stat-card"
          >
            <div className="stat-card__top">
              <span className="stat-card__icon">
                <Icon aria-hidden="true" />
              </span>
              <TrendingUp className="stat-card__trend" aria-hidden="true" />
            </div>
            <div className="stat-card__content">
              <p className="stat-card__label">{card.title}</p>
              <p className="stat-card__value">{card.value}</p>
              <p className="stat-card__detail">{card.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
