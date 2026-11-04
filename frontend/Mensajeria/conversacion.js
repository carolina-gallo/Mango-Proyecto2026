let idConversacionActual = localStorage.getItem("idConversacionActiva") 
const contenedor = document.getElementById("contenedorMensajes");
const idUs = Number(localStorage.getItem("id"));
const idOtroUs = Number(localStorage.getItem("idChatCon"));

const botonEnviar = document.getElementById("botonEnviar");
const inputMensaje = document.getElementById("inputMensaje");

if (botonEnviar) {
    botonEnviar.addEventListener("click", enviarMensaje);
}

if (inputMensaje) {
    inputMensaje.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            enviarMensaje();
        }
    });
}

async function obtenerDatosUsuario() {
  if (!idOtroUs) return;
  try {
    const respuesta = await fetch(`http://localhost:3000/mango/usuario/${idOtroUs}`);
    const usuario = await respuesta.json();
    console.log("usuario recibido:", usuario);

    localStorage.setItem("nombre_usuario", usuario.username);
    localStorage.setItem("foto_perfil", usuario.foto_perfil);
    const infoUsuario = document.getElementById("usuarioEmisor")
    infoUsuario.innerHTML =
      `<img src="../avatares/${usuario.foto_perfil}.png" alt="${usuario.username}" class="avatar">
      <p class="nombredeusuario">${usuario.username}</p>`;

  } catch (error) {
    console.error("Error al obtener usuario:", error);
  }
}

// ESTO ES PARA DESPUES CARGAR LOS POSTS Q SE MANDANN
let listaPosts = [];
let listaUsuarios = [];

async function cargarPostsHome() {
    const resPost = await fetch("http://localhost:3000/mango/mostrarPost");
    listaPosts = await resPost.json();

    const resUs = await fetch("http://localhost:3000/listaUsuarios");
    listaUsuarios = await resUs.json();
}

// le avisa al back que entraste a la conversacion, asi marca como leidos los mensajes del otro
async function marcarConversacionLeida() {
    if (!idConversacionActual || !idUs) return;
    try {
        await fetch("http://localhost:3000/mango/leido", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idCon: idConversacionActual, idUs: idUs })
        });
    } catch (error) {
        console.error("No se pudo marcar como leída:", error);
    }
}

async function cargarConversacion() {

    if (!idUs || !idOtroUs) {
        if (contenedor) {
            contenedor.innerHTML = "<p>Faltan datos para cargar la conversación.</p>";
        }
        return;
    }

        const res = await fetch("http://localhost:3000/mango/conversacion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUs, idOtroUs })
        });

        if (!res.ok){
            console.log("Error obteniendo la conversación")
        } 

        const conversacion = await res.json();

        idConversacionActual = conversacion.id;
        localStorage.setItem("idConversacionActiva", conversacion.id);

        obtenerDatosUsuario()
        renderizarMensajes(conversacion.mensajes, idUs, contenedor);
        await marcarConversacionLeida();

}
function formatearHora() {
  
  const fecha = new Date();
  
  return fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false 
  });
}
async function enviarMensaje() {
    const input = document.getElementById("inputMensaje");
    if (!input) return;

    const textoMensaje = input.value.trim();
    if (textoMensaje === "") return;

    const idUs = Number(localStorage.getItem("id"));

    if (!idUs || !idConversacionActual) {
        console.error("No se encontró el idUs o el idcon de la conversación.");
        return;
    }

    if (botonEnviar) {
        botonEnviar.src = "../Home/enviar3.png";
        setTimeout(() => {
            botonEnviar.src = "../Home/enviar2.png";
        }, 100);
    }

        const res = await fetch("http://localhost:3000/mango/mensaje", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUs: idUs,
                idcon: idConversacionActual,
                texto: textoMensaje
            })
        });


        const conversacionActualizada = await res.json();

        input.value = "";
        const contenedor = document.getElementById("contenedorMensajes");
        renderizarMensajes(conversacionActualizada.mensajes, idUs, contenedor);
}

