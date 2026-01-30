import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { fetchProductById } from "../api/productsApi.js";
import { addToCart, formatCLP } from "../utils/cart.js";
import { getCurrentUser } from "../utils/auth.js";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function decodeHtmlEntities(input) {
  const s = String(input || "");
  // Si viene como HTML ya "normal", no tocamos nada.
  // Si viene escapado (&lt;p&gt;...), lo decodificamos para que se renderice.
  if (!s.includes("&lt;") && !s.includes("&#60;") && !s.includes("&amp;lt;")) return s;
  try {
    const el = document.createElement("textarea");
    el.innerHTML = s;
    return el.value;
  } catch {
    return s
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  }
}

function stripHtmlToText(html) {
  const raw = String(html || "");
  // En el browser podemos usar DOM para obtener texto limpio
  try {
    const el = document.createElement("div");
    el.innerHTML = raw;
    const txt = (el.textContent || el.innerText || "").replace(/\s+/g, " ").trim();
    return txt;
  } catch {
    return raw
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}

function splitDescription(html) {
  const raw = String(html || "");

  // ✅ Separador recomendado (copiar/pegar en CKEditor):
  // <!--more-->  ó  <!-- more -->
  // Usamos regex para soportar espacios/variantes.
  const moreRe = /<!--\s*more\s*-->/i;
  const moreMatch = raw.match(moreRe);
  if (moreMatch && typeof moreMatch.index === "number") {
    const i = moreMatch.index;
    const shortHtml = raw.slice(0, i).trim();
    const longHtml = raw.slice(i + moreMatch[0].length).trim();
    return {
      shortText: stripHtmlToText(shortHtml),
      shortHtml: shortHtml || "<p>Sin resumen</p>",
      longHtml: longHtml || shortHtml,
    };
  }

  // ✅ También soporta <hr> como separador
  const hrRe = /<hr\b[^>]*>/i;
  const hrMatch = raw.match(hrRe);
  if (hrMatch && typeof hrMatch.index === "number") {
    const i = hrMatch.index;
    const shortHtml = raw.slice(0, i).trim();
    const longHtml = raw.slice(i + hrMatch[0].length).trim();
    return {
      shortText: stripHtmlToText(shortHtml),
      shortHtml: shortHtml || "<p>Sin resumen</p>",
      longHtml: longHtml || shortHtml,
    };
  }

  // Fallback: crea un resumen "bonito" con el primer párrafo (si existe)
  let shortHtml = "";
  const firstP = raw.match(/<p\b[^>]*>[\s\S]*?<\/p>/i);
  if (firstP) shortHtml = firstP[0];
  if (!shortHtml) {
    const text = stripHtmlToText(raw);
    const shortText = text.length > 220 ? `${text.slice(0, 220)}…` : text;
    shortHtml = shortText ? `<p>${shortText}</p>` : "<p>Sin descripción</p>";
    return {
      shortText,
      shortHtml,
      longHtml: raw,
    };
  }

  return {
    shortText: stripHtmlToText(shortHtml),
    shortHtml,
    longHtml: raw,
  };
}

function normalizeProduct(p) {
  if (!p) return null;

  // Normaliza nombres típicos que vienen del backend
  const imageUrl = p.imageUrl ?? p.image_url ?? p.img ?? null;
  // Algunos endpoints pueden devolver la descripción HTML con nombres distintos
  // (por ejemplo: description, description_html, descriptionHTML, etc.)
  const descriptionHtml =
    p.descriptionHtml ??
    p.description_html ??
    p.descriptionHTML ??
    p.description ??
    "";

  const decodedDescriptionHtml = decodeHtmlEntities(descriptionHtml);

  let features = p.features;
  if (typeof features === "string") {
    try {
      features = JSON.parse(features);
    } catch {
      features = [];
    }
  }
  if (!Array.isArray(features)) features = [];

  return {
    ...p,
    imageUrl,
    descriptionHtml: decodedDescriptionHtml,
    features,
  };
}

/**
 * ProductoDetalle
 * - Carga el producto desde backend (/api/products/:id)
 * - Renderiza descriptionHtml (CKEditor v4) con HTML
 * - Botones: Agregar al carrito / Comprar ahora
 *   - Comprar ahora: si hay sesión -> /checkout, si no -> /registro?redirect=/checkout
 */
export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProductById(id);
        if (!alive) return;
        setProduct(normalizeProduct(data));
      } catch (e) {
        if (!alive) return;
        setError("No se pudo cargar el detalle del producto");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const priceLabel = useMemo(() => {
    if (!product) return "";
    return formatCLP(product.price);
  }, [product]);

  const desc = useMemo(() => splitDescription(product?.descriptionHtml), [product?.descriptionHtml]);

  // Animaciones (GSAP) — solo cuando ya hay producto cargado
  useLayoutEffect(() => {
    if (!product) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".ts-pd-hero", {
        opacity: 0,
        y: 18,
        duration: 0.55,
        ease: "power2.out",
      });

      gsap.from(".ts-pd-summary", {
        opacity: 0,
        x: 24,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.1,
      });

      gsap.from(".ts-pd-bottom", {
        opacity: 0,
        y: 24,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".ts-pd-bottom",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [product]);

  const handleAdd = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    const user = getCurrentUser();
    if (user) {
      navigate("/checkout");
    } else {
      navigate(`/registro?redirect=${encodeURIComponent("/checkout")}`);
    }
  };

  return (
    <>
      <NavbarMain />

      <main className="container my-5" ref={rootRef}>
        <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
          <Link to="/productos" className="btn btn-sm btn-outline-secondary">
            ⬅ Volver a productos
          </Link>
          <span className="text-muted small">Detalle</span>
        </div>

        {loading && <div className="alert alert-info">Cargando producto...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && product && (
          <>
          <div className="row g-4 ts-pd-top">
            <div className="col-12 col-lg-5">
              <div className="card">
                <img
                  src={product.imageUrl || "/img/productos4.jpg"}
                  className="card-img-top"
                  alt={product.name}
                  style={{ objectFit: "cover", maxHeight: 420 }}
                />
                <div className="card-body">
                  <div className="d-flex align-items-start gap-2">
                    <h3 className="m-0">{product.name}</h3>
                    {product.onSale ? (
                      <span className="badge text-bg-danger ms-auto">OFERTA</span>
                    ) : null}
                  </div>
                  <div className="text-muted small mt-1">Categoría: {product.category}</div>
                  <div className="mt-3">
                    <div className="fs-4 fw-bold">{priceLabel}</div>
                    <div className="small text-muted">Stock: {product.stock}</div>
                  </div>

                  {product.features?.length ? (
                    <ul className="list-unstyled small mt-3 mb-0">
                      {product.features.slice(0, 6).map((f) => (
                        <li key={f}>🟣 {f}</li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="d-flex gap-2 flex-wrap mt-4 ts-pd-actions">
                    <button className="btn btn-primary" type="button" onClick={handleAdd}>
                      Agregar al carrito
                    </button>
                    <button className="btn btn-success" type="button" onClick={handleBuyNow}>
                      Comprar ahora
                    </button>
                  </div>

                  {added && <div className="small fw-bold text-success mt-2">✔ Producto agregado</div>}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-7">
              <div className="card ts-pd-summary">
                <div className="card-body">
                  <h5 className="card-title">Resumen</h5>
                  {desc.shortHtml ? (
                    <div
                      className="ts-product-description"
                      dangerouslySetInnerHTML={{ __html: desc.shortHtml }}
                    />
                  ) : (
                    <p className="text-muted mb-2" style={{ lineHeight: 1.6 }}>
                      {desc.shortText ? desc.shortText : "Sin descripción"}
                    </p>
                  )}

                  <div className="d-flex gap-2 flex-wrap mt-3">
                    <a href="#detalle" className="btn btn-outline-dark btn-sm">
                      Ver descripción completa
                    </a>
                    <a href="#especificaciones" className="btn btn-outline-secondary btn-sm">
                      Ver sección inferior
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque inferior tipo "landing"/ficha técnica */}
          <section className="mt-5 ts-pd-bottom" id="especificaciones">
            <h3 className="text-center mb-3" style={{ letterSpacing: 0.5 }}>
              SEGÚN LAS ESPECIFICACIONES
            </h3>
            <p className="text-center text-muted small mb-4">
              Contenido avanzado desde CKEditor (puedes pegar HTML con imágenes, tablas, etc.).
            </p>

            <div className="card" id="detalle">
              <div className="card-body">
                <div
                  className="ts-product-description"
                  dangerouslySetInnerHTML={{ __html: desc.longHtml || product.descriptionHtml || "<p>Sin descripción</p>" }}
                />
              </div>
            </div>
          </section>
          </>
        )}

        {!loading && !error && !product && (
          <div className="alert alert-warning">Producto no encontrado.</div>
        )}
      </main>

      <Footer />
    </>
  );
}
