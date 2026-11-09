
const idUsuario = Number(localStorage.getItem('id'));

const NIVELES = ['tierra', 'bronce', 'plata', 'oro', 'prestigio'];

const CARPETA_FOTOS = '../Z Fotos Maestrias';

const CLAVES_NIVEL = {
    dulce: ['dulce'],
    saladas: ['salado'],
    proteicas: ['proteico'],
    grasas: ['bajo colesterol', 'bajo en colesterol'],
    rapidas: ['1-15min', '1-15 min']
};

const CLAVES_PROGRESO = {
    dulce: ['dulce'],
    saladas: ['salado'],
    proteicas: ['proteico'],
    grasas: ['bajo colesterol', 'bajo en colesterol'],
    rapidas: ['1-15min', '1-15 min']
};

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
        if (niveles[clave] !== undefined) {
            return normalizarNivel(niveles[clave]);
        }
    }

    return 'tierra';
}

function progresoDeMaestria(usuario, maestria) {
    const claves = CLAVES_PROGRESO[maestria] ?? [maestria];

    for (const clave of claves) {
        if (usuario[clave] !== undefined) {
            const valor = Number(usuario[clave]);
            return Number.isFinite(valor)
                ? Math.max(0, Math.min(100, valor))
                : 0;
        }
    }

    return 0;
}

async function cargarMaestrias() {
    if (!idUsuario) {
        console.warn('No hay id en localStorage, iniciá sesión.');
        return;
    }

    try {
        const resMaes = await fetch('http://localhost:3000/listamaes');
        console.log('Estado de /listamaes:', resMaes.status);
        if (!resMaes.ok) {
            throw new Error(`Error al obtener las maestrías: HTTP ${resMaes.status}`);
        }
        const datosMaes = await resMaes.json();
        console.log('Datos de maestrías recibidos:', datosMaes);

        if (!Array.isArray(datosMaes)) {
            throw new Error('La respuesta de /listamaes no es un array.');
        }

        const usuarioMaes = datosMaes.find(
            usuario => Number(usuario.idUsuario) === idUsuario
        );

        if (!usuarioMaes) {
            console.warn(`No se encontraron maestrías para el usuario ${idUsuario}.`);
        }

        let usuario = {};

        try {
            const resUsuario = await fetch(
                `http://localhost:3000/mango/usuario/${idUsuario}`
            );

            if (resUsuario.ok) {
                usuario = await resUsuario.json();
            } else {
                console.warn('No se pudieron obtener los niveles del usuario.');
            }
        } catch (error) {
            console.warn('No se pudieron obtener los niveles:', error);
        }

        document.querySelectorAll('.maestria').forEach(articulo => {
            const maestria = articulo.dataset.maestria;

            if (!maestria) return;
            const nivel = nivelDeMaestria(usuario, maestria);
            const foto = articulo.querySelector('.fotoDeMaestria');

            if (foto) {
                foto.src = rutaFoto(maestria, nivel);
                foto.alt = `Maestría ${maestria}, nivel ${nivel}`;
            }

            const progreso = usuarioMaes
                ? progresoDeMaestria(usuarioMaes, maestria)
                : 0;

            const texto = articulo.querySelector('.cuatodecien');
            const barra = articulo.querySelector('.partenaranja');

            if (texto) {
                texto.textContent = `${progreso}/100`;
            }
            if (barra) {
                barra.style.width = `${progreso}%`;
            }
            console.log(`${maestria}: ${progreso}/100`);
        });

    } catch (error) {
        console.error('Error al cargar las maestrías:', error);
    }
}
cargarMaestrias();
