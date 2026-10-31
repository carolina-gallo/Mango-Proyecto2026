const idUsuario = Number(localStorage.getItem("id"));

document.addEventListener('DOMContentLoaded', () => {
    obtenerDatosUsuario();
    obtenerBandejasUsuario();
});

async function obtenerDatosUsuario() {
    if (!idUsuario) return;
    try {
        const respuesta = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
        const usuario = await respuesta.json();

        const foto = usuario.foto_perfil || "default.jpg";
        document.getElementById("fotoPerfil").src = foto.startsWith("http") ? foto : `../avatares/${foto}.png`;

        document.getElementById("nombreUsuario").textContent = usuario.username;
        document.getElementById("descripcionPerfil").textContent = usuario.descripcion;

        document.getElementById("cantPublicaciones").textContent = usuario.qpub ?? 0;
        document.getElementById("cantSeguidores").textContent = usuario.seguidores ?? 0;
        document.getElementById("cantSeguidos").textContent = usuario.seguidos ?? 0;
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}

async function obtenerBandejasUsuario() {
    const contenedor = document.getElementById('bandejas');

    if (!idUsuario) {
        contenedor.innerHTML = '<p class="sin-bandejas">No se encontró la sesión del usuario.</p>';
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:3000/mango/mostrarBandejas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idUsuario })
        });

        if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);

        const bandejas = await respuesta.json();
        renderizarBandejas(bandejas);
    } catch (error) {
        console.error('Error al obtener las bandejas:', error);
        contenedor.innerHTML = '<p class="sin-bandejas">Error al cargar las bandejas.</p>';
    }
}

function renderizarBandejas(listaBandejas) {
    const contenedor = document.getElementById('bandejas');
    contenedor.innerHTML = '';

    if (!listaBandejas || listaBandejas.length === 0) {
        contenedor.innerHTML = '<p class="sin-bandejas">No tienes bandejas creadas.</p>';
        return;
    }

    listaBandejas.forEach(bandeja => {
        const enlaceBandeja = document.createElement('a');
        enlaceBandeja.classList.add('bandeja');
        enlaceBandeja.href = `bandejas.html?id=${bandeja.id}`;

        const recetas = bandeja.recetas_bandeja || [];
        const ultimaReceta = recetas.length > 0 ? recetas[recetas.length - 1] : null;

        const imagenUrl = (ultimaReceta && ultimaReceta.imagen_receta)
            ? ultimaReceta.imagen_receta
            : bandeja.imagen_bandeja;

        enlaceBandeja.innerHTML = `
            <img class="fotoBandeja" src="${imagenUrl}" alt="${bandeja.nombre_bandeja}">
            <p class="NombreBandeja">${bandeja.nombre_bandeja}</p>
        `;

        contenedor.appendChild(enlaceBandeja);
    });
}