import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";
import inquirer from "inquirer";

export class Dados extends JuegoBase {
  constructor() {
    super("Dados", 100);
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

  async jugar(saldoActual: number): Promise<number> {
    console.clear();
    console.log(chalk.magenta("═".repeat(50)));
    console.log(chalk.green(`💰 Saldo actual: $${saldoActual}`));
    console.log(chalk.magenta("═".repeat(50)));

    const { apuestaStr } = await inquirer.prompt([
      {
        type: "input",
        name: "apuestaStr",
        message: chalk.cyan("? 💸 Ingrese monto a apostar (mínimo $100):"),
        validate: (input: string) => {
          const n = Number(input);
          if (isNaN(n)) return "Debe ingresar un número válido";
          if (n < this.apuestaMinima) return `La apuesta mínima es $${this.apuestaMinima}`;
          if (n > saldoActual) return `Saldo insuficiente (actual: $${saldoActual})`;
          return true;
        },
      },
    ]);

    const apuesta = Number(apuestaStr);

    try {
      for (let i = 0; i < 10; i++) {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;

        const dado1 = this.dadoASCII(d1);
        const dado2 = this.dadoASCII(d2);

        this.limpiarPantalla();
        console.log(chalk.blue("🎲 Tirando los dados...\n"));

        for (let j = 0; j < dado1.length; j++) {
          console.log(
            chalk.red(dado1[j].replace(/●/g, chalk.white("●"))) +
              "  " +
              chalk.red(dado2[j].replace(/●/g, chalk.white("●")))
          );
        }

        await this.sleep(200);
      }

      const dado1Final = Math.floor(Math.random() * 6) + 1;
      const dado2Final = Math.floor(Math.random() * 6) + 1;
      const suma = dado1Final + dado2Final;

      const final1 = this.dadoASCII(dado1Final);
      const final2 = this.dadoASCII(dado2Final);

      this.limpiarPantalla();
      console.log(chalk.blue("🎲 Resultado final:\n"));

      for (let i = 0; i < final1.length; i++) {
        console.log(
          chalk.red(final1[i].replace(/●/g, chalk.white("●"))) +
            "  " +
            chalk.red(final2[i].replace(/●/g, chalk.white("●")))
        );
      }

      console.log(chalk.white(`Suma: ${suma}`));

      let gananciaNeta = -apuesta; // si no gana, pierde la apuesta

      if (suma === 7 || suma === 11) {
        gananciaNeta = apuesta * 5 - apuesta; // premio menos la apuesta inicial
        console.log(chalk.green(`🎉 ¡Ganaste! +$${apuesta * 5}`));
      } else {
        console.log(chalk.red("❌ No ganaste esta vez."));
      }

      return gananciaNeta;
    } catch (error) {
      console.log(chalk.red("❌ Error en Dados: "), (error as Error).message);
      return 0; // En caso de error no afectamos saldo
    }
  }
}