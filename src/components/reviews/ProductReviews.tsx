import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { useProductReviews, useProductRating, useCanReview, useCreateReview } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/date";

interface ProductReviewsProps {
  productId: string;
}

const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          disabled={readonly}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { isAuthenticated } = useAuth();
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const { data: rating } = useProductRating(productId);
  const canReview = useCanReview(productId);
  const createReview = useCreateReview();

  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast.error("Selecione uma avaliação");
      return;
    }

    try {
      await createReview.mutateAsync({
        productId,
        rating: selectedRating,
        comment: comment.trim() || undefined,
      });
      toast.success("Avaliação enviada com sucesso!");
      setSelectedRating(0);
      setComment("");
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao enviar avaliação");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Avaliações</h2>
          {rating && rating.count > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={Math.round(rating.average)} readonly />
              <span className="text-sm text-muted-foreground">
                {rating.average.toFixed(1)} ({rating.count} avaliações)
              </span>
            </div>
          )}
        </div>
        {canReview && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:border-primary"
          >
            Avaliar produto
          </button>
        )}
      </div>

      {showForm && canReview && (
        <div className="mb-6 rounded-lg border p-4">
          <p className="mb-3 text-sm font-semibold">Sua avaliação</p>
          <StarRating
            rating={selectedRating}
            onRatingChange={setSelectedRating}
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Compartilhe sua opinião sobre o produto..."
            className="mt-3 w-full rounded-lg border px-4 py-2 text-sm"
            rows={3}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createReview.isPending || selectedRating === 0}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              {createReview.isPending ? "Enviando..." : "Enviar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedRating(0);
                setComment("");
              }}
              className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:border-primary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando avaliações...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma avaliação ainda. Seja o primeiro a avaliar!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{review.customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <StarRating rating={review.rating} readonly />
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

