const btnSeguir = document.getElementById("btn-seguir");
// PARA EN EL PERFIL CUANDO SE CUENTEN LOS SEGUIDORES
const elementoSeguidores = document.getElementById("contador-seguidores");


function claseBtnCambia(siguiendo) {
  if (siguiendo) {
    btnSeguir.textContent = "Siguiendo";
    btnSeguir.className = "siguiendo";
  } else {
    btnSeguir.textContent = "Seguir";
    btnSeguir.className = "seguir";
  }
}

async function configurarBotonSeguir(idAutor) {
  // si es tu propia receta, no mostrar el botón
  if (Number(idAutor) === Number(idUsuario)) {
    btnSeguir.style.display = "none";
    return;
  }

  btnSeguir.dataset.idAutor = idAutor;

  const res = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
  const usuario = await res.json();

  let yaLoSigue = false;
  for (let i = 0; i < usuario.qseguidos.length; i++) {
    if (usuario.qseguidos[i].id === Number(idAutor)) {
      yaLoSigue = true;
    }
  }

  claseBtnCambia(yaLoSigue);
}

btnSeguir.addEventListener("click", async () => {
  const idAutor = Number(btnSeguir.dataset.idAutor);
  const yaLoSigue = btnSeguir.className === "siguiendo";

  if (yaLoSigue) {
    await fetch("http://localhost:3000/mango/dejardeSeguir", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUs: Number(idUsuario), idOtroUs: idAutor })
    });
    claseBtnCambia(false);
  } else {
    await fetch("http://localhost:3000/mango/seguir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUs: Number(idUsuario), idOtroUs: idAutor })
    });
    claseBtnCambia(true);
  }
});