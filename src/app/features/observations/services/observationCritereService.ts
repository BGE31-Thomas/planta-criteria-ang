import { HttpClient } from "@angular/common/http";
import { Service, inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ObservationCritere } from "../models/ObservationCritere";

@Service()
export class ObservationCritereService {
    private GET_ALL_URL = environment.java_server+'/api/observationsCritere';
    private http = inject(HttpClient);

    updateStatut(
      id: number,
      slug: string,
      statutId: number
    ): Observable<ObservationCritere> {

      return this.http.get<ObservationCritere>(
        `${this.GET_ALL_URL}/${id}/${slug}/statut/${statutId}`,{}
      );
}
    
}
