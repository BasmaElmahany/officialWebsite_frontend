import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { baseAPI } from '../../../Environment/env';
import { Directorate, ApiResponse, CreateDirectorate } from '../Models/directorate';

@Injectable({
  providedIn: 'root'
})
export class DirectorateService {

 private readonly apiUrl = `${baseAPI}/Directorate`;
 
   constructor(private http: HttpClient) { }
 
   getAllDirectorates(): Observable<Directorate[]> {
     return this.http
       .get<ApiResponse<Directorate[]>>(this.apiUrl)
       .pipe(map(res => res.data));
   }
 
   getbyId(id: string): Observable<Directorate> {
     return this.http
       .get<ApiResponse<Directorate>>(`${this.apiUrl}/${id}`)
       .pipe(map(res => res.data));
   }
 
 
 
   // 🔹 Create
   createDirectorate(payload: CreateDirectorate): Observable<Directorate> {
     return this.http
       .post<ApiResponse<Directorate>>(this.apiUrl, payload)
       .pipe(map(res => res.data));
   }
 
 
   /* =============================
      UPDATE
      API expects: PUT /Centers/{id}
   ============================== */
   updateDirectorate(
     id: string,
     payload: CreateDirectorate
   ): Observable<Directorate> {
     return this.http
       .put<ApiResponse<Directorate>>(`${this.apiUrl}/${id}`, payload)
       .pipe(map(res => res.data));
   }
 
   /* =============================
      DELETE
      API returns: data: true
   ============================== */
   deleteDirectorate(id: string): Observable<boolean> {
     return this.http
       .delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
       .pipe(map(res => res.data));
   }
}
