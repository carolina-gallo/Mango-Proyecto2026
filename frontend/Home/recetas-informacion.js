const idReceta = localStorage.getItem("idReceta");
const usuarioId = localStorage.getItem("id");

fetch("http://localhost:3000/mango/feedRecetas")
  .then(response => response.json())
  .then(recetas => {
    let receta = null;

    for (let i = 0; i < recetas.length; i++) {
      if (recetas[i].id === idReceta) {
        receta = recetas[i];
        break;
      }
    }

    mostrarReceta(receta);
  })
  .catch(error => console.error("Error al cargar la receta:", error));

  const contenedor = document.getElementById("contenedorReceta")

function mostrarReceta(receta) {
  const ingredientes = receta.ingredientes || [];
  const pasos = receta.pasos_receta || [];

    contenedor.innerHTML = 
    `<img src="${receta.imagen_receta}" alt="${receta.imagen_receta}" class="fotoreceta">
    <span><a href="homerecetas.html">
    <img class="flechaatras" src="flechaatras.png" alt="volver">
    </a></span>
    <span><img class="guardado" src="guardado.png" alt="guardar"></span>
</img>
  <article class = contenedorInfo>
    <h1>${receta.nombre}</h1>
    <p class="descripcion">${receta.descripcion}</p>
    <section class="filtros">
        <span class="filtro">img</span>
        <span class="filtro">img</span>
        <span class="filtro">img</span>
        <span class="filtro grande">img</span>
        <span class="filtro grande">img</span>
    </section>
    <section class="ingredientes" id="ingredientesReceta">
    <h2>Ingredientes</h2>
         <ul>
    ${receta.ingredientes.map(ingredientes => `<li>${ingredientes}</li>`).join('')}
          </ul>
    </section>
        <section id="pasosReceta" class="pasos">
        <h2>Pasos a seguir</h2>
        <ol>
    ${receta.pasos_receta.map(pasos => `<li>${pasos}</li>`).join('')}
          </ol>
    </section>
    
    <section class="trucos">
        <h2>Trucos</h2>
        <ul class="lista-trucos">
    ${receta.trucos.map(truco => `<li>${truco}</li>`).join('')}
          </ul>
    </article>`
  };

  const circulos = document.querySelectorAll(".filtros .filtro");
  circulos.forEach((circulo, i) => {
    if (circulo.classList.contains("grande")) {
      const resto = receta.filtros.length - 3;
      circulo.textContent = resto > 0 ? `+${resto}` : "";
    } else {
      circulo.title = receta.filtros[i] || "";
    }
  });

  const contenedorComentarios = document.getElementById("#comentariosReceta");
  contenedorComentarios.innerHTML = "";
  receta.comentarios.forEach(c => {
    const div = document.createElement("div");
    div.className = "comentario";
    div.innerHTML = `
      <figure class="comentarios-avatar"></figure>
      <article>
        <p class="comentario-nombre"></p>
        <p class="comentario-texto"></p>
      </article>`;
    div.querySelector(".comentario-nombre").textContent = c.username;
    div.querySelector(".comentario-texto").textContent = c.texto;
    contenedor.appendChild(div);
  });
