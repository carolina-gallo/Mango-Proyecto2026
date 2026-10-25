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


const metodo = document.querySelectorAll(".difsymetodo .saborytiempoydifymetodo");
metodo.forEach(saborytiempoydifymetodo => {
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

AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

const form = document.getElementById("formReceta")
const botonPublicar = document.getElementById("publicar")

async function subirReceta() {
    let receta = {
        imagen: JBVFHDBKJSDKSDKJN,
        titulo: form.titulo.value,
        descripcion: form.descripcion.value,
        ingredientes: Array.from(document.querySelectorAll(".ingredientes")).map(i => i.value),
        pasos: Array.from(document.querySelectorAll(".pasos")).map(p => p.value),
        trucos: form.trucos.value,
        filtros: Array.from(document.querySelectorAll(".opcionesrestricciones .seleccionado")).map(f => f.querySelector(".nombre-filtro").textContent),
        sabor: document.querySelector("#sabor .seleccionado")?.dataset.saborytiempoydifymetodo,
        tiempo: document.querySelector("#tiempo .seleccionado")?.dataset.saborytiempoydifymetodo,
        tipo: document.querySelector("#tipo .seleccionado")?.dataset.tipo,
        dificultad: document.querySelector("#dificultad .seleccionado")?.dataset.saborytiempoydifymetodo,
        metodo: document.querySelector("#metodo .seleccionado")?.dataset.saborytiempoydifymetodo,
        idUs: localStorage.getItem("id")
    }
console.log(receta)
const resultado = await fetch("http://localhost:3000/mango/subirreceta", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(receta)
})
if (resultado.status === 200){
 window.location.href = "../Home/homerecetas.html"
}
else {
    alert("Error al subir. Por favor, intente de nuevo.")
}
}
botonPublicar.addEventListener("click", (event)=>{
    event.preventDefault();
    subirReceta()
})
