import { Critere } from "../../criteres/models/critere";
import { TaxrefSummary } from "../../taxref/models/TaxrefSummary";


export interface IPlant {
    id: number;
    nom: string;
    lbNom: string;
    nomCompletHtml: string;
    famille: string;
    synonymes: TaxrefSummary[];
    criteres: Critere[];
    slug: string;
  
}