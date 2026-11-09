const idUsuario = Number(localStorage.getItem('id'));
let usuarioActual = null;

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
        document.getElementById('ftdeperfil').src = resolverFoto(u.foto_perfil);
        return u;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
}

async function cantdemanguitos() {
    if (!idUsuario) return null;
    try {
        const res = await fetch(
            `http://localhost:3000/mango/usuario/${idUsuario}`
        );
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const usuario = await res.json();
        console.log("Datos del usuario:", usuario);
        document.getElementById("cantManguitos").textContent =
            usuario.puntos ?? 0;

        return usuario;

    } catch (error) {
        console.error("Error al obtener los manguitos:", error);
        return null;
    }
}

const API = 'http://localhost:3000/mango';

let catalogo = [];
let puntos = 0;
let comprados = [];
let fotoActual = null;
let botonSeleccionado = null;
let paso = 'comprar';

const lista = document.getElementById('listaAvatares');
const botones = lista.querySelectorAll('.opcionavatar');

const popup = document.getElementById('popupCompra');
const compraFoto = document.getElementById('compraFoto');
const compraTitulo = document.getElementById('compraTitulo');
const compraTexto = document.getElementById('compraTexto');
const compraError = document.getElementById('compraError');
const compraCancelar = document.getElementById('compraCancelar');
const compraConfirmar = document.getElementById('compraConfirmar');

function normalizar(texto) {
    return String(texto ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

function mismoAvatar(a, b) {
    return normalizar(a) === normalizar(b);
}

function avatarDelBack(boton) {
    return catalogo.find(a => mismoAvatar(a.id, boton.dataset.avatar));
}

function idReal(boton) {
    return avatarDelBack(boton)?.id ?? boton.dataset.avatar;
}

function nombreDe(boton) {
    return boton.querySelector('.nombre-avatar').textContent;
}

function actualizarUsuario(usuario) {
    puntos = usuario.puntos ?? 0;
    comprados = (usuario.avatares ?? []).map(a => a.id);
    fotoActual = usuario.foto_perfil;
}

async function pedir(ruta, metodo, idAvatar) {
    const res = await fetch(`${API}/${ruta}`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUs: idUsuario, idAvatar })
    });
    const texto = await res.text();

    if (!res.ok) {
        const esMensajeDelBack = texto && !texto.trim().startsWith('<');
        throw new Error(esMensajeDelBack ? texto : 'Algo salió mal, probá de nuevo.');
    }
    return JSON.parse(texto);
}

async function comprarAvatar(boton) {
    if (!avatarDelBack(boton)) {
        throw new Error(`"${boton.dataset.avatar}" no está en la tienda del back.`);
    }

    const id = idReal(boton);
    const usuario = await pedir('comprarAvatar', 'POST', id);
    actualizarUsuario(usuario);

    document.getElementById('cantManguitos').textContent = puntos;

    if (!comprados.some(c => mismoAvatar(c, id))) {
        throw new Error('El back no registró la compra, probá de nuevo.');
    }
}

async function ponerAvatar(boton) {
    actualizarUsuario(await pedir('cambiarAvatar', 'PUT', idReal(boton)));
    localStorage.setItem('foto_perfil', fotoActual);
    usuarioActual = await obtenerDatosUsuario();   
    renderizar();
}

function estadoDe(boton) {
    const id = boton.dataset.avatar;
    if (mismoAvatar(id, fotoActual)) return 'equipado';
    if (comprados.some(c => mismoAvatar(c, id))) return 'comprado';
    if (puntos >= Number(boton.dataset.precio)) return 'alcanzable';
    return 'bloqueado';
}

function renderizar() {
    botones.forEach(boton => {
        const estado = estadoDe(boton);
        const precio = Number(boton.dataset.precio);
        const descripcion = boton.querySelector('.descripcion');

        boton.classList.remove('equipado', 'comprado', 'alcanzable', 'bloqueado');
        boton.classList.add(estado);
        boton.disabled = estado === 'bloqueado';

        if (estado === 'equipado' || estado === 'comprado') {
            descripcion.innerHTML = `<span>${boton.dataset.descripcion}</span>`;
        } else if (estado === 'alcanzable') {
            descripcion.innerHTML = `<span>${precio} manguitos</span>`;
        } else {
            descripcion.innerHTML = `
                <span>${precio} manguitos</span>
                <img class="candado" src="candado.png" alt="bloqueado">`;
        }
    });
}

function mostrarError(texto) {
    compraError.textContent = texto;
    compraError.hidden = false;
}

function abrirCompra(boton) {
    const precio = Number(boton.dataset.precio);
    botonSeleccionado = boton;
    paso = 'comprar';
    compraFoto.src = resolverFoto(idReal(boton));
    compraFoto.alt = nombreDe(boton);
    compraTitulo.textContent = `¿Comprar a ${nombreDe(boton)}?`;
    compraTexto.textContent = `Cuesta ${precio} manguitos. Te quedarían ${puntos - precio}.`;
    compraCancelar.textContent = 'Cancelar';
    compraConfirmar.textContent = 'Comprar';
    compraError.hidden = true;
    popup.showModal();
}

function mostrarPasoPoner(boton) {
    paso = 'poner';
    compraTitulo.textContent = `¡${nombreDe(boton)} es tuyo!`;
    compraTexto.textContent = '¿Te lo querés poner ahora?';
    compraCancelar.textContent = 'Ahora no';
    compraConfirmar.textContent = 'Ponérmelo';
}

lista.addEventListener('click', async (e) => {
    const boton = e.target.closest('.opcionavatar');
    if (!boton || boton.disabled) return;
    const estado = estadoDe(boton);
    if (estado === 'alcanzable') {
        abrirCompra(boton);            
    } else if (estado === 'comprado') {
        try {
            await ponerAvatar(boton);  
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }
});

compraConfirmar.addEventListener('click', async () => {
    compraConfirmar.disabled = true;
    compraError.hidden = true;
    try {
        if (paso === 'comprar') {
            await comprarAvatar(botonSeleccionado);
            renderizar();
            mostrarPasoPoner(botonSeleccionado);
        } else {
            await ponerAvatar(botonSeleccionado);
            popup.close();
        }
    } catch (error) {
        console.error(error);
        mostrarError(error.message);
        renderizar();
    } finally {
        compraConfirmar.disabled = false;
    }
});

compraCancelar.addEventListener('click', () => popup.close());

popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.close(); 
});

(async () => {
    usuarioActual = await obtenerDatosUsuario();
    await cantdemanguitos();
    if (!usuarioActual) return;
    try {
        const res = await fetch(`${API}/tienda`);
        if (res.ok) catalogo = await res.json();
    } catch (error) {
        console.warn('No se pudo traer /mango/tienda:', error);
    }

    botones.forEach(boton => {
        if (!avatarDelBack(boton)) console.warn(`"${boton.dataset.avatar}" no está en avatares.json`);
    });

    actualizarUsuario(usuarioActual);
    renderizar();
})();