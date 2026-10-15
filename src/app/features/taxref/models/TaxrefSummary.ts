import { ITaxrefSummary } from "./ITaxrefSummary";

export class TaxrefSummary implements ITaxrefSummary {
  id: number = 0;
  nom: string = "";
  lbNom: string = "";

  copy(): TaxrefSummary {
    const copy = new TaxrefSummary();
    copy.id = this.id;
    copy.nom = this.nom;
    copy.lbNom = this.lbNom;
    return copy;
  }

  static fromJson(data: ITaxrefSummary): TaxrefSummary {
    const taxrefSummary = new TaxrefSummary();
    taxrefSummary.id = data.id;
    taxrefSummary.nom = data.nom;
    taxrefSummary.lbNom = data.lbNom;
    return taxrefSummary;
  }

  toJson(): ITaxrefSummary {
    return {
      ...this,
    };
  }

  
}