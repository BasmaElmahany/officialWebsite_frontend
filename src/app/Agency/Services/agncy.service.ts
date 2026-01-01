import { Injectable } from '@angular/core';
import { baseAPI } from '../../../Environment/env';
import { Agency, AgencyRead, ApiResponse, CreateAgency } from '../Models/agency';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgncyService {

  
   private readonly apiUrl = `${baseAPI}/Government_Agency`;
   
      constructor(private http: HttpClient) { }
      getAllAgencies() {
        return this.http
          .get<ApiResponse<AgencyRead[]>>(this.apiUrl)
          .pipe(map(res => res.data));
      }
    
      getbyId(id: string) {
        return this.http
          .get<ApiResponse<AgencyRead>>(`${this.apiUrl}/${id}`)
          .pipe(map(res => res.data));
      }
    
      createAgency(formData: FormData): Observable<Agency> {
        return this.http
          .post<ApiResponse<Agency>>(this.apiUrl, formData)
          .pipe(map(res => res.data));
      }
      /* =============================
         UPDATE
         API expects: PUT /Centers/{id}
      ============================== */
      updateAgency(
        id: string,
        formData: FormData
      ): Observable<Agency> {
        return this.http
          .put<ApiResponse<Agency>>(`${this.apiUrl}/${id}`, formData)
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
