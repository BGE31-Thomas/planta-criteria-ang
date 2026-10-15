import { IStatut } from "./IStatut";

export class Statut implements IStatut {
    id: number = 0;
    libelle: string = "";

    copy(): Statut {
        const copy = new Statut();

        copy.id = this.id;
        copy.libelle = this.libelle;

        return copy;
    }

    static fromJson(data: IStatut): Statut {
        const statut = new Statut();

        statut.id = data.id;
        statut.libelle = data.libelle;

        return statut;
    }

    toJson(): IStatut {
        return {
            ...this
        };
        
    }
}