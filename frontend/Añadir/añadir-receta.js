const filtrosCirculares = document.querySelectorAll(
    ".filtro-circular, .filtro-circular1, .filtro-circular2"
);
filtrosCirculares.forEach(filtro => {
    filtro.addEventListener("click", () => {
        filtro.classList.toggle("seleccionado");
    });
});


const sabores = document.querySelectorAll(".saborytiempo");
sabores.forEach(saborytiempo => {
    saborytiempo.addEventListener("click", () => {
        saborytiempo.classList.toggle("seleccionado");
    });
});


const tiposDeComida = document.querySelectorAll(".tipodecomida");
tiposDeComida.forEach(tipo => {
    tipo.addEventListener("click", () => {
        tipo.classList.toggle("seleccionado");
    });
});
