let recetas = [];
let usuarios = [];
let postActual;
 const containerRecetas = document.getElementById("recetas");
 const idUsuario = Number(localStorage.getItem("id"));

const etiquetasFiltros = {
    celiacx: `<img src="../Sin tacc.png" alt="Sin TACC" class="filtro">`,
    diabeticx: `<img src="../Diabetes.png" alt="Diabetes" class="filtro">`,
    veganx: `<img src="../Vegano.png" alt="Vegano" class="filtro">`,
    vegetarianx: `<img src="../Vegetariano.png" alt="Vegetariano" class="filtro">`,
    kosher: `<img src="../Kosher.png" alt="Kosher" class="filtro">`,
    hipertensx: `<img src="../Hipertencion.png" alt="Hipertencion" class="filtro">`,
    "bajo colesterol": `<img src="../Bajo colesterol.png" alt="Bajo colesterol" class="filtro">`,
    keto: `<img src="../keto.png" alt="keto" class="filtro">`,
    "intolerancia a la lactosa": `<img src="../intolerancia a la lactosa.png" alt="intolerancia a la lactosa" class="filtro">`,
    "alergia a los frutos secos":`<img src="../A. mani.png" alt="A. mani" class="filtro">`
};
const otrosFiltros = {
  salado: `<p class="filtro grande">Salado</p>`,
  dulce: `<p class="filtro grande">Dulce</p>`,
  umami: `<p class="filtro grande">Umami</p>`,
  picante: `<p class="filtro grande">Picante</p>`,
  agridulce: `<p class="filtro grande">Agridulce</p>`,
  acido: `<p class="filtro grande">Ácido</p>`,
  bebida: `<p class="filtro grande">Bebida</p>`,
  comida: `<p class="filtro grande">Comida</p>`,
  postre: `<p class="filtro grande">Postre</p>`,
  snack: `<p class="filtro grande">Snack</p>`,
  "1-15min": `<p class="filtro grande">1-15 min</p>`,
  "15-30min": `<p class="filtro grande">15-30 min</p>`,
  "30-60min": `<p class="filtro grande">30-60 min</p>`,
  "60+min": `<p class="filtro grande">+60 min</p>`,
  horno: `<p class="filtro grande">Horno</p>`,
  airfryer: `<p class="filtro grande">Airfryer</p>`,
  sarten: `<p class="filtro grande">Sarten</p>`,
  olla: `<p class="filtro grande">Olla</p>`,
  microondas: `<p class="filtro grande">Microondas</p>`,
  heladera: `<p class="filtro grande">Heladera</p>`,
  nada: `<p class="filtro grande">Nada</p>`,
  alta: `<p class="filtro grande">Alta</p>`,
  media: `<p class="filtro grande">Media</p>`,
  baja: `<p class="filtro grande">Baja</p>`
};


function obtenerImagenFiltro(nombreFiltro) {
  const clave = String(nombreFiltro).toLowerCase().trim();
  return mapaFiltros[clave] || "filtros/default.png";
}

async function obtenerDatosUsuario() {
  if (!idUsuario) return;
  try {
    const respuesta = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
    const usuario = await respuesta.json();

    localStorage.setItem("nombre_usuario", usuario.username);
    localStorage.setItem("foto_perfil", usuario.foto_perfil);

    const avatar = document.querySelector(".comentarios-avatar.mio");
    if (avatar) {
      avatar.innerHTML = `<img src="${usuario.foto_perfil}" alt="${usuario.username}">`;
    }
  } catch (error) {
    console.error("Error al obtener usuario:", error);
  }
}

(async () => {
  try {
    let response = await fetch('http://localhost:3000/mango/feedRecetas');
    recetas = await response.json();
    response = await fetch('http://localhost:3000/listaUsuarios');
    usuarios = await response.json();
    mostrarRecetas(recetas, usuarios);
    activarVerMas();
  } catch (error) {
    console.log("Error al cargar datos:", error);
  }
})();

function mostrarRecetas(recetas, usuarios) {
  containerRecetas.innerHTML = "";

  recetas.forEach(receta => {
    let nombreAMostrar = "Usuario";
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].id === receta.id_usuario || usuarios[i].id_usuario === receta.id_usuario) {
        nombreAMostrar = usuarios[i].nombre_usuario || usuarios[i].username || usuarios[i].nombre;
        break;
      }
    }
const likeVacio = "like-vacio.png";
const likeLleno = "like-lleno.png";


    let htmlFiltros = "";
const listaFiltros = receta.filtros || [];

