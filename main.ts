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
  console.log(chalk.greenBright.bold("\n🎰 ¡Bienvenido al mejor casino! 🍀\n"));
  console.log(chalk.magentaBright("─".repeat(50)));
  console.log();
}

function mostrarSaldoActual() {
  console.log(chalk.magenta("─".repeat(50)));
  console.log(chalk.green.bold(`💰 Saldo actual: $${saldo}`));
  console.log(chalk.magenta("─".repeat(50)));
}

const mensajesSaldoInsuficiente = [
  "❌ No te alcanza para jugar ese juego, juntá más plata y volvé.",
  "⚠️ Che, sin plata no podés jugar, te lo digo por si no sabés.",
  "🚫 Te estoy diciendo que no tenés plata para jugar...chau.",
  "❗ Andá a juntar más plata para jugar, sino andate. . .pobre.",
];

let indiceMensajeGlobal = 0;

async function jugar(nombre: string) {
  while (true) {
    console.log(chalk.yellowBright("\n🎲 Juegos disponibles:"));

    const juegos = casino.listarJuegos();

    const respuesta = await inquirer.prompt([
      {
        type: "list",
        name: "juegoSeleccionado",
        message: "🎮 Elija un juego:",
        choices: juegos,
      },
    ]);

    const juegoNombre = respuesta.juegoSeleccionado;
    const juego = casino.elegirJuego(juegoNombre);

    if (!juego) {
      console.log(chalk.red("❌ No se encontró el juego seleccionado."));
      continue; // volver a mostrar opciones
    }

    if (saldo < juego.apuestaMinima) {
      const mensaje = mensajesSaldoInsuficiente[indiceMensajeGlobal % mensajesSaldoInsuficiente.length];
      console.log(chalk.redBright(`${mensaje} (Intento para: "${juegoNombre}", saldo: $${saldo})`));
      indiceMensajeGlobal++;
      continue; // vuelve a pedir opción sin salir del ciclo
    }

    console.log(chalk.cyanBright(`\n🎮 Has seleccionado el juego: ${chalk.bold(juegoNombre)}\n`));

    try {
      const gananciaNeta = await juego.jugar(saldo);
      saldo += gananciaNeta;
      fs.writeFileSync(archivo, saldo.toString());

      console.log(chalk.green(`✅ Juego completado. Saldo actual: $${saldo}`));
    } catch (e) {
      console.log(chalk.red("⚠️  Error: " + (e instanceof Error ? e.message : "Error desconocido")));
    }

    break; // salir del ciclo después de jugar
  }
}

async function main() {
  mostrarTitulo(); 

  if (saldo < 10) {
    console.log(chalk.redBright("\n❌ Saldo insuficiente para jugar. juntá platita y vení.\n"));
    process.exit(0);
  }

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
          if (edad < 0) return "🤨 ¿Cómo vas a tener la vida en negativo?";
          if (edad < 18) return "👶 No aceptamos a bebés 🍼";
          if (edad > 99) return "💀 FOA, RE VIEJO. No aceptamos fósiles 🦖";
          return true;
        },
      },
    ]);

    nombre = respuesta.nombre;
    edad = Number(respuesta.edadStr);

    if (edad === 99) {
      console.log(chalk.cyanBright("¡👴🏻 Jubilado hasta en la vida! ¡Pero bueno, mientras pagues 😃👍🏻!"));
    } else if (edad >= 18 && edad <= 99) {
      console.log(chalk.greenBright("🆗 Sin problemas, acá no juzgamos por la edad, así que pasá y disfrutá 🎉"));
    }

    if (edad >= 18 && edad <= 99) break;
  }

  let continuar = true;
  while (continuar) {
    mostrarSaldoActual();
    await jugar(nombre);

    if (saldo < 10) {
      console.log(chalk.redBright("\n❌ Saldo insuficiente para continuar jugando. El programa se cerrará.\n"));
      process.exit(0);
    }

    const { respuesta } = await inquirer.prompt([
      {
        type: "list",
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