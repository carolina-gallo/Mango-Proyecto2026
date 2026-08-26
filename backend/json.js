import * as fs from 'fs' 
const ruta = 'data/usuarios.json'
const datos = fs.readFileSync(ruta, "utf-8");
const daro = JSON.parse (datos)
console.log(daro);