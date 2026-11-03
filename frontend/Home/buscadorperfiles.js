fetch("http://localhost:3000/listaUsuarios")
    .then(response => response.json())
    .then(data => {
        usuarios = data;
        mostrarPerfiles(usuarios);
        })
    .catch(error => {                   
    console.error('Error al encontrar perfiles:', error);
  });

let usuarios = [];
const containerPerfiles = document.getElementById("perfiles");

function mostrarPerfiles(usuarios) {
    containerPerfiles.innerHTML = "";
    usuarios.forEach(usuario => {
        containerPerfiles.innerHTML += `
        <section class="perfil">
        <figure>
            <img src="../avatares/${usuario.foto_perfil}.png" alt="${usuario.username}" class="foto">
        </figure>
        <div class="columna">
            <h2 class="nombreusuario">${usuario.username}</h2>
            <p class="descripcion">${usuario.descripcion}</p>
        </div>
    </section>`
    });
}

const busqueda = document.getElementById("inputBuscar")

function buscar() {
let perfilesFiltradas = usuarios.filter( usuario=> {
  return usuario.username.toLowerCase().includes(busqueda.value.toLowerCase())
      || usuario.descripcion.toLowerCase().includes(busqueda.value.toLowerCase())
})

mostrarPerfiles(perfilesFiltradas)
}

busqueda.addEventListener("input", buscar)

/*function actualizarFiltros() {
  let categorias = []
  perfiles.forEach(comida => {
    if( !categorias.includes(comida.categoria)) {
    categorias.push(comida.categoria)
    }
  });
  let provincias = []
  perfiles.forEach(comida => {
    if( !provincias.includes(comida.provincia)) {
    provincias.push(comida.provincia)
    }
  });
  categorias.forEach(categoria => {
  filtroCategoria.innerHTML += `<option value="${categoria}">${categoria}</option>`
  })
  provincias.forEach(provincia => {
    filtroProvincia.innerHTML += `<option value="${provincia}">${provincia}</option>`
    })
}

*/