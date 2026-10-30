document.addEventListener('DOMContentLoaded', () => {
    const idUs = Number(localStorage.getItem('id'));
    const containerPosts = document.getElementById('post');
    const cantPublicaciones = document.getElementById('cantPublicaciones');
    const nombreUsuarioElem = document.getElementById('nombreUsuario');
    const fotoPerfilElem = document.getElementById('fotoPerfil');

    async function obtenerPostsUsuario() {
        if (!idUs || isNaN(idUs)) {
            console.error('No se encontró el idUs en localStorage');
            if (containerPosts) {
                containerPosts.innerHTML = '<p class="sin-posts">Inicia sesión para ver tus publicaciones.</p>';
            }
            return;
        }

        try {
            // Reemplaza con la URL completa y puerto de tu servidor Node.js/Express
            const URL_BACKEND = 'http://localhost:3000/mango/postUsuario';

            const respuesta = await fetch(URL_BACKEND, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idUs: idUs })
            });

            if (!respuesta.ok) {
                throw new Error(`Error en el servidor: HTTP ${respuesta.status}`);
            }

            const posts = await respuesta.json();

            // Datos del usuario logueado tomados directamente del perfil en el HTML
            const datosUsuarioLogueado = [{
                id: idUs,
                id_usuario: idUs,
                nombre: nombreUsuarioElem ? nombreUsuarioElem.textContent.trim() : 'Usuario',
                foto_perfil: fotoPerfilElem ? fotoPerfilElem.src : ''
            }];

            mostrarPosts(posts, datosUsuarioLogueado);

        } catch (error) {
            console.error('Error al obtener publicaciones:', error);
            if (containerPosts) {
                containerPosts.innerHTML = '<p class="sin-posts">Ocurrió un error al cargar las publicaciones.</p>';
            }
        }
    }

    function mostrarPosts(posts, usuarios = []) {
        if (!containerPosts) return;
        containerPosts.innerHTML = "";

        // Actualizar el contador de publicaciones en el encabezado
        if (cantPublicaciones) {
            cantPublicaciones.textContent = posts.length;
        }

        if (!Array.isArray(posts) || posts.length === 0) {
            containerPosts.innerHTML = '<p class="sin-posts">Aún no realizaste ninguna publicación.</p>';
            return;
        }

        posts.forEach(post => {
            let nombreAMostrar = "Usuario";
            let fotoPerfil = "";

            for (let i = 0; i < usuarios.length; i++) {
                if (usuarios[i].id === post.id_usuario || usuarios[i].id_usuario === post.id_usuario) {
                    nombreAMostrar = usuarios[i].nombre_usuario || usuarios[i].username || usuarios[i].nombre || nombreAMostrar;
                    if (usuarios[i].foto_perfil) {
                        fotoPerfil = usuarios[i].foto_perfil;
                    }
                    break;
                }
            }

            containerPosts.innerHTML += `
                <article class="post" data-id="${post.id || ''}">
                    <div class="usuario">
                        <img src="${fotoPerfil}" alt="Foto de perfil" class="fotodeperfil">
                        <h2>${nombreAMostrar}</h2>
                    </div>
                    <img class="foto" src="${post.imagen_post || post.imagen || ''}" alt="foto">
                    <div class="bottom">
                        <div class="interacciones">
                            <span><img class="icono" src="../likenegro.png" alt="like"></span>
                            <span><img class="icono" src="../comentarios.png" alt="comentarios"></span>
                            <span><img class="icono" src="../enviar.png" alt="enviar"></span>
                        </div>
                        <p class="descripcion">${post.descripcion || post.texto || ''}</p>
                    </div>
                </article>`;
        });
    }

    obtenerPostsUsuario();
});