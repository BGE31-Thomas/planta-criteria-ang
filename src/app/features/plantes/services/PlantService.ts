import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import { environment } from '../../../../environments/environment';;
import { Plant } from '../models/Plant';
import { IPlant } from '../models/IPlant';
import { PlantSearch } from '../models/PlantSearch';
import { IPlantSearch } from '../models/IPlantSearch';

@Service()
export class PlantService {

  private readonly GET_ALL_URL = environment.java_server + '/api/plants';

  private readonly http = inject(HttpClient);

  /**
   * Recherche des plantes à partir d'un texte.
   */
  find(search: string): Observable<PlantSearch[]> {

    return this.http.get<IPlantSearch[]>(
      `${this.GET_ALL_URL}/search?q=${encodeURIComponent(search)}`
    ).pipe(
      map(plantsJsonArray =>
        plantsJsonArray.map(plantJson =>
          PlantSearch.fromJson(plantJson)
        )
      ),
      shareReplay(1)
    );
  }

  /**
   * Récupère les détails d'une plante.
   */
  get(plante: PlantSearch): Observable<Plant> {
    return this.getByIdAndSlug(plante.id, plante.slug);
  }

  /**
   * Récupère une plante depuis son identifiant et son slug.
   * Cette méthode sera également utilisée par la page de détails.
   */
  getByIdAndSlug(id: number, slug: string): Observable<Plant> {
    console.log(slug);
    return this.http.get<IPlant>(
      `${this.GET_ALL_URL}/${id}/${encodeURIComponent(slug)}`,{}
    ).pipe(
      map(plantJson => Plant.fromJson(plantJson)),
      shareReplay(1)
    );
  }
}