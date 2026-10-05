import { Source } from "../../sources/models/source";
import { Image } from "../../images/models/image";
import { PlantSearch } from "../../plantes/models/plantSearch";

export interface critere {
  id: number;
  organe: string;
  description: string;
  source: Source;
  images: Image[];
  plante: PlantSearch;
}