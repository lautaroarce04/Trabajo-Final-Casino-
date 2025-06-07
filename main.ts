import { Casino } from "./Casino";
import * as readline from "readline";
import * as fs from "fs";
import chalk from "chalk";
import figlet from "figlet";

// Ruta del archivo de saldo
const archivo = "saldo.txt";
let saldo = fs.existsSync(archivo) ? parseFloat(fs.readFileSync(archivo, "utf-8")) : 100;

// Instancia del casino
const casino = new Casino();

// Interfaz readline
const rl = readline.createInterface({
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
  const nombre = await preguntar("Ingrese su nombre y apellido: ");
  const juegoNombre = await preguntar("Elija un juego: ");
  const juego = casino.elegirJuego(juegoNombre);

  if (!juego) {
    console.log(chalk.red("Juego no encontrado."));
    rl.close();
    return;
  }

  console.log(chalk.blue(`Hola ${nombre}, has seleccionado: ${chalk.bold(juego.nombre)}`));

  const apuestaStr = await preguntar(`Ingrese monto a apostar (mínimo $${juego.apuestaMinima}): `);
  const apuesta = Number(apuestaStr);

  try {
    saldo -= apuesta;
    const ganancia = juego.jugar(apuesta);
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