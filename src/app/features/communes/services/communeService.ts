import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Commune {
  nom: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommuneService {

  private http = inject(HttpClient);

  private readonly API_URL = 'https://geo.api.gouv.fr/communes';

  rechercher(nom: string): Observable<Commune[]> {

    const params = new HttpParams()
      .set('nom', nom)
      .set('fields', 'nom,code')
      .set('boost', 'population')
      .set('limit', '20');

    return this.http.get<Commune[]>(
      this.API_URL,
      { params }
    );
  }
}