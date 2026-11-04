const idUsuario = Number(localStorage.getItem('id'));
const containerRecetas = document.getElementById('recetas');

let usuarioActual = null;

const likeVacio = '../Home/like_vacio.png';
const likeLleno = '../Home/like_lleno.png';

const otrosFiltros = {
    salado: 'Salado', dulce: 'Dulce', umami: 'Umami', picante: 'Picante',
    agridulce: 'Agridulce', acido: 'Ácido',
    bebida: 'Bebida', comida: 'Comida', postre: 'Postre', snack: 'Snack',
    '1-15min': '1-15 min', '15-30min': '15-30 min', '30-60min': '30-60 min', '60+min': '+60 min',
    horno: 'Horno', airfryer: 'Airfryer', sarten: 'Sarten', olla: 'Olla',
    microondas: 'Microondas', heladera: 'Heladera', nada: 'Nada',
    alta: 'Alta', media: 'Media', baja: 'Baja'
};

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



async function obtenerDatosUsuario() {
    if (!idUsuario) return null;
    try {
        const res = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
        const u = await res.json();

        document.getElementById('fotoPerfil').src = resolverFoto(u.foto_perfil);
        document.getElementById('nombreUsuario').textContent = u.username;
        document.getElementById('descripcionPerfil').textContent = u.descripcion ?? '';
        document.getElementById('cantPublicaciones').textContent = u.qpub ?? 0;
        document.getElementById('cantSeguidores').textContent = u.seguidores ?? 0;
        document.getElementById('cantSeguidos').textContent = u.seguidos ?? 0;
        return u;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
}










// ---------- INSIGNIAS (maestrías) ----------
const NIVELES_MAESTRIA = ['tierra', 'bronce', 'plata', 'oro', 'prestigio'];
const CARPETA_FOTOS_MAESTRIAS = '../Z Fotos Maestrias';

const MAESTRIAS = {
    dulce:     { archivo: 'dulce',     claves: ['dulce'] },
    saladas:   { archivo: 'saladas',   claves: ['salado'] },
    proteicas: { archivo: 'proteicas', claves: ['proteico'] },
    grasas:    { archivo: 'grasas',    claves: ['bajo_en_colesterol', 'bajo en colesterol'] },
    rapidas:   { archivo: 'rapidas',   claves: ['quince_min', '1- 15 min'] }
};

function normalizarNivel(nivel) {
    const n = String(nivel ?? '').trim().toLowerCase();
    return NIVELES_MAESTRIA.includes(n) ? n : 'tierra';
}

function nivelDeMaestria(usuario, maestria) {
    const claves = MAESTRIAS[maestria]?.claves ?? [maestria];
    const niveles = usuario?.nivel ?? {};
    for (const clave of claves) {
        if (niveles[clave] !== undefined) return normalizarNivel(niveles[clave]);
    }
    return 'tierra';
}

function cargarInsignias(usuario) {
    document.querySelectorAll('#insignias .insignia').forEach(span => {
        const maestria = span.dataset.maestria;
        const info = MAESTRIAS[maestria];
        if (!info) return;

        const nivel = nivelDeMaestria(usuario, maestria);

        // Tierra no se muestra: solo de bronce para arriba
        if (nivel === 'tierra') {
            span.remove();
            return;
        }

        const src = encodeURI(`${CARPETA_FOTOS_MAESTRIAS}/${info.archivo}_${nivel}.png`);
        span.innerHTML = `<img src="${src}" alt="${maestria} ${nivel}" title="${maestria} - ${nivel}">`;
    });
}











function clavesActivas(filtros) {
    if (Array.isArray(filtros)) return filtros;
    return Object.keys(filtros ?? {}).filter(k => filtros[k] === true);
}

function armarFiltros(filtros) {
    const activos = clavesActivas(filtros);
    const imagenes = activos
        .filter(k => etiquetasFiltros[k])
        .map(k => `<img src="${etiquetasFiltros[k]}" alt="${k}" class="filtro">`)
        .join('');
    
        const textos = activos
        .filter(k => otrosFiltros[k])
        .map(k => `<p class="filtro grande">${otrosFiltros[k]}</p>`)
        .join('');
    return imagenes + textos;
}

async function cargarRecetas() {
    if (!idUsuario) {
        containerRecetas.innerHTML = '<p class="mensaje-vacio">No se encontró la sesión del usuario.</p>';
        return;
    }
    try {
        const res = await fetch('http://localhost:3000/mango/recUsuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idUsuario })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const recetas = await res.json();

        if (!Array.isArray(recetas) || recetas.length === 0) {
            containerRecetas.innerHTML = '<p class="mensaje-vacio">No has publicado recetas todavía.</p>';
            return;
        }
        mostrarRecetas(recetas);
    } catch (error) {
        console.error('Error al cargar las recetas:', error);
        containerRecetas.innerHTML = '<p class="mensaje-error">Error al cargar las recetas.</p>';
    }
}

function mostrarRecetas(recetas) {
    const nombre = usuarioActual?.username || '';

    containerRecetas.innerHTML = recetas.map(receta => {
        const leDioLike = (receta.likes_usuarios || []).includes(idUsuario);
        return `
        <section class="publicacion" data-id="${receta.id}">
            <figure class="imagen">
                <div class="like-receta">
                    <img class="corazon" src="${leDioLike ? likeLleno : likeVacio}" alt="like">
                </div>
                <img class="fotoReceta" src="${receta.imagen_receta}" alt="${receta.nombre}">
                <p class="nombredeusuario">${nombre}</p>
            </figure>
            <div class="contenido">
                <h2 class="titulo">${receta.nombre}</h2>
                <p class="descripcion">${receta.descripcion ?? ''}</p>
            </div>
            <div class="interacciones">
                <span class="icono"><img class="guardado" src="../Home/guardado.png" alt="guardar"></span>
                <span class="icono"><img class="comentarios" src="../Home/comentariosr.png" alt="comentar"></span>
            </div>
            <div class="filtros">${armarFiltros(receta.filtros)}</div>
        </section>`;
    }).join('');

    activarVerMas();
}

function activarVerMas() {
    containerRecetas.addEventListener('click', (e) => {
    const publicacion = e.target.closest('.publicacion');
    if (!publicacion) return;
    const idReceta = publicacion.dataset.id;

    const botonLike = e.target.closest('.like-receta');
    if (botonLike) {
        alternarLike(botonLike, idReceta);
        return;
    }

    const icono = e.target.closest('.icono');
    if (icono) {
        const img = icono.querySelector('img');
        if (img.classList.contains('guardado')) {
            const imagen = publicacion.querySelector('.fotoReceta').src;
            abrirPopupBandeja(idReceta, imagen, img);
        } else if (img.classList.contains('comentarios')) {
            irARecetaInfo(idReceta);
        }
        return;
    }

    const clickeable = ['titulo', 'fotoReceta', 'descripcion', 'mas', 'filtro', 'filtros']
        .some(c => e.target.classList.contains(c));
    if (clickeable) irARecetaInfo(idReceta);
});

async function alternarLike(botonLike, idRec) {
    const img = botonLike.querySelector('.corazon');
    const yaTieneLike = img.src.includes('like_lleno.png');

    // Cambia el ícono al instante
    img.src = yaTieneLike ? likeVacio : likeLleno;

    try {
        await fetch(`http://localhost:3000/mango/receta/${yaTieneLike ? 'dislike' : 'like'}`, {
            method: yaTieneLike ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idUsuario, idRec })
        });
    } catch (error) {
        console.error('Error al actualizar el like:', error);
        img.src = yaTieneLike ? likeLleno : likeVacio; // si falla, vuelve atrás
    }
};
}

