import { Critere } from "../../criteres/models/critere";
import { Statut } from "../../statuts/models/Statut";

export interface IObservationCritere {
    id: number;
    critere: Critere;
    statut: Statut;
    slug: string;
}