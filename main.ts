import { Casino } from "./Casino";
import { RuletaSimple } from "./RuletaSimple";
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
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Mostrar título
console.log(chalk.cyan(figlet.textSync("Casino", { horizontalLayout: "full" })));
console.log(chalk.green(`Saldo para apostar: $${saldo}`));
console.log(chalk.yellow("Juegos disponibles: " + casino.listarJuegos().join(", ")));

// Función para preguntar por consola
function preguntar(pregunta: string): Promise<string> {
  return new Promise((resolve) => rl.question(pregunta, resolve));
}

function mostrarTablaRuleta(): void {
  const rojo = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  const negro = new Set([2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]);

  function colorNumero(n: number): string {
    if (n === 0) return chalk.black.bgGreen("  0 ");
    if (rojo.has(n)) return chalk.white.bgRed(n.toString().padStart(2, " ") + " ");
    if (negro.has(n)) return chalk.white.bgBlack(n.toString().padStart(2, " ") + " ");
    return n.toString();
  }

  console.log(chalk.yellow("══════════════════════════════════════"));
  console.log(chalk.yellow("🎰 Tablero de ruleta – 🎰"));
  console.log(chalk.yellow("══════════════════════════════════════"));

  // Mostrar el 0 centrado
  console.log(" ".repeat(16) + colorNumero(0));
  console.log();

  // Mostrar 3 filas de 12 columnas (1 a 36)
  for (let fila = 0; fila < 3; fila++) {
    let linea = "";
    for (let col = 0; col < 12; col++) {
      const num = col * 3 + (3 - fila);
      linea += colorNumero(num) + " ";
    }
    console.log(linea);
  }

  console.log(chalk.yellow("══════════════════════════════════════\n"));
}

// Función principal
async function main() {
  let nombre = await preguntar("Ingrese su nombre: ");
  let apellido = await preguntar("Ingrese su apellido: ");
  let juegoNombre = await preguntar("Elija un juego: ");
  let juego = casino.elegirJuego(juegoNombre);

  if (!juego) {
    console.log(chalk.red("Juego no encontrado."));
    rl.close();
    return;
  }

  console.log(chalk.blue(`Hola ${nombre} ${apellido}, has seleccionado: ${chalk.bold(juego.nombre)}`));

  // Si es ruleta, mostrar tabla y pedir número
  if (juego instanceof RuletaSimple) {
    mostrarTablaRuleta();

    const numeroStr = await preguntar("Elige un número del 0 al 36: ");
    const numero = parseInt(numeroStr);

    if (isNaN(numero) || numero < 0 || numero > 36) {
      console.log(chalk.red("Número inválido. Debe estar entre 0 y 36."));
      rl.close();
      return;
    }

    juego.setNumeroElegido(numero);
  }

  // Pedir monto de apuesta
  let apostarStr = await preguntar(`Ingrese monto a apostar (mínimo $${juego.apuestaMinima}): `);
  let apuesta = Number(apostarStr);

  if (isNaN(apuesta) || apuesta < juego.apuestaMinima) {
    console.log(chalk.red("Apuesta inválida."));
    rl.close();
    return;
  }

  try {
    saldo -= apuesta;
    let ganancia = juego.jugar(apuesta);
    saldo += ganancia;

    if (ganancia > 0) {
      console.log(chalk.yellow(`¡Ganaste $${ganancia}! 🎉`));
    } else {
      console.log(chalk.red("Perdiste, mejor suerte la próxima. 💀"));
    }

    console.log(chalk.white(`Saldo final: $${saldo}`));
    fs.writeFileSync(archivo, saldo.toString());
  } catch (e) {
    if (e instanceof Error) {
      console.log(chalk.red("Error: " + e.message));
    } else {
      console.log(chalk.red("Error desconocido:", e));
    }
  } finally {
    rl.close();
  }
}

main();

// Necesario para TypeScript con figlet
declare module 'figlet';