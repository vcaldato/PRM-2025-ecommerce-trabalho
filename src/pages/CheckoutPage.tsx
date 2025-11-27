import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/hooks/useAuth";
import { customerService } from "@/services/customer";
import { orderService } from "@/services/order";
import { formatPrice } from "@/utils/format";
import { getProductImage } from "@/utils/productImages";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clear, removeItem, changeQuantity } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Continuar comprando
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para finalizar o pedido");
      return;
    }

    setIsLoading(true);
    try {
      const customer = await customerService.findBySupabaseUserId(user.id);
      if (!customer) {
        toast.error("Erro ao buscar dados do cliente");
        return;
      }

      const orderData = {
        customerId: customer.id,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shipping: 0,
      };

      await orderService.create(orderData);
      clear();
      toast.success("Pedido realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro ao finalizar pedido";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Finalizar Pedido</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Resumo do Pedido</h2>
            <div className="space-y-4">
              {items.map((item) => {
                const itemImage = item.imageUrl || getProductImage(item.name);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-4"
                  >
                    <div className="h-20 w-20 bg-black rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {itemImage && (
                        <img
                          src={itemImage}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} cada
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                        title="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border">
                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(
                              item.id,
                              Math.max(item.quantity - 1, 1),
                            )
                          }
                          className="px-3 py-1 text-sm transition hover:bg-muted"
                        >
                          -
                        </button>
                        <span className="px-4 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 text-sm transition hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Total</h2>
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span>{formatPrice(0)}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Processando..." : "Finalizar Pedido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

