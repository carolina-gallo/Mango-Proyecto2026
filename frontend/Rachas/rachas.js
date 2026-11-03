const idUsuario = Number(localStorage.getItem('id'));
 
async function obtenerprogresometa() {
    if (!idUsuario) {
        console.warn('No hay id en localStorage, iniciá sesión');
        return null;
    }
    try {
        const res = await fetch('http://localhost:3000/listametas');
        console.log('status:', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
 
        const datos = await res.json();
        console.log('respuesta del back:', datos);
 
        const u = datos.find(m => Number(m.idUsuario) === idUsuario) ?? {};
 
        document.getElementById('progreso-grasas').textContent = `${u.bajo_en_colesterol ?? 0} /10`;
        document.getElementById('progreso-proteinas').textContent = `${u.alto_en_proteina ?? 0} /10`;
        document.getElementById('progreso-carbohidratos').textContent = `${u.sin_carbohidratos ?? 0} /10`;
        document.getElementById('progreso-keto').textContent = `${u.keto ?? 0} /10`;
        document.getElementById('progreso-sodio').textContent = `${u.hipertensx ?? 0} /10`;
        return u;
    } catch (error) {
        console.error('Error al obtener el progreso:', error);
        return null;
    }
}
 
obtenerprogresometa();