
const form = document.getElementById("formulario")

const nombre = document.getElementById("nombre")
const apellido = document.getElementById("apellido")
const username = document.getElementById("username")
const mail = document.getElementById("mail")
const contraseña = document.getElementById("contraseña")
const botonRegistrar = document.getElementById("botonRegistrar")

async function registrarUsuario() {
    let user = {
        nombre: form.nombre.value,
        apellido: form.apellido.value,
        username: form.username.value,
        mail: form.mail.value,
        contraseña: form.contraseña.value
    }
    const respuesta = await fetch("http://localhost:3000/mango/registrarse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
});
const resultado = await respuesta.json();
console.log(resultado)

if (respuesta.status === 200) {
        localStorage.setItem("id", resultado.id);
        window.location.href = "form-restricciones.html";
    }
}

botonRegistrar.addEventListener("click", (event) => {
    event.preventDefault();
    registrarUsuario();
});