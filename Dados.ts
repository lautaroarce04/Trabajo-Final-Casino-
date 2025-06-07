import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";
import promptSync from "prompt-sync";

const prompt = promptSync();

export class Dados extends JuegoBase {
  constructor() {
    super("Dados", 2);
  }

  jugar(apuesta: number): number {
    try {
      this.validarApuesta(apuesta);

      const numeroStr = prompt("Elegí un número del 2 al 12: ")!;
      const numero = parseInt(numeroStr);

      if (!Number.isInteger(numero) || numero < 2 || numero > 12) {
        throw new Error("Número inválido. Debe ser un entero entre 2 y 12.");
      }

      const dado1 = Math.floor(Math.random() * 6) + 1;
      const dado2 = Math.floor(Math.random() * 6) + 1;
      const suma = dado1 + dado2;

      console.log(chalk.blue("🎲 Lanzando dados..."));
      console.log(chalk.blue(`Dado 1: [${dado1}]`));
      console.log(chalk.blue(`Dado 2: [${dado2}]`));
      console.log(chalk.white(`Suma: ${suma}`));

      if (suma === numero) {
        console.log(chalk.green("¡Acertaste el número! Ganás 6x la apuesta 🎉"));
        return apuesta * 6;
      } else if (suma === 7 || suma === 11) {
        console.log(chalk.green("¡Ganaste! Suma mágica 🎉"));
        return apuesta * 5;
      } else {
        console.log(chalk.red("No ganaste, suerte la próxima."));
        return 0;
      }

    } catch (error) {
      // Muestra solo el mensaje, no la stack trace
      console.log(chalk.red("Error en Dados: "), (error as Error).message);
      return 0;
    }
  }
}