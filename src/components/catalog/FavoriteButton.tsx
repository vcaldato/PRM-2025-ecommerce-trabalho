import { Heart } from "lucide-react";
import { useFavoriteStatus } from "@/hooks/useFavorites";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "react-toastify";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
}

export const FavoriteButton = ({
  productId,
  className = "",
}: FavoriteButtonProps) => {
  const { data: isFavorite = false } = useFavoriteStatus(productId);
  const { addFavorite, removeFavorite, isAdding, isRemoving } = useFavorites();

  const handleToggle = () => {
    if (isFavorite) {
      removeFavorite(productId);
      toast.success("Produto removido dos favoritos");
    } else {
      addFavorite(productId);
      toast.success("Produto adicionado aos favoritos");
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isAdding || isRemoving}
      className={`rounded-full p-2 transition hover:bg-muted disabled:opacity-50 ${className}`}
      title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        className={`h-5 w-5 ${
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground"
        }`}
      />
    </button>
  );
};

