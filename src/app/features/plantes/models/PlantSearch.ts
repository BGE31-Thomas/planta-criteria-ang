import { IPlantSearch } from "./IPlantSearch";

export class PlantSearch {
    id: number = 0;
    lbNom: string = '';

     copy(): PlantSearch {
            const copy = new PlantSearch();
    
            copy.id = this.id;
            copy.lbNom = this.lbNom;
        
            return copy;
        }
    
        static fromJson(data: IPlantSearch): PlantSearch {
            const plant = new PlantSearch();
    
            plant.id = data.id;
            plant.lbNom = data.lbNom;

            return plant;
        }
    
        toJson(): IPlantSearch {
            
            return {
                ...this,
            };
        }
}