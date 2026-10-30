document.addEventListener('DOMContentLoaded', () => {
    cargarRecetasDeBandeja();
});

async function cargarRecetasDeBandeja() {
    const urlParams = new URLSearchParams(window.location.search);
    const idBandeja = urlParams.get('id');

    const idUsuario = localStorage.getItem('idUsuario') || localStorage.getItem('id') || localStorage.getItem('id_usuario') || 67;
    const idEnviar = isNaN(Number(idUsuario)) ? idUsuario : Number(idUsuario);

    const tituloElemento = document.getElementById('titulo-bandeja');
    const contenedor = document.getElementById('contenedor-recetas');

    if (!idBandeja) {
        if (tituloElemento) tituloElemento.textContent = 'Bandeja no encontrada';
        if (contenedor) contenedor.innerHTML = '<p class="sin-recetas">No se especificó ninguna bandeja.</p>';
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:3000/mango/mostrarBandejas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idEnviar })
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const bandejas = await respuesta.json();
        const bandejaElegida = bandejas.find(b => String(b.id) === String(idBandeja));

        if (!bandejaElegida) {
            if (tituloElemento) tituloElemento.textContent = 'Bandeja no encontrada';
            if (contenedor) contenedor.innerHTML = '<p class="sin-recetas">La bandeja solicitada no existe.</p>';
            return;
        }

        if (tituloElemento) {
            tituloElemento.textContent = bandejaElegida.nombre_bandeja;
        }

        const recetas = bandejaElegida.recetas_bandeja || bandejaElegida.recetas || [];
        renderizarRecetas(recetas);

    } catch (error) {
        console.error('Error al cargar la bandeja:', error);
        if (contenedor) {
            contenedor.innerHTML = '<p class="sin-recetas">Error al cargar las recetas.</p>';
        }
    }
}

function renderizarRecetas(listaRecetas) {
    const contenedor = document.getElementById('contenedor-recetas');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!Array.isArray(listaRecetas) || listaRecetas.length === 0) {
        contenedor.innerHTML = '<p class="sin-recetas">Esta bandeja no contiene recetas aún.</p>';
        return;
    }

    listaRecetas.forEach(receta => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-receta');
        tarjeta.style.cursor = 'pointer';

        const nombre = receta.nombre || receta.titulo || 'Receta sin título';
        const imagen = receta.imagen_receta || receta.imagen || 'https://via.placeholder.com/300?text=Sin+imagen';
        const descripcion = receta.descripcion || '';

        tarjeta.innerHTML = `
            <img class="foto-receta" src="${imagen}" alt="${nombre}">
            <div class="info-receta">
                <h3>${nombre}</h3>
                <p>${descripcion}</p>
            </div>
        `;

        // Guarda el ID y abre la vista detallada en Home
        tarjeta.addEventListener('click', () => {
            const idReceta = receta.id ?? receta.id_receta ?? receta.idRec;

            if (idReceta !== undefined && idReceta !== null) {
                localStorage.setItem('idReceta', String(idReceta));
                window.location.href = '../Home/recetas-informacion.html';
            } else {
                console.error('La receta no posee ID:', receta);
            }
        });

        contenedor.appendChild(tarjeta);
    });
}