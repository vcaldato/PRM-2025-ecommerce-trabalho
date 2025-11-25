import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { Product } from "@/types/product";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/utils/format";

interface ProductCardProps {
  product: Product;
}

const fallbackImage = (id: string) =>
  `https://picsum.photos/seed/${id}/400/400`;

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const imageSrc = product.imageUrl || fallbackImage(product.id);

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Produto adicionado ao carrinho");
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {product.category?.name}
        </span>
        <Link
          to={`/produto/${product.id}`}
          className="text-lg font-semibold text-foreground transition hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="flex-1 text-sm text-muted-foreground">
          {product.description || "Este produto ainda não possui descrição."}
        </p>
        <div className="flex items-center justify-between pt-2">
          <strong className="text-xl text-primary">
            {formatPrice(product.price)}
          </strong>
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
};


