import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //private baseUrl ='http://localhost:3000' ; // 'https://wsfatture.onrender.com';
 private baseUrl = environment.baseUrl;  //'https://wsfatture.onrender.com';

  constructor(private http: HttpClient) {}

  /**
   * Scarica il file db.json dal server
   * Restituisce un Blob per permettere il download
   */
  downloadDb(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/backup`, {
      responseType: 'blob'
    });
  }

  /**
   * Aggiorna il db.json in memoria sul server
   * Accetta un oggetto JSON già parsato
   */
  updateDb(json: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update`, json);
  }
}