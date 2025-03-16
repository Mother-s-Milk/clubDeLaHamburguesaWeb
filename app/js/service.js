const service = {
    consultarHamburguesaMasVendida: () => {
        return fetch('datos.json')
        .then(response => {
            return response.json()
        })
        .then(data => {
            return data.masVendida;
        })
        .catch((error) => {
            console.error("Error en la petición: ", error);
            throw error;
        });
    },
    consultarPlatosPrincipales: () => {
        return fetch('datos.json')
        .then(response => {
            return response.json()
        })
        .then(data => {
            // Filtrar los productos que sean "Plato principal"
            let platosPrincipales = data.hamburguesas.filter(alimento => alimento.categoria === "Plato principal");

            // Ordenar según la lógica de PHP
            platosPrincipales.sort((a, b) => {
                let nombreA = a.nombre.split(" ")[0];
                let nombreB = b.nombre.split(" ")[0];

                if (nombreA < nombreB) return -1;
                if (nombreA > nombreB) return 1;

                // Ordenar por el tipo (Simple, Doble, etc.)
                let ordenTipos = ["Simple", "Doble", "Triple", "Cuádruple"];
                let tipoA = a.nombre.split(" ").slice(-1)[0];
                let tipoB = b.nombre.split(" ").slice(-1)[0];

                return ordenTipos.indexOf(tipoA) - ordenTipos.indexOf(tipoB);
            });

            console.log(platosPrincipales); // Ver en consola
            return platosPrincipales; // Devolver los datos para usarlos después
            //return data.hamburguesas;
        })
        .catch((error) => {
            console.error("Error en la petición: ", error);
            throw error;
        });
    },
    consultarPapas: () => {
        return fetch('datos.json')
        .then(response => {
            return response.json()
        })
        .then(data => {
            return data.papas;
        })
        .catch((error) => {
            console.error("Error en la petición: ", error);
            throw error;
        });
    },
    consultarBebidas: () => {
        return fetch('datos.json')
        .then(response => {
            return response.json()
        })
        .then(data => {
            return data.bebidas;
        })
        .catch((error) => {
            console.error("Error en la petición: ", error);
            throw error;
        });
    }
}