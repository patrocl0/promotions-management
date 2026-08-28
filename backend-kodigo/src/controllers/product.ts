import type { Request, Response } from "express";
import { Product } from "../models/Product";

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los productos",
    });
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        message: "Producto no encontrado",
      });

      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product:", error);

    res.status(500).json({
      message: "Error al obtener el producto",
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, category, active } = req.body;

    if (!name || !category) {
      res.status(400).json({
        message: "El nombre y la categoría son obligatorios",
      });

      return;
    }

    const product = await Product.create({
      name,
      category,
      active,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      message: "Error al crear el producto",
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404).json({
        message: "Producto no encontrado",
      });

      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      message: "Error al actualizar el producto",
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({
        message: "Producto no encontrado",
      });

      return;
    }

    res.status(200).json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    res.status(500).json({
      message: "Error al eliminar el producto",
    });
  }
};
