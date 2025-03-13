let cartProduct = {
    id: 0,
    nombre: '',
    categoria: '',
    precioUnitario: 0,
    urlImg: '',
    cantidad: 0
}

const carritoController = {
    pedido: {
        nombre: '',
        tipoPedido: '',
        direccion: '' ,
        metodoPago: '' ,
        detallesPedido: ''
    },
    save: (id, nombre, categoria, precioUnitario, urlImagen) => {
        let productos = carritoService.list();
        console.log("Productos en el carrito:", productos);
    
        // Verificar si ya existe un producto con el mismo ID y Nombre
        let existe = productos.find(producto => producto.id === id && producto.nombre === nombre);
    
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false,
            customClass: {
                popup: 'custom-toast'
            },
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
    
        if (existe) {
            console.log(`El producto ${nombre} ya existe. Incrementando cantidad...`);
            carritoController.agregarUno(id, nombre);
            Toast.fire({
                icon: 'success',
                title: `Se ha agregado ${nombre}`
            });
        } else {
            let newProduct = {
                id: id,
                nombre: nombre,
                categoria: categoria,
                precioUnitario: Number(precioUnitario),
                urlImagen: urlImagen,
                cantidad: 1
            };
            console.log("Guardando nuevo producto:", newProduct);
            carritoService.save(newProduct);
            Toast.fire({
                icon: 'success',
                title: `${nombre} se ha agregado al carrito`
            });
        }
    
        carritoController.actualizarContador();
        carritoController.list();
    },
    list: () => {
        let productosCarrito = carritoService.list();
        let carritoFooter = document.getElementById('carrito-footer');

        // Mostrar u ocultar el pie del carrito
        carritoFooter.classList.toggle('hidden', productosCarrito.length === 0);

        // Crear un objeto para organizar productos por categorías
        let categorias = {
            "Plato principal": [],
            "Acompañante": [],
            "Bebida": []
        };

        productosCarrito.forEach(producto => {
            if (categorias[producto.categoria]) {
                categorias[producto.categoria].push(producto);
            }
        });

        let total = 0;

        // Función que genera HTML para cada categoría
        const generarHTMLCategoria = (categoria, productos, contenedor) => {
            contenedor.innerHTML = '';
            if (productos.length > 0) {
                productos.forEach(producto => {
                    let tarjeta = `
                    <div class="tarjeta-carrito">
                        <img src="${producto.urlImagen}" alt="${producto.nombre}">
                        <div>
                            <div class="info-producto">
                                <p>${producto.nombre}</p>
                                <p>Precio: $${producto.precioUnitario}</p>
                            </div>
                            <div class="botones-producto-carrito">
                                <button type="button" class="plus-minus agregar-borrar" onclick="carritoController.restarUno(${producto.id}, '${producto.nombre}')"><i class="fa-solid fa-minus"></i></button>
                                <div class="cart-cantidad">${producto.cantidad}</div>
                                <button type="button" class="plus-minus" onclick="carritoController.agregarUno(${producto.id}, '${producto.nombre}')"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <button type="button" class="btn-trash" onclick="carritoController.delete(${producto.id}, '${producto.nombre}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                    `;
                    contenedor.insertAdjacentHTML('beforeend', tarjeta);
                    total += producto.precioUnitario * producto.cantidad;
                });
            } else {
                contenedor.innerHTML = `<h2 class="mensaje-categoria-carro">No hay ${categoria.toLowerCase()} cargados</h2>`;
            }
        };

        // Actualiza las categorías
        generarHTMLCategoria("Platos principales", categorias["Plato principal"], document.getElementById('platos-principales-carrito'));
        generarHTMLCategoria("Acompañantes", categorias["Acompañante"], document.getElementById('acompañantes-carrito'));
        generarHTMLCategoria("Bebidas", categorias["Bebida"], document.getElementById('bebidas-carrito'));

        // Actualiza los totales
        let totalProductos = document.getElementById('total-productos');
        if (totalProductos) totalProductos.textContent = `$${total.toFixed(2)}`;

        let totalCarrito = document.getElementById('total-carrito');
        if (totalCarrito) totalCarrito.textContent = `$${total.toFixed(2)}`;
    },
    delete: (id, nombre) => {
        console.log('Eliminando ' + id + " " + nombre);
        carritoService.delete(id, nombre);
        carritoController.actualizarContador();
        carritoController.list();
    },
    actualizarContador: () => {
        let count = document.getElementById('cart-count');
        let carrito = carritoService.list();
        let carritoCount = carrito.length;
        count.textContent = carritoCount;
    },
    clear: () => {
        carritoService.clear();
        carritoController.list();
        carritoController.actualizarContador();
    },
    agregarUno: (id, nombre) => {
        carritoService.agregarUno(id, nombre);
        carritoController.list();
    },
    restarUno: (id) => {
        carritoService.restarUno(id);
        carritoController.list();
    },
    validacion: (pedido) => {
        const errores = {};
    
        if (!pedido.nombre.trim()) {
            errores.nombre = "El nombre es obligatorio.";
        }
    
        if (!pedido.tipoPedido.trim()) {
            errores.tipoPedido = "Debe seleccionar un tipo.";
        }

        if (!pedido.direccion.trim()) {
            errores.direccion = "Debe ingresar una dirección.";
        }

        if (!pedido.metodoPago.trim()) {
            errores.metodoPago = "Debe seleccionar un método de pago.";
        }

        return errores;
    },
    mostrarErrores: (errores) => {
        document.getElementById("error-pedido-nombre").textContent = errores.nombre || "";
        document.getElementById("error-pedido-tipo").textContent = errores.tipoPedido || "";
        document.getElementById("error-pedido-direccion").textContent = errores.direccion || "";
        document.getElementById("error-pedido-metodo-pago").textContent = errores.metodoPago || "";
    },
    limpiarCamposErrores: () => {
        const camposError = document.querySelectorAll(".error");
        camposError.forEach((campo) => {
            campo.textContent = "";
        });
    },
    enviarMensaje: () => {
        carritoController.pedido.nombre = document.getElementById('pedido-nombre').value;
        carritoController.pedido.tipoPedido = document.getElementById('pedido-tipo').value;
        carritoController.pedido.direccion = document.getElementById('pedido-direccion').value;
        carritoController.pedido.metodoPago = document.getElementById('pedido-metodo-pago').value;
        carritoController.pedido.detallesPedido = document.getElementById('pedido-detalles').value;

        //Validar datos
        const validacionErrores = carritoController.validacion(carritoController.pedido);

        if (Object.keys(validacionErrores).length > 0) {
            carritoController.mostrarErrores(validacionErrores);
      
            return;
        }
    
        carritoController.limpiarCamposErrores();

        if (carritoController.pedido.detallesPedido === '') {
            carritoController.pedido.detallesPedido = '-';
        }
    
        const productos = carritoService.list();
    
        // Mapeo de nombres de categorías
        const categorias = {
            "Plato principal": "Hamburguesas",
            "Acompañante": "Acompañantes",
            "Bebida": "Bebidas"
        };
    
        // Función para formatear productos por categoría
        const formatearProductos = (categoriaKey) => {
            const items = productos
                .filter(item => item.categoria === categoriaKey)
                .map(item => `- *${item.nombre}* (x${item.cantidad}) - $${item.precioUnitario}`)
                .join('\n');
    
            return items ? `*${categorias[categoriaKey]}:*\n${items}\n` : '';
        };
    
        const hamburguesas = formatearProductos("Plato principal");
        const papas = formatearProductos("Acompañante");
        const bebidas = formatearProductos("Bebida");
    
        const precioTotal = productos.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
    
        const mensaje = 
            `*Club de la Hamburguesa - Nuevo Pedido*\n` +
            `--------------------------------------------\n` +
            `*Detalles del Pedido*\n` +
            `- *Tipo de pedido:* ${carritoController.pedido.tipoPedido}\n` +
            `- *Nombre:* ${carritoController.pedido.nombre}\n` +
            `- *Dirección:* ${carritoController.pedido.direccion}\n` +
            `- *Método de pago:* ${carritoController.pedido.metodoPago}\n` +
            `- *Detalles:* ${carritoController.pedido.detallesPedido}\n` +
            `--------------------------------------------\n` +
            `${hamburguesas}${papas}${bebidas}` +
            `--------------------------------------------\n` +
            `*Total a Pagar:* $${precioTotal.toFixed(2)}\n` +
            `--------------------------------------------\n`;
    
        const numeroWhatsApp = '5492975488673'; // Reemplaza con el número de WhatsApp del negocio
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
        // Abrir WhatsApp
        window.open(url, '_blank');

        //carritoController.clear();
    }

}

