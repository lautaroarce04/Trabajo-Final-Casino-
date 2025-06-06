import { JuegoBase } from "./JuegoBase";

export class RuletaSimple extends JuegoBase {
  private numeroElegido?: number;

  constructor() {
    super("Ruleta", 5);
  }

  setNumeroElegido(numero: number): void {
    if (!Number.isInteger(numero) || numero < 0 || numero > 36) {
      throw new Error("Número inválido: debe ser un entero entre 0 y 36");
    }
    this.numeroElegido = numero;
  }

  jugar(apuesta: number): number {
    this.validarApuesta(apuesta);

    if (this.numeroElegido === undefined) {
      throw new Error("Primero debe elegir un número entre 0 y 36");
    }

    const numeroSalio = Math.floor(Math.random() * 37); 
    console.log(`Salió el número: ${numeroSalio}`);

    if (numeroSalio === this.numeroElegido) {
      return apuesta * 36;
    }
    return 0;
  }
}