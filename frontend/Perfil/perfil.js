document.addEventListener('DOMContentLoaded', () => {
    obtenerRecetasUsuario();
});

async function obtenerRecetasUsuario() {
    // Unifica la obtención del ID desde localStorage priorizando distintos nombres de clave posibles
    const idUsuario = localStorage.getItem('idUsuario') 
        || localStorage.getItem('idUs') 
        || localStorage.getItem('id') 
        || 67; 

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

function renderizarRecetas(recetas) {
    const contenedor = document.getElementById('contenedorRecetas');
    contenedor.innerHTML = '';

    if (recetas.length === 0) {
        contenedor.innerHTML = '<p class="sin-recetas">Esta bandeja está vacía.</p>';
        return;
    }

    recetas.forEach(receta => {
        const tarjeta = document.createElement('a');
        tarjeta.classList.add('tarjeta-receta');
        
        // Sube un nivel desde 'Perfil' para ingresar a 'Home'
        tarjeta.href = `/frontend/Home/recetas-informacion.html?id=${receta.id}`;

        tarjeta.innerHTML = `
            <img class="img-receta" src="${receta.imagen_receta}" alt="${receta.nombre}">
            <div class="info-receta">
                <h3>${receta.nombre}</h3>
                <p class="desc-receta">${receta.descripcion || ''}</p>
                <span class="likes">❤️ ${receta.likes_receta || 0}</span>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}