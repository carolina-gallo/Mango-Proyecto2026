const btnSeguir = document.getElementById("btn-seguir");
// PARA EN EL PERFIL CUANDO SE CUENTEN LOS SEGUIDORES
const elementoSeguidores = document.getElementById("contador-seguidores");

function configurarBotonSeguir(idAutor) {
  if (!btnSeguir || Number(idAutor) === Number(idUsuario)) {
    if (btnSeguir) btnSeguir.style.display = "none";
    return;
  }

  btnSeguir.dataset.idAutor = idAutor;

  const seguidos = JSON.parse(localStorage.getItem("usuarios_seguidos")) || [];
  const yaLoSigue = seguidos.includes(Number(idAutor));

  btnSeguir.textContent = yaLoSigue ? "Siguiendo" : "Seguir";
  btnSeguir.classList.toggle("siguiendo", yaLoSigue);
}

btnSeguir?.addEventListener("click", async () => {
  const idAutor = Number(btnSeguir.dataset.idAutor);
  if (!idAutor) return;

  let seguidos = JSON.parse(localStorage.getItem("usuarios_seguidos")) || [];
  const yaLoSigue = seguidos.includes(idAutor);

  if (yaLoSigue) {
    await fetch("http://localhost:3000/mango/dejardeSeguir", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idUs: Number(idUsuario),
        idOtroUs: idAutor
      })
    });

    seguidos = seguidos.filter(id => id !== idAutor);
    btnSeguir.textContent = "Seguir";
    btnSeguir.classList.remove("siguiendo");
    btnSeguir.classList.add("seguir");

  } else {
    // Si no lo sigue -> SEGUIR
    await fetch("http://localhost:3000/mango/seguir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idUs: Number(idUsuario),
        idOtroUs: idAutor
      })
    });

    seguidos.push(idAutor);
    btnSeguir.textContent = "Siguiendo";
    btnSeguir.classList.remove("seguir");
    btnSeguir.classList.add("siguiendo");
  }

  localStorage.setItem("usuarios_seguidos", JSON.stringify(seguidos));
});