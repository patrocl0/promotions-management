import { Schema, model } from "mongoose";

const promotionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la promoción es obligatorio"],
      trim: true,
    },

    targetType: {
      type: String,
      enum: ["product", "category"],
      required: [true, "Debe indicar si aplica a producto o categoría"],
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    category: {
      type: String,
      trim: true,
      default: null,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "El tipo de descuento es obligatorio"],
    },

    discountValue: {
      type: Number,
      required: [true, "El valor del descuento es obligatorio"],
      min: [0, "El descuento no puede ser negativo"],
    },

    startDate: {
      type: Date,
      required: [true, "La fecha de inicio es obligatoria"],
    },

    endDate: {
      type: Date,
      required: [true, "La fecha de fin es obligatoria"],
    },

    status: {
      type: String,
      enum: ["programada", "activa", "finalizada"],
      default: "programada",
    },
  },
  {
    timestamps: true,
  },
);

export const Promotion = model("Promotion", promotionSchema);
