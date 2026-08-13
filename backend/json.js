const fs = require("fs"); 
const datos = fs.readFileSync("usuarios.json", "utf-8");

console.log(datos);