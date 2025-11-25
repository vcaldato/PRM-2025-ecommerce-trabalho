import { Link } from "react-router-dom";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/utils/format";

interface CartPreviewProps {
  onClose?: () => void;
}

export const CartPreview = ({ onClose }: CartPreviewProps) => {
  const { items, totalItems, totalPrice, removeItem, changeQuantity, clear } =
    useCart();

  if (!items.length) {
    return (
      <div className="w-80 rounded-2xl border bg-white p-4 shadow-xl">
        <p className="text-sm text-muted-foreground">
          Seu carrinho está vazio.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-80 flex-col gap-4 rounded-2xl border bg-white p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Carrinho</p>
          <span className="text-xs text-muted-foreground">
            {totalItems} item(s)
          </span>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold text-destructive transition hover:opacity-80"
        >
          Limpar
        </button>
      </div>
      <div className="flex max-h-60 flex-col gap-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 rounded-xl border p-2 transition hover:border-primary"
          >
            <div className="h-16 w-16 overflow-hidden rounded-lg bg-muted">
              <img
                src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80`}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col text-sm">
              <strong className="font-semibold leading-tight">
                {item.name}
              </strong>
              <span className="text-muted-foreground">
                {formatPrice(item.price)}
              </span>
              <div className="mt-auto flex items-center gap-2">
                <div className="flex items-center rounded-lg border">
                  <button
                    type="button"
                    onClick={() =>
                      changeQuantity(item.id, Math.max(item.quantity - 1, 0))
                    }
                    className="px-2 text-sm"
                  >
                    -
                  </button>
                  <span className="px-2 text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.id, item.quantity + 1)}
                    className="px-2 text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs font-semibold text-muted-foreground transition hover:text-destructive"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total</span>
        <strong className="text-lg">{formatPrice(totalPrice)}</strong>
      </div>
      <div className="flex gap-2">
        <Link
          to="/checkout"
          onClick={onClose}
          className="flex-1 rounded-xl bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Finalizar
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:border-primary"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};


