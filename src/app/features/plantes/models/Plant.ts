import { CritereUpdEdit } from "../../criteres/models/critereUpdEdit";
import { TaxrefSummary } from "../../taxref/models/TaxrefSummary";
import { IPlant } from "./IPlant";

export class Plant {
    id: number = 0;
    nom: string = "";
    lbNom: string = "";
    nomCompletHtml: string = "";
    famille: string = "";
    synonymes: TaxrefSummary[] = [];
    criteres: CritereUpdEdit[] = [];

    copy(): Plant {
        const copy = new Plant();

        copy.id = this.id;
        copy.nom = this.nom;
        copy.lbNom = this.lbNom;
        copy.nomCompletHtml = this.nomCompletHtml;
        copy.famille = this.famille;
        copy.synonymes = this.synonymes?.map(s => s.copy()) || [];
        copy.criteres = this.criteres?.map(c => c.copy()) || [];

        return copy;
    }

    static fromJson(data: IPlant): Plant {
        const plant = new Plant();

        plant.id = data.id;
        plant.nom = data.nom;
        plant.lbNom = data.lbNom;
        plant.nomCompletHtml = data.nomCompletHtml;
        plant.famille = data.famille;
        plant.synonymes = (data.synonymes || []).map(s => TaxrefSummary.fromJson(s));
        plant.criteres = (data.criteres || []).map(c => CritereUpdEdit.fromJson(c));

        return plant;
    }

    toJson(): IPlant {
        
        return {
            ...this,
            synonymes: this.synonymes ? this.synonymes.map(s => typeof s.toJson === 'function' ? s.toJson() : s) : [],
            criteres: this.criteres ? this.criteres.map(c => typeof c.toJson === 'function' ? c.toJson() : c) : [],
        };
    }
}        