import { Observation } from "../../observations/models/Observation";

export interface ISerieDetail {
    id: number;
    intitule: string;
    slug: string;
    lieu: string | null;
    date: Date | null;
    observations: Observation[];
}