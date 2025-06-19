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

function mostrarTitulo() {
  const ascii = figlet.textSync("CASINO", { font: "Standard" });
  console.log(chalk.yellowBright(ascii));
}

function mostrarEncabezado() {
  mostrarTitulo();
  console.log(chalk.magenta("─".repeat(50)));
  console.log(chalk.green.bold(`💰 Saldo actual: $${saldo}`));
  console.log(chalk.magenta("─".repeat(50)));
}

async function jugar(nombre: string) {
  console.log(chalk.yellowBright("\n🎲 Juegos disponibles:"));

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
    // Pasamos el saldo actual al juego
    const gananciaNeta = await juego.jugar(saldo);

    // Actualizamos saldo
    saldo += gananciaNeta;

    // Guardamos saldo actualizado
    fs.writeFileSync(archivo, saldo.toString());

    console.log(chalk.green(`✅ Juego completado. Saldo actual: $${saldo}`));
  } catch (e) {
    console.log(chalk.red("⚠️  Error: " + (e instanceof Error ? e.message : "Error desconocido")));
  }
}

async function main() {
  mostrarEncabezado();

  let nombre = "";
  let edad = 0;

  while (true) {
    const respuesta = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "🧠 Ingrese su nombre y apellido:",
        validate: (input) => (input.trim() === "" ? "Debe ingresar un nombre" : true),
      },
      {
        type: "input",
        name: "edadStr",
        message: "🔞 Ingrese su edad:",
        validate: (input) => {
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
    mostrarEncabezado();
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
  }

  console.log(chalk.yellowBright("\n🎉 ¡Gracias por jugar en el CASINO! 👋 Hasta la próxima."));
}

main();