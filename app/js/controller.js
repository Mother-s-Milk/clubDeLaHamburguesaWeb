const controller = {
    comidas: [],
    papas: [],
    bebidas: [],
    currentCategoria: "comidas",
    masVendida: {
        id: 0,
        nombre: '',
        categoria: '',
        precioUnitario: 0,
        urlImagen: '',
        cantidad: 1
    },
    consultarHamburguesaMasVendida: () => {
        service.consultarHamburguesaMasVendida()
            .then(response => {
                controller.masVendida.id = response.id;
                controller.masVendida.nombre = response.nombre;
                controller.masVendida.categoria = response.categoria;
                controller.masVendida.precioUnitario = response.precioUnitario;
                controller.masVendida.urlImagen = response.urlImagen;
                controller.renderMasVendida(controller.masVendida);
        });
    },
    renderMasVendida: (masVendida) => {
        let masVendidaHeroMain = document.getElementById('mas-vendida-hero-main');

        if (!masVendida) {
            alert('Mas vendida vacio');
            return;
        }
        masVendidaHeroMain.innerHTML = '';

        let masVendidaTarjeta = `
            <div class="tarjeta-mas-vendida-info">
                <header>
                    <h1>Te presentamos a la más pedida del Club: la <span class="nombre-mas-pedida">Cuarto de libra simple</span></h1>
                </header>
                <main>
                    <p>${masVendida.descripcion || "¡Una fiesta de sabores! ¡No te la podés perder!"}</p>
                </main>
                <footer>
                    <button type="button" class="btn-mas-pedida" data-categoria="Plato principal">Añadir al carrito</button>
                </footer>
            </div>
            <div class="tarjeta-mas-vendida-img">
                <img src="${masVendida.urlImagen}" alt="Imagen de ${masVendida.nombre}">
            </div>
        `;
        masVendidaHeroMain.insertAdjacentHTML("beforeend", masVendidaTarjeta);
        let botonMasVendida = document.querySelector(".btn-mas-pedida");

        botonMasVendida.addEventListener("click", (event) => {
            let productoId = masVendida.id;
            let productoNombre = masVendida.nombre;
            let productoCategoria = event.target.dataset.categoria;
            let productoPrecioUnitario = masVendida.precioUnitario;
            let productoUrlImagen = masVendida.urlImagen;
            
            carritoController.save(productoId, productoNombre, productoCategoria, productoPrecioUnitario, productoUrlImagen);
        });
    },
    solicitarProductos: () => {
        controller.consultarPlatosPrincipales();
    },
    consultarPlatosPrincipales: () => {
        service.consultarPlatosPrincipales()
            .then(response => {
                console.log(response);
                controller.comidas = response;
                controller.consultarPapas();
        });
    },
    consultarPapas: () => {
        service.consultarPapas()
            .then(response => {
                controller.papas = response;
                controller.consultarBebidas();
        });
    },
    consultarBebidas: () => {
        service.consultarBebidas()
            .then(response => {
                controller.bebidas = response;
                controller.imprimirProductos(controller.comidas);
        });
    },
    imprimirProductos: (productos) => {
        let maxItems = window.innerWidth <= 997 ? 4 : 6;
        let currentPage = 1; // Página actual
        let paginador = document.getElementById('paginador');
        let gridMenu = document.getElementById('grid-menu');
    
        const renderizar = () => {
            gridMenu.innerHTML = ""; // Limpia el contenido
            paginador.innerHTML = ""; // Limpia el paginador para evitar duplicados
    
            let totalPages = Math.ceil(productos.length / maxItems);
            if (totalPages === 0) return; // No mostrar nada si no hay elementos
    
            let startIndex = (currentPage - 1) * maxItems;
            let itemsAMostrar = productos.slice(startIndex, startIndex + maxItems);

            let contenidoHTML = itemsAMostrar.map(producto => `
                <div class="tarjeta-menu">
                    <img src="${producto.urlImagen}" alt="">
                    <div class="info-burger">
                        <p>${producto.nombre}</p>
                        <p>$${producto.precioUnitario}</p>
                    </div>
                    <div class="botones-burger">
                        <button type="button" class="btn-pizza-card btn-agregar" 
                            data-id="${producto.id}" data-nombre="${producto.nombre}" 
                            data-precio-unitario="${producto.precioUnitario}" data-categoria="${producto.categoria}" 
                            data-urlImagen="${producto.urlImagen}" 
                            aria-label="Agregar ${producto.nombre} al carrito">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <button type="button"><i class="fa-solid fa-eye"></i></button> 
                    </div>
                </div>
            `).join('');

            gridMenu.innerHTML = contenidoHTML;

            paginador.innerHTML = `
                <button id="btn-prev" ${currentPage === 1 ? "disabled" : ""}>
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <span>Pág. ${currentPage} de ${totalPages}</span>
                <button id="btn-next" ${currentPage === totalPages ? "disabled" : ""}>
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            `;

            document.getElementById("btn-prev").onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderizar();
                }
            };

            document.getElementById("btn-next").onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderizar();
                }
            };

            // Asignar eventos a los botones "Agregar al carrito"
            document.querySelectorAll(".btn-agregar").forEach((boton) => {
                boton.addEventListener("click", () => {
                    let productoId = parseInt(boton.dataset.id);
                    let productoNombre = boton.dataset.nombre;
                    let productoCategoria = boton.dataset.categoria;
                    let productoPrecioUnitario = parseFloat(boton.dataset.precioUnitario);
                    let productoUrlImagen = boton.dataset.urlimagen;

                    console.log(productoId, productoNombre, productoPrecioUnitario, productoCategoria, productoUrlImagen);

                    carritoController.save(productoId, productoNombre, productoCategoria, productoPrecioUnitario, productoUrlImagen);
                });
            });
        };
    
        renderizar();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carritoController.list();

    const navbar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("toggle-button");

    toggleButton.addEventListener("click", () => {
        navbar.classList.toggle('collapsed');
    });

    controller.consultarHamburguesaMasVendida();
    
    controller.solicitarProductos();
    
    const btnComidasFiltro = document.getElementById('btn-comidas-filtro');
    const btnPapasFiltro = document.getElementById('btn-papas-filtro');
    const btnBebidasFiltro = document.getElementById('btn-bebidas-filtro');

    if (btnComidasFiltro != null) {
        btnComidasFiltro.onclick = () => {
            controller.imprimirProductos(controller.comidas);
            btnComidasFiltro.classList.add("active");
            btnPapasFiltro.classList.remove("active");
            btnBebidasFiltro.classList.remove("active");
            controller.currentCategoria = "comidas";
        };
    }
    
    if (btnPapasFiltro != null) {
        btnPapasFiltro.onclick = () => {
            controller.imprimirProductos(controller.papas);
            btnPapasFiltro.classList.add("active");
            btnComidasFiltro.classList.remove("active");
            btnBebidasFiltro.classList.remove("active");
            controller.currentCategoria = "papas";
        };
    }

    if (btnBebidasFiltro != null) {
        btnBebidasFiltro.onclick = () => {
            controller.imprimirProductos(controller.bebidas);
            btnBebidasFiltro.classList.add("active");
            btnComidasFiltro.classList.remove("active");
            btnPapasFiltro.classList.remove("active");
            controller.currentCategoria = "bebidas";
        }; 
    }

    /*Desplazamiento a la seccion de menu al presionar el boton del hero*/
    document.getElementById("btn-ver-menu").addEventListener("click", function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
    
        // Desplazamiento suave hacia la sección "section-menu"
        document.querySelector("#section-menu").scrollIntoView({
            behavior: "smooth"
        });
    });

    /*Carrito de compras*/
    carritoController.actualizarContador();
    const carrito = document.querySelector(".carrito-container");
    const btnAbrirCarrito = document.querySelector("#cart-button"); // Botón que abre el carrito
    const btnCerrarCarrito = carrito.querySelector("header button");

    // Función para abrir el carrito
    function abrirCarrito() {
        carrito.classList.add("show");
        carritoController.list();
    }

    // Función para cerrar el carrito
    function cerrarCarrito() {
        carrito.classList.remove("show");
    }

    // Event listeners
    btnAbrirCarrito.addEventListener("click", abrirCarrito);
    btnCerrarCarrito.addEventListener("click", cerrarCarrito);

    /**/
    let header = document.querySelector('.header');

    function checkScrollAndAnimations () {
        const scrollPosition = window.scrollY;

        if (scrollPosition > 0) {
            header.classList.add('scrolled');
            
        } else {
            header.classList.remove('scrolled');
        }
        
    }

    //Ejecutar la función cuando la página cargue
    window.addEventListener('load', checkScrollAndAnimations);
    //Ejecutar la función en cada evento de desplazamiento (scroll)
    window.addEventListener('scroll', checkScrollAndAnimations);
    
});