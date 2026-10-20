const descripciones = document.querySelectorAll(".descripcion");

descripciones.forEach((descripcion) => {
    const completo = descripcion.textContent;

    if (completo.length > 47) {
        descripcion.innerHTML = completo.substring(0, 47) + '<span class="mas">... más</span>';

        descripcion.querySelector(".mas").addEventListener("click", () => {
            window.location.href = "recetas-informacion.html"
        });
    }
});
const tituloReceta = document.getElementById("tituloReceta")
const fotoReceta = document.getElementById("fotoReceta")
const descripcionReceta = document.getElementById("descripcion")

tituloReceta.addEventListener("click", () => {
    window.location.href = "recetas-informacion.html"
});
fotoReceta.addEventListener("click", () => {
    window.location.href = "recetas-informacion.html"
});
descripcionReceta.addEventListener("click", () => {
    window.location.href = "recetas-informacion.html"
});


//esto no anda
const guardado = document.querySelector(".guardado");

guardado.addEventListener("click", (ponerAmarillo) => {
    
    ponerAmarillo= guardado.src.includes("guardado-amariillo.png");

  
});