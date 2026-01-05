import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { baseAPI } from '../../../Environment/env';
import { Company, ApiResponse, CreateCompany, CompanyRead } from '../Models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
 private readonly apiUrl = `${baseAPI}/Company`;

  constructor(private http: HttpClient) { }
  getAllCompanies() {
    return this.http
      .get<ApiResponse<CompanyRead[]>>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  getbyId(id: string) {
    return this.http
      .get<ApiResponse<CompanyRead>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  createCompany(formData: FormData): Observable<Company> {
    return this.http
      .post<ApiResponse<Company>>(this.apiUrl, formData)
      .pipe(map(res => res.data));
  }
  /* =============================
     UPDATE
     API expects: PUT /Centers/{id}
  ============================== */
  updateCompany(
    id: string,
    formData: FormData
  ): Observable<Company> {
    return this.http
      .put<ApiResponse<Company>>(`${this.apiUrl}/${id}`, formData)
      .pipe(map(res => res.data));
  }

  /* =============================
     DELETE
     API returns: data: true
  ============================== */
  deleteCompany(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }
}
