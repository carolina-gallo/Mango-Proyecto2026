document.addEventListener('DOMContentLoaded', () => {
    // Lee el ID guardado en localStorage al iniciar sesión
    const idUs = Number(localStorage.getItem('id')); 

    const contenedorPosts = document.getElementById('post');
    const cantPublicaciones = document.getElementById('cantPublicaciones');

    async function obtenerPostsUsuario() {
        if (!idUs || isNaN(idUs)) {
            console.error('No se encontró un ID válido en localStorage. Valor actual:', localStorage.getItem('id'));
            if (contenedorPosts) {
                contenedorPosts.innerHTML = '<p>Debes iniciar sesión para ver tus posts.</p>';
            }
            return;
        }

        try {
            const respuesta = await fetch('/mango/postUsuario', {
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
            renderizarPosts(posts);

        } catch (error) {
            console.error('Error al obtener posts:', error);
            if (contenedorPosts) {
                contenedorPosts.innerHTML = '<p>Ocurrió un error al cargar las publicaciones.</p>';
            }
        }
    }

    function renderizarPosts(posts) {
        if (!contenedorPosts) return;
        contenedorPosts.innerHTML = '';

        // Actualiza la cantidad en la cabecera
        if (cantPublicaciones) {
            cantPublicaciones.textContent = posts.length;
        }

        if (posts.length === 0) {
            contenedorPosts.innerHTML = '<p class="sin-posts">Aún no realizaste ninguna publicación.</p>';
            return;
        }

        // Genera la tarjeta de cada publicación
        posts.forEach(post => {
            const article = document.createElement('article');
            article.classList.add('publicacion');

            article.innerHTML = `
                ${post.imagen ? `<img src="${post.imagen}" class="img-post" alt="Publicación">` : ''}
                <div class="contenido-post">
                    ${post.texto ? `<p>${post.texto}</p>` : ''}
                    ${post.descripcion ? `<p>${post.descripcion}</p>` : ''}
                </div>
            `;

            contenedorPosts.appendChild(article);
        });
    }

    obtenerPostsUsuario();
});