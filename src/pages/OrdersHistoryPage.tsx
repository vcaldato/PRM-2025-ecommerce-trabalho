import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useOrders } from "@/hooks/useOrders";
import { orderService } from "@/services/order";
import { formatPrice } from "@/utils/format";
import {
  formatOrderStatus,
  getStatusColor,
  getAllStatuses,
} from "@/utils/orderStatus";
import { formatDate } from "@/utils/date";

export const OrdersHistoryPage = () => {
  const { data: orders, isLoading, isError } = useOrders();
  const queryClient = useQueryClient();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Status do pedido atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Carregando pedidos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-muted-foreground">
          Erro ao carregar pedidos.
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-semibold">Meus Pedidos</h1>
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-muted-foreground">
            Você ainda não realizou nenhum pedido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Meus Pedidos</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pedido</p>
                <p className="font-semibold">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="text-sm font-medium">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                  {order.status !== "DELIVERED" &&
                    order.status !== "CANCELADO" && (
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        disabled={updatingStatus === order.id}
                        className="rounded-lg border px-2 py-1 text-xs font-medium transition hover:border-primary disabled:opacity-50"
                      >
                        {getAllStatuses().map((status) => (
                          <option key={status} value={status}>
                            {formatOrderStatus(status)}
                          </option>
                        ))}
                      </select>
                    )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-semibold text-primary">
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Itens do pedido:</p>
              {order.itens.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: {item.quantity} × {formatPrice(item.value)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.value * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

