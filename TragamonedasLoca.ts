import { JuegoBase } from "./JuegoBase";

export class TragamonedasLoca extends JuegoBase {
  constructor() {
    super("Tragamonedas Loca", 20);
  }

  jugar(apuesta: number): number {
    this.validarApuesta(apuesta);
    let num = Math.floor(Math.random() * 10);
    return num === 7 ? apuesta * 5 : 0;
  }
}