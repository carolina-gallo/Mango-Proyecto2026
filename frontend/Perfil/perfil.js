const idUsuario = Number(localStorage.getItem("id"));

document.addEventListener('DOMContentLoaded', () => {
    obtenerDatosUsuario();
    cargarRecetasUsuario();
});

async function obtenerDatosUsuario() {
    if (!idUsuario) return;
    try {
        const respuesta = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
        const usuario = await respuesta.json();

        const foto = usuario.foto_perfil || "default.jpg";
        document.getElementById("fotoPerfil").src = foto.startsWith("http") ? foto : `../avatares/${foto}.png`;

        document.getElementById("nombreUsuario").textContent = usuario.username;
        document.getElementById("descripcionPerfil").textContent = usuario.descripcion;

        document.getElementById("cantPublicaciones").textContent = usuario.qpub ?? 0;
        document.getElementById("cantSeguidores").textContent = usuario.seguidores ?? 0;
        document.getElementById("cantSeguidos").textContent = usuario.seguidos ?? 0;
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}

async function cargarRecetasUsuario() {
    const contenedorRecetas = document.getElementById('recetas');

    if (!idUsuario) {
        contenedorRecetas.innerHTML = '<p class="mensaje-vacio">No se encontró la sesión del usuario.</p>';
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:3000/mango/recUsuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idUsuario })
        });

        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        const recetas = await respuesta.json();

        if (!Array.isArray(recetas) || recetas.length === 0) {
            contenedorRecetas.innerHTML = '<p class="mensaje-vacio">No has publicado recetas todavía.</p>';
            return;
        }

        contenedorRecetas.innerHTML = '';

        recetas.forEach(receta => {
            const card = document.createElement('article');
            card.classList.add('tarjeta-receta');

            card.innerHTML = `
                <div class="info-receta">
                    <h3>${receta.nombre}</h3>
                    <p>${receta.descripcion || ''}</p>
                </div>
                ${receta.imagen_receta ? `<img src="${receta.imagen_receta}" alt="${receta.nombre}">` : ''}
            `;

            card.addEventListener('click', () => {
                localStorage.setItem("idReceta", receta.id);
                window.location.href = "../Home/recetas-informacion.html";
            });

            contenedorRecetas.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar las recetas:', error);
        contenedorRecetas.innerHTML = '<p class="mensaje-error">Error al cargar las recetas.</p>';
    }
}