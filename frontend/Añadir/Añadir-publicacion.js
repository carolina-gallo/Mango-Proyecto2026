const form = document.getElementById("formPost");
const botonVinculo = document.getElementById("botonVinculo");
const usuarioId = localStorage.getItem("id");

let imagenBase64 = "";
 
const botonImagen = document.querySelector(".subir-imagen");
const inputImagen = document.getElementById("inputImagen");
const camaraImg = document.querySelector(".camaritauwu");
const textoImagen = botonImagen.querySelector(".h2");
 
botonImagen.addEventListener("click", () => {
    inputImagen.click();
});
 
inputImagen.addEventListener("change", () => {
    const archivo = inputImagen.files[0];
    if (!archivo) return;
 
    if (archivo.size > 5 * 1024 * 1024) {
        alert("La imagen es muy pesada");
        inputImagen.value = "";
        return;
    }
 
    const lector = new FileReader();
    lector.addEventListener("load", () => {
        imagenBase64 = lector.result;               
        camaraImg.src = imagenBase64;             
        botonImagen.classList.add("con-imagen"); 
        textoImagen.textContent = "Cambiar imagen";
    });
    lector.readAsDataURL(archivo);
});

function camposvacios() {
    document.querySelectorAll(".error").forEach(e => e.classList.remove("error"));
}
 
form.addEventListener("click", (e) => e.target.closest(".error")?.classList.remove("error"));
form.addEventListener("input", (e) => e.target.closest(".error")?.classList.remove("error"));
 
function validar() {
    camposvacios();
    const errores = [];
    const exigir = (ok, elemento, mensaje) => {
        if (!ok) errores.push({ elemento, mensaje });
    };
    exigir(form.descripcion.value.trim(), form.descripcion, "Agregar una descripción");
 
    if (errores.length > 0) {
        errores.forEach(e => e.elemento.classList.add("error"));
        errores[0].elemento.scrollIntoView({ behavior: "smooth", block: "center" });
        alert("Falta completar:\n- " + errores.map(e => e.mensaje).join("\n- "));
        return false;
    }
    return true;
}
 
async function subirPost() {
    if (!validar()) return;
    const post = {
        imagen: imagenBase64,
        desc: form.descripcion.value.trim(),
        idUs: Number(localStorage.getItem("id")),
        idRec: "",
    };
 
    try {
        const resultado = await fetch("http://localhost:3000/mango/subirpost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post)
        });
        if (resultado.status === 200) {
            window.location.href = "../Home/homeposts.html";
        } else {
            alert("Error al subir. Por favor, intente de nuevo.");
        }
    } catch (error) {
        console.error("No se pudo subir el post:", error);
        alert("No se pudo conectar con el servidor.");
    }
}
 
form.addEventListener("submit", (event) => {
    event.preventDefault();
    subirPost();
});
 