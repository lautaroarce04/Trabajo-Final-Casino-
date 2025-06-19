import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";

// Archivo de saldo
const archivo = "saldo.txt";
let saldo = fs.existsSync(archivo)
  ? parseFloat(fs.readFileSync(archivo, "utf-8"))
  : 100;

export class Dados extends JuegoBase {
  constructor() {
    super("Dados", 100); // apuesta mínima de $100
  }

  private dadoASCII(numero: number): string[] {
    const caras: { [key: string]: string[] } = {
      "1": ["┌─────┐", "│     │", "│  ●  │", "│     │", "└─────┘"],
      "2": ["┌─────┐", "│ ●   │", "│     │", "│   ● │", "└─────┘"],
      "3": ["┌─────┐", "│ ●   │", "│  ●  │", "│   ● │", "└─────┘"],
      "4": ["┌─────┐", "│ ● ● │", "│     │", "│ ● ● │", "└─────┘"],
      "5": ["┌─────┐", "│ ● ● │", "│  ●  │", "│ ● ● │", "└─────┘"],
      "6": ["┌─────┐", "│ ● ● │", "│ ● ● │", "│ ● ● │", "└─────┘"]
    };
    return caras[numero.toString()];
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private limpiarPantalla(): void {
    process.stdout.write("\x1Bc");
  }

  async jugar(_: number): Promise<number> {
    const { apuestaStr } = await inquirer.prompt([
      {
        type: "input",
        name: "apuestaStr",
        message: `💸 Ingrese monto a apostar (mínimo $${this.apuestaMinima}):`,
        validate: (input: string) => {
          const n = Number(input);
          if (isNaN(n)) return "Debe ingresar un número válido";
          if (n < this.apuestaMinima) return `La apuesta mínima es $${this.apuestaMinima}`;
          if (n > saldo) return `Saldo insuficiente (actual: $${saldo})`;
          return true;
        },
      },
    ]);

    const apuesta = Number(apuestaStr);
    saldo -= apuesta;

    try {
      console.log(chalk.blue("\n🎲 Tirando los dados..."));

      for (let i = 0; i < 10; i++) {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;

        const dado1 = this.dadoASCII(d1);
        const dado2 = this.dadoASCII(d2);

        this.limpiarPantalla();
        console.log(chalk.blue("🎲 Tirando los dados...\n"));

        for (let j = 0; j < dado1.length; j++) {
          const linea1 = dado1[j].replace(/●/g, chalk.white("●"));
          const linea2 = dado2[j].replace(/●/g, chalk.white("●"));
          console.log(chalk.red(linea1 + "  " + linea2));
        }

        await this.sleep(200); // mientras mas grande el numero ms lenta la animacion
      }

      // Resultado final
      const dado1Final = Math.floor(Math.random() * 6) + 1;
      const dado2Final = Math.floor(Math.random() * 6) + 1;
      const suma = dado1Final + dado2Final;

      const final1 = this.dadoASCII(dado1Final);
      const final2 = this.dadoASCII(dado2Final);

      this.limpiarPantalla();
      console.log(chalk.blue("🎲 Resultado final:\n"));

      for (let i = 0; i < final1.length; i++) {
        const l1 = final1[i].replace(/●/g, chalk.white("●"));
        const l2 = final2[i].replace(/●/g, chalk.white("●"));
        console.log(chalk.red(l1 + "  " + l2));
      }

      console.log(chalk.white(`Suma: ${suma}`));

      let ganancia = 0;
      if (suma === 7 || suma === 11) {
        ganancia = apuesta * 5;
        console.log(chalk.green(`¡Ganaste! 🎉 Ganás $${ganancia}`));
        saldo += ganancia;
      } else {
        console.log(chalk.red("No ganaste (hay que sacar 7 u 11), suerte la próxima."));
      }

      fs.writeFileSync(archivo, saldo.toString());
      return ganancia;

    } catch (error) {
      console.log(chalk.red("❌ Error en Dados: "), (error as Error).message);
      saldo += apuesta; // Reembolso si hubo error
      return 0;
    }
  }
}
