let carrito = [] //Base de datos

let carritoKey = 'carrito'; // Clave para almacenar en localStorage

const carritoService = {
    save: (producto) => {
        console.log("Recibido en el servicio:", producto);

        let carrito = JSON.parse(localStorage.getItem(carritoKey)) || []; // Obtener carrito existente
        carrito.push(producto);
        localStorage.setItem(carritoKey, JSON.stringify(carrito)); // Guardar carrito actualizado
        
        // Verificar que se haya guardado correctamente
        console.log("Carrito después de guardar:", JSON.parse(localStorage.getItem(carritoKey)));
    },
    list: () => {
        let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];
        return carrito;
    },
    // Eliminar un producto del carrito
    delete: (id, nombre) => {
        let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];
        carrito = carrito.filter(producto => producto.id !== id && producto.nombre !== nombre); // Filtrar el producto
        localStorage.setItem(carritoKey, JSON.stringify(carrito)); // Actualizar carrito en localStorage
    },
    // Limpiar el carrito
    clear: () => {
        localStorage.removeItem(carritoKey); // Eliminar el carrito del localStorage
    },
    agregarUno: (id, nombre) => {
        let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];
    
        carrito.forEach(producto => {
            if (parseInt(producto.id) === id && producto.nombre === nombre) {
                producto.cantidad++;
            }
        });
    
        // Guardar el carrito actualizado en localStorage
        localStorage.setItem(carritoKey, JSON.stringify(carrito));
    },
    restarUno: (id) => {
        let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];
    
        carrito.forEach(producto => {
            if (parseInt(producto.id) === id && producto.cantidad > 1) {
                producto.cantidad--; // Incrementar la cantidad del producto
            }
        });
    
        // Guardar el carrito actualizado en localStorage
        localStorage.setItem(carritoKey, JSON.stringify(carrito));
    }
}