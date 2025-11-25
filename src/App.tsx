import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CartProvider } from "@/store/cart";
import { HomePage } from "@/pages/HomePage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50">
        <SiteHeader />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/produto/:id" element={<ProductDetailPage />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </CartProvider>
  );
}

export default App;

