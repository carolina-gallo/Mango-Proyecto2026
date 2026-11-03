const idUsEditar = Number(localStorage.getItem('id'));
const formEditar = document.getElementById('formEditarPerfil');
const inputNombre = document.getElementById('inputNombre');
const inputUsername = document.getElementById('inputUsername');
const inputDescripcion = document.getElementById('inputDescripcion');

let usuarioEditar = null;

async function cargarDatosEditar() {
    if (!idUsEditar) return;
    try {
        const res = await fetch(`http://localhost:3000//mango/modificar`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        usuarioEditar = await res.json();

        inputNombre.value = usuarioEditar.nombre ?? '';
        inputUsername.value = '@' + usuarioEditar.username;
        inputDescripcion.value = usuarioEditar.descripcion ?? '';
    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
    }
}

formEditar.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!usuarioEditar) return;

    const nombre = inputNombre.value.trim();
    const username = inputUsername.value.trim().replace(/^@/, '');
    const descripcion = inputDescripcion.value.trim();

    if (!nombre || !username) {
        alert('El nombre y el nombre de usuario no pueden estar vacíos.');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/mango/modificarUsuario', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idUs: idUsEditar,
                contraseñaActual: usuarioEditar.contraseña,
                nombre,
                username,
                descripcion
            })
        });

        if (res.ok) {
            localStorage.setItem('nombre_usuario', username);
            window.location.href = 'perfil.html';
        } else {
            alert(await res.text());
        }
    } catch (error) {
        console.error('No se pudo guardar el perfil:', error);
        alert('No se pudo conectar con el servidor.');
    }
});

cargarDatosEditar();