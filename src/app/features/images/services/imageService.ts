import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CritereUpdEdit } from '../../criteres/models/critereUpdEdit';

@Service()
export class ImageService {
    private http = inject(HttpClient);
    private token = localStorage.getItem('tk_id_token');
    private apiUrl = environment.java_server + '/api/images/upload';

    uploadFileForCriteria(file: File,critere:CritereUpdEdit): Observable<any> {
      const formData = new FormData();
  
      formData.append('file', file);
      formData.append('reserve', JSON.stringify(critere)); 

      return this.http.post(this.apiUrl, formData, {});
    }
}    
