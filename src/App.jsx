import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "./pages/Home.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Productos from "./pages/Productos.jsx";
import ProductoMouse from "./pages/ProductoMouse.jsx";
import Carrito from "./pages/Carrito.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Categorias from "./pages/Categorias.jsx";
import Ofertas from "./pages/Ofertas.jsx";
import Checkout from "./pages/Checkout.jsx";
import PagoExitoso from "./pages/PagoExitoso.jsx";
import PagoError from "./pages/PagoError.jsx";

// Admin
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

/**
 * App.jsx
 * - Define rutas principales (React Router)
 * - Separa vistas públicas y panel administrador
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto-mouse" element={<ProductoMouse />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/pago-error" element={<PagoError />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Fallback simple */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
