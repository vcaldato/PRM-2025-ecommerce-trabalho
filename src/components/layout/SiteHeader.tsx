import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { CartPreview } from "@/components/cart/CartPreview";

export const SiteHeader = () => {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          Loja Acadêmica
        </Link>
        <div className="relative" ref={panelRef}>
          <button
            type="button"
            onClick={() => setIsOpen((state) => !state)}
            className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-primary"
          >
            <ShoppingCart className="h-4 w-4" />
            Carrinho
            {totalItems > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </button>
          {isOpen && (
            <div className="absolute right-0 top-12">
              <CartPreview onClose={() => setIsOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


