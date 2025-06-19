import { Casino } from "./Casino";
import * as fs from "fs";
import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";

// Archivo de saldo
const archivo = "saldo.txt";
let saldo = fs.existsSync(archivo)
  ? parseFloat(fs.readFileSync(archivo, "utf-8"))
  : 100;

// Instancia del casino
const casino = new Casino();

// Mostrar título
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

// Lógica del juego
async function jugar(nombre: string) {
  console.log(chalk.yellowBright("\n🎲 Juegos disponibles:"));

  // Obtener lista de juegos
  const juegos = casino.listarJuegos();

  const respuesta = await inquirer.prompt([
    {
      type: "rawlist",
      name: "juegoSeleccionado",
      message: "🎮 Elija un juego:",
      choices: juegos,
    },
  ]);

  const juegoNombre = respuesta.juegoSeleccionado;
  const juego = casino.elegirJuego(juegoNombre);

  if (!juego) return;

  console.log(chalk.blue(`Hola ${nombre}, has seleccionado: `) + chalk.bold(juego.nombre));

  try {
    const ganancia = await juego.jugar(saldo);
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
  
  let nombre: string = "";
  let edad: number = 0;

  // Validación de nombre y edad con control de límites
  while (true) {
    const respuesta = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "🧠 Ingrese su nombre y apellido:",
        validate: (input: string) => (input.trim() === "" ? "Debe ingresar un nombre" : true),
      },
      {
        type: "input",
        name: "edadStr",
        message: "🔞 Ingrese su edad:",
        validate: (input: string) => {
          const edad = Number(input);
          if (isNaN(edad)) return "Debe ingresar un número válido";
          if (edad < 0) return "🤨Como vas a tener la vida en negativo?🤨";
          if (edad < 18) return "👶No aceptamos a bebes🍼";
          if (edad > 99) return "💀FOA, RE VIEJO, No aceptamos fosiles🦖";
          return true;
        },
      },
    ]);

    nombre = respuesta.nombre;
    edad = Number(respuesta.edadStr);

    if (edad === 99) {
      console.log(chalk.cyanBright("¡👴🏻Jubilado hasta en la vida! ¡Pero bueno, mientras pagues 😃👍🏻!"));
    }

    if (edad >= 18 && edad <= 99) break;
  }

  let continuar = true;
  while (continuar) {
    await jugar(nombre);

    const { respuesta } = await inquirer.prompt([
      {
        type: "rawlist",
        name: "respuesta",
        message: "🔁 ¿Querés volver a jugar?",
        choices: ["Si", "No"],
        default: "No",
      },
    ]);

    continuar = respuesta === "Si";

    if (continuar) {
      mostrarEncabezado();
    }
  }

  console.log(chalk.yellowBright("\n🎉 ¡Gracias por jugar en el CASINO! 👋 Hasta la próxima."));
}

main();

declare module "figlet";