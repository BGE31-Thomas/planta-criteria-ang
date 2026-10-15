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
        copy.slug = this.slug;

        return copy;
    }

    static fromJson(data: ISource): Source {
        const source = new Source();

        source.id = data.id;
        source.titre = data.titre;
        source.auteur = data.auteur;
        source.annee = data.annee;
        source.slug = data.slug;

        return source;
    }

    toJson(): ISource {
        return {
            ...this
        };
        
    }
}