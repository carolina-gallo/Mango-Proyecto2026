const idUsuario = Number(localStorage.getItem("id"));

document.addEventListener('DOMContentLoaded', () => {
    obtenerDatosUsuario();
    cargarRecetasUsuario();
});

async function obtenerDatosUsuario() {
  if (!idUsuario) return;
  try {
    const respuesta = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
    const usuario = await respuesta.json();

    document.getElementById("fotoPerfil").src = usuario.foto_perfil;
    document.getElementById("nombreUsuario").textContent = usuario.username;
    document.getElementById("descripcionPerfil").textContent = usuario.descripcion;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
  }
}

async function cargarRecetasUsuario() {
    const contenedorRecetas = document.getElementById('recetas');

    if (!idUsuario) {
        contenedorRecetas.innerHTML = '<p class="mensaje-vacio">No se encontró la sesión del usuario.</p>';
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:3000/mango/recUsuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs: idUsuario })
        });

        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        const recetas = await respuesta.json();

        if (!Array.isArray(recetas) || recetas.length === 0) {
            contenedorRecetas.innerHTML = '<p class="mensaje-vacio">No has publicado recetas todavía.</p>';
            return;
        }

        contenedorRecetas.innerHTML = '';

        recetas.forEach(receta => {
            const card = document.createElement('article');
            card.classList.add('tarjeta-receta');
            card.style.cursor = 'pointer';

            card.innerHTML = `
                <div class="info-receta">
                    <h3>${receta.nombre}</h3>
                    <p>${receta.descripcion || ''}</p>
                </div>
                ${receta.imagen_receta ? `<img src="${receta.imagen_receta}" alt="${receta.nombre}">` : ''}
            `;

            card.addEventListener('click', () => {
                localStorage.setItem("idReceta", receta.id);
                window.location.href = "../Home/recetas-informacion.html";
            });

            contenedorRecetas.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar las recetas:', error);
        contenedorRecetas.innerHTML = '<p class="mensaje-error">Error al cargar las recetas.</p>';
    }
}