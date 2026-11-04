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
    const miId = Number(localStorage.getItem("id"));
    const idDestino = Number(idOtroUs);

    if (idDestino === miId) {
        window.location.href = "../Perfil/perfil.html";
        return;
    }

    localStorage.setItem("idPerfilAjeno", idDestino);
    window.location.href = "../Perfil/perfil-ajeno.html"; 
}

function estaGuardada(idReceta) {
    const lista = JSON.parse(localStorage.getItem("guardadas_" + localStorage.getItem("id"))) || [];
    return lista.includes(String(idReceta));
}

function marcarGuardada(idReceta) {
    const clave = "guardadas_" + localStorage.getItem("id");
    const lista = JSON.parse(localStorage.getItem(clave)) || [];
    if (!lista.includes(String(idReceta))) {
        lista.push(String(idReceta));
        localStorage.setItem(clave, JSON.stringify(lista));
    }
}