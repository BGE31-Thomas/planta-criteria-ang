import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import { environment } from '../../../../environments/environment';;
import { Plant } from '../models/Plant';
import { IPlant } from '../models/IPlant';
import { PlantSearch } from '../models/PlantSearch';
import { IPlantSearch } from '../models/IPlantSearch';
import { toSlug } from '../../../utils/SlugUtils';

@Service()
export class PlantService {
    private GET_ALL_URL = environment.java_server+'/api/plants';
    private http = inject(HttpClient);
    private token = localStorage.getItem('tk_id_token');

    find(search:string): Observable<PlantSearch[]> {
        return this.http.post<IPlantSearch[]>(this.GET_ALL_URL + '/search?q=' + search,{
            headers: { Authorization: `Bearer ${this.token}` }
        }).pipe(
            shareReplay(1),
            map(plantsJsonArray => {
            return plantsJsonArray.map<PlantSearch>(
                plantJson => PlantSearch.fromJson(plantJson)
            )
            })
        );
    }
    
    get(plante: PlantSearch): Observable<Plant> {
        return this.http.get<IPlant>(this.GET_ALL_URL + '/' + plante.id + '/'+ toSlug(plante.lbNom),{
            headers: { Authorization: `Bearer ${this.token}` }
        }).pipe(
            shareReplay(1),
            map(plantJson => Plant.fromJson(plantJson))
        );
    }

   
}
