import { ISerieObs } from "../interfaces/ISerieObs";

export class SerieObs implements ISerieObs {
    id = 0;
    intitule = "";
    lieu = "";
    date: Date | null = null;
    planteId = 0;

    copy(): SerieObs {
        const copy = new SerieObs();

        copy.id = this.id;
        copy.intitule = this.intitule;
        copy.lieu = this.lieu;
        copy.date = this.date ? new Date(this.date.getTime()) : null;
        copy.planteId = this.planteId;

        return copy;
    }

    static fromJson(data: ISerieObs): SerieObs {
        const serie = new SerieObs();

        serie.id = data.id;
        serie.intitule = data.intitule;
        serie.lieu = data.lieu;
        serie.date = data.date ? new Date(data.date) : new Date();
        serie.planteId = data.planteId;

        return serie;
    }

    /** Conversion en JSON, sans id_site si non voulu */
    toJson(): ISerieObs {
        return {
            ...this,
            date: this.date ? new Date() : new Date(),
        };
        
    }

}