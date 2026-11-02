const idUsuario = Number(localStorage.getItem('id'));

async function obtenerprogresometa() {
    if (!idUsuario) return null;
    try {
        const res = await fetch(`http://localhost:3000/mango/MMM/metasPorUsuario`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const u = await res.json();

        document.getElementById('progreso-grasas').textContent = `${u.bajo_en_colesterol ?? 0} /10`;
        document.getElementById('progreso-proteinas').textContent = `${u.alto_en_proteina ?? 0} /10`;
        document.getElementById('progreso-carbohidratos').textContent = `${u.sin_carbohidratos ?? 0} /10`;
        document.getElementById('progreso-keto').textContent = `${u.keto ?? 0} /10`;
        document.getElementById('progreso-sodio').textContent = `${u.bajo_en_sodio ?? 0} /10`;
        return u;
    } catch (error) {
        console.error('Error al obtener el progreso:', error);
        return null;
    }
}

(async () => {
    await obtenerprogresometa();
})();