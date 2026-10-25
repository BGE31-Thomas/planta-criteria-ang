import { PlantSearch } from "../../plantes/models/PlantSearch";
import { Source } from "../../sources/models/Source";

export interface ICritere {
  id: number;
  organe: string;
  description: string;
  slug: string;
  source: Source;
  plante: PlantSearch;
}
