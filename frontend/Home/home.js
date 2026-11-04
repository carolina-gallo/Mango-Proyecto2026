let posts = [];
let usuarios = [];
let postActual;
const containerPosts = document.getElementById("container-posts");
const idUsuario = Number(localStorage.getItem("id"));
const likeLleno = "likenaranja.png";
const likeVacio = "likenegro.png"

async function obtenerDatosUsuario() {
    if (!idUsuario) return;
    try {
        const respuesta = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
        const usuario = await respuesta.json();
        console.log("usuario recibido:", usuario);

        localStorage.setItem("nombre_usuario", usuario.username);
        localStorage.setItem("foto_perfil", usuario.foto_perfil);
        const fotoUsuario = document.getElementById("fotoUsuario")
        fotoUsuario.innerHTML =
            `<img src="../avatares/${usuario.foto_perfil}.png" alt="${usuario.username}" class="comentarios-avatar">`;

    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}
(async () => {
    let response;

        await obtenerDatosUsuario();

        response = await fetch(`http://localhost:3000/mango/feedPost?id_usuario=${idUsuario}`);
        posts = await response.json();

        response = await fetch('http://localhost:3000/listaUsuarios');
        usuarios = await response.json();

        mostrarPosts(posts, usuarios);
        activarVerMas()

    if (!response.ok){
        console.log("Error al cargar datos:", error);
    }

})();



function mostrarPosts(posts, usuarios) {
    containerPosts.innerHTML = "";

    posts.forEach(post => {
        let nombreAMostrar;
        let fotoPerfil;
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].id === post.id_usuario || usuarios[i].id_usuario === post.id_usuario) {
                nombreAMostrar = usuarios[i].nombre_usuario || usuarios[i].username || usuarios[i].nombre;
                if (usuarios[i].foto_perfil) {
                    fotoPerfil = usuarios[i].foto_perfil;
                }
                break
            }
        }
        let iconoLike = likeVacio;
        if ((post.likes_usuarios || []).includes(idUsuario)) {
            iconoLike = likeLleno;
        }

        containerPosts.innerHTML +=
            `<article class="post" data-id="${post.id}">
                <div class="usuario">
                    <img src="../avatares/${fotoPerfil}.png" alt="${fotoPerfil}" class="fotodeperfil" data-id-usuario="${post.id_usuario}"></img>
                    <h2 data-id-usuario="${post.id_usuario}">${nombreAMostrar}</h2>
                 </div>
                <img class="foto" src="${post.imagen_post}" alt="foto" data-id-receta="${post.id_receta}">
            <div class="bottom">
                <div class="interacciones">
                    <span><img class="icono" src="${iconoLike}" alt="like"></span>
                    <span><img class="icono" src="comentarios.png" alt="comentarios"></span>
                    <span><img class="icono" src="enviar.png" alt="enviar"></span>
                </div>
                <p class="descripcion" id="descripcion">${post.descripcion}</p>
            </div>
        </article>`
    });
}

function activarVerMas() {
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
}

const popupEnviar = document.getElementById('popupEnviar');
const listaChats = document.getElementById('listaChats');
const idUs = Number(localStorage.getItem('id_usuario') || localStorage.getItem('id'));
let postAEnviar = null;

async function abrirEnviar(idPost) {
    postAEnviar = idPost;
    listaChats.innerHTML = '';
    popupEnviar.showModal();

    try {
        const resUs = await fetch('http://localhost:3000/listaUsuarios');
        const usuarios = await resUs.json();

        const res = await fetch('http://localhost:3000/mango/conversaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUs })
        });
        const conversaciones = await res.json();

        if (!conversaciones || conversaciones.length === 0) {
            listaChats.innerHTML = '<p class="sin-posts">Todavía no tenés chats.</p>';
            return;
        }

        conversaciones.forEach(conv => {
            const otroId = Number(conv.participantes.find(id => Number(id) !== idUs));
            const otro = usuarios.find(u => Number(u.id) === otroId);

            const nombreOtro = otro ? (otro.username || otro.nombre_usuario) : `Usuario ${otroId}`;
            const fotoOtro = otro?.foto_perfil 
                ? `../avatares/${otro.foto_perfil}.png` 
                : '../avatares/avatar1.png';
            const descripcionOtro = otro?.descripcion || '';

            const div = document.createElement('div');
            div.className = 'enviar-chat';
            div.innerHTML = `
                <img src="${fotoOtro}" alt="${nombreOtro}" class="foto-chat">
                <div class="textos-chat">
                    <span class="nombre-chat">${nombreOtro}</span>
                    <span class="descripcion-chat">${descripcionOtro}</span>
                </div>
            `;

            div.addEventListener('click', () => enviarPost(conv.id));
            listaChats.appendChild(div);
        });


    } catch (error) {
        console.error('Error al cargar conversaciones:', error);
        listaChats.innerHTML = '<p class="sin-posts">No se pudieron cargar tus conversaciones.</p>';
    }
}

