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
