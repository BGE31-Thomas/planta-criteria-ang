import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';
import { CritereUpdEdit } from '../models/critereUpdEdit';
import { ICritereUpdEdit } from '../models/ICritereUpdEdit';

@Service()
export class CritereService {

    private GET_ALL_URL = environment.java_server+'/api/criteres';
    private http = inject(HttpClient);
    private token = localStorage.getItem('tk_id_token');

    getAllByPlant(plante_id: number): Observable<CritereUpdEdit[]> {
        return this.http.post<ICritereUpdEdit[]>(this.GET_ALL_URL + "/" + plante_id,{
            headers: { Authorization: `Bearer ${this.token}` }
        }).pipe(
            shareReplay(1),
            map(criteresJsonArray => {
            return criteresJsonArray.map<CritereUpdEdit>(
                critereJson => CritereUpdEdit.fromJson(critereJson)
            )
            })
        );
    }
    
    get(id: number,slug:string): Observable<CritereUpdEdit> {
        return this.http.get<ICritereUpdEdit>(this.GET_ALL_URL + id + '/'+ slug,{
            headers: { Authorization: `Bearer ${this.token}` }
        }).pipe(
            shareReplay(1),
            map(critereJson => CritereUpdEdit.fromJson(critereJson))
        );
    }

    add(critere: CritereUpdEdit): Observable<CritereUpdEdit> {
        return this.http.post<ICritereUpdEdit>(this.GET_ALL_URL, critere.toJson(),{
            headers: { Authorization: `Bearer ${this.token}` }
        }).pipe(
            map(critereJson => CritereUpdEdit.fromJson(critereJson))
        );
    }

    update(critere: CritereUpdEdit): Observable<CritereUpdEdit> {
        const route = this.GET_ALL_URL + critere.id + '/' + critere.slug;
        
        return this.http.put<ICritereUpdEdit>(route, critere.toJson(),{
            headers: { Authorization: `Bearer ${this.token}` }
        }).pipe(
            map(critereJson => CritereUpdEdit.fromJson(critereJson))
        );
    }

}
