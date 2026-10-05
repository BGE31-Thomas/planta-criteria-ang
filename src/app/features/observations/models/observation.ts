import { PlantSearch } from "../../plantes/models/plantSearch";
import { SerieSearch } from "../../series/models/serieSearch";
import { ObservationCritere } from "./observationCritere";

export interface Observation {
  id: number;
  serie: SerieSearch;
  plante: PlantSearch;
  observationsCritere: ObservationCritere[];

}