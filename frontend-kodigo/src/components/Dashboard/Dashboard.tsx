import { CardInformation } from "../Card/CardInformation";
import { Popup } from "../Popup/Popup";
import { TablePromociones } from "../Table/TablaPromociones";
import { usePromotion } from "@/hooks/usePromotion";

export const Dashboard = () => {
  const {
    promotions,
    loading,
    addPromotion,
    deletePromotion,
    updatePromotion,
  } = usePromotion();

  return (
    <main className="flex w-full flex-col px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
            Panel de control
          </p>
          <h1 className="text-2xl font-semibold sm:text-3xl">Promociones</h1>
          <p className="max-w-xl text-sm text-gray-400 sm:text-base">
            Administra los descuentos de tus productos en un solo lugar
          </p>
        </div>
        <Popup onCreate={addPromotion} />
      </div>
      <CardInformation promotions={promotions} />

      <TablePromociones
        promotions={promotions}
        loading={loading}
        onDelete={deletePromotion}
        onUpdate={updatePromotion}
      />
    </main>
  );
};
