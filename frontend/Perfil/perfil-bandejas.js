document.addEventListener('DOMContentLoaded', () => {
    obtenerBandejasUsuario();
});

async function obtenerBandejasUsuario() {
    const idUsuario = localStorage.getItem('idUsuario') || localStorage.getItem('id') || localStorage.getItem('id_usuario') || 67; 
    const idEnviar = isNaN(Number(idUsuario)) ? idUsuario : Number(idUsuario);

    try {
        const respuesta = await fetch('http://localhost:3000/mango/mostrarBandejas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idEnviar })
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
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!Array.isArray(listaBandejas) || listaBandejas.length === 0) {
        contenedor.innerHTML = '<p class="sin-bandejas">No tienes bandejas creadas.</p>';
        return;
    }

    listaBandejas.forEach(bandeja => {
        const tarjetaBandeja = document.createElement('div');
        tarjetaBandeja.classList.add('bandeja');
        tarjetaBandeja.style.cursor = 'pointer';

        const recetas = bandeja.recetas_bandeja || bandeja.recetas || [];
        const ultimaReceta = recetas.length > 0 ? recetas[recetas.length - 1] : null;

        const imagenUrl = (ultimaReceta && (ultimaReceta.imagen_receta || ultimaReceta.imagen)) 
            ? (ultimaReceta.imagen_receta || ultimaReceta.imagen) 
            : 'https://via.placeholder.com/300?text=Sin+recetas';

        tarjetaBandeja.innerHTML = `
            <img class="fotoBandeja" src="${imagenUrl}" alt="${bandeja.nombre_bandeja}">
            <p class="NombreBandeja">${bandeja.nombre_bandeja}</p>
        `;

        tarjetaBandeja.addEventListener('click', () => {
            window.location.href = `bandejas.html?id=${bandeja.id}`;
        });

        contenedor.appendChild(tarjetaBandeja);
    });
}