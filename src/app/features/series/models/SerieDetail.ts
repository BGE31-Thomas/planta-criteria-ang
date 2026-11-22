import { Observation } from "../../observations/models/Observation";
import { ISerieDetail } from "../interfaces/ISerieDetail";

export class SerieDetail {
    id: number = 0
    intitule: string = '';
    slug: string = '';
    lieu: string | null = null;
    date: Date | null = null;
    observations: Observation[] = [];

    copy(): SerieDetail {
          const copy = new SerieDetail();
    
          copy.id = this.id;
          copy.intitule = this.intitule;
          copy.slug = this.slug;
          copy.lieu = this.lieu;
          copy.date = this.date;
          copy.observations = this.observations.map(o => o.copy());
    
          return copy;
      }

      static fromJson(data: ISerieDetail): SerieDetail {
          const serieDetail = new SerieDetail();

          serieDetail.id = data.id;
          serieDetail.intitule = data.intitule;
          serieDetail.slug = data.slug;
          serieDetail.lieu = data.lieu;
          serieDetail.date = data.date;
          serieDetail.observations = (data.observations || []).map(o => Observation.fromJson(o));

          return serieDetail;
      }

      toJson(): ISerieDetail {
          
          return {
              ...this,
                observations: this.observations.map(o => o.toJson())
          };
      }
}