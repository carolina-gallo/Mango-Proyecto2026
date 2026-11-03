let usuarios = [];
const containerPerfiles = document.getElementById("perfiles");
const idUsuario = Number(localStorage.getItem("id"));

let timeoutBusqueda;

function mostrarPerfiles(usuarios) {
    containerPerfiles.innerHTML = "";
    usuarios.forEach(usuario => {
        containerPerfiles.innerHTML += `
        <section class="perfil">
        <figure>
            <img src="../avatares/${usuario.foto_perfil}.png" alt="${usuario.username}" class="foto" data-id-usuario="${usuario.id_usuario}">
        </figure>
        <div class="columna">
            <h2 class="nombreusuario" data-id-usuario="${usuario.id_usuario}">${usuario.username}</h2>
            <p class="descripcion" data-id-usuario="${usuario.id_usuario}">${usuario.descripcion}</p>
        </div>
    </section>`;
    });
}

fetch("http://localhost:3000/listaUsuarios")
    .then(response => response.json())
    .then(data => {
        usuarios = data;
        mostrarPerfiles(usuarios);
    })
    .catch(error => {                   
        console.error('Error al encontrar perfiles:', error);
    });

async function buscarPosts(texto) {
    try {
        const respuesta = await fetch("http://localhost:3000/mango/busquedaporTexto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: texto,
                filtros: {}
            })
        });

        if (!respuesta.ok) throw new Error("Error en la respuesta del backend");

        return await respuesta.json();
    } catch (error) {
        console.error("Error al buscar posts:", error);
        return { usuarios: [] };
    }
}

async function ejecutarBusqueda() {
    const texto = inputBuscar ? inputBuscar.value.trim() : "";
    if (texto === "") {
        mostrarPerfiles(usuarios);
        return;
    }
    const datos = await buscarPosts(texto);
    const usuariosEncontrados = Array.isArray(datos) ? datos : (datos.usuarios || []);
    mostrarPerfiles(usuariosEncontrados);
}

if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
        clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(ejecutarBusqueda, 300);
    });

    inputBuscar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            clearTimeout(timeoutBusqueda);
            ejecutarBusqueda();
        }
    });
}

containerPerfiles.addEventListener("click", (e) => {
    const usuarioAjeno = e.target.closest(".foto, .nombreusuario, .descripcion");
    
    if (usuarioAjeno) {
        const idAjeno = usuarioAjeno.dataset.idAjeno;
        
        // Guardamos explícitamente el id de la persona clickeada en el localStorage
        localStorage.setItem("idPerfilAjeno", idAjeno);
        
        // Se lo pasamos a la función general
        irAPerfil(idAjeno);
    }
});