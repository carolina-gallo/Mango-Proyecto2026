
let recetas = [];

const scrolleo = document.querySelector(".scrolleo");

fetch('http://localhost:3000/mango/mostrarRecetas')
  .then(response => response.json())
  .then(data => {
    recetas = data;
    mostrarRecetas(recetas);
  })
  .catch(error => {
    console.error('Error al leer las recetas:', error);
    scrolleo.innerHTML = "<p>No se pudieron cargar las recetas</p>";
  });

function mostrarRecetas(lista) {
  scrolleo.innerHTML = "";

  lista.forEach(receta => {
    const section = document.createElement("section");
    section.className = "publicacion";
    section.dataset.id = receta.id;
    section.innerHTML = `
        <figure class="imagen">
            <img class="fotoReceta" src="${receta.imagen_receta}" alt="${receta.imagen_receta}">
            <p class="nombredeusuario">${receta.id_usuario}</p>
        </figure>
        <div class="contenido">
            <h2 class="titulo">${receta.nombre}</h2>
            <p class="descripcion">${receta.descripcion}</p>
        </div>
        <div class="interacciones">
            <span><img class="guardado" src="guardado.png" alt="guardar"></span>
            <span><img class="comentarios" src="comentariosr.png" alt="comentar"></span>
            <span><img class="hipervinculo" src="link.png" alt="hipervinculo"></span>
        </div>
        <div class="filtros">
            <span class="filtro"></span>
            <span class="filtro"></span>
            <span class="filtro"></span>
        </div>`;

    scrolleo.appendChild(section);
  });
}

 