import { User } from "../../auth/models/user";

export interface SerieSearch {
    id: number;
    intitule: string;
    lieu: string;
    date: Date;
    user: User;
    
}