for (let i = 0; i < listaFiltros.length; i++) {
    const f = listaFiltros[i];
    if (etiquetasFiltros[f]) {
        htmlFiltros += etiquetasFiltros[f];
    }
}
for (let i = 0; i < listaFiltros.length; i++) {
    const f = listaFiltros[i];
    if (otrosFiltros[f]) {
        htmlFiltros += otrosFiltros[f];
    }
}

    const section = document.createElement("section");
    section.className = "publicacion";
    section.dataset.id = receta.id;
    section.innerHTML = `
        <figure class="imagen">
            <img class="fotoReceta" src="${receta.imagen_receta}" alt="${receta.nombre}">
            <p class="nombredeusuario">${nombreAMostrar}</p>
        </figure>
        <div class="contenido">
            <h2 class="titulo">${receta.nombre}</h2>
            <p class="descripcion">${receta.descripcion}</p>
        </div>
        <div class="interacciones">
            <span class="icono"><img class="guardado" src="guardado.png" alt="guardar"></span>
            <span class="icono"><img class="comentarios" src="comentariosr.png" alt="comentar"></span>
            <span class="icono"><img class="hipervinculo" src="link.png" alt="hipervinculo"></span>
        </div>
        <div class="filtros">
            ${htmlFiltros}
        </div>`;
        
    containerRecetas.appendChild(section);
  });
}

function activarVerMas() {
  const descripciones = document.querySelectorAll(".descripcion");
  descripciones.forEach((descripcion) => {
    const completo = descripcion.textContent;
    if (completo.length > 47) {
      descripcion.innerHTML = completo.substring(0, 47) + '<span class="mas" style="cursor: pointer; font-weight: bold;">... más</span>';
    }
  });
}

containerRecetas.addEventListener("click", (e) => {
  const icono = e.target.closest(".icono");
  if (icono) {
    const img = icono.querySelector("img");

    if (img.classList.contains("guardado")) {
    alternarIcono(img, "guardado.png", "guardado-amarillo.png");
    
    // 1. Obtenemos la publicación primero
    const publicacion = img.closest(".publicacion");
    const idReceta = publicacion.dataset.id;
    const imagenReceta = publicacion.querySelector(".fotoReceta").src;

    // 2. Le pasamos la imagen a la función
    mostrarPopupBandeja(idReceta, img, imagenReceta);
    return;
    }
    if (img.classList.contains("hipervinculo")) {
      alternarIcono(img, "link.png", "link-amarillo.png");
    }
    if (img.classList.contains("comentarios")) {
      const idReceta = img.closest(".publicacion").dataset.id;
      localStorage.setItem("idReceta", idReceta);
      window.location.href = "recetas-informacion.html#ComentariosReceta";
    }
    return;
  }
  const objetivo = e.target;
  const esClickeable = objetivo.classList.contains("titulo") ||
                       objetivo.classList.contains("fotoReceta") ||
                       objetivo.classList.contains("descripcion") ||
                       objetivo.classList.contains("mas") ||
                       objetivo.classList.contains("filtro") ||
                       objetivo.classList.contains("filtros");

  if (!esClickeable) return;
  objetivo.style.cursor = "pointer";
  const publicacion = objetivo.closest(".publicacion");
  if (!publicacion) return;

  localStorage.setItem("idReceta", publicacion.dataset.id);
  window.location.href = "recetas-informacion.html";
});

function alternarIcono(img, normal, activo) {
  const estaActivo = img.src.includes(activo);
  img.src = estaActivo ? normal : activo;
}

const popupBandejas = document.getElementById("popupBandejas");
const cajaPopupBandejas = document.getElementById("cajaPopupBandejas");
const vistasPopup = popupBandejas.querySelectorAll(".bandejas-vista");
const grillaBandejas = document.getElementById("grillaBandejas");
const inputNombreBandeja = document.getElementById("inputNombreBandeja");

let recetaAGuardar;
let bandejaElegida;
let seGuardo;

function cambiarVista(idVista) {
  vistasPopup.forEach((vista) => {
    vista.hidden = vista.id !== idVista;
  });
  cajaPopupBandejas.classList.toggle("fondo-blanco", idVista === "vistaBandejas");
}

function mostrarPopupBandeja(idReceta, img, imagenReceta) {
    recetaAGuardar = { id: idReceta, img: img, imagen: imagenReceta };
    bandejaElegida = null;
    seGuardo = false;
    inputNombreBandeja.value = "";
    img.src = "guardado.png";  // resetear el ícono
    cambiarVista("vistaOpciones");
    popupBandejas.showModal();
}

popupBandejas.addEventListener("click", (e) => {
  if (e.target === popupBandejas) popupBandejas.close();
});

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
        imagen_bandeja: recetaAGuardar.imagen,
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
      foto.src = recetaAGuardar.imagen;
      foto.alt = bandeja.nombre_bandeja;
      foto.title = bandeja.nombre_bandeja;
      foto.dataset.id = bandeja.id;
      grillaBandejas.appendChild(foto);
    });
  } catch (error) {
    grillaBandejas.innerHTML = "<p>No se pudieron cargar tus bandejas</p>";
  }
});

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

async function guardarEnBandeja(idBandeja) {
  try {
    const respuesta = await fetch("http://localhost:3000/mango/guardarRec", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idBandeja: idBandeja, idRec: recetaAGuardar.id })
    });

    const texto = await respuesta.text();
    try {
      JSON.parse(texto);
    } catch {
      alert(texto);
      return;
    }

    seGuardo = true;
    recetaAGuardar.img.src = "guardado-amarillo.png";
    popupBandejas.close();
  } catch (error) {
    console.error("No se pudo guardar la receta:", error);
  }
}

popupBandejas.addEventListener("close", () => {
  if (!seGuardo) {
    recetaAGuardar.img.src = "guardado.png";
  }
});