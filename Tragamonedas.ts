import { JuegoBase } from "./JuegoBase";

export abstract class Tragamonedas extends JuegoBase {
    protected simbolos = ["🍒", "🍋", "🍉", "⭐", "7️⃣", "🔔"];
  constructor(nombre: string, apuestaMinima: number) {
    super(nombre, apuestaMinima);
  }
}
