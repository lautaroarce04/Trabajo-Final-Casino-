import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";
import inquirer from "inquirer";

export class RuletaSimple extends JuegoBase {
  private rojo = new Set([
    1, 3, 5, 7, 9, 12, 14, 16, 18,
    19, 21, 23, 25, 27, 30, 32, 34, 36,
  ]);
  private negro = new Set([
    2, 4, 6, 8, 10, 11, 13, 15, 17,
    20, 22, 24, 26, 28, 29, 31, 33, 35,
  ]);

  constructor() {
    super("Ruleta", 200);
  }

  private colorNumero(n: number): string {
    if (n === 0) return chalk.black.bgGreen("  0 ");
    if (this.rojo.has(n)) return chalk.white.bgRed(n.toString().padStart(2, " ") + " ");
    if (this.negro.has(n)) return chalk.white.bgBlack(n.toString().padStart(2, " ") + " ");
    return n.toString();
  }

  private mostrarTabla(): void {
    console.log(chalk.yellow("══════════════════════════════════════"));
    console.log(chalk.yellow("🎰 Tablero de ruleta – 🎰"));
    console.log(chalk.yellow("══════════════════════════════════════"));
    console.log(" ".repeat(16) + this.colorNumero(0));
    console.log();

    for (let fila = 0; fila < 3; fila++) {
      let linea = "";
      for (let col = 0; col < 12; col++) {
        const num = col * 3 + (3 - fila);
        linea += this.colorNumero(num) + " ";
      }
      console.log(linea);
    }
    console.log(chalk.yellow("══════════════════════════════════════\n"));
  }

  private obtenerColorDelNumero(n: number): string {
    if (n === 0) return "verde";
    if (this.rojo.has(n)) return "rojo";
    if (this.negro.has(n)) return "negro";
    return "desconocido";
  }

