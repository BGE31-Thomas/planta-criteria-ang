import { Critere } from "../../criteres/services/critere";
import { TaxrefSummary } from "../../taxref/models/taxrefSummary";


export interface Plant {
    id: number;
    nom: string;
    lbNom: string;
    nomCompletHtml: string;
    famille: string;
    synonymes: TaxrefSummary[];
    criteres: Critere[];
  
}