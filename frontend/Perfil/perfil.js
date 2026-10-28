document.addEventListener('DOMContentLoaded', () => {
    cargarRecetasUsuario();
});

async function cargarRecetasUsuario() {
    // Revisaaaaa cómo guardaste la clave en localStorage (ej: 'idUsuario' o 'idUs')
    const idUsuarioLogueado = localStorage.getItem('idUsuario') || localStorage.getItem('idUs'); 

    if (!idUsuarioLogueado) {
        console.error('No se encontró el ID del usuario en localStorage.');
        return;
    }

    try {
        const respuesta = await fetch('/mango/recUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUs: Number(idUsuarioLogueado) })
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        const recetas = await respuesta.json();
        mostrarRecetasEnDOM(recetas);

    } catch (error) {
        console.error('Error al cargar las recetas:', error);
    }
}

function mostrarRecetasEnDOM(recetas) {
    const contenedorMain = document.getElementById('recetas');
    contenedorMain.innerHTML = ''; // Limpiar el contenedor <main id="recetas">

    if (!recetas || recetas.length === 0) {
        contenedorMain.innerHTML = '<p style="padding: 2rem; text-align: center;">No tienes recetas guardadas.</p>';
        return;
    }

    // Renderizado con el HTML exacto de tus tarjetas
    recetas.forEach(receta => {
        const publicacion = document.createElement('section');
        publicacion.classList.add('publicacion');

        // Mapea los nombres según las claves reales de tu recetas.json
        const imagenSrc = receta.imagen || receta.foto || 'ruta-de-la-imagen.jpg';
        const usuarioNombre = receta.username || receta.nombreUsuario || '';
        const tituloReceta = receta.titulo || receta.nombre || 'Sin título';
        const descripcionReceta = receta.descripcion || '';

        publicacion.innerHTML = `
            <figure class="imagen">
                <img src="${imagenSrc}" alt="${tituloReceta}">
                <p class="nombredeusuario">${usuarioNombre}</p>
            </figure>

            <div class="contenido">
                <h2 class="titulo">${tituloReceta}</h2>
                <p class="descripcion">${descripcionReceta}</p>
            </div>

            <div class="interacciones">
                <span class="icono"><img class="guardado" src="guardado.png" alt="guardar"></span>
                <span class="icono"><img class="comentarios" src="comentariosr.png" alt="comentar"></span>
                <span class="icono"><img class="hipervinculo" src="link.png" alt="hipervinculo"></span>
            </div>

            <div class="filtros">
                <span class="filtro"></span>
                <span class="filtro"></span>
                <span class="filtro"></span>
            </div>
        `;

        contenedorMain.appendChild(publicacion);
    });
}