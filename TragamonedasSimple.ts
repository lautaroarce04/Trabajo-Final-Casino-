import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";
import inquirer from "inquirer";

export class TragamonedasSimple extends JuegoBase {
  private simbolos = ["🍒", "🍋", "🍉", "⭐", "7️⃣", "🔔"];

  constructor() {
    super("Tragamonedas Simple", 10);
  }

  private async animarGiro(): Promise<void> {
    for (let i = 0; i < 10; i++) {
      const giro = Array.from({ length: 3 }, () =>
        chalk.yellowBright(this.simbolos[Math.floor(Math.random() * this.simbolos.length)])
      ).join("  ");
      console.clear();
      console.log(chalk.blueBright("╔═══════════════════════════════════╗"));
      console.log(chalk.blueBright("║") + chalk.bold("     🎰 TRAGAMONEDAS SIMPLE 🎰     ") + chalk.blueBright("║"));
      console.log(chalk.blueBright("╠═══════════════════════════════════╣"));
      console.log(chalk.blueBright("║") + "                                 " + chalk.blueBright("║"));
      console.log(chalk.blueBright("║") + "        " + giro + "        " + chalk.blueBright("║"));
      console.log(chalk.blueBright("║") + "                                 " + chalk.blueBright("║"));
      console.log(chalk.blueBright("╚═══════════════════════════════════╝\n"));
      await new Promise((resolve) => setTimeout(resolve, 100 + i * 10));
    }
  }

  async jugar(saldoActual: number): Promise<number> {
    console.log(chalk.green(`💰 Saldo actual: $${saldoActual}`));
    console.log(chalk.magenta("═".repeat(50)));

    const { apuestaStr } = await inquirer.prompt([
      {
        type: "input",
        name: "apuestaStr",
        message: chalk.cyan(`? 💸 Ingrese monto a apostar (mínimo $${this.apuestaMinima}):`),
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

    await this.animarGiro();

    const resultado = Array.from({ length: 3 }, () =>
      this.simbolos[Math.floor(Math.random() * this.simbolos.length)]
    );
    const tiradaFinal = resultado.map((s) => chalk.bold.yellow(s)).join("  ");

    console.clear();
    console.log(chalk.blueBright("╔═══════════════════════════════════╗"));
    console.log(chalk.blueBright("║") + chalk.bold("     🎰 TRAGAMONEDAS SIMPLE 🎰     ") + chalk.blueBright("║"));
    console.log(chalk.blueBright("╠═══════════════════════════════════╣"));
    console.log(chalk.blueBright("║") + "                                 " + chalk.blueBright("║"));
    console.log(chalk.blueBright("║") + "        " + tiradaFinal + "        " + chalk.blueBright("║"));
    console.log(chalk.blueBright("║") + "                                 " + chalk.blueBright("║"));
    console.log(chalk.blueBright("╚═══════════════════════════════════╝\n"));

    const iguales = resultado.every((val) => val === resultado[0]);
    let gananciaNeta = 0;

    if (iguales) {
      // Ganancia neta = premio - apuesta
      gananciaNeta = apuesta * 5 - apuesta;
      console.log(chalk.greenBright(`¡Bien! 3 iguales → Ganaste $${apuesta * 5} 🎉`));
    } else {
      // Perdiste la apuesta completa
      gananciaNeta = -apuesta;
      console.log(chalk.red("No hubo suerte esta vez 💸"));
    }

    return gananciaNeta;
  }
}
