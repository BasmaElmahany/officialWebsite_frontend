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

  getAllCompanies(): Observable<CompanyRead[]> {
    return this.http
      .get<ApiResponse<CompanyRead[]>>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  getCompanyById(id: string): Observable<CompanyRead> {
    return this.http
      .get<ApiResponse<CompanyRead>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  createCompany(formData: FormData): Observable<Company> {
    return this.http
      .post<ApiResponse<Company>>(this.apiUrl, formData)
      .pipe(map(res => res.data));
  }

  updateCompany(id: string, formData: FormData): Observable<Company> {
    return this.http
      .put<ApiResponse<Company>>(`${this.apiUrl}/${id}`, formData)
      .pipe(map(res => res.data));
  }

  deleteCompany(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
