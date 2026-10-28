let idConversacionActual = localStorage.getItem("idConversacionActiva") || "";

document.addEventListener("DOMContentLoaded", () => {
    cargarConversacion();

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
});

async function cargarConversacion() {
    const contenedor = document.getElementById("contenedorMensajes");
    const idUs = Number(localStorage.getItem("id"));
    const idOtroUs = Number(localStorage.getItem("idChatCon"));

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

        renderizarMensajes(conversacion.mensajes, idUs, contenedor);

    } catch (error) {
        console.error("Error al cargar la conversación:", error);
        if (contenedor) {
            contenedor.innerHTML = "<p>Error al cargar los mensajes.</p>";
        }
    }
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

    mensajes.forEach(msg => {
        const divMensaje = document.createElement("div");

        const idEmisor = msg.emisorId || msg.emisor || msg.idEmisor || msg.idUs;
        const esMio = Number(idEmisor) === idUs;

        divMensaje.classList.add("mensaje", esMio ? "mimensaje" : "otromensaje");
        divMensaje.innerHTML = `<p class="contenido">${msg.texto}</p>`;

        contenedor.appendChild(divMensaje);
    });
    
}