document.addEventListener("DOMContentLoaded", () => {
    //carritoController.clear();

    let carritoProductos = document.getElementById('carrito-section-productos');
    let carritoFormulario = document.getElementById('carrito-formulario-section');

    let botonesProductos = document.getElementById('botones-productos');
    let botonesFormulario = document.getElementById('botones-formulario');

    let btnConfirmarPedido = document.getElementById('btn-confirmar-pedido');

    if (btnConfirmarPedido != null) {
        btnConfirmarPedido.onclick = () => {
            carritoProductos.classList.add('hidden');
            //carritoProductos.classList.remove('show');

            carritoFormulario.classList.remove('hidden');
            //carritoFormulario.classList.add('show');

            botonesProductos.classList.add('hidden');
            botonesFormulario.classList.remove('hidden');
        }
    }

    let carritoContainer = document.querySelector('.carrito-container');

    let btnCerrarCarrito = document.querySelectorAll('.btn-cerrar-carrito');
    btnCerrarCarrito.forEach(btn => {
        btn.addEventListener('click', () => {
            carritoContainer.classList.remove('show');
        });
    });

    let btnVolver = document.getElementById('btn-volver');

    if (btnVolver != null) {
        btnVolver.onclick = () => {
            carritoFormulario.classList.add('hidden');
            //carritoFormulario.classList.remove('show');

            carritoProductos.classList.remove('hidden');
            //carritoProductos.classList.add('show');

            botonesFormulario.classList.add('hidden');
            botonesProductos.classList.remove('hidden');
        }
    }

    let btnEnviarPedido = document.getElementById('btn-enviar-pedido');
    if(btnEnviarPedido != null){
        btnEnviarPedido.addEventListener('click',()=>{
            carritoController.enviarMensaje();
            
            //carritoFormulario.classList.add('hidden');
            //carritoFormulario.classList.remove('show');

            //carritoProductos.classList.remove('hidden');
            //carritoProductos.classList.add('show');

            //botonesFormulario.classList.add('hidden');
            //botonesProductos.classList.remove('hidden');
        })
    }
});