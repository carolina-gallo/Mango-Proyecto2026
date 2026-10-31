document.addEventListener('DOMContentLoaded', () => {
    const idUs = Number(localStorage.getItem('id'));
    const containerPosts = document.getElementById('post');

    function resolverFoto(foto) {
        if (!foto) return "../avatares/default.png";
        if (foto.startsWith("http") || foto.startsWith("data:")) return foto;
        return `../avatares/${foto}.png`;
    }

    async function obtenerDatosUsuario() {
        if (!idUs) return null;
        try {
            const respuesta = await fetch(`http://localhost:3000/mango/usuario/${idUs}`);
            const usuario = await respuesta.json();

            document.getElementById("fotoPerfil").src = resolverFoto(usuario.foto_perfil);
            document.getElementById("nombreUsuario").textContent = usuario.username;
            document.getElementById("descripcionPerfil").textContent = usuario.descripcion ?? "";
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
        const fotoUsuario = resolverFoto(usuario?.foto_perfil);

        containerPosts.innerHTML = posts.map(post => `
            <article class="post" data-id="${post.id || ''}">
                <div class="usuario">
                    <img src="${fotoUsuario}" alt="Foto de perfil" class="fotodeperfil">
                    <h2>${nombre}</h2>
                </div>
                ${post.imagen_post ? `<img class="foto" src="${post.imagen_post}" alt="foto">` : ''}
                <div class="bottom">
                    <div class="interacciones">
                        <span><img class="icono" src="../Home/likenegro.png" alt="like"></span>
                        <span><img class="icono" src="../Home/comentarios.png" alt="comentarios"></span>
                        <span><img class="icono" src="../Home/enviar.png" alt="enviar"></span>
                    </div>
                    <p class="descripcion">${post.descripcion || ''}</p>
                </div>
            </article>`).join("");
    }

    (async () => {
        const usuario = await obtenerDatosUsuario();
        await obtenerPostsUsuario(usuario);
    })();
});