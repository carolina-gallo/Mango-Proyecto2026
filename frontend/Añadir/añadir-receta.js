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
