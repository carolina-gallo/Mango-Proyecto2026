const idUsuario = Number(localStorage.getItem('id'));

async function obtenerprogresomision() {
    if (!idUsuario) return null;
    try {
        const res = await fetch(`http://localhost:3000/mango/usuario/${idUsuario}`);
        const u = await res.json();

        document.getElementById('progreso-seguir').textContent = u.seguir_20_personas ?? 0 + " /20";
        document.getElementById('progreso-publicar-posts').textContent = u.pub10Post ?? 0 + " /10";
        document.getElementById('progreso-seguidores').textContent = u.pub10Rec ?? 0 + " /20";
        document.getElementById('progreso-publicar-recetas').textContent = u.tener20seg ?? 0 + " /10";

        return u;
    } catch (error) {
        console.error('Error al obtener el progreso:', error);
        return null;
    }
}

(async () => {
    usuarioActual = await obtenerprogresomision();
})();