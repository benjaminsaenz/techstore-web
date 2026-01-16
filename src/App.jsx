import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Productos from "./pages/Productos.jsx";
import ProductoMouse from "./pages/ProductoMouse.jsx";
import Carrito from "./pages/Carrito.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto-mouse" element={<ProductoMouse />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/*"element={ <AdminDashboard />
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

