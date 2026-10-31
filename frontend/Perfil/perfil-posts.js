const idUsuario = Number(localStorage.getItem("id"));

document.addEventListener('DOMContentLoaded', () => {
    obtenerDatosUsuario();
    cargarPostsUsuario();
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

async function cargarPostsUsuario() {
    const contenedorPosts = document.getElementById('recetas');

    if (!idUsuario) {
        contenedorPosts.innerHTML = '<p class="mensaje-vacio">No se encontró la sesión del usuario.</p>';
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:3000/mango/postsUsuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idUsuario })
        });

        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        const posts = await respuesta.json();

        if (!Array.isArray(posts) || posts.length === 0) {
            contenedorPosts.innerHTML = '<p class="mensaje-vacio">No has publicado posts todavía.</p>';
            return;
        }

        contenedorPosts.innerHTML = '';

        posts.forEach(post => {
            const card = document.createElement('article');
            card.classList.add('tarjeta-receta');

            card.innerHTML = `
                ${post.imagen_post ? `<img src="${post.imagen_post}" alt="post">` : ''}
                <div class="info-receta">
                    <p>${post.descripcion || ''}</p>
                </div>
            `;

            contenedorPosts.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar los posts:', error);
        contenedorPosts.innerHTML = '<p class="mensaje-error">Error al cargar los posts.</p>';
    }
}