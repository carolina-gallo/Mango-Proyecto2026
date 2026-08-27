// Importamos la librería express
import express from "express";
import usuarios from "backend/data/usuarios.json"
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

app.post ('/usuarios', async (req, res) => {
    try {
        const {
          id,
          nombre,
          apellido,
          username,
          descripcion,
          // ej: { restriccion: "vegano", sabor: "dulce", tiempo: "20-30min" }
        } = req.body;
    
        
        // HASTA ACÁ LLEGUÉ TODO LO DEMÁS ES DE CLAUDE
        // Validación básica: sin esto no se puede subir
        if (!titulo || !ingredientes || !pasos || !filtros) {
          return res.status(400).json({ error: "Faltan datos obligatorios" });
        }
    
        // Creamos el objeto receta y lo guardamos en la base de datos
        const nuevaReceta = await db.recetas.create({
          usuarioId,
          titulo,
          ingredientes,
          foto,
          pasos,
          filtros,
          fecha: new Date(),
          likes: [],
          guardados: []
        });
    
        // Acá también dispararíamos la actualización de Metas/Maestrías:
        // "este usuario subió una receta con filtro X, sumar 1 a su contador de esa maestría"
        await actualizarMaestrias(usuarioId, filtros);
    
        // 201 = "se creó algo nuevo" (a diferencia del 200 que es solo "ok")
        res.status(201).json(nuevaReceta);
    
      } catch (error) {
        res.status(500).json({ error: "No se pudo guardar la receta" });
      }
    });
