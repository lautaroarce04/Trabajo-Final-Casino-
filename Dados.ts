import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";

export class Dados extends JuegoBase {
  constructor() {
    super("Dados", 5);
  }

  jugar(apuesta: number): number {
    try {
      this.validarApuesta(apuesta);

      const dado1 = Math.floor(Math.random() * 6) + 1;
      const dado2 = Math.floor(Math.random() * 6) + 1;
      const suma = dado1 + dado2;

      console.log(chalk.blue("🎲 Lanzando dados..."));
      console.log(chalk.blue(`Dado 1: [${dado1}]`));
      console.log(chalk.blue(`Dado 2: [${dado2}]`));
      console.log(chalk.white(`Suma: ${suma}`));

      if (suma === 7 || suma === 11) {
        console.log(chalk.green("¡Ganaste! Suma mágica 🎉"));
        return apuesta * 5;
      } else {
        console.log(chalk.red("No ganaste, suerte la próxima."));
        return 0;
      }

    } catch (error) {
      console.log(chalk.red("Error en Dados: "), (error as Error).message);
      return 0;
    }
  }
}