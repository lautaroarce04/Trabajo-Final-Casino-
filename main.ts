import { Casino } from "./Casino";
import * as readline from "readline";
import * as fs from "fs";
import chalk from "chalk";
import figlet from "figlet";

// Ruta del archivo de saldo
let archivo = "saldo.txt";
let saldo = fs.existsSync(archivo) ? parseFloat(fs.readFileSync(archivo, "utf-8")) : 100;

// Instancia del casino
let casino = new Casino();

// Interfaz readline
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Mostrar título con figlet
console.log(chalk.cyan(figlet.textSync("Casino", { horizontalLayout: "full" })));
console.log(chalk.green(`Saldo actual: $${saldo}`));
console.log(chalk.yellow("Juegos disponibles: " + casino.listarJuegos().join(", ")));

// Función auxiliar para preguntar por consola
function preguntar(pregunta: string): Promise<string> {
  return new Promise((resolve) => rl.question(pregunta, resolve));
}

// Función principal
async function main() {
  let nombre = await preguntar("Ingrese su nombre y apellido: ");
  let juegoNombre = await preguntar("Elija un juego: ");
  let juego = casino.elegirJuego(juegoNombre);

  if (!juego) {
    console.log(chalk.red("Juego no encontrado."));
    rl.close();
    return;
  }

  console.log(chalk.blue(`Hola ${nombre}, has seleccionado: ${chalk.bold(juego.nombre)}`));

  let apuestaStr = await preguntar(`Ingrese monto a apostar (mínimo $${juego.apuestaMinima}): `);
  let apuesta = Number(apuestaStr);

  try {
    saldo -= apuesta;
    let ganancia = juego.jugar(apuesta);
    saldo += ganancia;
    fs.writeFileSync(archivo, saldo.toString());
    console.log(chalk.white(`Saldo actual: $${saldo}`));
  } catch (e) {
    if (e instanceof Error) {
      console.log(chalk.red("Error: " + e.message));
    } else {
      console.log(chalk.red("Error desconocido"));
    }
  } finally {
    rl.close();
  }
}

main();

// Necesario para TypeScript con figlet
declare module 'figlet';