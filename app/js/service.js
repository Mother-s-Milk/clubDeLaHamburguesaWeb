const service = {
    consultarPlatosPrincipales: () => {
        return fetch('datos.json')
        .then(response => {
            return response.json()
        })
        .then(data => {
            return data.hamburguesas;
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