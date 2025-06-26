import { JuegoBase } from "./JuegoBase";
import inquirer from "inquirer";

export abstract class Tragamonedas extends JuegoBase {
  protected simbolos = ["🍒", "🍋", "🍉", "⭐", "7️⃣", "🔔"];

  constructor(nombre: string, apuestaMinima: number) {
    super(nombre, apuestaMinima);
  }

  protected generarTirada(cantidad: number): string[] {
    return Array.from({ length: cantidad }, () =>
      this.simbolos[Math.floor(Math.random() * this.simbolos.length)]
    );
  }

  protected async pedirApuesta(saldo: number): Promise<number> {
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

    return Number(apuestaStr);
  }
}