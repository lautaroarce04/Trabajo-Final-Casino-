import { JuegoBase } from "./JuegoBase";
import { TragamonedasSimple } from "./TragamonedasSimple";
import { TragamonedasLoca } from "./TragamonedasLoca";
import { RuletaSimple } from "./RuletaSimple";
import { Dados } from "./Dados";

export class JuegoFactory {
  static crearJuego(tipo: string): JuegoBase | undefined {
    switch (tipo) {
      case "TragamonedasSimple":
        return new TragamonedasSimple();
      case "TragamonedasLoca":
        return new TragamonedasLoca();
      case "RuletaSimple":
        return new RuletaSimple();
      case "Dados":
        return new Dados();
      default:
        return undefined;
    }
  }
}