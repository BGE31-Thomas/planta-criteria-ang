import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IImage } from '../models/IImage';
import { Imago } from '../models/Image';



@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.java_server + '/api/images/upload/critere/';
  private readonly imageUrl = environment.java_server + '/api/images/upload/'
  

  uploadPourCritere(
    critereId: number,
    fichier: File
  ): Observable<unknown> {

    const formData = new FormData();

    formData.append('file', fichier);
    console.log(`${this.baseUrl}${critereId}`);
    return this.http.post(
      `${this.baseUrl}${critereId}`,
      formData
    );
  }

  getAllByCritere(critereId: number): Observable<IImage[]> {
    return this.http.get<IImage[]>(
      `${this.baseUrl}${critereId}`
    );
  }

  delete(image: IImage): Observable<void> {
    return this.http.delete<void>(
      this.imageUrl + image.id,
      {}
    );
  }

 
}