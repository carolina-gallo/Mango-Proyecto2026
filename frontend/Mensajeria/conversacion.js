let idConversacionActual = localStorage.getItem("idConversacionActiva") || "";
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
      `<img src="${usuario.foto_perfil}" alt="${usuario.username}" class="avatar">
      <p class="nombredeusuario">${usuario.username}</p>`;

  } catch (error) {
    console.error("Error al obtener usuario:", error);
  }
}
async function cargarConversacion() {

    if (!idUs || !idOtroUs) {
        if (contenedor) {
            contenedor.innerHTML = "<p>Faltan datos para cargar la conversación.</p>";
        }
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/mango/conversacion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUs, idOtroUs })
        });

        if (!res.ok) throw new Error("Error obteniendo la conversación");

        const conversacion = await res.json();

        idConversacionActual = conversacion.id;
        localStorage.setItem("idConversacionActiva", conversacion.id);

        obtenerDatosUsuario()
        renderizarMensajes(conversacion.mensajes, idUs, contenedor);

    } catch (error) {
        console.error("Error al cargar la conversación:", error);
        if (contenedor) {
            contenedor.innerHTML = "<p>Error al cargar los mensajes.</p>";
        }
    }
}
function formatearHora(fechaIso) {
  if (!fechaIso) return "";
  
  const fecha = new Date(fechaIso);
  
  return fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false // formato 24 hs (ej: 14:30 en vez de 2:30 PM)
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

    try {
        // fetcheeeeooooooo papuuu
        const res = await fetch("http://localhost:3000/mango/mensaje", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUs: idUs,
                idcon: idConversacionActual,
                texto: textoMensaje
            })
        });

        if (!res.ok) {
            throw new Error(`Error en el servidor: ${res.status}`);
        }

        const conversacionActualizada = await res.json();

        // me dicdn q esta mejor asi ñañañañañ
        input.value = "";
        const contenedor = document.getElementById("contenedorMensajes");
        renderizarMensajes(conversacionActualizada.mensajes, idUs, contenedor);

        
        const enviarBtn = document.getElementById("botonEnviar");
        if (enviarBtn && enviarBtn.tagName === "IMG") {
            enviarBtn.src = "enviar3.png";
            setTimeout(() => {
                enviarBtn.src = "enviar2.png";
            }, 100);
        }

    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
    }
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

        // Si es el último del chat O el siguiente ya es de otra persona
        if (!msgSiguiente || idEmisor !== idSiguiente) {
            divMensaje.classList.add("ultimo");
        }
        // Si el mensaje es una receta o post compartido
        if (msg.idReceta || msg.idPost || msg.tipo === "receta") {
            divMensaje.classList.add("mensaje-receta");
        }

        divMensaje.innerHTML = 
        `<p class="contenido">${msg.texto}</p>
        <p class="hora">${formatearHora(msg.fecha)}</p>`;

        contenedor.appendChild(divMensaje);
    });
}
cargarConversacion();