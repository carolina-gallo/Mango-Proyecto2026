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
      mostrarCreador(recetaActual)
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

function mostrarCreador(receta) {
  // Seleccionamos los elementos HTML indicados
  const nombreCreador = document.getElementById("usuarioReceta");
  const fotoCreador = document.getElementById("fotoUsuarioReceta");

  // Si los elementos no existen en el DOM, detenemos la ejecución
  if (!nombreCreador || !fotoCreador) return;

  // Buscamos al creador en la lista de usuarios obtenida en la carga inicial
  const creador = listaUsuarios.find(usuario => usuario.id == receta.id_usuario);

  if (creador) {
    // Insertamos el nombre de usuario
    nombreCreador.textContent = creador.username || creador.nombre || "Usuario desconocido";

    // Insertamos la imagen según el tipo de elemento
    if (creador) {
      fotoCreador.innerHTML = `<img src="${creador.foto_perfil || 'ruta/por/defecto/avatar.png'}" alt="${creador.username}" class="avatar-usuario">`;
    }
  } else {
    nombreCreador.textContent = "Usuario";
  }
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

  // 1. Caso: No hay comentarios
  if (!comentarios || comentarios.length === 0) {
    contenedorComentarios.innerHTML = `
      <h1 class="titulocomentarios">Comentarios</h1>
      <section class="sin-comentarios">
        <article class="comentarios-vacio">
          <p class="vacio-titulo">Todavía no hay comentarios</p>
        </article>
      </section>`;
    input.placeholder = "Añade un comentario";
    return; // STOP: Evita que siga ejecutando el resto del código
  } 

  // Si hay comentarios, continuamos aquí:
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
          <p class="comentario-nombre">${c.username || "Anónimo" }</p>
          <p class="comentario-texto">${c.texto}</p>
        </div>
      </article>`;
    contenedorComentarios.appendChild(seccionComentario);
  }

  // 2. Caso: Hay 3 o menos comentarios -> Mostramos todos
  if (comentarios.length <= 3) {
    comentarios.forEach((c) => {
      agregarComentario(c);
    });
  } 
  // 3. Caso: Hay más de 3 comentarios
  else {
    function mostrarPrimerosTres() {
      contenedorComentarios.innerHTML = `<h1 class="titulocomentarios">Comentarios</h1>`;

      for (let i = 0; i < 3; i++) {
        agregarComentario(comentarios[i]);
      }

      const masComentarios = document.createElement("div");
      masComentarios.classList.add("bajarcomentarios");
      masComentarios.innerHTML = `<img src="bajar-comentarios.png" alt="flechabajo" class="bajar">`;
      contenedorComentarios.appendChild(masComentarios);

      masComentarios.addEventListener("click", () => {
        mostrarTodos();
      });
    }

    function mostrarTodos() {
      contenedorComentarios.innerHTML = `<h1 class="titulocomentarios">Comentarios</h1>`;

      comentarios.forEach((c) => {
        agregarComentario(c);
      });

      const menosComentarios = document.createElement("div");
      menosComentarios.classList.add("bajarcomentarios");
      menosComentarios.innerHTML = `<img src="subir-comentarios.png" alt="flechaarriba" class="bajar">`;
      contenedorComentarios.appendChild(menosComentarios);

      menosComentarios.addEventListener("click", () => {
        mostrarPrimerosTres();
      });
    }

    mostrarPrimerosTres();
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

// ===== GUARDAR EN BANDEJA =====
const popupBandejas = document.getElementById("popupBandejas");
const cajaPopupBandejas = document.getElementById("cajaPopupBandejas");
const vistasPopup = popupBandejas.querySelectorAll(".bandejas-vista");
const grillaBandejas = document.getElementById("grillaBandejas");
const inputNombreBandeja = document.getElementById("inputNombreBandeja");

let iconoGuardado = null;    // la img de guardar que tocó
let bandejaElegida = null;   // id de la bandeja que tocó en la grilla
let seGuardo = false;

function alternarIcono(img, normal, activo) {
    const estaActivo = img.src.includes(activo);
    img.src = estaActivo ? normal : activo;
}

function cambiarVista(idVista) {
    vistasPopup.forEach((vista) => {
        vista.hidden = vista.id !== idVista;
    });
    cajaPopupBandejas.classList.toggle("fondo-blanco", idVista === "vistaBandejas");
}

function mostrarPopupBandeja(img) {
    iconoGuardado = img;
    bandejaElegida = null;
    seGuardo = false;
    inputNombreBandeja.value = "";
    img.src = "guardado.png";
    cambiarVista("vistaOpciones");
    popupBandejas.showModal();
}

// el icono se crea con innerHTML, así que el click va en el contenedor
contenedor.addEventListener("click", (e) => {
    const img = e.target.closest(".guardado");
    if (!img) return;
    alternarIcono(img, "guardado.png", "guardado-amarillo.png");
    mostrarPopupBandeja(img);
});

// cerrar tocando el fondo oscuro
popupBandejas.addEventListener("click", (e) => {
    if (e.target === popupBandejas) popupBandejas.close();
});


// ----- crear bandeja nueva -----
document.getElementById("botonCrearBandeja").addEventListener("click", () => {
    cambiarVista("vistaNuevaBandeja");
});

document.getElementById("botonGuardarNuevaBandeja").addEventListener("click", async () => {
    const nombre = inputNombreBandeja.value.trim();
    if (nombre === "") return;

    try {
        const respuesta = await fetch("http://localhost:3000/mango/crearBandeja", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_usuario: idUsuario,
                imagen_bandeja: "default.jpg",
                nombre_bandeja: nombre,
                filtros: {}
            })
        });
        const bandeja = await respuesta.json();
        guardarEnBandeja(bandeja.id);
    } catch (error) {
        console.error("No se pudo crear la bandeja:", error);
    }
});

// ----- bandeja ya existente -----
document.getElementById("botonBandejaExistente").addEventListener("click", async () => {
    cambiarVista("vistaBandejas");
    grillaBandejas.innerHTML = "";

    try {
        const respuesta = await fetch(`http://localhost:3000/mango/bandejasUsuario/${idUsuario}`);
        const bandejas = await respuesta.json();

        if (bandejas.length === 0) {
            grillaBandejas.innerHTML = "<p>Todavía no tenés bandejas</p>";
            return;
        }

        bandejas.forEach((bandeja) => {
            const foto = document.createElement("img");
            foto.className = "bandeja-foto";
            foto.src = bandeja.imagen_bandeja;
            foto.alt = bandeja.nombre_bandeja;
            foto.title = bandeja.nombre_bandeja;
            foto.dataset.id = bandeja.id;
            grillaBandejas.appendChild(foto);
        });
    } catch (error) {
        grillaBandejas.innerHTML = "<p>No se pudieron cargar tus bandejas</p>";
    }
});

