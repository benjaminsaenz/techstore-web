import { Link } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin.jsx";
import { isAdmin } from "./AdminLogin.jsx";

export default function AdminPanel() {
  if (!isAdmin()) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4 className="alert-heading">Acceso restringido</h4>
          <p>Debes iniciar sesión como administrador para ver esta página.</p>
          <Link to="/admin-login" className="btn btn-danger">
            Ir al Login Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarAdmin />

      <div className="container my-5">
        <h3 className="mb-3">Gestión de Productos</h3>

        <p className="text-muted">Sección destinada a la administración del catálogo de productos.</p>

        <div className="table-responsive mb-4">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>P001</td>
                <td>Teclado Gamer</td>
                <td>Teclado</td>
                <td>$39.990</td>
                <td>15</td>
                <td>
                  <button className="btn btn-sm btn-warning" type="button">
                    Editar
                  </button>{" "}
                  <button className="btn btn-sm btn-danger" type="button">
                    Eliminar
                  </button>
                </td>
              </tr>

              <tr>
                <td>P002</td>
                <td>Mouse Gamer</td>
                <td>Mouse</td>
                <td>$19.990</td>
                <td>30</td>
                <td>
                  <button className="btn btn-sm btn-warning" type="button">
                    Editar
                  </button>{" "}
                  <button className="btn btn-sm btn-danger" type="button">
                    Eliminar
                  </button>
                </td>
              </tr>

              <tr>
                <td>P003</td>
                <td>Audífonos Gamer</td>
                <td>Audífonos</td>
                <td>$29.990</td>
                <td>20</td>
                <td>
                  <button className="btn btn-sm btn-warning" type="button">
                    Editar
                  </button>{" "}
                  <button className="btn btn-sm btn-danger" type="button">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="btn btn-secondary mb-5" type="button">
          Agregar nuevo producto
        </button>

        <h3 className="mb-3">Gestión de Clientes y Compras</h3>

        <p className="text-muted">Visualización de clientes registrados y sus compras.</p>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Correo</th>
                <th>Dirección</th>
                <th>Región</th>
                <th>Comuna</th>
                <th>Productos Comprados</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>cliente1@email.cl</td>
                <td>Av. Siempre Viva 123</td>
                <td>Región Metropolitana</td>
                <td>Santiago</td>
                <td>Teclado Gamer, Mouse Gamer</td>
                <td>
                  <span className="badge bg-success">Compra aceptada</span>
                </td>
              </tr>

              <tr>
                <td>cliente2@email.cl</td>
                <td>Los Carrera 456</td>
                <td>Biobío</td>
                <td>Concepción</td>
                <td>Audífonos Gamer</td>
                <td>
                  <span className="badge bg-warning text-dark">Pendiente</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
