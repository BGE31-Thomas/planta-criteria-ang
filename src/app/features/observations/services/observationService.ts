import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';
import { ObservationUpdEdit } from '../models/ObservationUpdEdit';
import { IObservationUpdEdit } from '../models/IObservationUpdEdit';
import { SerieUpdEdit } from '../../series/models/SerieUpdEdit';


@Service()
export class ObservationService {
    private GET_ALL_URL = environment.java_server+'/api/observations';
    private http = inject(HttpClient);
    private token = localStorage.getItem('tk_id_token');

    getAllBySerie(serie: SerieUpdEdit): Observable<ObservationUpdEdit[]> {
    return this.http.post<IObservationUpdEdit[]>(this.GET_ALL_URL,serie,{
        headers: { Authorization: `Bearer ${this.token}` }
    }).pipe(
        shareReplay(1),
        map(observationsJsonArray => {
        return observationsJsonArray.map<ObservationUpdEdit>(
            observationJson => ObservationUpdEdit.fromJson(observationJson)
        )
        })
    );
    }
    
    get(id: number,slug:string): Observable<ObservationUpdEdit> {
    return this.http.get<IObservationUpdEdit>(this.GET_ALL_URL + id + '/'+ slug,{
        headers: { Authorization: `Bearer ${this.token}` }
    }).pipe(
        shareReplay(1),
        map(observationJson => ObservationUpdEdit.fromJson(observationJson))
    );
    }

    add(observation: ObservationUpdEdit): Observable<ObservationUpdEdit> {
    return this.http.post<IObservationUpdEdit>(this.GET_ALL_URL, observation.toJson(),{
        headers: { Authorization: `Bearer ${this.token}` }
    }).pipe(
        map(observationJson => ObservationUpdEdit.fromJson(observationJson))
    );
    }

    update(observation: ObservationUpdEdit): Observable<ObservationUpdEdit> {
    const route = this.GET_ALL_URL + observation.id + '/' + observation.slug;
    
    return this.http.put<IObservationUpdEdit>(route, observation.toJson(),{
        headers: { Authorization: `Bearer ${this.token}` }
    }).pipe(
        map(observationJson => ObservationUpdEdit.fromJson(observationJson))
    );
    }
}
