import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { baseAPI } from '../../../Environment/env';
import { ApiResponse, Company, CreateCompany } from '../Models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl = baseAPI + '/Company';

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  createCompany(company: Company): Observable<any> {
    return this.http.post<any>(this.baseUrl, company);
  }

    updateCompany(
      id: string,
      payload: CreateCompany
    ): Observable<Company> {
      return this.http
        .put<ApiResponse<Company>>(`${this.baseUrl}/${id}`, payload)
        .pipe(map(res => res.data));
    }

  getCompanyById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/${id}`);
  }

  deleteCompany(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
