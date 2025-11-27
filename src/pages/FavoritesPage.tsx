import { useFavorites } from "@/hooks/useFavorites";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Link } from "react-router-dom";

export const FavoritesPage = () => {
  const { favorites, isLoading, isError } = useFavorites();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Carregando favoritos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-muted-foreground">
          Erro ao carregar favoritos.
        </p>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-semibold">Meus Favoritos</h1>
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-muted-foreground">
            Você ainda não adicionou nenhum produto aos favoritos.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Explorar produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Meus Favoritos</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <ProductCard key={favorite.id} product={favorite.product} />
        ))}
      </div>
    </div>
  );
};

