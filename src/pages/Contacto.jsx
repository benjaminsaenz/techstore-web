import NavbarMain from "../components/NavbarMain.jsx";


export default function Contacto() {
  const validarContacto = (e) => {
    e.preventDefault();
    // TODO: conectar tu app.js luego
  };

  return (
    <>
      <NavbarMain />

      <section className="hero-contacto d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-body">
                  <h3 className="text-center mb-3">Contáctanos</h3>

                  <form onSubmit={validarContacto}>
                    <div className="mb-3">
                      <label>Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        className="form-control"
                        placeholder="Tu nombre"
                      />
                      <small id="msgNombre" className="text-danger"></small>
                    </div>

                    <div className="mb-3">
                      <label>Correo</label>
                      <input
                        type="email"
                        id="correo"
                        className="form-control"
                        placeholder="correo@ejemplo.cl"
                      />
                      <small id="msgCorreo" className="text-danger"></small>
                    </div>

                    <div className="mb-3">
                      <label>Mensaje</label>
                      <textarea
                        id="mensaje"
                        className="form-control"
                        rows="4"
                        placeholder="Escribe tu mensaje"
                      ></textarea>
                      <small id="msgMensaje" className="text-danger"></small>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                      Enviar mensaje
                    </button>

                    <p id="msgFinalContacto" className="mt-3 fw-bold text-center"></p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
