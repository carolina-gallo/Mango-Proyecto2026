const idUsuario = Number(localStorage.getItem('id'));            // Tu ID
const idAjeno = Number(localStorage.getItem('idPerfilAjeno'));   // El ID del perfil que estás viendo
const containerPosts = document.getElementById('container-posts'); // O 'post', según tu HTML
const popup = document.getElementById('comentarios');
const lista = document.getElementById('lista-comentarios');
const input = document.getElementById('input-comentario');
const botonComentar = document.querySelector('.comentarios-enviar');
const popupEnviar = document.getElementById('popupEnviar');
const listaChats = document.getElementById('listaChats');

const btnSeguir = document.getElementById('btn-seguir');
const btnMensaje = document.getElementById('btn-mensaje');
const cantSeguidores = document.getElementById('cantSeguidores');

const likeLleno = '../Home/likenaranja.png';
const likeVacio = '../Home/likenegro.png';

let posts = [];
let usuarios = [];
let usuarioAjeno = null;
let postAEnviar = null;
let loSigo = false;

// Si no hay ID ajeno o es el tuyo, te devuelve a tu perfil
if (!idAjeno || idAjeno === idUsuario) {
    window.location.href = 'perfil.html';
}

function resolverFoto(foto) {
    if (!foto) return '../avatares/default.png';
    if (foto.startsWith('http') || foto.startsWith('data:')) return foto;
    return `../avatares/${foto}.png`;
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    if (/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/.test(fecha)) return fecha;
    const d = new Date(fecha);
    return isNaN(d) ? fecha : d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function obtenerDatosAjeno() {
    try {
        // ACÁ ESTABA EL ERROR: Tiene que buscar idAjeno, no tu idUs
        const res = await fetch(`http://localhost:3000/mango/usuario/${idAjeno}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const u = await res.json();

        document.getElementById('fotoPerfil').src = resolverFoto(u.foto_perfil);
        document.getElementById('nombreUsuario').textContent = u.username;
        document.getElementById('descripcionPerfil').textContent = u.descripcion ?? '';
        document.getElementById('cantPublicaciones').textContent = u.qpub ?? 0;
        
        if(cantSeguidores) cantSeguidores.textContent = u.seguidores ?? 0;
        const cantSeguidos = document.getElementById('cantSeguidos');
        if(cantSeguidos) cantSeguidos.textContent = u.seguidos ?? 0;
        cargarInsignias(u);
        return u;
    } catch (error) {
        console.error('Error al obtener usuario ajeno:', error);
        return null;
    }
}

async function cargarPosts() {
    try {
        // ACÁ TAMBIÉN: Tiene que buscar los posts de idAjeno, no de idUs
        const res = await fetch('http://localhost:3000/mango/postUsuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idAjeno }) // ¡idAjeno!
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        posts = await res.json();

        const resUs = await fetch('http://localhost:3000/listaUsuarios');
        usuarios = await resUs.json();

        mostrarPosts();
    } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        if (containerPosts) containerPosts.innerHTML = '<p class="sin-posts">Ocurrió un error al cargar las publicaciones.</p>';
    }
}

function mostrarPosts() {
    if (!containerPosts) return;
    
    if (!Array.isArray(posts) || posts.length === 0) {
        containerPosts.innerHTML = '<p class="mensaje-vacio">No hay ninguna publicación todavía.</p>';
        return;
    }

    const nombre = usuarioAjeno?.username || 'Usuario';
    const foto = resolverFoto(usuarioAjeno?.foto_perfil);

    containerPosts.innerHTML = posts.map(post => {
        // El like sigue comprobando tu idUsuario para saber si VOS le diste like
        const iconoLike = (post.likes_usuarios || []).includes(idUsuario) ? likeLleno : likeVacio;

        return `
        <article class="post" data-id="${post.id}">
            <div class="usuario">
                <img src="${foto}" alt="${nombre}" class="fotodeperfil">
                <h2>${nombre}</h2>
            </div>
            <img class="foto" src="${post.imagen_post}" alt="foto" data-id-receta="${post.id_receta}">
            <div class="bottom">
                <div class="interacciones">
                    <span><img class="icono" src="${iconoLike}" alt="like"></span>
                    <span><img class="icono" src="../Home/comentarios.png" alt="comentarios"></span>
                    <span><img class="icono" src="../Home/enviar.png" alt="enviar"></span>
                </div>
                <p class="descripcion">${post.descripcion ?? ''}</p>
            </div>
        </article>`;
    }).join('');

    activarVerMas();
}

function activarVerMas() {
    if(!containerPosts) return;
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
function pintarBotonSeguir() {
    btnSeguir.textContent = loSigo ? 'Siguiendo' : 'Seguir';
    btnSeguir.classList.toggle('siguiendo', loSigo);
    btnSeguir.classList.toggle('seguir', !loSigo);
}

// miro en mi propio usuario si ya tengo a esta persona en qseguidos
async function revisarSiLoSigo() {
    try {
        const res = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
        const yo = await res.json();
        loSigo = (yo.qseguidos || []).some(u => Number(u.id) === idAjeno);
    } catch (error) {
        console.error('Error al revisar si lo seguís:', error);
    }
    pintarBotonSeguir();
}

btnSeguir.addEventListener('click', async () => {
    const ruta = loSigo ? 'dejardeSeguir' : 'seguir';
    const metodo = loSigo ? 'DELETE' : 'POST';

    try {
        const res = await fetch(`http://localhost:3000/mango/${ruta}`, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idUsuario, idOtroUs: idAjeno })
        });
        const seguido = await res.json(); 

        loSigo = !loSigo;
        cantSeguidores.textContent = seguido.seguidores ?? 0;
        pintarBotonSeguir();
    } catch (error) {
        console.error('No se pudo seguir/dejar de seguir:', error);
    }
});

btnMensaje.addEventListener('click', async () => {
    try {
        const res = await fetch('http://localhost:3000/mango/iniciarConv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idUsuario, idOtroUs: idAjeno })
        });

        if (!res.ok) {
            alert(await res.text());
            return;
        }

        const conv = await res.json();
        localStorage.setItem('idConversacionActiva', conv.id);
        localStorage.setItem('idChatCon', idAjeno);
        window.location.href = '../Mensajeria/conversacion.html';
    } catch (error) {
        console.error('No se pudo abrir la conversación:', error);
    }
});

// INICIALIZACIÓN
(async () => {
    usuarioAjeno = await obtenerDatosAjeno();
    await revisarSiLoSigo(); 
    await cargarPosts();
})();

containerPosts.addEventListener('click', (e) => {
    const foto = e.target.closest('.foto');
    if (foto && foto.dataset.idReceta) {
        localStorage.setItem('idReceta', foto.dataset.idReceta);
        window.location.href = '../Home/recetas-informacion.html';
    }
});