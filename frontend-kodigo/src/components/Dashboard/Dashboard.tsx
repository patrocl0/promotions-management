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
    <main className="flex flex-col w-full px-6 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-white text-sm">Panel de control </p>
          <h1 className="text-3xl ">Promociones</h1>
          <p className="text-gray-400 text-sm">
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
