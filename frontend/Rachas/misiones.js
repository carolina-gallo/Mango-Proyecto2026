const idUsuario = Number(localStorage.getItem('id'));

async function obtenerprogresomision() {
    if (!idUsuario) {
        console.warn('No hay id en localStorage, iniciá sesión');
        return null;
    }
    try {
        const res = await fetch('http://localhost:3000/listamisiones');
        console.log('status:', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const datos = await res.json();
        console.log('respuesta del back:', datos);

        // /listamisiones devuelve el archivo entero, buscamos el registro del usuario
        const u = datos.find(m => Number(m.idUsuario) === idUsuario) ?? {};

        const estado = (cumplida) => cumplida ? 'Completada' : 'Pendiente';

        document.getElementById('progreso-seguir').textContent = estado(u.seguir_20_personas);
        document.getElementById('progreso-publicar-posts').textContent = estado(u.pub10Post);
        document.getElementById('progreso-seguidores').textContent = estado(u.tener20seg);
        document.getElementById('progreso-publicar-recetas').textContent = estado(u.pub10Rec);
        return u;
    } catch (error) {
        console.error('Error al obtener el progreso:', error);
        return null;
    }
}

obtenerprogresomision();