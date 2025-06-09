import { Casino } from "./Casino";
import * as readline from "readline";
import * as fs from "fs";
import chalk from "chalk";
import figlet from "figlet";

// Archivo de saldo
const archivo = "saldo.txt";
let saldo = fs.existsSync(archivo)
  ? parseFloat(fs.readFileSync(archivo, "utf-8"))
  : 100;

// Instancia del casino
const casino = new Casino();

// Interfaz readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Mostrar título (solo en amarillo)
function mostrarTitulo() {
  const ascii = figlet.textSync("CASINO", { font: "Standard" });
  console.log(chalk.yellowBright(ascii));
}

// Mostrar encabezado
function mostrarEncabezado() {
  mostrarTitulo();
  console.log(chalk.magenta("─".repeat(60)));
  console.log(chalk.green.bold(`💰 Saldo actual: $${saldo}`));
  console.log(chalk.magenta("─".repeat(60)));
}

// Preguntar usando promesa
function preguntar(pregunta: string): Promise<string> {
  return new Promise(resolve => rl.question(pregunta, resolve));
}

// Lógica del juego
async function jugar(nombre: string) {
  console.log(chalk.yellowBright("\n🎲 Juegos disponibles:"));
  casino.listarJuegos().forEach((juego, index) => {
    console.log(chalk.green(`  ${index + 1}. ${juego}`));
  });

  const juegoNombre = await preguntar(chalk.blue("\n🎮 Elija un juego: "));
  const juego = casino.elegirJuego(juegoNombre);

  if (!juego) {
    console.log(chalk.red("❌ Juego no encontrado."));
    return;
  }

  console.log(chalk.blue(`Hola ${nombre}, has seleccionado: `) + chalk.bold(juego.nombre));

  const apuestaStr = await preguntar(chalk.blue(`💸 Ingrese monto a apostar (mínimo $${juego.apuestaMinima}): `));
  const apuesta = Number(apuestaStr);

  if (isNaN(apuesta) || apuesta < juego.apuestaMinima || apuesta > saldo) {
    console.log(chalk.red("❌ Apuesta inválida."));
    return;
  }

  try {
    saldo -= apuesta;
    const ganancia = juego.jugar(apuesta);
    saldo += ganancia;
    fs.writeFileSync(archivo, saldo.toString());

    console.log(chalk.green(`✅ Juego completado. Saldo actual: $${saldo}`));
  } catch (e) {
    console.log(chalk.red("⚠️  Error: " + (e instanceof Error ? e.message : "Error desconocido")));
  }
}

// Función principal
async function main() {
  mostrarEncabezado();
  const nombre = await preguntar(chalk.blue("🧠 Ingrese su nombre y apellido: "));

  let continuar = true;
  while (continuar) {
    await jugar(nombre);
    const respuesta = await preguntar(chalk.cyan("\n🔁 ¿Querés volver a jugar? (si / no): "));
    continuar = respuesta.trim().toLowerCase() === "si";
    if (continuar) {
      mostrarEncabezado();
    }
  }

  console.log(chalk.yellowBright("\n🎉 ¡Gracias por jugar en el CASINO! Hasta la próxima."));
  rl.close();
}

main();

declare module "figlet";
