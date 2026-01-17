import NavbarMain from "../components/NavbarMain.jsx";

export default function Nosotros() {
  const onBuscar = (e) => e.preventDefault();

  return (
    <>
      <NavbarMain />

      <main className="container my-5">
        <h2 className="text-center mb-4">Sobre Nosotros</h2>

        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <img
              src="/img/nosotros1.jpg"
              className="img-fluid rounded shadow"
              alt="Tecnología y accesorios"
            />
          </div>

          <div className="col-md-6">
            <p>
              TechStore nace con la pasión por la tecnología y el deseo de acercar
              los mejores accesorios tecnológicos a las personas. Comenzamos como
              una idea simple: ofrecer productos confiables, modernos y accesibles.
            </p>
          </div>
        </div>

        <div className="row align-items-center mb-5 flex-md-row-reverse">
          <div className="col-md-6">
            <img
              src="/img/nosotros2.jpg"
              className="img-fluid rounded shadow"
              alt="Equipo de trabajo"
            />
          </div>

          <div className="col-md-6">
            <p>
              Nos especializamos en la venta de accesorios tecnológicos cuidadosamente
              seleccionados, pensados para acompañar el ritmo de un mundo cada vez
              más conectado.
            </p>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src="/img/nosotros3.jpg"
              className="img-fluid rounded shadow"
              alt="Clientes satisfechos"
            />
          </div>

          <div className="col-md-6">
            <p>
              Nuestro compromiso es brindar calidad, buen servicio y una atención
              cercana, ayudando a nuestros clientes a encontrar exactamente lo que necesitan.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
