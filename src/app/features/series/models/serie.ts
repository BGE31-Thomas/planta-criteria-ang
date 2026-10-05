import { User } from "../../auth/models/user";
import { Observation } from "../../observations/services/observation";

export interface Serie {
    id: number;
    intitule: string;
    lieu: string;
    date: Date;
    user: User;
    observations: Observation[];


}