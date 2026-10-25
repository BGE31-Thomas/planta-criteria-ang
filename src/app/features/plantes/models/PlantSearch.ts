import { toSlug } from "../../../utils/SlugUtils";
import { IPlantSearch } from "../interfaces/IPlantSearch";

export class PlantSearch {
    id: number = 0;
    nomCompletHtml: string = '';
    slug: string = '';

     copy(): PlantSearch {
            const copy = new PlantSearch();
    
            copy.id = this.id;
            copy.nomCompletHtml = this.nomCompletHtml;
            copy.slug = toSlug(this.nomCompletHtml);
        
            return copy;
        }
    
        static fromJson(data: IPlantSearch): PlantSearch {
            const plant = new PlantSearch();
    
            plant.id = data.id;
            plant.nomCompletHtml = data.nomCompletHtml;
            plant.slug = toSlug(data.nomCompletHtml);

            return plant;
        }
    
        toJson(): IPlantSearch {
            
            return {
                ...this,
            };
        }
}