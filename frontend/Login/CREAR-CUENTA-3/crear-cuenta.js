
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

// solo existe en crear-cuenta.html
if (botonRegistrar) {
    botonRegistrar.addEventListener("click", (event) => {
        event.preventDefault();
        registrarUsuario();
    });
}

// PARA EL FORM RESTRICCIONES
const botonRestricciones = document.getElementById("botonlogin")

async function guardarRestricciones() {
    const id = localStorage.getItem("id");
    const cajas = document.querySelectorAll(".caja-input:checked");
    const restricciones = Array.from(cajas).map((caja) => caja.id);

    const respuesta = await fetch("http://localhost:3000/mango/RUTA-A-CONFIRMAR", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, restricciones })
    });

    if (respuesta.status === 200) {
        window.location.href = "../../Home/homeposts.html";
    }
}

// solo existe en form-restricciones.html
if (botonRestricciones && !botonRegistrar) {
    botonRestricciones.addEventListener("click", (event) => {
        event.preventDefault();
        guardarRestricciones();
    });
}
async function verRestricciones(){
const id = localStorage.getItem("id");
const respuesta = await fetch(`http://localhost:3000/mango/usuario/${id}`);
const usuario = await respuesta.json();

return console.log(usuario.restricciones);
}