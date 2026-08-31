// Importamos la librería express
import express from "express";
import usuarios from "/data/usuarios.js"

// Creamos el servidor de Express con la configuración estándar básica
const app = express();

// Asociamos la ruta "/" a la función pasada como segundo parámetro
app.get("/", (req, res) => {
    // Esto envía el texto "Hello World!" como respuesta a la HTTP request
    res.send("Hello World!");
});

// Iniciamos el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});

app.get("/working", (req, res)=> {
  res.send ("67")
});

app.get("/saludo", (req, res) => {
  // Obtenemos el valor del parámetro "nombre"
  const nombre = req.query.nombre;
  // Obtenemos el valor del parámetro "apellido"
  const apellido = req.query.apellido;
  // Esto envía el texto "Hello <nombre> <apellido>!" como respuesta
  res.send(`Hello ${nombre} ${apellido}!`);
});
// http://localhost:3000/saludo?nombre=Juan&apellido=Perez