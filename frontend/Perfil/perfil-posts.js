const idUs = Number(localStorage.getItem('id'));
const containerPosts = document.getElementById('post');
const popup = document.getElementById('comentarios');
const lista = document.getElementById('lista-comentarios');
const input = document.getElementById('input-comentario');
const botonComentar = document.querySelector('.comentarios-enviar');
const popupEnviar = document.getElementById('popupEnviar');
const listaChats = document.getElementById('listaChats');

let posts = [];
let usuarios = [];
let usuarioActual = null;
let postAEnviar = null;

function resolverFoto(foto) {
    if (!foto) return '../avatares/default.png';
    if (foto.startsWith('http') || foto.startsWith('data:')) return foto;
    return `../avatares/${foto}.png`;
}

function formatearFecha(fecha) {
    const d = new Date(fecha);
    return isNaN(d) ? fecha : d.toLocaleDateString('es-AR');
}

function buscarPost(idPost) {
    return posts.find(p => String(p.id) === String(idPost));
}

function buscarFoto(username) {
    const u = usuarios.find(u => u.username === username);
    return resolverFoto(u?.foto_perfil);
}

/* ---------- datos del usuario / header ---------- */
async function obtenerDatosUsuario() {
    if (!idUs) return null;
    try {
        const res = await fetch(`http://localhost:3000/mango/usuario/${idUs}`);
        const u = await res.json();

        document.getElementById('fotoPerfil').src = resolverFoto(u.foto_perfil);
        document.getElementById('nombreUsuario').textContent = u.username;
        document.getElementById('descripcionPerfil').textContent = u.descripcion ?? '';
        document.getElementById('cantPublicaciones').textContent = u.qpub ?? 0;
        document.getElementById('cantSeguidores').textContent = u.seguidores ?? 0;
        document.getElementById('cantSeguidos').textContent = u.seguidos ?? 0;

        localStorage.setItem('nombre_usuario', u.username);
        document.querySelector('.comentarios-avatar.mio').innerHTML =
            `<img src="${resolverFoto(u.foto_perfil)}" alt="${u.username}">`;
        return u;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
}

/* ---------- posts ---------- */
async function cargarPosts() {
    if (!idUs) {
        containerPosts.innerHTML = '<p class="sin-posts">Inicia sesión para ver tus publicaciones.</p>';
        return;
    }
    try {
        const res = await fetch('http://localhost:3000/mango/postUsuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        posts = await res.json();

        const resUs = await fetch('http://localhost:3000/listaUsuarios');
        usuarios = await resUs.json();

        mostrarPosts();
    } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        containerPosts.innerHTML = '<p class="sin-posts">Ocurrió un error al cargar las publicaciones.</p>';
    }
}

function mostrarPosts() {
    if (!Array.isArray(posts) || posts.length === 0) {
        containerPosts.innerHTML = '<p class="sin-posts">Aún no realizaste ninguna publicación.</p>';
        return;
    }

    const nombre = usuarioActual?.username || 'Usuario';
    const foto = resolverFoto(usuarioActual?.foto_perfil);

    containerPosts.innerHTML = posts.map(post => `
        <article class="post" data-id="${post.id}">
            <div class="usuario">
                <img src="${foto}" alt="${nombre}" class="fotodeperfil">
                <h2>${nombre}</h2>
            </div>
            <img class="foto" src="${post.imagen_post}" alt="foto">
            <div class="bottom">
                <div class="interacciones">
                    <span><img class="icono" src="../Home/likenegro.png" alt="like"></span>
                    <span><img class="icono" src="../Home/comentarios.png" alt="comentarios"></span>
                    <span><img class="icono" src="../Home/enviar.png" alt="enviar"></span>
                </div>
                <p class="descripcion">${post.descripcion ?? ''}</p>
            </div>
        </article>`).join('');

    activarVerMas();
}

function activarVerMas() {
    containerPosts.querySelectorAll('.descripcion').forEach(desc => {
        const completo = desc.textContent;
        if (completo.length > 47) {
            desc.innerHTML = completo.substring(0, 47) + '<span class="mas">... más</span>';
            desc.querySelector('.mas').addEventListener('click', () => {
                desc.textContent = completo;
            });
        }
    });
}

/* ---------- like / comentarios / enviar ---------- */
containerPosts.addEventListener('click', (e) => {
    const icono = e.target.closest('.icono');
    if (!icono) return;

    const idPost = icono.closest('.post').dataset.id;

    if (icono.alt === 'like') darLike(icono, idPost);
    else if (icono.alt === 'comentarios') abrirComentarios(idPost);
    else if (icono.alt === 'enviar') abrirEnviar(idPost);
});

async function darLike(icono, idPost) {
    try {
        const res = await fetch('http://localhost:3000/mango/post/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs, idPost })
        });
        const data = await res.json();
        if (data.status === 'liked') icono.src = '../Home/likenaranja.png';
        else if (data.status === 'unliked') icono.src = '../Home/likenegro.png';
    } catch (error) {
        console.error('Error al enviar el like:', error);
    }
}

