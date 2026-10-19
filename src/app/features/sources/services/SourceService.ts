import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISource } from '../models/ISource';
import { Source } from '../models/Source';

@Service()
export class SourceService {
    private GET_ALL_URL = environment.java_server+'/api/sources';
    private http = inject(HttpClient);
    private token = localStorage.getItem('tk_id_token');

    getAll(): Observable<Source[]> {
        return this.http.post<ISource[]>(this.GET_ALL_URL,{
            
        }).pipe(
            shareReplay(1),
            map(sourcesJsonArray => {
            return sourcesJsonArray.map<Source>(
                sourceJson => Source.fromJson(sourceJson)
            )
            })
        );
    }
    
    get(source: Source): Observable<Source> {
        return this.http.get<ISource>(this.GET_ALL_URL + '/' + source.id + '/'+ source.slug,{
            
        }).pipe(
            shareReplay(1),
            map(sourceJson => Source.fromJson(sourceJson))
        );
    }

    add(source: Source): Observable<Source> {
        return this.http.post<ISource>(this.GET_ALL_URL, source.toJson(),{
            
        }).pipe(
            map(sourceJson => Source.fromJson(sourceJson))
        );
    }

    update(source: Source): Observable<Source> {
        const route = this.GET_ALL_URL + '/' + source.id + '/' + source.slug;
        
        return this.http.put<ISource>(route, source.toJson(),{
            
        }).pipe(
            map(sourceJson => Source.fromJson(sourceJson))
        );
    }
}
