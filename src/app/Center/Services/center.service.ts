import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Center, ApiResponse, CreateCenter, CenterList, UpdateCenter } from '../Models/center';
import { baseAPI } from '../../../Environment/env';

@Injectable({
  providedIn: 'root'
})
export class CenterService {
  private readonly apiUrl = `${baseAPI}/Centers`;

  constructor(private http: HttpClient) { }

  getAllCenters(): Observable<Center[]> {
    return this.http
      .get<ApiResponse<Center[]>>(this.apiUrl)
      .pipe(map(res => res.data));
  }
  getListCenters(): Observable<CenterList[]> {
    return this.http
      .get<ApiResponse<CenterList[]>>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  getbyId(id: string): Observable<Center> {
    return this.http
      .get<ApiResponse<Center>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }



  // 🔹 Create
  createCenter(payload: CreateCenter) {
    return this.http
      .post<ApiResponse<Center>>(this.apiUrl, payload)
      .pipe(map(res => res.data));
  }


  /* =============================
     UPDATE
     API expects: PUT /Centers/{id}
  ============================== */
  updateCenter(
    id: string,
    payload: UpdateCenter
  ): Observable<Center> {
    return this.http
      .put<ApiResponse<Center>>(`${this.apiUrl}/${id}`, payload)
      .pipe(map(res => res.data));
  }
  /* =============================
     DELETE
     API returns: data: true
  ============================== */
  deleteCenter(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }
}
