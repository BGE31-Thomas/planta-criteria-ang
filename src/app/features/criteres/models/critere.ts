import { toSlug } from "../../../utils/SlugUtils";
import { PlantSearch } from "../../plantes/models/PlantSearch";
import { Source } from "../../sources/models/Source";
import { ICritere } from "../interfaces/ICritere";

export class Critere implements ICritere {
  id: number = 0;
  organe: string = '';
  description: string = '';
  slug: string = '';
  source: Source = new Source();
  plante: PlantSearch = new PlantSearch();


  copy(): Critere {
      const copy = new Critere();

      copy.id = this.id;
      copy.organe = this.organe;
      copy.description = this.description;
      copy.slug = toSlug(this.description);
      copy.source = this.source.copy();
      copy.plante = this.plante.copy();

      return copy;
  }

  static fromJson(data: ICritere): Critere {
      const critere = new Critere();

      critere.id = data.id;
      critere.organe = data.organe;
      critere.description = data.description;
      critere.slug = toSlug(data.description);
      critere.source = Source.fromJson(data.source);
      critere.plante = PlantSearch.fromJson(data.plante);

      return critere;
  }

  toJson(): ICritere {
      
      return {
          ...this,
            source: typeof this.source.toJson === 'function' ? this.source.toJson() : this.source,
            plante: typeof this.plante.toJson === 'function' ? this.plante.toJson() : this.plante
      };
  }
}
          