import { Injectable } from '@angular/core';
import { ApiResponse, GetNews } from '../../Models/news';
import { baseAPI } from '../../../../Environment/env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly apiUrl = `${baseAPI}/News`;

  constructor(private http: HttpClient) { }

  // جلب كل الأخبار
  getAll(): Observable<ApiResponse<GetNews[]>> {
    return this.http.get<ApiResponse<GetNews[]>>(this.apiUrl);
  }

  // جلب خبر معين بالـ ID
  getById(id: string): Observable<ApiResponse<GetNews>> {
    return this.http.get<ApiResponse<GetNews>>(`${this.apiUrl}/${id}`);
  }

  // جلب الأخبار حسب النوع
  getByTypeId(typeId: number): Observable<ApiResponse<GetNews[]>> {
    return this.http.get<ApiResponse<GetNews[]>>(`${this.apiUrl}/by-type/${typeId}`);
  }

  // جلب أحدث خبر من كل نوع (الذي يظهر في الصور عندك)
  getLatestNewsByType(): Observable<ApiResponse<GetNews[]>> {
    return this.http.get<ApiResponse<GetNews[]>>(`${this.apiUrl}/latestNews`);
  }
}