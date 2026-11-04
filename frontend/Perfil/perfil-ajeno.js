const idUsuario = Number(localStorage.getItem('id'));            // el que está logueado
const idAjeno = Number(localStorage.getItem('idPerfilAjeno'));   // el que clickeaste
const containerRecetas = document.getElementById('recetas');
const btnSeguir = document.getElementById('btn-seguir');
const btnMensaje = document.getElementById('btn-mensaje');
const cantSeguidores = document.getElementById('cantSeguidores');

let usuarioAjeno = null;
let loSigo = false;

// si no hay id, o es el tuyo, te manda a tu perfil
if (!idAjeno || idAjeno === idUsuario) {
    window.location.href = 'perfil.html';
}

const etiquetasFiltros = {
    celiacx: '../Sin tacc.png',
    diabeticx: '../Diabetes.png',
    veganx: '../Vegano.png',
    vegetarianx: '../Vegetariano.png',
    kosher: '../Kosher.png',
    hipertensx: '../Hipertencion.png',
    'bajo colesterol': '../Bajo colesterol.png',
    keto: '../keto.png',
    'intolerancia a la lactosa': '../Intolerancia a la lactosa.png',
    'alergia a frutos secos': '../A. mani.png'
};

function resolverFoto(foto) {
    if (!foto) return '../avatares/default.png';
    if (foto.startsWith('http') || foto.startsWith('data:')) return foto;
    return `../avatares/${foto}.png`;
}

/*header*/
async function obtenerDatosAjeno() {
    try {
        const res = await fetch(`http://localhost:3000/mango/usuario/${idAjeno}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const u = await res.json();

        document.getElementById('fotoPerfil').src = resolverFoto(u.foto_perfil);
        document.getElementById('nombreUsuario').textContent = u.username;
        document.getElementById('descripcionPerfil').textContent = u.descripcion ?? '';
        document.getElementById('cantPublicaciones').textContent = u.qpub ?? 0;
        cantSeguidores.textContent = u.seguidores ?? 0;
        document.getElementById('cantSeguidos').textContent = u.seguidos ?? 0;
        return u;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
}

/*botón seguir / siguiendo*/
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
        const seguido = await res.json();   // el back devuelve el usuario seguido ya actualizado

        loSigo = !loSigo;
        cantSeguidores.textContent = seguido.seguidores ?? 0;
        pintarBotonSeguir();
    } catch (error) {
        console.error('No se pudo seguir/dejar de seguir:', error);
    }
});

/*para mandar el mensaje*/
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

// RECETAS
function clavesActivas(filtros) {
    if (Array.isArray(filtros)) return filtros;
    return Object.keys(filtros ?? {}).filter(k => filtros[k] === true);
}

function armarFiltros(filtros) {
    const activos = clavesActivas(filtros).filter(k => etiquetasFiltros[k]);
    const primeros = activos.slice(0, 3)
        .map(k => `<img src="${etiquetasFiltros[k]}" alt="${k}" class="filtro">`).join('');
    const resto = activos.length - 3;
    return primeros + (resto > 0 ? `<span class="filtro grande">+${resto}</span>` : '');
}

async function cargarRecetas() {
    try {
        const res = await fetch('http://localhost:3000/mango/recUsuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idAjeno })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const recetas = await res.json();

        if (!Array.isArray(recetas) || recetas.length === 0) {
            containerRecetas.innerHTML = '<p class="mensaje-vacio">Todavía no hay recetas por acá.</p>';
            return;
        }
        mostrarRecetas(recetas);
    } catch (error) {
        console.error('Error al cargar las recetas:', error);
        containerRecetas.innerHTML = '<p class="mensaje-error">Error al cargar las recetas.</p>';
    }
}

function mostrarRecetas(recetas) {
    const nombre = usuarioAjeno?.username || '';

    containerRecetas.innerHTML = recetas.map(receta => `
        <section class="publicacion" data-id="${receta.id}">
            <figure class="imagen">
                <img class="fotoReceta" src="${receta.imagen_receta}" alt="${receta.nombre}">
                <p class="nombredeusuario">${nombre}</p>
            </figure>
            <div class="contenido">
                <h2 class="titulo">${receta.nombre}</h2>
                <p class="descripcion">${receta.descripcion ?? ''}</p>
            </div>
            <div class="interacciones">
                <span class="icono"><img class="guardado" src="${estaGuardada(receta.id) ? '../Home/guardado-amarillo.png' : '../Home/guardado.png'}" alt="guardar"></span>
                <span class="icono"><img class="comentarios" src="../Home/comentariosr.png" alt="comentar"></span>
            </div>
            <div class="filtros">${armarFiltros(receta.filtros)}</div>
        </section>`).join('');

    activarVerMas();
}

function activarVerMas() {
    containerRecetas.querySelectorAll('.descripcion').forEach(desc => {
        const completo = desc.textContent;
        if (completo.length > 47) {
            desc.innerHTML = completo.substring(0, 47) +
                '<span class="mas" style="cursor:pointer;font-weight:bold;">... más</span>';
        }
    });
}

function irARecetaInfo(idReceta) {
    localStorage.setItem('idReceta', idReceta);
    window.location.href = '../Home/recetas-informacion.html';
}

containerRecetas.addEventListener('click', (e) => {
    const publicacion = e.target.closest('.publicacion');
    if (!publicacion) return;
    irARecetaInfo(publicacion.dataset.id);
});


(async () => {
    usuarioAjeno = await obtenerDatosAjeno();
    await revisarSiLoSigo();
    await cargarRecetas();
})();