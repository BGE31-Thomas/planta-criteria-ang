import { IObservationUpdEdit } from "../interfaces/IObservationUpdEdit";

export class ObservationUpdEdit implements IObservationUpdEdit {
 
    id: number = 0;
    serieId: number = 0;
    planteId: number = 0;
    slug: string = '';
   
    copy(): ObservationUpdEdit {
        const copy = new ObservationUpdEdit();

        copy.id = this.id;
        copy.serieId = this.serieId;
        copy.planteId = this.planteId;
        copy.slug = this.slug;

        return copy;
    }

    static fromJson(data: IObservationUpdEdit): ObservationUpdEdit {
        const observationUpdEdit = new ObservationUpdEdit();

        observationUpdEdit.id = data.id;
        observationUpdEdit.serieId = data.serieId;
        observationUpdEdit.planteId = data.planteId;
        observationUpdEdit.slug = data.slug;

        return observationUpdEdit;
    }

    toJson(): IObservationUpdEdit {
        
        return {
            ...this,
        
        };
    }
}