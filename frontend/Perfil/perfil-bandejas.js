document.addEventListener('DOMContentLoaded', () => {
    obtenerBandejasUsuario();
});

async function obtenerBandejasUsuario() {
    const idUsuario = localStorage.getItem('idUsuario') || 67; 

    try {
        // Coloca la URL completa con el puerto de tu servidor Express (ej: http://localhost:3000)
        const respuesta = await fetch('http://localhost:3000/mango/mostrarBandejas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUs: Number(idUsuario) })
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        const bandejas = await respuesta.json();
        renderizarBandejas(bandejas);

    } catch (error) {
        console.error('Error al obtener las bandejas:', error);
    }
}

function renderizarBandejas(listaBandejas) {
    const contenedor = document.getElementById('bandejas');
    contenedor.innerHTML = '';

    if (!listaBandejas || listaBandejas.length === 0) {
        contenedor.innerHTML = '<p class="sin-bandejas">No tienes bandejas creadas.</p>';
        return;
    }

    listaBandejas.forEach(bandeja => {
        const divBandeja = document.createElement('div');
        divBandeja.classList.add('bandeja');

        // Extraer la última receta guardada en el arreglo recetas_bandeja
        const recetas = bandeja.recetas_bandeja || [];
        const ultimaReceta = recetas.length > 0 ? recetas[recetas.length - 1] : null;

        // Si existe al menos una receta con imagen, la usamos; si no, mostramos un fallback
        const imagenUrl = (ultimaReceta && ultimaReceta.imagen_receta) 
            ? ultimaReceta.imagen_receta 
            : 'https://via.placeholder.com/300?text=Sin+recetas';

        divBandeja.innerHTML = `
            <img class="fotoBandeja" src="${imagenUrl}" alt="${bandeja.nombre_bandeja}">
            <p class="NombreBandeja">${bandeja.nombre_bandeja}</p>
        `;

        contenedor.appendChild(divBandeja);
    });
}