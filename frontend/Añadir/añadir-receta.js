const filtrosCirculares = document.querySelectorAll(
    ".filtro-circular, .filtro-circular1, .filtro-circular2"
);


filtrosCirculares.forEach(filtro => {
    filtro.addEventListener("click", () => {
        filtro.classList.toggle("seleccionado");
    });
});