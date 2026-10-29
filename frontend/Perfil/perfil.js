document.addEventListener('DOMContentLoaded', () => {
    obtenerRecetasUsuario();
});

async function obtenerRecetasUsuario() {
    const idUsuario = localStorage.getItem('idUsuario') || 67; 

    try {
        const respuesta = await fetch('http://localhost:3000/mango/recUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUs: Number(idUsuario) })
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        const recetas = await respuesta.json();
        renderizarRecetas(recetas);

    } catch (error) {
        console.error('Error al obtener las recetas:', error);
    }
}

function renderizarRecetas(listaRecetas) {
    const contenedor = document.getElementById('recetas');
    contenedor.innerHTML = '';

    if (!listaRecetas || listaRecetas.length === 0) {
        contenedor.innerHTML = '<p class="sin-recetas">No tienes recetas creadas.</p>';
        return;
    }

    listaRecetas.forEach(receta => {
        const enlaceReceta = document.createElement('a');
        enlaceReceta.classList.add('receta');
        
        // Asume propiedad id o id_receta según tu JSON
        const idReceta = receta.id || receta.id_receta;
        enlaceReceta.href = `recetas.html?id=${idReceta}`;

        // Soporta distintas propiedades de imagen y nombre según tu objeto receta
        const imagenUrl = receta.imagen_receta || receta.imagen || 'https://via.placeholder.com/300?text=Sin+imagen';
        const nombreReceta = receta.nombre_receta || receta.nombre || receta.titulo || 'Receta sin título';

        enlaceReceta.innerHTML = `
            <img class="fotoReceta" src="${imagenUrl}" alt="${nombreReceta}">
            <p class="NombreReceta">${nombreReceta}</p>
        `;

        contenedor.appendChild(enlaceReceta);
    });
}