const contenedor = document.querySelector(".mensajes");
const idUsuario = Number(localStorage.getItem("id"));
async function cargarConversaciones() {

    // 1. Traer los usuarios y las conversaciones del servidor
    const respuestaUsuarios = await fetch("http://localhost:3000/listaUsuarios");
    const usuarios = await respuestaUsuarios.json();

    const respuestaConv = await fetch("http://localhost:3000/mango/conversaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            idUs: idUsuario })
    });
    const conversaciones = await respuestaConv.json();


    // Si no hay chats todavía
    if (conversaciones.length === 0) {
        contenedor.innerHTML = `
            <div class="texto-no-mensajes">
                <p class="no-mensajes">No tenés conversaciones aún.</p>
                <p class="no-mensajes2">¡Seguí a alguien para chatear!</p>
            </div>
        `;
        return;
    }

    for (let i = 0; i < conversaciones.length; i++) {
        const conv = conversaciones[i];


        let idDelOtro;
        if (Number(conv.participantes[0]) === idUsuario) {
            idDelOtro = Number(conv.participantes[1]);
        } else {
            idDelOtro = Number(conv.participantes[0]);
        }

        // ESO ES PARA BUSCAR EL USERNAME Y LA FOTO PQ LA DIVINA DE MARTINA ME PUSO EL ID NOMAS
        let usuarioDelOtro;
        for (let j = 0; j < usuarios.length; j++) {
            if (Number(usuarios[j].id) === idDelOtro) {
                usuarioDelOtro = usuarios[j];
                break;
            }
        }

        const nombre = usuarioDelOtro.username;
        const foto = usuarioDelOtro.foto_perfil;

        const mensajes = conv.mensajes || [];
        let sinLeer = 0;

        for (let m = 0; m < mensajes.length; m++) {
            const msg = mensajes[m];
            // Si el mensaje es del otro y no fue leído
            if (Number(msg.emisorId) !== idUsuario && msg.leido === false) {
                sinLeer = sinLeer + 1;
            }
        }

        const yaFueLeida = localStorage.getItem("leida_" + conv.id) === "true";

    if (yaFueLeida) {
        sinLeer = 0;
    }

    let textoAbajo = "Sin mensajes";
    let puntoNaranja = "";

    if (mensajes.length > 0) {
        textoAbajo = mensajes[mensajes.length - 1].texto;
    }

    if (sinLeer > 0) {
        textoAbajo = sinLeer === 1 ? "1 mensaje nuevo" : `${sinLeer} mensajes nuevos`;
        puntoNaranja = '<div class="punto"></div>';
    }

        const tarjeta = document.createElement("article");
        tarjeta.className = "chats";

        tarjeta.innerHTML = `
            <figure>
                <img class="persona" src="../avatares/${foto}.png" alt="${nombre}">
            </figure>
            <div class="textos">
                <p class="nombre">${nombre}</p>
                <p class="mensajito" style="${sinLeer > 0 ? 'font-weight: 700;' : ''}">${textoAbajo}</p>
            </div>
            ${puntoNaranja}
        `;

        tarjeta.addEventListener("click", () => {
            localStorage.setItem("idConversacionActiva", conv.id);
            localStorage.setItem("idChatCon", idDelOtro);
            localStorage.setItem("conversacionLeida", conv.id);
            window.location.href = "conversacion.html";
        });
        activarVerMas();
        contenedor.appendChild(tarjeta);
    }
}



function activarVerMas() {
    const descripciones = document.querySelectorAll(".mensajito");
    descripciones.forEach((descripcion) => {
        const completo = descripcion.textContent;

        if (completo.length > 25) {
            descripcion.innerHTML = completo.substring(0, 25) + '<span class="mas">... más</span>';
        }
    });
}

cargarConversaciones();