// elegir una bandeja (borde naranja, una sola a la vez)
grillaBandejas.addEventListener("click", (e) => {
    const foto = e.target.closest(".bandeja-foto");
    if (!foto) return;

    grillaBandejas.querySelectorAll(".bandeja-foto").forEach((f) => f.classList.remove("elegida"));
    foto.classList.add("elegida");
    bandejaElegida = foto.dataset.id;
});

document.getElementById("botonGuardarEnBandeja").addEventListener("click", () => {
    if (!bandejaElegida) return;
    guardarEnBandeja(bandejaElegida);
});

// ----- guardar la receta en la bandeja -----
async function guardarEnBandeja(idBandeja) {
    try {
        const respuesta = await fetch("http://localhost:3000/mango/guardarRec", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idBandeja: idBandeja, idRec: idReceta })
        });

        const texto = await respuesta.text();
        try {
            JSON.parse(texto);
        } catch {
            // el back manda texto plano si ya estaba guardada o no la encontró
            alert(texto);
            return;
        }

        seGuardo = true;
        iconoGuardado.src = "guardado-amarillo.png";
        popupBandejas.close();
    } catch (error) {
        console.error("No se pudo guardar la receta:", error);
    }
}

popupBandejas.addEventListener("close", () => {
    if (!seGuardo && iconoGuardado) {
        iconoGuardado.src = "guardado.png";
    }
});