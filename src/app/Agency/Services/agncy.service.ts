import { Injectable } from '@angular/core';
import { baseAPI } from '../../../Environment/env';
import { Agency, ApiResponse, CreateAgency } from '../Models/agency';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgncyService {

  
   private readonly apiUrl = `${baseAPI}/Government_Agency`;
   
     constructor(private http: HttpClient) { }
   
     getAllAgencies(): Observable<Agency[]> {
       return this.http
         .get<ApiResponse<Agency[]>>(this.apiUrl)
         .pipe(map(res => res.data));
     }
   
     getbyId(id: string): Observable<Agency> {
       return this.http
         .get<ApiResponse<Agency>>(`${this.apiUrl}/${id}`)
         .pipe(map(res => res.data));
     }
   
   
   
     // 🔹 Create
     createAgency(payload: CreateAgency): Observable<Agency> {
       return this.http
         .post<ApiResponse<Agency>>(this.apiUrl, payload)
         .pipe(map(res => res.data));
     }
   
   
     /* =============================
        UPDATE
        API expects: PUT /Centers/{id}
     ============================== */
     updateAgency(
       id: string,
       payload: CreateAgency
     ): Observable<Agency> {
       return this.http
         .put<ApiResponse<Agency>>(`${this.apiUrl}/${id}`, payload)
         .pipe(map(res => res.data));
     }
   
     /* =============================
        DELETE
        API returns: data: true
     ============================== */
     deleteAgency(id: string): Observable<boolean> {
       return this.http
         .delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
         .pipe(map(res => res.data));
     }
}
