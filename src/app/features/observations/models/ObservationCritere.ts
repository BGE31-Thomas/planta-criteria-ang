import { Critere } from "../../criteres/models/critere";
import { Statut } from "../../statuts/models/Statut";
import { IObservationCritere } from "../interfaces/IObservationCritere";
import * as CryptoJS from 'crypto-js';


export class ObservationCritere {
    id: number = 0;
    critere: Critere = new Critere();
    statut: Statut = new Statut();
    slug: string = "";

    copy(): ObservationCritere {
        const copy = new ObservationCritere();

        copy.id = this.id;
        copy.critere = this.critere.copy();
        copy.statut = this.statut.copy();
        copy.slug = CryptoJS.SHA256(this.id.toString()).toString(CryptoJS.enc.Hex);

        return copy;
    }

    static fromJson(data: IObservationCritere): ObservationCritere {
        const observationCritere = new ObservationCritere();

        observationCritere.id = data.id;
        observationCritere.critere = Critere.fromJson(data.critere);
        observationCritere.statut = Statut.fromJson(data.statut);
        observationCritere.slug = CryptoJS.SHA256(data.id.toString()).toString(CryptoJS.enc.Hex);

        return observationCritere;
    }

    toJson(): IObservationCritere {
        
        return {
            ...this,
            critere: typeof this.critere.toJson === 'function' ? this.critere.toJson() : this.critere,
            statut: typeof this.statut.toJson === 'function' ? this.statut.toJson() : this.statut
        };
    }
}