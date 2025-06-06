import { IJuego } from "./IJuego";

export abstract class JuegoBase implements IJuego {
  constructor(public nombre: string, public apuestaMinima: number) {}

  abstract jugar(apuesta: number): number;

  validarApuesta(apuesta: number): void {
    if (apuesta < this.apuestaMinima) {
      throw new Error(`La apuesta mínima para ${this.nombre} es ${this.apuestaMinima}`);
    }
  }
}