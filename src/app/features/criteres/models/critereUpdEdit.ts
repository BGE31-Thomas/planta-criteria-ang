import { toSlug } from '../../../utils/SlugUtils';
import { ICritereUpdEdit } from '../interfaces/ICritereUpdEdit';

export class CritereUpdEdit implements ICritereUpdEdit {
  id: number = 0;
  organe: string = '';
  description: string = '';
  slug: string = '';
  source_id: number = 0;
  plante_id: number = 0;


  copy(): CritereUpdEdit {
      const copy = new CritereUpdEdit();

      copy.id = this.id;
      copy.organe = this.organe;
      copy.description = this.description;
      copy.slug = toSlug(this.description);
      copy.source_id = this.source_id;
      copy.plante_id = this.plante_id;

      return copy;
  }

  static fromJson(data: ICritereUpdEdit): CritereUpdEdit {
      const critereUpdEdit = new CritereUpdEdit();

      critereUpdEdit.id = data.id;
      critereUpdEdit.organe = data.organe;
      critereUpdEdit.description = data.description;
      critereUpdEdit.slug = toSlug(data.description);
      critereUpdEdit.source_id = data.source_id;
      critereUpdEdit.plante_id = data.plante_id;

      return critereUpdEdit;
  }

  toJson(): ICritereUpdEdit {
      
      return {
          ...this,
        
      };
  }
}
          