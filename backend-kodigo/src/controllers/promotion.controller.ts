import type { NextFunction, Request, Response } from "express";
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
  next: NextFunction,
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
    } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        message: "El nombre de la promoción es obligatorio.",
      });
      return;
    }

    if (targetType !== "product" && targetType !== "category") {
      res.status(400).json({ message: "El tipo de aplicación no es válido." });
      return;
    }

    if (discountType !== "percentage" && discountType !== "fixed") {
      res.status(400).json({ message: "El tipo de descuento no es válido." });
      return;
    }

    if (
      typeof discountValue !== "number" ||
      !Number.isFinite(discountValue) ||
      discountValue <= 0
    ) {
      res.status(400).json({
        message: "El valor del descuento debe ser un número mayor que cero.",
      });
      return;
    }

    if (discountType === "percentage" && discountValue > 100) {
      res
        .status(400)
        .json({ message: "El porcentaje no puede ser mayor a 100." });
      return;
    }

    if (targetType === "product" && !product) {
      res.status(400).json({ message: "Debe seleccionar un producto." });
      return;
    }

    if (
      targetType === "category" &&
      (typeof category !== "string" || !category.trim())
    ) {
      res.status(400).json({ message: "Debe seleccionar una categoría." });
      return;
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    if (
      !startDate ||
      !endDate ||
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime())
    ) {
      res.status(400).json({ message: "Las fechas de inicio y fin no son válidas." });
      return;
    }

    if (parsedStartDate > parsedEndDate) {
      res.status(400).json({
        message: "La fecha de inicio no puede ser posterior a la fecha final.",
      });
      return;
    }
    const promotion = await Promotion.create({
      name: name.trim(),
      targetType,
      product: targetType === "product" ? product : null,
      category: targetType === "category" ? category.trim() : null,
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
    next(error);
  }
};

export const updatePromotion = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
    next(error);
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
