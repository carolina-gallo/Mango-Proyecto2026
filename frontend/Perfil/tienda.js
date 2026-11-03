const idUsuario = Number(localStorage.getItem('id'));

let usuarioActual = null;

function resolverFoto(foto) {
    if (!foto) return '../avatares/default.png';
    if (foto.startsWith('http') || foto.startsWith('data:')) return foto;
    return `../avatares/${foto}.png`;
}

async function obtenerDatosUsuario() {
    if (!idUsuario) return null;
    try {
        const res = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
        const u = await res.json();

        document.getElementById('ftdeperfil').src = resolverFoto(u.foto_perfil);
        return u;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
}

(async () => {
    usuarioActual = await obtenerDatosUsuario();
})();