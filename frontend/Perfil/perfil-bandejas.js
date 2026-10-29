document.addEventListener('DOMContentLoaded', () => {
    obtenerBandejasUsuario();
});

async function obtenerBandejasUsuario() {
    const idUsuario = localStorage.getItem('idUsuario') || 67; 

    try {
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
         const enlaceBandeja = document.createElement('a');
        enlaceBandeja.classList.add('bandeja');
        enlaceBandeja.href = `bandejas.html?id=${bandeja.id}`;

        const recetas = bandeja.recetas_bandeja || [];
        const ultimaReceta = recetas.length > 0 ? recetas[recetas.length - 1] : null;

        const imagenUrl = (ultimaReceta && ultimaReceta.imagen_receta) 
            ? ultimaReceta.imagen_receta 
            : 'https://via.placeholder.com/300?text=Sin+recetas';

        enlaceBandeja.innerHTML = `
            <img class="fotoBandeja" src="${imagenUrl}" alt="${bandeja.nombre_bandeja}">
            <p class="NombreBandeja">${bandeja.nombre_bandeja}</p>
        `;

        contenedor.appendChild(enlaceBandeja);
    });
}