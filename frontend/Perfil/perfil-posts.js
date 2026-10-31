document.addEventListener('DOMContentLoaded', () => {
    const idUs = Number(localStorage.getItem('id'));
    const containerPosts = document.getElementById('post');

    async function obtenerDatosUsuario() {
        try {
            const respuesta = await fetch(`http://localhost:3000/mango/usuario/${idUs}`);
            const usuario = await respuesta.json();

            const foto = usuario.foto_perfil || "default.jpg";
            document.getElementById("fotoPerfil").src = foto.startsWith("http") ? foto : `../avatares/${foto}.png`;
            document.getElementById("nombreUsuario").textContent = usuario.username;
            document.getElementById("descripcionPerfil").textContent = usuario.descripcion;
            document.getElementById("cantPublicaciones").textContent = usuario.qpub ?? 0;
            document.getElementById("cantSeguidores").textContent = usuario.seguidores ?? 0;
            document.getElementById("cantSeguidos").textContent = usuario.seguidos ?? 0;

            return usuario;
        } catch (error) {
            console.error("Error al obtener usuario:", error);
            return null;
        }
    }

    async function obtenerPostsUsuario(usuario) {
        if (!idUs || isNaN(idUs)) {
            containerPosts.innerHTML = '<p class="sin-posts">Inicia sesión para ver tus publicaciones.</p>';
            return;
        }

        try {
            const respuesta = await fetch('http://localhost:3000/mango/postUsuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idUs: idUs })
            });

            if (!respuesta.ok) throw new Error(`Error en el servidor: HTTP ${respuesta.status}`);

            const posts = await respuesta.json();
            mostrarPosts(posts, usuario);
        } catch (error) {
            console.error('Error al obtener publicaciones:', error);
            containerPosts.innerHTML = '<p class="sin-posts">Ocurrió un error al cargar las publicaciones.</p>';
        }
    }

    function mostrarPosts(posts, usuario) {
        containerPosts.innerHTML = "";

        if (!Array.isArray(posts) || posts.length === 0) {
            containerPosts.innerHTML = '<p class="sin-posts">Aún no realizaste ninguna publicación.</p>';
            return;
        }

        const nombre = usuario?.username || "Usuario";
        const fotoUsuario = document.getElementById("fotoPerfil").src;

        posts.forEach(post => {
            containerPosts.innerHTML += `
                <article class="post" data-id="${post.id || ''}">
                    <div class="usuario">
                        <img src="${fotoUsuario}" alt="Foto de perfil" class="fotodeperfil">
                        <h2>${nombre}</h2>
                    </div>
                    <img class="foto" src="${post.imagen_post || ''}" alt="foto">
                    <div class="bottom">
                        <div class="interacciones">
                            <span><img class="icono" src="../Home/likenegro.png" alt="like"></span>
                            <span><img class="icono" src="../Home/comentarios.png" alt="comentarios"></span>
                            <span><img class="icono" src="../Home/enviar.png" alt="enviar"></span>
                        </div>
                        <p class="descripcion">${post.descripcion || ''}</p>
                    </div>
                </article>`;
        });
    }

    (async () => {
        const usuario = await obtenerDatosUsuario();
        await obtenerPostsUsuario(usuario);
    })();
});