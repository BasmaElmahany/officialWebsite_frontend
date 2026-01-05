import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseAPI } from '../../../Environment/env';
import { ApiResponse, CreateType, NewsTypes } from '../Models/newTypes';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsTypeService {
private readonly apiUrl = `${baseAPI}/NewsTypes`;

  constructor(private http: HttpClient) { }

  getAllNewsTypes(): Observable<NewsTypes[]> {
    return this.http
      .get<ApiResponse<NewsTypes[]>>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  getbyId(id: string): Observable<NewsTypes> {
    return this.http
      .get<ApiResponse<NewsTypes>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }



  // 🔹 Create
  createNewsType(payload: CreateType): Observable<NewsTypes> {
    return this.http
      .post<ApiResponse<NewsTypes>>(this.apiUrl, payload)
      .pipe(map(res => res.data));
  }


  /* =============================
     UPDATE
     API expects: PUT /NewsTypes/{id}
  ============================== */
  updateNewsType(
    id: number,
    payload: CreateType
  ): Observable<NewsTypes> {
    return this.http
      .put<ApiResponse<NewsTypes>>(`${this.apiUrl}/${id}`, payload)
      .pipe(map(res => res.data));
  }

  /* =============================
     DELETE
     API returns: data: true
  ============================== */
  deleteNewsType(id: number): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }
}
