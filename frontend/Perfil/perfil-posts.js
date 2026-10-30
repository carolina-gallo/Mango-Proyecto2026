document.addEventListener('DOMContentLoaded', () => {
    const contenedorPosts = document.getElementById('post');
    const cantPublicaciones = document.getElementById('cantPublicaciones');

    // 1. DIAGNÓSTICO DE LOCALSTORAGE
    const idBruto = localStorage.getItem('id');
    console.log('1. Valor guardado en localStorage["id"]:', idBruto);

    const idUs = Number(idBruto);

    if (!idBruto || isNaN(idUs)) {
        console.error('ERROR: No existe un ID válido en localStorage');
        contenedorPosts.innerHTML = `
            <div style="background:#fee; color:#c00; padding:15px; border-radius:8px; margin:10px;">
                <strong>Error de Login:</strong> No se encontró el ID del usuario en localStorage.<br>
                Clave buscada: <code>'id'</code>. Valor hallado: <code>${idBruto}</code>
            </div>`;
        return;
    }

    async function obtenerPostsUsuario() {
        contenedorPosts.innerHTML = '<p class="cargando">Cargando posts...</p>';

        try {
            // ⚠️ ATENCIÓN: Si usas Live Server, debes poner la URL completa (ej: 'http://localhost:3000/mango/postUsuario')
            const URL_BACKEND = 'http://localhost:3000/mango/postUsuario'; 
            
            console.log(`2. Enviando petición POST a ${URL_BACKEND} con idUs:`, idUs);

            const respuesta = await fetch(URL_BACKEND, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idUs: idUs })
            });

            console.log('3. Estado de respuesta del servidor:', respuesta.status);

            if (!respuesta.ok) {
                throw new Error(`El servidor respondió con status ${respuesta.status}`);
            }

            const posts = await respuesta.json();
            console.log('4. Datos recibidos del backend:', posts);

            renderizarPosts(posts);

        } catch (error) {
            console.error('ERROR EN FETCH:', error);
            contenedorPosts.innerHTML = `
                <div style="background:#fee; color:#c00; padding:15px; border-radius:8px; margin:10px;">
                    <strong>Error de conexión:</strong> ${error.message}<br>
                    Abre la consola (F12) para más detalles.
                </div>`;
        }
    }

    function renderizarPosts(posts) {
        contenedorPosts.innerHTML = '';

        if (cantPublicaciones) {
            cantPublicaciones.textContent = posts.length;
        }

        if (!Array.isArray(posts) || posts.length === 0) {
            contenedorPosts.innerHTML = '<p class="sin-posts">Aún no realizaste ninguna publicación (0 posts devueltos).</p>';
            return;
        }

        posts.forEach((post, index) => {
            console.log(`Renderizando post [${index}]:`, post);

            const article = document.createElement('article');
            article.classList.add('publicacion');

            // Intenta leer distintas variantes de propiedades comunes
            const imagen = post.imagen || post.foto || post.img || '';
            const texto = post.texto || post.descripcion || post.contenido || post.titulo || 'Sin contenido de texto';

            article.innerHTML = `
                ${imagen ? `<img src="${imagen}" class="img-post" alt="Publicación">` : ''}
                <div class="contenido-post">
                    <p>${texto}</p>
                </div>
            `;

            contenedorPosts.appendChild(article);
        });
    }

    obtenerPostsUsuario();
});