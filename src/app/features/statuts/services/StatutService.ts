import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Statut } from '../models/Statut';
import { IStatut } from '../models/IStatut';

@Injectable({ providedIn: 'root' })
export class StatutService {
    private GET_ALL_URL = environment.java_server+'/api/statuts';
    private http = inject(HttpClient);

    getAll(): Observable<Statut[]> {

        return this.http.get<IStatut[]>(
            `${this.GET_ALL_URL}`
        ).pipe(
            map(statutsJsonArray => {
                return statutsJsonArray.map<Statut>(
                    statutJson => Statut.fromJson(statutJson)
                )
            })
        );
    }
}