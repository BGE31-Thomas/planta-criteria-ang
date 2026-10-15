import { toSlug } from "../../../utils/SlugUtils";
import { ISerieUpdEdit } from "./ISerieUpdEdit";


export class SerieUpdEdit implements ISerieUpdEdit {
    id: number = 0
    intitule: string = '';
    lieu: string = '';
    date: Date = new Date();
    user_id: number = 0;
    slug: string = '';
    
    copy(): SerieUpdEdit {
        const copy = new SerieUpdEdit();

        copy.id = this.id;
        copy.intitule = this.intitule;
        copy.lieu = this.lieu;
        copy.date = this.date ? new Date(this.date.getTime()) : new Date();
        copy.user_id = this.user_id;
        copy.slug = toSlug(this.intitule);

        return copy;
    }

    static fromJson(data: ISerieUpdEdit): SerieUpdEdit {
        const serie = new SerieUpdEdit();

        serie.id = data.id;
        serie.intitule = data.intitule;
        serie.lieu = data.lieu;
        serie.date = data.date ? new Date(data.date.getTime()) : new Date();
        serie.user_id = data.user_id;
        serie.slug = toSlug(data.intitule);

        return serie;
    }

    /** Conversion en JSON, sans id_site si non voulu */
    toJson(): ISerieUpdEdit {
        return {
            ...this,
            date: this.date ? new Date() : new Date(),
        };
        
    }
    
}