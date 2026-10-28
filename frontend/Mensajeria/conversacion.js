document.addEventListener("DOMContentLoaded", () => {
    cargarConversacion();
});

async function cargarConversacion() {
    const contenedor = document.getElementById("contenedorMensajes");
    const idUs = Number(localStorage.getItem("id"));
    const idOtroUs = Number(localStorage.getItem("idChatCon"));

    if (!contenedor) {
        console.error("No se encontró el elemento con id='contenedorMensajes' en el HTML.");
        return;
    }

    // Validación de IDs guardados en el navegador
    if (!idUs || !idOtroUs) {
        contenedor.innerHTML = `<p style="color: red; padding: 20px;">Falta el ID del usuario (${idUs}) o del destinatario (${idOtroUs}). Volvé a seleccionar un chat desde la lista.</p>`;
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/mango/conversacion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idUs: idUs,
                idOtroUs: idOtroUs
            })
        });

        if (!res.ok) {
            const errorTexto = await res.text();
            throw new Error(errorTexto || `Error en el servidor (${res.status})`);
        }

        const conversacion = await res.json();
        renderizarMensajes(conversacion.mensajes, idUs, contenedor);

    } catch (error) {
        console.error("Error al obtener la conversación:", error);
        contenedor.innerHTML = `<p style="color: red; padding: 20px;">Error al cargar el chat: ${error.message}</p>`;
    }
}

function renderizarMensajes(mensajes, idUs, contenedor) {
    contenedor.innerHTML = "";

    if (!mensajes || mensajes.length === 0) {
        contenedor.innerHTML = "<p style='padding: 20px;'>Aún no hay mensajes en esta conversación.</p>";
        return;
    }

    mensajes.forEach(msg => {
        const divMensaje = document.createElement("div");
        
        // Toma el id del emisor probando las claves típicas
        const idEmisor = msg.emisor || msg.idEmisor || msg.idUs;
        const esMio = Number(idEmisor) === idUs;

        divMensaje.classList.add("mensaje", esMio ? "mensaje-mio" : "mensaje-otro");
        divMensaje.innerHTML = `<p class="contenido">${msg.texto}</p>`;

        contenedor.appendChild(divMensaje);
    });

    // Desplazar automáticamente hacia el último mensaje
    contenedor.scrollTop = contenedor.scrollHeight;
}