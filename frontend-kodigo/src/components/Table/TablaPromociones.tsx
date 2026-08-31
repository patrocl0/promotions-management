import { useEffect, useState } from "react";

import {
  TrashIcon,
  Search,
  CheckCircleIcon,
  PauseIcon,
  PlayIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import type { Promotion, UpdatePromotion } from "@/interface/Promotion";

interface TablePromocionesProps {
  promotions: Promotion[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: UpdatePromotion) => Promise<Promotion>;
}

type StatusFilter = "all" | Promotion["status"];

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
};

export const TablePromociones = ({
  promotions,
  loading,
  onDelete,
  onUpdate,
}: TablePromocionesProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const searchTerm = search.toLowerCase().trim();

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch =
      promotion.name.toLowerCase().includes(searchTerm) ||
      promotion.product?.name?.toLowerCase().includes(searchTerm) ||
      promotion.category?.toLowerCase().includes(searchTerm);

    const matchesStatus = status === "all" || promotion.status === status;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedPromotions = filteredPromotions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  return (
    <div>
      <div className="mt-8 flex flex-col gap-4 rounded-t-lg border bg-[#171717] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="font-medium">Todas las Promociones</p>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              placeholder="Buscar promoción..."
              aria-label="Buscar promociones"
              className="h-9 w-full pl-10"
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
            <SelectTrigger className="h-10 w-full sm:w-40">
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
          ) : paginatedPromotions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No hay promociones
              </TableCell>
            </TableRow>
          ) : (
            paginatedPromotions.map((promotion) => (
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
                        {(promotion.status === "programada" ||
                          promotion.status === "activa") && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleChangeStatus(promotion._id, "finalizada")
                            }
                          >
                            <CheckCircleIcon />
                            Finalizar
                          </DropdownMenuItem>
                        )}
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
      {/* Paginacion */}
      <div className="flex flex-col gap-4 border-x border-b bg-[#171717] p-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-center text-sm text-muted-foreground sm:text-left">
          Página {currentPage} de {Math.max(totalPages, 1)}
        </span>

        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Anterior
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};
