const form = document.getElementById ("formPost")
const botonPublicar = document.getElementById ("publicar")

async function subirPost() {
    let post = {
        imagen: xusivvgbbcsaonfio,
        descripcion: form.descripcion.value,
        idUs:  localStorage.getItem("id"),
        idRec: ntnpidqe
    }
console.log(post)
const resultado = await fetch ("http://localhost:3000/mango/subirpost", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(post)
})
if (resultado.status === 200){
 window.location.href ("../Home/homeposts.html")
}
else {
    alert("Error al subir. Por favor, intente de nuevo.")
}
}
botonPublicar.addEventListener("click", (event)=>{
    event.preventDefault();
    subirPost()
})