import { JuegoBase } from "./JuegoBase";
import chalk from "chalk";

export class TragamonedasLoca extends JuegoBase {
  private simbolos: string[];

  constructor() {
    super("Tragamonedas Loca", 2);
    this.simbolos = ["🍒", "🍋", "🍉", "⭐", "7️⃣", "💎", "🔥"];
  }

  jugar(apuesta: number): number {
    this.validarApuesta(apuesta);

    if (this.simbolos.length < 1) {
      throw new Error("No hay símbolos definidos.");
    }

    // Tirada: sacar 5 símbolos aleatorios
    let tirada: string[] = [];
    for (let i = 0; i < 5; i++) {
      let idx = Math.floor(Math.random() * this.simbolos.length);
      tirada.push(this.simbolos[idx]);
    }

    // Mostrar tirada con diseño tipo fila con colores
    console.log(chalk.magenta("╔═══════════════════════╗"));
    console.log(chalk.magenta("║   Tragamonedas Loca   ║"));
    console.log(chalk.magenta("╚═══════════════════════╝"));
    console.log("Tirada: " + tirada.map(s => chalk.cyan.bold(s)).join(" | "));
    console.log();

    // Evaluar ganancia
    let frec: Record<string, number> = {};
    tirada.forEach(s => {
      frec[s] = (frec[s] || 0) + 1;
    });

    let maxRepeticiones = Math.max(...Object.values(frec));
    let ganancia = 0;

    if (maxRepeticiones === 5) {
      ganancia = apuesta * 50;
      console.log(chalk.green("¡5 iguales! Ganaste 50x tu apuesta 🎉🎉🎉"));
    } else if (maxRepeticiones === 4) {
      ganancia = apuesta * 10;
      console.log(chalk.green("¡4 iguales! Ganaste 10x tu apuesta 🎉🎉"));
    } else if (maxRepeticiones === 3) {
      ganancia = apuesta * 3;
      console.log(chalk.green("¡3 iguales! Ganaste 3x tu apuesta 🎉"));
    } else {
      console.log(chalk.red("No ganaste, suerte la próxima."));
    }

    return ganancia;
  }
}