import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";

// Archivo de saldo
const archivo = "saldo.txt";
let saldo = fs.existsSync(archivo)
  ? parseFloat(fs.readFileSync(archivo, "utf-8"))
  : 100;

export class TragamonedasSimple extends JuegoBase {
  private simbolos: string[];

  constructor() {
    super("Tragamonedas Simple", 10);
    this.simbolos = ["🍒", "🍋", "🍉", "⭐", "7️⃣", "🔔"];
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

      await new Promise(resolve => setTimeout(resolve, 100 + i * 10));
    }
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

    await this.animarGiro();

    const resultado: string[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * this.simbolos.length);
      resultado.push(this.simbolos[idx]);
    }

    const tiradaFinal = resultado.map(s => chalk.bold.yellow(s)).join("  ");

    console.clear();
    console.log(chalk.blueBright("╔═══════════════════════════════════╗"));
    console.log(chalk.blueBright("║") + chalk.bold("     🎰 TRAGAMONEDAS SIMPLE 🎰     ") + chalk.blueBright("║"));
    console.log(chalk.blueBright("╠═══════════════════════════════════╣"));
    console.log(chalk.blueBright("║") + "                                 " + chalk.blueBright("║"));
    console.log(chalk.blueBright("║") + "        " + tiradaFinal + "        " + chalk.blueBright("║"));
    console.log(chalk.blueBright("║") + "                                 " + chalk.blueBright("║"));
    console.log(chalk.blueBright("╚═══════════════════════════════════╝\n"));

    const iguales = resultado.every((val) => val === resultado[0]);

    let ganancia = 0;

    if (iguales) {
      ganancia = apuesta * 5;
      console.log(chalk.greenBright(`¡Bien! 3 iguales → Ganaste $${ganancia} 🎉`));
    } else {
      console.log(chalk.red("No hubo suerte esta vez 💸"));
    }

    saldo += ganancia;
    fs.writeFileSync(archivo, saldo.toString());

    return ganancia;
  }
}