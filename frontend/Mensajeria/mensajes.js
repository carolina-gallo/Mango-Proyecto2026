document.addEventListener("DOMContentLoaded", () => {
    cargarConversaciones();
});

async function cargarConversaciones() {
    const contenedor = document.querySelector(".mensajes");
    const idUs = parseInt(localStorage.getItem("idUs")); // Ajusta la clave según cómo guardaste el ID

    try {
        const respuesta = await fetch("http://localhost:3000/mango/conversaciones", {
            method: "POST", 
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ idUs: idUs })
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        const conversaciones = await respuesta.json();
        mostrarConversaciones(conversaciones, contenedor);

    } catch (error) {
        console.error("Error al cargar las conversaciones:", error);
    }
}

function mostrarConversaciones(conversaciones, contenedor) {
    // Vaciar el contenido estático del contenedor
    contenedor.innerHTML = "";

    if (!conversaciones || conversaciones.length === 0) {
        contenedor.innerHTML = "<p>No tienes conversaciones activas.</p>";
        return;
    }

    conversaciones.forEach(conv => {
        const article = document.createElement("article");
        article.classList.add("chats");

        // Ajusta los nombres de las propiedades según la estructura real de tus objetos conversacion
        const nombreUsuario = conv.nombreContacto || conv.nombre || "Usuario";
        const ultimoMensaje = conv.ultimoMensaje || conv.mensajito || "";
        const esNoLeido = conv.noLeido || false; 

        article.innerHTML = `
            <figure class="persona">
                ${conv.fotoPerfil ? `<img src="${conv.fotoPerfil}" alt="${nombreUsuario}">` : ''}
            </figure>
            <div class="textos">
                <h2 class="nombre">${nombreUsuario}</h2>
                <p class="mensajito">${ultimoMensaje}</p>
            </div>
            ${esNoLeido ? '<span class="punto"></span>' : ''}
        `;

        // Evento para abrir el chat al hacer clic
        article.addEventListener("click", () => {
            localStorage.setItem("idConversacionActiva", conv.id);
            // window.location.href = "../Mensajeria/chat.html";
        });

        contenedor.appendChild(article);
    });
}