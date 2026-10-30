
let recetas = [];
let usuarios = [];
let postActual;
 const containerRecetas = document.getElementById("recetas");
 const idUsuario = Number(localStorage.getItem("id"));

async function obtenerDatosUsuario() {
  if (!idUsuario) return;
  try {
    const respuesta = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
    const usuario = await respuesta.json();
    console.log("usuario recibido:", usuario);

    localStorage.setItem("nombre_usuario", usuario.username);
    localStorage.setItem("foto_perfil", usuario.foto_perfil);

    document.querySelector(".comentarios-avatar.mio").innerHTML =
      `<img src="${usuario.foto_perfil}" alt="${usuario.username}">`;

  } catch (error) {
    console.error("Error al obtener usuario:", error);
  }
}


(async () => {
    let response;
    try{
        response = await fetch('http://localhost:3000/mango/feedRecetas');
        recetas = await response.json();
        response = await fetch('http://localhost:3000/listaUsuarios');
        usuarios = await response.json();
        mostrarRecetas(recetas, usuarios);
        activarVerMas()

    }
    catch (error) {
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
    break
      }}

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
            <span class="filtro"></span>
            <span class="filtro"></span>
            <span class="filtro"></span>
            <span class="filtro grande"></span>
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
    };



containerRecetas.addEventListener("click", (e) => {
    const icono = e.target.closest(".icono");
    if (icono) {
        const img = icono.querySelector("img");

        if (img.classList.contains("guardado")) {
            alternarIcono(img, "guardado.png", "guardado-amarillo.png");
            const imagenReceta = publicacion.querySelector(".fotoReceta").src;
            mostrarPopupBandeja(img.closest(".publicacion").dataset.id, img);
        }
        if (img.classList.contains("hipervinculo")) {
            alternarIcono(img, "link.png", "link-amarillo.png");
        }
        if (img.classList.contains("comentarios")) {
            const idReceta = img.closest(".publicacion").dataset.id; // o la clase/dataset que uses para el ID
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

function mostrarPopupBandeja(idReceta, img) {
    recetaAGuardar = { id: idReceta, img: img, imagen:imagenReceta};
    bandejaElegida = null;
    seGuardo = false;
    inputNombreBandeja.value = "";
    img.src = "guardado.png";  // resetear el ícono a gris
    cambiarVista("vistaOpciones");
    popupBandejas.showModal();
}

// cerrar tocando el fondo oscuro
popupBandejas.addEventListener("click", (e) => {
    if (e.target === popupBandejas) popupBandejas.close();
});

// ----- crear bandeja nueva -----
document.getElementById("botonCrearBandeja").addEventListener("click", () => {
    cambiarVista("vistaNuevaBandeja");
    inputNombreBandeja;
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
            body: JSON.stringify({ idBandeja: idBandeja, idRec: recetaAGuardar.id })
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

