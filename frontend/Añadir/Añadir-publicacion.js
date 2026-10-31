const form = document.getElementById("formPost");
const botonVinculo = document.getElementById("botonVinculo");
const usuarioId = localStorage.getItem("id");

let imagenBase64 = "";

const botonImagen = document.querySelector(".subir-imagen");
const inputImagen = document.getElementById("inputImagen");
const camaraImg = document.querySelector(".camaritauwu");
const textoImagen = botonImagen.querySelector(".h2");

botonImagen.addEventListener("click", () => {
    inputImagen.click();
});

inputImagen.addEventListener("change", () => {
    const archivo = inputImagen.files[0];
    if (!archivo) return;

    if (archivo.size > 5 * 1024 * 1024) {
        alert("La imagen es muy pesada");
        inputImagen.value = "";
        return;
    }

    const lector = new FileReader();
    lector.addEventListener("load", () => {
        imagenBase64 = lector.result;
        camaraImg.src = imagenBase64;
        botonImagen.classList.add("con-imagen");
        textoImagen.textContent = "Cambiar imagen";
    });
    lector.readAsDataURL(archivo);
});




/* ---------- VINCULAR RECETA (popup buscador) ---------- */
const dialogRecetas = document.getElementById("buscadorRecetas");
const inputBuscar = document.getElementById("inputBuscar");
const resultadosRecetas = document.getElementById("resultadosRecetas");
const cerrarBuscador = document.getElementById("cerrarBuscadorRecetas");
const inputIdReceta = document.getElementById("idReceta");
const textoVinculo = botonVinculo.querySelector(".vinculartexto");

let listaUsuarios = [];

// mismo fetch que buscar() de buscador.js
async function buscar(texto) {
    const respuesta = await fetch(`http://localhost:3000/mango/busqueda/${texto}`);
    return await respuesta.json();
}

// igual que buscarConFiltros() de buscadorrecetas.js, pero sin filtros
async function cargarTodasLasRecetas() {
    try {
        const respuesta = await fetch("http://localhost:3000/mango/busqueda", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filtros: {} })
        });
        const datos = await respuesta.json();
        mostrarResultados(datos.recetas);
    } catch (error) {
        console.error("Error al buscar:", error);
        resultadosRecetas.innerHTML = '<p class="bdr-vacio">No se pudieron cargar las recetas.</p>';
    }
}

botonVinculo.addEventListener("click", async () => {
    inputBuscar.value = "";
    dialogRecetas.showModal();

    if (listaUsuarios.length === 0) {
        try {
            const res = await fetch("http://localhost:3000/listaUsuarios");
            listaUsuarios = await res.json();
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    }
    cargarTodasLasRecetas();
});

// buscador por texto (debounce de 300 ms, igual que buscador.js)
let esperar;
inputBuscar.addEventListener("input", () => {
    clearTimeout(esperar);

    esperar = setTimeout(async () => {
        const texto = inputBuscar.value.trim();

        if (texto === "") {
            cargarTodasLasRecetas();
            return;
        }

        try {
            const resultado = await buscar(texto);
            mostrarResultados(Array.isArray(resultado) ? resultado : resultado.recetas);
        } catch (error) {
            console.error("Error al buscar:", error);
        }
    }, 300);
});

function nombreDeAutor(idUsuario) {
    const autor = listaUsuarios.find(u => u.id == idUsuario || u.id_usuario == idUsuario);
    return autor ? (autor.nombre_usuario || autor.username || autor.nombre) : "Usuario";
}

function recortar(texto, largo = 47) {
    return texto.length > largo ? texto.substring(0, largo) + "..." : texto;
}

function mostrarResultados(recetas) {
    resultadosRecetas.innerHTML = "";

    if (!recetas || recetas.length === 0) {
        resultadosRecetas.innerHTML = '<p class="bdr-vacio">No se encontraron recetas.</p>';
        return;
    }

    recetas.forEach(receta => {
        const tarjeta = document.createElement("section");
        tarjeta.className = "bdr-publicacion";

        const figura = document.createElement("figure");
        figura.className = "bdr-imagen";
        const foto = document.createElement("img");
        foto.src = receta.imagen_receta;
        foto.alt = receta.nombre;
        const usuario = document.createElement("p");
        usuario.className = "bdr-usuario";
        usuario.textContent = nombreDeAutor(receta.id_usuario);
        figura.append(foto, usuario);

        const contenido = document.createElement("div");
        contenido.className = "bdr-contenido";
        const titulo = document.createElement("h2");
        titulo.className = "bdr-titulo";
        titulo.textContent = receta.nombre;
        const descripcion = document.createElement("p");
        descripcion.className = "bdr-descripcion";
        descripcion.textContent = recortar(receta.descripcion || "");
        contenido.append(titulo, descripcion);

        tarjeta.append(figura, contenido);

        // elegir esta receta: queda 1 sola vinculada
        tarjeta.addEventListener("click", () => {
            inputIdReceta.value = receta.id;
            textoVinculo.textContent = receta.nombre;
            dialogRecetas.close();
        });

        resultadosRecetas.appendChild(tarjeta);
    });
}

cerrarBuscador.addEventListener("click", () => dialogRecetas.close());

/* ---------- VALIDACIÓN ---------- */
function camposvacios() {
    document.querySelectorAll(".error").forEach(e => e.classList.remove("error"));
}

form.addEventListener("click", (e) => e.target.closest(".error")?.classList.remove("error"));
form.addEventListener("input", (e) => e.target.closest(".error")?.classList.remove("error"));

function validar() {
    camposvacios();
    const errores = [];
    const exigir = (ok, elemento, mensaje) => {
        if (!ok) errores.push({ elemento, mensaje });
    };
    exigir(form.descripcion.value.trim(), form.descripcion, "Agregar una descripción");

    if (errores.length > 0) {
        errores.forEach(e => e.elemento.classList.add("error"));
        errores[0].elemento.scrollIntoView({ behavior: "smooth", block: "center" });
        alert("Falta completar:\n- " + errores.map(e => e.mensaje).join("\n- "));
        return false;
    }
    return true;
}

/* ---------- ENVÍO ---------- */
async function subirPost() {
    if (!validar()) return;
    const post = {
        imagen: imagenBase64,
        desc: form.descripcion.value.trim(),
        idUs: Number(localStorage.getItem("id")),
        idRec: inputIdReceta.value,
    };

    try {
        const resultado = await fetch("http://localhost:3000/mango/subirpost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post)
        });
        if (resultado.status === 200) {
            window.location.href = "../Home/homeposts.html";
        } else {
            alert("Error al subir. Por favor, intente de nuevo.");
        }
    } catch (error) {
        console.error("No se pudo subir el post:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    subirPost();
});