import { BadgePercent, ChevronRight, CircleHelp, Store } from "lucide-react";

export const Header = () => (
  <header className="site-header">
    <div className="site-header__inner">
      <a className="site-header__brand" href="/" aria-label="PromoDesk, inicio">
        <span className="site-header__mark">
          <BadgePercent aria-hidden="true" />
        </span>
        <span className="site-header__wordmark">
          Promo<span>Desk</span>
        </span>
      </a>

      <div className="site-header__context" aria-label="Ruta actual">
        <span>Gestión</span>
        <ChevronRight aria-hidden="true" />
        <span className="site-header__context-current">Promociones</span>
      </div>

      <div className="site-header__profile">
        <span className="site-header__store" aria-hidden="true">
          <Store />
        </span>
        <span className="site-header__profile-copy">
          <span className="site-header__profile-name">Mi tienda</span>
          <span className="site-header__profile-label">Panel de administración</span>
        </span>
        <CircleHelp className="site-header__help" aria-hidden="true" />
      </div>
    </div>
  </header>
);
