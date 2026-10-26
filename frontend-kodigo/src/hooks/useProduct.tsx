import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/interface/Product";
import { getProducts } from "@/services/product";

const getProductErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "No se pudieron cargar los productos.";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setProductsLoading(true);
    setError(null);

    try {
      setProducts(await getProducts());
    } catch (requestError) {
      setError(getProductErrorMessage(requestError));
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(getProductErrorMessage(requestError));
      })
      .finally(() => {
        if (!cancelled) setProductsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    products,
    productsLoading,
    error,
    refetch,
  };
};
