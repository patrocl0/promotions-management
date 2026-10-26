import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle,
  CircleAlert,
  Clock3,
  MoreHorizontal,
  Pause,
  Play,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Promotion, UpdatePromotion } from "@/interface/Promotion";
import { useEffect, useState } from "react";

interface TablePromocionesProps {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: UpdatePromotion) => Promise<Promotion>;
}

const statusLabels: Record<Promotion["status"], string> = {
  programada: "Programada",
  activa: "Activa",
  finalizada: "Finalizada",
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));

const formatDiscount = (promotion: Promotion) =>
  promotion.discountType === "percentage"
    ? `${promotion.discountValue}%`
    : new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(promotion.discountValue);

export const TablePromociones = ({
  promotions,
  loading,
  error,
  onRetry,
  onDelete,
  onUpdate,
}: TablePromocionesProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Promotion | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredPromotions = promotions.filter((promotion) => {
    const searchTerm = search.trim().toLocaleLowerCase("es-CO");
    const matchesSearch =
      promotion.name.toLocaleLowerCase("es-CO").includes(searchTerm) ||
      promotion.product?.name?.toLocaleLowerCase("es-CO").includes(searchTerm) ||
      promotion.category?.toLocaleLowerCase("es-CO").includes(searchTerm);

    return matchesSearch && (status === "all" || promotion.status === status);
  });

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const pageCount = Math.max(totalPages, 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromotions = filteredPromotions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);

  const handleChangeStatus = async (
    promotion: Promotion,
    newStatus: Promotion["status"],
  ) => {
    setBusyId(promotion._id);
    setActionError(null);

    try {
      await onUpdate(promotion._id, { status: newStatus });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado de la promoción.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;

    setBusyId(pendingDelete._id);
    setActionError(null);

    try {
      await onDelete(pendingDelete._id);
      setPendingDelete(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la promoción.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className="promotion-toolbar">
        <label className="promotion-toolbar__search">
          <Search aria-hidden="true" />
          <Input
            placeholder="Buscar por nombre, producto o categoría"
            aria-label="Buscar promociones"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <Select
          value={status}
          onValueChange={(value) => {
            if (value) setStatus(value);
          }}
        >
          <SelectTrigger className="promotion-toolbar__filter" aria-label="Filtrar por estado">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="programada">Programadas</SelectItem>
            <SelectItem value="activa">Activas</SelectItem>
            <SelectItem value="finalizada">Finalizadas</SelectItem>
          </SelectContent>
        </Select>
        <span className="promotion-toolbar__count">
          {filteredPromotions.length}{" "}
          {filteredPromotions.length === 1 ? "promoción" : "promociones"}
        </span>
      </div>

      {(actionError || (error && !loading)) && (
        <div className="promotion-message" role="alert">
          <CircleAlert aria-hidden="true" />
          <span>{actionError ?? error}</span>
          {error && !loading && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Reintentar
            </Button>
          )}
        </div>
      )}

      <div className="promotion-table-wrap">
        <Table className="promotion-table">
          <TableHeader>
            <TableRow>
              <TableHead>Promoción</TableHead>
              <TableHead>Aplicada a</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Vigencia</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="promotion-empty">
                    <span className="promotion-empty__spinner" aria-hidden="true" />
                    <p role="status">Cargando promociones…</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPromotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="promotion-empty">
                    <span className="promotion-empty__icon">
                      <Tag aria-hidden="true" />
                    </span>
                    <p className="promotion-empty__title">
                      {promotions.length === 0
                        ? "Aún no tienes promociones"
                        : "No encontramos resultados"}
                    </p>
                    <p className="promotion-empty__description">
                      {promotions.length === 0
                        ? "Crea tu primera campaña y aparecerá aquí."
                        : "Prueba con otra búsqueda o cambia el filtro de estado."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedPromotions.map((promotion) => (
                <TableRow key={promotion._id}>
                  <TableCell>
                    <span className="promotion-table__name">{promotion.name}</span>
                    <span className="promotion-table__subtext">
                      Actualizada {formatDate(promotion.updatedAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="promotion-table__target">
                      {promotion.targetType === "category"
                        ? promotion.category
                        : promotion.product?.name ?? "Producto"}
                    </span>
                    <span className="promotion-table__subtext">
                      {promotion.targetType === "category" ? "Categoría" : "Producto"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="promotion-table__discount">
                      {formatDiscount(promotion)}
                    </span>
                    <span className="promotion-table__subtext">
                      {promotion.discountType === "percentage"
                        ? "Porcentaje"
                        : "Descuento fijo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="promotion-table__dates">
                      <CalendarDays aria-hidden="true" />
                      {formatDate(promotion.startDate)}
                    </span>
                    <span className="promotion-table__subtext promotion-table__date-end">
                      Hasta {formatDate(promotion.endDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`status-badge status-badge--${promotion.status}`}
                    >
                      {promotion.status === "activa" ? (
                        <BadgeCheck aria-hidden="true" />
                      ) : promotion.status === "programada" ? (
                        <Clock3 aria-hidden="true" />
                      ) : (
                        <CheckCircle aria-hidden="true" />
                      )}
                      {statusLabels[promotion.status]}
                    </span>
                  </TableCell>
                  <TableCell className="promotion-table__actions">
                    {promotion.status !== "finalizada" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Acciones para ${promotion.name}`}
                              disabled={busyId === promotion._id}
                            >
                              <MoreHorizontal aria-hidden="true" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          {promotion.status !== "activa" && (
                            <DropdownMenuItem
                              onClick={() =>
                                void handleChangeStatus(promotion, "activa")
                              }
                            >
                              <Play aria-hidden="true" />
                              Activar
                            </DropdownMenuItem>
                          )}
                          {promotion.status !== "programada" && (
                            <DropdownMenuItem
                              onClick={() =>
                                void handleChangeStatus(promotion, "programada")
                              }
                            >
                              <Pause aria-hidden="true" />
                              Programar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              void handleChangeStatus(promotion, "finalizada")
                            }
                          >
                            <CheckCircle aria-hidden="true" />
                            Finalizar
                          </DropdownMenuItem>
                          {promotion.status === "programada" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setPendingDelete(promotion)}
                              >
                                <Trash2 aria-hidden="true" />
                                Eliminar
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 border-x border-b border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-center text-sm text-muted-foreground sm:text-left">
          Página {currentPage} de {pageCount}
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
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && busyId === null) setPendingDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar promoción</DialogTitle>
            <DialogDescription>
              ¿Seguro que quieres eliminar “{pendingDelete?.name}”? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={busyId !== null}>
                  Cancelar
                </Button>
              }
            />
            <Button
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={busyId !== null}
            >
              {busyId ? "Eliminando…" : "Sí, eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
