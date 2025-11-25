import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { CategoryMenu } from "@/components/catalog/CategoryMenu";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SearchBar } from "@/components/catalog/SearchBar";

export const HomePage = () => {
  const [params, setParams] = useSearchParams();
  const selectedCategory = params.get("category") || undefined;
  const searchTerm = params.get("q") || "";

  const { data: categories, isLoading: loadingCategories } = useCategories();
  const {
    data: products,
    isLoading: loadingProducts,
    isError: productsError,
  } = useProducts({
    categoryId: selectedCategory,
    search: searchTerm,
  });

  const handleCategoryChange = (id?: string) => {
    const next = new URLSearchParams(params);
    if (!id) {
      next.delete("category");
    } else {
      next.set("category", id);
    }
    setParams(next, { replace: true });
  };

  const handleSearch = (value: string) => {
    const next = new URLSearchParams(params);
    if (!value) {
      next.delete("q");
    } else {
      next.set("q", value);
    }
    setParams(next, { replace: true });
  };

  const emptyStateMessage = useMemo(() => {
    if (loadingProducts) {
      return "Carregando produtos...";
    }
    if (productsError) {
      return "Não foi possível carregar os produtos.";
    }
    if (!products?.length) {
      return "Nenhum produto encontrado para os filtros selecionados.";
    }
    return null;
  }, [loadingProducts, productsError, products]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <SearchBar initialValue={searchTerm} onSearch={handleSearch} />
      <section className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <CategoryMenu
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategoryChange}
          isLoading={loadingCategories}
        />
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Resultados encontrados
              </p>
              <strong className="text-2xl">
                {products?.length ?? 0} produto(s)
              </strong>
            </div>
          </header>
          {emptyStateMessage ? (
            <p className="text-sm text-muted-foreground">{emptyStateMessage}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};


