import { IImage } from "./IImage";

export class Image implements IImage   {
  id: number = 0;
  chemin: string = '';
  auteur: string = '';
  description: string = '';

  copy(): IImage {
        const copy = new Image();
  
        copy.id = this.id;
        copy.chemin = this.chemin;
        copy.auteur = this.auteur;
        copy.description = this.description;
  
        return copy;
    }
  
    /** Création depuis un JSON brut (avec reconversion des objets internes et dates) */
    static fromJson(data: Image): IImage {
        const image = new Image();
  
        image.id = data.id;
        image.chemin = data.chemin;
        image.auteur = data.auteur;
        image.description = data.description;
  
        return image;
    }
  
    /** Conversion en JSON, sans id_site si non voulu */
    toJson(): IImage {
        
        return {
            ...this,
          
        };
    }
}