async function enviarPost(idConversacion) {
    const link = new URL('homeposts.html', window.location.href).href;

    try {
        await fetch('http://localhost:3000/mango/compartirPub', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idUs: idUs,
                idcon: idConversacion,
                texto: `${link}#${postAEnviar}`
            })
        });

        popupEnviar.close();
    } catch (error) {
        console.error('Error al compartir post:', error);
    }
}
popupEnviar.addEventListener("click", (e) => {
    if (e.target === popupEnviar) popupEnviar.close();
});

const popup = document.getElementById("comentarios");
const lista = document.getElementById("lista-comentarios");
const input = document.getElementById("input-comentario");
const enviar = document.querySelector(".comentarios-enviar");

containerPosts.addEventListener("click", async (e) => {
    const post = e.target.closest(".post");
    if (!post) return;

    const idPost = e.target.closest(".post").dataset.id;
    const foto = e.target.closest(".foto");
    const icono = e.target.closest(".icono");
    const usuarioAjeno = e.target.closest(".fotodeperfil, .usuario h2");
    
    // IR A PERFIL ES LA FUNCION Q DECLARE EN EL GENERAL.JS PARA QUE VAYA DIRECTO A PERFIL AJENO O PROPIO SEGUN EL CASO
    if (usuarioAjeno) {
        irAPerfil(usuarioAjeno.closest(".usuario h2, .fotodeperfil").dataset.idUsuario);
        return;
    }
    if (foto) {
        const idReceta = foto.dataset.idReceta || foto.closest(".post").dataset.idReceta;

        if (idReceta) {
            localStorage.setItem("idReceta", idReceta);
            window.location.href = "recetas-informacion.html";
        }
        return;
    }
    if (icono.alt === "comentarios") {
        popup.dataset.id = idPost;
        console.log("idPost:", idPost, "posts:", posts);
        mostrarComentarios(idPost);
        popup.showModal();
    } else if (icono.alt === "enviar") {
        abrirEnviar(idPost);
    } else if (icono.alt === "like") {
        const yaTieneLike = icono.src.includes(likeLleno);

        if (yaTieneLike) {
            icono.src = likeVacio;

            await fetch("http://localhost:3000/mango/post/dislike", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idUs: idUsuario,
                    idPost: idPost
                })
            });
        } else {
            icono.src = likeLleno;

            await fetch("http://localhost:3000/mango/post/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idUs: idUsuario,
                    idPost: idPost
                })
            });
        }
        return;
    
    }
});



function buscarPost(idPost) {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === idPost) {
            return posts[i];
        }
    }
}

function formatearFecha(fecha) {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
};

function mostrarComentarios(idPost) {
    lista.innerHTML = "";
    const comentarioPost = buscarPost(idPost);
    if (!comentarioPost || comentarioPost.comentarios.length === 0) {
        lista.innerHTML =
            `<section class="sin-comentarios">
        <article class="comentarios-vacio">
        <p class="vacio-titulo">Todavía no hay comentarios</p>
        <p class="segundo-texto">Deja tu huella</p>
        </article>
        </section>`;
        input.placeholder = "Empieza la conversación...";
    } else {
        function buscarFoto(username) {
            for (let i = 0; i < usuarios.length; i++) {
                if (usuarios[i].username === username) {
                    return usuarios[i].foto_perfil || "../avatares/avatar1.png";
                }
            }
            return "../avatares/avatar1.png";
        }

        comentarioPost.comentarios.forEach((c) => {
            lista.innerHTML +=
                `<section class="comentarios-sección">
            <article class="comentario">
            <img src="../avatares/${buscarFoto(c.username)}.png" alt="${c.username}" class="comentarios-avatar">
            <div>
                <p class="comentario-nombre">${c.username}</p>
                <p class="comentario-texto">${c.texto}</p>
                <p class="comentario-fecha">${formatearFecha(c.fecha)}</p>
            </div>
            </article>
            </section>`;
            input.placeholder = "Únete a la conversación...";
        });
    }
}
async function publicarComentario() {
    const fecha = new Date()

    const textoComentario = input.value.trim();
    if (textoComentario === "") return; // Si está vacío, no hace nada

    const idPost = popup.dataset.id;
    const nombre = localStorage.getItem("nombre_usuario") || "Anonimo";

    try {
        // 2. Envías la petición al servidor (con la coma corregida)
        await fetch("http://localhost:3000/mango/post/comentar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: nombre,
                idPost: idPost,
                texto: textoComentario,
                fecha: formatearFecha(fecha)
            })
        });

        // 3. Actualizas la interfaz localmente
        const comentarioPost = buscarPost(idPost);
        if (comentarioPost) {
            comentarioPost.comentarios.push({
                username: nombre,
                idPost: idPost,
                texto: textoComentario,
                fecha: formatearFecha(fecha)
            });
            comentarioPost.comentarios_post++;
        }

        // 4. Limpias el input y refrescas
        input.value = "";
        mostrarComentarios(idPost);

        enviar.src = "enviar3.png";
        setTimeout(() => {
            enviar.src = "enviar2.png";
        }, 100);

    } catch (error) {
        console.error("Error al publicar comentario:", error);
    }
}

popup.addEventListener("click", (e) => {
    if (e.target === popup || e.target.closest(".comentarios-linea")) {
        popup.close();
    }
});

enviar.addEventListener("click", publicarComentario);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") publicarComentario();
});
