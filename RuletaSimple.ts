import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";
import promptSync from "prompt-sync";

const prompt = promptSync();

export class RuletaSimple extends JuegoBase {
  constructor() {
    super("Ruleta", 5);
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

  jugar(apuesta: number): number {
    this.validarApuesta(apuesta);

    this.mostrarTabla();

    const numeroStr = prompt("Elegi un numero del 0 al 36: ");
    const numero = parseInt(numeroStr);

    if (!Number.isInteger(numero) || numero < 0 || numero > 36) {
      throw new Error("Número inválido. Debe ser un entero entre 0 y 36.");
    }

    const numeroSalio = Math.floor(Math.random() * 37);

    console.log(`\nSalió el número: ${chalk.bold(numeroSalio)}\n`);

    if (numero === numeroSalio) {
      console.log(chalk.green("¡Ganaste 36x tu apuesta! 🎉"));
      return apuesta * 36;
    } else {
      console.log(chalk.red("No acertaste. 😢"));
      return 0;
    }
  }
}