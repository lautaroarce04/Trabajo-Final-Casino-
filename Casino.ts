import { JuegoBase } from "./JuegoBase";
import { TragamonedasSimple } from "./TragamonedasSimple";
import { TragamonedasLoca } from "./TragamonedasLoca";
import { RuletaSimple } from "./RuletaSimple";
import { Dados } from "./Dados";

export class Casino {
  private juegos: JuegoBase[] = [];

  constructor() {
    this.juegos.push(new TragamonedasSimple());
    this.juegos.push(new TragamonedasLoca());
    this.juegos.push(new RuletaSimple());
    this.juegos.push(new Dados());
  }

  listarJuegos(): string[] {
    return this.juegos.map(j => j.nombre);
  }

  elegirJuego(nombre: string): JuegoBase | undefined {
    return this.juegos.find(j => j.nombre === nombre);
  }
}