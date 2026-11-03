const idUsEliminar = Number(localStorage.getItem('id'));
const menuPerfil = document.getElementById('menueditarperfil');
const botonEliminarCuenta = document.getElementById('botonEliminarCuenta');
const dialogEliminar = document.getElementById('dialogEliminar');
const passEliminar = document.getElementById('passEliminar');
const errorEliminar = document.getElementById('errorEliminar');

function mostrarErrorEliminar(texto) {
    errorEliminar.textContent = texto;
    errorEliminar.hidden = false;
}

botonEliminarCuenta.addEventListener('click', () => {
    menuPerfil.close();
    passEliminar.value = '';
    errorEliminar.hidden = true;
    dialogEliminar.showModal();
});

document.getElementById('cancelarEliminar').addEventListener('click', () => {
    dialogEliminar.close();
});

dialogEliminar.addEventListener('click', (e) => {
    if (e.target === dialogEliminar) dialogEliminar.close();
});

document.getElementById('confirmarEliminar').addEventListener('click', async () => {
    const contraseña = passEliminar.value;
    if (!contraseña) {
        mostrarErrorEliminar('Ingresá tu contraseña para confirmar.');
        return;
    }

    try {
        // el back pide el email, así que lo sacamos del usuario logueado
        const resUs = await fetch(`http://localhost:3000/mango/usuario/${idUsEliminar}`);
        const usuario = await resUs.json();

        const res = await fetch('http://localhost:3000/mango/eliminarUsuario', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: usuario.email, contraseña })
        });

        if (res.ok) {
            localStorage.clear();
            window.location.href = '../Login/INICIO-1/bienvenido.html';
        } else {
            mostrarErrorEliminar(await res.text());
        }
    } catch (error) {
        console.error('No se pudo eliminar la cuenta:', error);
        mostrarErrorEliminar('No se pudo conectar con el servidor.');
    }
});