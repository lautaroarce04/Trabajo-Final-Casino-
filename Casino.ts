import { JuegoBase } from "./JuegoBase";
import { JuegoFactory } from "./PatronJuego";

export class Casino {
  private juegos: JuegoBase[] = [];

  constructor() {
    const tipos = ["TragamonedasSimple", "TragamonedasLoca", "RuletaSimple", "Dados"];
    for (const tipo of tipos) {
      const juego = JuegoFactory.crearJuego(tipo);
      if (juego) {
        this.juegos.push(juego);
      }
    }
  }

  listarJuegos(): string[] {
    return this.juegos.map(j => j.nombre);
  }

  elegirJuego(nombre: string): JuegoBase | undefined {
    return this.juegos.find(j => j.nombre === nombre);
  }
}