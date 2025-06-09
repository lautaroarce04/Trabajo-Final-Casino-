import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";

export class TragamonedasSimple extends JuegoBase {
  private simbolos: string[];

  constructor() {
    super("Tragamonedas Simple", 5);
    this.simbolos = ["🍒", "🍋", "🍉", "⭐", "7️⃣"];
  }

  jugar(apuesta: number): number {
    this.validarApuesta(apuesta);

    if (this.simbolos.length < 1) {
      throw new Error("No hay símbolos definidos.");
    }

    // Tirada: sacar 3 símbolos aleatorios
    let tirada: string[] = [];
    for (let i = 0; i < 3; i++) {
      let idx = Math.floor(Math.random() * this.simbolos.length);
      tirada.push(this.simbolos[idx]);
    }

    // Mostrar tirada con diseño
    console.log(chalk.yellow("╔══════════════════════════╗"));
    console.log(chalk.yellow("║ 🎰TRAGAMONEDAS SIMPLE🎰  ║"));
    console.log(chalk.yellow("╚══════════════════════════╝"));
    console.log("Tirada: " + tirada.map(s => chalk.red.bold(s)).join(" | "));
    console.log();

    // Evaluar ganancia: si 3 iguales gana 10x apuesta, si 2 iguales gana 2x, sino pierde
    let unique = new Set(tirada);
    let ganancia = 0;
    if (unique.size === 1) {
      ganancia = apuesta * 10;
      console.log(chalk.green("¡3 iguales! Ganaste 10x tu apuesta 🎉"));
    } else if (unique.size === 2) {
      ganancia = apuesta * 2;
      console.log(chalk.green("¡2 iguales! Ganaste 2x tu apuesta 🎉"));
    } else {
      console.log(chalk.red("No ganaste, suerte la próxima."));
    }

    return ganancia;
  }
}