export interface IJuego {
  nombre: string;
  apuestaMinima: number;
  jugar(apuesta: number): Promise<number>; // <-- cambio clave
}