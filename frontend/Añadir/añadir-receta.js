const filtrosCirculares = document.querySelectorAll(
    ".filtro-circular, .filtro-circular1, .filtro-circular2"
);
filtrosCirculares.forEach(filtro => {
    filtro.addEventListener("click", () => {
        filtro.classList.toggle("seleccionado");
    });
});

const sabores = document.querySelectorAll(".saboresytiempos .saborytiempoydifymetodo");
sabores.forEach(saborytiempoydifymetodo => {
    saborytiempoydifymetodo.addEventListener("click", () => {
        const grupo = saborytiempoydifymetodo.parentElement;
        grupo.querySelectorAll(".saborytiempoydifymetodo").forEach(opcion => {
            opcion.classList.remove("seleccionado");
        });
        saborytiempoydifymetodo.classList.add("seleccionado");
    });
});

const dificultad = document.querySelectorAll(".difsymetodo .saborytiempoydifymetodo");
dificultad.forEach(saborytiempoydifymetodo => {
    saborytiempoydifymetodo.addEventListener("click", () => {
        const grupo = saborytiempoydifymetodo.parentElement;
        grupo.querySelectorAll(".saborytiempoydifymetodo").forEach(opcion => {
            opcion.classList.remove("seleccionado");
        });
        saborytiempoydifymetodo.classList.add("seleccionado");
    });
});

const tiposDeComida = document.querySelectorAll(".tipodecomida");
tiposDeComida.forEach(tipo => {
    tipo.addEventListener("click", () => {
        tiposDeComida.forEach(opcion => {
            opcion.classList.remove("seleccionado");
        });

        tipo.classList.add("seleccionado");
    });
});

const agregarIngredienteBtn = document.getElementById("agregaringrediente")
const ingredientesContainer = document.querySelector(".contenedor-ingredientes")

agregarIngredienteBtn.addEventListener("click", () => {
  const input = document.createElement("input")
  input.type = "text"
  input.className = "ingredientes"
  input.name = "ingredientes"
  input.placeholder = "Agregar ingrediente"
  ingredientesContainer.appendChild(input)
})


const agregarPasoBtn = document.getElementById("agregarpaso")
const pasosContainer = document.querySelector(".contenedor-pasos")

agregarPasoBtn.addEventListener("click", () => {
  const numeroSiguiente = pasosContainer.querySelectorAll(".numeroypaso").length + 1
  const contenedor = document.createElement("div")
  contenedor.className = "numeroypaso"
  const numero = document.createElement("div")
  numero.className = "numero"
  numero.textContent = numeroSiguiente
  const textarea = document.createElement("textarea")
  textarea.name = "pasos"
  textarea.className = "pasos"
  textarea.placeholder = "Mezcla la manteca con  el azucar hasta que quede una mexcla homogenea."

  contenedor.appendChild(numero)
  contenedor.appendChild(textarea)
  pasosContainer.appendChild(contenedor)
})


const CLAVES_FILTROS = [
    "salado", "dulce", "umami", "picante", "agridulce", "acido",
    "bebida", "comida", "postre", "snack",
    "1-15min", "15-30min", "30-60min", "60+min",
    "celiacx", "veganx", "vegetarianx", "kosher", "hipertensx", "diabeticx", "bajo colesterol", "keto", "alergia a frutos secos", "intolerancia a la lactosa",
    "horno", "airfryer", "sarten", "olla", "microondas", "heladera", "nada",
    "alta", "media", "baja"
];

function armarFiltros() {
    const filtros = {};
    CLAVES_FILTROS.forEach(clave => { filtros[clave] = false; });
 
    const activar = (clave) => {
        if (clave in filtros) filtros[clave] = true;
    };
 
    document.querySelectorAll(".opcionesrestricciones .seleccionado")
        .forEach(f => activar(f.dataset.filtro));

const dato = (selector) =>
    document.querySelector(selector)?.dataset.saborytiempoydifymetodo;
 
    activar(dato("#sabor .seleccionado"));
    activar(dato("#tiempo .seleccionado"));
    activar(dato("#dificultad .seleccionado"));
    activar(dato("#metodo .seleccionado"));
    activar(document.querySelector("#tipo .seleccionado")?.dataset.tipo);
 
    return filtros;
}

const form = document.getElementById("formReceta");
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

const ingredientes = Array.from(document.querySelectorAll(".ingredientes"));
const pasos = Array.from(document.querySelectorAll(".pasos"));
 
    exigir(form.titulo.value.trim(), form.titulo, "Agregar un título");
    exigir(form.descripcion.value.trim(), form.descripcion, "Agregar una descripción");
    exigir(ingredientes.some(i => i.value.trim()), ingredientes[0], "Agregar al menos un ingrediente");
    exigir(pasos.some(p => p.value.trim()), pasos[0], "Agregar al menos un paso");
    exigir(document.querySelector("#sabor .seleccionado"), document.getElementById("sabor"), "Elegir un sabor");
    exigir(document.querySelector("#tiempo .seleccionado"), document.getElementById("tiempo"), "Marcar un tiempo");
    exigir(document.querySelector("#tipo .seleccionado"), document.getElementById("tipo"), "Marcar un tipo de comida");
    exigir(document.querySelector("#dificultad .seleccionado"), document.getElementById("dificultad"), "Marcar una dificultad");
    exigir(document.querySelector("#metodo .seleccionado"), document.getElementById("metodo"), "Marcar un método de cocción");

if (errores.length > 0) {
        errores.forEach(e => e.elemento.classList.add("error"));
        errores[0].elemento.scrollIntoView({ behavior: "smooth", block: "center" });
        alert("Falta completar:\n- " + errores.map(e => e.mensaje).join("\n- "));
        return false;
    }
    return true;
}

async function subirReceta() {
    if (!validar()) return;
 
    const receta = {
        imagen_receta: "",
        idUs: Number(localStorage.getItem("id")),
        nombre: form.titulo.value.trim(),
        descripcion: form.descripcion.value.trim(),
        ingredientes: Array.from(document.querySelectorAll(".ingredientes"))
            .map(i => i.value.trim())
            .filter(Boolean),
        pasos_receta: Array.from(document.querySelectorAll(".pasos"))
            .map(p => p.value.trim())
            .filter(Boolean),
        trucos: form.trucos.value
            .split("\n")
            .map(t => t.trim())
            .filter(Boolean),
        filtros: armarFiltros()
    };
 
    try {
        const resultado = await fetch("http://localhost:3000/mango/subirreceta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(receta)
        });
 
        if (resultado.status === 200) {
            window.location.href = "../Home/homerecetas.html";
        } else {
            alert("Error al subir. Por favor, intente de nuevo.");
        }
    } catch (error) {
        console.error("No se pudo subir la receta:", error);
        alert("No se pudo conectar con el servidor.");
    }
}
 
form.addEventListener("submit", (event) => {
    event.preventDefault();
    subirReceta();
});