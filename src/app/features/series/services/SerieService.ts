import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SerieUpdEdit} from '../models/SerieUpdEdit';
import { ISerieUpdEdit } from '../interfaces/ISerieUpdEdit';
import { SerieObs } from '../models/SerieObs';
import { ISerieObs } from '../interfaces/ISerieObs';
import { SerieDetail } from '../models/SerieDetail';
import { ISerieDetail } from '../interfaces/ISerieDetail';

@Injectable({ providedIn: 'root' })
export class SerieService {
    private GET_ALL_URL = environment.java_server+'/api/series';
    private http = inject(HttpClient);

    getAllByUser(): Observable<SerieUpdEdit[]> {

        return this.http.get<ISerieUpdEdit[]>(
            `${this.GET_ALL_URL}/user`
        ).pipe(
            map(seriesJsonArray =>
                seriesJsonArray.map<SerieUpdEdit>(
                    serieJson => SerieUpdEdit.fromJson(serieJson)
                )
            )
        );
    }
    
    get(serie: SerieUpdEdit): Observable<SerieUpdEdit> {
        return this.http.get<ISerieUpdEdit>(this.GET_ALL_URL + '/' + serie.id + '/'+ serie.slug,{
            
        }).pipe(
            shareReplay(1),
            map(serieJson => SerieUpdEdit.fromJson(serieJson))
        );
    }

    add(serie: SerieUpdEdit): Observable<SerieUpdEdit> {
        return this.http.post<ISerieUpdEdit>(this.GET_ALL_URL, serie.toJson(),{
            
        }).pipe(
            map(serieJson => SerieUpdEdit.fromJson(serieJson))
        );
    }

    addWithObservation(serie: SerieObs): Observable<SerieObs> {
        return this.http.post<ISerieObs>(this.GET_ALL_URL + '/observation', serie.toJson(),{
            
        }).pipe(
            map(serieJson => SerieObs.fromJson(serieJson))
        );
    }

    update(serie: SerieUpdEdit): Observable<SerieUpdEdit> {
        const route = this.GET_ALL_URL + '/' + serie.id + '/' + serie.slug;
        
        return this.http.put<ISerieUpdEdit>(route, serie.toJson(),{
            
        }).pipe(
            map(serieJson => SerieUpdEdit.fromJson(serieJson))
        );
    }

    // Détail complet d'une série
    getDetail(id: number, slug: string): Observable<SerieDetail> {

        return this.http.get<ISerieDetail>(
        `${this.GET_ALL_URL}/${id}/${slug}`
        ).pipe(
            map(serieJson => SerieDetail.fromJson(serieJson))
        );
    }

}
