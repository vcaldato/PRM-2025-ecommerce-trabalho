import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/utils/format";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";
import { useAuth } from "@/hooks/useAuth";
import { ProductReviews } from "@/components/reviews/ProductReviews";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const productId = id ?? "";
  const { data: product, isLoading, isError } = useProductDetail(productId);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Carregando produto...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-muted-foreground">
          Não encontramos este produto.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex text-sm font-semibold text-primary"
        >
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Produto adicionado ao carrinho");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to="/"
        className="text-sm font-semibold text-primary transition hover:text-primary/80"
      >
        Voltar para o catálogo
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border bg-black shadow-sm">
          {isAuthenticated && (
            <div className="absolute right-4 top-4">
              <FavoriteButton productId={product.id} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs uppercase text-muted-foreground">
              {product.category?.name}
            </span>
            {isAuthenticated && (
              <FavoriteButton productId={product.id} className="mt-1" />
            )}
          </div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-sm text-muted-foreground">
            {product.description || "Este produto ainda não possui descrição."}
          </p>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            {product.brand && (
              <span>
                Marca: <strong className="text-foreground">{product.brand.name}</strong>
              </span>
            )}
            <span>Status: {product.active ? "Disponível" : "Indisponível"}</span>
          </div>
          <strong className="text-4xl text-primary">
            {formatPrice(product.price)}
          </strong>
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-4 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
      <div className="mt-10">
        <ProductReviews productId={productId} />
      </div>
    </div>
  );
};


