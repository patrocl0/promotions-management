import type {
  CreatePromotion,
  Promotion,
  UpdatePromotion,
} from "@/interface/Promotion";

const API_URL = "http://localhost:3000/api";

export const getPromotions = async (): Promise<Promotion[]> => {
  const response = await fetch(`${API_URL}/promotions`);

  if (!response.ok) {
    throw new Error("Error al obtener las promociones");
  }

  return response.json();
};

export const createPromotion = async (
  promotion: CreatePromotion,
): Promise<Promotion> => {
  const response = await fetch(`${API_URL}/promotions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promotion),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear la promoción");
  }

  return response.json();
};

export const updatePromotion = async (
  id: string,
  promotion: UpdatePromotion,
): Promise<Promotion> => {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promotion),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la promoción");
  }

  return response.json();
};

export const deletePromotion = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la promoción");
  }
};
