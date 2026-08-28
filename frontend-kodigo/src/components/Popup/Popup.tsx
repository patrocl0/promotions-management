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
import { useForm } from "react-hook-form";
import type { CreatePromotion } from "@/interface/Promotion";
import { useProducts } from "@/hooks/useProduct";
import { useState } from "react";

const items = [
  { label: "percentage", value: "percentage" },
  { label: "monto fijo", value: "fixed" },
];

const targetTypes = [
  { label: "Producto", value: "product" },
  { label: "Categoría", value: "category" },
];

interface PopupProps {
  onCreate: (promotion: CreatePromotion) => Promise<unknown>;
}

export const Popup = ({ onCreate }: PopupProps) => {
  const { products, productsLoading } = useProducts();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
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

  const onSubmit = async (createPromotion: CreatePromotion) => {
    try {
      await onCreate(createPromotion);

      // cerrar popup / limpiar formulario
      reset();

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const targetType = watch("targetType");
  const discountType = watch("discountType");
  const productId = watch("product");
  const selectedProduct = products.find((product) => product._id === productId);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          reset();
        }
      }}
    >
      <DialogTrigger
        render={<Button variant="outline">Nueva Promoción</Button>}
      />
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nueva Promoción</DialogTitle>
            <DialogDescription>
              Configura un descuento para tu catalogo
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="name"
                placeholder="EJ. Promo de verano"
                {...register("name", { required: "El nombre es obligatorio" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </Field>

            <Field>
              <Label>Aplicar a *</Label>
              <Select
                value={targetType}
                onValueChange={(value) =>
                  setValue(
                    "targetType",
                    value as CreatePromotion["targetType"],
                    {
                      shouldValidate: true,
                    },
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar" />
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
            {targetType === "product" && (
              <Field>
                <Label>Producto *</Label>

                <Select
                  value={productId}
                  onValueChange={(value) => {
                    if (!value) return;

                    setValue("product", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar producto">
                      {selectedProduct?.name}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {productsLoading ? (
                      <SelectItem value="loading" disabled>
                        Cargando...
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
              </Field>
            )}

            {/* Categoría */}
            {targetType === "category" && (
              <Field>
                <Label htmlFor="category">Categoría *</Label>

                <Input
                  id="category"
                  placeholder="Ej. Bebidas"
                  {...register("category", {
                    required:
                      targetType === "category"
                        ? "La categoría es obligatoria"
                        : false,
                  })}
                />

                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </Field>
            )}

            <Field>
              <Label htmlFor="tipo-descuento">Tipo de descuento</Label>
              <Select
                items={items}
                value={discountType}
                onValueChange={(value) =>
                  setValue(
                    "discountType",
                    value as CreatePromotion["discountType"],
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="discountValue">Valor</Label>
              <Input
                id="discountValue"
                type="number"
                min="0"
                step="any"
                placeholder={
                  discountType === "percentage" ? "Ej. 10" : "Ej. 5000"
                }
                {...register("discountValue", {
                  required: "El valor es obligatorio",
                  valueAsNumber: true,

                  validate: (value) => {
                    if (value <= 0) {
                      return "El valor debe ser mayor a 0";
                    }

                    if (discountType === "percentage" && value > 100) {
                      return "El porcentaje debe ser menor o igual a 100";
                    }

                    return true;
                  },
                })}
              />
              {errors.discountValue && (
                <p className="text-sm text-red-500">
                  {errors.discountValue.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="fecha-inicio">Fecha Inicio *</Label>
              <Input
                id="fecha-inicio"
                type="date"
                {...register("startDate", {
                  required: "La fecha de inicio es obligatoria",
                })}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </Field>
            <Field>
              <Label htmlFor="fecha-fin">Fecha Fin *</Label>
              <Input
                id="fecha-fin"
                type="date"
                {...register("endDate", {
                  required: "La fecha final es obligatoria",
                })}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" onClick={() => reset()}>
                  Cancelar
                </Button>
              }
            />
            <Button type="submit">Crear Promoción</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
