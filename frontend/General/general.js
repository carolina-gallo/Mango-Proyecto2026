const botonMas = document.querySelector("#botonMas");
const menuCrear = document.querySelector("#menuCrear");

botonMas.addEventListener("click", (evento) => {
    evento.preventDefault();
    menuCrear.showModal();
});

menuCrear.addEventListener("click", (evento) => {
    if (evento.target === menuCrear) {
        menuCrear.close();
    }
});