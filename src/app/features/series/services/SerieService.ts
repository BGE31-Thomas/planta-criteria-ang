import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../auth/models/user';
import { SerieUpdEdit} from '../models/SerieUpdEdit';
import { ISerieUpdEdit } from '../models/ISerieUpdEdit';

@Service()
export class SerieService {
    private GET_ALL_URL = environment.java_server+'/api/series';
    private http = inject(HttpClient);
    private token = localStorage.getItem('tk_id_token');

    getAllbyUser(user: User): Observable<ISerieUpdEdit[]> {
        return this.http.post<ISerieUpdEdit[]>(this.GET_ALL_URL,user,{
            headers: { Authorization: `Bearer ${this.token}` }
        }).pipe(
            shareReplay(1),
            map(seriesJsonArray => {
            return seriesJsonArray.map<SerieUpdEdit>(
                serieJson => SerieUpdEdit.fromJson(serieJson)
            )
            })
        );
    }
    
    get(id: number,slug:string): Observable<SerieUpdEdit> {
        return this.http.get<ISerieUpdEdit>(this.GET_ALL_URL + '/' +id + '/'+ slug,{
            headers: { Authorization: `Bearer ${this.token}` }
        }).pipe(
            shareReplay(1),
            map(serieJson => SerieUpdEdit.fromJson(serieJson))
        );
    }

    add(serie: SerieUpdEdit): Observable<SerieUpdEdit> {
        return this.http.post<ISerieUpdEdit>(this.GET_ALL_URL, serie.toJson(),{
            headers: { Authorization: `Bearer ${this.token}` }
        }).pipe(
            map(serieJson => SerieUpdEdit.fromJson(serieJson))
        );
    }

    update(serie: SerieUpdEdit): Observable<SerieUpdEdit> {
        const route = this.GET_ALL_URL + '/' + serie.id + '/' + serie.slug;
        
        return this.http.put<ISerieUpdEdit>(route, serie.toJson(),{
            headers: { Authorization: `Bearer ${this.token}` }
        }).pipe(
            map(serieJson => SerieUpdEdit.fromJson(serieJson))
        );
    }
}
