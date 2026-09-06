const header = document.getElementById('header');

window.addEventListener('scroll', () => {
	header.classList.toggle('oculto', window.scrollY > 0);
});