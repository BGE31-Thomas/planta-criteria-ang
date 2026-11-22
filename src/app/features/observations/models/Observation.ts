import { PlantSearch } from "../../plantes/models/PlantSearch";
import { IObservation } from "../interfaces/IObservation";
import { ObservationCritere } from "./ObservationCritere";

export class Observation {
    id: number = 0;
    plante: PlantSearch = new PlantSearch();
    observationsCritere: ObservationCritere[] = [];

    copy(): Observation {
          const copy = new Observation();
    
          copy.id = this.id;
          copy.plante = this.plante.copy();
          copy.observationsCritere = this.observationsCritere.map(oc => oc.copy());
    
          return copy;
      }

      static fromJson(data: IObservation): Observation {
          const observation = new Observation();

          observation.id = data.id;
          observation.plante = PlantSearch.fromJson(data.plante);
          observation.observationsCritere = (data.observationsCritere || []).map(oc => ObservationCritere.fromJson(oc));

          return observation;
      }

      toJson(): IObservation {
          
          return {
              ...this,
              plante: typeof this.plante.toJson === 'function' ? this.plante.toJson() : this.plante,
              observationsCritere: this.observationsCritere.map(oc => typeof oc.toJson === 'function' ? oc.toJson() : oc)
          };
      }
}
          