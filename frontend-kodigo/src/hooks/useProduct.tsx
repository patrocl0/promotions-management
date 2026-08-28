import { useEffect, useState } from "react";
import type { Product } from "@/interface/Product";
import { getProducts } from "@/services/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setError(null);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los productos");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    productsLoading,
    error,
    refetch: fetchProducts,
  };
};
