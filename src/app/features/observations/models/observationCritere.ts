import { Critere } from "../../criteres/services/critere";
import { Statut } from "../../statuts/models/statut";
import { Image } from "../../images/models/image";

export interface ObservationCritere {
    id: number;
    observation_id: number;
    critere: Critere;
    statut: Statut;
    images: Image[];
     
}