import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseAPI } from '../../../Environment/env';
import { Observable } from 'rxjs';
import { ApiResponse, CreateNews, GetNews } from '../Models/news';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly apiUrl = `${baseAPI}/News`;

  constructor(private http: HttpClient) { }

  // -------------------- GET ALL --------------------
  getAll(): Observable<ApiResponse<GetNews[]>> {
    return this.http.get<ApiResponse<GetNews[]>>(this.apiUrl);
  }

  // -------------------- GET BY ID --------------------
  getById(id: string): Observable<ApiResponse<GetNews>> {
    return this.http.get<ApiResponse<GetNews>>(`${this.apiUrl}/${id}`);
  }

  // -------------------- CREATE --------------------
  create(model: CreateNews): Observable<ApiResponse<GetNews>> {
    const formData = this.buildFormData(model);
    return this.http.post<ApiResponse<GetNews>>(this.apiUrl, formData);
  }


  // -------------------- UPDATE --------------------
  update(id: string, model: CreateNews): Observable<ApiResponse<boolean>> {
    const formData = this.buildFormData(model);
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}`, formData);
  }

  // -------------------- DELETE --------------------
  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }

  // -------------------- HELPER --------------------
  private buildFormData(model: CreateNews): FormData {
    const formData = new FormData();

    const date =
      model.date instanceof Date
        ? model.date.toISOString().split('T')[0]
        : model.date;
    formData.append('typeId', model.typeId.toString());
    formData.append('date', date);
    formData.append('titleAr', model.titleAr);
    formData.append('titleEn', model.titleEn);
    formData.append('articleAr', model.articleAr);
    formData.append('articleEn', model.articleEn);

    if (model.photos?.length) {
      model.photos.forEach(file => {
        formData.append('photos', file);
      });
    }

    return formData;
  }
}
