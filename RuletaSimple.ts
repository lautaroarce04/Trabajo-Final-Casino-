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

  private colorNumero(n: number | string): string {
    if (n === 0) return chalk.black.bgGreen("  0 ");
    if (n === "00") return chalk.black.bgGreen(" 00 ");
    if (this.rojo.has(Number(n))) return chalk.white.bgRed(n.toString().padStart(2, " ") + " ");
    if (this.negro.has(Number(n))) return chalk.white.bgBlack(n.toString().padStart(2, " ") + " ");
    return n.toString();
  }

  private mostrarTabla(): void {
    console.log(chalk.yellow("══════════════════════════════════════"));
    console.log(chalk.yellow("🎰 Tablero de ruleta – 🎰"));
    console.log(chalk.yellow("══════════════════════════════════════"));
    console.log(" ".repeat(13) + this.colorNumero(0) + "   " + this.colorNumero("00"));
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

  private obtenerColorDelNumero(n: number | string): string {
    if (n === 0 || n === "00") return "verde";
    if (this.rojo.has(Number(n))) return "rojo";
    if (this.negro.has(Number(n))) return "negro";
    return "desconocido";
  }

  async jugar(saldo: number): Promise<number> {
    this.validarApuesta(saldo);

    // Mostrar selección del juego y tablero aquí
    console.log(chalk.greenBright(`\n🎮 Has seleccionado el juego: ${this.nombre}\n`));
    this.mostrarTabla();

    console.log(chalk.magenta("═".repeat(50)));
    console.log(chalk.green(`💰 Saldo actual: $${saldo}`));
    console.log(chalk.magenta("═".repeat(50)));

    const { modo } = await inquirer.prompt([
      {
        type: "list",
        name: "modo",
        message: "¿Qué tipo de apuesta querés hacer?",
        choices: [
          { name: "Apostar solo a números (mínimo $200)", value: 1 },
          { name: "Apostar solo a color (mínimo $500)", value: 2 },
          { name: "Apostar a ambas (número + color) (mínimo $700)", value: 3 },
        ],
      },
    ]);

    let montoApostar = 0;
    let apuestaPorNumero = 0;
    let numerosElegidos: (number | string)[] = [];
    let colorElegido: string | null = null;
    let montoColor = 0;

    if (modo === 1) {
      montoApostar = await this.obtenerMonto(200, saldo, "número");
      await this.procesoNumeros(montoApostar, numerosElegidos, (val) => (apuestaPorNumero = val));
    } else if (modo === 2) {
      montoApostar = await this.obtenerMonto(500, saldo, "color");
      montoColor = montoApostar;
      const { color } = await inquirer.prompt([
        {
          type: "list",
          name: "color",
          message: "¿A qué color querés apostar?",
          choices: ["rojo", "negro"],
        },
      ]);
      colorElegido = color;
    } else {
      montoApostar = await this.obtenerMonto(700, saldo, "ambos");
      const { orden } = await inquirer.prompt([
        {
          type: "list",
          name: "orden",
          message: "¿Querés apostar primero al color o a los números?",
          choices: ["color", "número"],
        },
      ]);

      let restante = montoApostar;

      if (orden === "color") {
        const { monto } = await inquirer.prompt([
          {
            type: "input",
            name: "monto",
            message: "¿Cuánto querés apostar al color? (mínimo $500):",
            validate(input) {
              const val = parseInt(input);
              if (isNaN(val)) return "Número inválido";
              if (val < 500) return "Mínimo $500 para color";
              if (val > restante) return "No te alcanza con el saldo destinado";
              return true;
            },
          },
        ]);
        montoColor = parseInt(monto);
        restante -= montoColor;

        const { color } = await inquirer.prompt([
          {
            type: "list",
            name: "color",
            message: "¿A qué color querés apostar?",
            choices: ["rojo", "negro"],
          },
        ]);
        colorElegido = color;

        if (restante < 200) {
          console.log(chalk.red("No te alcanza para apostar a números, se usará solo color."));
          montoApostar = montoColor;
        } else {
          await this.procesoNumeros(restante, numerosElegidos, (val) => (apuestaPorNumero = val));
        }
      } else {
        await this.procesoNumeros(restante, numerosElegidos, (val) => (apuestaPorNumero = val));
        restante = montoApostar - apuestaPorNumero * numerosElegidos.length;

        if (restante < 500) {
          console.log(chalk.red("No te alcanza para apostar a color, se usará solo números."));
        } else {
          const { color } = await inquirer.prompt([
            {
              type: "list",
              name: "color",
              message: "¿A qué color querés apostar?",
              choices: ["rojo", "negro"],
            },
          ]);
          colorElegido = color;
          montoColor = 500;
        }
      }
    }

    const posibles = [...Array(37).keys(), "00"];
    const numeroSalio = await this.animarRuleta(posibles);
    const colorSalio = this.obtenerColorDelNumero(numeroSalio);

    let ganancia = 0;

    if (numerosElegidos.includes(numeroSalio)) {
      const premio = apuestaPorNumero * 36;
      console.log(chalk.green(`¡Adivinaste el número! Ganaste $${premio}`));
      ganancia += premio;
    }

    if (colorElegido && colorElegido === colorSalio) {
      const premioColor = montoColor * 2;
      console.log(chalk.green(`¡Adivinaste el color! Ganaste $${premioColor}`));
      ganancia += premioColor;
    }

    if (ganancia === 0) console.log(chalk.red("No ganaste esta vez 😢"));
    return ganancia - montoApostar;
  }

  private async obtenerMonto(minimo: number, saldo: number, tipo: string): Promise<number> {
    while (true) {
      const { monto } = await inquirer.prompt([
        {
          type: "input",
          name: "monto",
          message: `Ingresá el monto a apostar (mínimo $${minimo} para ${tipo}):`,
          validate(input) {
            const val = parseInt(input);
            if (isNaN(val)) return "Debes ingresar un número válido.";
            if (val < minimo) return `El monto mínimo es $${minimo}.`;
            if (val > saldo) return `No tenés suficiente saldo ($${saldo}).`;
            return true;
          },
        },
      ]);
      return parseInt(monto);
    }
  }

  private async procesoNumeros(monto: number, numeros: (number | string)[], setApuesta: (val: number) => void) {
    this.mostrarTabla();
    const opciones = [10, 20, 50, 100, 200];
    const { apuesta: apuestaInput } = await inquirer.prompt([
      {
        type: "list",
        name: "apuesta",
        message: `¿Cuánto querés apostar por número?`,
        choices: opciones.map((o) => o.toString()),
      },
    ]);
    const apuesta = parseInt(apuestaInput);
    setApuesta(apuesta);
    const maxNumeros = Math.floor(monto / apuesta);

    const { numeros: numerosInput } = await inquirer.prompt([
      {
        type: "input",
        name: "numeros",
        message: `Elegí hasta ${maxNumeros} número(s) del 0 al 36 y/o 00 (separados por coma):`,
        validate(input) {
          const items = input.split(",").map((n) => n.trim());
          const nums = items.map((n) => (n === "00" ? "00" : parseInt(n))).filter(
            (n) => n === "00" || (!isNaN(n) && n >= 0 && n <= 36)
          );
          const setNums = new Set(nums);
          if (nums.length === 0) return "Debes ingresar al menos un número válido.";
          if (setNums.size !== nums.length) return "No se permiten números repetidos.";
          if (nums.length > maxNumeros) return `No podés elegir más de ${maxNumeros} números.`;
          return true;
        },
      },
    ]);

    const lista = numerosInput.split(",").map((n: string) => (n.trim() === "00" ? "00" : parseInt(n.trim())));
    numeros.length = 0;
    numeros.push(...lista);
  }

 private async animarRuleta(posibles: (number | string)[]): Promise<number | string> {
  process.stdout.write(chalk.cyanBright("\n🎡 Girando ruleta...\n\n"));
  let resultadoReal: number | string = posibles[Math.floor(Math.random() * posibles.length)];

  for (let i = 0; i < 20; i++) {
    const aleatorio = posibles[Math.floor(Math.random() * posibles.length)];
    const colorNum = this.colorNumero(aleatorio).trim(); // 
    // Escribir en la misma línea reemplazando a otros numeros
    process.stdout.write(`\r${colorNum}    `); // 
    await new Promise((r) => setTimeout(r, 100));
  }

  const colorFinal = this.obtenerColorDelNumero(resultadoReal);
  process.stdout.write(`\r🎯 Resultado final: ${this.colorNumero(resultadoReal)} (${colorFinal})\n\n`);
  return resultadoReal;
}
}