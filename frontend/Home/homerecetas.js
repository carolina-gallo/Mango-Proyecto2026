
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

const descripciones = document.querySelectorAll(".descripcion");

descripciones.forEach((descripcion) => {
    const completo = descripcion.textContent;

    if (completo.length > 47) {
        descripcion.innerHTML = completo.substring(0, 47) + '<span class="mas">... más</span>';

        descripcion.querySelector(".mas").addEventListener("click", (e) => {
            e.preventDefault()
            window.location.href = "recetas-informacion.html"
        });
    }
});

const tituloReceta = document.getElementById("tituloReeceta");
const fotoReceta = document.getElementById("fotoReceta");
const descripcionReceta = document.getElementById("descripcion");

// Función para abrir la información de la receta
function abrirReceta() {
    const receta = {
        titulo: tituloReceta.textContent,
        foto: fotoReceta.src,
        descripcion: descripcionReceta.textContent,
        username: document.getElementById("username").textContent
    };

    localStorage.setItem("recetaSeleccionada", JSON.stringify(receta));

    window.location.href = "recetas-informacion.html";
}

// Al tocar el título
tituloReceta.addEventListener("click", abrirReceta);

// Al tocar la foto
fotoReceta.addEventListener("click", abrirReceta);

// Al tocar la descripción
descripcionReceta.addEventListener("click", abrirReceta);



//esto no anda
const guardado = document.querySelector(".guardado");

guardado.addEventListener("click", (ponerAmarillo) => {
    
    ponerAmarillo= guardado.src.includes("guardado-amariillo.png");

  
});