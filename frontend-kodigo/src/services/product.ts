import type { Product } from "@/interface/Product";

const API_URL = "http://localhost:3000/api";

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Error al obtener los productos");
  }

  return response.json();
};
