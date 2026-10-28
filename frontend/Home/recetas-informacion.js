const idReceta = localStorage.getItem("idReceta");
const idUsuario = localStorage.getItem("id_usuario") || localStorage.getItem("id");
const contenedor = document.getElementById("contenedorReceta");
const input = document.getElementById("input-comentario");
const enviar = document.querySelector(".comentarios-enviar");

let listaUsuarios = [];
let recetaActual; // Guardamos la receta aquí para acceder desde publicarComentario

async function obtenerDatosUsuario() {
  if (!idUsuario || idUsuario === "undefined") return;

  try {
    const respuesta = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
    if (respuesta.ok) {
      const usuario = await respuesta.json();

      localStorage.setItem("nombre_usuario", usuario.username);
      localStorage.setItem("foto_perfil", usuario.foto_perfil);

      const avatarMio = document.querySelector(".comentarios-avatar.mio");
      if (avatarMio && usuario.foto_perfil) {
        avatarMio.innerHTML = `<img src="${usuario.foto_perfil}" alt="${usuario.username}">`;
      }
    }
  } catch (error) {
    console.error("Error al obtener usuario:", error);
  }
}

// Carga inicial de datos
(async () => {
  try {
    await obtenerDatosUsuario();

    const resUsuarios = await fetch("http://localhost:3000/listaUsuarios");
    listaUsuarios = await resUsuarios.json();

    const resRecetas = await fetch("http://localhost:3000/mango/feedRecetas");
    const recetas = await resRecetas.json();

    for (let i = 0; i < recetas.length; i++) {
      if (recetas[i].id == idReceta) {
        recetaActual = recetas[i];
        break;
      }
    }

    if (recetaActual) {
      mostrarReceta(recetaActual);
      mostrarComentarios(recetaActual.comentarios || []);
    } else {
      contenedor.innerHTML = "<p>No se encontró la receta solicitada.</p>";
    }
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
})();

function mostrarReceta(receta) {
  contenedor.innerHTML = `
    <img src="${receta.imagen_receta}" alt="${receta.nombre}" class="fotoreceta">
    <span>
      <a href="homerecetas.html">
        <img class="flechaatras" src="flechaatras.png" alt="volver">
      </a>
    </span>
    <span><img class="guardado" src="guardado.png" alt="guardar"></span>

    <article class="contenedorInfo">
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
          ${(receta.ingredientes || []).map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </section>

      <section id="pasosReceta" class="pasos">
        <h2>Pasos a seguir</h2>
        <ol>
          ${(receta.pasos_receta || []).map(paso => `<li>${paso}</li>`).join('')}
        </ol>
      </section>
      
      <section class="trucos">
        <h2>Trucos</h2>
        <ul class="lista-trucos">
          ${(receta.trucos || []).map(truco => `<li>${truco}</li>`).join('')}
        </ul>
      </section>
    </article>`;

  const circulos = contenedor.querySelectorAll(".filtros .filtro");
  const filtros = receta.filtros || [];
  circulos.forEach((circulo, i) => {
    if (circulo.classList.contains("grande")) {
      const resto = filtros.length - 3;
      circulo.textContent = resto > 0 ? `+${resto}` : "";
    } else {
      circulo.title = filtros[i] || "";
    }
  });
}

function buscarFoto(username) {
  for (let i = 0; i < listaUsuarios.length; i++) {
    if (listaUsuarios[i].username === username || listaUsuarios[i].nombre === username) {
      return listaUsuarios[i].foto_perfil || "default.jpg";
    }
  }
  return "default.jpg";
}
const contenedorComentarios = document.getElementById("comentariosReceta");


function mostrarComentarios(comentarios) {
  contenedorComentarios.innerHTML = "";

  if (!comentarios || comentarios.length === 0) {
    contenedorComentarios.innerHTML = `
      <h1 class="titulocomentarios">Comentarios</h1>
      <section class="sin-comentarios">
        <article class="comentarios-vacio">
          <p class="vacio-titulo">Todavía no hay comentarios</p>
        </article>
      </section>`;
    input.placeholder = "Añade un comentario";
  } 
  
  contenedorComentarios.innerHTML = `<h1 class="titulocomentarios">Comentarios</h1>`;
  input.placeholder = "Añade un comentario";

  function agregarComentario(c) {
    const seccionComentario = document.createElement("section");
    seccionComentario.classList.add("comentarios-seccion");
    seccionComentario.innerHTML = `
      <article class="comentario">
        <figure class="comentarios-avatar">
          <img src="${buscarFoto(c.username)}" alt="${c.username}">
        </figure>
        <div>
          <p class="comentario-nombre">${c.username}</p>
          <p class="comentario-texto">${c.texto}</p>
        </div>
      </article>`;
    contenedorComentarios.appendChild(seccionComentario);
  }

  // 2. Caso: Hay 3 o menos comentarios -> Mostramos todos de una vez
  if (comentarios.length <= 3) {
    comentarios.forEach((c) => {
      agregarComentario(c);
    });
  } 
  // 3. Caso: Hay más de 3 comentarios
  else {
    // Mostramos únicamente los primeros 3
    for (let i = 0; i < 3; i++) {
      agregarComentario(comentarios[i]);
    }

    // Creamos el botón con la flecha para ver los demás
    const masComentarios = document.createElement("div");
    masComentarios.classList.add("bajarcomentarios");
    masComentarios.innerHTML = `<img src="bajar-comentarios.png" alt="flechabajo" class="bajar">`;
    contenedorComentarios.appendChild(masComentarios);

    // Al hacer click, cargamos el resto y quitamos la flecha
    masComentarios.addEventListener("click", () => {

      // Dibujamos desde el índice 3 en adelante
      for (let i = 3; i < comentarios.length; i++) {
        agregarComentario(comentarios[i]);
      }
      masComentarios.innerHTML = `<img src="subir-comentarios.png" alt="flechaarriba" class="bajar">`; 
    });
  }
}


async function publicarComentario() {
  const textoComentario = input.value.trim();
  if (textoComentario === "" || !recetaActual) return;

  const nombre = localStorage.getItem("nombre_usuario") || "Anonimo";

  try {
    await fetch("http://localhost:3000/mango/receta/comentar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: idUsuario,
        username: nombre,
        idRec: idReceta,
        texto: textoComentario,
        fecha: new Date().toISOString()
      })
    });

    if (!recetaActual.comentarios) {
      recetaActual.comentarios = [];
    }

    // Agregamos el comentario localmente
    recetaActual.comentarios.push({
      username: nombre,
      idRec: idReceta,
      texto: textoComentario,
      fecha: new Date().toISOString()
    });

    input.value = "";
    mostrarComentarios(recetaActual.comentarios);

    if (enviar) {
      enviar.src = "enviar3.png";        
      setTimeout(() => {
        enviar.src = "enviar2.png";    
      }, 100);
    }

  } catch (error) {
    console.error("Error al publicar comentario:", error);
  }
}

// Event Listeners
if (enviar) {
  enviar.addEventListener("click", publicarComentario);
}

if (input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") publicarComentario();
  });
}