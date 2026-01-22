import { Injectable } from '@angular/core';
import { baseAPI } from '../../../Environment/env';
import { ApiResponse, UpperEgyptDevelopment, UpperEgyptDevelopmentRead } from '../Models/upperDev';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpperDevService {
  private readonly apiUrl = `${baseAPI}/UpperDevelopment`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<UpperEgyptDevelopmentRead[]> {
    return this.http
      .get<ApiResponse<UpperEgyptDevelopmentRead[]>>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  getbyId(id: string): Observable<UpperEgyptDevelopmentRead> {
    return this.http
      .get<ApiResponse<UpperEgyptDevelopmentRead>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }



  // 🔹 Create
  create(formData: FormData): Observable<UpperEgyptDevelopmentRead> {
    return this.http
      .post<ApiResponse<UpperEgyptDevelopmentRead>>(this.apiUrl, formData)
      .pipe(map(res => res.data));
  }


  /* =============================
     UPDATE
     API expects: PUT /Centers/{id}
  ============================== */
  update(id: string, data: FormData) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  /* =============================
     DELETE
     API returns: data: true
  ============================== */
  delete(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }
}