function renderizarMensajes(mensajes, idUs, contenedor) {
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!mensajes || mensajes.length === 0) {
        contenedor.innerHTML = "<p>No hay mensajes</p>";
        return;
    }

    mensajes.forEach((msg, index) => {
        const divMensaje = document.createElement("div");

        const idEmisor = msg.emisorId || msg.emisor || msg.idEmisor || msg.idUs;
        const esMio = Number(idEmisor) === idUs;

        // Clase base según si es tuyo o del otro
        divMensaje.classList.add("mensaje", esMio ? "mimensaje" : "otromensaje");

        // número en casilleros de un array, esto es para cambiar la clase y hacer el gap q me pidio martu la timi (es un amor)
        if (index > 0) {
            const msgAnterior = mensajes[index - 1];
            const idEmisorAnterior = msgAnterior.emisorId || msgAnterior.emisor || msgAnterior.idEmisor || msgAnterior.idUs;
            const esMismoEmisor = Number(idEmisor) === Number(idEmisorAnterior);

            if (esMismoEmisor) {
                divMensaje.classList.add("espacio-mismoemisor"); 
            } else {
                divMensaje.classList.add("espacio-diferenteemisor"); 
            }
        }
        const msgSiguiente = mensajes[index + 1];
        const idSiguiente = msgSiguiente 
            ? Number(msgSiguiente.emisorId || msgSiguiente.emisor || msgSiguiente.idEmisor || msgSiguiente.idUs) 
            : null;

        if (!msgSiguiente || idEmisor !== idSiguiente) {
            divMensaje.classList.add("ultimo");
        }

        const esPostCompartido = msg.texto && msg.texto.includes("#");

        if (esPostCompartido) {
            divMensaje.classList.add("mensaje-receta");

            // Sacamos el id que viene después del '#'
            const idPostExtraido = msg.texto.split("#")[1];

            let postEncontrado;

            for (let i = 0; i < listaPosts.length; i++) {
                if (String(listaPosts[i].id) === String(idPostExtraido)) {
                    postEncontrado = listaPosts[i];
                    break;
                }
            }

            let nombreAutor;
            let fotoPerfil;
            let fotoPlato;
            let descripcion;
            let idReceta;

           if (postEncontrado) {
                fotoPlato = postEncontrado.imagen_post || "";
                descripcion = postEncontrado.descripcion || "";
                idReceta = postEncontrado.id_receta || "";

                let usuarioAutor ;
                for (let j = 0; j < listaUsuarios.length; j++) {
                    if (Number(listaUsuarios[j].id) === Number(postEncontrado.id_usuario)) {
                        usuarioAutor = listaUsuarios[j];
                        break;
                    }
                }

                if (usuarioAutor) {
                    nombreAutor = usuarioAutor.username;
                    fotoPerfil = `../avatares/${usuarioAutor.foto_perfil}.png`;
                }
            }
            console.log(idReceta, nombreAutor, fotoPerfil, fotoPlato, descripcion);

            divMensaje.innerHTML = `
                <div class="tarjeta-post-chat" onclick="localStorage.setItem('idReceta', '${idReceta}'); window.location.href='../Home/recetas-informacion.html#${idReceta}'">
                    <div class="cabecera-post-chat">
                        <img class="avatar-post-chat" src="${fotoPerfil}" alt="${nombreAutor}">
                        <span class="autor-post-chat">${nombreAutor}</span>
                    </div>
                    <img class="imagen-post-chat" src="${fotoPlato}" alt="Post">
                    <div class="pie-post-chat">
                        <p class="desc-post-chat">${descripcion}</p>
                    </div>
                </div>
                <p class="hora">${formatearHora(msg.fecha)}</p>
            `;
        } else {
            divMensaje.innerHTML = `
                <p class="contenido">${msg.texto}</p>
                <p class="hora">${formatearHora(msg.fecha)}</p>
            `;
        }

        contenedor.appendChild(divMensaje);
    });
}
async function iniciarChat() {
    await cargarPostsHome();
    await cargarConversacion();
}

iniciarChat();