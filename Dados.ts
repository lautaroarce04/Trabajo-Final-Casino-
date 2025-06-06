import { JuegoBase } from "./JuegoBase";

export class Dados extends JuegoBase {
  constructor() {
    super("Dados", 10); // nombre y apuesta mínima
  }

  jugar(apuesta: number): number {
    this.validarApuesta(apuesta);
    // Tirar dos dados (1 a 6)
    let dado1 = Math.floor(Math.random() * 6) + 1;
    let dado2 = Math.floor(Math.random() * 6) + 1;
    let suma = dado1 + dado2;

    // Ganas si la suma es 7 u 11, ganas el doble de la apuesta
    if (suma === 7 || suma === 11) {
      return apuesta * 2;
    } else {
      return 0;
    }
  }
}