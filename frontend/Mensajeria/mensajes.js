document.addEventListener("DOMContentLoaded", () => {
    cargarConversaciones();
});

async function cargarConversaciones() {
    const contenedor = document.querySelector(".mensajes");
    const idUs = Number(localStorage.getItem("id")); 

    if (!idUs) {
        contenedor.innerHTML = "<p>No has iniciado sesión correctamente.</p>";
        return;
    }

    try {
        // 1. Obtener lista de todos los usuarios
        const resUsuarios = await fetch("http://localhost:3000/listaUsuarios");
        const usuarios = await resUsuarios.json();

        // 2. Obtener las conversaciones del usuario logueado
        const res = await fetch("http://localhost:3000/mango/conversaciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUs: idUs })
        });

        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.status}`);
        }

        const conversaciones = await res.json();
        contenedor.innerHTML = "";

        if (!conversaciones || conversaciones.length === 0) {
            contenedor.innerHTML = "<p>No tienes conversaciones aún.</p>";
            return;
        }

        // 3. Iterar conversaciones y cruzar los datos con la lista de usuarios
        conversaciones.forEach(conv => {
            const otroId = conv.participantes.find(id => Number(id) !== idUs);
            
            // Buscar coincidencia del usuario en la lista
            const usuarioEncontrado = usuarios.find(
                u => Number(u.id) === Number(otroId) || Number(u.id_usuario) === Number(otroId)
            );

            // Obtener el nombre
            const nombreUs = usuarioEncontrado 
                ? (usuarioEncontrado.nombre_usuario || usuarioEncontrado.username || usuarioEncontrado.nombre)
                : `Usuario ${otroId}`;

            // Obtener la imagen de perfil (si existe)
            const HTMLFoto = usuarioEncontrado && usuarioEncontrado.foto_perfil 
                ? `<img src="${usuarioEncontrado.foto_perfil}" alt="${nombreUs}">`
                : "";

            const ultimoMsg = conv.mensajes && conv.mensajes.length > 0 
                ? conv.mensajes[conv.mensajes.length - 1].texto 
                : "Sin mensajes";

            const article = document.createElement("article");
            article.classList.add("chats");

            article.innerHTML = `
                <figure class="persona">${HTMLFoto}</figure>
                <div class="textos">
                    <h2 class="nombre">${nombreUs}</h2>
                    <p class="mensajito">${ultimoMsg}</p>
                </div>
            `;

            article.addEventListener("click", () => {
                localStorage.setItem("idConversacionActiva", conv.id);
                localStorage.setItem("idChatCon", otroId);
                // window.location.href = "../Mensajeria/chat.html";
            });

            contenedor.appendChild(article);
        });

    } catch (error) {
        console.error("Error cargando conversaciones:", error);
        contenedor.innerHTML = "<p>Error al cargar las conversaciones.</p>";
    }
}