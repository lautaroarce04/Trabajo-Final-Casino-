// IJuego.ts
export interface IJuego {
  nombre: string;
  jugar(apuesta: number): number;  // Método que devuelve la ganancia o 0 si perdió
}