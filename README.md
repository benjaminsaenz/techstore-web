# TechStore (React + Vite)

Proyecto frontend (sin backend) de una tienda de accesorios tecnológicos.

## ✅ Tecnologías
- **Vite + React** (SPA)
- **React Router** (rutas)
- **Bootstrap 5** (diseño responsivo)
- **Axios** (API interna leyendo JSON)
- **Vitest + Testing Library** (pruebas unitarias)
- **LocalStorage** (persistencia simulada)

## ▶️ Cómo ejecutar
```bash
npm install
npm run dev
```

## ✅ Tests
```bash
npm run test          # modo interactivo
npm run test:run      # una sola vez
npm run test:coverage # reporte de cobertura
```

---

## 📁 Estructura del proyecto (mapa rápido)
```
public/
  data/products.json       # "API interna" (catálogo)
  img/...                  # imágenes

src/
  api/productsApi.js       # llamada Axios al JSON
  hooks/useProducts.js     # hook que consume la API interna

  components/
    NavbarMain.jsx         # navbar principal (carrito + menú)
    Footer.jsx             # footer
    ReceiptCard.jsx        # boleta (reutilizable)

  pages/
    Home.jsx
    Productos.jsx          # catálogo + filtros + agregar al carrito
    Categorias.jsx         # vista extra (link a /productos?cat=...)
    Ofertas.jsx            # vista extra (usa onSale en products.json)
    Carrito.jsx            # carrito + botones simulación pago
    Checkout.jsx           # formulario + aprobar/rechazar
    PagoExitoso.jsx        # muestra boleta aprobada
    PagoError.jsx          # muestra boleta rechazada

    admin/
      AdminDashboard.jsx   # panel administrador (sidebar)
      AdminClientes.jsx    # CRUD clientes (localStorage)
      AdminProductos.jsx   # CRUD productos (localStorage)
      AdminVentas.jsx      # lista ventas (se llena al aprobar compra)
      adminStore.js        # "BD" simulada (localStorage + seed)

  utils/
    cart.js                # carrito (localStorage)
    checkout.js            # boletas + registrar venta
    validation.js          # validaciones (usadas en forms)

  test/
    setupTests.js          # jest-dom para Testing Library
```

---

## 💾 Persistencia (LocalStorage keys)
Estas son las claves principales usadas por el proyecto:

- `techstore_cart_v1` → carrito
- `techstore_last_receipt_v1` → última boleta (aprobada/rechazada)
- `techstore_is_admin_v1` → sesión admin (simulada)

Admin:
- `admin_products_v1` → productos administrables
- `admin_clients_v1` → clientes administrables
- `admin_sales_v1` → ventas (se agregan cuando la compra es **APROBADA**)

---

## 🧠 Cómo funciona la “API interna”
No hay backend. El catálogo se lee desde:
- `public/data/products.json`

Se consume así:
- `src/api/productsApi.js` → `axios.get("/data/products.json")`
- `src/hooks/useProducts.js` → expone `{ products, loading, error }`

---

## 🧾 Flujo de compra (simulado)
- En **Carrito** puedes:
  - modificar cantidad
  - eliminar
  - ir a **/checkout**
  - o simular **Compra aprobada / Pago rechazado**

Cuando es **APROBADA**:
- se genera una boleta (`checkout.js`)
- se guarda en `techstore_last_receipt_v1`
- se registra una venta en `admin_sales_v1`
- se vacía el carrito

Cuando es **RECHAZADA**:
- se genera comprobante
- no se vacía el carrito

---

## 🧪 Pruebas unitarias
Se incluyen pruebas sobre:
- validaciones (precio/stock/email)
- lógica de carrito
- lógica de checkout/boleta
- UI básica del carrito (render + click)

Archivos de tests (ejemplos):
- `src/utils/validation.test.js`
- `src/utils/cart.test.js`
- `src/utils/checkout.test.js`
- `src/pages/Carrito.test.jsx`

---

## ✍️ Notas para la evaluación
- Proyecto **sin backend**: persistencia via LocalStorage.
- Código comentado en archivos clave (`App.jsx`, `Carrito.jsx`, `checkout.js`, etc.).
- Estructura por carpetas para ubicar rápido cada funcionalidad.
