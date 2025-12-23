import { Injectable } from '@angular/core';
import { baseAPI } from '../../../Environment/env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, GetGovTours, CreateGovTour } from '../Models/govTours';

@Injectable({
  providedIn: 'root'
})
export class GovtoursService {

  private readonly apiUrl = `${baseAPI}/GovTours`;

  constructor(private http: HttpClient) {}

  // -------------------- GET ALL --------------------
  getAll(): Observable<ApiResponse<GetGovTours[]>> {
    return this.http.get<ApiResponse<GetGovTours[]>>(this.apiUrl);
  }

  // -------------------- GET BY ID --------------------
  getById(id: string): Observable<ApiResponse<GetGovTours>> {
    return this.http.get<ApiResponse<GetGovTours>>(`${this.apiUrl}/${id}`);
  }

  // -------------------- CREATE --------------------
  create(model: CreateGovTour): Observable<ApiResponse<GetGovTours>> {
    const formData = this.buildFormData(model);
    return this.http.post<ApiResponse<GetGovTours>>(this.apiUrl, formData);
  }

  // -------------------- UPDATE --------------------
  update(id: string, model: CreateGovTour): Observable<ApiResponse<boolean>> {
    const formData = this.buildFormData(model);
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}`, formData);
  }

  // -------------------- DELETE --------------------
  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }

  // -------------------- HELPER --------------------
  private buildFormData(model: CreateGovTour): FormData {
    const formData = new FormData();

    formData.append('date', model.date);
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
