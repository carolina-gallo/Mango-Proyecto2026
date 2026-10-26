const botonLogin = document.getElementById("botonlogin")
const inputMail = document.getElementById("mail")
const inputContraseña = document.getElementById("password")
const form = document.getElementById("formInicioSesion");

    async function validarRespuestas(respuestas) {
        const params = new URLSearchParams({
            email: respuestas.email,
            contraseña: respuestas.contraseña
        });

    try{
const respuesta = await fetch (`http://localhost:3000/mango/iniciarsesion?${params}`, {
    method: "GET",
});

if (respuesta.status === 200) {
    const usuario = await respuesta.json();
    localStorage.setItem("id", usuario.id);
    window.location.href = "../../Home/homeposts.html";
} else {
    const mensaje = await respuesta.text();
}
}
 catch (error) {
console.error("No se pudo iniciar sesión:", error);
alert("No se pudo conectar con el servidor.");
}
    }

form.addEventListener("submit", (event) => {
event.preventDefault();
validarRespuestas({
email: inputMail.value.trim(),
contraseña: inputContraseña.value
});
});