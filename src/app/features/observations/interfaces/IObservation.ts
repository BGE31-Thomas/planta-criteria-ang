import { PlantSearch } from "../../plantes/models/PlantSearch";
import { ObservationCritere } from "../models/ObservationCritere";

export interface IObservation {
    id: number;
    plante: PlantSearch;
    observationsCritere: ObservationCritere[];
}