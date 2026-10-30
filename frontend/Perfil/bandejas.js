document.addEventListener('DOMContentLoaded', () => {
    // Configurar botón volver
    document.getElementById('btnVolver').addEventListener('click', () => {
        window.history.back();
    });

    cargarDetalleBandeja();
});

async function cargarDetalleBandeja() {
    // 1. Obtener el ID de la bandeja desde los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idBandeja = urlParams.get('id');

    if (!idBandeja) {
        document.getElementById('tituloBandeja').textContent = 'Bandeja no encontrada';
        return;
    }

    const idUsuario = localStorage.getItem('idUsuario') || 67; 

    try {
        // 2. Traer las bandejas del usuario
        const respuesta = await fetch('http://localhost:3000/mango/mostrarBandejas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUs: Number(idUsuario) })
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const bandejas = await respuesta.json();

        // 3. Filtrar la bandeja seleccionada por ID
        const bandejaEncontrada = bandejas.find(b => b.id === idBandeja);

        if (!bandejaEncontrada) {
            document.getElementById('tituloBandeja').textContent = 'Bandeja no existe';
            return;
        }

        // 4. Actualizar título y renderizar las recetas
        document.getElementById('tituloBandeja').textContent = bandejaEncontrada.nombre_bandeja;
        renderizarRecetas(bandejaEncontrada.recetas_bandeja || []);

    } catch (error) {
        console.error('Error al cargar la bandeja:', error);
        document.getElementById('tituloBandeja').textContent = 'Error al cargar';
    }
}

function renderizarRecetas(recetas) {
    const contenedor = document.getElementById('contenedorRecetas');
    contenedor.innerHTML = '';

    if (recetas.length === 0) {
        contenedor.innerHTML = '<p class="sin-recetas">Esta bandeja está vacía.</p>';
        return;
    }

    recetas.forEach(receta => {
        // Cambiamos 'article' por 'a' para la navegación directa
        const tarjeta = document.createElement('a');
        tarjeta.classList.add('tarjeta-receta');
        
        // Redirige a la pantalla dentro de la carpeta Home pasando el id
        tarjeta.href = `Home/recetas-informacion.html?id=${receta.id}`;

        tarjeta.innerHTML = `
            <img class="img-receta" src="${receta.imagen_receta}" alt="${receta.nombre}">
            <div class="info-receta">
                <h3>${receta.nombre}</h3>
                <p class="desc-receta">${receta.descripcion || ''}</p>
                <span class="likes">❤️ ${receta.likes_receta || 0}</span>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}