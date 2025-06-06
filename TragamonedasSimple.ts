import { JuegoBase } from "./JuegoBase";

export class TragamonedasSimple extends JuegoBase {
  constructor() {
    super("Tragamonedas Simple", 10);
  }

  jugar(apuesta: number): number {
    this.validarApuesta(apuesta);
    let gana = Math.random() < 0.4;
    return gana ? apuesta * 2 : 0;
  }
}