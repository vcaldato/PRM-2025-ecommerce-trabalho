import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { Product } from "@/types/product";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/utils/format";
import { FavoriteButton } from "./FavoriteButton";
import { useAuth } from "@/hooks/useAuth";
import { getProductImage } from "@/utils/productImages";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const productImage = product.imageUrl || getProductImage(product.name);

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Produto adicionado ao carrinho");
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full bg-black overflow-hidden">
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : null}
        {isAuthenticated && (
          <div className="absolute right-2 top-2">
            <FavoriteButton productId={product.id} />
          </div>
        )}
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


