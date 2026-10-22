const form = document.getElementById("formPost")

const descripcion = document.getElementById("descripcion")
const botonVinculo = document.getElementById("botonVinculo")
const idReceta = document.getElementById("idReceta")

const buscador = document.getElementById("buscadorRecetas")
const inputBuscar = document.getElementById("buscarReceta")
const listaRecetas = document.getElementById("listaRecetas")

let recetas = [];

// Traer las recetas del back
fetch("http://localhost:3000/mango/mostrarRecetas")   // ✏️ PONER la ruta de tu back
  .then(response => response.json())
  .then(data => {
    recetas = data.receta;                                    // ✏️ si viene { receta: [...] } poné data.receta
    mostrarRecetas(recetas);
  })
  .catch(error => {
    console.error("Error al leer las recetas:", error);
    listaRecetas.innerHTML = "<p>No se pudieron cargar las recetas</p>";
  });


function mostrarRecetas(lista) {
    listaRecetas.innerHTML = "";

    lista.forEach(receta => {
        const opcion = document.createElement("div");
        opcion.className = "receta-opcion";
        opcion.textContent = receta.nombre;            // ✏️ PONER el campo con el título de la receta

        opcion.addEventListener("click", () => {
            idReceta.value = receta.id;
            textoVinculo.textContent = receta.nombre;  // ✏️ el mismo campo de arriba
            buscador.close();
        });

        listaRecetas.appendChild(opcion);
    });
}

// Filtrar mientras se escribes
inputBuscar


AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

const form = document.getElementById("formPost");

const descripcion = document.getElementById("descripcion");
const botonVinculo = document.getElementById("botonVinculo");
const idReceta = document.getElementById("idReceta");
const textoVinculo = document.getElementById("textoVinculo");

const buscador = document.getElementById("buscadorRecetas");
const inputBuscar = document.getElementById("buscarReceta");
const listaRecetas = document.getElementById("listaRecetas");

// ✏️ COMPLETAR: poner el ID del input donde se sube la imagen.
// Si todavía no tenés imagen, dejalo en null.
const inputImagen = document.getElementById("imagen");

// Lista de recetas que llegan del backend
let recetas = [];


// =====================================
// 1. TRAER LAS RECETAS DEL BACKEND
// =====================================

fetch("http://localhost:3000/mango/mostrarRecetas") // ✏️ COMPLETAR: ruta GET de tu backend
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudieron obtener las recetas");
        }

        return response.json();
    })
    .then(data => {
        // ✏️ COMPLETAR si tu backend devuelve otro formato.
        // Ejemplos: data.receta, data.recetas o directamente data.
        recetas = Array.isArray(data) ? data : data.receta;

        if (!Array.isArray(recetas)) {
            throw new Error("El formato de las recetas no es válido");
        }

        mostrarRecetas(recetas);
    })
    .catch(error => {
        console.error("Error al cargar las recetas:", error);
        listaRecetas.innerHTML =
            "<p>No se pudieron cargar las recetas.</p>";
    });


// =====================================
// 2. MOSTRAR LAS RECETAS
// =====================================

function mostrarRecetas(lista) {
    listaRecetas.innerHTML = "";

    if (lista.length === 0) {
        listaRecetas.innerHTML =
            "<p>No se encontraron recetas.</p>";
        return;
    }

    lista.forEach(receta => {
        const opcion = document.createElement("div");

        opcion.className = "receta-opcion";

        // ✏️ COMPLETAR si el campo del nombre tiene otro nombre.
        opcion.textContent = receta.nombre;

        opcion.addEventListener("click", () => {
            // ✏️ COMPLETAR si el ID se llama distinto en el backend.
            idReceta.value = receta.id;

            textoVinculo.textContent = receta.nombre;

            buscador.close();
        });

        listaRecetas.appendChild(opcion);
    });
}


// =====================================
// 3. FILTRAR RECETAS AL ESCRIBIR
// =====================================

inputBuscar.addEventListener("input", () => {
    const texto = inputBuscar.value.toLowerCase().trim();

    const recetasFiltradas = recetas.filter(receta =>
        receta.nombre.toLowerCase().includes(texto)
    );

    mostrarRecetas(recetasFiltradas);
});


// =====================================
// 4. ABRIR EL BUSCADOR
// =====================================

botonVinculo.addEventListener("click", () => {
    buscador.showModal();

    inputBuscar.value = "";

    mostrarRecetas(recetas);
});


// =====================================
// 5. PUBLICAR Y ENVIAR LOS DATOS AL BACK
// =====================================

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Comprobar que haya una descripción
    if (descripcion.value.trim() === "") {
        alert("Escribí una descripción para tu publicación.");
        descripcion.focus();
        return;
    }

    // ✏️ COMPLETAR si la receta es obligatoria.
    // Si es obligatoria, descomentá las siguientes líneas:
    //
    // if (idReceta.value === "") {
    //     alert("Tenés que vincular una receta.");
    //     return;
    // }

    // Recoger la información del formulario
    const datosPublicacion = {
        descripcion: descripcion.value.trim(),
        idReceta: idReceta.value || null

        // ✏️ COMPLETAR: agregar otros campos que necesite el backend.
        // Ejemplo: tipo, etiquetas u otros datos de tu formulario.
    };

    try {
        let respuesta;

        // Si hay una imagen, enviar los datos como FormData.
        if (inputImagen && inputImagen.files.length > 0) {
            const datosFormulario = new FormData();

            datosFormulario.append(
                "descripcion",
                datosPublicacion.descripcion
            );

            datosFormulario.append(
                "idReceta",
                datosPublicacion.idReceta ?? ""
            );

            // ✏️ COMPLETAR si el backend espera otro nombre para la imagen.
            datosFormulario.append(
                "imagen",
                inputImagen.files[0]
            );

            // ✏️ COMPLETAR: ruta POST real para crear una publicación.
            respuesta = await fetch(
                "http://localhost:3000/mango/crearPublicacion",
                {
                    method: "POST",
                    body: datosFormulario
                }
            );

        } else {
            // Enviar los datos sin imagen
            respuesta = await fetch(
                "http://localhost:3000/mango/crearPublicacion", // ✏️ COMPLETAR: ruta POST real
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datosPublicacion)
                }
            );
        }

        // Leer la respuesta del backend
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje ||
                resultado.error ||
                "El backend rechazó la publicación."
            );
        }

        alert("¡Publicación guardada correctamente!");

        // Limpiar el formulario después de guardar.
        form.reset();

        // Restablecer el texto de la receta seleccionada.
        textoVinculo.textContent = "Ninguna receta seleccionada";

    } catch (error) {
        console.error("Error al publicar:", error);

        alert(
            "No se pudo guardar la publicación. Revisá la consola."
        );
    }
});
