import { Casino } from "./Casino";
import * as readline from "readline";
import * as fs from "fs";
import chalk from "chalk";
import figlet from "figlet";

// Ruta del archivo de saldo
const archivo = "saldo.txt";
let saldo = fs.existsSync(archivo)
  ? parseFloat(fs.readFileSync(archivo, "utf-8"))
  : 100;

// Instancia del casino
const casino = new Casino();

// Interfaz de entrada
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Mostrar título con colores por letra
function mostrarTituloColorido(titulo: string) {
  const colores = [chalk.red, chalk.green, chalk.yellow, chalk.blue, chalk.magenta, chalk.cyan];
  const ascii = figlet.textSync(titulo, { font: "Standard" });
  const lineas = ascii.split("\n");

  const coloreado = lineas
    .map(linea =>
      linea
        .split("")
        .map((char, i) => colores[i % colores.length](char))
        .join("")
    )
    .join("\n");

  console.log(coloreado);
}

// Mostrar encabezado
console.log(chalk.yellowBright(figlet.textSync("CASINO", { horizontalLayout: "full" })));
console.log(chalk.magenta("─".repeat(60)));
console.log(chalk.green.bold(`💰 Saldo actual: $${saldo}`));
console.log(
  chalk.yellowBright("🎲 Juegos disponibles: ") +
    chalk.green(casino.listarJuegos().join(", "))
);
console.log(chalk.magenta("─".repeat(60)));

// Preguntar con promesa
function preguntar(pregunta: string): Promise<string> {
  return new Promise((resolve) => rl.question(pregunta, resolve));
}

// Función principal
async function main() {
  const nombre = await preguntar(chalk.blue("🧠 Ingrese su nombre y apellido: "));
  const juegoNombre = await preguntar(chalk.blue("🎮 Elija un juego: "));
  const juego = casino.elegirJuego(juegoNombre);

  if (!juego) {
    console.log(chalk.red("❌ Juego no encontrado."));
    rl.close();
    return;
  }

  console.log(chalk.blue(`Hola ${nombre}, has seleccionado: `) + chalk.bold(juego.nombre));

  const apuestaStr = await preguntar(chalk.blue(`💸 Ingrese monto a apostar (mínimo $${juego.apuestaMinima}): `));
  const apuesta = Number(apuestaStr);

  try {
    saldo -= apuesta;
    const ganancia = juego.jugar(apuesta);
    saldo += ganancia;
    fs.writeFileSync(archivo, saldo.toString());

    console.log(chalk.green(`✅ Juego completado. Saldo actual: $${saldo}`));
  } catch (e) {
    console.log(chalk.red("⚠️  Error: " + (e instanceof Error ? e.message : "Error desconocido")));
  } finally {
    rl.close();
  }
}

main();

declare module "figlet";