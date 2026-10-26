import { CardInformation } from "../Card/CardInformation";
import { Popup } from "../Popup/Popup";
import { TablePromociones } from "../Table/TablaPromociones";
import { usePromotion } from "@/hooks/usePromotion";
import { Button } from "../ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const Dashboard = () => {
  const {
    promotions,
    loading,
    error,
    fetchPromotions,
    addPromotion,
    deletePromotion,
    updatePromotion,
  } = usePromotion();

  return (
    <main className="dashboard">
      <div className="dashboard__container">
        <div className="dashboard__intro">
          <div>
            <p className="dashboard__eyebrow">
              <Sparkles aria-hidden="true" />
              CENTRO DE CONTROL
            </p>
            <h1 className="dashboard__title">Promociones</h1>
            <p className="dashboard__description">
              Administra los descuentos de tus productos en un solo lugar.
            </p>
          </div>
          <div className="dashboard__tip">
            <span>Todo en un solo lugar</span>
            <ArrowUpRight aria-hidden="true" />
          </div>
        </div>

        {error && (
          <div className="dashboard__alert" role="alert">
            <div>
              <p className="dashboard__alert-title">
                No pudimos completar la solicitud
              </p>
              <p className="dashboard__alert-message">{error}</p>
            </div>
            <Button variant="outline" onClick={() => void fetchPromotions()}>
              Reintentar
            </Button>
          </div>
        )}

        <CardInformation promotions={promotions} />

        <section className="promotion-panel" aria-labelledby="promotions-title">
          <div className="promotion-panel__heading">
            <div>
              <p className="promotion-panel__eyebrow">TU CATÁLOGO</p>
              <h2 id="promotions-title">Todas las promociones</h2>
              <p>Consulta y administra las campañas de tu tienda.</p>
            </div>
            <Popup onCreate={addPromotion} />
          </div>

          <TablePromociones
            promotions={promotions}
            loading={loading}
            error={error}
            onRetry={() => void fetchPromotions()}
            onDelete={deletePromotion}
            onUpdate={updatePromotion}
          />
        </section>
      </div>
    </main>
  );
};
