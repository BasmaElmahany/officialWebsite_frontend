import { Injectable } from '@angular/core';
import { baseAPI } from '../../../Environment/env';
// استيراد الموديلات الجديدة
import { Agency, AgencyRead, ApiResponse } from '../Models/agency';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgncyService {

  private readonly apiUrl = `${baseAPI}/Government_Agency`;

  constructor(private http: HttpClient) { }

  getAllAgencies(): Observable<AgencyRead[]> {
    return this.http
      .get<ApiResponse<AgencyRead[]>>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  getbyId(id: string): Observable<AgencyRead> {
    return this.http
      .get<ApiResponse<AgencyRead>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  // استخدام AgencyRead هنا لأن السيرفر بيرجع الكائن اللي اتكريه
  createAgency(formData: FormData): Observable<AgencyRead> {
    return this.http
      .post<ApiResponse<AgencyRead>>(this.apiUrl, formData)
      .pipe(map(res => res.data));
  }

  /* =============================
      UPDATE
  ============================== */
  updateAgency(id: string, formData: FormData): Observable<AgencyRead> {
    return this.http
      .put<ApiResponse<AgencyRead>>(`${this.apiUrl}/${id}`, formData)
      .pipe(map(res => res.data));
  }

  /* =============================
      DELETE
  ============================== */
  deleteAgency(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }
}