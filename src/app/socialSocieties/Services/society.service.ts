import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { baseAPI } from '../../../Environment/env';
import { socialSocieties, ApiResponse, CreateSocialSocieties, socialSocietiesRead } from '../Models/society';

@Injectable({
  providedIn: 'root'
})
export class CenterService {

  private readonly apiUrl = `${baseAPI}/socialSocieties`;

  constructor(private http: HttpClient) { }
  getAllSocialSocieties() {
    return this.http
      .get<ApiResponse<socialSocietiesRead[]>>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  getById(id: string) {
    return this.http
      .get<ApiResponse<socialSocietiesRead>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  createSocialSocieties(formData: FormData): Observable<socialSocieties> {
    return this.http
      .post<ApiResponse<socialSocieties>>(this.apiUrl, formData)
      .pipe(map(res => res.data));
  }
  /* =============================
     UPDATE
     API expects: PUT /Centers/{id}
  ============================== */
  updateSocialSocieties(
    id: string,
    formData: FormData
  ): Observable<socialSocieties> {
    return this.http
      .put<ApiResponse<socialSocieties>>(`${this.apiUrl}/${id}`, formData)
      .pipe(map(res => res.data));
  }

  /* =============================
     DELETE
     API returns: data: true
  ============================== */
  deleteSocialSocieties(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }
}
