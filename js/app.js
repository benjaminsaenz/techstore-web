// Mensaje para confirmar que el archivo JS se cargó correctamente
console.log("JS cargado correctamente");


// ================================
// VALIDACIÓN DEL FORMULARIO
// ================================
function validarFormulario() {

    // Obtener valores del formulario
    var correo = document.getElementById("correo").value.trim();
    var password = document.getElementById("password").value.trim();
    var rut = document.getElementById("rut").value.trim();
    var telefono = document.getElementById("telefono").value.trim();
    var ciudad = document.getElementById("ciudad").value;
    var direccion = document.getElementById("direccion").value.trim();

    // Expresión regular para validar formato de RUT chileno
    var rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;

    // Limpiar mensajes de error anteriores
    document.getElementById("msgCorreo").textContent = "";
    document.getElementById("msgPassword").textContent = "";
    document.getElementById("msgRut").textContent = "";
    document.getElementById("msgTelefono").textContent = "";
    document.getElementById("msgCiudad").textContent = "";
    document.getElementById("msgDireccion").textContent = "";
    document.getElementById("msgFinal").textContent = "";

    // Validación del correo
    if (correo === "") {
        document.getElementById("msgCorreo").textContent = "El correo es obligatorio";
        return false;
    }

    // Validación de la contraseña
    if (password.length < 6) {
        document.getElementById("msgPassword").textContent = "Mínimo 6 caracteres";
        return false;
    }

    // Validación del RUT
    if (!rutRegex.test(rut)) {
    document.getElementById("msgRut").textContent = "Formato de RUT inválido";
    return false;
    }   

    if (!validarRutModulo11(rut)) {
    document.getElementById("msgRut").textContent = "RUT inválido (módulo 11)";
    return false;
}


    if (!rutRegex.test(rut)) {
        document.getElementById("msgRut").textContent = "Formato de RUT inválido";
        return false;
    }

    // Validación del teléfono
    if (telefono === "" || isNaN(telefono)) {
        document.getElementById("msgTelefono").textContent = "Teléfono inválido";
        return false;
    }

    // Validación de la ciudad
    switch (ciudad) {
        case "Santiago":
        case "Valparaíso":
        case "Concepción":
            console.log("Ciudad válida");
            break;
        default:
            document.getElementById("msgCiudad").textContent = "Seleccione una ciudad";
            return false;
    }

    // Validación de la dirección
    if (direccion === "") {
        document.getElementById("msgDireccion").textContent = "La dirección es obligatoria";
        return false;
    }

 // Mensaje final si todo está correcto
document.getElementById("msgFinal").textContent =
    "Registro completado correctamente ✔";
document.getElementById("msgFinal").classList.add("text-success");

console.log("Formulario validado correctamente");

// Limpiar formulario
document.querySelector("form").reset();

// Evitar recarga de la página
return false;


}


// ================================
// FILTRO DE PRODUCTOS POR CATEGORÍA
// ================================
function filtrarProductos() {

    var categoriaSeleccionada = document.querySelector("select").value;
    var productos = document.getElementsByClassName("producto");

    for (var i = 0; i < productos.length; i++) {

        var categoriaProducto = productos[i].getAttribute("data-categoria");

        if (categoriaSeleccionada === "todos" || categoriaSeleccionada === categoriaProducto) {
            productos[i].style.display = "block";
        } else {
            productos[i].style.display = "none";
        }
    }

    // Actualiza el contador después de filtrar
    actualizarContador();
}


// ================================
// BÚSQUEDA DE PRODUCTOS POR TEXTO
// ================================
function buscarProducto(texto) {

    var productos = document.getElementsByClassName("producto");
    texto = texto.toLowerCase();

    for (var i = 0; i < productos.length; i++) {

        var nombreProducto = productos[i].innerText.toLowerCase();

        if (nombreProducto.includes(texto)) {
            productos[i].style.display = "";
        } else {
            productos[i].style.display = "none";
        }
    }

    // Actualiza el contador después de buscar
    actualizarContador();
}


// ================================
// CONTADOR DE PRODUCTOS VISIBLES
// ================================
function actualizarContador() {

    var productos = document.getElementsByClassName("producto");
    var contador = 0;

    for (var i = 0; i < productos.length; i++) {
        if (productos[i].style.display !== "none") {
            contador++;
        }
    }

    // Mostrar cantidad de productos visibles
    document.getElementById("contador").textContent = contador;
}
// ================================
// VALIDAR RUT CHILENO (MÓDULO 11)
// ================================
function validarRutModulo11(rut) {

    rut = rut.replace(/\./g, "").replace("-", "");

    var cuerpo = rut.slice(0, -1);
    var dv = rut.slice(-1).toUpperCase();

    var suma = 0;
    var multiplo = 2;

    for (var i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplo * cuerpo.charAt(i);
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    var dvEsperado = 11 - (suma % 11);

    dvEsperado = dvEsperado === 11 ? "0" :
                 dvEsperado === 10 ? "K" :
                 dvEsperado.toString();

    return dv === dvEsperado;
}
// ================================
// MENSAJE PRODUCTO AGREGADO EN CARD
// ================================
function agregarProducto(boton) {

    // Buscamos el mensaje dentro de la misma card
    var mensaje = boton.nextElementSibling;

    // Mostrar mensaje
    mensaje.classList.remove("d-none");

    // Ocultarlo después de 2 segundos
    setTimeout(function () {
        mensaje.classList.add("d-none");
    }, 2000);

    console.log("Producto agregado");
}
// ================================
// LOGIN ADMINISTRADOR (SIMULADO)
// ================================
function validarAdmin() {

    var correo = document.getElementById("adminCorreo").value.trim();
    var password = document.getElementById("adminPassword").value.trim();

    var msgCorreo = document.getElementById("msgAdminCorreo");
    var msgPassword = document.getElementById("msgAdminPassword");
    var msgFinal = document.getElementById("msgAdminFinal");

    // Limpiar mensajes
    msgCorreo.textContent = "";
    msgPassword.textContent = "";
    msgFinal.textContent = "";

    // Credenciales simuladas
    var correoAdmin = "admin@techstore.cl";
    var passAdmin = "admin123";

    if (correo === "") {
        msgCorreo.textContent = "El correo es obligatorio";
        return false;
    }

    if (password === "") {
        msgPassword.textContent = "La contraseña es obligatoria";
        return false;
    }

    if (correo === correoAdmin && password === passAdmin) {
        msgFinal.textContent = "Acceso administrador exitoso ✔";
        msgFinal.classList.add("text-success");

        // Redirección al panel admin
        setTimeout(function () {
            window.location.href = "admin.html";
        }, 1000);

        return false;
    } else {
        msgFinal.textContent = "Credenciales incorrectas";
        msgFinal.classList.add("text-danger");
        return false;
    }
}
// ================================
// FINALIZAR COMPRA (SIMULADO)
// ================================
function finalizarCompra() {

    var mensaje = document.getElementById("msgCompra");

    // Mostrar mensaje
    mensaje.classList.remove("d-none");

    console.log("Simulación de redirección a pago");

    // Opcional: ocultarlo después de unos segundos
    setTimeout(function () {
        mensaje.classList.add("d-none");
    }, 2000);
}








