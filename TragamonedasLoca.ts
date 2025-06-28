import { Tragamonedas } from "./Tragamonedas";
import chalk from "chalk";
import inquirer from "inquirer";

export class TragamonedasLoca extends Tragamonedas {
  constructor() {
    super("Tragamonedas Loca", 20);
  }

  private async animarGiro(): Promise<void> {
    for (let i = 0; i < 10; i++) {
      const tirada = Array.from({ length: 5 }, () =>
        chalk.magentaBright(this.simbolos[Math.floor(Math.random() * this.simbolos.length)])
      ).join("  ");

      console.clear();
      console.log(chalk.cyanBright("╔════════════════════════════════════════════════╗"));
      console.log(chalk.cyanBright("║") + chalk.bold.yellow("        🤪 TRAGAMONEDAS LOCA 🤪         ") + chalk.cyanBright("║"));
      console.log(chalk.cyanBright("╠════════════════════════════════════════════════╣"));
      console.log(chalk.cyanBright("║") + "                                              " + chalk.cyanBright("║"));
      console.log(chalk.cyanBright("║") + "      " + tirada + "      " + chalk.cyanBright("║"));
      console.log(chalk.cyanBright("║") + "                                              " + chalk.cyanBright("║"));
      console.log(chalk.cyanBright("╚════════════════════════════════════════════════╝\n"));

      await new Promise(resolve => setTimeout(resolve, 100 + i * 10));
    }
  }

  async jugar(saldoActual: number): Promise<number> {
    const apuesta = await this.pedirApuesta(saldoActual); // heredado

    await this.animarGiro();

    const tirada: string[] = this.generarTirada(5); // heredado

    const resultado = tirada.map(s => chalk.bold.magenta(s)).join("  ");

    console.clear();
    console.log(chalk.cyanBright("╔════════════════════════════════════════════════╗"));
    console.log(chalk.cyanBright("║") + chalk.bold.yellow("        🤪 TRAGAMONEDAS LOCA 🤪         ") + chalk.cyanBright("║"));
    console.log(chalk.cyanBright("╠════════════════════════════════════════════════╣"));
    console.log(chalk.cyanBright("║") + "                                              " + chalk.cyanBright("║"));
    console.log(chalk.cyanBright("║") + "      " + resultado + "      " + chalk.cyanBright("║"));
    console.log(chalk.cyanBright("║") + "                                              " + chalk.cyanBright("║"));
    console.log(chalk.cyanBright("╚════════════════════════════════════════════════╝\n"));

    const contador: Record<string, number> = {};
    for (const simbolo of tirada) {
      contador[simbolo] = (contador[simbolo] || 0) + 1;
    }

    const cantidades = Object.values(contador).sort((a, b) => b - a);
    const maxIguales = cantidades[0];
    let gananciaNeta = 0;

    const multiplicadores = {
      cincoIguales: 20,
      cuatroIguales: 5,
      tresIguales: 2
    };

    if (maxIguales === 5) {
      gananciaNeta = apuesta * multiplicadores.cincoIguales - apuesta;
      console.log(chalk.greenBright("¡FOA! 5 símbolos iguales → 20x tu apuesta 🎆"));
    } else if (maxIguales === 4) {
      gananciaNeta = apuesta * multiplicadores.cuatroIguales - apuesta;
      console.log(chalk.green("¡Que capo! 4 iguales → 5x tu apuesta 🎉"));
    } else if (maxIguales === 3) {
      gananciaNeta = apuesta * multiplicadores.tresIguales - apuesta;
      console.log(chalk.green("¡Ni tan mal! 3 iguales → 2x tu apuesta"));
    } else {
      gananciaNeta = -apuesta;
      console.log(chalk.red("Uh qué lástima... seguí intentando 💸"));
    }

    return gananciaNeta;
  }
}