function irARecetaInfo(idReceta) {
    localStorage.setItem('idReceta', idReceta);
    window.location.href = '../Home/recetas-informacion.html';
}

function alternarIcono(img, normal, activo) {
    img.src = img.src.includes(activo) ? normal : activo;
}

containerRecetas.addEventListener('click', (e) => {
    const publicacion = e.target.closest('.publicacion');
    if (!publicacion) return;
    const idReceta = publicacion.dataset.id;

    const icono = e.target.closest('.icono');
    if (icono) {
        const img = icono.querySelector('img');
        if (img.classList.contains('guardado')) {
            const imagen = publicacion.querySelector('.fotoReceta').src;
            abrirPopupBandeja(idReceta, imagen, img);
        } else if (img.classList.contains('hipervinculo')) {
            alternarIcono(img, '../Home/link.png', '../Home/link-amarillo.png');
        } else if (img.classList.contains('comentarios')) {
            irARecetaInfo(idReceta);
        }
        return;
    }

    const clickeable = ['titulo', 'fotoReceta', 'descripcion', 'mas', 'filtro', 'filtros']
        .some(c => e.target.classList.contains(c));
    if (clickeable) irARecetaInfo(idReceta);
});

const popupBandejas = document.getElementById('popupBandejas');
const vistasPopup = popupBandejas.querySelectorAll('.bandejas-vista');
const grillaBandejas = document.getElementById('grillaBandejas');
const inputNombreBandeja = document.getElementById('inputNombreBandeja');