  async jugar(saldo: number): Promise<number> {
    this.validarApuesta(saldo);

    console.log(chalk.blueBright(`\n🎲 Saldo actual: $${saldo}\n`));

    // Preguntar tipo de apuesta con menú interactivo
    const { modo } = await inquirer.prompt([
      {
        type: "list",
        name: "modo",
        message: "¿Qué tipo de apuesta querés hacer?",
        choices: [
          { name: "Apostar solo a números (mínimo $200)", value: 1 },
          { name: "Apostar solo a color (apuesta fija $500)", value: 2 },
          { name: "Apostar a ambas (número + color) (mínimo $700)", value: 3 },
        ],
      },
    ]);

    let montoApostar: number;
    if (modo === 1) {
      // Apostar solo a números
      while (true) {
        const { monto } = await inquirer.prompt([
          {
            type: "input",
            name: "monto",
            message: "Ingresá monto a apostar (mínimo $200):",
            validate(input) {
              const val = parseInt(input);
              if (isNaN(val)) return "Debes ingresar un número válido.";
              if (val < 200) return "El monto mínimo es $200.";
              if (val > saldo) return `No tienes suficiente saldo ($${saldo}).`;
              return true;
            },
          },
        ]);
        montoApostar = parseInt(monto);
        if (montoApostar >= 200 && montoApostar <= saldo) break;
      }
    } else if (modo === 2) {
      // Apostar solo a color (fijo 500)
      montoApostar = 500;
      if (saldo < montoApostar) {
        console.log(chalk.red(`\n❌ Necesitás al menos $500 para apostar solo a color.\n`));
        return 0;
      }
      console.log(chalk.green(`\nVas a apostar $500 solo a color.\n`));
    } else {
      // Apostar a ambas (mínimo 700)
      while (true) {
        const { monto } = await inquirer.prompt([
          {
            type: "input",
            name: "monto",
            message: "Ingresá monto a apostar (mínimo $700):",
            validate(input) {
              const val = parseInt(input);
              if (isNaN(val)) return "Debes ingresar un número válido.";
              if (val < 700) return "El monto mínimo es $700.";
              if (val > saldo) return `No tienes suficiente saldo ($${saldo}).`;
              return true;
            },
          },
        ]);
        montoApostar = parseInt(monto);
        if (montoApostar >= 700 && montoApostar <= saldo) break;
      }
    }

    let apuestaPorNumero = 0;
    let numerosElegidos: number[] = [];
    let colorElegido: string | null = null;

    if (modo === 1) {
      this.mostrarTabla();

      const opciones = [10, 20, 50, 100, 200];
      while (true) {
        const { apuesta } = await inquirer.prompt([
          {
            type: "list",
            name: "apuesta",
            message: `¿Cuánto querés apostar por número?`,
            choices: opciones.map((o) => o.toString()),
          },
        ]);
        apuestaPorNumero = parseInt(apuesta);
        if (apuestaPorNumero <= montoApostar) break;
        console.log(chalk.red("No podés apostar más que el monto total.\n"));
      }

      const maxNumeros = Math.floor(montoApostar / apuestaPorNumero);
      while (true) {
        const { numeros } = await inquirer.prompt([
          {
            type: "input",
            name: "numeros",
            message: `Elegí hasta ${maxNumeros} número(s) del 0 al 36 (separados por coma):`,
            validate(input) {
              const nums = input
                .split(",")
                .map((n) => parseInt(n.trim()))
                .filter((n) => !isNaN(n) && n >= 0 && n <= 36);
              const setNums = new Set(nums);
              if (nums.length === 0) return "Debes ingresar al menos un número válido.";
              if (setNums.size !== nums.length) return "No se permiten números repetidos.";
              if (nums.length > maxNumeros)
                return `No podés elegir más de ${maxNumeros} números.`;
              return true;
            },
          },
        ]);
        numerosElegidos = numeros
          .split(",")
          .map((n: string) => parseInt(n.trim()))
          .filter((n: number) => !isNaN(n) && n >= 0 && n <= 36);
        if (numerosElegidos.length > 0) break;
      }
    } else if (modo === 2) {
      const { color } = await inquirer.prompt([
        {
          type: "list",
          name: "color",
          message: "¿A qué color querés apostar?",
          choices: ["rojo", "negro"],  // Aquí sin verde
        },
      ]);
      colorElegido = color;
    } else {
      // modo 3: ambas
      this.mostrarTabla();

      // Primero monto para números
      const montoParaNumeros = montoApostar - 500;
      const opciones = [10, 20, 50, 100, 200];
      while (true) {
        const { apuesta } = await inquirer.prompt([
          {
            type: "list",
            name: "apuesta",
            message: `¿Cuánto querés apostar por número?`,
            choices: opciones.map((o) => o.toString()),
          },
        ]);
        apuestaPorNumero = parseInt(apuesta);
        if (apuestaPorNumero <= montoParaNumeros) break;
        console.log(chalk.red("No podés apostar más que el monto destinado a números.\n"));
      }

      const maxNumeros = Math.floor(montoParaNumeros / apuestaPorNumero);
      while (true) {
        const { numeros } = await inquirer.prompt([
          {
            type: "input",
            name: "numeros",
            message: `Elegí hasta ${maxNumeros} número(s) del 0 al 36 (separados por coma):`,
            validate(input) {
              const nums = input
                .split(",")
                .map((n) => parseInt(n.trim()))
                .filter((n) => !isNaN(n) && n >= 0 && n <= 36);
              const setNums = new Set(nums);
              if (nums.length === 0) return "Debes ingresar al menos un número válido.";
              if (setNums.size !== nums.length) return "No se permiten números repetidos.";
              if (nums.length > maxNumeros)
                return `No podés elegir más de ${maxNumeros} números.`;
              return true;
            },
          },
        ]);
        numerosElegidos = numeros
          .split(",")
          .map((n: string) => parseInt(n.trim()))
          .filter((n: number) => !isNaN(n) && n >= 0 && n <= 36);
        if (numerosElegidos.length > 0) break;
      }

      const { color } = await inquirer.prompt([
        {
          type: "list",
          name: "color",
          message: "¿A qué color querés apostar?",
          choices: ["rojo", "negro"],  // Aquí sin verde
        },
      ]);
      colorElegido = color;
    }

    // Tirar ruleta
    const numeroSalio = Math.floor(Math.random() * 37);
    const colorSalio = this.obtenerColorDelNumero(numeroSalio);

    this.mostrarTabla();
    console.log(`Salió el número: ${chalk.bold(numeroSalio)} (${colorSalio})\n`);

    let ganancia = 0;

    if (numerosElegidos.length && numerosElegidos.includes(numeroSalio)) {
      const premio = apuestaPorNumero * 36;
      console.log(chalk.green(`¡Adivinaste el número! Ganás ${premio}`));
      ganancia += premio;
    }

    if (colorElegido && colorElegido === colorSalio) {
      console.log(chalk.green(`¡Adivinaste el color! Ganás 500`));
      ganancia += 500;
    }

    if (ganancia === 0) console.log(chalk.red("No ganaste esta vez 😢"));

    return ganancia;
  }
}