/* ----- comentarios ----- */
function abrirComentarios(idPost) {
    popup.dataset.id = idPost;
    mostrarComentarios(idPost);
    popup.showModal();
}

function mostrarComentarios(idPost) {
    const post = buscarPost(idPost);
    const comentarios = post?.comentarios ?? [];

    if (comentarios.length === 0) {
        lista.innerHTML = `
            <section class="sin-comentarios">
                <article class="comentarios-vacio">
                    <p class="vacio-titulo">Todavía no hay comentarios</p>
                    <p class="segundo-texto">Deja tu huella</p>
                </article>
            </section>`;
        input.placeholder = 'Empieza la conversación...';
        return;
    }

    input.placeholder = 'Únete a la conversación...';
    lista.innerHTML = comentarios.map(c => `
        <section class="comentarios-seccion">
            <article class="comentario">
                <figure class="comentarios-avatar">
                    <img src="${buscarFoto(c.username)}" alt="${c.username}">
                </figure>
                <div>
                    <p class="comentario-nombre">${c.username}</p>
                    <p class="comentario-texto">${c.texto}</p>
                    <p class="comentario-fecha">${formatearFecha(c.fecha)}</p>
                </div>
            </article>
        </section>`).join('');
}

async function publicarComentario() {
    const texto = input.value.trim();
    if (texto === '') return;

    const idPost = popup.dataset.id;
    const nombre = localStorage.getItem('nombre_usuario') || 'Anonimo';
    const fecha = new Date().toISOString();

    try {
        await fetch('http://localhost:3000/mango/post/comentar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: nombre, idPost, texto, fecha })
        });

        const post = buscarPost(idPost);
        if (post) {
            post.comentarios = post.comentarios ?? [];
            post.comentarios.push({ username: nombre, idPost, texto, fecha });
            post.comentarios_post = (post.comentarios_post ?? 0) + 1;
        }

        input.value = '';
        mostrarComentarios(idPost);

        botonComentar.src = '../Home/enviar3.png';
        setTimeout(() => { botonComentar.src = '../Home/enviar2.png'; }, 100);
    } catch (error) {
        console.error('Error al publicar comentario:', error);
    }
}

botonComentar.addEventListener('click', publicarComentario);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') publicarComentario(); });
popup.addEventListener('click', (e) => {
    if (e.target === popup || e.target.closest('.comentarios-linea')) popup.close();
});

/* ----- enviar por mensaje ----- */
async function abrirEnviar(idPost) {
    postAEnviar = idPost;
    listaChats.innerHTML = '';
    popupEnviar.showModal();

    try {
        const res = await fetch('http://localhost:3000/mango/conversaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs })
        });
        const conversaciones = await res.json();

        if (!conversaciones || conversaciones.length === 0) {
            listaChats.innerHTML = '<p class="sin-posts">Todavía no tenés conversaciones.</p>';
            return;
        }

        conversaciones.forEach(conv => {
            const otroId = conv.participantes.find(id => Number(id) !== idUs);
            const otro = usuarios.find(u => Number(u.id) === Number(otroId));

            const boton = document.createElement('button');
            boton.className = 'enviar-chat';
            boton.innerHTML = `
                <img src="${resolverFoto(otro?.foto_perfil)}" alt="">
                <span>${otro?.username ?? 'Usuario ' + otroId}</span>`;
            boton.addEventListener('click', () => enviarPost(conv.id));
            listaChats.appendChild(boton);
        });
    } catch (error) {
        console.error('Error al cargar conversaciones:', error);
        listaChats.innerHTML = '<p class="sin-posts">No se pudieron cargar tus conversaciones.</p>';
    }
}

async function enviarPost(idConversacion) {
    const link = new URL('../Home/homeposts.html', window.location.href).href;
    try {
        await fetch('http://localhost:3000/mango/mensaje', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idUs,
                idcon: idConversacion,
                texto: `Mirá este post: ${link}#${postAEnviar}`
            })
        });
        popupEnviar.close();
    } catch (error) {
        console.error('Error al enviar el post:', error);
    }
}

popupEnviar.addEventListener('click', (e) => {
    if (e.target === popupEnviar) popupEnviar.close();
});

/* ---------- arranque ---------- */
(async () => {
    usuarioActual = await obtenerDatosUsuario();
    await cargarPosts();
})();