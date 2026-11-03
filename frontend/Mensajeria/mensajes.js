async function cargarConversaciones() {
    const contenedor = document.querySelector(".mensajes");
    const idUsuario = localStorage.getItem("id");

    if (!idUsuario) {
        contenedor.innerHTML = `<p class="error">No has iniciado sesión correctamente.</p>`;
        return;
    }

    try {
        const resUsuarios = await fetch("http://localhost:3000/listaUsuarios");
        const usuarios = await resUsuarios.json();

        const res = await fetch("http://localhost:3000/mango/conversaciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUs: idUsuario })
        });

        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.status}`);
        }

        const conversaciones = await res.json();
        contenedor.innerHTML = "";

        if (!conversaciones || conversaciones.length === 0) {
            contenedor.innerHTML = `
            <div class="texto-no-mensajes">
                <p class="no-mensajes">No tienes conversaciones aún.</p>
                <p class="no-mensajes2">Sigue a alguien para conversar!</p>
            </div>`;
            return;
        }

        for (let i = 0; i < conversaciones.length; i++) {
            const conv = conversaciones[i];

            // 1. Obtener el ID del otro participante
            let otroId;
            for (let j = 0; j < conv.participantes.length; j++) {
                const id = Number(conv.participantes[j]);
                if (id !== idUsuario) {
                    otroId = id;
                    break;
                }
            }

            // 2. Buscar datos del otro usuario
            let usuarioEncontrado;
            for (let k = 0; k < usuarios.length; k++) {
                const u = usuarios[k];
                const idUsuariouarioActual = Number(u.id || u.id_usuario);
                if (idUsuariouarioActual === otroId) {
                    usuarioEncontrado = u;
                    break;
                }
            }

            const nombreUs = usuarioEncontrado 
                ? (usuarioEncontrado.nombre_usuario || usuarioEncontrado.username || usuarioEncontrado.nombre)
                : `Usuario ${otroId}`;

            const HTMLFoto = usuarioEncontrado && usuarioEncontrado.foto_perfil 
                ? `<img class="persona" src="${usuarioEncontrado.foto_perfil}" alt="${nombreUs}">`
                : "";

            // 3. Contar mensajes sin leer enviados por el otro participante
            const listaMensajes = conv.mensajes || [];
            let sinLeer = 0;

            for (let m = 0; m < listaMensajes.length; m++) {
                const msg = listaMensajes[m];
                const remitente = Number(msg.emisorId || msg.id_emisor || msg.id_usuario);

                if (remitente !== idUsuario && msg.leido === false) {
                    sinLeer++;
                }
            }

            // 4. Configurar texto y punto naranja según corresponda
            let textoAbajo = "";
            let circuloNaranja = "";

            if (sinLeer > 0) {
                textoAbajo = `${sinLeer} ${sinLeer === 1 ? "mensaje nuevo" : "mensajes nuevos"}`;
                circuloNaranja = `<div class="punto"></div>`;
            } else {
                const ultimo = listaMensajes[listaMensajes.length - 1];
                textoAbajo = ultimo ? ultimo.texto : "Sin mensajes";
                circuloNaranja = "";
            }

            // 5. Crear la tarjeta del chat
            const article = document.createElement("article");
            article.classList.add("chats");

            article.innerHTML = `
                <figure class="persona">${HTMLFoto}</figure>
                <div class="textos">
                    <h2 class="nombre">${nombreUs}</h2>
                    <p class="mensajito">${textoAbajo}</p>
                </div>
                ${circuloNaranja}
            `;

            article.addEventListener("click", () => {
                localStorage.setItem("idConversacionActiva", conv.id);
                localStorage.setItem("idChatCon", otroId);
                window.location.href = "conversacion.html";
            });

            contenedor.appendChild(article);
        }

        activarVerMas();

    } catch (error) {
        console.error("Error cargando conversaciones:", error);
        contenedor.innerHTML = "<p>Error al cargar las conversaciones.</p>";
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