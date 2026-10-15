import { toSlug } from "../../../utils/SlugUtils";
import { ISource } from "./ISource";

export class Source {
    id: number = 0;
    titre: string = '';
    auteur: string = '';
    annee: string = '';
    slug: string = '';

    copy(): Source {
        const copy = new Source();

        copy.id = this.id;
        copy.titre = this.titre;
        copy.auteur = this.auteur;
        copy.annee = this.annee;
        copy.slug = toSlug(this.titre);

        return copy;
    }

    static fromJson(data: ISource): Source {
        const source = new Source();

        source.id = data.id;
        source.titre = data.titre;
        source.auteur = data.auteur;
        source.annee = data.annee;
        source.slug = toSlug(data.titre);

        return source;
    }

    toJson(): ISource {
        return {
            ...this
        };
        
    }
}