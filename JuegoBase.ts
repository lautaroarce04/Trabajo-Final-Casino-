import { IJuego } from "./IJuego";

export abstract class JuegoBase implements IJuego {
  constructor(public nombre: string, public apuestaMinima: number) {}

  //devuelve una promesa para soportar métodos async en subclases
 abstract jugar(apuesta: number): Promise<number>;

  validarApuesta(apuesta: number): void {
    if (apuesta < this.apuestaMinima) {
      throw new Error(`La apuesta mínima para ${this.nombre} es ${this.apuestaMinima}`);
    }
  }
}