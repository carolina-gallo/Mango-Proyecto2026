

const botonMas = document.querySelector("#botonMas");
const menuCrear = document.querySelector("#menuCrear");
const cerrarPopup = document.querySelector("#cerrarPopup");

botonMas.addEventListener("click", (evento) => {
    evento.preventDefault();
    menuCrear.showModal();
});

cerrarPopup.addEventListener("click", () => {
    menuCrear.close();
});

menuCrear.addEventListener("click", (evento) => {
    if (evento.target === menuCrear) {
        menuCrear.close();
    }
});
