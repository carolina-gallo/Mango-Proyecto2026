const idUsuario = Number(localStorage.getItem('id'));

const NIVELES = ['tierra', 'bronce', 'plata', 'oro', 'prestigio'];

// Carpeta de fotos, relativa a maestrias.html (frontend/Rachas/)
const CARPETA_FOTOS = '../Z Fotos Maestrias';

// data-maestria del HTML (= prefijo del archivo) -> claves posibles en usuario.nivel
const CLAVES_NIVEL = {
    dulce:     ['dulce'],
    saladas:   ['salado'],
    proteicas: ['proteico'],
    grasas:    ['bajo_en_colesterol', 'bajo en colesterol'],
    rapidas:   ['quince_min', '1- 15 min']
};

// Archivos: dulce_tierra.png, saladas_oro.png, etc.
function rutaFoto(maestria, nivel) {
    return encodeURI(`${CARPETA_FOTOS}/${maestria}_${nivel}.png`);
}

function normalizarNivel(nivel) {
    const n = String(nivel ?? '').trim().toLowerCase();
    return NIVELES.includes(n) ? n : 'tierra';
}

function nivelDeMaestria(usuario, maestria) {
    const claves = CLAVES_NIVEL[maestria] ?? [maestria];
    const niveles = usuario?.nivel ?? {};
    for (const clave of claves) {
        if (niveles[clave] !== undefined) return normalizarNivel(niveles[clave]);
    }
    return 'tierra';
}

async function cargarMaestrias() {
    if (!idUsuario) {
        console.warn('No hay id en localStorage, iniciá sesión');
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const usuario = await res.json();

        document.querySelectorAll('.maestria').forEach(articulo => {
            const maestria = articulo.dataset.maestria;
            if (!maestria) return;

            const nivel = nivelDeMaestria(usuario, maestria);
            const foto = articulo.querySelector('.fotoDeMaestria');

            foto.src = rutaFoto(maestria, nivel);
            foto.alt = `Maestría ${maestria} nivel ${nivel}`;
        });
    } catch (error) {
        console.error('Error al cargar las maestrías:', error);
    }
}

cargarMaestrias();