import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";
import promptSync from "prompt-sync";

const prompt = promptSync();

export class RuletaSimple extends JuegoBase {
  constructor() {
    super("Ruleta", 200);
  }

  private mostrarTabla(): void {
    let rojo = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
    let negro = new Set([2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]);

    let colorNumero = (n: number): string => {
      if (n === 0) return chalk.black.bgGreen("  0 ");
      if (rojo.has(n)) return chalk.white.bgRed(n.toString().padStart(2, " ") + " ");
      if (negro.has(n)) return chalk.white.bgBlack(n.toString().padStart(2, " ") + " ");
      return n.toString();
    };

    console.log(chalk.yellow("══════════════════════════════════════"));
    console.log(chalk.yellow("🎰 Tablero de ruleta – 🎰"));
    console.log(chalk.yellow("══════════════════════════════════════"));
    console.log(" ".repeat(16) + colorNumero(0));
    console.log();

    for (let fila = 0; fila < 3; fila++) {
      let linea = "";
      for (let col = 0; col < 12; col++) {
        let num = col * 3 + (3 - fila);
        linea += colorNumero(num) + " ";
      }
      console.log(linea);
    }

    console.log(chalk.yellow("══════════════════════════════════════\n"));
  }

  jugar(apuestaTotal: number): number {
    this.validarApuesta(apuestaTotal);

    this.mostrarTabla();

    const opcionesApuesta = [10, 20, 50, 100, 200];

    // Preguntar apuesta por número y validar que sea opción válida y no mayor que el total
    let apuestaPorNumero: number;
    while (true) {
      const apuestaStr = prompt(`¿Cuánto querés apostar por número? Opciones: ${opcionesApuesta.join(", ")}: `);
      apuestaPorNumero = parseInt(apuestaStr);
      if (
        opcionesApuesta.includes(apuestaPorNumero) &&
        apuestaPorNumero <= apuestaTotal
      ) break;
      console.log(chalk.red(`Apuesta inválida. Debe ser una de las opciones y menor o igual a ${apuestaTotal}.`));
    }

    // Calcular máximo números que puede elegir
    const maxNumeros = Math.floor(apuestaTotal / apuestaPorNumero);

    // Preguntar números elegidos y validar
    let numerosElegidos: number[] = [];
    while (true) {
      const numerosStr = prompt(`Elegí hasta ${maxNumeros} número(s) del 0 al 36 (separados por coma): `);
      numerosElegidos = numerosStr
        .split(",")
        .map(n => parseInt(n.trim()))
        .filter(n => Number.isInteger(n) && n >= 0 && n <= 36);

      const numerosUnicos = new Set(numerosElegidos);

      if (numerosElegidos.length === 0) {
        console.log(chalk.red("Debes ingresar al menos un número válido."));
      } else if (numerosUnicos.size !== numerosElegidos.length) {
        console.log(chalk.red("No se permiten números repetidos."));
      } else if (numerosElegidos.length > maxNumeros) {
        console.log(chalk.red(`No podés elegir más de ${maxNumeros} números.`));
      } else {
        break;
      }
    }

    const numeroSalio = Math.floor(Math.random() * 37);

    console.log(`\nSalió el número: ${chalk.bold(numeroSalio)}\n`);

    if (numerosElegidos.includes(numeroSalio)) {
      // Ganancia = apuestaPorNumero * 36 por cada número acertado
      // Pero como el número salido es uno solo, se gana solo si coincide con uno elegido
      // Se gana 36 veces la apuesta por número, no importa cuantos números se eligieron
      const ganancia = apuestaPorNumero * 36;
      console.log(chalk.green(`¡Ganaste! 🎉 Ganás ${ganancia} (36x la apuesta por número).`));
      return ganancia;
    } else {
      console.log(chalk.red("No acertaste. 😢"));
      return 0;
    }
  }
}
