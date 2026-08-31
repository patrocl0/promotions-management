import type {
  CreatePromotion,
  Promotion,
  UpdatePromotion,
} from "@/interface/Promotion";
import {
  createPromotion,
  getPromotions,
  updatePromotion as updatePromotionService,
  deletePromotion as deletePromotionService,
} from "@/services/Promotion";

import { useCallback, useEffect, useState } from "react";

export const usePromotion = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPromotions();

      setPromotions(data);
    } catch (error) {
      console.error(error);

      setError("No se pudieron cargar las promociones");
    } finally {
      setLoading(false);
    }
  }, []);

  const addPromotion = async (data: CreatePromotion) => {
    try {
      setLoading(true);
      setError(null);

      const newPromotion = await createPromotion(data);

      setPromotions((current) => [newPromotion, ...current]);

      return newPromotion;
    } catch (error) {
      setError("No se pudo crear la promoción");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePromotion = async (
    id: string,
    promotion: UpdatePromotion,
  ): Promise<Promotion> => {
    try {
      setError(null);

      const updatedPromotion = await updatePromotionService(id, promotion);

      // Reemplazamos solamente la promoción modificada
      setPromotions((currentPromotions) =>
        currentPromotions.map((item) =>
          item._id === id ? updatedPromotion : item,
        ),
      );

      return updatedPromotion;
    } catch (error) {
      console.error(error);

      setError("No se pudo actualizar la promoción");

      throw error;
    }
  };

  const deletePromotion = async (id: string): Promise<void> => {
    try {
      setError(null);

      await deletePromotionService(id);

      // Eliminamos inmediatamente de la tabla
      setPromotions((currentPromotions) =>
        currentPromotions.filter((item) => item._id !== id),
      );
    } catch (error) {
      console.error(error);

      setError("No se pudo eliminar la promoción");

      throw error;
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return {
    promotions,
    loading,
    error,
    fetchPromotions,
    addPromotion,
    deletePromotion,
    updatePromotion,
  };
};
