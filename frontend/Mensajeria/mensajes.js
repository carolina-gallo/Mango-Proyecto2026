document.addEventListener("DOMContentLoaded", () => {
    cargarConversaciones();
});

async function cargarConversaciones() {
    const contenedor = document.querySelector(".mensajes");
    
    // Leemos con la clave "id" que guardaste en el login
    const idUs = Number(localStorage.getItem("id")); 

    if (!idUs) {
        contenedor.innerHTML = "<p>No has iniciado sesión correctamente.</p>";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/mango/conversaciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUs: idUs }) // Mantenemos "idUs" porque así lo espera Express en pedido.body.idUs
        });

        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.status}`);
        }

        const conversaciones = await res.json();
        contenedor.innerHTML = ""; // Limpiar el contenedor

        if (!conversaciones || conversaciones.length === 0) {
            contenedor.innerHTML = "<p>No tienes conversaciones aún.</p>";
            return;
        }

        conversaciones.forEach(conv => {
            // Buscar la ID del otro participante (que no sea la del usuario logueado)
            const otroId = conv.participantes.find(id => Number(id) !== idUs);
            
            // Obtener el último mensaje enviado en el chat
            const ultimoMsg = conv.mensajes && conv.mensajes.length > 0 
                ? conv.mensajes[conv.mensajes.length - 1].texto 
                : "Sin mensajes";

            // Crear la estructura de la tarjeta del chat
            const article = document.createElement("article");
            article.classList.add("chats");

            article.innerHTML = `
                <figure class="persona"></figure>
                <div class="textos">
                    <h2 class="nombre">Usuario ${otroId}</h2>
                    <p class="mensajito">${ultimoMsg}</p>
                </div>
            `;

            // Guardar datos al hacer clic en el chat para navegar a la conversación
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