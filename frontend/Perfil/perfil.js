document.addEventListener('DOMContentLoaded', () => {
    cargarRecetasUsuario();
});

async function cargarRecetasUsuario() {
    const contenedorRecetas = document.getElementById('recetas');

    // 1. Compatibilidad con las distintas claves de localStorage
    const idUsuario = localStorage.getItem('id') || localStorage.getItem('id_usuario') || localStorage.getItem('idUs');

    if (!idUsuario) {
        console.error("No se encontró ningún ID de usuario en localStorage.");
        contenedorRecetas.innerHTML = '<p class="mensaje-vacio">No se encontró la sesión del usuario.</p>';
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:3000/mango/recUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUs: Number(idUsuario) })
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const recetas = await respuesta.json();
        console.log("Recetas recibidas del backend:", recetas);

        if (!Array.isArray(recetas) || recetas.length === 0) {
            contenedorRecetas.innerHTML = '<p class="mensaje-vacio">No has publicado recetas todavía.</p>';
            return;
        }

        contenedorRecetas.innerHTML = '';

        recetas.forEach(receta => {
            const card = document.createElement('article');
            card.classList.add('tarjeta-receta');
            card.style.cursor = 'pointer';

            // Propiedades usadas en recetas-informacion.js: receta.nombre e receta.imagen_receta
            const nombre = receta.nombre || receta.titulo || 'Receta sin título';
            const imagen = receta.imagen_receta || receta.imagen || '';

            card.innerHTML = `
                <div class="info-receta">
                    <h3>${nombre}</h3>
                    <p>${receta.descripcion || ''}</p>
                </div>
                ${imagen ? `<img src="${imagen}" alt="${nombre}">` : ''}
            `;

            // Al hacer click, detectamos el ID real de la receta
            card.addEventListener('click', () => {
                const idReceta = receta.id ?? receta.id_receta ?? receta.idRec;
                
                if (idReceta === undefined || idReceta === null) {
                    console.error("La receta no tiene un ID válido:", receta);
                    alert("Error: No se pudo obtener el ID de esta receta.");
                    return;
                }

                console.log("Guardando idReceta en localStorage:", idReceta);
                localStorage.setItem("idReceta", idReceta);
                
                window.location.href = "../Home/recetas-informacion.html";
            });

            contenedorRecetas.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar las recetas:', error);
        contenedorRecetas.innerHTML = '<p class="mensaje-error">Error al cargar las recetas.</p>';
    }
}