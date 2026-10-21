
document.addEventListener("DOMContentLoaded", () => {

    // Productos seleccionados
    let carrito = [];

    // Elementos del HTML
    const botonesAgregar = document.querySelectorAll(".agregar-carrito");
    const listaCarrito = document.getElementById("lista-productos-carrito");
    const subtotalElemento = document.getElementById("subtotal-carrito");
    const totalElemento = document.getElementById("total-carrito");
    const contadores = document.querySelectorAll("#contador-carrito");
    const botonVaciar = document.querySelector(".boton-vaciar");
    const botonFinalizar = document.getElementById("finalizar-Compra");

    // Obtener productos desde las tarjetas del HTML
    const productos = {};

    document.querySelectorAll(".agregar-carrito").forEach((boton) => {
        const tarjeta = boton.closest(".card");
        const id = boton.dataset.id;

        productos[id] = {
            id: id,
            nombre: tarjeta.querySelector(".producto-nombre").textContent.trim(),
            precio: convertirPrecio(
                tarjeta.querySelector(".producto-precio").textContent
            ),
            imagen: tarjeta.querySelector("img").getAttribute("src")
        };
    });

    // Convertir "$110.000" en 110000
    function convertirPrecio(texto) {
        return Number(texto.replace(/[^\d]/g, ""));
    }

    // Formatear precios en pesos argentinos
    function formatoPrecio(precio) {
        return "$ " + precio.toLocaleString("es-AR");
    }

    // Agregar productos
    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = boton.dataset.id;
            const producto = productos[id];

            if (!producto) return;

            const existente = carrito.find(item => item.id === id);

            if (existente) {
                existente.cantidad++;
            } else {
                carrito.push({
                    ...producto,
                    cantidad: 1
                });
            }

            actualizarCarrito();
        });
    });

    // Dibujar el carrito
    function actualizarCarrito() {
        listaCarrito.innerHTML = "";

        if (carrito.length === 0) {
            listaCarrito.innerHTML = `
                <p class="carrito-vacio">
                    Tu carrito está vacío ♡
                </p>
            `;
        }

        carrito.forEach((producto) => {
            const elemento = document.createElement("div");

            elemento.className = "producto-carrito";

            elemento.innerHTML = `
                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    class="imagen-producto-carrito"
                >

                <div class="info-producto-carrito">
                    <h5>${producto.nombre}</h5>

                    <p>${formatoPrecio(producto.precio)}</p>

                    <div class="controles-cantidad">
                        <button
                            type="button"
                            class="cantidad-btn"
                            data-accion="restar"
                            data-id="${producto.id}"
                            aria-label="Restar una unidad"
                        >−</button>

                        <span>${producto.cantidad}</span>

                        <button
                            type="button"
                            class="cantidad-btn"
                            data-accion="sumar"
                            data-id="${producto.id}"
                            aria-label="Agregar una unidad"
                        >+</button>
                    </div>
                </div>

                <button
                    type="button"
                    class="eliminar-producto"
                    data-accion="eliminar"
                    data-id="${producto.id}"
                    aria-label="Eliminar ${producto.nombre}"
                    title="Eliminar producto"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            listaCarrito.appendChild(elemento);
        });

        // Calcular unidades y total
        const cantidadTotal = carrito.reduce(
            (suma, producto) => suma + producto.cantidad,
            0
        );

        const subtotal = carrito.reduce(
            (suma, producto) =>
                suma + producto.precio * producto.cantidad,
            0
        );

        contadores.forEach(contador => {
            contador.textContent = cantidadTotal;
        });

        subtotalElemento.textContent = formatoPrecio(subtotal);
        totalElemento.textContent = formatoPrecio(subtotal);
    }

    // Aumentar, disminuir o eliminar productos
    listaCarrito.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button[data-accion]");

        if (!boton) return;

        const id = boton.dataset.id;
        const accion = boton.dataset.accion;
        const producto = carrito.find(item => item.id === id);

        if (!producto) return;

        if (accion === "sumar") {
            producto.cantidad++;
        }

        if (accion === "restar") {
            producto.cantidad--;

            if (producto.cantidad <= 0) {
                carrito = carrito.filter(item => item.id !== id);
            }
        }

        if (accion === "eliminar") {
            carrito = carrito.filter(item => item.id !== id);
        }

        actualizarCarrito();
    });

    // Vaciar todo el carrito
    window.VaciarCarrito = function () {
        carrito = [];
        actualizarCarrito();
    };

    if (botonVaciar) {
        botonVaciar.addEventListener("click", window.VaciarCarrito);
    }

    // Finalizar compra
    if (botonFinalizar) {
        botonFinalizar.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("Tu carrito está vacío. Agregá algún producto.");
                return;
            }

            let mensaje = "¡Gracias por elegir LUMÉ! ♡\n\n";
            mensaje += "Detalle de tu compra:\n\n";

            carrito.forEach(producto => {
                mensaje += `${producto.nombre} x${producto.cantidad}`;
                mensaje += ` — ${formatoPrecio(
                    producto.precio * producto.cantidad
                )}\n`;
            });

            const total = carrito.reduce(
                (suma, producto) =>
                    suma + producto.precio * producto.cantidad,
                0
            );

            mensaje += `\nTOTAL: ${formatoPrecio(total)}`;

            alert(mensaje);
        });
    }

    // Mostrar el carrito vacío al cargar la página
    actualizarCarrito();

});