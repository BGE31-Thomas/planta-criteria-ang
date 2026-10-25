import { CritereUpdEdit } from "../../criteres/models/critereUpdEdit";
import { TaxrefSummary } from "../../taxref/models/TaxrefSummary";


export interface IPlant {
    id: number;
    nom: string;
    lbNom: string;
    nomCompletHtml: string;
    famille: string;
    synonymes: TaxrefSummary[];
    criteres: CritereUpdEdit[];
    slug: string;
  
}