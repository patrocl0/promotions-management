import type { Request, Response } from "express";
import { Promotion } from "../models/Promotion";

export const getPromotions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const promotions = await Promotion.find()
      .populate("product", "name category")
      .sort({ createdAt: -1 });

    res.status(200).json(promotions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los productos",
    });
  }
};

export const getPromotionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "product",
      "name category",
    );
    if (!promotion) {
      res.status(404).json({ message: "Promoción no encontrada" });
      return;
    }
    res.status(200).json(promotion);
  } catch (error) {
    console.error("Error getting promotion:", error);
    res.status(500).json({ message: "Error al obtener la promoción" });
  }
};

export const createPromotion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      targetType,
      product,
      category,
      discountType,
      discountValue,
      startDate,
      endDate,
      status,
      createdAt,
      updatedAt,
    } = req.body;

    // Validaciones básicas
    if (!name || !targetType || !discountType || discountValue == null) {
      res.status(400).json({
        message:
          "Nombre, tipo de aplicación, tipo de descuento y valor son obligatorios",
      });
      return;
    }
    if (!startDate || !endDate) {
      res
        .status(400)
        .json({ message: "Las fechas de inicio y fin son obligatorias" });
      return;
    } // Si aplica a producto, necesitamos product
    if (targetType === "product" && !product) {
      res.status(400).json({ message: "Debe seleccionar un producto" });
      return;
    }
    // Si aplica a categoría, necesitamos category
    if (targetType === "category" && !category) {
      res.status(400).json({ message: "Debe seleccionar una categoría" });
      return;
    }
    // Validar fechas
    if (new Date(startDate) > new Date(endDate)) {
      res.status(400).json({
        message: "La fecha de inicio no puede ser posterior a la fecha final",
      });
      return;
    }
    // Validar porcentaje
    if (discountType === "porcentaje" && discountValue > 100) {
      res
        .status(400)
        .json({ message: "El porcentaje no puede ser mayor a 100" });
      return;
    }

    const promotion = await Promotion.create({
      name,
      targetType,
      product: targetType === "product" ? product : null,
      category: targetType === "category" ? category : null,
      discountType,
      discountValue,
      startDate,
      endDate,
    });

    const populatedPromotion = await promotion.populate(
      "product",
      "name category",
    );

    res.status(201).json(populatedPromotion);
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      message: "Error al crear el producto",
    });
  }
};

export const updatePromotion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).populate("product", "name category");
    if (!promotion) {
      res.status(404).json({ message: "Promoción no encontrada" });
      return;
    }
    res.status(200).json(promotion);
  } catch (error) {
    console.error("Error updating promotion:", error);
    res.status(500).json({ message: "Error al actualizar la promoción" });
  }
};

export const deletePromotion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      res.status(404).json({ message: "Promoción no encontrada" });
      return;
    }
    res.status(200).json({ message: "Promoción eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    res.status(500).json({ message: "Error al eliminar la promoción" });
  }
};
