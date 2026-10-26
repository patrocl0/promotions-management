import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/useProduct";
import type { CreatePromotion } from "@/interface/Promotion";
import { BadgePercent, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const discountTypes = [
  { label: "Porcentaje", value: "percentage" },
  { label: "Monto fijo", value: "fixed" },
] as const;

const targetTypes = [
  { label: "Producto específico", value: "product" },
  { label: "Categoría completa", value: "category" },
] as const;

interface PopupProps {
  onCreate: (promotion: CreatePromotion) => Promise<unknown>;
}

export const Popup = ({ onCreate }: PopupProps) => {
  const {
    products,
    productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePromotion>({
    defaultValues: {
      name: "",
      targetType: "product",
      product: "",
      category: "",
      discountType: "percentage",
      discountValue: 0,
      startDate: "",
      endDate: "",
    },
  });

  const targetType = useWatch({ control, name: "targetType" });
  const discountType = useWatch({ control, name: "discountType" });
  const productId = useWatch({ control, name: "product" });
  const startDate = useWatch({ control, name: "startDate" });
  const selectedProduct = products.find((product) => product._id === productId);

  const closeForm = () => {
    reset();
    setSubmitError(null);
    setOpen(false);
  };

  const onSubmit = async (promotion: CreatePromotion) => {
    setSubmitError(null);

    try {
      await onCreate(promotion);
      closeForm();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la promoción. Inténtalo de nuevo.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          reset();
          setSubmitError(null);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button className="promotion-create-button">
            <Plus aria-hidden="true" />
            Nueva promoción
          </Button>
        }
      />
      <DialogContent className="promotion-form-dialog max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader className="promotion-form__header">
            <span className="promotion-form__icon">
              <BadgePercent aria-hidden="true" />
            </span>
            <DialogTitle>Nueva promoción</DialogTitle>
            <DialogDescription>
              Diseña una campaña de descuento para tu tienda.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="promotion-form__fields">
            <Field>
              <Label htmlFor="promotion-name">Nombre de la campaña *</Label>
              <Input
                id="promotion-name"
                placeholder="Ej. Especial de temporada"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "promotion-name-error" : undefined}
                {...register("name", {
                  required: "El nombre de la campaña es obligatorio.",
                  maxLength: {
                    value: 80,
                    message: "Usa un nombre de máximo 80 caracteres.",
                  },
                })}
              />
              {errors.name && (
                <p className="promotion-form__error" id="promotion-name-error">
                  {errors.name.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="promotion-target">Aplicar promoción a *</Label>
              <Select
                value={targetType}
                onValueChange={(value) => {
                  if (value === "product" || value === "category") {
                    setValue("targetType", value, { shouldValidate: true });
                  }
                }}
              >
                <SelectTrigger id="promotion-target" className="w-full">
                  <SelectValue placeholder="Elige dónde aplica" />
                </SelectTrigger>
                <SelectContent>
                  {targetTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {targetType === "product" ? (
              <Field>
                <Label htmlFor="promotion-product">Producto *</Label>
                <Select
                  value={productId}
                  onValueChange={(value) => {
                    if (value) {
                      setValue("product", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                >
                  <SelectTrigger
                    id="promotion-product"
                    className="w-full"
                    aria-invalid={Boolean(errors.product)}
                  >
                    <SelectValue placeholder="Selecciona un producto">
                      {selectedProduct?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {productsLoading ? (
                      <SelectItem value="loading" disabled>
                        Cargando productos…
                      </SelectItem>
                    ) : (
                      products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {productsError && (
                  <p className="promotion-form__error" role="alert">
                    {productsError}
                  </p>
                )}
                {productsError && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void refetchProducts()}
                  >
                    Volver a cargar productos
                  </Button>
                )}
                {errors.product && (
                  <p className="promotion-form__error" role="alert">
                    {errors.product.message}
                  </p>
                )}
              </Field>
            ) : (
              <Field>
                <Label htmlFor="promotion-category">Categoría *</Label>
                <Input
                  id="promotion-category"
                  placeholder="Ej. Bebidas"
                  aria-invalid={Boolean(errors.category)}
                  {...register("category", {
                    required: "La categoría es obligatoria.",
                    validate: (value) =>
                      targetType !== "category" ||
                      Boolean(value?.trim()) ||
                      "Escribe el nombre de la categoría.",
                  })}
                />
                {errors.category && (
                  <p className="promotion-form__error" role="alert">
                    {errors.category.message}
                  </p>
                )}
              </Field>
            )}

            <Field>
              <Label htmlFor="promotion-discount-type">Tipo de descuento *</Label>
              <Select
                value={discountType}
                onValueChange={(value) => {
                  if (value === "percentage" || value === "fixed") {
                    setValue("discountType", value, { shouldValidate: true });
                  }
                }}
              >
                <SelectTrigger id="promotion-discount-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {discountTypes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="promotion-discount-value">Valor del descuento *</Label>
              <Input
                id="promotion-discount-value"
                type="number"
                min="0.01"
                max={discountType === "percentage" ? 100 : undefined}
                step="any"
                placeholder={discountType === "percentage" ? "Ej. 15" : "Ej. 5000"}
                aria-invalid={Boolean(errors.discountValue)}
                {...register("discountValue", {
                  required: "El valor del descuento es obligatorio.",
                  valueAsNumber: true,
                  validate: (value) => {
                    if (!Number.isFinite(value) || value <= 0) {
                      return "El valor debe ser mayor que cero.";
                    }
                    if (discountType === "percentage" && value > 100) {
                      return "El porcentaje no puede superar el 100%.";
                    }
                    return true;
                  },
                })}
              />
              {errors.discountValue && (
                <p className="promotion-form__error" role="alert">
                  {errors.discountValue.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="promotion-start-date">Fecha de inicio *</Label>
              <Input
                id="promotion-start-date"
                type="date"
                aria-invalid={Boolean(errors.startDate)}
                {...register("startDate", {
                  required: "La fecha de inicio es obligatoria.",
                })}
              />
              {errors.startDate && (
                <p className="promotion-form__error" role="alert">
                  {errors.startDate.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="promotion-end-date">Fecha de finalización *</Label>
              <Input
                id="promotion-end-date"
                type="date"
                aria-invalid={Boolean(errors.endDate)}
                {...register("endDate", {
                  required: "La fecha de finalización es obligatoria.",
                  validate: (value) =>
                    !startDate ||
                    value >= startDate ||
                    "La fecha final debe ser igual o posterior a la inicial.",
                })}
              />
              {errors.endDate && (
                <p className="promotion-form__error" role="alert">
                  {errors.endDate.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          <input
            type="hidden"
            {...register("product", {
              required:
                targetType === "product"
                  ? "Selecciona el producto al que aplica la promoción."
                  : false,
            })}
          />

          {submitError && (
            <p className="promotion-form__submit-error" role="alert">
              <Sparkles aria-hidden="true" />
              {submitError}
            </p>
          )}

          <DialogFooter className="promotion-form__footer">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              }
            />
            <Button
              type="submit"
              className="promotion-create-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando…" : "Crear promoción"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
