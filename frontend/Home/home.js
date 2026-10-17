const scrolleo = document.querySelector(".scrolleo");

scrolleo.addEventListener("click", (icon) => {
    const icono = icon.target.closest(".icono");

    // solo nos interesa el icono del like (alt="like")
    if (!icono || icono.alt !== "like") return;

    const tieneLike = icono.src.includes("likenaranja.png");

    if (tieneLike) {
    icono.src = "likenegro.png";
    } else {
    icono.src = "likenaranja.png";
    }
});

const descripciones = document.querySelectorAll(".descripcion");

descripciones.forEach((descripcion) => {
    const completo = descripcion.textContent;

    if (completo.length > 47) {
        descripcion.innerHTML = completo.substring(0, 47) + '<span class="mas">... más</span>';

        descripcion.querySelector(".mas").addEventListener("click", () => {
            descripcion.textContent = completo;
        });
    }
});

const popup = document.getElementById("comentarios");
const lista = document.getElementById("lista-comentarios");
const input = document.getElementById("input-comentario");
const enviar = document.querySelector(".comentarios-enviar");

let comentarios = [];

function mostrarComentarios() {
    lista.innerHTML = "";

    if (comentarios.length === 0) {
        lista.innerHTML = '<div class="comentarios-vacio"><p class="vacio-titulo">Todavía no hay comentarios</p><p>Deja tu huella</p></div>';
        input.placeholder = "Empieza la conversación...";
        return;
    }

    input.placeholder = "Únete a la conversación...";
    comentarios.forEach((c) => {
        const div = document.createElement("div");
        div.className = "comentario";
        div.innerHTML = '<span class="comentarios-avatar"></span><div><p class="comentario-nombre"></p><p class="comentario-texto"></p></div>';
        div.querySelector(".comentario-nombre").textContent = c.nombre;
        div.querySelector(".comentario-texto").textContent = c.texto;
        lista.appendChild(div);
    });
}

function enviarComentario() {
    const texto = input.value;
    if (texto === "") return;
    comentarios.push({ nombre: "Tu usuario", texto: texto });
    input.value = "";
    mostrarComentarios();
}

scrolleo.addEventListener("click", (e) => {
    const icono = e.target.closest(".icono");
    if (!icono || icono.alt !== "comentarios") return;

    mostrarComentarios();
    popup.showModal();
});

popup.addEventListener("click", (e) => {
    if (e.target === popup || e.target.closest(".comentarios-linea")) {
        popup.close();
    }
});

enviar.addEventListener("click", enviarComentario);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enviarComentario();
});