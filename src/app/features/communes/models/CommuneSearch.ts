import { ICommuneSearch } from "./ICommuneSearch";

export class CommuneSearch implements ICommuneSearch {
    id: number = 0;
    text: string = "";

    copy(): CommuneSearch {
        const copy = new CommuneSearch();

        copy.id = this.id;
        copy.text = this.text;

        return copy;
    }

    static fromJson(data: ICommuneSearch): CommuneSearch {
        const communeSearch = new CommuneSearch();

        communeSearch.id = data.id;
        communeSearch.text = data.text;
      
        return communeSearch;
    }

    toJson(): ICommuneSearch {
        
        return {
            ...this,
        };
    }
}