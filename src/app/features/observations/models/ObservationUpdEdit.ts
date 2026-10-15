import { ICritereUpdEdit } from "../../criteres/models/ICritereUpdEdit";
import { IObservationUpdEdit } from "./IObservationUpdEdit";

export class ObservationUpdEdit implements IObservationUpdEdit {
 
    id: number = 0;
    serie_id: number = 0;
    plante_id: number = 0;
    slug: string = '';

    copy(): ObservationUpdEdit {
        const copy = new ObservationUpdEdit();

        copy.id = this.id;
        copy.serie_id = this.serie_id;
        copy.plante_id = this.plante_id;
        copy.slug = this.slug;

        return copy;
    }

    static fromJson(data: IObservationUpdEdit): ObservationUpdEdit {
        const observationUpdEdit = new ObservationUpdEdit();

        observationUpdEdit.id = data.id;
        observationUpdEdit.serie_id = data.serie_id;
        observationUpdEdit.plante_id = data.plante_id;
        observationUpdEdit.slug = data.slug;
        

        return observationUpdEdit;
    }

    toJson(): IObservationUpdEdit {
        
        return {
            ...this,
        
        };
    }
}