import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";

import {
  TrashIcon,
  Search,
  CheckCircleIcon,
  PauseIcon,
  PlayIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import type { Promotion, UpdatePromotion } from "@/interface/Promotion";
import { useState } from "react";

interface TablePromocionesProps {
  promotions: Promotion[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: UpdatePromotion) => Promise<Promotion>;
}

export const TablePromociones = ({
  promotions,
  loading,
  onDelete,
  onUpdate,
}: TablePromocionesProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(date));
  };

  const filteredPromotions = promotions.filter((promotion) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch =
      promotion.name.toLowerCase().includes(searchTerm) ||
      promotion.product?.name?.toLowerCase().includes(searchTerm) ||
      promotion.category?.toLowerCase().includes(searchTerm);

    const matchesStatus = status === "all" || promotion.status === status;

    return matchesSearch && matchesStatus;
  });

  const handleChangeStatus = async (
    id: string,
    newStatus: Promotion["status"],
  ) => {
    try {
      await onUpdate(id, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar esta promoción?",
    );
    if (!confirmed) return;
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Error eliminando promoción:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between gap-3 sm:flex-row mt-8 p-8 border rounded-t-lg bg-[#171717]">
        <p>Todas las Promociones</p>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Buscar promoción..."
              aria-label="Buscar promociones"
              className="h-9 pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={status}
            onValueChange={(value) => {
              if (!value) return;
              setStatus(value);
            }}
          >
            <SelectTrigger className="h-10 sm:w-40">
              <SelectValue placeholder="Filtrar estado" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="programada">Programadas</SelectItem>
              <SelectItem value="activa">Activas</SelectItem>
              <SelectItem value="finalizada">Finalizadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="border bg-[#171717]">
        <TableHeader>
          <TableRow>
            <TableHead>Promocion</TableHead>
            <TableHead>Aplicado A</TableHead>
            <TableHead>Descuento</TableHead>
            <TableHead>Vigencia</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Cargando promociones...
              </TableCell>
            </TableRow>
          ) : filteredPromotions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No hay promociones
              </TableCell>
            </TableRow>
          ) : (
            filteredPromotions.map((promotion) => (
              <TableRow key={promotion._id}>
                <TableCell className="font-medium">{promotion.name}</TableCell>

                <TableCell>
                  {promotion.targetType === "category"
                    ? `Categoría: ${promotion.category}`
                    : `Producto: ${promotion.product?.name}`}
                </TableCell>

                <TableCell>
                  {promotion.discountType === "percentage"
                    ? `${promotion.discountValue}%`
                    : `$${promotion.discountValue}`}
                </TableCell>

                <TableCell>
                  {formatDate(promotion.startDate)} —{" "}
                  {formatDate(promotion.endDate)}
                </TableCell>

                <TableCell>{promotion.status}</TableCell>

                <TableCell className="text-right">
                  {promotion.status !== "finalizada" && (
                    <DropdownMenu>
                      {" "}
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            {" "}
                            <MoreHorizontalIcon />{" "}
                            <span className="sr-only">
                              {" "}
                              Abrir acciones{" "}
                            </span>{" "}
                          </Button>
                        }
                      />{" "}
                      <DropdownMenuContent align="end">
                        {" "}
                        {/* Activar */}{" "}
                        {promotion.status !== "activa" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleChangeStatus(promotion._id, "activa")
                            }
                          >
                            {" "}
                            <PlayIcon /> Activar{" "}
                          </DropdownMenuItem>
                        )}{" "}
                        {/* Programar */}{" "}
                        {promotion.status !== "programada" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleChangeStatus(promotion._id, "programada")
                            }
                          >
                            {" "}
                            <PauseIcon /> Programar{" "}
                          </DropdownMenuItem>
                        )}{" "}
                        {/* Finalizar */}{" "}
                        {promotion.status !== "finalizada" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleChangeStatus(promotion._id, "finalizada")
                            }
                          >
                            {" "}
                            <CheckCircleIcon /> Finalizar{" "}
                          </DropdownMenuItem>
                        )}{" "}
                        <DropdownMenuSeparator />
                        {/* Eliminar */}{" "}
                        {promotion.status === "programada" && (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDelete(promotion._id)}
                          >
                            <TrashIcon />
                            Eliminar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>{" "}
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
