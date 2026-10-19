import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Statut } from '../models/Statut';
import { IStatut } from '../models/IStatut';


@Service()
export class StatutService {
    private GET_ALL_URL = environment.java_server+'/api/statuts';
    private http = inject(HttpClient);
    private token = localStorage.getItem('tk_id_token');

    getAll(): Observable<Statut[]> {
        return this.http.post<IStatut[]>(this.GET_ALL_URL,{
            
        }).pipe(
            shareReplay(1),
            map(sstatutsJsonArray => {
            return sstatutsJsonArray.map<Statut>(
                statutJson => Statut.fromJson(statutJson)
            )
            })
        );
    }
}