import type { Category } from "@/types/category";

interface CategoryMenuProps {
  categories?: Category[];
  selected?: string;
  onSelect: (id?: string) => void;
  isLoading?: boolean;
}

export const CategoryMenu = ({
  categories,
  selected,
  onSelect,
  isLoading,
}: CategoryMenuProps) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <strong className="text-sm uppercase tracking-wide text-muted-foreground">
        Categorias
      </strong>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          className={`rounded-lg px-3 py-2 text-left text-sm transition ${
            selected
              ? "text-muted-foreground hover:bg-muted"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          Todos os produtos
        </button>
        {categories?.map((category) => {
          const isActive = category.id === selected;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {category.name}
            </button>
          );
        })}
        {!categories?.length && (
          <span className="text-sm text-muted-foreground">
            Nenhuma categoria cadastrada.
          </span>
        )}
      </div>
    </div>
  );
};


