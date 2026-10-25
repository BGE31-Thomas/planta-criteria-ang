import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';
import { CritereUpdEdit } from '../models/critereUpdEdit';
import { ICritereUpdEdit } from '../interfaces/ICritereUpdEdit';
import { Plant } from '../../plantes/models/Plant';
import { Critere } from '../models/critere';
import { ICritere } from '../interfaces/ICritere';

@Service()
export class CritereService {

    private GET_ALL_URL = environment.java_server+'/api/criteres';
    private http = inject(HttpClient);

    getAllByPlant(plante: Plant): Observable<Critere[]> {
        return this.http.get<ICritere[]>(this.GET_ALL_URL + "/plante/" + plante.id + '/' + plante.slug,{}).pipe(
            shareReplay(1),
            map(criteresJsonArray => {
            return criteresJsonArray.map<Critere>(
                critereJson => Critere.fromJson(critereJson)
            )
            })
        );
    }
    
    get(critere: CritereUpdEdit): Observable<CritereUpdEdit> {
        return this.http.get<ICritereUpdEdit>(this.GET_ALL_URL + '/' + critere.id + '/'+ critere.slug,{}).pipe(
            shareReplay(1),
            map(critereJson => CritereUpdEdit.fromJson(critereJson))
        );
    }

    add(critere: CritereUpdEdit): Observable<CritereUpdEdit> {
        return this.http.post<ICritereUpdEdit>(this.GET_ALL_URL, critere.toJson(),{}).pipe(
            map(critereJson => CritereUpdEdit.fromJson(critereJson))
        );
    }

    update(critere: CritereUpdEdit): Observable<CritereUpdEdit> {
        const route = this.GET_ALL_URL + '/' + critere.id + '/' + critere.slug;
        
        return this.http.put<ICritereUpdEdit>(route, critere.toJson(),{}).pipe(
            map(critereJson => CritereUpdEdit.fromJson(critereJson))
        );
    }

}
