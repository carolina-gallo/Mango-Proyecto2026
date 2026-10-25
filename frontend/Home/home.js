
let posts = [];
let postActual;
 const containerPosts = document.getElementById("container-posts");


(async () => {
    let response;
    let usuarios;
    try{
        response = await fetch('http://localhost:3000/mango/feedPost');
        posts = await response.json();
        response = await fetch('http://localhost:3000/listaUsuarios');
        usuarios = await response.json();
        mostrarPosts(posts, usuarios);
        activarVerMas()

    }
    catch (error) {
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
      }}

   containerPosts.innerHTML += 
        `<article class="post" data-id="${post.id}">
            <div class="usuario">
            <img src="${fotoPerfil}" alt="${fotoPerfil}" class="fotodeperfil"></img>
            <h2>${nombreAMostrar}</h2>
            </div>
            <img class="foto" src="${post.imagen_post}" alt="foto">
            <div class="bottom">
                <div class="interacciones">
                <span><img class="icono" src="likenegro.png" alt="like"></span>
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
const popup = document.getElementById("comentarios");
const lista = document.getElementById("lista-comentarios");
const input = document.getElementById("input-comentario");
const enviar = document.querySelector(".comentarios-enviar");

containerPosts.addEventListener("click", (icon) => {
    const icono = icon.target.closest(".icono");
    if (!icono) return;

  if (icono.alt === "like") {
    const tieneLike = icono.src.includes("likenaranja.png");
    if (tieneLike) {
    icono.src = "likenegro.png";
    } else {
    icono.src = "likenaranja.png";
    }
  }

  if (icono.alt === "comentarios") {
    const idPost = icono.closest(".post").dataset.id;
    popup.dataset.id = idPost;
    console.log("idPost:", idPost, "posts:", posts);
    mostrarComentarios(idPost);
    popup.showModal();
  }
});

function buscarPost(idPost) {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === idPost) {
            return posts[i];
        }
    }
}

function mostrarComentarios(idPost) {
    lista.innerHTML = "";
    const comentarioPost = buscarPost(idPost);
    if (comentarioPost.comentarios.length === 0) {
        lista.innerHTML = 
        `<section class= "sin-comentarios">
        <article class="comentarios-vacio">
        <p class="vacio-titulo">Todavía no hay comentarios</p>
        <p class= "segundo-texto">Deja tu huella</p>
        </article>
        </section>`;
        input.placeholder = "Empieza la conversación...";
    } else {
        comentarioPost.comentarios.forEach((c) => {
        lista.innerHTML += 
        `<section class= "comentarios-sección">
        <article class="comentario">
        <figure class="comentarios-avatar"></figure>
        <div>
            <p class="comentario-nombre">${c.username}</p>
            <p class="comentario-texto">${c.texto}</p>
            <p class="comentario-fecha">${c.fecha}</p>
        </div>
        </article>
        </section>`;
        input.placeholder = "Únete a la conversación...";
        })
    }
}


function enviarComentario() {
    const texto = input.value;
    if (texto === "") return;

    const idPost = popup.dataset.id;
    const comentarioPost = buscarPost(idPost);

    comentarioPost.comentarios.push({
        username: "Tu usuario",
        idPost: idPost,
        texto: texto,
        fecha: new Date().toISOString()
    });
    comentarioPost.comentarios_post++;

    input.value = "";
    mostrarComentarios(idPost);
    enviar.src = "enviar3.png";        
    setTimeout(() => {
        enviar.src = "enviar2.png";    
    }, 100); 
}

popup.addEventListener("click", (e) => {
  if (e.target === popup || e.target.closest(".comentarios-linea")) {
    popup.close();
  }
});

enviar.addEventListener("click", enviarComentario);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enviarComentario();
});