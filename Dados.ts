import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";

export class Dados extends JuegoBase {
  constructor() {
    super("Dados", 5);
  }

  private dadoASCII(numero: number): string[] {
    const caras: { [key: string]: string[] } = {
      "1": [
        "┌─────┐",
        "│     │",
        "│  ●  │",
        "│     │",
        "└─────┘"
      ],
      "2": [
        "┌─────┐",
        "│ ●   │",
        "│     │",
        "│   ● │",
        "└─────┘"
      ],
      "3": [
        "┌─────┐",
        "│ ●   │",
        "│  ●  │",
        "│   ● │",
        "└─────┘"
      ],
      "4": [
        "┌─────┐",
        "│ ● ● │",
        "│     │",
        "│ ● ● │",
        "└─────┘"
      ],
      "5": [
        "┌─────┐",
        "│ ● ● │",
        "│  ●  │",
        "│ ● ● │",
        "└─────┘"
      ],
      "6": [
        "┌─────┐",
        "│ ● ● │",
        "│ ● ● │",
        "│ ● ● │",
        "└─────┘"
      ]
    };
    return caras[numero.toString()];
  }

  jugar(apuesta: number): number {
    try {
      this.validarApuesta(apuesta);

      const dado1 = Math.floor(Math.random() * 6) + 1;
      const dado2 = Math.floor(Math.random() * 6) + 1;
      const suma = dado1 + dado2;

      console.log(chalk.blue("🎲 Lanzando dados..."));

      const dado1ASCII = this.dadoASCII(dado1);
      const dado2ASCII = this.dadoASCII(dado2);

      for (let i = 0; i < dado1ASCII.length; i++) {
        // Mostramos ambos dados lado a lado 
        const lineaDado1 = dado1ASCII[i].replace(/●/g, chalk.white("●"));
        const lineaDado2 = dado2ASCII[i].replace(/●/g, chalk.white("●"));
        console.log(chalk.red(lineaDado1 + "  " + lineaDado2));
      }

      console.log(chalk.white(`Suma: ${suma}`));

      if (suma === 7 || suma === 11) {
        console.log(chalk.green("¡Ganaste! Suma mágica 🎉"));
        return apuesta * 5;
      } else {
        console.log(chalk.red("No ganaste (hay que sacar entre 7 y 11), suerte la próxima."));
        return 0;
      }
    } catch (error) {
      console.log(chalk.red("Error en Dados: "), (error as Error).message);
      return 0;
    }
  }
}
