
const filtrosCirculares = document.querySelector("filtro-circular")

filtrosCirculares.forEach(filtro => {
    filtro.addEventListener("click", () => {
        filtro.classList.toggle("seleccionado");
    });
});

const sabores = document.querySelectorAll(".saboresytiempos");
sabores.forEach(saborytiempoydifymetodo => {
    saborytiempoydifymetodo.addEventListener("click", () => {
        const grupo = saborytiempoydifymetodo.parentElement;
        grupo.querySelectorAll(".saborytiempoydifymetodo").forEach(opcion => {
            opcion.classList.remove("seleccionado");
        });
        saborytiempoydifymetodo.classList.add("seleccionado");
    });
});

const dificultad = document.querySelectorAll(".dificultad");
dificultad.forEach(opcion => {
    opcion.addEventListener("click", () => {
        dificultad.forEach(o => o.classList.remove("seleccionado"));
        opcion.classList.add("seleccionado");
    });
});

const metodo = document.querySelectorAll(".metodo");
metodo.forEach(opcion => {
    opcion.addEventListener("click", () => {
        opcion.classList.toggle("seleccionado");
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
    const tiempos = document.querySelectorAll(".tiempo");
    tiempos.forEach(tiempo => {
    tiempo.addEventListener("click", () => {
        tiempo.forEach(opcion => {
            opcion.classList.remove("seleccionado");
        });

        tipo.classList.add("seleccionado");
    });
})