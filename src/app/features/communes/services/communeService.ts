import { Observable, map, shareReplay } from 'rxjs';
import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ICommuneSearch } from '../interfaces/ICommuneSearch';
import { CommuneSearch } from '../models/CommuneSearch';

@Service()
export class CommuneService {

  private GET_ALL_URL = environment.java_server+'/api/communes?q=';
  private http = inject(HttpClient);
  private token = localStorage.getItem('tk_id_token');

  getAllBySItes(commune:string): Observable<CommuneSearch[]> {
    return this.http.post<ICommuneSearch[]>(this.GET_ALL_URL+commune,{}).pipe(
      shareReplay(1),
      map(communeJsonArray => {
        return communeJsonArray.map<CommuneSearch>(
          communeJson => CommuneSearch.fromJson(communeJson)
        )
      })
    );
  }
}