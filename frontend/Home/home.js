/*fetch('./data/comidas-extended.json')          // Ruta al archivo JSON
  .then(response => response.json())  // Convertir la respuesta en JSON
  .then(data => { 
                        // Aquí tienes acceso al JSON en formato de objeto JS  
    comidas = data;  
    mostrarComidas(comidas)                 // Asignar el JSON a la variable comidas
  })
  .catch(error => {                   // Manejo de errores al leer el archivo JSON
    console.error('Error al leer el archivo JSON:', error);
  });

let comidas = [];

const container = document.getElementById('comidaContainer');

function mostrarComidas(lista){
  container.innerHTML=""
  lista.forEach(comida =>{
    container.innerHTML += `
        <article class="card">
          <h2>${comida.nombre}</h2>
          <p class="provincia">${comida.provincia}</p>
          <ul class="ingredientes">
          ${comida.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
          </ul>
          <span class="categoria">${comida.categoria}</span>
        </article> `
  })
} */
 const containerPosts = document.getElementById("container-posts");


(async () => {
    let response;
    let usuarios;
    let posts;
    try{
        response = await fetch('http://localhost:3000/mango/feedPost');
        posts = await response.json();
        // response = await fetch('http://localhost:3000/mango/listaUsuarios');
        // usuarios = response.json();
        mostrarPosts(posts, []);
        activarVerMas()
        mostrarComentarios()

    }
    catch (error) {
    console.log("Error al cargar datos:", error);
  }


})();

/*

 fetch('http://localhost:3000/mango/mostrarPost')
 .then(response => response.json())
 .then(data => {
   posts = data;
   mostrarPosts(posts);
 })
 .catch(error => {
   console.log('Error al cargar los posts:', error);
   scrolleo.innerHTML = "<p>No se pudieron cargar los posts</p>";
 });


 fetch('http://localhost:3000/mango/listaUsuarios')
 .then(response => response.json())
 .then(data => {
   posts = data;
   mostrarPosts(posts);
 })
 .catch(error => {
   console.log('Error al cargar los posts:', error);
   scrolleo.innerHTML = "<p>No se pudieron cargar los posts</p>";
 });
*/



function mostrarPosts(posts, usuarios) {
 containerPosts.innerHTML = "";
 

 posts.forEach(post => {
   

   containerPosts.innerHTML += 
   `<article class="post">
            <div class="usuario">
            <img src="" alt="" class="fotodeperfil"></img>
            <h2>${post.id_usuario}</h2>
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
    mostrarComentarios();
    popup.showModal();
  }
});

let comentarios = [];

function mostrarComentarios() {
    lista.innerHTML = "";

    if (comentarios.length === 0) {
        lista.innerHTML = 
        `<section class= "sin-comentarios">
        <article class="comentarios-vacio">
        <p class="vacio-titulo">Todavía no hay comentarios</p>
        <p class= "segundo-texto">Deja tu huella</p>
        </article>
        </section>`;
        input.placeholder = "Empieza la conversación...";
        return;
    }

    input.placeholder = "Únete a la conversación...";
    comentarios.forEach((c) => {
        const section = document.createElement("section");
        section.className = "comentario";
        section.innerHTML = 
        `<figure class="comentarios-avatar"></figure>
        <article>
            <p class="comentario-nombre"></p>
            <p class="comentario-texto"></p>
            </article>`;
        section.querySelector(".comentario-nombre").textContent = c.nombre;
        section.querySelector(".comentario-texto").textContent = c.texto;
        lista.appendChild(section);
    });
}

function enviarComentario() {
    const texto = input.value;
    if (texto === "") return;
    comentarios.push({ nombre: "Tu usuario", texto: texto });
    input.value = "";
    mostrarComentarios();
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