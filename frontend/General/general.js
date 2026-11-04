const botonMas = document.querySelector("#botonMas");
const menuCrear = document.querySelector("#menuCrearpopup");

botonMas.addEventListener("click", (evento) => {
    evento.preventDefault();
    menuCrear.showModal();
});

menuCrear.addEventListener("click", (evento) => {
    if (evento.target === menuCrear) {
        menuCrear.close();
    }
});
function irAPerfil(idOtroUs) {
    const miId = Number(localStorage.getItem("id"));
    const idDestino = Number(idOtroUs);

    if (idDestino === miId) {
        window.location.href = "../Perfil/perfil.html";
        return;
    }

    localStorage.setItem("idPerfilAjeno", idDestino);
    window.location.href = "../Perfil/perfil-ajeno.html"; 
}

function estaGuardada(idReceta) {
    const lista = JSON.parse(localStorage.getItem("guardadas_" + localStorage.getItem("id"))) || [];
    return lista.includes(String(idReceta));
}

function marcarGuardada(idReceta) {
    const clave = "guardadas_" + localStorage.getItem("id");
    const lista = JSON.parse(localStorage.getItem(clave)) || [];
    if (!lista.includes(String(idReceta))) {
        lista.push(String(idReceta));
        localStorage.setItem(clave, JSON.stringify(lista));
    }
}



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

function pintarInsignias(nivel) {
    const insignias = document.querySelectorAll("#insignias .insignia");

    insignias.forEach(insignia => {
        const maestria = insignia.dataset.maestria;
        const nivelMaestria = (nivel || {})[maestria];

        if (!nivelMaestria || nivelMaestria === "Tierra") {
            insignia.style.display = "none";
            return;
        }

        insignia.style.display = "";
        insignia.dataset.nivel = nivelMaestria.toLowerCase();
        insignia.title = `${maestria}: ${nivelMaestria}`;
    });
}