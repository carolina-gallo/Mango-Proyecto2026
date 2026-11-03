const botonMas = document.querySelector("#botonMas");
const menuCrear = document.querySelector("#menuCrearpopup");

botonMas.addEventListener("click", (evento) => {
    evento.preventDefault();
    menuCrear.showModal();
});

menuCrear.addEventListener("click", (evento) => {
    if (evento.target === menuCrear) {
        menuCrear.close();
    }
});

function irAPerfil(idOtroUs) {
    if (Number(idOtroUs) === Number(localStorage.getItem("id"))) {
        window.location.href = "../Perfil/perfil.html";
        return;
    }
    localStorage.setItem("idPerfilAjeno", idOtroUs);
    window.location.href = "../Perfil/perfil-ajeno.html";
}