let recetaAGuardar = null;
let bandejaElegida = null;
let seGuardo = false;

function cambiarVista(idVista) {
    vistasPopup.forEach(v => { v.hidden = v.id !== idVista; });
}

function abrirPopupBandeja(idReceta, imagen, img) {
    recetaAGuardar = { id: idReceta, imagen, img };
    bandejaElegida = null;
    seGuardo = false;
    inputNombreBandeja.value = '';
    img.src = '../Home/guardado.png';
    cambiarVista('vistaOpciones');
    popupBandejas.showModal();
}

popupBandejas.addEventListener('click', (e) => {
    if (e.target === popupBandejas) popupBandejas.close();
});

popupBandejas.addEventListener('close', () => {
    if (!seGuardo && recetaAGuardar) recetaAGuardar.img.src = '../Home/guardado.png';
});

document.getElementById('botonCrearBandeja').addEventListener('click', () => {
    cambiarVista('vistaNuevaBandeja');
});

document.getElementById('botonGuardarNuevaBandeja').addEventListener('click', async () => {
    const nombre = inputNombreBandeja.value.trim();
    if (nombre === '') return;
    try {
        const res = await fetch('http://localhost:3000/mango/crearBandeja', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_usuario: idUsuario,
                imagen_bandeja: recetaAGuardar.imagen,
                nombre_bandeja: nombre,
                filtros: {}
            })
        });
        const bandeja = await res.json();
        guardarEnBandeja(bandeja.id);
    } catch (error) {
        console.error('No se pudo crear la bandeja:', error);
    }
});

document.getElementById('botonBandejaExistente').addEventListener('click', async () => {
    cambiarVista('vistaBandejas');
    grillaBandejas.innerHTML = '';
    try {
        const res = await fetch(`http://localhost:3000/mango/bandejasUsuario/${idUsuario}`);
        const bandejas = await res.json();

        if (bandejas.length === 0) {
            grillaBandejas.innerHTML = '<p>Todavía no tenés bandejas</p>';
            return;
        }
        bandejas.forEach(bandeja => {
            const foto = document.createElement('img');
            foto.className = 'bandeja-foto';
            foto.src = bandeja.imagen_bandeja;
            foto.alt = bandeja.nombre_bandeja;
            foto.title = bandeja.nombre_bandeja;
            foto.dataset.id = bandeja.id;
            grillaBandejas.appendChild(foto);
        });
    } catch (error) {
        grillaBandejas.innerHTML = '<p>No se pudieron cargar tus bandejas</p>';
    }
});

grillaBandejas.addEventListener('click', (e) => {
    const foto = e.target.closest('.bandeja-foto');
    if (!foto) return;
    grillaBandejas.querySelectorAll('.bandeja-foto').forEach(f => f.classList.remove('elegida'));
    foto.classList.add('elegida');
    bandejaElegida = foto.dataset.id;
});

document.getElementById('botonGuardarEnBandeja').addEventListener('click', () => {
    if (bandejaElegida) guardarEnBandeja(bandejaElegida);
});

async function guardarEnBandeja(idBandeja) {
    try {
        const res = await fetch('http://localhost:3000/mango/guardarRec', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idBandeja, idRec: recetaAGuardar.id })
        });
        const texto = await res.text();
        try { JSON.parse(texto); } catch { alert(texto); return; }

        seGuardo = true;
        recetaAGuardar.img.src = '../Home/guardado-amarillo.png';
        popupBandejas.close();
    } catch (error) {
        console.error('No se pudo guardar la receta:', error);
    }
}

(async () => {
    usuarioActual = await obtenerDatosUsuario();
    if (usuarioActual) cargarInsignias(usuarioActual);
    await cargarRecetas();
})();