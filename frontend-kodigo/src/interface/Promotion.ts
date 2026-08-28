export type DiscountType = "percentage" | "fixed";
export type TargetType = "product" | "category";
export type PromotionStatus = "programada" | "activa" | "finalizada";

export interface Promotion {
  _id: string;
  name: string;
  targetType: TargetType;
  product?: string;
  category?: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  status: PromotionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotion {
  name: string;
  targetType: "product" | "category";
  product?: string;
  category?: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
}

export type UpdatePromotion = Partial<CreatePromotion> & {
  status?: PromotionStatus;
};
