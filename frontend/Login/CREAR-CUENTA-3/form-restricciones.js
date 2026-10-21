const botonRestricciones = document.getElementById("botonlogin");

async function guardarRestricciones(event) {
    event.preventDefault();

    // 1. Traemos los datos que guardamos en la pantalla anterior
    const user = JSON.parse(sessionStorage.getItem("datosRegistro"));

    // 2. Armamos el objeto de restricciones: true si el checkbox está tildado, false si no
    const restricciones = {
        "celiacx": document.getElementById("celiacx").checked,
        "diabeticx": document.getElementById("diabeticx").checked,
        "intolerancia a la lactosa": document.getElementById("Intolerantealalactosa").checked,
        "hipertensx": document.getElementById("hipertensx").checked,
        "bajo colesterol": document.getElementById("Bajoencolesterol").checked,
        "alergia a frutos secos": document.getElementById("alergiafrutossecos").checked,
        "veganx": document.getElementById("veganx").checked,
        "vegetarianx": document.getElementById("vegetarianx").checked,
        "keto": document.getElementById("keto").checked,
        "kosher": document.getElementById("kosher").checked
    };

    // 3. Mandamos todo junto al back
    const respuesta = await fetch("http://localhost:3000/mango/registrarse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre: user.nombre,
            apellido: user.apellido,
            username: user.username,
            email: user.email,
            contraseña: user.contraseña,
            restricciones: restricciones
        })
    });

    // 4. Si salió bien, guardamos el id y vamos al home
    if (respuesta.status === 200) {
        localStorage.setItem("id", usuario.id);
        window.location.href = "../../Home/homeposts.html";
    } else {
            alert("No se pudieron guardar las restricciones");
        }
}

botonRestricciones.addEventListener("click", guardarRestricciones);


async function verRestricciones(){
const id = localStorage.getItem("id");
const respuesta = await fetch(`http://localhost:3000/mango/usuario/${id}`);
const usuario = await respuesta.json();

return console.log(usuario.restricciones);
}


